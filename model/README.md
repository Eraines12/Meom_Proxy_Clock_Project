# Model

The documented baseline is a ResNet50 model with four sigmoid outputs for the visible clock-drawing features. Architecture, performance, limitations, and intended use are in the [Model Card](../docs/Model_Card_ResNet50.md).

Saved model weights are not committed because distribution rights and embedded metadata have not been reviewed for release. This educational prototype is not a clinical diagnostic system. This folder contains no files other than this explanatory README.

## Storage approach (verified from the training notebook)

The `.keras` artifact is never written to this GitHub repository. Inspecting `notebooks/EDA_Baseline_Training.ipynb`, the training run:

1. Saves the trained model locally, in the run's own working directory, as `clock_drawing_resnet50_v2.keras`.
2. Creates a new, uniquely named subfolder in Google Drive (named after the run ID, e.g. `resnet50_v2_20260929T232102Z_1e7339`) under a fixed parent "model results" Drive folder referenced by ID in the notebook.
3. Uploads the `.keras` file into that per-run subfolder via the Google Drive API and verifies the upload by comparing MD5 checksums before declaring success.

The completed baseline documented across `docs/Model_Card_ResNet50.md`, `docs/Experiment_Run_Summary.md`, and `docs/Final_Data_Report.md` is run `resnet50_v2_20260929T232102Z_1e7339`; its `.keras` file should exist in that run's Drive subfolder per the mechanism above.

**What is verified:** the upload mechanism and file/folder-naming convention, read directly from the notebook's source code.

**What is not verified, and must be supplied by the team before anyone relies on this section for retrieval:**
- A confirmed, permission-checked share link (or folder ID) to the parent Drive "model results" folder, and confirmation of who currently has access.
- Confirmation that the `resnet50_v2_20260929T232102Z_1e7339` run subfolder — and the `.keras` file inside it — still exists and has not been moved, renamed, or deleted.
- Whether the shared restricted-data pointer in [restricted_data/README.md](../restricted_data/README.md) and the project root README (`https://drive.google.com/drive/folders/1nWsTf1L2GvqZSebXE-V1ljhXtoWJXP53`) is the same Drive location as the model's parent folder, or a separate one — this has not been checked and should not be assumed.

Do not treat any specific Drive link as "the model link" until a team member with Drive access confirms it resolves to the correct run's `.keras` file. Retrieval must go through the team's authorized Drive access; this repository does not and will not contain the model binary or a redistribution copy of it.
