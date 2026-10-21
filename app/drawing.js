// Original strokes are kept in page memory only; no clock features are supplied.
const canvas = $('drawing-canvas');
const ink = canvas.getContext('2d', { willReadFrequently: true });
let strokes = [], activeStroke = null, activePointer = null, tool = 'pen';
let keyboardDrawing = false, cursor = { x: 400, y: 400 };
function drawStroke(stroke) {
  ink.strokeStyle = ink.fillStyle = stroke.tool === 'eraser' ? '#fff' : '#111';
  ink.lineWidth = stroke.tool === 'eraser' ? 30 : 4;
  ink.lineCap = ink.lineJoin = 'round';
  ink.beginPath();
  stroke.points.forEach((p, i) => i ? ink.lineTo(p.x, p.y) : ink.moveTo(p.x, p.y));
  ink.stroke();
  if (stroke.points.length === 1) {
    const p = stroke.points[0]; ink.beginPath(); ink.arc(p.x, p.y, ink.lineWidth / 2, 0, Math.PI * 2); ink.fill();
  }
}
function hasInk() {
  const pixels = ink.getImageData(0, 0, 800, 800).data;
  for (let i = 0; i < pixels.length; i += 4) if (pixels[i] < 240) return true;
  return false;
}
function redraw() {
  ink.fillStyle = '#fff'; ink.fillRect(0, 0, 800, 800);
  strokes.forEach(drawStroke);
  $('undo').disabled = $('clear-canvas').disabled = strokes.length === 0;
  $('submit-drawing').disabled = !hasInk();
}
function endStroke() {
  if (activeStroke) { activeStroke = null; status('drawingChanged'); redraw(); }
  activePointer = null; keyboardDrawing = false;
}
function resetCanvas() {
  endStroke(); strokes = []; redraw(); status('drawingCleared');
}
function beginStroke(point) {
  activeStroke = { tool, points: [point] }; strokes.push(activeStroke); drawStroke(activeStroke);
}
function extendStroke(point) {
  const previous = activeStroke.points[activeStroke.points.length - 1];
  activeStroke.points.push(point); drawStroke({ tool: activeStroke.tool, points: [previous, point] });
}
function pointFromEvent(e) {
  const rect = canvas.getBoundingClientRect();
  return { x: Math.max(0, Math.min(800, (e.clientX - rect.left) * 800 / rect.width)),
    y: Math.max(0, Math.min(800, (e.clientY - rect.top) * 800 / rect.height)) };
}
canvas.addEventListener('pointerdown', e => {
  if (activePointer !== null || e.button !== 0) return;
  endStroke(); e.preventDefault(); canvas.focus(); activePointer = e.pointerId;
  canvas.setPointerCapture(e.pointerId); beginStroke(pointFromEvent(e));
});
canvas.addEventListener('pointermove', e => {
  if (activePointer === e.pointerId && activeStroke) extendStroke(pointFromEvent(e));
});
for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) canvas.addEventListener(event, e => {
  if (activePointer === e.pointerId) endStroke();
});
function showCursor() {
  const marker = $('pen-cursor'); marker.hidden = false;
  marker.style.left = cursor.x / 8 + '%'; marker.style.top = cursor.y / 8 + '%';
}
canvas.addEventListener('keydown', e => {
  if (activePointer !== null) return;
  if (e.key === ' ' || e.key === 'Escape') {
    e.preventDefault();
    if (keyboardDrawing || e.key === 'Escape') { endStroke(); status('keyboardOff'); }
    else { beginStroke({ ...cursor }); keyboardDrawing = true; status('keyboardOn'); }
    showCursor(); return;
  }
  const delta = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
  if (!delta) return;
  e.preventDefault(); const step = e.shiftKey ? 20 : 5;
  cursor = { x: Math.max(0, Math.min(800, cursor.x + delta[0] * step)), y: Math.max(0, Math.min(800, cursor.y + delta[1] * step)) };
  if (keyboardDrawing) extendStroke({ ...cursor });
  showCursor();
});
canvas.addEventListener('blur', () => { endStroke(); $('pen-cursor').hidden = true; });
for (const id of ['pen', 'eraser']) $(id).addEventListener('click', () => {
  endStroke(); tool = id;
  for (const name of ['pen', 'eraser']) $(name).setAttribute('aria-pressed', String(name === tool));
});
$('undo').addEventListener('click', () => { endStroke(); strokes.pop(); redraw(); status('drawingChanged'); });
$('clear-canvas').addEventListener('click', resetCanvas);
$('submit-drawing').addEventListener('click', () => {
  endStroke();
  if (!hasInk()) { status('emptyDrawing'); return; }
  $('submit-drawing').disabled = true;
  const token = selection;
  canvas.toBlob(async blob => {
    if (token !== selection) { redraw(); return; }
    if (blob) await selectImage(blob); else status('exportFailed');
    redraw();
  }, 'image/png');
});
redraw();
