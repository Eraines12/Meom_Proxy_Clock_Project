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
 critClosed: 'Closed Circle', critNumbers: 'All 12 Numbers', critPosition: 'Correct Number Position', critHands: 'Correct Clock Hands',
 confidence: 'Model confidence', threshold: 'Threshold', pass: 'PASS', fail: 'FAIL', outOf4: 'of 4',
 uploadTooLarge: 'This hosting route supports images smaller than 4 MB. Choose a smaller image.',
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
Object.assign(en, {"setupStep":"Setup","testStep":"Clock Test","testSmall":"Draw or use paper","analysisStep":"Analysis","analysisSmall":"Confirm and analyze","reviewStep":"Results","continue":"Continue to Clock Test","continue2":"Start Clock Test","handoffText":"Your preferences are ready. Next, draw a clock or use blank paper.","uploadTitle":"Confirm your drawing","stepLabel2":"STEP 03 / ANALYSIS","stepLabel3":"STEP 04 / RESULTS","clockStepLabel":"STEP 02 / CLOCK TEST","clockTitle":"Clock Test","drawingInstructions":"Draw a clock, put in all the numbers, and set the hands to 11:10.","canvasHelp":"Use a mouse, touch, or stylus on the blank area. Keyboard: arrow keys move the pen cursor; Space starts or stops drawing. You can also draw on paper and upload a photo below. There is no timer.","pen":"Pen","eraser":"Eraser","undo":"Undo","clearCanvas":"Clear / Reset drawing","submitDrawing":"Submit Drawing","paperOption":"Prefer paper? Upload / Take Photo","paperHelp":"Follow the same instructions on blank paper. Choose an image or take a photo, then confirm the preview before analysis.","takePhoto":"Take Photo","confirmPreview":"Confirm that this is the drawing you want to analyze.","backToSetup":"Back to Clock Test","removeImage":"Remove image and return to Clock Test","previewAlt":"Clock drawing preview for confirmation","drawingChanged":"Drawing updated. Submit when ready.","drawingCleared":"Drawing cleared. The area is blank.","emptyDrawing":"Draw a clock or upload an image before continuing.","exportFailed":"Unable to prepare the drawing. Please try again.","keyboardOn":"Keyboard pen down. Arrow keys draw; Space lifts the pen.","keyboardOff":"Keyboard pen lifted. Arrow keys move; Space draws."});
// Replace obsolete upload-only journey text in partial locales with explicit English fallback.
for (const dict of [es, vi, zh, ar, fr]) {
 for (const key of ['testStep','testSmall','continue','continue2','handoffText','uploadTitle','stepLabel2','stepLabel3','backToSetup','removeImage']) delete dict[key];
}
Object.assign(es, { testStep: 'Prueba del reloj', continue: 'Continuar a la prueba del reloj', clockTitle: 'Prueba del reloj', drawingInstructions: 'Dibuja un reloj, incluye todos los números y coloca las manecillas a las 11:10.', pen: 'Lápiz', eraser: 'Borrador', undo: 'Deshacer', clearCanvas: 'Borrar / Reiniciar dibujo', submitDrawing: 'Enviar dibujo', takePhoto: 'Tomar foto' });
Object.assign(vi, {"clockTitle":"Bài kiểm tra vẽ đồng hồ","testStep":"Bài kiểm tra đồng hồ","continue":"Tiếp tục bài kiểm tra đồng hồ","drawingInstructions":"Vẽ một chiếc đồng hồ, điền tất cả các số và đặt kim chỉ 11:10.","pen":"Bút","eraser":"Tẩy","undo":"Hoàn tác","clearCanvas":"Xóa / Vẽ lại","submitDrawing":"Gửi bản vẽ","takePhoto":"Chụp ảnh"});
Object.assign(zh, {"clockTitle":"画钟测试","testStep":"画钟测试","continue":"继续画钟测试","drawingInstructions":"请画一个钟，写上所有数字，并将指针设为11点10分。","pen":"画笔","eraser":"橡皮擦","undo":"撤销","clearCanvas":"清空 / 重画","submitDrawing":"提交绘图","takePhoto":"拍照"});
Object.assign(ar, {"clockTitle":"اختبار رسم الساعة","testStep":"اختبار الساعة","continue":"المتابعة إلى اختبار الساعة","drawingInstructions":"ارسم ساعة، واكتب جميع الأرقام، واضبط العقارب على 11:10.","pen":"قلم","eraser":"ممحاة","undo":"تراجع","clearCanvas":"مسح / إعادة الرسم","submitDrawing":"إرسال الرسمة","takePhoto":"التقاط صورة"});
Object.assign(fr, {"clockTitle":"Test de l’horloge","testStep":"Test de l’horloge","continue":"Continuer vers le test de l’horloge","drawingInstructions":"Dessinez une horloge, inscrivez tous les chiffres et placez les aiguilles à 11 h 10.","pen":"Stylo","eraser":"Gomme","undo":"Annuler","clearCanvas":"Effacer / Recommencer","submitDrawing":"Envoyer le dessin","takePhoto":"Prendre une photo"});
const translations = { en, es, vi, zh, ar, fr };
Object.assign(en, { ageGateTitle: 'Age requirement', ageConfirm: 'I confirm that I am 18 years of age or older', ageGateHelp: 'This assessment is only for adults aged 18 or older. You must confirm this before you can draw, upload, or analyze a clock.', ageHelp: 'Enter a whole number from 18 to 120.', ageUnder18: 'You must be 18 or older to use this assessment.', ageConfirmRequired: 'Confirm that you are 18 or older to continue.', ageInvalid: 'Please enter a whole-number age from 18 to 120.' });
Object.assign(es, { ageGateTitle: 'Requisito de edad', ageConfirm: 'Confirmo que tengo 18 años o más', ageGateHelp: 'Esta evaluación es solo para adultos de 18 años o más. Debes confirmarlo antes de dibujar, subir o analizar un reloj.', ageHelp: 'Introduce un número entero entre 18 y 120.', ageUnder18: 'Debes tener 18 años o más para usar esta evaluación.', ageConfirmRequired: 'Confirma que tienes 18 años o más para continuar.', ageInvalid: 'Introduce una edad válida entre 18 y 120.' });
Object.assign(vi, { ageGateTitle: 'Yêu cầu về độ tuổi', ageConfirm: 'Tôi xác nhận rằng tôi từ 18 tuổi trở lên', ageGateHelp: 'Bài đánh giá này chỉ dành cho người từ 18 tuổi trở lên. Bạn phải xác nhận trước khi vẽ, tải lên hoặc phân tích đồng hồ.', ageHelp: 'Nhập một số nguyên từ 18 đến 120.', ageUnder18: 'Bạn phải từ 18 tuổi trở lên để sử dụng bài đánh giá này.', ageConfirmRequired: 'Hãy xác nhận bạn từ 18 tuổi trở lên để tiếp tục.', ageInvalid: 'Vui lòng nhập tuổi là số nguyên từ 18 đến 120.' });
Object.assign(zh, { ageGateTitle: '年龄要求', ageConfirm: '我确认我已年满 18 岁', ageGateHelp: '本评估仅限 18 岁及以上的成年人使用。在绘制、上传或分析钟表之前，您必须先确认。', ageHelp: '请输入 18 至 120 之间的整数。', ageUnder18: '您必须年满 18 岁才能使用本评估。', ageConfirmRequired: '请确认您已年满 18 岁后再继续。', ageInvalid: '请输入 18 至 120 之间的整数年龄。' });
Object.assign(en, {
  practiceStart: 'Practice with the tools first', practiceEnd: 'Finish practice and start the real assessment',
  practiceBanner: 'Practice mode: nothing you draw here is saved, uploaded or analyzed. Try the pen, eraser and undo.',
  practiceEnded: 'Practice finished. The drawing area is blank for your real clock.',
  practiceStarted: 'Practice mode on. Try the pen, eraser and undo. Submit is turned off.',
  previewControls: 'Preview controls', zoomIn: 'Zoom in', zoomOut: 'Zoom out', zoomReset: 'Reset zoom',
  rotateLeft: 'Rotate left', rotateRight: 'Rotate right', replaceImage: 'Replace image',
  rotatedStatus: 'Image rotated. This rotated image is the one that will be analyzed.',
  rotateFailed: 'The image could not be rotated. Choose another image.',
  retryAnalysis: 'Retry analysis', retryHint: 'Your drawing and setup are kept. Retry without drawing or uploading again.',
  resultDrawing: 'Drawing analyzed', resultDrawingAlt: 'The clock drawing that was analyzed',
  explainIntro: 'Each Why? explains the result using the number the model reported for that feature.',
  why: 'Why?',
  whatClosed: 'This checks whether the outer circle is closed.', whatNumbers: 'This checks whether all 12 numbers are present.',
  whatPosition: 'This checks whether the numbers are placed correctly around the clock.',
  whatHands: 'This checks whether the hands show 11:10.',
  whyPass: 'The model reported {pct}% confidence, which meets the {threshold}% cutoff, so it scored 1 (PASS).',
  whyFail: 'The model reported {pct}% confidence, below the {threshold}% cutoff, so it scored 0 (FAIL).',
  whyNear: 'This is close to the cutoff, so it is marked Needs Review.',
  whyLimit: 'The model reports only this number, not where in the drawing it looked.',
  printResults: 'Print or save results', printTitle: 'MindDial AI results', printDate: 'Date', printScore: 'Final score',
  printDrawing: 'Submitted drawing', printNote: 'Educational prototype. Not a medical diagnosis. Setup details such as age are not included.',
  readAloud: 'Read results aloud', stopReading: 'Stop reading',
  noVoice: 'No built-in voice is available for this language on this device.',
  speakScore: 'Final score: {score} out of 4.', speaking: 'Reading results aloud.', speechStopped: 'Stopped reading.'
});
Object.assign(es, {
  practiceStart: 'Practicar primero con las herramientas', practiceEnd: 'Terminar la práctica e iniciar la evaluación real',
  practiceBanner: 'Modo de práctica: nada de lo que dibujes aquí se guarda, se sube ni se analiza. Prueba el lápiz, el borrador y deshacer.',
  practiceEnded: 'Práctica terminada. El área de dibujo está en blanco para tu reloj real.',
  practiceStarted: 'Modo de práctica activado. El envío está desactivado.',
  previewControls: 'Controles de vista previa', zoomIn: 'Acercar', zoomOut: 'Alejar', zoomReset: 'Restablecer zoom',
  rotateLeft: 'Girar a la izquierda', rotateRight: 'Girar a la derecha', replaceImage: 'Reemplazar imagen',
  rotatedStatus: 'Imagen girada. Se analizará esta imagen girada.', rotateFailed: 'No se pudo girar la imagen. Elige otra.',
  retryAnalysis: 'Reintentar análisis', retryHint: 'Se conservan tu dibujo y tu configuración. Reintenta sin dibujar ni subir de nuevo.',
  resultDrawing: 'Dibujo analizado', resultDrawingAlt: 'El dibujo del reloj que se analizó',
  explainIntro: 'Cada ¿Por qué? explica el resultado con el número que el modelo informó para esa característica.', why: '¿Por qué?',
  whatClosed: 'Comprueba si el círculo exterior está cerrado.', whatNumbers: 'Comprueba si están los 12 números.',
  whatPosition: 'Comprueba si los números están bien colocados alrededor del reloj.', whatHands: 'Comprueba si las manecillas marcan las 11:10.',
  whyPass: 'El modelo informó {pct}% de confianza, que alcanza el umbral de {threshold}%, así que obtuvo 1 (APROBADO).',
  whyFail: 'El modelo informó {pct}% de confianza, por debajo del umbral de {threshold}%, así que obtuvo 0 (NO APROBADO).',
  whyNear: 'Está cerca del umbral, por eso se marca como Revisión necesaria.',
  whyLimit: 'El modelo solo informa este número, no dónde miró en el dibujo.',
  printResults: 'Imprimir o guardar resultados', printTitle: 'Resultados de MindDial AI', printDate: 'Fecha', printScore: 'Puntuación final',
  printDrawing: 'Dibujo enviado', printNote: 'Prototipo educativo. No es un diagnóstico médico. No se incluyen datos de configuración como la edad.',
  readAloud: 'Leer resultados en voz alta', stopReading: 'Detener lectura',
  noVoice: 'No hay una voz integrada para este idioma en este dispositivo.',
  speakScore: 'Puntuación final: {score} de 4.', speaking: 'Leyendo los resultados en voz alta.', speechStopped: 'Lectura detenida.'
});
Object.assign(fr, {
  practiceStart: 'S’entraîner d’abord avec les outils', practiceEnd: 'Terminer l’entraînement et commencer l’évaluation',
  practiceBanner: 'Mode entraînement : rien de ce que vous dessinez ici n’est enregistré, envoyé ni analysé.',
  previewControls: 'Contrôles de l’aperçu', zoomIn: 'Agrandir', zoomOut: 'Réduire', zoomReset: 'Réinitialiser le zoom',
  rotateLeft: 'Pivoter à gauche', rotateRight: 'Pivoter à droite', replaceImage: 'Remplacer l’image',
  retryAnalysis: 'Réessayer l’analyse', retryHint: 'Votre dessin et votre configuration sont conservés.',
  why: 'Pourquoi ?', printResults: 'Imprimer ou enregistrer les résultats', readAloud: 'Lire les résultats à voix haute',
  stopReading: 'Arrêter la lecture', resultDrawing: 'Dessin analysé'
});
Object.assign(ar, { ageGateTitle: 'شرط العمر', ageConfirm: 'أؤكد أن عمري 18 عامًا أو أكثر', ageGateHelp: 'هذا التقييم مخصص للبالغين الذين تبلغ أعمارهم 18 عامًا أو أكثر. يجب تأكيد ذلك قبل رسم الساعة أو رفعها أو تحليلها.', ageHelp: 'أدخل عددًا صحيحًا بين 18 و120.', ageUnder18: 'يجب أن يكون عمرك 18 عامًا أو أكثر لاستخدام هذا التقييم.', ageConfirmRequired: 'أكّد أن عمرك 18 عامًا أو أكثر للمتابعة.', ageInvalid: 'يرجى إدخال عمر صحيح بين 18 و120.' });
Object.assign(fr, { ageGateTitle: 'Condition d’âge', ageConfirm: 'Je confirme avoir 18 ans ou plus', ageGateHelp: 'Cette évaluation est réservée aux adultes de 18 ans ou plus. Vous devez le confirmer avant de dessiner, téléverser ou analyser une horloge.', ageHelp: 'Saisissez un nombre entier entre 18 et 120.', ageUnder18: 'Vous devez avoir 18 ans ou plus pour utiliser cette évaluation.', ageConfirmRequired: 'Confirmez que vous avez 18 ans ou plus pour continuer.', ageInvalid: 'Veuillez saisir un âge entier entre 18 et 120.' });

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

