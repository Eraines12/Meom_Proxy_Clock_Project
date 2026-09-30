# Data Dictionary

AI Clock Drawing | Final documentation | 29 September 2026

**RESTRICTED PROJECT DOCUMENTATION | Educational research only. Keep raw and processed drawings, image montages, row-level labels and the dataset ZIP out of GitHub and public documentation. Private storage does not override source data-use restrictions. This package grants no new license or clinical approval. Only authorized recipients may access the restricted dataset.**

## Evaluated manifest
`Reviewed_Dataset_Split.csv` contains 363 rows and 14 columns. Preserve spelling and case.

| Field | Type | Meaning |
| --- | --- | --- |
| Image_ID | string | Unique image key, Clock_###; not a participant ID |
| Closed_Circle | integer 0/1 | Closed Circle; 1=pass, 0=fail |
| Number_correct_Position | integer 0/1 | Correct Number Position; 1=pass, 0=fail |
| Includes_all_12_correct_Numbers | integer 0/1 | All 12 Numbers; 1=pass, 0=fail |
| Places_Hands_in_correct_positions | integer 0/1 | Correct Hands; 1=pass, 0=fail |
| Human_Total | integer 0–4 | Sum of four human criteria |
| Notes | optional string | Blank notes are not negative labels |
| split | enum | train / validation / test |
| raw_image_path | relative path | Original restricted source location; lineage only |
| processed_image_path | relative path | Original processed location; lineage only |
| split_seed | integer | 42 |
| duplicate_group | string | Raw-pixel group key; unique among selected rows |
| original_split | enum | Historical assignment before v2 repartition |
| dataset_version | string | Literal v2_candidate; evaluated in the identified completed run |

The restricted ZIP also contains `package_manifest.csv` with one additional field, `packaged_image_path`, identifying the actual ZIP location `processed_images/<split>/<Image_ID>.png`. Use that field after extracting the archive. Original path columns remain unchanged for lineage.

## Predictions and metrics
`test_predictions.csv` contains 55 rows: Image_ID, Human_Total, AI_Total and three fields for each original criterion: `_human` (0/1), `_probability` (0–1 sigmoid output), and `_predicted` (1 when probability >=0.5). AI_Total is the sum of four predictions; a sigmoid output is not a calibrated clinical risk.

`baseline_metrics.csv` contains Criterion, N, Accuracy, Precision, Recall, F1, TN, FP, FN, TP. N=55 for every criterion. Positive class is feature pass. Metrics are fractions, not percentages in storage. `training_history.csv` contains explicit epoch 1–10, loss, binary_accuracy, val_loss and val_binary_accuracy. Binary accuracy counts each of four decisions; it differs from exact score agreement.

Hash files contain Image_ID and SHA-256 values; processed hashes also contain split. `data_validation.json` records excluded groups and input hashes. `run_summary.json` records configuration, runtime and aggregate evaluation.

The four criterion fields operationalize the Pfizer/Eisai framework summarized by Palsetia et al. (2018); Human_Total remains their sum. Project labels are not established as NHATS-provided scores. Image_ID, paths and hashes do not encode independently verified NHATS round or participant provenance.

## Data contract
Require unique IDs, complete binary criteria, totals equal to label sums, disjoint assignments and one PNG per selected record. Join by Image_ID, never row order. IDs, paths, split and human totals are not model input features.

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

