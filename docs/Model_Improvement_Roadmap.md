# Model Improvement Roadmap

This roadmap documents planned experiments for improving the ResNet50 clock-drawing baseline described in [Model Card — ResNet50 Baseline](Model_Card_ResNet50.md). It is a plan, not a completed result. No new training has been run as part of this roadmap document.

## Why further experiments are needed

The current baseline (`resnet50_v2_20260929T232102Z_1e7339`) is a frozen-backbone ResNet50 trained for 10 epochs with no augmentation, fine-tuning, or threshold tuning. Held-out performance is usable as a first baseline, but one known issue is that **the model has sometimes classified an obviously open circle as "Closed Circle: PASS."** Reducing this specific false-positive pattern — and improving specificity generally, since the model tends to over-predict "pass" — is a primary goal of the experiments below.

## Planned experiments

| Experiment | Description | Goal |
| --- | --- | --- |
| **Experiment 1 — Current ResNet50 baseline** | The existing frozen-backbone run documented in the [Model Card](Model_Card_ResNet50.md) and [Evaluation Report](Evaluation_Report.md). | Reference point for all later comparisons. |
| **Experiment 2 — ResNet50 with safe data augmentation** | Add label-preserving augmentation (small rotation, brightness/contrast jitter, mild blur) to the frozen-backbone pipeline. No augmentation that could alter a closed/open circle's appearance (e.g. aggressive cropping) is in scope. | Improve robustness to photo quality and reduce overfitting to the 254-image training set. |
| **Experiment 3 — Partial ResNet50 fine-tuning** | Unfreeze the last block(s) of the ResNet50 backbone and fine-tune at a low learning rate. | Allow the model to learn clock-drawing-specific features instead of relying solely on frozen ImageNet features; a candidate path to reducing open-circle false positives. |
| **Experiment 4 — EfficientNetB0 comparison (if appropriate)** | Train the same four-criterion head on an EfficientNetB0 backbone under the same split and evaluation protocol. | Compare parameter efficiency and per-criterion accuracy against ResNet50 before committing to one architecture. |

## Required evaluation for every experiment

Each experiment must report, at minimum, the same evaluation surface as the current baseline so results are comparable:

- Accuracy, precision, recall, and F1 per criterion
- False positive and false negative counts per criterion (with explicit attention to Closed-Circle false positives)
- Confusion matrices per criterion
- Exact 0–4 score agreement
- Score MAE (mean absolute error)
- A comparison across candidate thresholds (see [app/script.js](../app/script.js) `thresholds`), not just the default 0.50 cutoff

## Threshold testing is separate from model improvement

Changing a per-criterion decision threshold (e.g. testing 0.90 instead of 0.50 for Closed Circle) changes **only** where PASS / NEEDS REVIEW / FAIL is drawn on the existing model's confidence output. It does not retrain the model and does not, by itself, improve underlying model accuracy. Threshold comparisons in the evaluation table above should be read as a decision-policy experiment, run independently of (and after) each architecture/training experiment above.

## Status

All four experiments are **planned, not completed**. No results from Experiments 2–4 exist yet. This document will be updated as each experiment is run, with results added to [Experiment_Run_Summary.md](Experiment_Run_Summary.md) and the [Evaluation Report](Evaluation_Report.md).