let locale = 'en', setup = null, lastResults = null, modelReady = false;

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
  document.querySelectorAll('[data-tl]').forEach(el => el.setAttribute('aria-label', t(el.dataset.tl)));
  document.querySelector('.demo-banner').hidden = modelReady;
  options('education', education[locale] || education.en, eduValues);
  options('preferred', languages[locale] || languages.en, langValues);
  $('age').placeholder = locale === 'es' ? 'p. ej., 68' : 'e.g. 68';
  $('error').textContent = '';
  status(uploadStatus);
  $('drawing-canvas').setAttribute('aria-label', t('clockTitle'));
  $('drawing-canvas').lang = translations[locale].clockTitle ? locale : 'en';
  document.querySelector('#dropzone img')?.setAttribute('alt', t('previewAlt'));
  $('result-image').alt = t('resultDrawingAlt');
  updateSpeechAvailability();
  if (setup) renderSummary();
  if (lastResults) renderResults(lastResults);
}

$('locale').addEventListener('change', e => { locale = e.target.value; stopSpeaking(); translate(); });

for (const id of ['large', 'contrast', 'color']) {
  try { $(id).checked = localStorage.getItem('minddial-display-' + id) === 'true'; } catch { /* storage unavailable */ }
  document.body.classList.toggle(id, $(id).checked);
  $(id).addEventListener('change', () => {
    document.body.classList.toggle(id, $(id).checked);
    try { localStorage.setItem('minddial-display-' + id, String($(id).checked)); } catch { /* storage unavailable */ }
  });
}

