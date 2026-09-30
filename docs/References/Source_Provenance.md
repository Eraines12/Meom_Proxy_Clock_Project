# AI Clock Drawing — References and Source Provenance

Source review and documentation revision: 30 September 2026  
Project: Clock_Drawing_Project / docs / References

## Project provenance statement

The project team identifies **NHATS Round 14 Clock Drawing Images** as the source of the original 400 clock-drawing files and has supplied the official Round 14 source link. The NHATS page independently confirms that a Round 14 Clock Drawing Images release is listed. This is a team-reported source attribution supported by a verified release listing; it is not independent authentication of every local image.

The evaluated release remains the documented 363-record subset, with 254 training, 54 validation and 55 test records. This source review makes no changes to the dataset, annotations, selection decisions, split manifest, trained model or evaluation.

## Source register

### 1. Clinical scoring framework

Palsetia, D., Rao, G. P., Tiwari, S. C., Lodha, P., & De Sousa, A. (2018). *The Clock Drawing Test versus Mini-mental Status Examination as a Screening Tool for Dementia: A Clinical Comparison.* Indian Journal of Psychological Medicine, 40(1), 1–10.

- User-supplied article: https://pmc.ncbi.nlm.nih.gov/articles/PMC5795671/
- DOI: https://doi.org/10.4103/IJPSYM.IJPSYM_244_17
- PMID: 29403122; PMCID: PMC5795671.
- Relevant location: “The Clock Drawing Test” → “Scoring systems,” item 8, Pfizer Inc. and Eisai Inc. system.
- Role: peer-reviewed review supporting the intended scoring framework; it is a secondary account, not an image acquisition record.

The four scored features map to the project fields as follows:

| Project field | Scoring concept | Project encoding |
| --- | --- | --- |
| Closed_Circle | Closed clock outline | 1 = pass; 0 = fail |
| Includes_all_12_correct_Numbers | Complete set of twelve correct numerals | 1 = pass; 0 = fail |
| Number_correct_Position | Correct numeral placement | 1 = pass; 0 = fail |
| Places_Hands_in_correct_positions | Correct placement of clock hands | 1 = pass; 0 = fail |

Human_Total is the sum, ranging from 0 to 4. The review supports these feature concepts, but cannot validate the project's labels, identify its raters, or establish diagnostic performance. The presentation's hand-length details and 11:10 example describe intended project implementation; administration for each drawing remains unverified.

### 2. NHATS access route

National Health and Aging Trends Study. *Data Access.*  
https://www.nhats.org/data-access

This page explains registration and distinguishes public, sensitive and restricted access categories. Sensitive and restricted files require additional applications. “Public use” is an access category, not an open redistribution license.

### 3. Team-reported image dataset source

National Health and Aging Trends Study. *NHATS Round 14 Files.*  
https://www.nhats.org/data-access/nhats/14

The official page lists Clock Drawing Images as TIFF under Public Use Files and identifies NHATS_R14_ClockDrawings.zip. The release page supplies DOI 10.82375/7m6h-7s95. These details identify the listed release; they do not establish the exact archive downloaded by the team, its download date or a match to the local Clock_### files.

The original 400 images and the selected 363 records are project collection/subset counts, not the documented size of the complete NHATS Round 14 release. “Restricted” in project documentation describes controlled handling; it does not reclassify this public-use image listing as NHATS's separate restricted-file category.

### 4. Governing access and use conditions

National Health and Aging Trends Study. *Conditions of Use for NHATS and NSOC Data.*  
https://www.nhats.org/conditions-of-use

The current main conditions require individual registration, prohibit public-use data transfers and covered public LLM/AI uploads, and limit use to scientific research with aggregate reporting/analysis. The page's April 2026 update removes the former supervised-staff/student sharing exception; older repeated footer text should not be relied upon as that exception.

**Project handling rule:** Restricted, raw and processed images, participant-drawing montages, row-level labels and dataset archives must not be placed in GitHub or public documentation. Private repositories or shared Drive storage do not override NHATS terms. Each collaborator must obtain access under the applicable conditions. Documentation and permitted aggregate results are the appropriate public-facing materials.

## What is established and what remains open

| Question | Current evidence |
| --- | --- |
| Which dataset source does the team report? | NHATS Round 14, through the supplied official image-release page |
| Does that official page list clock images? | Yes; the public-use TIFF image listing was checked |
| Is the scoring reference identified? | Yes; Palsetia et al. (2018), Pfizer/Eisai four-point description |
| Is every local image independently authenticated to that release? | No; this documentation review establishes no original-archive-to-project mapping |
| Do project IDs or pixel hashes prove NHATS origin? | No; they support internal record identity, duplicate checks and processing lineage |
| Are acquisition date, sampling method and annotation history established? | No; acquisition records, rater details and adjudication evidence remain necessary |
| Does the source link prove participant independence or clinical model validity? | No; existing limitations and evaluation interpretations remain applicable |

To strengthen per-file provenance, the team should retain its acquisition record, archive filename/version and checksum, plus a controlled mapping from original source filenames to project IDs. Preserve this information under the applicable access terms. Do not infer participant IDs, download dates or original scoring personnel.

## Documentation impact and preservation

This record replaces the earlier blanket claim that the exact source link/round is unknown. It preserves the narrower, material distinction between team attribution and independently verified file provenance. The existing Clinical_Scoring_Method_Source_Palsetia_2018 record remains the scoring-specific companion.

The Dataset Card, Final Data Report, README, Data Quality Report, Data Dictionary, Model Card, Evaluation Report, Split Manifest Summary and Experiment Run Summary cite the supplied sources. Their completed run remains resnet50_v2_20260929T232102Z_1e7339. Reported test binary accuracy remains 79.55%, exact total-score agreement 40.00% and score MAE 0.8182. No training or data modification forms part of this documentation revision.

