// app/components/Navbar.jsx
'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import logo from '../../public/logo.png';

export default function Navbar() {
  const pathname = usePathname();

  // Active section only (no state for scrolled/progress → smoother)
  const [activeSection, setActiveSection] = useState(null);

  // Refs
  const navRef = useRef(null);
  const ctaRef = useRef(null);
  const linkRefs = useRef({});

  // Sections to observe (include 'home')
  const sections = useMemo(
    () => ['home', 'skills', 'projects', 'experience', 'contact'],
    []
  );

  const isActivePath = (p) => (pathname === p ? 'active' : '');
  const isActiveSection = (id) => (activeSection === id ? 'active' : '');

  /* ---------- Helpers ---------- */
  const smoothScrollTo = (hash, offset = 80) => {
    let target = null;
    try {
      target = document.querySelector(hash);
    } catch {
      target = null;
    }
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const absoluteY = rect.top + window.pageYOffset - offset;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.scrollTo({
      top: absoluteY,
      behavior: reduced ? 'auto' : 'smooth',
    });
  };

  /* ---------- Scroll (GPU-friendly): nav shrink + progress ---------- */
  useEffect(() => {
    const root = document.documentElement;
    const nav = navRef.current;
    if (!nav) return;

    let ticking = false;

    const update = () => {
      ticking = false;
      const el = document.scrollingElement || document.documentElement;
      const y = el.scrollTop || 0;

      // shrink value 0|1
      const shrink = y > 24 ? '1' : '0';
      root.style.setProperty('--navShrink', shrink);
      // for styling without React state
      nav.dataset.scrolled = shrink;

      // progress 0..100%
      const max = el.scrollHeight - el.clientHeight;
      const pct = max > 0 ? (y / max) * 100 : 0;
      nav.style.setProperty('--navProg', `${pct.toFixed(2)}%`);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    // run once and bind
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
    };
  }, []);

  /* ---------- Smooth anchor scroll + collapse on click ---------- */
  useEffect(() => {
    const click = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (!href || href === '#') return;

      e.preventDefault();
      smoothScrollTo(href, 80);

      // Close Bootstrap collapse if open
      const nav = document.getElementById('nav');
      if (nav?.classList.contains('show')) {
        const toggler = document.querySelector(
          '[data-bs-toggle="collapse"][data-bs-target="#nav"]'
        );
        toggler?.dispatchEvent(new Event('click', { bubbles: true }));
      }
    };
    document.addEventListener('click', click);
    return () => document.removeEventListener('click', click);
  }, []);

  /* ---------- Scroll-spy (IntersectionObserver) ---------- */
  useEffect(() => {
    const els = sections
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((en) => en.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length) setActiveSection(visible[0].target.id);
      },
      { root: null, rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  /* ---------- Tiny anime.js pulse when active link changes ---------- */
  useEffect(() => {
    if (!activeSection) return;
    const el = linkRefs.current[activeSection];
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    let stopped = false;
    (async () => {
      try {
        const mod = await import('animejs');
        const anime = mod.default || mod.anime || mod;
        if (stopped || typeof anime !== 'function') return;

        anime({
          targets: el,
          scale: [1, 1.08, 1],
          duration: 420,
          easing: 'easeOutQuad',
        });
      } catch {}
    })();

    return () => {
      stopped = true;
    };
  }, [activeSection]);

  /* ---------- 3D gyro parallax (cursor) ---------- */
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.setProperty('--rx', '0');
      el.style.setProperty('--ry', '0');
      el.style.setProperty('--mx', '0.5');
      el.style.setProperty('--my', '0.5');
      return;
    }

    let raf = 0;
    let targetX = 0.5,
      targetY = 0.5;
    let currentX = targetX,
      currentY = targetY;

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      targetX = Math.min(1, Math.max(0, x));
      targetY = Math.min(1, Math.max(0, y));
      if (!raf) tick();
    };

    const onLeave = () => {
      targetX = 0.5;
      targetY = 0.5;
      if (!raf) tick();
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      const ry = (currentX - 0.5) * 6; // left/right
      const rx = (currentY - 0.5) * -6; // up/down

      el.style.setProperty('--mx', String(currentX));
      el.style.setProperty('--my', String(currentY));
      el.style.setProperty('--rx', `${rx.toFixed(3)}deg`);
      el.style.setProperty('--ry', `${ry.toFixed(3)}deg`);

      if (
        Math.abs(targetX - currentX) > 0.001 ||
        Math.abs(targetY - currentY) > 0.001
      ) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* ---------- Magnetic CTA button ---------- */
  useEffect(() => {
    const btn = ctaRef.current;
    const nav = navRef.current;
    if (!btn || !nav) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0;

    const onMove = (e) => {
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      tx = Math.max(-14, Math.min(14, dx * 0.15));
      ty = Math.max(-10, Math.min(10, dy * 0.15));
      if (!raf) step();
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      if (!raf) step();
    };
    const step = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      btn.style.transform = `translate(${cx}px, ${cy}px)`;
      if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) {
        raf = requestAnimationFrame(step);
      } else {
        raf = 0;
      }
    };

    nav.addEventListener('mousemove', onMove);
    nav.addEventListener('mouseleave', onLeave);
    return () => {
      nav.removeEventListener('mousemove', onMove);
      nav.removeEventListener('mouseleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* ---------- CSS ---------- */
  const css = `
    .navbar-merge {
      --card: var(--bs-body-bg, #ffffff);
      --border: color-mix(in oklab, #0e1a36 18%, transparent);
      --text: var(--bs-body-color, #0e1a36);
      --rainbow: linear-gradient(90deg,#6a8dff,#00d1ff,#5ad7b0,#ffea00,#ff5bd1,#6a8dff);
      --rx: 0deg; --ry: 0deg; --mx: .5; --my: .5;

      position: sticky; top: 0; z-index: 1030;
      background: color-mix(in oklab, var(--card) 94%, transparent);
      backdrop-filter: saturate(140%) blur(calc(6px + 4px * var(--navShrink, 0)));
      border-bottom: 1px solid var(--border);
      transition: background .25s ease, box-shadow .25s ease, backdrop-filter .25s ease;
      transform: perspective(1200px) rotateX(var(--rx)) rotateY(var(--ry));
      transform-style: preserve-3d;
      box-shadow: 0 10px 30px rgba(16,38,73, calc(.06 + .06 * var(--navShrink, 0)));
    }
    @media (prefers-color-scheme: dark) {
      .navbar-merge { --card: color-mix(in oklab, #0b162b 94%, #0b162b); --border: color-mix(in oklab, #a9b6d3 18%, transparent); --text: #dde6ff; }
    }

    .nav-progress { position: absolute; left: 0; right: 0; top: 0; height: 2px; overflow: hidden; transform: translateZ(8px); }
    .nav-progress > i {
      position: absolute; left: 0; top: 0; bottom: 0;
      background: var(--rainbow); background-size: 300% 100%;
      animation: rainbowShift 16s linear infinite;
      transform-origin: left;
      width: var(--navProg, 0%);
    }
    @keyframes rainbowShift { 0% {background-position:0% 50%} 50% {background-position:100% 50%} 100% {background-position:0% 50%} }

    .navbar-merge::after {
      content: ""; position: absolute; left: 0; right: 0; bottom: -1px; height: 2px;
      background: var(--rainbow); background-size: 300% 100%;
      animation: rainbowShift 14s linear infinite; opacity: .85; transform: translateZ(6px);
    }

    .brand-wrap { position: relative; display:flex; align-items:center; gap:.55rem; transform: translateZ(14px); }
    .brand-name { background: linear-gradient(90deg,#6a8dff,#00d1ff,#ff5bd1,#6a8dff); background-size: 300% 100%;
      -webkit-background-clip: text; background-clip: text; color: transparent; animation: rainbowShift 10s ease-in-out infinite; letter-spacing:.2px; }

    .brand-cube { position:absolute; left:-14px; top:50%; transform: translate(-50%, -50%); width: 18px; height: 18px; perspective: 600px; pointer-events:none; }
    .cube { position:relative; width:100%; height:100%; transform-style:preserve-3d; animation:cubeSpin 8s linear infinite; filter: drop-shadow(0 4px 10px rgba(16,38,73,.18)); }
    .cube-face { position:absolute; inset:0; background: var(--rainbow); background-size:300% 100%; opacity:.9; border-radius:4px; }
    .cube-face.front{ transform: translateZ(9px); } .cube-face.back{ transform: rotateY(180deg) translateZ(9px); }
    .cube-face.right{ transform: rotateY(90deg) translateZ(9px); } .cube-face.left{ transform: rotateY(-90deg) translateZ(9px); }
    .cube-face.top{ transform: rotateX(90deg) translateZ(9px); } .cube-face.bottom{ transform: rotateX(-90deg) translateZ(9px); }
    @keyframes cubeSpin { 0%{transform:rotateX(0) rotateY(0)} 100%{transform:rotateX(360deg) rotateY(360deg)} }

    .navbar-merge .navbar-brand img { border-radius: 50%; transition: transform .25s ease, filter .25s ease; transform: translateZ(16px); }
    .navbar-merge .navbar-brand:hover img { transform: translateZ(16px) scale(1.08) rotate(-4deg); filter: brightness(1.1); }

    .navbar-merge .nav-link {
      position: relative; color: color-mix(in oklab, var(--text) 88%, white 12%);
      opacity: .92; padding: .5rem .6rem; border-radius: 10px;
      transition: color .2s ease, opacity .2s ease, background .2s ease, transform .2s ease;
      transform: translateZ(var(--depth, 8px));
    }
    .navbar-merge .nav-link:hover { color: var(--text); opacity: 1; transform: translateZ(14px); }
    .navbar-merge .nav-link::after {
      content: ""; position: absolute; left: 10px; right: 10px; bottom: 6px; height: 2px;
      background: var(--rainbow); background-size: 250% 100%; transform: scaleX(0);
      transform-origin: left; transition: transform .25s ease; border-radius: 4px;
    }
    .navbar-merge .nav-link:hover::after, .navbar-merge .nav-link.active::after { transform: scaleX(1); }

    .navbar-merge .btn-rainbow {
      border: 0; border-radius: 14px; padding: 8px 14px; color: #fff !important;
      background: var(--rainbow); background-size: 300% 100%;
      box-shadow: 0 14px 34px rgba(16,38,73,.18);
      animation: rainbowShift 12s linear infinite;
      transition: transform .22s ease, box-shadow .22s ease, filter .22s ease;
      transform: translateZ(18px); will-change: transform;
    }
    .navbar-merge .btn-rainbow:hover { filter: brightness(1.05); box-shadow: 0 18px 38px rgba(16,38,73,.22); }

    @media (prefers-reduced-motion: reduce){
      .navbar-merge{ transform:none !important }
      .brand-cube .cube{ animation:none !important }
      .nav-progress > i, .navbar-merge::after, .brand-name{ animation:none !important }
      .navbar-merge .btn-rainbow{ animation:none !important; transform:none !important }
      .navbar-merge .nav-link{ transform:none !important }
    }
  `;

  /* ---------- Render ---------- */
  return (
    <nav ref={navRef} className="navbar navbar-expand-lg navbar-merge" data-scrolled="0">
      {/* Progress line (width driven by CSS var --navProg) */}
      <div className="nav-progress" aria-hidden="true">
        <i />
      </div>

      <div className="container">
        {/* Brand scrolls to #home */}
        <a className="navbar-brand d-flex align-items-center gap-2 position-relative" href="#home">
          {/* tiny 3D cube */}
          <span className="brand-cube" aria-hidden="true">
            <span className="cube">
              <i className="cube-face front" />
              <i className="cube-face back" />
              <i className="cube-face right" />
              <i className="cube-face left" />
              <i className="cube-face top" />
              <i className="cube-face bottom" />
            </span>
          </span>

          <span className="brand-wrap">
            <Image src={logo} alt="Biswajit Logo" width={55} height={55} priority />
            <span className="brand-name fw-bold">Biswajit</span>
          </span>
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav"
          aria-controls="nav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center gap-lg-2">
            <li className="nav-item">
              <a
                href="#home"
                ref={(el) => (linkRefs.current['home'] = el)}
                className={`nav-link ${
                  activeSection ? '' : isActivePath('/') || 'active'
                } ${isActiveSection('home')}`}
                style={{ '--depth': '10px' }}
              >
                Home
              </a>
            </li>
            <li className="nav-item">
              <a
                ref={(el) => (linkRefs.current['skills'] = el)}
                className={`nav-link ${isActiveSection('skills')}`}
                href="#skills"
                style={{ '--depth': '8px' }}
              >
                Skills
              </a>
            </li>
            <li className="nav-item">
              <a
                ref={(el) => (linkRefs.current['projects'] = el)}
                className={`nav-link ${isActiveSection('projects')}`}
                href="#projects"
                style={{ '--depth': '8px' }}
              >
                Projects
              </a>
            </li>
            <li className="nav-item">
              <a
                ref={(el) => (linkRefs.current['experience'] = el)}
                className={`nav-link ${isActiveSection('experience')}`}
                href="#experience"
                style={{ '--depth': '8px' }}
              >
                Experience
              </a>
            </li>
            <li className="nav-item">
              <a
                ref={(el) => (linkRefs.current['contact'] = el)}
                className={`nav-link ${isActiveSection('contact')}`}
                href="#contact"
                style={{ '--depth': '8px' }}
              >
                Contact
              </a>
            </li>
            <li className="nav-item d-flex align-items-center ms-lg-2">
              <a ref={ctaRef} className="btn btn-sm btn-rainbow" href="#contact">
                Let&apos;s Talk
              </a>
            </li>
          </ul>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: css }} />
    </nav>
  );
}
