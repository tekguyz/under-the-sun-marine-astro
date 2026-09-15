for (const root of document.querySelectorAll<HTMLElement>('[data-ba]')) {
  const range = root.querySelector<HTMLInputElement>('[data-ba-range]');
  if (!range) continue;
  const update = () => root.style.setProperty('--pos', `${range.value}%`);
  range.addEventListener('input', update);
  update();
}
