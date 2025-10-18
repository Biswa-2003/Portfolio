'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

/* -------------------------------
   Tiny 3D tilt (no deps)
-------------------------------- */
function Tilt({ children, maxTilt = 10, revealDelay = 0 }) {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const glareRef = useRef(null);

  // scroll reveal once visible
  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    el.style.transitionDelay = `${revealDelay}ms`;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('reveal-in');
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [revealDelay]);

  function onMove(e) {
    const card = innerRef.current;
    if (!card) return;
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;  // 0..1
    const py = (e.clientY - r.top) / r.height;  // 0..1
    const rx = (py - 0.5) * -2 * maxTilt;
    const ry = (px - 0.5) *  2 * maxTilt;
    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    if (glareRef.current) {
      const dx = px * 100;
      const dy = py * 100;
      glareRef.current.style.background = `radial-gradient(circle at ${dx}% ${dy}%, rgba(255,255,255,.45), transparent 55%)`;
      glareRef.current.style.opacity = 1;
    }
  }
  function onLeave() {
    const card = innerRef.current;
    if (!card) return;
    card.style.transform = `rotateX(0deg) rotateY(0deg) translateZ(0)`;
    if (glareRef.current) glareRef.current.style.opacity = 0;
  }

  return (
    <div ref={outerRef} className="tilt-outer reveal" onMouseMove={onMove} onMouseLeave={onLeave}>
      <div ref={innerRef} className="tilt-inner">
        <span ref={glareRef} className="tilt-glare" aria-hidden="true" />
        {children}
      </div>
    </div>
  );
}

/* -------------------------------
   Parallax thumb (image layers)
   NOTE: Next/Image doesn't forward ref.
   We apply transform on a wrapper div (.pj-imgLayer).
-------------------------------- */
function ParallaxThumb({ src, alt, idx }) {
  const wrap = useRef(null);
  const imgLayerRef = useRef(null);
  const overlayRef = useRef(null);
  const gridRef = useRef(null);

  function onMove(e) {
    const r = wrap.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;  // -0.5..0.5
    const y = (e.clientY - r.top) / r.height - 0.5;
    if (imgLayerRef.current) {
      imgLayerRef.current.style.transform = `translate(${x * 8}px, ${y * 8}px) scale(1.05)`;
    }
    if (overlayRef.current) overlayRef.current.style.transform = `translate(${x * -10}px, ${y * -10}px)`;
    if (gridRef.current) gridRef.current.style.transform = `translate(${x * 12}px, ${y * 12}px)`;
  }
  function onLeave() {
    if (imgLayerRef.current) imgLayerRef.current.style.transform = `translate(0,0) scale(1)`;
    if (overlayRef.current) overlayRef.current.style.transform = `translate(0,0)`;
    if (gridRef.current) gridRef.current.style.transform = `translate(0,0)`;
  }

  return (
    <div className="pj-thumb" ref={wrap} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="pj-imgLayer">
        {src && (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="pj-img"
            priority={idx === 0}
          />
        )}
      </div>
      <div className="pj-thumb-overlay" ref={overlayRef} />
      <div className="pj-thumb-grid" ref={gridRef} />
      <span className="pj-badge">{String(idx + 1).padStart(2, '0')}</span>
      {/* keep ref on layer, not Image */}
      <span ref={imgLayerRef} className="pj-imgLayer-proxy" style={{ display: 'none' }} />
    </div>
  );
}

