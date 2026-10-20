// MindDial AI — educational research frontend
// Aggregate terminology only; no restricted records, images, splits or model weights ship with this app.

const project = Object.freeze({
  name: 'MindDial AI',
  baseline: 'ResNet50',
  criteria: [
    { key: 'closedCircle', metricKey: 'Closed_Circle', labelKey: 'critClosed' },
    { key: 'all12Numbers', metricKey: 'Includes_all_12_correct_Numbers', labelKey: 'critNumbers' },
    { key: 'numberPosition', metricKey: 'Number_correct_Position', labelKey: 'critPosition' },
    { key: 'correctHands', metricKey: 'Places_Hands_in_correct_positions', labelKey: 'critHands' }
  ]
});

function makeSetup({ age, education, preferredLanguage, interfaceLanguage, accessibility }) {
  return {
    schemaVersion: 1,
    age,
    education,
    preferredLanguage,
    interfaceLanguage,
    accessibility,
    consent: { accepted: true, version: 'phase1-2026-10' },
    phase: 1
  };
}

const $ = id => document.getElementById(id);
const rtlLocales = new Set(['ar']);

const en = Object.fromEntries([...document.querySelectorAll('[data-t]')].map(el => [el.dataset.t, el.innerHTML]));

// Spanish has broader coverage; other locales cover the key journey
// strings and fall back to English for anything not yet translated. Add a
// new locale by adding one object here and one <option> in index.html.
const es = { start: 'Configura tu experiencia →', learn: 'Acerca del proyecto', illustration: 'La investigación cuidadosa comienza contigo.', benefit1: 'Lectura cómoda', benefit1Text: 'Ajusta el texto, el contraste y los colores a tu gusto.', benefit2: 'A tu propio ritmo', benefit2Text: 'Pasos sencillos, opciones claras y sin temporizador.', benefit3: 'Investigación con cuidado', benefit3Text: 'Consentimiento claro. Tus datos permanecen en esta página.', research: 'PROTOTIPO DE INVESTIGACIÓN EDUCATIVA', interface: 'Idioma de la interfaz', welcome: 'ESPACIO PARA PENSAR. TIEMPO PARA EMPEZAR.', headline: 'Un comienzo cómodo.<br>Un siguiente paso <em>con calma.</em>', lead: 'Te damos la bienvenida a MindDial AI. Preparemos una experiencia de investigación con dibujos de relojes cómoda para ti.', pace: '✓ A tu propio ritmo · Sin límite de tiempo durante la configuración', setupStep: 'Tu configuración', setupSmall: 'Detalles y preferencias', testStep: 'Subir dibujo', testSmall: 'Dibujo del reloj', reviewStep: 'Resultados de la IA', reviewSmall: 'Puntuación de 4 criterios', comfort: 'Tu comodidad es lo primero', comfortText: 'Ajusta la pantalla como prefieras. Puedes cambiar estas opciones en cualquier momento.', about: 'Acerca del proyecto', aboutText: 'MindDial AI se basa en el modelo de investigación ResNet50 y sus cuatro criterios: círculo cerrado, los 12 números, posición correcta de los números y manecillas correctas. Es un prototipo educativo/de investigación y no diagnostica ninguna condición médica.', limits: 'La edad y la educación no cambian las puntuaciones. No se ha evaluado el rendimiento por grupos demográficos.', stepLabel: 'PASO 01 / TU CONFIGURACIÓN', make: 'Ponte cómodo', formIntro: 'Unos detalles antes de comenzar. Todos los campos siguientes son obligatorios.', details: 'Acerca de ti', age: 'Edad (años)', ageHelp: 'Introduce un número entero entre 1 y 120.', education: 'Nivel educativo', preferred: 'Idioma preferido', prefHelp: 'Tu preferencia para futuras instrucciones; el idioma de pantalla se selecciona arriba.', display: 'Tu espacio de lectura', large: 'Texto grande', largeHint: 'Más fácil de leer', contrast: 'Alto contraste', contrastHint: 'Mayor definición visual', color: 'Modo apto para daltonismo', colorHint: 'Acentos azules, con texto y símbolos para cada estado', consentTitle: 'Un entendimiento compartido', researchOnly: 'Para aprendizaje e investigación', disclaimer: 'Este es un prototipo educativo y de investigación de apoyo al cribado, no un dispositivo médico de diagnóstico. No puede diagnosticar demencia ni ninguna condición de salud y no sustituye una evaluación profesional. No está destinado al cribado autónomo.', privacy: 'Tus datos de configuración permanecen en la memoria de esta página y se borran al actualizarla o cerrarla. Nada se envía a un servidor salvo que conectes tu propio backend. La edad y la educación nunca cambian tu puntuación de IA.', agree: 'Entiendo estas limitaciones y acepto voluntariamente continuar con este prototipo educativo.', continue: 'Continuar a subir dibujo', ready: 'CONFIGURACIÓN COMPLETA', readyTitle: 'Todo listo.', handoffText: 'Tus preferencias están listas. A continuación, sube tu dibujo del reloj.', back: 'Volver a mi configuración', reset: 'Borrar mis datos y comenzar de nuevo', footer: 'Diseño atento. Investigación responsable.', phase: 'FASE 1–2 · VISTA PREVIA DE DISEÑO Y PUNTUACIÓN', uploadTitle: 'Sube tu dibujo del reloj', uploadIntro: 'Sube una foto clara del dibujo. Esta vista previa no envía la imagen a ningún servidor.', chooseFile: 'Elegir imagen', qualityTitle: 'Comprobación de calidad (vista previa)', qualityBlur: 'Nitidez suficiente', qualityCrop: 'Reloj completo visible', qualityLight: 'Iluminación adecuada', analyzeBtn: 'Analizar dibujo', resultsTitle: 'Resultados de la IA', critClosed: 'Círculo cerrado', critNumbers: 'Los 12 números', critPosition: 'Posición correcta de números', critHands: 'Manecillas correctas', confidence: 'Confianza del modelo', threshold: 'Umbral', pass: 'APROBADO', fail: 'NO APROBADO', review: 'REVISIÓN NECESARIA', finalScore: 'Puntuación final', outOf4: 'de 4', scoreNote: 'Esta puntuación describe cuatro características observables del dibujo. No es un diagnóstico.', newTest: 'Analizar otro dibujo', backSetup: 'Volver al inicio' };