async function refreshModelConnection() {
  try {
    const response = await fetch('/api/health', { cache: 'no-store', credentials: 'omit',
      redirect: 'error', signal: AbortSignal.timeout(5000) });
    modelReady = response.ok && (await response.json()).ready === true;
  } catch { modelReady = false; }
  document.querySelector('.demo-banner').hidden = modelReady;
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
  if (!setup && ['clock-test', 'analyze', 'results'].includes(id)) id = 'setup';
  if (id !== 'clock-test' && typeof endPractice === 'function') endPractice();
  if (id !== 'results') stopSpeaking();
  for (const s of ['setup', 'handoff', 'clock-test', 'analyze', 'results']) {
    if ($(s)) $(s).hidden = (s !== id);
  }
  const map = { setup: 1, handoff: 1, 'clock-test': 2, analyze: 3, results: 4 };
  document.querySelectorAll('.steps li').forEach((li, i) => {
    const n = i + 1;
    li.classList.toggle('active', n === map[id]);
    if (n === map[id]) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    li.classList.toggle('done', n < map[id]);
  });
  if ($(id)) $(id).focus();
  if (id === 'analyze') refreshModelConnection();
}

$('setup-form').addEventListener('submit', e => {
  e.preventDefault();
  setup = null;
  const gate = checkEligibility({ ageConfirmed: $('age-confirm').checked, age: $('age').value });
  if (!gate.ok) {
    $('error').textContent = t(gate.error);
    $(gate.field).focus();
    return;
  }
  if (!$('setup-form').reportValidity()) return;
  $('error').textContent = '';
  const age = gate.age;
  setup = makeSetup({
    age,
    education: $('education').value,
    preferredLanguage: $('preferred').value,
    interfaceLanguage: locale,
    accessibility: Object.fromEntries(['large', 'contrast', 'color'].map(id => [id, $(id).checked]))
  });
  renderSummary();
  showStep('clock-test');
});