export default function Projects() {
  const projects = [
    {
      title: 'Contact Management Project',
      desc: 'CRUD contacts with auth, search, pagination, and image upload.',
      stack: 'Next.js, Node, Express, PostgreSQL, JWT',
      link: 'https://github.com/Biswa-2003/Contact_manegment',
      image: '/contact.png',
      alt: 'Contact Management UI',
    },
    {
      title: 'Matrimony',
      desc: 'Profile creation, JWT auth, image crop/upload, JSONB profile sections.',
      stack: 'Next.js, React-Bootstrap, Node, Express, PostgreSQL',
      link: '#',
      image: '/matrimony.png',
      alt: 'Matrimony preview',
    },
    {
      title: 'Property',
      desc: 'Dynamic property listing, enquiry tracking, gallery, JSONB storage.',
      stack: 'Next.js, Node, Express, PostgreSQL',
      link: '#',
      image: '/property.png',
      alt: 'Property preview',
    },
    {
      title: 'Portfolio Site',
      desc: 'This site you are viewing. Clean UI with Bootstrap + custom CSS.',
      stack: 'Next.js, Bootstrap',
      link: '#',
      image: '/portfolio.png',
      alt: 'Portfolio website preview',
    },
  ];

  const css = `
    @keyframes rainbowShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
    @keyframes driftGrid{0%{background-position:0 0,0 0}100%{background-position:120px 120px,-120px -120px}}
    @keyframes shineSweep{0%{transform:translateX(-130%) skewX(-18deg)}100%{transform:translateX(130%) skewX(-18deg)}}

    .pj-head{display:grid;place-items:center;row-gap:.35rem}
    .pj-title{
      background:linear-gradient(90deg,#a0b8ff,#7ab8ff,#ff6bd6,#a0b8ff);
      background-size:300% 100%;
      -webkit-background-clip:text;background-clip:text;color:transparent;
      animation:rainbowShift 10s ease-in-out infinite;letter-spacing:.3px;
    }
    .pj-underline{
      width:140px;height:6px;border-radius:999px;
      background:var(--rainbow);background-size:300% 100%;animation:rainbowShift 12s linear infinite;
      filter:drop-shadow(0 6px 14px rgba(16,38,73,.25));
    }

    .tilt-outer{ perspective: 1000px; }
    .tilt-inner{
      position:relative; border-radius:18px; transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease, opacity .35s ease, translate .35s ease;
      will-change: transform; transform-style: preserve-3d;
      border:1px solid var(--border); background: var(--card); box-shadow: 0 16px 38px rgba(16,38,73,.14);
    }
    .tilt-glare{
      content:""; position:absolute; inset:-1px; border-radius:18px; pointer-events:none; opacity:0; transition:opacity .15s ease; mix-blend-mode: screen;
      background: radial-gradient(circle at 50% 50%, rgba(255,255,255,.45), transparent 55%);
      z-index:1;
    }
    .reveal{ opacity:0; translate: 0 12px; }
    .reveal.reveal-in{ opacity:1; translate: 0 0; }

    .pj-card{ position:relative;border-radius:18px;padding:16px; overflow:hidden; z-index:0; }
    .pj-card::before{
      content:"";position:absolute;inset:-1px;border-radius:inherit;padding:1px;z-index:-1;
      background:conic-gradient(from 0deg,#6a8dff,#00d1ff,#ff6bd6,#6a8dff);
      -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
      -webkit-mask-composite:xor;mask-composite:exclude;opacity:.55;animation:rainbowShift 16s linear infinite;
    }
    .tilt-outer:hover .tilt-inner{ box-shadow:0 22px 54px rgba(16,38,73,.22); border-color:color-mix(in oklab,var(--primary) 38%,var(--border)) }

    .pj-thumb{
      position:relative;border-radius:14px;overflow:hidden;margin-bottom:12px;
      aspect-ratio: 16 / 9;
      background:
        radial-gradient(80% 60% at 90% 20%, color-mix(in oklab, var(--primary) 26%, transparent) 0%, transparent 70%),
        radial-gradient(70% 60% at 15% 75%, color-mix(in oklab, #ff6bd6 20%, transparent) 0%, transparent 70%);
      filter:saturate(115%);
      transform-style: preserve-3d;
    }
    .pj-imgLayer { position:absolute; inset:0; transition:transform .35s ease; will-change: transform; }
    .pj-img{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
    .pj-thumb-overlay, .pj-thumb-grid{ transition: transform .35s ease; will-change: transform; }
    .pj-thumb-overlay{
      position:absolute; inset:0; pointer-events:none; z-index:1;
      background:
        radial-gradient(120% 120% at 0% 100%, rgba(255,107,214,.22), transparent 60%),
        radial-gradient(120% 120% at 100% 0%, rgba(0,209,255,.22), transparent 60%);
      mix-blend-mode:soft-light;
    }
    .pj-thumb-grid{
      position:absolute; inset:0; opacity:.22; pointer-events:none; mix-blend-mode:overlay; z-index:1;
      background:
        repeating-linear-gradient(45deg, rgba(255,255,255,.12) 0 1px, transparent 1px 20px),
        repeating-linear-gradient(-45deg, rgba(255,255,255,.10) 0 1px, transparent 1px 20px);
      animation:driftGrid 22s linear infinite;
    }
    .pj-badge{
      position:absolute; top:10px; left:10px; font-size:.8rem; padding:.25rem .55rem; border-radius:999px; z-index:2;
      background:color-mix(in oklab,var(--card) 92%,transparent);border:1px solid var(--border);color:var(--text);
      box-shadow:0 8px 18px rgba(16,38,73,.12);
      transform: translateZ(24px);
    }

    .pj-below{ transform-style: preserve-3d; }
    .pj-tags{display:flex;flex-wrap:wrap;gap:6px}
    .pj-tag{
      font-size:.75rem;padding:.28rem .55rem;border-radius:999px;
      background:color-mix(in oklab,var(--card) 92%,transparent);border:1px solid var(--border);color:var(--text);
      box-shadow:0 8px 18px rgba(16,38,73,.08);
      animation:fadeUp .35s ease both;
    }
    .pj-tag:nth-child(1){animation-delay:.05s}.pj-tag:nth-child(2){animation-delay:.1s}
    .pj-tag:nth-child(3){animation-delay:.15s}.pj-tag:nth-child(4){animation-delay:.2s}
    .pj-tag:nth-child(5){animation-delay:.25s}

    .pj-link{
      position:relative;display:inline-flex;align-items:center;gap:.4rem;
      padding:.5rem .9rem;border-radius:12px;border:0;color:#fff;text-decoration:none;
      background:var(--rainbow);background-size:300% 100%;animation:rainbowShift 12s linear infinite;
      box-shadow:0 14px 34px rgba(16,38,73,.18);transition:transform .18s ease; transform: translateZ(12px);
    }
    .pj-link:hover{transform:translateZ(12px) translateY(-1px)}
    .pj-link::before{
      content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;
      background:linear-gradient(120deg,transparent,rgba(255,255,255,.6),transparent);
      transform:translateX(-130%) skewX(-18deg);animation:shineSweep 2.6s ease-in-out infinite;
    }

    @media (prefers-reduced-motion: reduce){
      .pj-title,.pj-underline,.pj-card::before,.pj-thumb-grid,.pj-link::before{animation:none!important}
      .pj-imgLayer,.pj-thumb-overlay,.pj-thumb-grid{transition:none!important}
    }
  `;

  return (
    <section id="projects" className="section">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="container">
        <div className="pj-head mb-3">
          <h2 className="pj-title fw-bold mb-0">Projects</h2>
          <span className="pj-underline" aria-hidden="true" />
        </div>
        <p className="text-center text-muted mb-4">
          Selected work highlighting end-to-end development.
        </p>

        <div className="row g-4">
          {projects.map((p, i) => {
            const tags = p.stack.split(',').map((t) => t.trim());
            return (
              <div key={i} className="col-12 col-md-6 col-lg-4">
                <Tilt revealDelay={i * 80} maxTilt={10}>
                  <article className="pj-card h-100 d-flex flex-column">
                    <ParallaxThumb src={p.image} alt={p.alt || p.title} idx={i} />

                    <div className="pj-below">
                      <h5 className="mb-1" style={{ transform: 'translateZ(10px)' }}>{p.title}</h5>
                      <p className="text-muted flex-grow-1" style={{ transform: 'translateZ(6px)' }}>{p.desc}</p>

                      <div className="pj-tags mb-3" style={{ transform: 'translateZ(8px)' }}>
                        {tags.map((t, ti) => (
                          <span key={ti} className="pj-tag">{t}</span>
                        ))}
                      </div>

                      <div className="mt-auto d-flex">
                        <a className="pj-link ms-auto" href={p.link} target="_blank" rel="noopener noreferrer">
                          View <span aria-hidden="true">↗</span>
                        </a>
                      </div>
                    </div>
                  </article>
                </Tilt>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
