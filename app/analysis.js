// Same-origin backend route. Missing/unready service means no score.
// Keep same-origin: route this path through a server-side proxy when needed.
const analysisConfig = Object.freeze({ endpoint: '/api/analyze', timeoutMs: 30000 });
// Provisional research cutoffs, not validated clinical settings.
const thresholds = Object.freeze({ closedCircle: 0.90, all12Numbers: 0.80, numberPosition: 0.75, correctHands: 0.80 });
const criterionKeys = Object.freeze(Object.keys(thresholds));

function decide(confidence, threshold) {
  return { status: confidence >= threshold ? 'pass' : 'fail',
    needsReview: Math.abs(confidence - threshold) <= 0.08 };
}

function validateFile(file) {
  if (!file || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('invalidType');
  if (!file.size || file.size > 10 * 1024 * 1024) throw new Error('invalidSize');
}

function validateAnalysis(data) {
  if (!data || typeof data.modelVersion !== 'string' || !data.modelVersion.trim() ||
      data.modelVersion.length > 120 || !data.confidences ||
      !criterionKeys.every(key => typeof data.confidences[key] === 'number' &&
        Number.isFinite(data.confidences[key]) && data.confidences[key] >= 0 && data.confidences[key] <= 1)) {
    throw new Error('invalidResponse');
  }
  return { modelVersion: data.modelVersion, criteria: criterionKeys.map(key => ({ key,
    confidence: data.confidences[key], threshold: thresholds[key],
    ...decide(data.confidences[key], thresholds[key]) })) };
}

async function analyzeClockDrawing(file) {
  validateFile(file);
  if (!analysisConfig.endpoint) throw new Error('notConnected');
  const endpoint = new URL(analysisConfig.endpoint, location.href);
  if (endpoint.origin !== location.origin) throw new Error('invalidEndpoint');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), analysisConfig.timeoutMs);
  const body = new FormData();
  // Send only the drawing, with a generic filename; no demographics or original filename.
  body.append('image', file, 'clock.' + ({ 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' })[file.type]);
  try {
    const response = await fetch(endpoint, { method: 'POST', body, signal: controller.signal,
      credentials: 'omit', cache: 'no-store', redirect: 'error', referrerPolicy: 'no-referrer' });
    if (!response.ok) {
      if (response.status === 404) throw new Error('notConnected');
      if (response.status === 413) throw new Error('uploadTooLarge');
      let detail;
      try { detail = (await response.json()).detail; } catch { /* non-JSON failure */ }
      throw new Error(detail === 'notConnected' ? 'notConnected' : 'requestFailed');
    }
    return validateAnalysis(await response.json());
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('timedOut');
    if (['invalidResponse', 'notConnected', 'uploadTooLarge'].includes(error.message)) throw error;
    throw new Error('requestFailed');
  } finally { clearTimeout(timer); }
}
