const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const source = fs.readFileSync(__dirname + '/analysis.js', 'utf8');
function adapter(fetch, configured = false) {
  const context = vm.createContext({ fetch, URL, FormData, AbortController, setTimeout, clearTimeout,
    location: { href: 'https://minddial.test/', origin: 'https://minddial.test' } });
  vm.runInContext(configured ? source : source.replace("endpoint: '/api/analyze'", "endpoint: ''"), context);
  return vm.runInContext('({ analyzeClockDrawing, validateAnalysis, validateGeminiAnalysis, decide, validateFile })', context);
}
const file = new Blob(['image'], { type: 'image/png' });
const response = { modelVersion: 'resnet50-test', confidences: {
  closedCircle: 0.87, all12Numbers: 0.8, numberPosition: 0, correctHands: 1 } };
test('unconfigured adapter makes no request and generates no score', async () => {
  await assert.rejects(adapter(() => assert.fail('Unexpected upload')).analyzeClockDrawing(file), /notConnected/);
});
test('binary boundary and separate review warning', () => {
  const api = adapter();
  assert.equal(api.decide(0.87, 0.9).status, 'fail');
  assert.equal(api.decide(0.87, 0.9).needsReview, true);
  assert.equal(api.decide(0.9, 0.9).status, 'pass');
  const result = api.validateAnalysis(response);
  assert.equal(result.criteria.filter(c => c.status === 'pass').length, 2);
});
test('reject incomplete, nonfinite, out-of-range and unversioned inference', () => {
  const api = adapter();
  for (const value of [undefined, { ...response, modelVersion: '' },
    ...[NaN, Infinity, -1, 1.01, '0.9', undefined].map(closedCircle => ({ ...response,
      confidences: { ...response.confidences, closedCircle } }))]) {
    assert.throws(() => api.validateAnalysis(value), /invalidResponse/);
  }
});
test('transport sends only drawing with anonymous filename', async () => {
  const api = adapter(async (url, options) => {
    assert.equal(url.pathname, '/api/analyze');
    assert.deepEqual([...options.body.keys()], ['image']);
    assert.equal(options.body.get('image').name, 'clock.png');
    assert.equal(options.credentials, 'omit');
    return { ok: true, json: async () => response };
  }, true);
  assert.equal((await api.analyzeClockDrawing(file)).modelVersion, response.modelVersion);
});
test('HTTP, network and malformed responses never become scores', async () => {
  for (const fetch of [async () => ({ ok: false }), async () => { throw Error('offline'); },
    async () => ({ ok: true, json: async () => ({}) })]) {
    await assert.rejects(adapter(fetch, true).analyzeClockDrawing(file), /requestFailed|invalidResponse/);
  }
});
test('file guard rejects wrong types, empty and oversized files', () => {
  const api = adapter();
  for (const file of [{ type: 'image/svg+xml', size: 10 }, { type: 'image/png', size: 0 },
    { type: 'image/png', size: 10485761 }]) assert.throws(() => api.validateFile(file));
});


test('configured but unavailable route remains pending without a score', async () => {
  for (const response of [{ ok: false, status: 404 },
    { ok: false, status: 503, json: async () => ({ detail: 'notConnected' }) }]) {
    await assert.rejects(adapter(async () => response, true).analyzeClockDrawing(file), /notConnected/);
  }
});

const geminiBody = (decisions, extra = {}) => ({ scorer: 'gemini', modelVersion: 'gemini-test',
  needsReview: decisions.includes('Unsure'),
  totalScore: decisions.includes('Unsure') ? null : decisions.filter(d => d === 'Pass').length,
  criteria: ['closedCircle', 'all12Numbers', 'numberPosition', 'correctHands'].map((key, i) =>
    ({ key, decision: decisions[i], visualReason: 'Visible detail ' + key })), ...extra });
test('Gemini scorer is opt-in, sends only the image, and validates results', async () => {
  const calls = [];
  const api = adapter(async (url, options) => { calls.push({ url: String(url), body: options.body });
    return Response.json(String(url).includes('scorer=gemini') ? geminiBody(['Pass', 'Pass', 'Pass', 'Fail']) : response); }, true);
  await api.analyzeClockDrawing(file);
  assert.equal(calls[0].url, 'https://minddial.test/api/analyze');
  const result = await api.analyzeClockDrawing(file, { scorer: 'gemini' });
  assert.equal(calls[1].url, 'https://minddial.test/api/analyze?scorer=gemini');
  assert.deepEqual([...calls[1].body.keys()], ['image']);
  assert.equal(result.scorer, 'gemini'); assert.equal(result.totalScore, 3);
});
test('Gemini Unsure leaves the total pending and inconsistent data is rejected', () => {
  const api = adapter();
  const review = api.validateGeminiAnalysis(geminiBody(['Pass', 'Unsure', 'Pass', 'Pass']));
  assert.equal(review.needsReview, true); assert.equal(review.totalScore, null);
  const bad = [geminiBody(['Pass', 'Pass', 'Pass', 'Pass'], { totalScore: 3 }),
    geminiBody(['Pass', 'Maybe', 'Pass', 'Pass']), geminiBody(['Pass', 'Pass', 'Pass', 'Pass'], { criteria: [] }),
    geminiBody(['Pass', 'Unsure', 'Pass', 'Pass'], { totalScore: 3 }), { scorer: 'other' }];
  for (const data of bad) assert.throws(() => api.validateGeminiAnalysis(data), /invalidResponse/);
});
test('Gemini error codes surface as clear errors', async () => {
  for (const detail of ['geminiNotConfigured', 'geminiUnavailable', 'geminiInvalidResponse']) {
    const api = adapter(async () => Response.json({ detail }, { status: 503 }), true);
    await assert.rejects(api.analyzeClockDrawing(file, { scorer: 'gemini' }), new RegExp(detail));
  }
});
