const dialog = document.querySelector<HTMLDialogElement>('#lightbox');
const links = [...document.querySelectorAll<HTMLAnchorElement>('a[data-lightbox]')];

if (dialog && links.length) {
  const img = dialog.querySelector<HTMLImageElement>('img')!;
  const caption = dialog.querySelector<HTMLElement>('[data-caption]')!;
  const counter = dialog.querySelector<HTMLElement>('[data-counter]')!;
  let index = 0;
  let opener: HTMLElement | null = null;

  const show = (i: number) => {
    index = (i + links.length) % links.length;
    const link = links[index];
    img.src = link.href;
    img.alt = link.dataset.alt ?? '';
    caption.textContent = link.dataset.alt ?? '';
    counter.textContent = `${index + 1} / ${links.length}`;
  };

  links.forEach((link, i) =>
    link.addEventListener('click', (event) => {
      // Let Ctrl/Cmd/Shift-click open the photo in a new tab or window.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      show(i);
      document.documentElement.style.overflow = 'hidden';
      dialog.showModal();
    }),
  );

  dialog.querySelector('[data-prev]')!.addEventListener('click', () => show(index - 1));
  dialog.querySelector('[data-next]')!.addEventListener('click', () => show(index + 1));
  dialog.querySelector('[data-close]')!.addEventListener('click', () => dialog.close());

  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') show(index + 1);
    if (event.key === 'ArrowLeft') show(index - 1);
  });

  // Click on the backdrop (the dialog itself, not its content) closes it.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  let startX = 0;
  dialog.addEventListener('touchstart', (event) => (startX = event.touches[0].clientX), { passive: true });
  dialog.addEventListener('touchend', (event) => {
    const dx = event.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
  });

  dialog.addEventListener('close', () => {
    document.documentElement.style.overflow = '';
    opener?.focus();
  });
}
