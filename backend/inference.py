"""Load only the pinned, trained baseline. No ImageNet-only fallback."""
import hashlib
import json
import os
from pathlib import Path

import numpy as np

MANIFEST_PATH = Path(__file__).with_name("model_manifest.json")
# Training order differs from the UI order: position precedes all-12-numbers.
OUTPUT_KEYS = ("closedCircle", "numberPosition", "all12Numbers", "correctHands")


def load_manifest():
    return json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))


def sha256_file(path):
    digest = hashlib.sha256()
    with Path(path).open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def map_predictions(prediction):
    values = np.asarray(prediction)
    if (values.shape != (1, 4) or not np.isfinite(values).all() or
            (values < 0).any() or (values > 1).any()):
        raise ValueError("Invalid model output")
    return dict(zip(OUTPUT_KEYS, map(float, values[0])))


class ResNet50Engine:
    def __init__(self, path=None):
        manifest = load_manifest()
        path = Path(path or os.environ.get("MINDDIAL_MODEL_PATH", "model/Clock_Drawing_ResNet50_Model.keras"))
        if sha256_file(path) != manifest["sha256"]:
            raise ValueError("Checkpoint checksum mismatch")
        import tensorflow as tf
        self.model = tf.keras.models.load_model(path, compile=False, safe_mode=True)
        if tuple(self.model.input_shape) != (None, 224, 224, 3) or tuple(self.model.output_shape) != (None, 4):
            raise ValueError("Unexpected checkpoint shape")
        self.version = manifest["modelVersion"]
        # Validate inference at startup; never return this warmup as a user score.
        self.predict(np.full((1, 224, 224, 3), 255, dtype=np.float32))

    def predict(self, pixels):
        return map_predictions(self.model(pixels, training=False).numpy())
