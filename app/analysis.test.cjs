const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const source = fs.readFileSync(__dirname + '/analysis.js', 'utf8');
function adapter(fetch, configured = false) {
  const context = vm.createContext({ fetch, URL, FormData, AbortController, setTimeout, clearTimeout,
    location: { href: 'https://minddial.test/', origin: 'https://minddial.test' } });
  vm.runInContext(configured ? source : source.replace("endpoint: '/api/analyze'", "endpoint: ''"), context);
  return vm.runInContext('({ analyzeClockDrawing, validateAnalysis, decide, validateFile })', context);
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
