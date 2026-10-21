# Real ResNet50 inference

This service connects the Clock Test to the trained baseline from the user's
[project folder](https://drive.google.com/drive/folders/1Gmi6yjAYdkOFcUZzhbuWw7LdQSNxgW6B).
It does not retrain, access participant data, or fall back to untrained weights.

The trained checkpoint remains private, matching the existing model storage
policy. Inference, preprocessing, the version/checksum manifest, download tool,
API, deployment files and tests are source-controlled. Do not put weights in
`app/`, GitHub, or the Docker image. The repository's existing model ignore rules
are retained. No dataset files are needed for inference.

The downloaded artifact's MD5 matches the completed notebook's upload record;
its SHA-256 is pinned in `model_manifest.json`. Its embedded metadata records
Keras 3.13.2, which is pinned in the service requirements.

## Run the complete app locally

Use Python 3.12 in a virtual environment, from the repository root:

```sh
python -m pip install -r backend/requirements.txt
```

Download `Clock_Drawing_ResNet50_Model.keras` from the
[verified Drive file](https://drive.google.com/file/d/1WCzLHA0pu7t0NOshVSxa1_TbgHXbMXBK/view)
to `model/Clock_Drawing_ResNet50_Model.keras`. Alternatively, install
`backend/requirements-drive.txt`, authenticate Application Default Credentials
with an account authorized for that Drive file and the Drive read-only scope,
then run `python -m backend.download_model`. No browser token, public sharing,
service key or authentication secret belongs in the repository.

```sh
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --workers 1 --no-access-log
```

Open http://127.0.0.1:8000. The same server hosts `app/` and `/api/analyze`;
no separate frontend preview server is needed. `/api/health` reports readiness.
Use `MINDDIAL_MODEL_PATH` to select another local location for the same pinned
checkpoint. Missing, corrupt or incompatible weights yield HTTP 503
`notConnected`; the app displays “AI model connection pending,” without a score.
The service loads and warms the checkpoint once at startup, rather than on each
request. Restart after fixing model setup.

## Verified preprocessing and output contract

The saved baseline expects float32 RGB 224×224 **raw 0–255 pixels**. Its graph
already contains ResNet50 preprocessing. Do not apply `preprocess_input` or
divide by 255 again. Inputs receive EXIF orientation correction, transparency
flattening onto white, and Lanczos resizing with centered white padding using
the same `ImageOps.pad` operation as the preprocessing notebook. No automatic
circle, numbers, hands, crops or enhancements are added.

Training output order is Closed Circle, Correct Number Position, All 12
Numbers, Correct Hands. `inference.py` maps that order to the frontend keys,
which display All 12 Numbers before Correct Number Position. Values are raw
sigmoid outputs, not calibrated clinical probabilities.

The existing frontend cutoffs (0.90 / 0.80 / 0.75 / 0.80 in UI order) remain
unchanged. The historical baseline report used 0.50 for all outputs, so its
reported metrics do not describe this app's current cutoff policy. Four binary
decisions sum to 0–4; Needs Review is a warning only. Demographics cannot enter
this API; it accepts only one multipart field named `image`.

## Deployment

For a single host, build the root `Dockerfile`, mount the private checkpoint
read-only and set `MINDDIAL_MODEL_PATH` to that mount. Set `PORT` as required by
the host. Provision HTTPS and request/rate limits on the hosting platform. The
container runs as a non-root user with one model worker. Hosting may have costs;
no remote infrastructure is provisioned by these files.

For the existing Netlify frontend, `netlify.toml` publishes only `app/` and the
two same-origin API paths are handled by `netlify/functions/inference.mjs`.
Deploy the Python service separately, then set **server-side** Netlify values:

- `MINDDIAL_BACKEND_ORIGIN`: the actual HTTPS origin of that service.
- `MINDDIAL_API_TOKEN`: a generated secret also set on the Python host.

The proxy forwards that token server-to-server, with no browser credentials,
original browser headers or cookies. It never downloads the weights. If these
environment values are missing, it returns `notConnected` rather than a score.
The actual hosting origin must be supplied by the deployed service; no fictional
URL or live deployment is included. Direct Python supports images up to 10 MB;
the buffered Netlify proxy caps the entire multipart request at 4 MB to stay
within platform limits. The app explains a host-size rejection.

## Privacy and validation

Images and results are not persisted by the application. Multipart parsing may
use an OS temporary file, which is closed/deleted at request completion. The
Docker image excludes data and weights. No request bodies, images, filenames,
demographics, prediction values or secrets are logged by service code; access
logs are disabled in the provided launch command. Configure host/proxy logging
and temporary-storage policies consistently before participant use. Decode,
file-size, frame-count and pixel limits are enforced server-side. Format
validation is not a sharpness, lighting or complete-clock check.

```sh
python -m pip install -r backend/requirements-test.txt
python -m pytest backend -q
node --test app/analysis.test.cjs netlify/tests/inference.test.mjs
```

The real-checkpoint test runs when `MINDDIAL_MODEL_PATH` is set. It sends only a
synthetic image and compares API predictions to direct model inference, without
claiming new performance or clinical validation. Unit tests cover orientation,
padding, raw-pixel scaling, output order, invalid files, size limits, missing
models, authentication and the boundary preventing private files being served.
