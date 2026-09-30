# Dataset Card / Datasheet for Datasets

AI Clock Drawing | Final documentation | 29 September 2026

**RESTRICTED PROJECT DOCUMENTATION | Educational research only. Keep raw and processed drawings, image montages, row-level labels and the dataset ZIP out of GitHub and public documentation. Private storage does not override source data-use restrictions. This package grants no new license or clinical approval. Only authorized recipients may access the restricted dataset.**

## Purpose and composition
The dataset supports multi-label prediction of four clock-drawing features. One record is one image file, not a verified unique participant. The original collection contains 400 files; this evaluated release contains 363 selected records with 1,452 binary labels.

| Criterion | Fail | Pass | Pass rate |
| --- | --- | --- | --- |
| Closed Circle | 81 | 282 | 77.69% |
| Correct Number Position | 209 | 154 | 42.42% |
| All 12 Numbers | 68 | 295 | 81.27% |
| Correct Hands | 124 | 239 | 65.84% |

| Score | All | Train | Validation | Test |
| --- | --- | --- | --- | --- |
| 0 | 25 | 17 | 4 | 4 |
| 1 | 41 | 29 | 6 | 6 |
| 2 | 67 | 47 | 10 | 10 |
| 3 | 125 | 88 | 18 | 19 |
| 4 | 105 | 73 | 16 | 16 |

## Acquisition and annotation
The team reports that the project's clock-drawing images were obtained from NHATS Round 14 and has supplied the [Round 14 public-files / Clock Drawing Images page](https://www.nhats.org/data-access/nhats/14) as the project source. That official page lists Clock Drawing Images in TIFF format. The [NHATS Data Access page](https://www.nhats.org/data-access) documents the access route. This establishes the team-reported source and an independently checked source listing; it does not independently authenticate each of the 400 project files. The existing project documentation does not establish an acquisition receipt, original archive-to-file mapping, or sampling procedure. Local image IDs and hashes document internal lineage, not NHATS origin. The Sato et al. (2022) citation in the presentation remains research background, not evidence of these files' provenance.

The project uses the Pfizer/Eisai four-point CDT framework summarized by [Palsetia et al. (2018), Scoring systems, item 8](https://pmc.ncbi.nlm.nih.gov/articles/PMC5795671/): one point for each satisfied feature—closed circle, all 12 correct numbers, correct number placement and correct hand placement. The four binary labels sum to a 0–4 feature score. The paper's scoring description has now been checked. The project's presentation (slides 4–6) supplies operational details, including relative hand lengths and an 11:10 example; these details do not establish the administration time or scoring procedure for every source image. Rater identity, rater count, training, adjudication and inter-rater agreement remain undocumented. This review supports the scoring framework and clinical background, not dataset provenance or clinical validation of this model.

## Lineage and selection
Original labels come from the project manifest derived from the master evaluation workbook. A fresh raw-pixel audit found 24 duplicate groups involving 49 records (375 distinct raw-pixel groups including singletons). Twelve groups contained inconsistent label vectors: all 25 associated records were held out. For the remaining consistent groups, the lexicographically smallest Image_ID was retained, excluding 12 redundant records. All 400 source files and all original labels remain preserved.

The evaluated subset has 363 unique processed pixel arrays. Split sizes are 254/54/55. The release manifest retains the literal dataset_version `v2_candidate` from run input; it is now evaluated, and its bytes are preserved for reproducibility.

## Image transformation
The original preprocessing notebook applies EXIF orientation, white compositing for transparency, RGB conversion, Lanczos resizing and white padding to 224 by 224. Retraining verifies the saved PNGs and uses them directly. Pixel scale 0–255 enters the model; ResNet50 preprocessing occurs inside it. There is no documented new feature-engineering step beyond standardized image input and learned pretrained features.

## Use and stewardship
Exact duplicate control does not prove participant independence or eliminate near duplicates. Twenty-five records with conflicting labels were excluded, not adjudicated. Exclusion can change sample composition. The test set contains 55 records and is a retrospectively revised internal split, not an external clinical validation cohort. No demographic subgroup evaluation is possible from these fields. Scores are drawing-feature labels, not diagnoses.

Retain the supplied Round 14 source link; recover the acquisition receipt and original-to-project file mapping, and identify the original scorer before claiming independent per-file provenance or verified annotation history. No named data steward or institutional approval is established in this release.

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
