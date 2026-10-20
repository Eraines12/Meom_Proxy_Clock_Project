# MindDial frontend integration

`analysis.js` owns the inference boundary. Set its deployment-only `endpoint`
to a same-origin route such as `/api/analyze`. The shipped empty endpoint makes
no network request and returns `notConnected`; no demo scores are available.
Do not put service secrets or weights in the frontend.

The adapter posts multipart field `image` (JPEG, PNG or WebP, maximum 10 MB)
with an anonymous filename. It never sends demographics, consent details,
reason for use, or display preferences. Images and results stay in page memory;
object URLs are revoked on replacement/removal. Only display settings use local
storage. Source images can contain embedded metadata: the real service must
strip metadata, avoid image/request-body logging, and define deletion/retention
before deployment. Review the consent/privacy copy against that actual policy.

Required successful JSON response (values below describe the schema, not data):

```text
{
  modelVersion: nonempty string (maximum 120 characters),
  confidences: {
    closedCircle: number in [0,1],
    all12Numbers: number in [0,1],
    numberPosition: number in [0,1],
    correctHands: number in [0,1]
  }
}
```

Each number must be the probability of **passing** that criterion, in the
documented order/mapping. Missing, invalid, HTTP-error or timed-out responses
never produce a score. The frontend ignores server-provided totals or labels.
It computes PASS=1 at or above the configured criterion threshold and FAIL=0
below it, summing to an integer 0–4. Needs Review is an independent warning
within 0.08 of either side of a threshold and does not alter points. Thresholds
are frozen deployment settings; the existing provisional values are retained,
including 0.90 for closed circles. They have not been clinically validated.

Real inference still requires a deployed service, trained checkpoint, exact
training preprocessing (orientation, crop, size, normalization), verified output
mapping and probability conversion, server-side file/decode/size checks, request
limits and privacy policy. Verify the end-to-end service against held-out data,
including open circles and threshold calibration, before claiming performance.
No model service, weights, quality detector, explanation generator, or medical
interpretation has been implemented here. Image format decoding is not an image
quality check; sharpness, framing and lighting remain Not checked.

English is the fallback dictionary. Spanish has broader coverage; Vietnamese,
Chinese, Arabic and French remain partial. New strings fall back to English;
Arabic sets both `lang=ar` and `dir=rtl`, while probability meters stay LTR.
Translation completion and native-speaker review are still needed.

Run adapter regression checks with `node --test app/analysis.test.cjs`.
Fixtures exist only in tests and cannot be reached from the app.
