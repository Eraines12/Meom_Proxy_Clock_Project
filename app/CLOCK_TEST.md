# Clock Test flow

Setup → Clock Test → Analysis (preview and confirmation) → Results.

The test asks the participant to draw a clock with all numbers and hands at
11:10. The drawing area starts completely blank. Mouse, touch and stylus use
Pointer Events; keyboard users can move with arrow keys and toggle the pen with
Space (Escape lifts it, Shift + arrows moves farther). Pen, eraser, undo and
clear controls operate locally. Paper drawings can be uploaded or photographed
on devices supporting camera capture. Camera availability depends on the device.

Submit Drawing exports an opaque white-background PNG Blob. Both canvas and
paper images use the same validation and confirmation preview, followed by
`analyzeClockDrawing(image)`. Only confirming Analyze can send the image.
Drawings, stroke history, setup and results remain in page memory; reset clears
them. Only existing display preferences are stored on the device.

## Real ResNet50 inference

The real service, verified preprocessing, output mapping and private-checkpoint
loader are now in `backend/`. The app calls `/api/analyze`; the same-origin
service or Netlify proxy must be running. See [backend setup](../backend/README.md)
for the pinned Drive artifact, local run steps and deployment configuration.
The deployment checklist below still applies before live participant use.

- Deploy a server-side inference service loading the trained, versioned weights.
  Match training preprocessing, orientation, resizing and normalization, and
  validate canvas drawings as well as paper photographs.
- Provide a same-origin proxy route and configure `analysisConfig.endpoint` in
  `analysis.js`. Keep credentials and model weights off the frontend.
- Accept multipart `image` and return `modelVersion` plus numeric confidences
  between 0 and 1 for `closedCircle`, `all12Numbers`, `numberPosition` and
  `correctHands`. See `validateAnalysis` for the existing response contract.
- Validate/calibrate the four provisional thresholds on held-out data and
  evaluate performance across input methods. Review privacy, retention and
  deployment consent before collecting real participant drawings.

Demographics are never sent to inference or used to change the score. The
score remains the sum of four binary criteria (0–4); Needs Review is a separate
warning. Until an endpoint is configured, analysis displays “AI model connection
pending” and produces no score. Image-quality checks remain explicitly unchecked.

## Verification

Run `node --test app/analysis.test.cjs` and syntax-check both app scripts.
Browser checks cover setup → blank test, mouse and keyboard drawing, undo to
empty, PNG export → confirmation, pending-model analysis, paper image upload,
reset, locale switching and a 390-pixel mobile layout. Physical touchscreen,
stylus and camera capture still need testing on representative devices.
