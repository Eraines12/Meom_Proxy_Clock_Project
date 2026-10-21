from io import BytesIO
import os

import numpy as np
from PIL import Image
import pytest
from fastapi.testclient import TestClient

from .preprocessing import prepare_image
from .inference import map_predictions, ResNet50Engine
from .main import create_app, MAX_REQUEST_BYTES


def image_bytes(mode="RGB", color=(20, 40, 60), size=(100, 50), fmt="PNG"):
    buffer = BytesIO()
    Image.new(mode, size, color).save(buffer, format=fmt)
    return buffer.getvalue()


def test_training_pixel_convention_and_letterboxing():
    x = prepare_image(image_bytes(), "image/png")
    assert x.shape == (1, 224, 224, 3) and x.dtype == np.float32
    np.testing.assert_array_equal(x[0, 0, 0], [255, 255, 255])
    np.testing.assert_array_equal(x[0, 112, 112], [20, 40, 60])
    transparent = prepare_image(image_bytes("RGBA", (0, 0, 0, 0)), "image/png")
    assert np.all(transparent == 255)


def test_orientation_matches_notebook():
    image = Image.new("RGB", (100, 50), (0, 0, 0))
    exif = Image.Exif(); exif[274] = 6
    buffer = BytesIO(); image.save(buffer, format="JPEG", exif=exif)
    x = prepare_image(buffer.getvalue(), "image/jpeg")
    assert np.all(x[0, 112, 0] == 255)  # Portrait padding after EXIF rotation.
    assert np.all(x[0, 0, 112] < 5)


def test_reject_corrupt_spoofed_animated_and_oversize_images():
    for data, mime in [(b"broken", "image/png"), (b"", "image/png"),
                       (image_bytes(), "image/jpeg"), (image_bytes(), "image/svg+xml"),
                       (b"x" * (10 * 1024 * 1024 + 1), "image/png")]:
        with pytest.raises(ValueError): prepare_image(data, mime)
    buffer = BytesIO()
    Image.new("RGB", (10, 10), "black").save(buffer, format="PNG", save_all=True,
        append_images=[Image.new("RGB", (10, 10), "white")], duration=100)
    with pytest.raises(ValueError): prepare_image(buffer.getvalue(), "image/png")


def test_output_mapping_does_not_swap_numbers_and_position():
    actual = map_predictions([[0.1, 0.2, 0.3, 0.4]])
    assert actual == dict(closedCircle=0.1, numberPosition=0.2, all12Numbers=0.3, correctHands=0.4)
    for bad in [[[float("nan"), 0, 0, 0]], [[1.1, 0, 0, 0]], [[0, 0, 0]], [0, 0, 0, 0]]:
        with pytest.raises(ValueError): map_predictions(bad)


def test_checkpoint_is_verified_before_deserialization(tmp_path):
    checkpoint = tmp_path / "incorrect.keras"
    checkpoint.write_bytes(b"unverified model")
    with pytest.raises(ValueError, match="checksum mismatch"):
        ResNet50Engine(checkpoint)


class RecordingEngine:
    version = "test-only"
    def predict(self, pixels):
        assert pixels.shape == (1, 224, 224, 3)
        return map_predictions([[0.1, 0.2, 0.3, 0.4]])


def test_api_contract_and_private_static_boundary(monkeypatch):
    monkeypatch.delenv("MINDDIAL_API_TOKEN", raising=False)
    with TestClient(create_app(RecordingEngine)) as client:
        assert client.get("/api/health").json() == {"ready": True}
        response = client.post("/api/analyze", files={"image": ("clock.png", image_bytes(), "image/png")})
        assert response.status_code == 200
        assert response.headers["cache-control"] == "no-store"
        assert response.json()["confidences"]["numberPosition"] == 0.2
        for path in ["/model/Clock_Drawing_ResNet50_Model.keras", "/backend/model_manifest.json", "/restricted_data/README.md"]:
            assert client.get(path).status_code == 404
        assert client.get("/").status_code == 200
        assert client.post("/api/analyze", files={"image": ("bad.png", b"bad", "image/png")}).status_code == 422
        assert client.post("/api/analyze", files={"image": ("clock.png", image_bytes(), "image/png")}, data={"age": "68"}).status_code >= 400
        assert client.post("/api/analyze", content=b"x" * (MAX_REQUEST_BYTES + 1)).status_code == 413


def test_missing_model_and_token_produce_no_score(monkeypatch):
    monkeypatch.setenv("MINDDIAL_API_TOKEN", "test-secret")
    def missing(): raise FileNotFoundError()
    with TestClient(create_app(missing)) as client:
        assert client.get("/api/health").status_code == 401
        response = client.post("/api/analyze", headers={"Authorization": "Bearer test-secret"})
        assert response.status_code == 503 and response.json() == {"detail": "notConnected"}


@pytest.mark.skipif(not os.environ.get("MINDDIAL_MODEL_PATH"), reason="Private checkpoint not configured")
def test_real_checkpoint_api_matches_direct_inference(monkeypatch):
    monkeypatch.delenv("MINDDIAL_API_TOKEN", raising=False)
    engine = ResNet50Engine()
    data = image_bytes()
    expected = engine.predict(prepare_image(data, "image/png"))
    with TestClient(create_app(lambda: engine)) as client:
        response = client.post("/api/analyze", files={"image": ("synthetic.png", data, "image/png")})
        assert response.status_code == 200
        assert response.json()["modelVersion"] == engine.version
        np.testing.assert_allclose(list(response.json()["confidences"].values()), list(expected.values()), atol=1e-6)
