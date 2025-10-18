'use client';
import { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [w, setW] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const max = h.scrollHeight - h.clientHeight;
      setW(max > 0 ? (scrolled / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <>
      <div className="scroll-progress" style={{ width: `${w}%` }} />
      <style jsx>{`
        .scroll-progress {
          position: fixed;
          top: 0; left: 0;
          height: 3px;
          z-index: 9999;
          background: linear-gradient(90deg, var(--g1), var(--g2), var(--g3));
          box-shadow: 0 0 12px rgba(39,95,202,.35);
          transition: width .08s linear;
        }
        @media (prefers-reduced-motion: reduce) {
          .scroll-progress { transition: none; }
        }
      `}</style>
    </>
  );
}
