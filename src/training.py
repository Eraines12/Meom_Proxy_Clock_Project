"""Reusable training helpers extracted from notebooks/EDA_Baseline_Training.ipynb.

Preserves the evaluated baseline's exact methodology and hyperparameters:
ImageNet-initialized, frozen ResNet50 backbone; global average pooling;
dropout 0.30; four sigmoid outputs; Adam(0.001); binary cross-entropy;
batch size 16; ten epochs; seed 42. No fine-tuning, augmentation, class
weighting, threshold search, or early stopping is added here, matching the
documented run (docs/Model_Card_ResNet50.md, docs/Experiment_Run_Summary.md).

Importing this module builds no model and trains nothing. ``build_resnet50_baseline``
only constructs a graph when called; ``train_model`` only fits when called
explicitly by the caller. Nothing here downloads data or talks to Google Drive.
"""
from __future__ import annotations

from pathlib import Path
from typing import Optional, Sequence

import tensorflow as tf
from tensorflow.keras import layers
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.applications.resnet50 import preprocess_input

DEFAULT_SEED = 42
DEFAULT_EPOCHS = 10
DEFAULT_BATCH_SIZE = 16
DEFAULT_LEARNING_RATE = 0.001
DEFAULT_DROPOUT = 0.30
INPUT_SHAPE = (224, 224, 3)
NUM_OUTPUTS = 4


def build_resnet50_baseline(
    input_shape: Sequence[int] = INPUT_SHAPE,
    dropout: float = DEFAULT_DROPOUT,
    num_outputs: int = NUM_OUTPUTS,
) -> tf.keras.Model:
    """Construct the documented ResNet50 baseline (frozen backbone).

    ResNet50's own ``preprocess_input`` is applied inside the graph, so
    callers must feed raw 0-255 pixel values (see
    ``src.preprocessing.load_partition_raw_pixels``), not pre-scaled [0, 1]
    arrays. Does not compile or train the model.
    """
    base = ResNet50(weights="imagenet", include_top=False, input_shape=tuple(input_shape))
    base.trainable = False
    inputs = layers.Input(tuple(input_shape), name="clock_image")
    x = preprocess_input(inputs)
    x = base(x, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(dropout)(x)
    outputs = layers.Dense(num_outputs, activation="sigmoid", name="criteria_predictions")(x)
    return tf.keras.Model(inputs, outputs)


def compile_model(model: tf.keras.Model, learning_rate: float = DEFAULT_LEARNING_RATE) -> tf.keras.Model:
    """Compile with the documented optimizer, loss, and metric."""
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate),
        loss="binary_crossentropy",
        metrics=[tf.keras.metrics.BinaryAccuracy(name="binary_accuracy")],
    )
    return model


def train_model(
    model: tf.keras.Model,
    X_train,
    y_train,
    X_val,
    y_val,
    epochs: int = DEFAULT_EPOCHS,
    batch_size: int = DEFAULT_BATCH_SIZE,
    seed: int = DEFAULT_SEED,
    csv_log_path: Optional[Path] = None,
    verbose: int = 2,
):
    """Fit the model on already-loaded arrays. Must be called explicitly.

    This function trains immediately when invoked; it is never called by
    importing this module. Training requires the reviewed 363-record
    dataset held in controlled storage (see model/README.md and
    restricted_data/README.md) and is intentionally not run as part of
    this repository cleanup.
    """
    tf.keras.utils.set_random_seed(seed)
    callbacks = []
    if csv_log_path is not None:
        callbacks.append(tf.keras.callbacks.CSVLogger(str(csv_log_path)))
    return model.fit(
        X_train,
        y_train,
        validation_data=(X_val, y_val),
        epochs=epochs,
        batch_size=batch_size,
        verbose=verbose,
        callbacks=callbacks,
    )


def save_model(model: tf.keras.Model, path: Path) -> Path:
    """Save a trained model to a local ``.keras`` path. Caller-invoked only."""
    path = Path(path)
    model.save(path)
    return path


def load_trained_model(path: Path) -> tf.keras.Model:
    """Load a previously saved ``.keras`` model from a local path."""
    return tf.keras.models.load_model(Path(path))
