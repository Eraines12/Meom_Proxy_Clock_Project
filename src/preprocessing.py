"""Reusable preprocessing helpers extracted from notebooks/Data_Preprocessing.ipynb
and notebooks/EDA_Baseline_Training.ipynb.

These functions preserve the original methodology and parameters exactly:
- Historical deterministic 280/60/60 split over 400 records (SHA-256 ordering,
  seed 42) as implemented in the preprocessing notebook.
- EXIF-orientation-corrected, white-background RGBA-to-RGB conversion.
- Lanczos resize onto a white 224x224 canvas.
- Two partition loaders matching each notebook's own array convention:
  the preprocessing notebook divides by 255 (float32 in [0, 1]); the
  training notebook keeps raw 0-255 float32 pixels because ResNet50's
  ``preprocess_input`` is applied inside the model graph.

Importing this module performs no file I/O. Every function below is called
explicitly by the caller; none of it runs at import time.
"""
from __future__ import annotations

import hashlib
from pathlib import Path
from typing import Dict, Iterable, Sequence

import numpy as np
import pandas as pd
from PIL import Image, ImageOps

# Human-labeled feature columns, in the order used throughout the project.
LABEL_COLUMNS = [
    "Closed_Circle",
    "Number_correct_Position",
    "Includes_all_12_correct_Numbers",
    "Places_Hands_in_correct_positions",
]

# Display names matching docs/Model_Card_ResNet50.md and results/ tables.
CRITERION_DISPLAY_NAMES = [
    "Closed Circle",
    "Correct Number Position",
    "All 12 Numbers",
    "Correct Hands",
]

IMAGE_SIZE = (224, 224)
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".tif", ".tiff", ".webp"}


