const root = document.documentElement;
let frame = 0;
const forestLamps = [];

function updateBrightness() {
  frame = 0;
  const range = root.scrollHeight - root.clientHeight;
  const progress = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
  for (const { lamp, start, end, opacity } of forestLamps) {
    const phase = Math.min(1, Math.max(0, (progress - start) / (end - start)));
    const eased = phase * phase * (3 - 2 * phase);
    lamp.style.setProperty('--opacity', String(opacity * (0.2 + 0.8 * eased)));
  }
}

function scheduleBrightness() {
  if (!frame) frame = requestAnimationFrame(updateBrightness);
}

window.addEventListener('scroll', scheduleBrightness, { passive: true });
window.addEventListener('resize', scheduleBrightness);
window.addEventListener('pageshow', scheduleBrightness);
const backdrop = document.querySelector('.backdrop');
const lamps = document.createDocumentFragment();
for (let depth = 3; depth >= 0; depth--) {
  const count = 4 + depth * 3;
  const scale = 0.63 ** depth;
  for (let i = 0; i < count; i++) {
    const lamp = document.createElement('span');
    const slot = (i + 0.15 + Math.random() * 0.7) / count;
    const x = depth === 0 ? slot * 97 + 1.5 : 58 + (slot - 0.5) * (97 - depth * 15);
    const y = 2 + depth * 4 + Math.random() * 8;
    lamp.className = 'mirror-lamp';
    lamp.style.setProperty('--x', x + '%');
    lamp.style.setProperty('--y', y + '%');
    lamp.style.setProperty('--size', `clamp(${55 * scale}px, ${(10 + Math.random() * 5) * scale}vmin, ${130 * scale}px)`);
    const opacity = 0.88 * scale;
    lamp.style.setProperty('--opacity', String(opacity));
    forestLamps.push({ lamp, opacity });
    lamp.style.setProperty('--tilt', (Math.random() * 8 - 4) + 'deg');
    lamp.style.setProperty('--blur', depth * 0.38 + 'px');
    lamp.style.setProperty('--flip', i % 2 ? '-1' : '1');
    lamps.append(lamp);
  }
}
backdrop.append(lamps);
backdrop.classList.add('has-mirrors');

for (let i = forestLamps.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [forestLamps[i], forestLamps[j]] = [forestLamps[j], forestLamps[i]];
}
forestLamps.forEach((lamp, index) => {
  lamp.start = 0.02 + 0.86 * index / (forestLamps.length - 1);
  lamp.end = lamp.start + 0.12;
});
updateBrightness();
