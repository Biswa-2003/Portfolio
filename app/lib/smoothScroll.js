// lib/smoothScroll.js
let teardown;

export function initSmoothScroll() {
  if (teardown) return teardown;

  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        // 👉 do only cheap work here (read scrollTop once, write CSS vars)
        const el = document.scrollingElement || document.documentElement;
        const y = el.scrollTop || 0;
        document.documentElement.style.setProperty('--y', `${Math.round(y)}`);
      });
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  teardown = () => window.removeEventListener('scroll', onScroll);
  return teardown;
}
