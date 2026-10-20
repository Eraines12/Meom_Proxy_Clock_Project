# 🧠 MindDial AI — App

> AI-Assisted Clock Drawing Cognitive Screening — live web app

👉 **[Launch MindDial AI](https://mind-dial.netlify.app/)**

This is the detailed technical README for the `app/` folder — the static HTML/CSS/JS web app that `app/README.md` describes in depth. For the overall project (research baseline, dataset, model card, roadmap, team), see the [main README](../README.md).

## Table of Contents

- [Current Status](#current-status)
- [App Workflow](#app-workflow)
- [Four Scoring Criteria](#four-scoring-criteria)
- [Binary Scoring & Needs Review](#binary-scoring--needs-review)
- [Thresholds](#thresholds)
- [Upload Handling](#upload-handling)
- [Image Quality Status](#image-quality-status)
- [Results Screen](#results-screen)
- [Accessibility](#accessibility)
- [Multilingual Support](#multilingual-support)
- [Privacy Behavior](#privacy-behavior)
- [The `analyzeClockDrawing(file)` Adapter](#the-analyzeclockdrawingfile-adapter)
- [What Real ResNet50 Inference Still Requires](#what-real-resnet50-inference-still-requires)
- [File Guide](#file-guide)
- [Running Locally](#running-locally)
- [Tests](#tests)
- [Netlify Deployment Settings](#netlify-deployment-settings)
- [Limitations](#limitations)
- [Planned Features](#planned-features)
- [Medical Disclaimer](#medical-disclaimer)
- [Related Documentation](#related-documentation)

## Current Status

- **Real ResNet50 inference is NOT connected.** `app/analysis.js` ships with an empty `endpoint` by default, so the app never makes a network request unless a backend is configured in code.
- **All simulated predictions have been removed.** There is no `simulateConfidence()` function and no fallback/demo score anywhere in the app.
- **No score is generated without a configured backend.** Instead, the upload screen shows a banner: *"Model connection pending — AI model connection pending — no score has been generated."*
- The interface, accessibility controls, multilingual support, upload/preview flow, and the binary decision system are **fully implemented** — only the model connection itself is pending.

## App Workflow

```text
1. Your setup        → Age, education, preferred language, display preferences, consent (implemented)
2. Upload drawing     → Select a JPEG/PNG/WebP image, preview it, replace/remove it (implemented)
3. AI results         → "Model connection pending" until a backend is configured; otherwise
                         per-criterion PASS/FAIL, confidence, threshold, Needs Review, and a 0–4 score
```

Three steps are shown in the UI: **Your setup → Upload drawing → AI results.** The age/education/consent form never changes the AI score — it is kept for optional, separate research context (see [Privacy Behavior](#privacy-behavior)).

## Four Scoring Criteria

Defined in `app/script.js` (`project.criteria`) and documented in the [main README](../README.md#four-scoring-criteria):

1. **Closed Circle** — the clock face is a single closed loop
2. **All 12 Numbers** — all twelve numbers (1–12) are present
3. **Correct Number Position** — numbers are placed in roughly correct clock positions
4. **Correct Clock Hands** — two hands are present and point to a plausible time

## Binary Scoring & Needs Review

Each criterion resolves to exactly one of two outcomes — there is no third scoring value:

- **PASS = 1** — confidence is at or above the criterion's threshold
- **FAIL = 0** — confidence is below the criterion's threshold

The four outcomes sum to an **integer total score of 0–4**. From `app/analysis.js`:

```javascript
function decide(confidence, threshold) {
  return { status: confidence >= threshold ? 'pass' : 'fail',
    needsReview: Math.abs(confidence - threshold) <= 0.08 };
}
```

**Needs Review is an independent warning, not a third scoring value.** It fires when confidence is within ±0.08 of the threshold and is displayed as a separate "⚠ Needs Review" note on the result card — it never changes the PASS/FAIL outcome or the point total.

## Thresholds

Configured in code in [`app/analysis.js`](analysis.js), with **no user-editable controls** anywhere in the UI:

```javascript
const thresholds = Object.freeze({
  closedCircle: 0.90,
  all12Numbers: 0.80,
  numberPosition: 0.75,
  correctHands: 0.80
});
```

These are **provisional research settings only**. They have **not been clinically validated**, and no claim is made that any value (including the 0.90 Closed Circle threshold) is a validated or final cutoff. Changing a threshold only moves the decision boundary on model output — it does not retrain the model or improve accuracy.

## Upload Handling

Implemented in `app/script.js`'s `file-input` change handler and `app/analysis.js`'s `validateFile`:

| Behavior | Details |
| --- | --- |
| **Supported formats** | JPEG, PNG, WebP only |
| **Size limit** | Up to 10 MB; empty files rejected |
| **Decode verification** | The file is loaded into an `Image()` and `img.decode()` must succeed before it's accepted; oversized decoded dimensions (> 40 million pixels) are also rejected |
| **Preview** | A live, in-memory preview renders in the dropzone via `URL.createObjectURL` |
| **Replace / remove** | Selecting a new file or clicking "Remove image" clears the prior preview (`URL.revokeObjectURL`) and any stale results |
| **Stale-result clearing** | Any previous analysis result is cleared immediately whenever the image changes |
| **Duplicate-request guard** | A `busy` flag and a monotonically increasing `selection` token prevent overlapping selections or duplicate Analyze requests |
| **Error/status messaging** | Validation, decoding, analyzing, timeout, and HTTP-failure states are announced through `#upload-status` (`role="status"`, `aria-live="polite"`), not color alone |

## Image Quality Status

**Sharpness, full clock visibility, and lighting are not evaluated.** The quality list always reads:

- Sharpness — **Not checked**
- Full clock visible — **Not checked**
- Lighting — **Not checked**

Successful image decoding only confirms the file is a readable image of a supported type — it is **not** an image-quality check. A real quality detector is listed under [Planned Features](#planned-features).

## Results Screen

When a backend is configured and a drawing is analyzed, `renderResults()` in `app/script.js` displays:

- The **model version** string returned by the backend (`result.modelVersion`)
- Each criterion's **PASS/FAIL** badge, **confidence %**, and **threshold %** with a meter
- An independent **"⚠ Needs Review"** note where applicable
- The **final 0–4 score**
- A clearly labeled **"Explain My Results"** disclosure that currently reads: *"Planned feature. Personalized explanations are not available yet."* — this is an implemented placeholder, not a working explanation feature

## Accessibility

On-page controls, toggled via checkboxes and persisted only as display preferences (see [Privacy Behavior](#privacy-behavior)):

- **Large Text** mode
- **High Contrast** mode
- **Color-blind-friendly mode** — PASS/FAIL/Needs Review are never conveyed by color alone; every state pairs a symbol with a word (`PASS ✓`, `FAIL ✕`, `NEEDS REVIEW ⚠`)
- Skip-to-setup link, focus management between steps, `aria-live`/`role="status"` announcements, and `aria-busy` during analysis

## Multilingual Support

Six interface languages are selectable: **English, Spanish, Vietnamese, Chinese, Arabic, French** (`app/script.js`'s `translations` map).

- **English is the fallback dictionary** — `t(key)` always falls back to the English string if a locale is missing a key.
- **Spanish has the broadest additional coverage** of the five non-English locales.
- **Vietnamese, Chinese, Arabic, and French currently cover the core setup/upload/results strings** and fall back to English elsewhere.
- **Arabic renders right-to-left** — `document.documentElement.dir` is set to `rtl` for `ar` (via `rtlLocales`), while numeric confidence meters remain left-to-right for readability.

## Privacy Behavior

- **Drawings and analysis results exist only in page memory** for the current session and are cleared on refresh, close, replace, or remove.
- **Only display preferences are saved to `localStorage`** — the `large`, `contrast`, and `color` toggle states (keys `minddial-display-large`, `minddial-display-contrast`, `minddial-display-color`). Setup details, images, and results are never persisted there.
- **Demographics are never sent with inference requests.** `analyzeClockDrawing(file)` (see below) only ever transmits the image file itself, with a generic filename (`clock.jpg` / `clock.png` / `clock.webp`) — age, education, preferred language, and reason-for-use never leave the browser.
- **No image is sent anywhere until a backend endpoint is configured and Analyze is explicitly selected.**

## The `analyzeClockDrawing(file)` Adapter

Implemented in [`app/analysis.js`](analysis.js). Full response-contract documentation lives in **[`app/INFERENCE.md`](INFERENCE.md)** — read it before connecting a real backend. Summary:

- `analysisConfig.endpoint` is empty by default — a deployment-only setting, never user-editable. With no endpoint set, the adapter throws `notConnected` and makes no network request.
- When an endpoint is configured, the request must stay **same-origin** (checked against `location.origin`); otherwise it throws `invalidEndpoint`.
- The request is a single multipart `image` field, sent with `credentials: 'omit'`, `cache: 'no-store'`, `redirect: 'error'`, `referrerPolicy: 'no-referrer'`, and a 30-second timeout (`AbortController`).
- A valid response must include a non-empty `modelVersion` string (≤120 characters) and four `confidences` values (`closedCircle`, `all12Numbers`, `numberPosition`, `correctHands`), each a finite number in `[0, 1]`.
- Timeouts, HTTP errors, network failures, and malformed/incomplete responses all throw distinct errors (`timedOut`, `requestFailed`, `invalidResponse`) and **never produce a score**.

## What Real ResNet50 Inference Still Requires

Connecting the trained research baseline to this live app is **not yet done**. It still requires:

1. **Authorized access to the trained ResNet50 checkpoint** (`resnet50_v2_20260929T232102Z_1e7339`, documented in the [Model Card](../docs/Model_Card_ResNet50.md)).
2. **Matching preprocessing** — the exact training-time orientation, crop, size, and normalization steps must be reproduced server-side.
3. **Verified output mapping** — confirming the service's four output probabilities map to the correct criterion keys in the correct order, and represent the probability of *passing* each criterion.
4. **A deployed backend** exposing a same-origin inference endpoint that this adapter can call, with server-side file/decode/size checks, request limits, and a defined privacy/retention policy (see [`app/INFERENCE.md`](INFERENCE.md)).
5. **End-to-end evaluation** against held-out data — including open-circle cases — before any performance claim is made about the connected live app.

## File Guide

| File | Purpose |
| --- | --- |
| [`index.html`](index.html) | App markup: setup form, upload step, results step, translated `data-t` strings |
| [`script.js`](script.js) | App logic: translations, display preferences, setup/upload/results flow, rendering |
| [`analysis.js`](analysis.js) | The `analyzeClockDrawing(file)` inference adapter, thresholds, and response validation |
| [`analysis.test.cjs`](analysis.test.cjs) | Node test suite covering the adapter's disconnected, binary-boundary, validation, and error-handling behavior |
| [`styles.css`](styles.css) | Visual theme, layout, accessibility (contrast/large-text/color-blind) styles |
| [`INFERENCE.md`](INFERENCE.md) | Backend response contract and integration notes for real inference |
| [`assets/`](assets/) | Static images/icons only — no clock-drawing images, participant data, or model weights |

## Running Locally

The app is static HTML/CSS/JS with no build step and no server dependency:

```bash
cd app
python -m http.server 8080
# then open http://localhost:8080
```

## Tests

Run the adapter's regression suite with Node's built-in test runner:

```bash
node --test app/analysis.test.cjs
```

Fixtures used by the tests exist only within the test file and cannot be reached from the live app.

## Netlify Deployment Settings

- **Publish directory:** `app/`
- **Build command:** none required
- Connect this GitHub repository in Netlify, or drag-and-drop the `app/` folder into Netlify's manual deploy UI. Netlify should auto-detect `app/index.html` as the site entry point.
- This README does not claim the current live deployment has been verified to reflect any specific commit — check the Netlify dashboard's Deploys tab for the actual deployed commit.

## Limitations

- No real model is connected; the AI-results screen cannot produce a score until a backend is deployed and configured.
- Image quality (sharpness, framing, lighting) is not assessed — only file type/size/decodability are checked.
- Thresholds are provisional and have not been clinically validated.
- Vietnamese, Chinese, Arabic, and French translation coverage is partial; native-speaker review is still needed.
- "Explain My Results" is a labeled placeholder with no explanation logic behind it yet.

## Planned Features

- Connecting a deployed ResNet50 (or successor) backend to `analyzeClockDrawing(file)`
- Real image-quality detection (sharpness, framing, lighting) to replace the current "Not checked" placeholders
- A working "Explain My Results" feature with plain-language explanations
- Age-group research context, shown separately from the AI score
- An optional AI assistant that explains results only, without altering the score
- Full translation coverage and native-speaker review for all six languages
- Validated, criterion-specific thresholds replacing the current provisional values

## Medical Disclaimer

> **MindDial AI is an educational/research screening-support prototype. It does not diagnose Alzheimer's disease, dementia, or any other medical condition, and is not a substitute for professional evaluation.** The 0–4 feature score, model confidence values, and any decision-threshold outcome (PASS/FAIL/NEEDS REVIEW) describe visible drawing features only — they are not a risk percentage, a diagnosis, or a clinical recommendation.

## Related Documentation

- [Main README](../README.md) — project overview, live link, research results, roadmap, team
- [Model Card (ResNet50)](../docs/Model_Card_ResNet50.md) — trained research baseline, intended use, performance boundaries
- [Evaluation Report](../docs/Evaluation_Report.md) — held-out metrics, score agreement, limitations
- [Model Improvement Roadmap](../docs/Model_Improvement_Roadmap.md) — planned Experiments 1–4
- [Development & Training Notebooks](../notebooks/) — preprocessing and training/EDA evidence (not the live demo)
- [Aggregate Results](../results/) — charts and metric tables
- [Backend integration notes](INFERENCE.md) — the response contract for real inference
