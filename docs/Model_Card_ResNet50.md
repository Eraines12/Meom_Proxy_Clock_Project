# Model Card — ResNet50 Baseline

AI Clock Drawing | Final documentation | 29 September 2026

**RESTRICTED PROJECT DOCUMENTATION | Educational research only. Keep raw and processed drawings, image montages, row-level labels and the dataset ZIP out of GitHub and public documentation. Private storage does not override source data-use restrictions. This package grants no new license or clinical approval. Only authorized recipients may access the restricted dataset.**

## Model identity and intended use
Research prototype for four binary drawing-feature predictions. Artifact: `Clock_Drawing_ResNet50_Model.keras`. Verified model folder (held in controlled project storage). No diagnostic or autonomous screening use is supported.

## Architecture and training
ImageNet-initialized ResNet50, include_top=False, frozen backbone; RGB 224x224 input, built-in ResNet50 preprocessing, global average pooling, dropout 0.30 and four sigmoid outputs. Adam learning rate 0.001, binary cross-entropy, batch size 16, ten epochs, seed 42. No fine-tuning, augmentation, class weighting, threshold search or early stopping was used in this run. The final epoch model was saved. Threshold is 0.50 for each criterion.

## Performance
| Criterion | Accuracy | Precision | Recall | F1 |
| --- | --- | --- | --- | --- |
| Closed Circle | 81.82% | 82.69% | 97.73% | 89.58% |
| Correct Number Position | 69.09% | 54.17% | 68.42% | 60.47% |
| All 12 Numbers | 87.27% | 89.80% | 95.65% | 92.63% |
| Correct Hands | 80.00% | 80.00% | 94.74% | 86.75% |

Test binary accuracy is 79.55% (175/220 decisions). Exact total-score agreement is 40.00% (22/55); score MAE is 0.8182; 46/55 scores (83.64%) are within one point. Four-label exact match is also 22/55 for this run, although it is conceptually a different metric.

## Limitations and maintenance
Exact duplicate control does not prove participant independence or eliminate near duplicates. Twenty-five records with conflicting labels were excluded, not adjudicated. Exclusion can change sample composition. The test set contains 55 records and is a retrospectively revised internal split, not an external clinical validation cohort. No demographic subgroup evaluation is possible from these fields. Scores are drawing-feature labels, not diagnoses.

The model often predicts pass: sensitivity is high for several criteria while specificity is low. Do not interpret high pass-class recall as dementia detection. No calibration, fairness, prospective validation or deployment monitoring was established. Preserve this baseline as the milestone result; future experimentation is separate work.

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

