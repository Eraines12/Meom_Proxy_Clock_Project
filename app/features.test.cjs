const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const context = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(__dirname, 'features.js'), 'utf8') +
  '\nthis.api={fillTemplate,explainCriterion,explanationText,scoreOf,nextZoom,nextTurns,orientedSize,speechSummary,pickVoice,reportModel,maxZoom};', context);
const api = context.api;

const strings = {
  whatClosed: 'Closed circle.', whatNumbers: 'All 12 numbers.', whatPosition: 'Number placement.', whatHands: 'Hands show 11:10.',
  whyPass: 'Confidence {pct}% met the {threshold}% cutoff.', whyFail: 'Confidence {pct}% was below the {threshold}% cutoff.',
  whyNear: 'Close to the cutoff.', whyLimit: 'Only the model score.', pass: 'Pass', fail: 'Fail', scoreNote: 'Not a diagnosis.',
  speakScore: 'Final score: {score} out of 4.', printTitle: 'MindDial results',
  critClosed: 'Closed circle', critNumbers: 'All 12 numbers', critPosition: 'Number position', critHands: 'Correct hands'
};
const t = key => strings[key] ?? key;
const c = (key, confidence, threshold, status) => ({ key, confidence, threshold, status });

// Synthetic clocks: A is a good clock, B has wrong hands, C is near the cutoff.
const clockA = { modelVersion: 'synthetic-1', criteria: [c('closedCircle', .97, .9, 'pass'), c('all12Numbers', .92, .8, 'pass'), c('numberPosition', .88, .75, 'pass'), c('correctHands', .93, .8, 'pass')] };
const clockB = { modelVersion: 'synthetic-1', criteria: [c('closedCircle', .95, .9, 'pass'), c('all12Numbers', .2, .8, 'fail'), c('numberPosition', .3, .75, 'fail'), c('correctHands', .1, .8, 'fail')] };

test('scores count passes', () => {
  assert.equal(api.scoreOf(clockA), 4);
  assert.equal(api.scoreOf(clockB), 1);
});

test('explanations report the model confidence and cutoff', () => {
  const hands = api.explanationText(clockA.criteria[3], t);
  assert.match(hands, /Hands show 11:10/);
  assert.match(hands, /93%/); assert.match(hands, /80%/);
  const failed = api.explanationText(clockB.criteria[3], t);
  assert.match(failed, /10% was below the 80%/);
  assert.match(api.explanationText(clockB.criteria[2], t), /30% was below the 75%/);
});

test('every criterion has a what, an outcome and a limit note', () => {
  for (const crit of [...clockA.criteria, ...clockB.criteria]) {
    const e = api.explainCriterion(crit);
    assert.equal(e.outcomeKey, crit.status === 'pass' ? 'whyPass' : 'whyFail');
    assert.equal(e.limitKey, 'whyLimit');
    assert.ok(api.explanationText(crit, t).includes('Only the model score.'));
  }
});

test('near-threshold results get the extra note', () => {
  const near = api.explainCriterion({ ...c('correctHands', .81, .8, 'pass'), needsReview: true });
  assert.equal(near.nearKey, 'whyNear');
  assert.equal(api.explainCriterion(c('correctHands', .99, .8, 'pass')).nearKey, null);
});

test('zoom is clamped and resettable', () => {
  assert.equal(api.nextZoom(1, -1), 1);
  assert.equal(api.nextZoom(1, 1), 1.5);
  assert.equal(api.nextZoom(api.maxZoom, 1), api.maxZoom);
  assert.equal(api.nextZoom(3, 0), 1);
});

test('rotation wraps in quarter turns', () => {
  assert.equal(api.nextTurns(0, -1), 3);
  assert.equal(api.nextTurns(3, 1), 0);
  assert.equal(api.nextTurns(1, 1), 2);
});

test('oriented size swaps sides on odd turns and caps the long side', () => {
  assert.deepEqual({ ...api.orientedSize(400, 300, 1) }, { width: 300, height: 400 });
  assert.deepEqual({ ...api.orientedSize(400, 300, 2) }, { width: 400, height: 300 });
  const big = api.orientedSize(4000, 2000, 1);
  assert.ok(Math.max(big.width, big.height) <= 2048);
  assert.equal(big.height / big.width, 2);
});

test('voice selection prefers the exact language and handles none', () => {
  const voices = [{ lang: 'es-MX' }, { lang: 'en-US' }, { lang: 'es' }];
  assert.equal(api.pickVoice(voices, 'es').lang, 'es');
  assert.equal(api.pickVoice(voices, 'en').lang, 'en-US');
  assert.equal(api.pickVoice(voices, 'fr'), null);
  assert.equal(api.pickVoice([], 'en'), null);
  assert.equal(api.pickVoice(undefined, 'en'), null);
});

test('speech summary includes score, outcomes and explanations', () => {
  const text = api.speechSummary(clockB, t);
  assert.match(text, /Final score: 1 out of 4\./);
  assert.match(text, /Correct hands: Fail\./);
  assert.match(text, /Not a diagnosis\./);
});

test('report has drawing-independent results and no demographic data', () => {
  const report = api.reportModel(clockA, t, new Date(2025, 0, 15), 'en');
  assert.equal(report.score, 4);
  assert.match(report.date, /2025/);
  assert.equal(report.criteria.length, 4);
  const json = JSON.stringify(report).toLowerCase();
  for (const word of ['age', 'education', 'preferred', 'language', 'setup', 'gender']) {
    assert.ok(!Object.keys(report).includes(word));
  }
  assert.ok(!/"(age|education|preferredlanguage)"/.test(json));
});