const vi = { start: 'Thiết lập trải nghiệm của bạn →', research: 'NGUYÊN MẪU NGHIÊN CỨU GIÁO DỤC', interface: 'Ngôn ngữ giao diện', headline: 'Một khởi đầu thoải mái.<br>Một bước tiếp theo <em>chu đáo.</em>', lead: 'Chào mừng đến với MindDial AI. Hãy bắt đầu với vài bước thiết lập đơn giản.', setupStep: 'Thiết lập của bạn', testStep: 'Tải ảnh lên', reviewStep: 'Kết quả AI', details: 'Về bạn', age: 'Tuổi (năm)', education: 'Trình độ học vấn', preferred: 'Ngôn ngữ ưa thích', display: 'Tùy chọn hiển thị', large: 'Chữ lớn', contrast: 'Độ tương phản cao', color: 'Chế độ thân thiện với người mù màu', researchOnly: 'Dành cho học tập và nghiên cứu', disclaimer: 'Đây là nguyên mẫu hỗ trợ sàng lọc giáo dục/nghiên cứu, không phải thiết bị y tế chẩn đoán. Nó không thể chẩn đoán sa sút trí tuệ hay bất kỳ tình trạng sức khỏe nào.', agree: 'Tôi hiểu những giới hạn này và tự nguyện đồng ý tiếp tục với nguyên mẫu giáo dục này.', continue: 'Tiếp tục tải ảnh lên', ready: 'ĐÃ HOÀN TẤT THIẾT LẬP', readyTitle: 'Bạn đã sẵn sàng.', back: 'Quay lại thiết lập', reset: 'Xóa thông tin và bắt đầu lại', uploadTitle: 'Tải lên bản vẽ đồng hồ của bạn', chooseFile: 'Chọn ảnh', analyzeBtn: 'Phân tích bản vẽ', resultsTitle: 'Kết quả phân tích AI', critClosed: 'Vòng tròn khép kín', critNumbers: 'Đủ 12 số', critPosition: 'Vị trí số chính xác', critHands: 'Kim đồng hồ chính xác', confidence: 'Độ tin cậy của mô hình', threshold: 'Ngưỡng', pass: 'ĐẠT', fail: 'KHÔNG ĐẠT', review: 'CẦN XEM XÉT', finalScore: 'Điểm cuối cùng', outOf4: 'trên 4', newTest: 'Phân tích bản vẽ khác', backSetup: 'Quay lại trang đầu' };

