for (const root of document.querySelectorAll<HTMLElement>('[data-ba]')) {
  const range = root.querySelector<HTMLInputElement>('[data-ba-range]');
  if (!range) continue;

  const update = () => {
    const value = Number(range.value);
    root.style.setProperty('--pos', `${value}%`);
    range.setAttribute('aria-valuetext', `${value}% before, ${100 - value}% after`);
  };

  // Pointer drag anywhere on the photo (the range input handles keyboard).
  const setFromPointer = (clientX: number) => {
    const rect = root.getBoundingClientRect();
    const pct = Math.round(((clientX - rect.left) / rect.width) * 100);
    range.value = String(Math.min(100, Math.max(0, pct)));
    update();
  };

  root.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    root.setPointerCapture(event.pointerId);
    root.toggleAttribute('data-dragging', true);
    setFromPointer(event.clientX);
  });
  root.addEventListener('pointermove', (event) => {
    if (root.hasAttribute('data-dragging')) setFromPointer(event.clientX);
  });
  const stop = () => root.removeAttribute('data-dragging');
  root.addEventListener('pointerup', stop);
  root.addEventListener('pointercancel', stop);

  range.addEventListener('input', update);
  update();
}
