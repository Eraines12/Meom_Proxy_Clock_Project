# Final Data Report — Weeks 4–6

AI Clock Drawing | Final documentation | 29 September 2026

**RESTRICTED PROJECT DOCUMENTATION | Educational research only. Keep raw and processed drawings, image montages, row-level labels and the dataset ZIP out of GitHub and public documentation. Private storage does not override source data-use restrictions. This package grants no new license or clinical approval. Only authorized recipients may access the restricted dataset.**

## Executive overview
This milestone delivers a reproducible data preparation and ResNet50 baseline workflow for AI-assisted clock-drawing feature scoring. The original 400 images were retained. A conservative reviewed subset of 363 images was trained and evaluated after excluding 25 conflicting-label duplicate records and 12 redundant consistent copies. Fresh image checks verified unique processed content in the selected set. Training completed successfully and the saved model reproduced its predictions after reload.

## Week 4 — Acquisition, organization and ethics
The team reports that the project's clock-drawing images were obtained from NHATS Round 14 and has supplied the [Round 14 public-files / Clock Drawing Images page](https://www.nhats.org/data-access/nhats/14) as the project source. That official page lists Clock Drawing Images in TIFF format. The [NHATS Data Access page](https://www.nhats.org/data-access) documents the access route. This establishes the team-reported source and an independently checked source listing; it does not independently authenticate each of the 400 project files. The existing project documentation does not establish an acquisition receipt, original archive-to-file mapping, or sampling procedure. Local image IDs and hashes document internal lineage, not NHATS origin. The Sato et al. (2022) citation in the presentation remains research background, not evidence of these files' provenance.

The project stores raw and processed images separately from notebooks, split manifests, results, models and documentation. Raw images remain excluded from the documentation and dataset ZIP; the ZIP contains restricted processed images only. This release is an educational prototype. Access restrictions do not establish that all underlying source permissions have been verified.

The project uses the Pfizer/Eisai four-point CDT framework summarized by [Palsetia et al. (2018), Scoring systems, item 8](https://pmc.ncbi.nlm.nih.gov/articles/PMC5795671/): one point for each satisfied feature—closed circle, all 12 correct numbers, correct number placement and correct hand placement. The four binary labels sum to a 0–4 feature score. The paper's scoring description has now been checked. The project's presentation (slides 4–6) supplies operational details, including relative hand lengths and an 11:10 example; these details do not establish the administration time or scoring procedure for every source image. Rater identity, rater count, training, adjudication and inter-rater agreement remain undocumented. This review supports the scoring framework and clinical background, not dataset provenance or clinical validation of this model.

## Week 5 — Cleaning, transformations and splitting
Exact raw-pixel hashing found 24 duplicate groups involving 49 records. Twelve groups disagreed on human labels. All 25 records from those groups were set aside; no guessed corrections were introduced. Twelve redundant records from consistent groups were excluded while retaining a deterministic representative. The 363 selected PNGs passed RGB/224x224 and unique-pixel checks. Source images and labels remain intact for future review.

Preprocessing applies orientation correction, transparent-background compositing onto white, RGB conversion and aspect-preserving resizing/padding. ImageNet ResNet50 feature extraction is applied inside the model workflow. The new score-stratified manifest assigns 254 training, 54 validation and 55 test images. Participant-level independence remains unknown.

## Week 6 — Exploratory analysis
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

High scores dominate: 230/363 records (63.36%) score 3 or 4. Score 0 has 25 records (6.89%). Correct number position has the lowest pass prevalence (154/363, 42.42%). These are sample characteristics, not population estimates. Distribution charts and training curves (held in controlled project storage) accompany these tables.

## Baseline and evaluation
The model uses a frozen pretrained ResNet50, global average pooling, dropout 0.30 and four sigmoid outputs. It trained for ten epochs using Adam 0.001, batch size 16 and seed 42. Test evaluation was performed after fitting.

| Criterion | Accuracy | Precision | Recall | F1 |
| --- | --- | --- | --- | --- |
| Closed Circle | 81.82% | 82.69% | 97.73% | 89.58% |
| Correct Number Position | 69.09% | 54.17% | 68.42% | 60.47% |
| All 12 Numbers | 87.27% | 89.80% | 95.65% | 92.63% |
| Correct Hands | 80.00% | 80.00% | 94.74% | 86.75% |

The baseline makes 175/220 correct binary decisions (79.55%). It exactly matches the summed human score for 22/55 images (40.00%), is within one point for 46/55 (83.64%), and has MAE 0.8182. All-12-numbers has the highest F1; number position the lowest. Pass-heavy labels and low specificity limit the meaning of high ordinary accuracy. The historical 35% agreement and literature figures in the presentation are separate evidence, not interchangeable comparisons.

## Limitations and conclusion
Exact duplicate control does not prove participant independence or eliminate near duplicates. Twenty-five records with conflicting labels were excluded, not adjudicated. Exclusion can change sample composition. The test set contains 55 records and is a retrospectively revised internal split, not an external clinical validation cohort. No demographic subgroup evaluation is possible from these fields. Scores are drawing-feature labels, not diagnoses.

The milestone demonstrates a functioning reproducible pipeline, not a clinically validated screening system. The final files distinguish the team-reported NHATS Round 14 source from unresolved per-file provenance and annotation history. No additional training is required to present this completed baseline honestly.

## Assignment coverage
| Requirement | Evidence / status |
| --- | --- |
| Week 4: sources and collection | NHATS Round 14 source link supplied by team; official image listing checked; per-file acquisition lineage remains unverified |
| Week 4: organization | Original Dataset, notebooks, model, results and docs retained; historical archive separated |
| Week 4: privacy and ethics | Restricted image package, no public/domain access observed; data-use limits documented |
| Week 4–5: documentation | Dataset card, dictionary, quality report, split summary and source limitations |
| Week 5: cleaning and quality | Fresh duplicate audit; 25 conflicting records held out; 12 redundant copies excluded |
| Week 5: features and transformations | RGB 224x224, orientation/white-padding workflow and ResNet50 preprocessing documented |
| Week 5: splits | 254/54/55 deterministic score-stratified manifest and hashes |
| Week 6: EDA | Actual class/score tables and saved distribution charts |
| Week 6: patterns | Pass-heavy labels and weak number-position performance described |
| Week 6: baseline | Ten completed epochs; reload check; saved model and test metrics |
| Week 6: insights/deliverable | Final Data Report plus restricted preprocessed dataset |
| Class activities | Presentations, consultation and peer feedback attendance cannot be inferred from files |

The supplied rubric specifies Data Report and Preprocessed Dataset, worth 15%. It does not itself state a GitHub requirement or minimum accuracy threshold. Team administrative submission, access checks for the instructor and class activities remain human responsibilities; no submission is claimed here.

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