def sha256_file(path: Path) -> str:
    """Stream-hash a file's raw bytes (matches the notebook's sha256_file)."""
    digest = hashlib.sha256()
    with Path(path).open("rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def to_rgb_with_white_background(path: Path) -> Image.Image:
    """Open an image, correct EXIF orientation, and flatten transparency onto white.

    Mirrors ``rgb_image`` in notebooks/Data_Preprocessing.ipynb. Raises on
    multi-frame images (e.g. animated formats), matching the notebook's guard.
    """
    with Image.open(path) as source:
        if getattr(source, "n_frames", 1) != 1:
            raise ValueError(f"Multiple frames not supported: {path.name}")
        source.load()
        oriented = ImageOps.exif_transpose(source)
        rgba = oriented.convert("RGBA")
        background = Image.new("RGBA", rgba.size, (255, 255, 255, 255))
        return Image.alpha_composite(background, rgba).convert("RGB")


def pixel_hash(image: Image.Image) -> str:
    """SHA-256 over an image's size + raw pixel bytes, used for duplicate detection."""
    return hashlib.sha256(str(image.size).encode() + image.tobytes()).hexdigest()


def pad_to_square(image: Image.Image, size: int = IMAGE_SIZE[0]) -> Image.Image:
    """Lanczos-resize and center-pad an RGB image onto a white square canvas."""
    return ImageOps.pad(
        image,
        (size, size),
        method=Image.Resampling.LANCZOS,
        color=(255, 255, 255),
        centering=(0.5, 0.5),
    )


def validate_master_labels(
    labels: pd.DataFrame,
    expected_ids: Iterable[str],
    label_columns: Sequence[str] = LABEL_COLUMNS,
) -> pd.DataFrame:
    """Validate a label manifest against the project's data contract.

    Mirrors the assertions in notebooks/Data_Preprocessing.ipynb: unique
    Image_ID values matching ``expected_ids``, binary label columns, and
    Human_Total equal to the row-wise label sum. Raises ``ValueError`` with
    a descriptive message instead of asserting, so callers can handle it.
    Returns the manifest sorted by Image_ID.
    """
    expected_ids = set(expected_ids)
    working = labels.dropna(how="all").copy()
    working["Image_ID"] = working["Image_ID"].astype(str).str.strip()
    if len(working) != len(expected_ids) or not working["Image_ID"].is_unique:
        raise ValueError("Missing or duplicate label rows.")
    if set(working["Image_ID"]) != expected_ids:
        raise ValueError("Label IDs do not match the expected set.")
    if not working[label_columns].isin([0, 1]).all().all():
        raise ValueError("Missing or non-binary human label.")
    if working["Human_Total"].isna().any():
        raise ValueError("Missing cached Human_Total value.")
    if not (working[label_columns].sum(axis=1) == working["Human_Total"]).all():
        raise ValueError("Human_Total does not equal the sum of label columns.")
    return working.sort_values("Image_ID").reset_index(drop=True)


def deterministic_historical_split(
    image_ids: Iterable[str],
    seed: int = 42,
    counts: Sequence[int] = (280, 60, 60),
) -> Dict[str, str]:
    """Reproduce the historical fixed-order train/validation/test assignment.

    Matches notebooks/Data_Preprocessing.ipynb: image IDs are ordered by
    ``sha256(f"{seed}:{image_id}")`` and the first ``counts[0]`` become
    train, the next ``counts[1]`` become validation, and the remainder
    become test. Defaults reproduce the historical 400-record, 280/60/60
    split; this is distinct from the reviewed 254/54/55 release (see
    docs/Split_Manifest_Summary.md for that score-stratified method, which
    is not implemented in either supplied notebook).
    """
    train_n, validation_n, _ = counts
    ordered = sorted(
        image_ids,
        key=lambda s: (hashlib.sha256(f"{seed}:{s}".encode()).hexdigest(), s),
    )
    assignment: Dict[str, str] = {}
    for index, image_id in enumerate(ordered):
        if index < train_n:
            assignment[image_id] = "train"
        elif index < train_n + validation_n:
            assignment[image_id] = "validation"
        else:
            assignment[image_id] = "test"
    return assignment


def save_processed_png(image: Image.Image, target: Path) -> Path:
    """Atomically save a processed RGB image as PNG (write-to-temp then replace)."""
    target = Path(target)
    temporary = target.with_suffix(".tmp")
    image.save(temporary, format="PNG")
    temporary.replace(target)
    return target


def load_partition_normalized(
    manifest: pd.DataFrame,
    split_name: str,
    project_root: Path,
    label_columns: Sequence[str] = LABEL_COLUMNS,
):
    """Load one split as float32 arrays scaled to [0, 1].

    Mirrors ``load_partition`` in notebooks/Data_Preprocessing.ipynb. Returns
    ``(X, y, y_total, image_ids)``. Use this convention only when the
    downstream model expects pre-scaled [0, 1] input (the preprocessing
    notebook's handoff arrays); the training notebook uses raw pixel values
    instead (see ``load_partition_raw_pixels``).
    """
    if split_name not in {"train", "validation", "test"}:
        raise ValueError("split_name must be train, validation, or test")
    rows = manifest.loc[manifest["split"] == split_name].sort_values("Image_ID")
    arrays = []
    for relative_path in rows["processed_image_path"]:
        with Image.open(Path(project_root) / relative_path) as image:
            if image.mode != "RGB" or image.size != IMAGE_SIZE:
                raise ValueError(f"Unexpected image mode/size: {relative_path}")
            arrays.append(np.asarray(image, dtype=np.float32) / np.float32(255.0))
    X = np.stack(arrays)
    y = rows[label_columns].to_numpy(dtype=np.float32)
    y_total = rows["Human_Total"].to_numpy(dtype=np.float32)
    return X, y, y_total, rows["Image_ID"].to_numpy()


def load_partition_raw_pixels(
    manifest: pd.DataFrame,
    split_name: str,
    images_dir: Path,
    label_columns: Sequence[str] = LABEL_COLUMNS,
):
    """Load one split as raw 0-255 float32 arrays (no external scaling).

    Mirrors ``load_split`` in notebooks/EDA_Baseline_Training.ipynb, where
    ResNet50's own ``preprocess_input`` is applied inside the model, so the
    loader must not divide by 255 externally. Returns ``(rows, X, y)``.
    """
    part = manifest.loc[manifest["split"] == split_name].sort_values("Image_ID")
    images_dir = Path(images_dir)
    X = np.stack(
        [
            np.asarray(Image.open(images_dir / f"{image_id}.png"), dtype=np.float32)
            for image_id in part["Image_ID"]
        ]
    )
    y = part[label_columns].to_numpy(dtype=np.float32)
    return part, X, y
