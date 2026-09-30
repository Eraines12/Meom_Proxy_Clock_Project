# Experiment / Run Summary

AI Clock Drawing | Final documentation | 29 September 2026

**RESTRICTED PROJECT DOCUMENTATION | Educational research only. Keep raw and processed drawings, image montages, row-level labels and the dataset ZIP out of GitHub and public documentation. Private storage does not override source data-use restrictions. This package grants no new license or clinical approval. Only authorized recipients may access the restricted dataset.**

## Completed run
`resnet50_v2_20260929T232102Z_1e7339` — trained and evaluated; all outputs saved and verified. TensorFlow 2.20.0; Python 3.13.15; GPU runtime (Colab displayed T4). Model fitting took 35.88 seconds; this excludes file downloads, validation and uploads.

| Setting | Value |
| --- | --- |
| Input records | 363 |
| Train/validation/test | 254 / 54 / 55 |
| Epochs / batch / seed | 10 / 16 / 42 |
| Optimizer / rate | Adam / 0.001 |
| Backbone | ImageNet ResNet50; frozen |
| Head | Global average pooling; dropout 0.30; four sigmoid outputs |
| Final training accuracy / loss | 0.807087 / 0.425668 |
| Final validation accuracy / loss | 0.768519 / 0.465579 |

## Saved outputs
Run folder contains baseline_metrics.csv, test_predictions.csv, run_summary.json, data_validation.json, Reviewed_Dataset_Split.csv, raw_image_hashes.csv, processed_image_hashes.csv, training_history.csv, training_history_live.csv, criteria_distribution.csv/.png, total_score_distribution.csv/.png, baseline_loss.png and baseline_binary_accuracy.png. The model is in its own run folder. Sixteen artifacts total were uploaded with matching MD5 checksums. A later packaging cell created the separately restricted dataset ZIP.

## Reproduction
Use the executed notebook and controlled manifest record maintained by the team. Preserve source files and use authorized access. Notebook Run all creates new timestamped outputs and repeats training, so it is unnecessary for submission of this completed run. Reproduction may differ numerically across hardware/software even with seed 42. The exact environment and evaluated outputs are retained in controlled project storage for authorized audit.

## Change record
v1: historical 400-row 280/60/60 baseline. v2: conservative duplicate/conflict exclusion, score-stratified 363-row split, fresh raw and processed pixel checks, new trained model and verified packaging. No original labels were edited.

## Evidence

Completed run: `resnet50_v2_20260929T232102Z_1e7339`. Executed notebook (held in controlled project storage); verified run outputs (held in controlled project storage); restricted preprocessed dataset (held in controlled project storage). Counts below are recomputed from the evaluated manifest; metrics are taken from saved run outputs. Original files are retained. Current release supersedes the historical 400-record evaluation, not the source data.

## Source and scoring context

The team-reported dataset source is [NHATS Round 14 Clock Drawing Images](https://www.nhats.org/data-access/nhats/14). Its official listing is verified; the local image files have not been independently matched to the NHATS release. The four output labels follow the Pfizer/Eisai framework summarized by [Palsetia et al. (2018)](https://pmc.ncbi.nlm.nih.gov/articles/PMC5795671/), not a diagnosis or an NHATS label-authentication claim.

## Data access and publication

Under the [NHATS Conditions of Use](https://www.nhats.org/conditions-of-use), public-use access requires individual registration and does not permit redistribution. Keep restricted, raw and processed images, participant-drawing montages, row-level labels and dataset archives out of GitHub and public documentation. Private storage alone does not establish permission to share. Do not upload NHATS/NSOC data to public LLM or AI platforms covered by those conditions. Publish only permitted aggregate reporting and documentation; each team member must obtain access under the applicable terms.

## References and source provenance

1. Palsetia, D., Rao, G. P., Tiwari, S. C., Lodha, P., & De Sousa, A. (2018). *The Clock Drawing Test versus Mini-mental Status Examination as a Screening Tool for Dementia: A Clinical Comparison.* Indian Journal of Psychological Medicine, 40(1), 1–10. [Article](https://pmc.ncbi.nlm.nih.gov/articles/PMC5795671/). [DOI: 10.4103/IJPSYM.IJPSYM_244_17](https://doi.org/10.4103/IJPSYM.IJPSYM_244_17).
2. National Health and Aging Trends Study. [Data Access](https://www.nhats.org/data-access).
3. National Health and Aging Trends Study. [NHATS Round 14 Files / Clock Drawing Images](https://www.nhats.org/data-access/nhats/14). Team-reported dataset source; per-file provenance not independently authenticated.
4. National Health and Aging Trends Study. [Conditions of Use for NHATS and NSOC Data](https://www.nhats.org/conditions-of-use).

Source review: 30 September 2026. See [References / Source Provenance](References/Source_Provenance.md) for source roles, verification limits and access requirements. This documentation revision does not change images, labels, splits, model weights, metrics or analysis.

