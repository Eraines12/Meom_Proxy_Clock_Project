# MindDial AI

### AI-Assisted Clock Drawing Cognitive Screening

## 🌐 Live MindDial AI App

👉 [Launch MindDial AI](https://mind-dial.netlify.app)

**MindDial AI** is an educational and research-based AI screening-support application that analyzes clock drawings with a trained deep-learning model. The system evaluates four observable criteria and produces a score from 0–4:

1. Closed Circle
2. All 12 Numbers
3. Correct Number Position
4. Correct Clock Hands

Each passed criterion receives 1 point.

> **MindDial AI is an educational/research screening-support prototype. It does not diagnose Alzheimer's disease, dementia, or any other medical condition, and is not a substitute for professional evaluation.**

This repository, formerly tracked as `Meom_Proxy_Clock_Project`, is the main GitHub home for MindDial AI: the live web app, the AI backend/model research, the development notebooks, and the evaluation documentation behind it.

```text
MindDial AI
 ↓
Live Web App            → app/
 ↓
AI Backend / Model      → model/, src/
 ↓
Development & Training Notebooks → notebooks/
 ↓
Evaluation / Documentation       → docs/, results/
```

## Team Members
- Elijah Raines — Team Leader
- munachimso.benson
- olubukola.kukoyi
- mariajose.viverosriquelme

| Explore | Contents |
| --- | --- |
| [🌐 Live app source](app/) | HTML/CSS/JS for the public MindDial AI web app (mirrors the Netlify deployment) |
| [📚 Documentation](docs/) | Project reports, data documentation, evaluation, and model card |
| [🛣️ Model improvement roadmap](docs/Model_Improvement_Roadmap.md) | Planned experiments for improving accuracy and reducing false positives |
| [📖 References](docs/References/) | Source provenance and public source links |
| [📊 Results and charts](results/) | Aggregate metrics, training history, and chart images |
| [🗂️ Dataset](Dataset/) | Dataset scope and publication boundary |
| [🔀 Splits](splits/) | Aggregate split documentation |
| [📓 Development & Training Notebooks](notebooks/) | Cleaned preprocessing and training/EDA notebooks (outputs cleared) |
| [🧩 Reusable code](src/) | Extracted preprocessing, training, and evaluation functions |
| [🧠 Model](model/) | ResNet50 baseline release status and storage approach |
| [🔒 Controlled data](restricted_data/) | Restricted materials intentionally absent from GitHub |

## Project goal

MindDial AI predicts four visible clock-drawing features:

1. Closed circle
2. All 12 correct numbers
3. Correct number placement
4. Correct hand placement

Each predicted feature contributes one point, producing a 0–4 feature score. The scoring framework is based on the four-point method summarized by [Palsetia et al. (2018)](https://pmc.ncbi.nlm.nih.gov/articles/PMC5795671/). The work documents data preparation, feature scoring, baseline training, and aggregate evaluation; it does not establish diagnosis, screening performance, or clinical validity.

## The live app, step by step

```text
Open MindDial AI
 ↓
Choose Language
 ↓
Accessibility Settings
 ↓
Demographic Form
 ↓
Upload Clock Drawing
 ↓
Image Quality Check
 ↓
AI Analyzes 4 Criteria
 ↓
Model Confidence + Threshold Decision
 ↓
PASS / FAIL / NEEDS REVIEW
 ↓
Final 0–4 Score
 ↓
Age-Group Context (planned)
 ↓
Result Explanation (planned)
 ↓
General Brain-Health Information (planned)
 ↓
Optional AI Assistant (planned)
```

The app ([source in `app/`](app/), deployed at [mind-dial.netlify.app](https://mind-dial.netlify.app)) currently implements the setup, accessibility, demographic, upload, and AI-results steps above with a simulated/demo scoring screen (the trained model is not yet wired to the live UI — see [What's connected today](#whats-connected-today)). The remaining steps are documented in [Planned future features](#planned-future-features).

### Accessibility

The app includes on-page accessibility controls designed for elderly and low-vision users: **Large Text** mode, **High Contrast** mode, and a **Color-Blind-Friendly** mode. Pass/fail states are never shown with color alone — every result uses a symbol and a word: **PASS ✓**, **FAIL ✕**, **NEEDS REVIEW ⚠**.

### Multilingual support

The interface currently ships with **English, Spanish, Vietnamese, Chinese, Arabic, and French** selectors. English and Spanish have full UI coverage; the other four languages currently cover the core setup, upload, and results strings and fall back to English for any string not yet translated. The translation system (`app/script.js`) is a simple key/value map per locale, so more languages can be added without redesigning the app.

### Demographic form

Before the clock-drawing step, the app collects **age, education level, preferred language, an optional reason for use, and a required consent checkbox**, alongside a clear statement that MindDial AI is an educational/research screening-support tool and not a diagnosis. **Demographic data never changes the AI's four scoring predictions** — age and education are kept separate from the scoring pipeline and are reserved for optional, separate research context in the future.

## AI decision system and thresholds

Each of the four criteria is evaluated independently and reported as:

```text
Closed Circle
Model Confidence: 93%
Threshold: 88%
PASS ✓
```

Model confidence is a model output, not a medical probability. For each criterion, the app compares the model's confidence against a **configurable, per-criterion threshold** to decide **PASS**, **FAIL**, or **NEEDS REVIEW** (when confidence falls just under the threshold). Each PASS contributes 1 point toward the final **0–4** score.

The current provisional thresholds, defined in [`app/script.js`](app/script.js), are:

```javascript
const thresholds = {
  closedCircle: 0.90,
  all12Numbers: 0.80,
  numberPosition: 0.75,
  correctHands: 0.80
};
```

These are **provisional/testing values only**, not final calibrated thresholds. The team is testing values roughly between **0.50 and 0.95** — especially a stricter Closed Circle threshold — because the current baseline model has produced false-positive results, including classifying an obviously open circle as "Closed Circle: PASS." **Changing a threshold only changes the decision boundary on existing model output; it does not retrain the model and does not by itself improve model accuracy.** See the [Model Improvement Roadmap](docs/Model_Improvement_Roadmap.md) for how accuracy itself is planned to improve.

## What's connected today

The live app's setup, accessibility, demographic, upload, and results screens are implemented in `app/`. The AI-results screen currently displays **simulated confidence values** labeled as demo mode, because the trained ResNet50 model (`model/`) is not yet connected to the deployed web app. Connecting the real model requires exposing an inference endpoint (or an in-browser model runtime) that the app's `analyze-btn` handler in `app/script.js` can call instead of `simulateConfidence()`.

## Planned future features

- Image quality detection (blurry, cropped, poor-lighting warnings) before analysis
- Age-group research context, shown separately from the AI score and only using percentages backed by matching published research
- Result explanations in plain language
- General brain-health information
- An "Explain My Results" feature
- An optional AI assistant that explains results only — it must not change the model score, diagnose a disease, or invent medical statistics
- Model interpretability / Grad-CAM visualizations
- Improved model accuracy (see [Model Improvement Roadmap](docs/Model_Improvement_Roadmap.md))
- Validated, criterion-specific thresholds (replacing the provisional values above)
- Additional interface languages beyond the current six

## Start with the reports

| Report | What it covers |
| --- | --- |
| [Final Data Report](docs/Final_Data_Report.md) | Integrated project narrative and evaluated-release summary |
| [Dataset Card](docs/Dataset_Card.md) | Dataset composition, lineage, use, and stewardship |
| [Data Quality Report](docs/Data_Quality_Report.md) | Review decisions, exclusions, and unresolved evidence gaps |
| [Evaluation Report](docs/Evaluation_Report.md) | Held-out metrics, score agreement, and limitations |
| [Model Card](docs/Model_Card_ResNet50.md) | ResNet50 baseline, intended use, and performance boundaries |
| [Source Provenance](docs/References/Source_Provenance.md) | Source roles, verification limits, and access conditions |

## Completed baseline

The project began with **400 original image records**. The evaluated release contains **363 reviewed records**, with a **254/54/55** train/validation/test split; 25 conflicting-label records and 12 redundant copies were excluded from that release. The held-out baseline reports **79.55% test binary accuracy**, **40.00% exact total-score agreement (22/55)**, **83.64% within-one-point agreement (46/55)**, and **0.8182 score MAE**. These are internal results from 55 test records, not external or clinical validation. See the [Evaluation Report](docs/Evaluation_Report.md) and [aggregate result tables](results/) for interpretation.

<p align="center">
  <a href="results/"><img src="results/held_out_performance.png" alt="Held-out feature performance chart" width="48%"></a>
  <a href="results/"><img src="results/training_history.png" alt="Training history chart" width="48%"></a>
</p>

## Dataset versions: historical vs. reviewed

Two dataset states exist in project history, and they are not interchangeable:

| Version | Records | Split (train/validation/test) | Role |
| --- | --- | --- | --- |
| Historical preprocessing | 400 | 280 / 60 / 60 | Original acquisition and preprocessing output, produced by `notebooks/Data_Preprocessing.ipynb` using a fixed deterministic (seed 42) ordering. |
| Reviewed / evaluated release | 363 | 254 / 54 / 55 | The dataset actually trained and evaluated in `notebooks/EDA_Baseline_Training.ipynb`, after a separate review step. |

The reviewed release is **not** produced by re-running the preprocessing notebook. Per the project's own evidence (`docs/Data_Quality_Report.md`, `docs/Split_Manifest_Summary.md`, `docs/Final_Data_Report.md`), getting from 400 records to the 363-record reviewed release required an additional exclusion/review pass: a fresh raw-pixel duplicate audit found 24 duplicate groups (49 records); 12 of those groups had conflicting human labels, and all 25 of their records were excluded (not relabeled); 12 further redundant-but-consistent duplicate records were also excluded, keeping one representative each. The remaining 363 records were then reassigned to a **new, score-stratified** 254/54/55 split (also seed 42, but a different, stratified assignment method — see `docs/Split_Manifest_Summary.md` for the exact algorithm), not the historical 280/60/60 split. Original labels for all 400 records are preserved unchanged; the historical notebook and split remain the earlier pipeline stage, and the reviewed release is the version the evaluated ResNet50 baseline below was actually trained and tested on.

The evaluated baseline results in "Completed baseline" above refer to the **reviewed 363-record release** only, not the historical 400-record set.

## Source, workflow, and stewardship

[NHATS Round 14 Clock Drawing Images](https://www.nhats.org/data-access/nhats/14) is the **team-reported dataset source**. Although the official source listing is available, the local files have not been independently matched to that release. The documented workflow is: authorized acquisition and review; controlled preprocessing and splitting; ResNet50 baseline training; aggregate evaluation; and documentation of limitations and provenance. The reports record the work contributors have documented in those stages rather than asserting undocumented individual roles.

This repository contains checked documentation, aggregate CSV summaries, charts without drawings, cleaned/output-free notebooks, reusable extracted source code (`src/`), and the public app source (`app/`). It excludes raw and processed clock images, row-level labels, split manifests, predictions, image hashes, dataset archives, restricted Grad-CAM examples, and trained model weights (unless the team has confirmed redistribution rights). Under the [NHATS Conditions of Use](https://www.nhats.org/conditions-of-use), access is individual and public-use data may not be transferred or uploaded to covered public AI platforms, including Copilot. A private GitHub repository does not change those terms. Nothing from `restricted_data/` is imported into the public `app/`.

## Restricted data access

Restricted project data (raw and processed clock-drawing images, the master evaluation workbook, and row-level split manifests) is maintained in permission-controlled storage and is intentionally excluded from this public repository. This repository does not publish the storage location; authorized team members should request current access details through existing project channels (see [restricted_data/README.md](restricted_data/README.md) and [Dataset/README.md](Dataset/README.md)).

## Previewing and deploying the app

The app is static HTML/CSS/JS with no build step and no server dependency.

**Preview locally:**
```bash
cd app
python -m http.server 8080
# then open http://localhost:8080
```

**Deploy to Netlify:** connect this repository in Netlify and set the publish directory to `app/` (no build command is required), or drag-and-drop the `app/` folder into Netlify's manual deploy UI. Netlify should auto-detect `app/index.html` as the site entry point.