$('back').addEventListener('click', () => showStep('setup'));
$('reset').addEventListener('click', () => {
  setup = null;
  clearDrawing(); resetCanvas();
  $('reason').value = '';
  $('age').value = ''; $('education').value = ''; $('preferred').value = ''; $('consent').checked = false; $('age-confirm').checked = false;
  $('summary').replaceChildren();
  showStep('setup');
});

$('to-upload').addEventListener('click', () => showStep('clock-test'));
$('back-to-handoff').addEventListener('click', () => { clearDrawing(); showStep('clock-test'); });
$('test-back').addEventListener('click', () => showStep('setup'));

let selectedFile = null, previewUrl = null, uploadStatus = '', busy = false, selection = 0;
let originalFile = null, turns = 0, zoom = 1, resultUrl = null;
const previewButtons = ['zoom-in', 'zoom-out', 'zoom-reset', 'rotate-left', 'rotate-right', 'replace-image'];
function status(key) { uploadStatus = key; $('upload-status').textContent = key ? t(key) : ''; $('drawing-status').textContent = key ? t(key) : ''; }
function clearDrawing() {
  selection++;
  selectedFile = null; originalFile = null; turns = 0; zoom = 1; lastResults = null;
  stopSpeaking();
  if (resultUrl) URL.revokeObjectURL(resultUrl);
  resultUrl = null; $('result-image').removeAttribute('src'); $('retry-box').hidden = true;
  updatePreviewTools();
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  previewUrl = null;
  $('file-input').value = ''; $('camera-input').value = '';
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
  for (const id of ['file-input', 'camera-input', 'remove-image', 'back-to-handoff', 'reset']) $(id).disabled = value;
  $('analyze-btn').disabled = value || !selectedFile;
  $('analyze').setAttribute('aria-busy', String(value));
  updatePreviewTools();
}
function updatePreviewTools() {
  const on = Boolean(selectedFile) && !busy;
  for (const id of previewButtons) $(id).disabled = !on;
  $('zoom-out').disabled = !on || zoom <= 1; $('zoom-in').disabled = !on || zoom >= maxZoom;
  $('zoom-reset').disabled = !on || zoom === 1;
  $('zoom-level').textContent = Math.round(zoom * 100) + '%';
  $('dropzone').classList.toggle('zoomed', zoom > 1);
  const img = $('dropzone').querySelector('img');
  if (img) img.style.width = zoom > 1 ? zoom * 100 + '%' : '';
}
async function orientedBlob(file, count) {
  if (count === 0) return file;
  const url = URL.createObjectURL(file);
  try {
    const img = new Image(); img.src = url; await img.decode();
    const size = orientedSize(img.naturalWidth, img.naturalHeight, count);
    const canvas = document.createElement('canvas'); canvas.width = size.width; canvas.height = size.height;
    const g = canvas.getContext('2d');
    g.fillStyle = '#fff'; g.fillRect(0, 0, size.width, size.height);
    g.translate(size.width / 2, size.height / 2); g.rotate(count * Math.PI / 2);
    const drawW = count % 2 ? size.height : size.width, drawH = count % 2 ? size.width : size.height;
    g.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    const type = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
    return await new Promise((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error('rotateFailed')), type, 0.92));
  } finally { URL.revokeObjectURL(url); }
}
// The preview always shows exactly the file that Analyze will send.
async function rotatePreview(direction) {
  if (!originalFile || busy) return;
  const token = selection, next = nextTurns(turns, direction);
  try {
    const blob = await orientedBlob(originalFile, next);
    if (token !== selection) return;
    validateFile(blob);
    const url = URL.createObjectURL(blob);
    $('dropzone').querySelector('img').src = url;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = url; selectedFile = blob; turns = next;
    $('retry-box').hidden = true; status('rotatedStatus');
  } catch { if (token === selection) status('rotateFailed'); }
}
$('rotate-left').addEventListener('click', () => rotatePreview(-1));
$('rotate-right').addEventListener('click', () => rotatePreview(1));
for (const [id, step] of [['zoom-in', 1], ['zoom-out', -1], ['zoom-reset', 0]]) {
  $(id).addEventListener('click', () => { zoom = nextZoom(zoom, step); updatePreviewTools(); });
}
$('replace-image').addEventListener('click', () => $('file-input').click());
$('remove-image').addEventListener('click', () => { clearDrawing(); showStep('clock-test'); });
async function selectImage(file) {
  if (!file || busy || !setup) return;
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
    previewUrl = url; selectedFile = file; originalFile = file;
    img.alt = t('previewAlt');
    $('dropzone').prepend(img); $('dropzone').classList.add('has-image');
    $('analyze-btn').disabled = false; $('remove-image').disabled = false;
    updatePreviewTools();
    status(''); showStep('analyze');
  } catch (error) {
    if (url) URL.revokeObjectURL(url);
    if (token === selection) status(['invalidType','invalidSize'].includes(error.message) ? error.message : 'invalidImage');
  }
}
for (const id of ['file-input', 'camera-input']) $(id).addEventListener('change', e => selectImage(e.target.files?.[0]));
$('analyze-btn').addEventListener('click', async () => {
  if (!selectedFile || busy || !setup) return;
  setBusy(true); status('analyzing');
  try {
    const result = await analyzeClockDrawing(selectedFile);
    modelReady = true; document.querySelector('.demo-banner').hidden = true;
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    resultUrl = URL.createObjectURL(selectedFile); $('result-image').src = resultUrl;
    $('retry-box').hidden = true;
    lastResults = result; renderResults(result); status(''); showStep('results');
  } catch (error) {
    if (error.message === 'notConnected') { modelReady = false; document.querySelector('.demo-banner').hidden = false; }
    status(en[error.message] ? error.message : 'requestFailed');
    $('retry-box').hidden = false;
  }
  finally { setBusy(false); }
});
$('retry-analysis').addEventListener('click', () => $('analyze-btn').click());

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
    const why = document.createElement('details'); why.className = 'why';
    const whySummary = document.createElement('summary'); whySummary.textContent = t('why');
    const whyText = document.createElement('p'); whyText.textContent = explanationText(r, t);
    why.append(whySummary, whyText); card.append(why);
    return card;
  }));
  const score = results.filter(r => r.status === 'pass').length;
  $('final-score').textContent = score;
  $('score-out-of').textContent = t('outOf4');
}

