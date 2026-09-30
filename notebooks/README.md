# Notebooks

The project used preprocessing and EDA/baseline-training notebooks. Their documented roles are described in the [Final Data Report](../docs/Final_Data_Report.md) and [Experiment Run Summary](../docs/Experiment_Run_Summary.md).

| Notebook | Role |
| --- | --- |
| [Data_Preprocessing.ipynb](Data_Preprocessing.ipynb) | Historical 400-record acquisition/cleaning/preprocessing and the fixed 280/60/60 split (seed 42); produces `processed_images/` and `splits/dataset_split.csv` in the team's Google Drive project. |
| [EDA_Baseline_Training.ipynb](EDA_Baseline_Training.ipynb) | Reviewed-release retraining: re-verifies all 400 raw drawings against the reviewed 363-record candidate manifest, trains the evaluated ResNet50 baseline (254/54/55 split, 10 epochs, seed 42), evaluates on the 55-record test split, and uploads results/model to Drive. |

Both notebooks are committed with **saved cells and markdown preserved, but with all outputs cleared and execution counts reset to null**. Neither notebook has been run as part of this repository cleanup. Both notebooks read restricted images, labels, and manifests from Google Drive at run time via explicit, user-triggered cells (Drive authentication, file upload, or file download); none of that happens merely by opening or importing the notebook. Reusable, import-safe extractions of their logic live in [`src/`](../src/) for use outside a notebook. See [restricted_data/README.md](../restricted_data/README.md) for how to obtain the data these notebooks expect, and [model/README.md](../model/README.md) for the trained model's storage location.
