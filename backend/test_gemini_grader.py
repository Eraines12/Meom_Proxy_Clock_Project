"""Mocked tests for the experimental Gemini scorer, plus one opt-in live test.

Run mocked:  python -m pytest backend
Run live:    set MINDDIAL_LIVE_GEMINI=1, GEMINI_API_KEY and MINDDIAL_GEMINI_MODEL, then
             python -m pytest backend/test_gemini_grader.py -k live -s
"""
import asyncio
import base64
import json
import os
from io import BytesIO
from pathlib import Path

import httpx
import pytest
from fastapi.testclient import TestClient
from PIL import Image

from . import gemini_grader as gg
from .main import create_app
from .preprocessing import sanitized_png

DATA = Path(__file__).parent / "test_data"
EXPECTED = json.loads((DATA / "expected.json").read_text())
MODEL = "gemini-test-model"


def fixture_png(name):
    return sanitized_png((DATA / f"{name}.png").read_bytes(), "image/png")


def model_payload(decisions, reason="Visible detail."):
    return {k: {"decision": decisions[k], "visual_reason": reason} for k in gg.CRITERIA}


def envelope(text):
    return {"id": "x", "status": "completed", "steps": [
        {"type": "thought", "signature": "s"},
        {"type": "model_output", "content": [{"type": "text", "text": text}]}]}


def transport_returning(body, status=200, seen=None):
    def handler(request):
        if seen is not None:
            seen.append(request)
        return httpx.Response(status, json=body)
    return httpx.MockTransport(handler)


def grade(png, transport):
    return asyncio.run(gg.grade_clock(png, api_key="test-key", model=MODEL, transport=transport))


@pytest.mark.parametrize("clock", ["clock-06", "clock-07", "clock-08"])
def test_mocked_fixture_scores_match_expected_totals(clock):
    expected = EXPECTED[clock]
    reply = model_payload(expected)
    reply["total_score"] = 4  # a model-supplied total must be ignored
    result = grade(fixture_png(clock), transport_returning(envelope(json.dumps(reply))))
    assert result["scorer"] == "gemini" and result["modelVersion"] == MODEL
    assert result["totalScore"] == expected["total"] and result["needsReview"] is False
    assert {c["key"]: c["decision"] for c in result["criteria"]} == {k: expected[k] for k in gg.CRITERIA}


def test_known_totals():
    assert [EXPECTED[c]["total"] for c in ("clock-06", "clock-07", "clock-08")] == [3, 1, 2]


def test_unsure_needs_review_and_leaves_total_pending():
    decisions = dict(EXPECTED["clock-06"], correctHands="Unsure")
    result = grade(fixture_png("clock-06"), transport_returning(envelope(json.dumps(model_payload(decisions)))))
    assert result["needsReview"] is True and result["totalScore"] is None
    assert [c["decision"] for c in result["criteria"]].count("Unsure") == 1


def test_request_is_one_clean_image_without_fixture_answers_or_demographics():
    seen = []
    grade(fixture_png("clock-06"), transport_returning(
        envelope(json.dumps(model_payload(EXPECTED["clock-06"]))), seen=seen))
    request = seen[0]
    body = json.loads(request.content)
    assert request.headers["x-goog-api-key"] == "test-key" and body["store"] is False
    images = [p for p in body["input"] if p["type"] == "image"]
    assert len(images) == 1 and body["model"] == MODEL
    Image.open(BytesIO(base64.b64decode(images[0]["data"]))).verify()
    text = request.content.decode().lower()
    for word in ("age", "education", "demograph", "expected", "clock-06", "3/4"):
        assert word not in json.dumps({k: v for k, v in body.items() if k != "input"}).lower() or word == "age"
    assert "clock-06" not in text and "expected" not in text
    assert body["response_format"]["schema"]["required"] == list(gg.CRITERIA)


def test_sanitized_png_strips_metadata():
    source = Image.new("RGB", (40, 30), "white")
    exif = Image.Exif(); exif[0x010E] = "private description"; exif[0x8825] = {1: "N"}
    buffer = BytesIO(); source.save(buffer, format="JPEG", exif=exif)
    cleaned = sanitized_png(buffer.getvalue(), "image/jpeg")
    image = Image.open(BytesIO(cleaned))
    assert image.format == "PNG" and not image.info and len(image.getexif()) == 0
    assert b"private description" not in cleaned


@pytest.mark.parametrize("text", [
    "not json", "[]", "{}", json.dumps({k: {"decision": "Maybe", "visual_reason": "x"} for k in gg.CRITERIA}),
    json.dumps({**model_payload(EXPECTED["clock-06"]), "closedCircle": {"decision": "pass", "visual_reason": "x"}}),
    json.dumps({**model_payload(EXPECTED["clock-06"]), "correctHands": {"decision": "Pass", "visual_reason": "  "}}),
    json.dumps({**model_payload(EXPECTED["clock-06"]), "correctHands": {"decision": "Pass", "visual_reason": 5}}),
    json.dumps({k: v for k, v in model_payload(EXPECTED["clock-06"]).items() if k != "all12Numbers"}),
])
def test_malformed_model_output_is_rejected(text):
    with pytest.raises(gg.GeminiError) as error:
        grade(fixture_png("clock-06"), transport_returning(envelope(text)))
    assert error.value.code == "geminiInvalidResponse"


@pytest.mark.parametrize("body", [{}, {"steps": "x"}, {"steps": [{"type": "thought"}]}, ["not", "an", "object"]])
def test_malformed_envelope_is_rejected(body):
    with pytest.raises(gg.GeminiError) as error:
        grade(fixture_png("clock-06"), transport_returning(body))
    assert error.value.code == "geminiInvalidResponse"