$('to-upload-again').addEventListener('click', () => {
  if ($('file-input')) $('file-input').value = '';
  resetDropzone(); resetCanvas();
  showStep('clock-test');
});
$('to-setup-again').addEventListener('click', () => showStep('setup'));

function buildPrintReport() {
  const model = reportModel(lastResults, t, new Date(), locale);
  const el = (tag, text, cls) => { const n = document.createElement(tag); if (text !== undefined) n.textContent = text; if (cls) n.className = cls; return n; };
  const img = el('img'); img.src = resultUrl; img.alt = t('resultDrawingAlt');
  const rows = model.criteria.map(c => { const d = el('div', undefined, 'print-criterion');
    d.append(el('h3', `${c.label}: ${c.outcome}`), el('p', c.explanation)); return d; });
  $('print-report').replaceChildren(el('h1', model.title), el('p', `${t('printDate')}: ${model.date}`), img,
    el('p', `${t('printScore')}: ${model.score} ${t('outOf4')}`, 'print-score'), ...rows,
    el('p', `${model.modelVersion}`), el('p', t('printNote')));
}
$('print-results').addEventListener('click', () => {
  if (!lastResults || !resultUrl) return;
  buildPrintReport();
  window.print();
});

const speech = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window ? window.speechSynthesis : null;
function currentVoice() { return speech ? pickVoice(speech.getVoices(), locale) : null; }
function updateSpeechAvailability() {
  const ok = Boolean(currentVoice());
  $('speak-results').disabled = !ok;
  $('speech-status').textContent = ok ? '' : t('noVoice');
}
function stopSpeaking(announce) {
  if (speech && speech.speaking) speech.cancel();
  $('stop-speaking').hidden = true;
  if (announce) $('speech-status').textContent = t('speechStopped');
}
$('speak-results').addEventListener('click', () => {
  const voice = currentVoice();
  if (!lastResults || !voice) return updateSpeechAvailability();
  speech.cancel();
  const u = new SpeechSynthesisUtterance(speechSummary(lastResults, t));
  u.voice = voice; u.lang = voice.lang;
  u.onend = u.onerror = () => { $('stop-speaking').hidden = true; };
  $('stop-speaking').hidden = false; $('speech-status').textContent = t('speaking');
  speech.speak(u);
});
$('stop-speaking').addEventListener('click', () => stopSpeaking(true));
if (speech) speech.addEventListener('voiceschanged', updateSpeechAvailability);

function init() {
  translate();
  showStep('setup');
}
init();
