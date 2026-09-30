# src — reusable project code

Functions extracted from the two project notebooks (`notebooks/Data_Preprocessing.ipynb`
and `notebooks/EDA_Baseline_Training.ipynb`) so the documented methodology can be
reused, reviewed, and tested without re-running a notebook end to end.

**Importing any module here performs no I/O.** Loading images, training,
downloading restricted data, and uploading to Google Drive are all separate
functions that must be called explicitly by your own script or notebook.
Nothing in this package runs training, downloads data, or uploads to Drive on
its own, and this repository cleanup does not run any of it either.

## Modules

| Module | Purpose |
| --- | --- |
| `preprocessing.py` | Label validation, EXIF/white-background RGB conversion, Lanczos pad-to-224, the historical deterministic 280/60/60 split, and the two partition loaders used by each notebook (`load_partition_normalized` for the preprocessing notebook's `[0, 1]` arrays; `load_partition_raw_pixels` for the training notebook's raw 0–255 arrays consumed by ResNet50's internal `preprocess_input`). |
| `training.py` | `build_resnet50_baseline()` (frozen ImageNet ResNet50, GAP, dropout 0.30, four sigmoid outputs), `compile_model()` (Adam 0.001, binary cross-entropy, binary accuracy), and `train_model()` (seed 42, batch size 16, 10 epochs — matches the evaluated run). `train_model()` only fits when you call it. |
| `evaluation.py` | `compute_criterion_metrics()` (per-criterion accuracy/precision/recall/F1/confusion counts at threshold 0.50), `summarize_total_score()` (exact-score agreement, within-one-point, MAE), and `build_predictions_table()` matching `test_predictions.csv`'s schema. |
| `drive_sync.py` | Thin wrappers around the Google Drive v3 API used by both notebooks (list folder children, download bytes, upload with MD5 verification, check that a file/folder is not shared publicly). Every function requires an **already-authenticated** `service` client passed in by the caller; none of them authenticate, download, or upload on import. |

## Preserved methodology and parameters

These modules do not change any documented result. They reproduce, in importable
form, exactly what the notebooks already do:

- Historical release: 400 records, deterministic SHA-256(seed=42) ordering, 280/60/60 split.
- Reviewed/evaluated release: 363 records, 254/54/55 split (the score-stratified
  assignment algorithm for that split is documented in
  [docs/Split_Manifest_Summary.md](../docs/Split_Manifest_Summary.md) but is not
  implemented in either supplied notebook, so it is not reproduced here either —
  do not assume `deterministic_historical_split` produces the reviewed split).
- ResNet50 baseline: ImageNet weights, frozen backbone, dropout 0.30, four sigmoid
  outputs, Adam(0.001), binary cross-entropy, batch size 16, 10 epochs, seed 42,
  threshold 0.50.
- Evaluated results this code reproduces the *computation* for (not the values
  themselves, which come from the completed run
  `resnet50_v2_20260929T232102Z_1e7339`): test binary accuracy 79.55%, exact
  total-score agreement 22/55 (40.00%), within-one-point agreement 46/55
  (83.64%), score MAE 0.8182.

## Usage

```python
# Preprocessing (no training, no network access)
from src.preprocessing import to_rgb_with_white_background, pad_to_square, validate_master_labels

image = to_rgb_with_white_background(Path("some_image.tif"))
processed = pad_to_square(image, size=224)

# Building (not training) the documented model
from src.training import build_resnet50_baseline, compile_model
model = compile_model(build_resnet50_baseline())

# Training only happens when you explicitly call train_model with real,
# authorized, locally loaded data:
from src.training import train_model
history = train_model(model, X_train, y_train, X_val, y_val)  # explicit call required

# Evaluation on already-loaded predictions
from src.evaluation import compute_criterion_metrics, summarize_total_score
metrics_table = compute_criterion_metrics(y_test, y_pred)
summary = summarize_total_score(y_test, y_pred, human_total)

# Drive access requires your own authenticated client, passed in explicitly:
from src.drive_sync import list_drive_children
# service = build('drive', 'v3', credentials=credentials, cache_discovery=False)
files = list_drive_children(service, folder_id="...")  # explicit call required
```

## Dependencies

Training and inference require TensorFlow/Keras; preprocessing and evaluation
alone do not. Install what you need:

```
numpy
pandas
pillow
scikit-learn
tensorflow>=2.20        # only needed for src/training.py and model inference
google-api-python-client  # only needed for src/drive_sync.py
google-auth                # only needed for src/drive_sync.py outside Colab
```

See [`requirements.txt`](requirements.txt) for a pinned-range list covering all
modules. In Google Colab, `tensorflow`, `google-api-python-client`, and
`google-auth` are preinstalled; only `pip install` anything missing.

## What this code does **not** do

- It does not include or download the restricted dataset (raw/processed images,
  master evaluation workbook, or split manifests). See
  [restricted_data/README.md](../restricted_data/README.md) and
  [Dataset/README.md](../Dataset/README.md).
- It does not include or fetch the trained `.keras` model. See
  [model/README.md](../model/README.md).
- It does not run training, data downloads, or Drive uploads as part of this
  repository cleanup, and importing these modules cannot trigger any of that
  by accident.