const zh = { start: '设置您的体验 →', research: '教育研究原型', interface: '界面语言', headline: '一个舒适的开始。<br>一个<em>贴心</em>的下一步。', lead: '欢迎使用 MindDial AI。让我们通过简单的设置开始。', setupStep: '您的设置', testStep: '上传图片', reviewStep: 'AI 结果', details: '关于您', age: '年龄（岁）', education: '教育程度', preferred: '首选语言', display: '显示选项', large: '大号文字', contrast: '高对比度', color: '色盲友好模式', researchOnly: '仅用于学习与研究', disclaimer: '这是一个教育/研究用的筛查辅助原型，不是诊断性医疗设备。它无法诊断痴呆症或任何健康状况。', agree: '我理解这些限制，并自愿同意继续使用此教育原型。', continue: '继续上传图片', ready: '设置已完成', readyTitle: '一切就绪。', back: '返回设置', reset: '清除信息并重新开始', uploadTitle: '上传您的钟表绘图', chooseFile: '选择图片', analyzeBtn: '分析绘图', resultsTitle: 'AI 分析结果', critClosed: '闭合的圆圈', critNumbers: '完整的 12 个数字', critPosition: '数字位置正确', critHands: '指针位置正确', confidence: '模型置信度', threshold: '阈值', pass: '通过', fail: '未通过', review: '需要复核', finalScore: '最终得分', outOf4: '满分 4 分', newTest: '分析另一张绘图', backSetup: '返回首页' };

const ar = { start: 'إعداد تجربتك ←', research: 'نموذج بحثي تعليمي', interface: 'لغة الواجهة', headline: 'بداية مريحة.<br>خطوة تالية <em>مدروسة.</em>', lead: 'مرحبًا بك في MindDial AI. لنبدأ بإعداد بسيط.', setupStep: 'إعدادك', testStep: 'رفع الصورة', reviewStep: 'نتائج الذكاء الاصطناعي', details: 'عنك', age: 'العمر (بالسنوات)', education: 'المستوى التعليمي', preferred: 'اللغة المفضلة', display: 'تفضيلات العرض', large: 'نص كبير', contrast: 'تباين عالٍ', color: 'وضع ملائم لعمى الألوان', researchOnly: 'للتعلم والبحث فقط', disclaimer: 'هذا نموذج بحثي/تعليمي داعم للفحص وليس جهازًا طبيًا تشخيصيًا. لا يمكنه تشخيص الخرف أو أي حالة صحية.', agree: 'أفهم هذه القيود وأوافق طواعية على المتابعة في هذا النموذج التعليمي.', continue: 'المتابعة لرفع الصورة', ready: 'اكتمل الإعداد', readyTitle: 'كل شيء جاهز.', back: 'العودة إلى الإعداد', reset: 'مسح بياناتي والبدء من جديد', uploadTitle: 'ارفع رسمة الساعة الخاصة بك', chooseFile: 'اختيار صورة', analyzeBtn: 'تحليل الرسمة', resultsTitle: 'نتائج تحليل الذكاء الاصطناعي', critClosed: 'دائرة مغلقة', critNumbers: 'جميع الأرقام الـ12', critPosition: 'موضع الأرقام الصحيح', critHands: 'عقارب صحيحة', confidence: 'ثقة النموذج', threshold: 'العتبة', pass: 'ناجح', fail: 'غير ناجح', review: 'يحتاج مراجعة', finalScore: 'النتيجة النهائية', outOf4: 'من 4', newTest: 'تحليل رسمة أخرى', backSetup: 'العودة إلى البداية' };

