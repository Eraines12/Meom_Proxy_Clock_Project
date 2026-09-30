# Evaluation Report

AI Clock Drawing | Final documentation | 29 September 2026

**RESTRICTED PROJECT DOCUMENTATION | Educational research only. Keep raw and processed drawings, image montages, row-level labels and the dataset ZIP out of GitHub and public documentation. Private storage does not override source data-use restrictions. This package grants no new license or clinical approval. Only authorized recipients may access the restricted dataset.**

## Evaluation protocol
One held-out internal test partition of 55 images; four sigmoid predictions thresholded at 0.5. Human feature pass is the positive class. Predictions and truth are saved by Image_ID. No external diagnostic outcome was evaluated.

| Criterion | Accuracy | Precision | Recall | F1 |
| --- | --- | --- | --- | --- |
| Closed Circle | 81.82% | 82.69% | 97.73% | 89.58% |
| Correct Number Position | 69.09% | 54.17% | 68.42% | 60.47% |
| All 12 Numbers | 87.27% | 89.80% | 95.65% | 92.63% |
| Correct Hands | 80.00% | 80.00% | 94.74% | 86.75% |

## Confusion counts and imbalance
| Criterion | TN | FP | FN | TP | Balanced accuracy |
| --- | --- | --- | --- | --- | --- |
| Closed Circle | 2 | 9 | 1 | 43 | 57.95% |
| Correct Number Position | 25 | 11 | 6 | 13 | 68.93% |
| All 12 Numbers | 4 | 5 | 2 | 44 | 70.05% |
| Correct Hands | 8 | 9 | 2 | 36 | 70.90% |

Balanced accuracy here is recomputed as (sensitivity + specificity)/2 from the saved confusion counts. It is not the same as ordinary accuracy. All-12-numbers is strongest by F1 (0.9263); number positioning is weakest (0.6047). A constant-pass predictor would achieve 44/55, 19/55, 46/55 and 38/55 accuracy respectively. Thus ordinary accuracy alone overstates evidence on pass-heavy criteria; for all 12 numbers the model improves on constant-pass accuracy by only 2/55 decisions.

## Total scores
22/55 exact matches (40.00%); 46/55 within one point (83.64%); MAE 0.8182. Binary accuracy is 175/220 (79.55%). Exact total-score agreement measures equality of summed scores, not diagnostic accuracy.

## Interpretation and boundaries
The historical run had 21/60 exact matches (35%). The current test set and sample differ, so 40% versus 35% is not a controlled improvement estimate. The presentation's 77.2%–90.1% refers to cited research, not this model. Do not merge those figures or call them a target achieved by this project.

Exact duplicate control does not prove participant independence or eliminate near duplicates. Twenty-five records with conflicting labels were excluded, not adjudicated. Exclusion can change sample composition. The test set contains 55 records and is a retrospectively revised internal split, not an external clinical validation cohort. No demographic subgroup evaluation is possible from these fields. Scores are drawing-feature labels, not diagnoses.

No confidence interval, repeated-seed stability test or external evaluation was run. The appropriate conclusion is that the pipeline works end-to-end, with uneven feature-level performance and limited exact-score agreement.

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

