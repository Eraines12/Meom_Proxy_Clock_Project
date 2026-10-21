"""Same-origin frontend + real inference. Run from the repository root."""
import asyncio
from contextlib import asynccontextmanager
import os
from pathlib import Path
import secrets

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from starlette.concurrency import run_in_threadpool
from starlette.datastructures import UploadFile

from .inference import ResNet50Engine
from .preprocessing import MAX_IMAGE_BYTES, prepare_image

MAX_REQUEST_BYTES = MAX_IMAGE_BYTES + 65536


class BodyLimit:
    """Bound even chunked requests before multipart parsing can buffer/spool."""
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http" or scope["method"] != "POST":
            return await self.app(scope, receive, send)
        body = bytearray()
        while True:
            message = await receive()
            if message["type"] == "http.disconnect":
                return
            body.extend(message.get("body", b""))
            if len(body) > MAX_REQUEST_BYTES:
                return await JSONResponse({"detail": "Image too large"}, 413)(scope, receive, send)
            if not message.get("more_body", False):
                break
        delivered = False

        async def replay():
            nonlocal delivered
            if not delivered:
                delivered = True
                return {"type": "http.request", "body": bytes(body), "more_body": False}
            return await receive()
        await self.app(scope, replay, send)


def create_app(engine_factory=ResNet50Engine):
    @asynccontextmanager
    async def lifespan(app):
        try:
            app.state.engine = await run_in_threadpool(engine_factory)
        except Exception:
            # Missing/unloadable weights must never produce a made-up score.
            app.state.engine = None
        app.state.inference_lock = asyncio.Lock()
        yield
        app.state.engine = None

    app = FastAPI(lifespan=lifespan, docs_url=None, redoc_url=None, openapi_url=None)
    app.add_middleware(BodyLimit)

    @app.middleware("http")
    async def private_responses(request, call_next):
        token = os.environ.get("MINDDIAL_API_TOKEN", "")
        if request.url.path.startswith("/api/") and token:
            if not secrets.compare_digest(request.headers.get("authorization", ""), "Bearer " + token):
                return JSONResponse({"detail": "Unauthorized"}, 401, headers={"Cache-Control": "no-store"})
        response = await call_next(request)
        response.headers["Cache-Control"] = "no-store"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Referrer-Policy"] = "no-referrer"
        return response

    @app.get("/api/health")
    async def health():
        ready = app.state.engine is not None
        return JSONResponse({"ready": ready}, status_code=200 if ready else 503)

    @app.post("/api/analyze")
    async def analyze(request: Request):
        engine = app.state.engine
        if engine is None:
            return JSONResponse({"detail": "notConnected"}, 503)
        if app.state.inference_lock.locked():
            return JSONResponse({"detail": "Analysis busy. Try again."}, 429)
        async with app.state.inference_lock:
            try:
                async with request.form(max_files=1, max_fields=0) as form:
                    parts = list(form.multi_items())
                    if len(parts) != 1 or parts[0][0] != "image" or not isinstance(parts[0][1], UploadFile):
                        raise ValueError("Expected only an image")
                    upload = parts[0][1]
                    data = await upload.read(MAX_IMAGE_BYTES + 1)
                    pixels = await run_in_threadpool(prepare_image, data, upload.content_type)
                confidences = await run_in_threadpool(engine.predict, pixels)
                return {"modelVersion": engine.version, "confidences": confidences}
            except ValueError:
                return JSONResponse({"detail": "Invalid image or model output"}, 422)
            except Exception:
                return JSONResponse({"detail": "Analysis unavailable"}, 503)

    # Only the public app folder is exposed. Weights and source data cannot be served.
    app.mount("/", StaticFiles(directory=Path(__file__).resolve().parents[1] / "app", html=True), name="frontend")
    return app


app = create_app()