const fr = { start: 'Configurez votre expérience →', research: 'PROTOTYPE DE RECHERCHE ÉDUCATIVE', interface: "Langue de l'interface", headline: 'Un début confortable.<br>Une étape <em>réfléchie.</em>', lead: 'Bienvenue sur MindDial AI. Commençons par une configuration simple.', setupStep: 'Votre configuration', testStep: "Téléverser l'image", reviewStep: 'Résultats de l’IA', details: 'À propos de vous', age: 'Âge (années)', education: "Niveau d'éducation", preferred: 'Langue préférée', display: "Préférences d'affichage", large: 'Texte agrandi', contrast: 'Contraste élevé', color: 'Mode adapté au daltonisme', researchOnly: 'Pour l’apprentissage et la recherche', disclaimer: "Ceci est un prototype éducatif/de recherche d'aide au dépistage, et non un dispositif médical de diagnostic. Il ne peut pas diagnostiquer la démence ou toute autre condition de santé.", agree: "Je comprends ces limites et j'accepte volontairement de continuer avec ce prototype éducatif.", continue: "Continuer vers l'envoi de l'image", ready: 'CONFIGURATION TERMINÉE', readyTitle: 'Vous êtes prêt.', back: 'Retour à ma configuration', reset: 'Effacer mes données et recommencer', uploadTitle: 'Téléversez votre dessin d’horloge', chooseFile: 'Choisir une image', analyzeBtn: "Analyser le dessin", resultsTitle: "Résultats de l'IA", critClosed: 'Cercle fermé', critNumbers: 'Les 12 chiffres', critPosition: 'Position correcte des chiffres', critHands: 'Aiguilles correctes', confidence: 'Confiance du modèle', threshold: 'Seuil', pass: 'RÉUSSI', fail: 'ÉCHOUÉ', review: 'À VÉRIFIER', finalScore: 'Score final', outOf4: 'sur 4', newTest: 'Analyser un autre dessin', backSetup: "Retour à l'accueil" };

