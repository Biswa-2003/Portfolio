// lib/useScrollSpy.js
'use client';
import { useEffect, useState } from 'react';

export default function useScrollSpy(
  sectionIds = [],
  options = { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
) {
  const [activeId, setActiveId] = useState(sectionIds[0] || null);

  useEffect(() => {
    if (!sectionIds.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: options.rootMargin ?? '-40% 0px -55% 0px',
        threshold: options.threshold ?? 0,
      }
    );

    // Observe all provided sections
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds, options.rootMargin, options.threshold]);

  return activeId;
}
