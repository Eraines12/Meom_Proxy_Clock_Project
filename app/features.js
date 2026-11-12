// Pure helpers for results explanations, preview orientation, printing and speech.
// Nothing here reads demographic details; explanations use only what the model reports.
const maxZoom = 4, zoomStep = 0.5;
const whatKeys = Object.freeze({ closedCircle: 'whatClosed', all12Numbers: 'whatNumbers',
  numberPosition: 'whatPosition', correctHands: 'whatHands' });
const labelKeys = Object.freeze({ closedCircle: 'critClosed', all12Numbers: 'critNumbers',
  numberPosition: 'critPosition', correctHands: 'critHands' });

function fillTemplate(template, params) {
  return String(template).replace(/\{(\w+)\}/g, (match, name) => (name in params ? String(params[name]) : match));
}

// Returns translation keys plus the numbers the model actually reported.
function explainCriterion(criterion) {
  const pct = Math.round(criterion.confidence * 100);
  const thresholdPct = Math.round(criterion.threshold * 100);
  return { whatKey: whatKeys[criterion.key], outcomeKey: criterion.status === 'pass' ? 'whyPass' : 'whyFail',
    nearKey: criterion.needsReview ? 'whyNear' : null, limitKey: 'whyLimit', params: { pct, threshold: thresholdPct } };
}

function explanationText(criterion, t) {
  const e = explainCriterion(criterion);
  return [t(e.whatKey), fillTemplate(t(e.outcomeKey), e.params), e.nearKey ? t(e.nearKey) : '', t(e.limitKey)]
    .filter(Boolean).join(' ');
}

function scoreOf(result) { return result.criteria.filter(c => c.status === 'pass').length; }

function nextZoom(current, direction) {
  if (direction === 0) return 1;
  return Math.min(maxZoom, Math.max(1, Math.round((current + direction * zoomStep) * 100) / 100));
}

function nextTurns(current, direction) { return (((current + direction) % 4) + 4) % 4; }

// Size after rotating, then capped so the upload stays well under proxy limits.
function orientedSize(width, height, turns, maxSide = 2048) {
  const swap = turns % 2 === 1;
  const w = swap ? height : width, h = swap ? width : height;
  const scale = Math.min(1, maxSide / Math.max(w, h));
  return { width: Math.max(1, Math.round(w * scale)), height: Math.max(1, Math.round(h * scale)) };
}

function speechSummary(result, t) {
  const parts = [fillTemplate(t('speakScore'), { score: scoreOf(result) })];
  for (const c of result.criteria) {
    parts.push(`${t(labelKeys[c.key])}: ${c.status === 'pass' ? t('pass') : t('fail')}.`);
    parts.push(explanationText(c, t));
  }
  parts.push(t('scoreNote'));
  return parts.join(' ');
}

// A built-in voice for the selected language, or null when none is installed.
function pickVoice(voices, locale) {
  const wanted = String(locale).toLowerCase();
  const list = Array.from(voices || []);
  return list.find(v => String(v.lang).toLowerCase().replace('_', '-') === wanted) ||
    list.find(v => String(v.lang).toLowerCase().replace('_', '-').split('-')[0] === wanted) || null;
}

// The report contains the drawing, score, explanations and date only.
function reportModel(result, t, date, locale) {
  return { title: t('printTitle'), date: date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' }),
    modelVersion: result.modelVersion, score: scoreOf(result),
    criteria: result.criteria.map(c => ({ key: c.key, label: t(labelKeys[c.key]), status: c.status,
      outcome: c.status === 'pass' ? t('pass') : t('fail'), explanation: explanationText(c, t) })) };
}