Object.assign(en, {
 phaseNote: 'No AI score is generated until a real model service is connected.',
 handoffText: 'Your preferences are ready. Next, upload your clock drawing.',
 uploadIntro: 'Choose JPEG, PNG or WebP, up to 10 MB. Preview stays in memory. Analyze sends only the drawing when a backend is configured.',
 privacy: 'Setup details and drawings stay in page memory and clear on refresh or close. Analyze sends only the drawing if a backend is configured; demographics never affect the score. Only display preferences are saved on this device.',
 connectionTitle: 'Model connection pending', notConnected: 'AI model connection pending — no score has been generated.',
 qualityBlur: 'Sharpness — Not checked', qualityCrop: 'Full clock visible — Not checked', qualityLight: 'Lighting — Not checked',
 removeImage: 'Remove image', previewAlt: 'Uploaded clock drawing preview',
 invalidType: 'Choose a JPEG, PNG or WebP image.', invalidSize: 'Choose a nonempty image up to 10 MB.',
 invalidImage: 'This image could not be opened. Choose another image.', validating: 'Checking image format…',
 analyzing: 'Analyzing drawing…', requestFailed: 'Analysis unavailable. Please try again. No score generated.',
 timedOut: 'Analysis timed out. Please try again. No score generated.', invalidResponse: 'The model returned incomplete results. No score generated.',
 invalidEndpoint: 'The analysis service configuration needs attention. No score generated.',
 modelVersion: 'Model version', reviewWarning: 'Needs Review — confidence is near the provisional threshold. The binary score is unchanged.',
 thresholdNote: 'Thresholds are provisional research settings, not validated clinical cutoffs. Each criterion scores 1 for PASS or 0 for FAIL.',
 explain: 'Explain My Results', explainPending: 'Planned feature. Personalized explanations are not available yet.'
});
Object.assign(es, { phaseNote: 'No se genera puntuación hasta conectar el modelo real.', connectionTitle: 'Conexión del modelo pendiente', notConnected: 'Modelo pendiente: no se ha generado puntuación.', qualityBlur: 'Nitidez — Sin comprobar', qualityCrop: 'Reloj completo — Sin comprobar', qualityLight: 'Iluminación — Sin comprobar', removeImage: 'Quitar imagen', analyzing: 'Analizando…', modelVersion: 'Versión del modelo', explain: 'Explicar mis resultados', explainPending: 'Función prevista; aún no disponible.', uploadIntro: en.uploadIntro, privacy: en.privacy });
Object.assign(ar, { phaseNote: 'لن تُنتج نتيجة حتى يتم ربط النموذج الحقيقي.', connectionTitle: 'ربط النموذج قيد الانتظار', notConnected: 'لم يتم ربط النموذج — لم تُنتج أي نتيجة.', qualityBlur: 'الوضوح — لم يُفحص', qualityCrop: 'ظهور الساعة كاملة — لم يُفحص', qualityLight: 'الإضاءة — لم تُفحص', removeImage: 'إزالة الصورة', analyzing: 'جارٍ تحليل الرسمة…', modelVersion: 'إصدار النموذج', explain: 'اشرح نتائجي', explainPending: 'ميزة مخططة وغير متاحة بعد.', reviewWarning: 'يحتاج مراجعة — الثقة قريبة من العتبة المؤقتة. لا تتغير النتيجة الثنائية.' });
// Partial locales intentionally fall back to English. Never retain obsolete scoring/privacy claims.
for (const dict of [es, vi, zh, ar, fr]) {
 dict.handoffText = en.handoffText;
 dict.uploadIntro = en.uploadIntro;
 dict.privacy = en.privacy;
}
const translations = { en, es, vi, zh, ar, fr };

const education = {
  en: ['Choose education level', 'No formal schooling', 'Primary school', 'Secondary / high school', 'Some college / vocational education', 'Bachelor’s degree', 'Postgraduate degree', 'Prefer not to say'],
  es: ['Selecciona el nivel educativo', 'Sin escolarización formal', 'Educación primaria', 'Educación secundaria', 'Estudios universitarios parciales / formación profesional', 'Grado universitario', 'Posgrado', 'Prefiero no decirlo']
};
const languages = {
  en: ['Choose a language', 'English', 'Spanish', 'Vietnamese', 'Chinese', 'Arabic', 'French', 'Other', 'Prefer not to say'],
  es: ['Selecciona un idioma', 'Inglés', 'Español', 'Vietnamita', 'Chino', 'Árabe', 'Francés', 'Otro', 'Prefiero no decirlo']
};
const eduValues = ['', 'none', 'primary', 'secondary', 'college-vocational', 'bachelors', 'postgraduate', 'undisclosed'];
const langValues = ['', 'en', 'es', 'vi', 'zh', 'ar', 'fr', 'other', 'undisclosed'];

let locale = 'en', setup = null, lastResults = null;

function options(id, labels, values) {
  const current = $(id).value;
  $(id).replaceChildren(...labels.map((text, i) => {
    const o = document.createElement('option');
    o.value = values[i];
    o.textContent = text;
    return o;
  }));
  $(id).value = current || '';
}

