# Train / Validation / Test Split Manifest Summary

AI Clock Drawing | Final documentation | 29 September 2026

**RESTRICTED PROJECT DOCUMENTATION | Educational research only. Keep raw and processed drawings, image montages, row-level labels and the dataset ZIP out of GitHub and public documentation. Private storage does not override source data-use restrictions. This package grants no new license or clinical approval. Only authorized recipients may access the restricted dataset.**

## Partition
| Partition | Records | Share | Purpose |
| --- | --- | --- | --- |
| Train | 254 | 69.97% | Fit classifier head |
| Validation | 54 | 14.88% | Track epoch metrics |
| Test | 55 | 15.15% | Evaluate after training |

| Score | All | Train | Validation | Test |
| --- | --- | --- | --- | --- |
| 0 | 25 | 17 | 4 | 4 |
| 1 | 41 | 29 | 6 | 6 |
| 2 | 67 | 47 | 10 | 10 |
| 3 | 125 | 88 | 18 | 19 |
| 4 | 105 | 73 | 16 | 16 |

| Criterion | Train fail/pass | Validation fail/pass | Test fail/pass |
| --- | --- | --- | --- |
| Closed Circle | 58/196 | 12/42 | 11/44 |
| Correct Number Position | 145/109 | 28/26 | 36/19 |
| All 12 Numbers | 48/206 | 11/43 | 9/46 |
| Correct Hands | 86/168 | 21/33 | 17/38 |

## Reproducible assignment
After duplicate selection, group records by Human_Total 0–4. Within each score, sort ascending by SHA-256 of `42:v2:<Image_ID>`. Global targets are floor(0.70*363)=254, floor(0.15*363)=54, and remaining 55. Start each score/partition allocation with floor(score_count*partition_target/363). Allocate residuals to eligible cells with greatest remaining fractional deficit, breaking ties toward lower score and earlier partition order (train, validation, test), until row and global totals are met. Slice each sorted score group according to those allocations; sort final manifest by Image_ID.

The original split 280/60/60 is historical. Current results use 254/54/55. Labels are unchanged. Seed 42 does not imply participant grouping.



Do not substitute a newly randomized split when reproducing this run. Test labels did not fit the model; the retrospective cleaning and repartitioning remain limitations.

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

