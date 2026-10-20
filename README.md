# 🧠 MindDial AI

> AI-Assisted Clock Drawing Cognitive Screening

## 🌐 Live App

👉 **[Launch MindDial AI](https://mind-dial.netlify.app)**

MindDial AI is an educational AI-assisted clock-drawing screening-support prototype designed to evaluate four visible clock-drawing criteria and produce a 0–4 feature score.

**The Netlify application above is the primary public demo of this project.** The notebooks in [`notebooks/`](notebooks/) are development and model-training evidence — they are no longer the main demo. **The live app's interface, accessibility, and decision system are fully built, but no real AI model is connected yet** — see [Current AI Model](#current-ai-model) for what the app shows today instead of a score.

> **MindDial AI does not diagnose Alzheimer's disease, dementia, or any other medical condition, and is not a substitute for professional evaluation.** See [Medical Disclaimer](#medical-disclaimer).

## About MindDial AI

This repository, formerly tracked as `Meom_Proxy_Clock_Project`, is the GitHub home for **MindDial AI**: the live web app, the AI model research, the training notebooks, and the evaluation docs behind it. Scoring is based on the four-point method from [Palsetia et al. (2018)](https://pmc.ncbi.nlm.nih.gov/articles/PMC5795671/). **Full app details: [`app/README.md`](app/README.md).**

| Part | Where |
| --- | --- |
| Live web app | [`app/`](app/) |
| AI model / research code | [`model/`](model/), [`src/`](src/) |
| Training notebooks | [`notebooks/`](notebooks/) |
| Evaluation & docs | [`docs/`](docs/), [`results/`](results/) |

## How It Works

| Step | Status |
| --- | --- |
| Choose language, accessibility settings | ✅ Implemented |
| Demographic form | ✅ Implemented — never sent to the model |
| Upload clock drawing | ✅ Implemented — preview, replace, remove |
| Image quality check | ⏳ Not implemented — shows "Not checked" |
| AI analyzes 4 criteria → PASS/FAIL/NEEDS REVIEW → 0–4 score | ⏳ Pending a connected backend — shows "AI model connection pending" |
| Age-group context, result explanation, brain-health info, AI assistant | 📋 Planned |

The app ([source](app/), deployed at [mind-dial.netlify.app](https://mind-dial.netlify.app)) fully implements setup, accessibility, demographics, and upload. **No simulated or demo scores are shown** — until a real backend is connected, results read "AI model connection pending" and quality checks read "Not checked." See [Current AI Model](#current-ai-model) and [`app/INFERENCE.md`](app/INFERENCE.md) for what's still needed.

## Four Scoring Criteria

MindDial AI predicts four visible clock-drawing features. Each predicted feature contributes **1 point**, for a final feature score of **0–4**:

1. **Closed Circle** — the clock face is a single closed loop
2. **All 12 Numbers** — all twelve numbers (1–12) are present
3. **Correct Number Position** — numbers are placed in roughly correct clock positions
4. **Correct Clock Hands** — two hands are present and point to a plausible time

The 0–4 score is a **feature count, not a diagnostic score or percentage risk** — it reflects how many of the four visible drawing features the model detected, nothing more.

## Current AI Model

The **trained research baseline** is a **ResNet50** convolutional network (`resnet50_v2_20260929T232102Z_1e7339`) with a frozen ImageNet backbone, trained for 10 epochs with no augmentation or fine-tuning, documented in the [Model Card](docs/Model_Card_ResNet50.md). This research model is **separate from the live app and is NOT connected to it yet.**

The live app's `app/analysis.js` defines an `analyzeClockDrawing(file)` adapter with a deployment-only `endpoint` setting that ships **empty by default**. With no endpoint configured, the app makes no network request at all and shows **"AI model connection pending — no score has been generated"** — there is no fallback, simulated, or demo score. Connecting the real model requires deploying an inference service behind a same-origin endpoint (see [`app/INFERENCE.md`](app/INFERENCE.md)) that:

- loads the trained ResNet50 checkpoint,
- applies the exact training preprocessing (orientation, crop, size, normalization),
- returns a JSON response with a non-empty `modelVersion` string and four `confidences` values in `[0, 1]` (one per criterion, matching the documented key order), and
- is verified end-to-end against held-out data, including open-circle cases, before any performance claim is made about the live app.

Until that service exists, the `app/` folder is a fully functional **interface and decision-system shell** with no live scoring.

## Current Performance

These results describe the **offline research baseline** evaluated in `notebooks/` and `docs/`, not a live scoring run — the deployed app does not generate scores yet (see [Current AI Model](#current-ai-model)). The project began with **400 original image records**. The evaluated release contains **363 reviewed records** (25 conflicting-label records and 12 redundant copies excluded), split **254 / 54 / 55** for train/validation/test. The held-out baseline reports:

- **79.55%** test binary accuracy
- **40.00%** exact total-score agreement (22/55)
- **83.64%** within-one-point agreement (46/55)
- **0.8182** score MAE (mean absolute error)

These are **internal results from 55 test records, not external or clinical validation**. See the [Evaluation Report](docs/Evaluation_Report.md) and [aggregate result tables](results/) for full interpretation.

<p align="center">
  <a href="results/"><img src="results/held_out_performance.png" alt="Held-out feature performance chart" width="48%"></a>
  <a href="results/"><img src="results/training_history.png" alt="Training history chart" width="48%"></a>
</p>

Two dataset states exist in project history and are not interchangeable: the **historical preprocessing output** (400 records, 280/60/60 split, from `notebooks/Data_Preprocessing.ipynb`) and the **reviewed/evaluated release** (363 records, 254/54/55 split, after an additional duplicate/conflicting-label review pass) actually used above. Original labels for all 400 records are preserved unchanged. See [`docs/Split_Manifest_Summary.md`](docs/Split_Manifest_Summary.md) and [`docs/Final_Data_Report.md`](docs/Final_Data_Report.md) for the full review methodology.

## Known Model Limitations

- **Open-circle false positives:** the current baseline has sometimes classified an obviously open circle as **"Closed Circle: PASS."** Reducing this specific failure mode is a primary goal of the [Model Improvement Roadmap](docs/Model_Improvement_Roadmap.md).
- **Small, single-source test set:** performance is measured on only 55 held-out records from one reported source, not an external or multi-site validation set.
- **No clinical validation:** the 0–4 score has not been validated against clinical diagnoses, cognitive assessments, or outcomes of any kind.
- **Thresholds are not yet validated:** the team is planning to test stricter per-criterion thresholds — for example, requiring **90% model confidence** for Closed Circle — **without claiming that 90% (or any other value) is already a validated or final threshold.** See [MindDial Decision System](#minddial-decision-system).

## MindDial Decision System

Each criterion resolves to exactly one of two binary outcomes: **PASS = 1** or **FAIL = 0**. Each criterion is evaluated independently and reported as:

```text
Closed Circle
Model Confidence: 93%
Threshold: 88%
PASS ✓
```

**Needs Review is not a third scoring value.** It is a separate, independent warning (`needsReview`) that appears when a criterion's confidence is close to its threshold (within ±0.08 in the current app code), signaling the decision is borderline — it never changes the PASS/FAIL outcome or the point total. Model confidence is a model output, not a medical probability. Summing the four PASS=1/FAIL=0 outcomes produces the final **integer 0–4 score**.

The current provisional thresholds are frozen, code-only settings defined in [`app/analysis.js`](app/analysis.js) — there are **no user-editable threshold controls** in the app:

```javascript
const thresholds = Object.freeze({
  closedCircle: 0.90,
  all12Numbers: 0.80,
  numberPosition: 0.75,
  correctHands: 0.80
});
```

These are **provisional research settings only, not validated clinical cutoffs.** The team plans to test stricter values — for example, raising Closed Circle toward 0.90 and beyond — specifically to address the open-circle false-positive pattern, **without claiming any such threshold is already validated.** Because no inference backend is connected yet, these thresholds currently apply to no live model output; they will take effect once a real backend is deployed. **Changing a threshold only changes the decision boundary on model output; it does not retrain the model and does not by itself improve model accuracy.** See [Model Improvement — Weeks 7–10](#model-improvement--weeks-7-10) for how accuracy itself is planned to improve.

## Upload & Image Handling

The upload step (`app/analysis.js` + `app/script.js`) accepts **JPEG, PNG, or WebP, up to 10 MB**, and verifies the file decodes as a valid image before enabling Analyze. Once selected, the app shows a **live preview**, lets the user **replace or remove** the image at any time, and **clears any stale results** whenever the image changes so a result can never be shown next to the wrong drawing. Rapid re-selection is guarded so only the latest chosen file is analyzed, and selecting Analyze multiple times cannot queue duplicate requests. Upload progress, errors (wrong type, oversized file, unreadable image, request timeout, HTTP failure, or a malformed backend response), and the quality placeholder states are all announced through accessible `aria-live`/status regions, not color alone.

**Image quality is not yet assessed.** Successful decoding only confirms the file is a readable image — it does **not** evaluate sharpness, full clock visibility, or lighting. Those three checks currently display as **"Not checked"** placeholders until a real image-quality detector is built (see [Planned Features](#planned-features)).

## Accessibility Features

The app includes on-page accessibility controls designed for elderly and low-vision users:

- **High Contrast** mode
- **Large Text** mode
- **Color-blind-friendly** design — pass/fail states are never shown with color alone; every result uses a symbol and a word: **PASS ✓**, **FAIL ✕**, **NEEDS REVIEW ⚠**

## Multilingual Support

The interface ships with **English, Spanish, Vietnamese, Chinese, Arabic, and French** selectors. **English is the fallback dictionary for every string.** Spanish has the broadest additional coverage; Vietnamese, Chinese, Arabic, and French currently cover the core setup, upload, and results strings and fall back to English for anything not yet translated. **Arabic renders right-to-left** (`lang=ar`, `dir=rtl`), while numeric confidence meters stay left-to-right for readability. The translation system (`app/script.js`) is a simple key/value map per locale, so more languages can be added without redesigning the app. Translation completeness and native-speaker review are still needed for the four partial languages.

## Demographic Context

Before the clock-drawing step, the app collects **age, education level, preferred language, an optional reason for use, and a required consent checkbox**, alongside a clear statement that MindDial AI is an educational/research screening-support tool and not a diagnosis. **Demographic data never changes the AI's four scoring predictions and is never sent with inference requests** — age and education are kept structurally separate from the scoring pipeline (the upload adapter transmits only the image file itself, with an anonymous filename, to the backend) and are reserved for optional, separate research context in the future. Drawings and results are kept **only in page memory** for the current session; only display preferences (high contrast, large text, color-blind mode) are saved to `localStorage`.

## Model Improvement — Weeks 7–10

The [Model Improvement Roadmap](docs/Model_Improvement_Roadmap.md) documents planned experiments for improving the ResNet50 baseline, with a primary focus on reducing the open-circle false-positive pattern and over-prediction of "pass." **All experiments below are planned; none beyond the Experiment 1 baseline have been run yet.**

## Experiments

| Experiment | Description | Goal |
| --- | --- | --- |
| **1 — Current ResNet50 baseline** | Existing frozen-backbone run (documented in the [Model Card](docs/Model_Card_ResNet50.md) and [Evaluation Report](docs/Evaluation_Report.md)) | Reference point for all later comparisons |
| **2 — Safe data augmentation** | Label-preserving augmentation (rotation, brightness/contrast jitter, mild blur); no augmentation that could alter a circle's open/closed appearance | Improve robustness to photo quality and reduce overfitting to the 254-image training set |
| **3 — Partial fine-tuning** | Unfreeze the last block(s) of the ResNet50 backbone and fine-tune at a low learning rate | Learn clock-drawing-specific features instead of relying solely on frozen ImageNet features |
| **4 — EfficientNetB0 comparison (if appropriate)** | Train the same four-criterion head on an EfficientNetB0 backbone under the same split/evaluation protocol | Compare parameter efficiency and per-criterion accuracy against ResNet50 |

## Evaluation Metrics

Each experiment must report, at minimum, the following to stay comparable to the current baseline:

- Accuracy, precision, recall, and F1 per criterion
- False positive and false negative counts per criterion (with explicit attention to Closed-Circle false positives)
- Confusion matrices per criterion
- Exact 0–4 score agreement
- Score MAE (mean absolute error)
- A comparison across candidate decision thresholds, not just a default 0.50 cutoff

## Planned Features

- **Real AI inference** — connecting `app/analysis.js` to a deployed ResNet50 (or successor) backend; see [Current AI Model](#current-ai-model) and [`app/INFERENCE.md`](app/INFERENCE.md)
- Image quality detection (blurry, cropped, poor-lighting warnings) before analysis, replacing today's "Not checked" placeholders
- Age-group research context, shown separately from the AI score and only using percentages backed by matching published research
- **"Explain My Results"** — the results screen already shows a clearly labeled **"Explain My Results — Coming soon"** placeholder; the actual plain-language explanation and general brain-health information feature is not implemented yet
- An optional **AI assistant** that explains results only — it must not change the model score, diagnose a disease, or invent medical statistics
- Model interpretability / Grad-CAM visualizations
- Improved model accuracy (see [Experiments](#experiments))
- Validated, criterion-specific thresholds (replacing the provisional values above)
- Full translation coverage and native-speaker review for Vietnamese, Chinese, Arabic, and French
- Additional interface languages beyond the current six

## Project Structure

| Explore | Contents |
| --- | --- |
| [🌐 Live app source](app/) | HTML/CSS/JS for the public MindDial AI web app (mirrors the Netlify deployment) |
| [📘 App README](app/README.md) | Detailed app description, workflow, adapter, and current implementation status |
| [🔌 Backend integration notes](app/INFERENCE.md) | The response contract for `analyzeClockDrawing(file)` and what real ResNet50 inference still requires |
| [📚 Documentation](docs/) | Project reports, data documentation, evaluation, and model card |
| [🛣️ Model improvement roadmap](docs/Model_Improvement_Roadmap.md) | Planned experiments for improving accuracy and reducing false positives |
| [📖 References](docs/References/) | Source provenance and public source links |
| [📊 Results and charts](results/) | Aggregate metrics, training history, and chart images |
| [🗂️ Dataset](Dataset/) | Dataset scope and publication boundary |
| [🔀 Splits](splits/) | Aggregate split documentation |
| [📓 Development & Training Notebooks](notebooks/) | Cleaned preprocessing and training/EDA notebooks (outputs cleared) — development evidence, not the demo |
| [🧩 Reusable code](src/) | Extracted preprocessing, training, and evaluation functions |
| [🧠 Model](model/) | ResNet50 baseline release status and storage approach |
| [🔒 Controlled data](restricted_data/) | Restricted materials intentionally absent from GitHub |

**Run the app locally:** the app is static HTML/CSS/JS with no build step and no server dependency.

```bash
cd app
python -m http.server 8080
# then open http://localhost:8080
```

**Deploy to Netlify:** connect this repository in Netlify and set the publish directory to `app/` (no build command is required), or drag-and-drop the `app/` folder into Netlify's manual deploy UI. Netlify should auto-detect `app/index.html` as the site entry point.

## Privacy & Data Protection

- **Demographic data does not change the AI score and is never sent with inference requests** — see [Demographic Context](#demographic-context).
- **The live app keeps drawings and results in memory only, for the current session.** Nothing is written to `localStorage` except display preferences (high contrast, large text, color-blind mode); preview object URLs are released as soon as an image is replaced, removed, or superseded.
- **No restricted data is in this public repository.** Restricted project data (raw and processed clock-drawing images, the master evaluation workbook, and row-level split manifests) is maintained in **permission-controlled storage** and is intentionally excluded from GitHub. This repository does not publish the storage location; authorized team members should request current access details through existing project channels (see [restricted_data/README.md](restricted_data/README.md) and [Dataset/README.md](Dataset/README.md)).
- **Nothing from `restricted_data/` is imported into the public `app/`.**
- [NHATS Round 14 Clock Drawing Images](https://www.nhats.org/data-access/nhats/14) is the **team-reported dataset source**; the local files have not been independently matched to that release. Under the [NHATS Conditions of Use](https://www.nhats.org/conditions-of-use), access is individual and public-use data may not be transferred or uploaded to covered public AI platforms, including Copilot. A private GitHub repository does not change those terms.
- This repository contains checked documentation, aggregate CSV summaries, charts without drawings, cleaned/output-free notebooks, reusable extracted source code (`src/`), and the public app source (`app/`). It excludes raw and processed clock images, row-level labels, split manifests, predictions, image hashes, dataset archives, restricted Grad-CAM examples, and trained model weights (unless the team has confirmed redistribution rights).

## Medical Disclaimer

> **MindDial AI is an educational/research screening-support prototype. It does not diagnose Alzheimer's disease, dementia, or any other medical condition, and is not a substitute for professional evaluation.** The 0–4 feature score, model confidence values, and any decision-threshold outcome (PASS/FAIL/NEEDS REVIEW) describe visible drawing features only — they are not a risk percentage, a diagnosis, or a clinical recommendation.

## Documentation

| Report | What it covers |
| --- | --- |
| [Final Data Report](docs/Final_Data_Report.md) | Integrated project narrative and evaluated-release summary |
| [Dataset Card](docs/Dataset_Card.md) | Dataset composition, lineage, use, and stewardship |
| [Data Quality Report](docs/Data_Quality_Report.md) | Review decisions, exclusions, and unresolved evidence gaps |
| [Evaluation Report](docs/Evaluation_Report.md) | Held-out metrics, score agreement, and limitations |
| [Model Card](docs/Model_Card_ResNet50.md) | ResNet50 baseline, intended use, and performance boundaries |
| [Model Improvement Roadmap](docs/Model_Improvement_Roadmap.md) | Planned Experiments 1–4 and required evaluation metrics |
| [Source Provenance](docs/References/Source_Provenance.md) | Source roles, verification limits, and access conditions |
| [Split Manifest Summary](docs/Split_Manifest_Summary.md) | Historical vs. reviewed dataset split methodology |
| [Backend integration notes](app/INFERENCE.md) | The `analyzeClockDrawing(file)` response contract, privacy constraints, and what real ResNet50 inference still requires |

## Team

- Elijah Raines — Team Leader
- munachimso.benson
- olubukola.kukoyi
- mariajose.viverosriquelme