function translate() {
  document.documentElement.lang = locale;
  document.documentElement.dir = rtlLocales.has(locale) ? 'rtl' : 'ltr';
  const dict = translations[locale] || en;
  document.querySelectorAll('[data-t]').forEach(el => {
    el.innerHTML = dict[el.dataset.t] || en[el.dataset.t] || '';
    el.lang = dict[el.dataset.t] ? locale : 'en';
  });
  document.querySelector('.demo-banner').hidden = Boolean(analysisConfig.endpoint);
  options('education', education[locale] || education.en, eduValues);
  options('preferred', languages[locale] || languages.en, langValues);
  $('age').placeholder = locale === 'es' ? 'p. ej., 68' : 'e.g. 68';
  $('error').textContent = '';
  $('upload-status').textContent = uploadStatus ? t(uploadStatus) : '';
  document.querySelector('#dropzone img')?.setAttribute('alt', t('previewAlt'));
  if (setup) renderSummary();
  if (lastResults) renderResults(lastResults);
}

$('locale').addEventListener('change', e => { locale = e.target.value; translate(); });

for (const id of ['large', 'contrast', 'color']) {
  try { $(id).checked = localStorage.getItem('minddial-display-' + id) === 'true'; } catch { /* storage unavailable */ }
  document.body.classList.toggle(id, $(id).checked);
  $(id).addEventListener('change', () => {
    document.body.classList.toggle(id, $(id).checked);
    try { localStorage.setItem('minddial-display-' + id, String($(id).checked)); } catch { /* storage unavailable */ }
  });
}

function t(key) { return (translations[locale] || en)[key] || en[key] || key; }

function renderSummary() {
  const fields = [
    [t('age'), setup.age],
    [t('education'), (education[locale] || education.en)[eduValues.indexOf(setup.education)]],
    [t('preferred'), (languages[locale] || languages.en)[langValues.indexOf(setup.preferredLanguage)]]
  ];
  $('summary').replaceChildren(...fields.flatMap(([key, value]) => {
    const dt = document.createElement('dt'), dd = document.createElement('dd');
    dt.textContent = key; dd.textContent = value;
    return [dt, dd];
  }));
}

function showStep(id) {
  for (const s of ['setup', 'handoff', 'analyze', 'results']) {
    if ($(s)) $(s).hidden = (s !== id);
  }
  const map = { setup: 1, handoff: 1, analyze: 2, results: 3 };
  document.querySelectorAll('.steps li').forEach((li, i) => {
    const n = i + 1;
    li.classList.toggle('active', n === map[id]);
    li.classList.toggle('done', n < map[id]);
  });
  if ($(id)) $(id).focus();
}

$('setup-form').addEventListener('submit', e => {
  e.preventDefault();
  if (!$('setup-form').reportValidity()) return;
  const age = Number($('age').value);
  if (!Number.isInteger(age) || age < 1 || age > 120) {
    $('error').textContent = locale === 'es' ? 'Introduce una edad válida entre 1 y 120.' : 'Please enter a whole-number age from 1 to 120.';
    $('age').focus();
    return;
  }
  setup = makeSetup({
    age,
    education: $('education').value,
    preferredLanguage: $('preferred').value,
    interfaceLanguage: locale,
    accessibility: Object.fromEntries(['large', 'contrast', 'color'].map(id => [id, $(id).checked]))
  });
  renderSummary();
  showStep('handoff');
});

$('back').addEventListener('click', () => showStep('setup'));
$('reset').addEventListener('click', () => {
  setup = null;
  clearDrawing();
  $('reason').value = '';
  $('age').value = ''; $('education').value = ''; $('preferred').value = ''; $('consent').checked = false;
  $('summary').replaceChildren();
  showStep('setup');
});

$('to-upload').addEventListener('click', () => showStep('analyze'));
$('back-to-handoff').addEventListener('click', () => showStep('handoff'));

