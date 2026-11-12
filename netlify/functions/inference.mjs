// Netlify hosts the static app; the Python model runs on a separate server.
// Set these values in Netlify's server-side environment, never in app/.
const json = (body, status = 200) => Response.json(body, { status,
  headers: { 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' } });

export default async function handler(request) {
  const path = new URL(request.url).pathname;
  if (!['/api/analyze', '/api/health', '/api/scorers'].includes(path)) return json({ detail: 'Not found' }, 404);
  const method = path === '/api/analyze' ? 'POST' : 'GET';
  const scorer = new URL(request.url).searchParams.get('scorer') || '';
  if (path !== '/api/analyze' ? false : !['', 'default', 'gemini'].includes(scorer)) return json({ detail: 'Unknown scorer' }, 422);
  if (request.method !== method) return json({ detail: 'Method not allowed' }, 405);
  const origin = process.env.MINDDIAL_BACKEND_ORIGIN;
  const token = process.env.MINDDIAL_API_TOKEN;
  if (!origin || !token) return json({ detail: 'notConnected', ready: false }, 503);
  try {
    const url = new URL(origin);
    if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
      return json({ detail: 'notConnected' }, 503);
    }
    const headers = { Authorization: 'Bearer ' + token };
    let body;
    if (method === 'POST') {
      // Stay below Netlify buffered binary request limits. Direct Python supports 10 MB.
      const reader = request.body?.getReader();
      if (!reader) return json({ detail: 'Invalid image' }, 422);
      const parts = []; let size = 0;
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        size += value.length;
        if (size > 4 * 1024 * 1024) { await reader.cancel(); return json({ detail: 'uploadTooLarge' }, 413); }
        parts.push(value);
      }
      body = Buffer.concat(parts);
      headers['Content-Type'] = request.headers.get('content-type') || '';
    }
    const target = new URL(path, url);
    if (scorer === 'gemini') target.searchParams.set('scorer', 'gemini');
    const result = await fetch(target, { method, headers, body,
      redirect: 'error', signal: AbortSignal.timeout(25000), cache: 'no-store' });
    const data = await result.json();
    // Never forward server diagnostics, arbitrary headers, or cookies to the browser.
    if (!result.ok) {
      const known = ['notConnected', 'geminiNotConfigured', 'geminiUnavailable', 'geminiInvalidResponse'];
      return json({ detail: known.includes(data.detail) ? data.detail : 'requestFailed', ready: false }, result.status);
    }
    if (path === '/api/health') return json({ ready: data.ready === true });
    if (path === '/api/scorers') return json({ default: data.default === true, gemini: data.gemini === true });
    if (scorer === 'gemini') {
      return json({ scorer: 'gemini', modelVersion: data.modelVersion, needsReview: data.needsReview,
        totalScore: data.totalScore,
        criteria: Array.isArray(data.criteria) ? data.criteria.map(c => ({ key: c.key, decision: c.decision, visualReason: c.visualReason })) : [] });
    }
    return json({ modelVersion: data.modelVersion, confidences: data.confidences });
  } catch { return json({ detail: 'requestFailed', ready: false }, 503); }
}

export const config = { path: ['/api/analyze', '/api/health', '/api/scorers'] };
