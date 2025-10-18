// app/lib/smoothScroll.js
export function smoothScrollTo(hash, offset = 80) {
  const id = hash?.replace('#', '');
  if (!id) return;
  const el = document.getElementById(id);
  if (!el) return;

  const rect = el.getBoundingClientRect();
  const targetY = rect.top + window.pageYOffset - offset;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    window.scrollTo(0, targetY);
    return;
  }
  window.scrollTo({ top: targetY, behavior: 'smooth' });
}
