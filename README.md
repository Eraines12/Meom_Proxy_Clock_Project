# Meom_Proxy_Clock_Project

An educational research prototype for feature-based clock-drawing scoring with a ResNet50 baseline. **It is not a dementia diagnosis tool and is not intended for clinical use.**

| Explore | Contents |
| --- | --- |
| [📚 Documentation](docs/) | Project reports, data documentation, evaluation, and model card |
| [📖 References](docs/References/) | Source provenance and public source links |
| [📊 Results and charts](results/) | Aggregate metrics, training history, and chart images |
| [🗂️ Dataset](Dataset/) | Dataset scope and publication boundary |
| [🔀 Splits](splits/) | Aggregate split documentation |
| [📓 Notebooks](notebooks/) | Checked-notebook release status |
| [🧠 Model](model/) | ResNet50 baseline release status |
| [🔒 Controlled data](restricted_data/) | Restricted materials intentionally absent from GitHub |

## Project goal

The team is building a prototype that predicts four visible clock-drawing features:

1. Closed circle
2. All 12 correct numbers
3. Correct number placement
4. Correct hand placement

Each predicted feature contributes one point, producing a 0–4 feature score. The scoring framework is based on the four-point method summarized by [Palsetia et al. (2018)](https://pmc.ncbi.nlm.nih.gov/articles/PMC5795671/). The work documents data preparation, feature scoring, baseline training, and aggregate evaluation; it does not establish diagnosis, screening performance, or clinical validity.

## Start with the reports

| Report | What it covers |
| --- | --- |
| [Final Data Report](docs/Final_Data_Report.md) | Integrated project narrative and evaluated-release summary |
| [Dataset Card](docs/Dataset_Card.md) | Dataset composition, lineage, use, and stewardship |
| [Data Quality Report](docs/Data_Quality_Report.md) | Review decisions, exclusions, and unresolved evidence gaps |
| [Evaluation Report](docs/Evaluation_Report.md) | Held-out metrics, score agreement, and limitations |
| [Model Card](docs/Model_Card_ResNet50.md) | ResNet50 baseline, intended use, and performance boundaries |
| [Source Provenance](docs/References/Source_Provenance.md) | Source roles, verification limits, and access conditions |

## Completed baseline

The project began with **400 original image records**. The evaluated release contains **363 reviewed records**, with a **254/54/55** train/validation/test split; 25 conflicting-label records and 12 redundant copies were excluded from that release. The held-out baseline reports **79.55% test binary accuracy**, **40.00% exact total-score agreement**, and **0.8182 score MAE**. These are internal results from 55 test records, not external or clinical validation. See the [Evaluation Report](docs/Evaluation_Report.md) and [aggregate result tables](results/) for interpretation.

<p align="center">
  <a href="results/"><img src="results/held_out_performance.png" alt="Held-out feature performance chart" width="48%"></a>
  <a href="results/"><img src="results/training_history.png" alt="Training history chart" width="48%"></a>
</p>

## Source, workflow, and stewardship

[NHATS Round 14 Clock Drawing Images](https://www.nhats.org/data-access/nhats/14) is the **team-reported dataset source**. Although the official source listing is available, the local files have not been independently matched to that release. The documented workflow is: authorized acquisition and review; controlled preprocessing and splitting; ResNet50 baseline training; aggregate evaluation; and documentation of limitations and provenance. The reports record the work contributors have documented in those stages rather than asserting undocumented individual roles.

This repository intentionally contains only checked documentation, aggregate CSV summaries, and charts without drawings. It excludes raw and processed clock images, row-level labels, split manifests, predictions, image hashes, dataset archives, unreviewed notebooks, and unchecked model weights. Under the [NHATS Conditions of Use](https://www.nhats.org/conditions-of-use), access is individual and public-use data may not be transferred or uploaded to covered public AI platforms, including Copilot. A private GitHub repository does not change those terms.