def test_timeouts_and_http_failures_are_unavailable():
    def slow(request):
        raise httpx.ReadTimeout("slow", request=request)
    for transport in (httpx.MockTransport(slow), transport_returning({"error": "key=secret"}, status=500),
                      transport_returning({}, status=429)):
        with pytest.raises(gg.GeminiError) as error:
            grade(fixture_png("clock-06"), transport)
        assert error.value.code == "geminiUnavailable"


def test_reasons_are_trimmed_and_control_characters_removed():
    reply = model_payload(EXPECTED["clock-06"], reason="line\x00one\n<b>two</b> " + "x" * 1000)
    result = grade(fixture_png("clock-06"), transport_returning(envelope(json.dumps(reply))))
    reason = result["criteria"][0]["visualReason"]
    assert "\x00" not in reason and "\n" not in reason and len(reason) <= gg.MAX_REASON_CHARS


def test_config_requires_key_and_valid_model():
    assert gg.get_config({}) is None
    assert gg.get_config({"GEMINI_API_KEY": "k"}) is None
    assert gg.get_config({"GEMINI_API_KEY": "k", "MINDDIAL_GEMINI_MODEL": "bad model!"}) is None
    assert gg.get_config({"GEMINI_API_KEY": "k", "MINDDIAL_GEMINI_MODEL": "gemini-3.8-flash"}) == ("k", "gemini-3.8-flash")


class FakeEngine:
    version = "default-test"
    def predict(self, pixels):
        return {"closedCircle": 1, "all12Numbers": 1, "numberPosition": 1, "correctHands": 1}


def post(client, url="/api/analyze", name="clock-06", extra=None):
    return client.post(url, files={"image": ("clock.png", (DATA / f"{name}.png").read_bytes(), "image/png")},
                       data=extra or None)


def configure(monkeypatch, on=True):
    for key, value in (("GEMINI_API_KEY", "test-key"), ("MINDDIAL_GEMINI_MODEL", MODEL)):
        monkeypatch.setenv(key, value) if on else monkeypatch.delenv(key, raising=False)


def test_endpoint_gemini_result_and_default_unchanged(monkeypatch):
    configure(monkeypatch)
    transport = transport_returning(envelope(json.dumps(model_payload(EXPECTED["clock-07"]))))
    with TestClient(create_app(FakeEngine, gemini_transport=transport)) as client:
        assert client.get("/api/scorers").json() == {"default": True, "gemini": True}
        gemini = post(client, "/api/analyze?scorer=gemini")
        assert gemini.status_code == 200 and gemini.json()["totalScore"] == 1
        default = post(client)
        assert default.json()["modelVersion"] == "default-test" and "scorer" not in default.json()
        assert post(client, "/api/analyze?scorer=default").status_code == 200
        assert post(client, "/api/analyze?scorer=other").status_code == 422
        assert post(client, "/api/analyze?scorer=gemini", extra={"age": "70"}).status_code == 422


def test_endpoint_gemini_unconfigured_is_disabled(monkeypatch):
    configure(monkeypatch, on=False)
    with TestClient(create_app(FakeEngine)) as client:
        assert client.get("/api/scorers").json()["gemini"] is False
        response = post(client, "/api/analyze?scorer=gemini")
        assert response.status_code == 503 and response.json() == {"detail": "geminiNotConfigured"}
        assert post(client).status_code == 200


def test_endpoint_gemini_errors_are_clear_and_leak_nothing(monkeypatch):
    configure(monkeypatch)
    def timeout(request):
        raise httpx.ConnectTimeout("t", request=request)
    cases = [(httpx.MockTransport(timeout), 503, "geminiUnavailable"),
             (transport_returning(envelope("garbage")), 502, "geminiInvalidResponse")]
    for transport, status, detail in cases:
        with TestClient(create_app(FakeEngine, gemini_transport=transport)) as client:
            response = post(client, "/api/analyze?scorer=gemini")
            assert (response.status_code, response.json()) == (status, {"detail": detail})
            assert "test-key" not in response.text


def test_endpoint_gemini_unsure_leaves_total_pending(monkeypatch):
    configure(monkeypatch)
    decisions = dict(EXPECTED["clock-08"], closedCircle="Unsure")
    transport = transport_returning(envelope(json.dumps(model_payload(decisions))))
    with TestClient(create_app(FakeEngine, gemini_transport=transport)) as client:
        body = post(client, "/api/analyze?scorer=gemini", name="clock-08").json()
    assert body["needsReview"] is True and body["totalScore"] is None


LIVE = os.environ.get("MINDDIAL_LIVE_GEMINI") == "1" and gg.get_config() is not None


@pytest.mark.skipif(not LIVE, reason="opt-in: set MINDDIAL_LIVE_GEMINI=1, GEMINI_API_KEY, MINDDIAL_GEMINI_MODEL")
def test_live_gemini_on_synthetic_fixtures():
    """Reports observed results; only an unreachable or structurally invalid response fails."""
    key, model = gg.get_config()
    rows = []
    for clock, expected in EXPECTED.items():
        result = asyncio.run(gg.grade_clock(fixture_png(clock), api_key=key, model=model))
        observed = {c["key"]: c["decision"] for c in result["criteria"]}
        rows.append({"clock": clock, "model": model, "expected_total": expected["total"],
                     "observed_total": result["totalScore"], "needsReview": result["needsReview"],
                     "observed": observed,
                     "mismatches": [k for k in gg.CRITERIA if observed[k] != expected[k]],
                     "reasons": {c["key"]: c["visualReason"] for c in result["criteria"]}})
    print("\nLIVE GEMINI RESULTS\n" + json.dumps(rows, indent=2))
    (DATA / "live_results.json").write_text(json.dumps(rows, indent=2))
