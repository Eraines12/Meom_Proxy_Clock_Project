"""Reusable evaluation helpers extracted from notebooks/EDA_Baseline_Training.ipynb.

Reproduces the evaluated release's metrics exactly: per-criterion accuracy,
precision, recall, F1, and confusion counts at threshold 0.50; and
total-score agreement (exact match, within-one-point, MAE). These functions
compute metrics on arrays/DataFrames the caller already has in memory; none
of them load data, train, or touch Google Drive.
"""
from __future__ import annotations

from typing import Sequence

import numpy as np
import pandas as pd
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)

from .preprocessing import CRITERION_DISPLAY_NAMES, LABEL_COLUMNS

DEFAULT_THRESHOLD = 0.50


def predict_labels(model, X, batch_size: int = 16, threshold: float = DEFAULT_THRESHOLD):
    """Run inference and threshold probabilities into binary predictions."""
    probabilities = model.predict(X, batch_size=batch_size, verbose=0)
    predictions = (probabilities >= threshold).astype(int)
    return probabilities, predictions


def compute_criterion_metrics(
    y_true: np.ndarray,
    y_pred: np.ndarray,
    criterion_names: Sequence[str] = CRITERION_DISPLAY_NAMES,
) -> pd.DataFrame:
    """Per-criterion Accuracy/Precision/Recall/F1 and confusion counts.

    Mirrors the ``baseline_metrics.csv`` computation in
    notebooks/EDA_Baseline_Training.ipynb. Positive class is feature pass (1).
    """
    rows = []
    n = len(y_true)
    for j, name in enumerate(criterion_names):
        true_j, pred_j = y_true[:, j], y_pred[:, j]
        tn, fp, fn, tp = confusion_matrix(true_j, pred_j, labels=[0, 1]).ravel()
        rows.append(
            {
                "Criterion": name,
                "N": n,
                "Accuracy": accuracy_score(true_j, pred_j),
                "Precision": precision_score(true_j, pred_j, zero_division=0),
                "Recall": recall_score(true_j, pred_j, zero_division=0),
                "F1": f1_score(true_j, pred_j, zero_division=0),
                "TN": int(tn),
                "FP": int(fp),
                "FN": int(fn),
                "TP": int(tp),
            }
        )
    return pd.DataFrame(rows)


def summarize_total_score(y_true: np.ndarray, y_pred: np.ndarray, human_total: np.ndarray) -> dict:
    """Aggregate run summary matching ``run_summary.json``'s evaluation fields.

    ``y_true``/``y_pred`` are the four-label binary arrays; ``human_total``
    is the per-record human score (0-4). AI total is the row-wise sum of
    predicted labels.
    """
    ai_total = y_pred.sum(axis=1)
    error = ai_total - human_total
    return {
        "exact_score_matches": int((error == 0).sum()),
        "exact_score_agreement": float((error == 0).mean()),
        "score_mae": float(np.abs(error).mean()),
        "within_one_point": int((np.abs(error) <= 1).sum()),
        "exact_four_label_matches": int(np.all(y_true == y_pred, axis=1).sum()),
        "binary_accuracy": float((y_true == y_pred).mean()),
    }


def build_predictions_table(
    image_ids: Sequence[str],
    human_total: np.ndarray,
    y_true: np.ndarray,
    y_pred: np.ndarray,
    probabilities: np.ndarray,
    label_columns: Sequence[str] = LABEL_COLUMNS,
) -> pd.DataFrame:
    """Per-record predictions table matching ``test_predictions.csv``'s schema."""
    table = pd.DataFrame({"Image_ID": list(image_ids), "Human_Total": human_total})
    table["AI_Total"] = y_pred.sum(axis=1)
    for j, column in enumerate(label_columns):
        table[f"{column}_human"] = y_true[:, j].astype(int)
        table[f"{column}_probability"] = probabilities[:, j]
        table[f"{column}_predicted"] = y_pred[:, j]
    return table