let selectedFile = null, previewUrl = null, uploadStatus = '', busy = false, selection = 0;
function status(key) { uploadStatus = key; $('upload-status').textContent = key ? t(key) : ''; }
function clearDrawing() {
  selection++;
  selectedFile = null; lastResults = null;
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  previewUrl = null;
  $('file-input').value = '';
  $('dropzone').classList.remove('has-image');
  $('dropzone').querySelector('img')?.remove();
  $('criteria-list').replaceChildren();
  $('final-score').textContent = '—';
  $('model-version').textContent = '—';
  $('analyze-btn').disabled = true;
  $('remove-image').disabled = true;
  status('');
}
function resetDropzone() { clearDrawing(); }
function setBusy(value) {
  busy = value;
  for (const id of ['file-input', 'remove-image', 'back-to-handoff', 'reset']) $(id).disabled = value;
  $('analyze-btn').disabled = value || !selectedFile;
  $('analyze').setAttribute('aria-busy', String(value));
}
$('remove-image').addEventListener('click', clearDrawing);
$('file-input').addEventListener('change', async e => {
  const file = e.target.files?.[0];
  if (!file || busy) return;
  clearDrawing();
  const token = selection;
  let url;
  try {
    validateFile(file);
    status('validating');
    url = URL.createObjectURL(file);
    const img = new Image(); img.src = url;
    await img.decode();
    if (token !== selection) { URL.revokeObjectURL(url); return; }
    if (!img.naturalWidth || !img.naturalHeight || img.naturalWidth * img.naturalHeight > 40000000) throw new Error('invalidImage');
    previewUrl = url; selectedFile = file;
    img.alt = t('previewAlt');
    $('dropzone').prepend(img); $('dropzone').classList.add('has-image');
    $('analyze-btn').disabled = false; $('remove-image').disabled = false;
    status('');
  } catch (error) {
    if (url) URL.revokeObjectURL(url);
    if (token === selection) status(['invalidType','invalidSize'].includes(error.message) ? error.message : 'invalidImage');
  }
});
$('analyze-btn').addEventListener('click', async () => {
  if (!selectedFile || busy) return;
  setBusy(true); status('analyzing');
  try {
    const result = await analyzeClockDrawing(selectedFile);
    lastResults = result; renderResults(result); status(''); showStep('results');
  } catch (error) { status(en[error.message] ? error.message : 'requestFailed'); }
  finally { setBusy(false); }
});

function renderResults(result) {
  const results = result.criteria.map(r => ({ ...project.criteria.find(c => c.key === r.key), ...r }));
  $('model-version').textContent = result.modelVersion;
  const list = $('criteria-list');
  list.replaceChildren(...results.map(r => {
    const card = document.createElement('div');
    card.className = 'criterion-card';
    const pct = Math.round(r.confidence * 100);
    const thresholdPct = Math.round(r.threshold * 100);
    const badgeLabel = r.status === 'pass' ? `${t('pass')} \u2713` : `${t('fail')} \u2715`;
    card.innerHTML = `<header><h3>${t(r.labelKey)}</h3><span class="badge ${r.status}">${badgeLabel}</span></header>
      <div class="meter"><span style="width:${pct}%"></span><span class="mark" style="left:${thresholdPct}%"></span></div>
      <div class="criterion-meta"><span>${t('confidence')}: ${pct}%</span><span>${t('threshold')}: ${thresholdPct}%</span></div>`;
    if (r.needsReview) {
      const warning = document.createElement("p"); warning.className = "review-warning";
      warning.textContent = "⚠ " + t("reviewWarning"); card.append(warning);
    }
    return card;
  }));
  const score = results.filter(r => r.status === 'pass').length;
  $('final-score').textContent = score;
  $('score-out-of').textContent = t('outOf4');
}

$('to-upload-again').addEventListener('click', () => {
  if ($('file-input')) $('file-input').value = '';
  resetDropzone();
  showStep('analyze');
});
$('to-setup-again').addEventListener('click', () => showStep('setup'));

function init() {
  translate();
  showStep('setup');
}
init();
