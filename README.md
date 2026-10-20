# 🧠 MindDial AI

> AI-Assisted Clock Drawing Cognitive Screening

## 🌐 Live App

👉 **[Launch MindDial AI](https://mind-dial.netlify.app)**

MindDial AI is an educational AI-assisted clock-drawing screening-support prototype. It evaluates four visible clock-drawing criteria and produces a 0–4 feature score.

**The Netlify app above is the primary public demo.** The [`notebooks/`](notebooks/) are development/training evidence, not the demo. **The interface, accessibility, and decision system are fully built — no real AI model is connected yet.** See [Current AI Model](#current-ai-model).

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

The app ([source](app/), live at [mind-dial.netlify.app](https://mind-dial.netlify.app)) implements setup, accessibility, demographics, and upload. **No simulated or demo scores are shown.** Until a backend is connected, results read "AI model connection pending" and quality checks read "Not checked." See [Current AI Model](#current-ai-model) and [`app/INFERENCE.md`](app/INFERENCE.md).

## Four Scoring Criteria

MindDial AI predicts four visible clock-drawing features, each worth **1 point**, for a score of **0–4**:

1. **Closed Circle** — a single closed loop
2. **All 12 Numbers** — all twelve numbers present
3. **Correct Number Position** — numbers roughly in the right clock positions
4. **Correct Clock Hands** — two hands pointing to a plausible time

The score is a **feature count, not a diagnosis or risk percentage.**

## Current AI Model

The **research baseline** is a **ResNet50** network (`resnet50_v2_20260929T232102Z_1e7339`), frozen ImageNet backbone, trained 10 epochs with no augmentation, documented in the [Model Card](docs/Model_Card_ResNet50.md). **It is not connected to the live app.**

`app/analysis.js` defines an `analyzeClockDrawing(file)` adapter with an **empty endpoint by default** — no network request, no score, until one is configured. Connecting a real model requires deploying a same-origin inference service (see [`app/INFERENCE.md`](app/INFERENCE.md)) that:

- loads the trained checkpoint,
- matches the training preprocessing exactly,
- returns `modelVersion` plus four `confidences` in `[0, 1]`, and
- is evaluated end-to-end on held-out data, including open circles, before any performance claim.

Until then, `app/` is a complete **interface and decision-system shell** with no live scoring.

## Current Performance

These numbers are the **offline research baseline** from `notebooks/`/`docs/`, not a live score — the app doesn't score yet. From **400 original records**, the evaluated release keeps **363** (25 conflicting-label, 12 duplicate excluded), split **254/54/55** train/validation/test:

- **79.55%** test binary accuracy
- **40.00%** exact total-score agreement (22/55)
- **83.64%** within-one-point agreement (46/55)
- **0.8182** score MAE (mean absolute error)

These are **internal results from 55 test records, not external or clinical validation**. See the [Evaluation Report](docs/Evaluation_Report.md) and [aggregate result tables](results/) for full interpretation.

<p align="center">
  <a href="results/"><img src="results/held_out_performance.png" alt="Held-out feature performance chart" width="48%"></a>
  <a href="results/"><img src="results/training_history.png" alt="Training history chart" width="48%"></a>
</p>

Two dataset versions exist: the **historical preprocessing output** (400 records, 280/60/60 split, from `notebooks/Data_Preprocessing.ipynb`) and the **reviewed/evaluated release** (363 records, 254/54/55 split) used above. All 400 original labels are preserved unchanged. See [`docs/Split_Manifest_Summary.md`](docs/Split_Manifest_Summary.md) and [`docs/Final_Data_Report.md`](docs/Final_Data_Report.md).

## Known Model Limitations

- **Open-circle false positives:** the baseline sometimes marks an open circle as **"Closed Circle: PASS."** A primary goal of the [Model Improvement Roadmap](docs/Model_Improvement_Roadmap.md).
- **Small, single-source test set:** only 55 held-out records, one source — not external or multi-site.
- **No clinical validation:** the 0–4 score isn't validated against diagnoses or outcomes.
- **Thresholds aren't validated:** the team plans to test stricter per-criterion thresholds, without claiming any value is already validated. See [MindDial Decision System](#minddial-decision-system).

## MindDial Decision System

Each criterion is a binary outcome, **PASS = 1** or **FAIL = 0**, reported as:

```text
Closed Circle
Model Confidence: 93%
Threshold: 88%
PASS ✓
```

**Needs Review is not a third scoring value** — it's an independent warning (`needsReview`) shown when confidence is close to the threshold (±0.08), flagging a borderline case without changing PASS/FAIL or the point total. Model confidence is a model output, not a medical probability. The four PASS/FAIL outcomes sum to the final **0–4 score**.

The provisional thresholds are frozen, code-only settings in [`app/analysis.js`](app/analysis.js) — **no user-editable controls** in the app:

```javascript
const thresholds = Object.freeze({
  closedCircle: 0.90,
  all12Numbers: 0.80,
  numberPosition: 0.75,
  correctHands: 0.80
});
```

These are **provisional research settings, not validated clinical cutoffs.** The team plans to test stricter values to address the open-circle false positive, without claiming any value is already validated. Thresholds don't apply to live output yet since no backend is connected. **Changing a threshold only moves the decision boundary — it doesn't retrain the model or improve accuracy.** See [Model Improvement — Weeks 7–10](#model-improvement--weeks-7-10).

## Upload & Image Handling

Accepts **JPEG, PNG, or WebP, up to 10 MB**, and verifies the file decodes before enabling Analyze. Shows a **live preview**, lets you **replace or remove** the image, and **clears stale results** whenever the image changes. Re-selecting or re-analyzing can't queue duplicate requests. Errors (wrong type, oversized, unreadable, timeout, HTTP failure, malformed response) are announced through accessible status regions, not color alone.

**Image quality isn't assessed yet.** Decoding only confirms the file is readable — sharpness, full clock visibility, and lighting all show **"Not checked"** until a real quality detector exists (see [Planned Features](#planned-features)).

## Accessibility Features

On-page controls for elderly and low-vision users:

- **High Contrast** mode
- **Large Text** mode
- **Color-blind-friendly** design — states always pair a symbol with a word: **PASS ✓**, **FAIL ✕**, **NEEDS REVIEW ⚠**

## Multilingual Support

Six languages: **English, Spanish, Vietnamese, Chinese, Arabic, French.** **English is the fallback** for every string. Spanish has the broadest coverage; the other four cover the core journey and fall back to English elsewhere. **Arabic renders right-to-left.** Translation completeness and native-speaker review are still needed for the partial languages.

## Demographic Context

Before the drawing step, the app collects **age, education, preferred language, an optional reason, and consent.** **Demographics never change the AI score and are never sent with inference requests** — kept separate for optional future research context. Drawings and results stay **in page memory only**; only display preferences are saved to `localStorage`.

## Model Improvement — Weeks 7–10

The [Model Improvement Roadmap](docs/Model_Improvement_Roadmap.md) documents planned experiments to reduce the open-circle false positive and over-prediction of "pass." **All experiments below are planned; only the Experiment 1 baseline has been run.**

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

- **Real AI inference** — connect `app/analysis.js` to a deployed ResNet50 (or successor) backend; see [Current AI Model](#current-ai-model) and [`app/INFERENCE.md`](app/INFERENCE.md)
- Image quality detection (blur, cropping, lighting), replacing today's "Not checked" placeholders
- Age-group research context, shown separately from the AI score
- **"Explain My Results"** — currently a labeled "Coming soon" placeholder; the real explanation feature isn't built yet
- An optional **AI assistant** that explains results only, without changing the score or inventing statistics
- Model interpretability / Grad-CAM visualizations
- Improved model accuracy (see [Experiments](#experiments))
- Validated, criterion-specific thresholds (replacing the provisional values above)
- Full translation coverage and native-speaker review, plus additional languages

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

**Run locally:** static HTML/CSS/JS, no build step.

```bash
cd app
python -m http.server 8080
# then open http://localhost:8080
```

**Deploy to Netlify:** connect this repo and set the publish directory to `app/` (no build command needed), or drag-and-drop `app/` into Netlify's manual deploy UI.

## Privacy & Data Protection

- **Demographics never change the AI score or get sent with inference requests** — see [Demographic Context](#demographic-context).
- **Drawings and results stay in memory only**, for the current session. Only display preferences go to `localStorage`; preview URLs are released when an image is replaced or removed.
- **No restricted data is in this public repository.** Raw/processed images, the evaluation workbook, and split manifests live in permission-controlled storage, excluded from GitHub. Team members should request access through existing channels (see [restricted_data/README.md](restricted_data/README.md), [Dataset/README.md](Dataset/README.md)).
- **Nothing from `restricted_data/` is imported into the public `app/`.**
- [NHATS Round 14 Clock Drawing Images](https://www.nhats.org/data-access/nhats/14) is the **team-reported dataset source**, not independently verified. Under the [NHATS Conditions of Use](https://www.nhats.org/conditions-of-use), access is individual and public-use data can't be uploaded to covered public AI platforms, including Copilot — a private repo doesn't change that.
- This public repo contains checked documentation, aggregate summaries, charts, cleaned notebooks, reusable source (`src/`), and the app (`app/`). It excludes raw/processed images, labels, manifests, predictions, hashes, and trained weights (unless redistribution rights are confirmed).

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
