import { test } from 'node:test';
import assert from 'node:assert/strict';
import handler from '../functions/inference.mjs';

test('missing backend configuration returns pending, without a score', async () => {
  delete process.env.MINDDIAL_BACKEND_ORIGIN;
  delete process.env.MINDDIAL_API_TOKEN;
  const response = await handler(new Request('https://app.test/api/analyze', { method: 'POST' }));
  assert.equal(response.status, 503);
  assert.equal((await response.json()).detail, 'notConnected');
});

test('proxy sends server-side token without forwarding browser cookies', async () => {
  process.env.MINDDIAL_BACKEND_ORIGIN = 'https://model.test';
  process.env.MINDDIAL_API_TOKEN = 'test-only';
  const original = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    assert.equal(url.href, 'https://model.test/api/analyze');
    assert.equal(options.headers.Authorization, 'Bearer test-only');
    assert.equal(options.headers.Cookie, undefined);
    assert.equal(options.redirect, 'error');
    assert.equal(options.body.toString(), 'fixture');
    return Response.json({ modelVersion: 'test-only', confidences: {}, privateDiagnostic: 'omit' });
  };
  try {
    const response = await handler(new Request('https://app.test/api/analyze', {
      method: 'POST', body: 'fixture', headers: { 'Content-Type': 'multipart/form-data; boundary=test', Cookie: 'private' }
    }));
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.deepEqual(Object.keys(await response.json()), ['modelVersion', 'confidences']);
  } finally { globalThis.fetch = original; }
});

test('proxy bounds uploaded bytes and rejects invalid configuration', async () => {
  const response = await handler(new Request('https://app.test/api/analyze', {
    method: 'POST', body: new Uint8Array(4 * 1024 * 1024 + 1)
  }));
  assert.equal(response.status, 413);
  process.env.MINDDIAL_BACKEND_ORIGIN = 'http://model.test';
  assert.equal((await handler(new Request('https://app.test/api/health'))).status, 503);
  delete process.env.MINDDIAL_BACKEND_ORIGIN;
  delete process.env.MINDDIAL_API_TOKEN;
});
