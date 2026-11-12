const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const read = name => fs.readFileSync(__dirname + '/' + name, 'utf8');
const context = vm.createContext({});
vm.runInContext(read('eligibility.js'), context);
const check = input => vm.runInContext('checkEligibility', context)(input);

test('adults who confirm can continue, including exactly 18', () => {
  for (const age of ['18', 18, '19', '68', '120']) {
    const result = check({ ageConfirmed: true, age });
    assert.equal(result.ok, true);
    assert.equal(result.age, Number(age));
  }
});
test('skipping the confirmation blocks access', () => {
  for (const ageConfirmed of [false, undefined, null, 'true']) {
    const result = check({ ageConfirmed, age: '30' });
    assert.deepEqual({ ok: result.ok, error: result.error }, { ok: false, error: 'ageConfirmRequired' });
  }
});
test('ages under 18 are blocked even when confirmed', () => {
  for (const age of ['17', 17, '1', '0', '-5']) {
    assert.equal(check({ ageConfirmed: true, age }).ok, false);
  }
  assert.equal(check({ ageConfirmed: true, age: '17' }).error, 'ageUnder18');
});
test('invalid ages are rejected', () => {
  for (const age of ['', 'abc', '18.5', '121', undefined]) {
    assert.equal(check({ ageConfirmed: true, age }).error, 'ageInvalid');
  }
});
test('age gate is the first required, unchecked field and uses the required message', () => {
  const html = read('index.html');
  const gate = html.match(/<input id="age-confirm"[^>]*>/)[0];
  assert.match(gate, /type="checkbox"/);
  assert.match(gate, /\brequired\b/);
  assert.doesNotMatch(gate, /\bchecked\b/);
  assert.ok(html.indexOf('id="age-confirm"') < html.indexOf('id="age"'));
  assert.match(html, /I confirm that I am 18 years of age or older/);
  assert.match(read('script.js'), /You must be 18 or older to use this assessment\./);
});
test('every locale defines the age-gate strings', () => {
  const script = read('script.js');
  for (const locale of ['en', 'es', 'vi', 'zh', 'ar', 'fr']) {
    assert.match(script, new RegExp(`Object\\.assign\\(${locale}, \\{ ageGateTitle:[^\\n]*ageUnder18:`));
  }
});
test('gated steps and image handling require a completed eligible setup', () => {
  const script = read('script.js');
  assert.match(script, /if \(!setup && \['clock-test', 'analyze', 'results'\]\.includes\(id\)\) id = 'setup'/);
  assert.match(script, /if \(!file \|\| busy \|\| !setup\) return/);
  assert.match(script, /if \(!selectedFile \|\| busy \|\| !setup\) return/);
});
test('age data never reaches the model request', () => {
  assert.doesNotMatch(read('analysis.js'), /\bage\b|ageConfirm|setup\./);
});
