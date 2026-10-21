"""Single-image inference preparation matched to the saved baseline notebooks."""
from io import BytesIO
import warnings

import numpy as np
from PIL import Image, ImageOps, UnidentifiedImageError

MAX_IMAGE_BYTES = 10 * 1024 * 1024
MAX_PIXELS = 40_000_000
FORMATS = {"image/jpeg": "JPEG", "image/png": "PNG", "image/webp": "WEBP"}


def prepare_image(data: bytes, content_type: str) -> np.ndarray:
    """Return (1,224,224,3) float32 RGB, raw 0–255; graph preprocesses once.

    Mirrors rgb_image/ImageOps.pad in Data_Preprocessing.ipynb and the
    raw-pixel loader in the executed EDA_Baseline_Training.ipynb.
    No external preprocess_input, divide-by-255, crop, or thresholding.
    """
    if content_type not in FORMATS or not 0 < len(data) <= MAX_IMAGE_BYTES:
        raise ValueError("Invalid image type or size")
    try:
        with warnings.catch_warnings():
            warnings.simplefilter("error", Image.DecompressionBombWarning)
            with Image.open(BytesIO(data)) as source:
                if (source.format != FORMATS[content_type] or
                        getattr(source, "n_frames", 1) != 1 or
                        source.width * source.height > MAX_PIXELS):
                    raise ValueError("Invalid image format or dimensions")
                source.load()
                rgba = ImageOps.exif_transpose(source).convert("RGBA")
                white = Image.new("RGBA", rgba.size, (255, 255, 255, 255))
                rgb = Image.alpha_composite(white, rgba).convert("RGB")
                prepared = ImageOps.pad(rgb, (224, 224),
                    method=Image.Resampling.LANCZOS, color=(255, 255, 255),
                    centering=(0.5, 0.5))
                return np.asarray(prepared, dtype=np.float32)[None, ...]
    except (UnidentifiedImageError, OSError, Image.DecompressionBombError,
            Image.DecompressionBombWarning) as error:
        raise ValueError("Image could not be decoded") from error
