// app/components/ScrollProgress.jsx
'use client';
import { useEffect } from 'react';

export default function ScrollProgress() {
  useEffect(() => {
    const root = document.documentElement;
    let ticking = false;

    const update = () => {
      ticking = false;
      const el = document.scrollingElement || document.documentElement;
      const max = el.scrollHeight - el.clientHeight || 1;
      const p = el.scrollTop / max; // 0..1
      root.style.setProperty('--scrollP', p.toFixed(4));
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    // run once and bind listeners
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <>
      <div className="scroll-progress" aria-hidden="true" />
      <style jsx>{`
        .scroll-progress {
          position: fixed;
          top: 0; left: 0;
          height: 3px;
          width: 100%;
          transform-origin: 0 50%;
          transform: scaleX(var(--scrollP, 0));
          background: linear-gradient(90deg, var(--g1, #0d6efd), var(--g2, #4ea4ff), var(--g3, #9ed1ff));
          box-shadow: 0 0 12px rgba(39, 95, 202, .35);
          z-index: 9999;
          will-change: transform;
          pointer-events: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .scroll-progress { transition: none !important; }
        }
      `}</style>
    </>
  );
}
