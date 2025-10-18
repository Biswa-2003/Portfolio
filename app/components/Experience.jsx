'use client';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function Experience() {
  const css = `
    @keyframes rainbowShift {0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
    @keyframes fadeUp {from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
    @keyframes glowPulse {0%,100%{opacity:.45;transform:scale(1)}50%{opacity:.85;transform:scale(1.08)}}
    @keyframes drift {0%{transform:translate3d(0,0,0)}100%{transform:translate3d(40px,-30px,0)}}

    .xp-head{display:grid;place-items:center;row-gap:.35rem}
    .xp-title{
      background:linear-gradient(90deg,#a0b8ff,#7ab8ff,#ff6bd6,#a0b8ff);
      background-size:300% 100%;
      -webkit-background-clip:text;background-clip:text;color:transparent;
      animation:rainbowShift 10s ease-in-out infinite;letter-spacing:.3px;
    }
    .xp-underline{
      width:140px;height:6px;border-radius:999px;
      background:var(--rainbow);background-size:300% 100%;
      animation:rainbowShift 12s linear infinite;
      filter:drop-shadow(0 6px 14px rgba(16,38,73,.25));
    }

    /* ===== Timeline with scroll-linked fill ===== */
    .xp-timeline{position:relative;padding-left:40px}
    .xp-timeline .rail{
      position:absolute;left:14px;top:0;bottom:0;width:2px;border-radius:2px;overflow:hidden;
      background: color-mix(in oklab, var(--text) 10%, transparent);
      opacity:.6;
    }
    .xp-timeline .fill{
      position:absolute;left:0;top:0;width:100%;height:var(--xpFill, 0%);
      background:var(--rainbow);background-size:300% 100%;animation:rainbowShift 14s linear infinite;
    }

    /* ===== Card with 3D tilt + gloss ===== */
    .xp-card{
      position:relative;border-radius:22px;padding:22px;margin-bottom:18px;
      background:var(--card);border:1px solid var(--border);
      box-shadow:0 18px 40px rgba(16,38,73,.16);
      animation:fadeUp .45s ease-out both;
      transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease, filter .18s ease;
      overflow:hidden; transform-style:preserve-3d; will-change:transform;
    }
    .xp-card::before{
      content:"";position:absolute;inset:-1px;border-radius:inherit;padding:1px;z-index:0;
      background:conic-gradient(from 0deg,#6a8dff,#00d1ff,#ff6bd6,#6a8dff);
      -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);
      -webkit-mask-composite:xor;mask-composite:exclude;
      animation:rainbowShift 16s linear infinite;opacity:.5;
    }
    .xp-card::after{
      /* gloss sweep */
      content:""; position:absolute; inset:-40% -20%; transform:translateX(var(--glossX, -120%)) rotate(12deg);
      background: linear-gradient(90deg, transparent, rgba(255,255,255,.24), transparent);
      filter: blur(8px); pointer-events:none;
      transition: transform .35s ease;
    }
    .xp-card:hover{
      box-shadow:0 22px 54px rgba(16,38,73,.22);
      border-color:color-mix(in oklab,var(--primary) 38%,var(--border));
      filter: saturate(1.05);
    }

    /* Ambient color blobs that drift + parallax */
    .xp-ambient{
      position:absolute;inset:-20% -12% auto -12%;height:180px;z-index:0;
      background:
        radial-gradient(60% 80% at 80% 10%,color-mix(in oklab,var(--primary) 22%,transparent) 0%,transparent 70%),
        radial-gradient(70% 60% at 10% 80%,color-mix(in oklab,#ff6bd6 18%,transparent) 0%,transparent 70%);
      filter:blur(26px);opacity:.45;animation:drift 18s ease-in-out infinite;
      transform: translate3d(var(--parX,0), var(--parY,0), 0);
      will-change: transform;
    }

    .xp-dot{position:absolute;left:6px;top:28px;width:14px;height:14px;border-radius:50%;
      background:var(--card);border:2px solid var(--primary);z-index:1;
      box-shadow:0 0 0 3px color-mix(in oklab,var(--card) 92%,transparent);
    }
    .xp-dot::after{
      content:"";position:absolute;inset:-6px;border-radius:50%;
      background:var(--rainbow);filter:blur(6px);opacity:.6;
      animation:glowPulse 2.4s ease-in-out infinite;
    }

    .xp-role{display:inline-block;padding:.25rem .6rem;border-radius:999px;
      background:color-mix(in oklab,var(--card) 92%,transparent);
      border:1px solid var(--border);margin-bottom:.35rem;position:relative;z-index:1;
    }
    .xp-meta{color:var(--muted);position:relative;z-index:1}
    .xp-date{
      background:color-mix(in oklab,var(--card) 92%,transparent);
      border:1px solid var(--border);padding:.35rem .6rem;
      border-radius:12px;font-size:.85rem;color:var(--text);
    }

    .xp-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:.4rem;z-index:1}
    .xp-chip{
      font-size:.8rem;padding:.28rem .55rem;border-radius:999px;
      background:color-mix(in oklab,var(--card) 92%,transparent);
      border:1px solid var(--border);color:var(--text);
      box-shadow:0 10px 24px rgba(16,38,73,.08);
      animation:fadeUp .35s ease both;
    }

    /* Reveal-on-scroll */
    .reveal{opacity:0; transform: translateY(12px); transition: opacity .45s ease, transform .45s ease;}
    .reveal.in{opacity:1; transform:none;}

    .xp-list{list-style:none;margin:14px 0 0;padding-left:18px;z-index:1;position:relative}
    .xp-list li{margin:.5rem 0;padding-left:16px;line-height:1.55}
    .xp-list li::before{
      content:"";position:absolute;left:-8px;top:.55em;width:10px;height:10px;border-radius:50%;
      background:var(--rainbow);background-size:200% 100%;
      animation:rainbowShift 10s linear infinite;
      box-shadow:0 0 0 3px color-mix(in oklab,var(--card) 92%,transparent);
    }

    /* small screens – widen spacing a touch */
    @media (max-width: 575.98px){
      .xp-timeline{padding-left:34px}
      .xp-timeline .rail{left:12px}
      .xp-dot{left:0px}
    }
  `;

  // Refs & state for effects
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const [fill, setFill] = useState(0); // timeline fill % (0-100)

  // Scroll-linked timeline fill
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // progress while section is in view
      const visible = Math.min(Math.max((vh - r.top) / (r.height + vh), 0), 1);
      setFill(Math.round(visible * 100));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // IntersectionObserver for staggered reveals
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const items = root.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('in');
        });
      },
      { root: null, threshold: 0.15 }
    );
    items.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  // Mouse tilt + gloss + ambient parallax
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const MAX_TILT = 7; // deg
    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rx = (-(y - 0.5) * 2 * MAX_TILT).toFixed(2);
      const ry = (((x - 0.5) * 2) * MAX_TILT).toFixed(2);
      card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;

      // gloss sweep & ambient parallax
      const glossX = (x * 160 - 120).toFixed(1) + '%';
      card.style.setProperty('--glossX', glossX);
      const parX = ((x - 0.5) * 16).toFixed(1) + 'px';
      const parY = ((y - 0.5) * 16).toFixed(1) + 'px';
      card.querySelectorAll('.xp-ambient').forEach((n) => {
        n.style.setProperty('--parX', parX);
        n.style.setProperty('--parY', parY);
      });
    };
    const onLeave = () => {
      card.style.transform = 'rotateX(0) rotateY(0)';
      card.style.setProperty('--glossX', '-120%');
      card.querySelectorAll('.xp-ambient').forEach((n) => {
        n.style.setProperty('--parX', '0px');
        n.style.setProperty('--parY', '0px');
      });
    };

    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
    return () => {
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <section id="experience" className="section" ref={sectionRef}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="container">
        <div className="xp-head mb-4">
          <h2 className="xp-title fw-bold mb-0">Experience</h2>
          <span className="xp-underline" aria-hidden="true" />
        </div>

        <div className="xp-timeline" style={{ ['--xpFill']: `${fill}%` }}>
          <span className="rail" aria-hidden="true">
            <i className="fill" aria-hidden="true" />
          </span>

          <article className="xp-card reveal" ref={cardRef}>
            <span className="xp-ambient" aria-hidden="true" />
            <span className="xp-dot" aria-hidden="true" />

            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 position-relative">
              <div>
                <span className="xp-role">Junior Software Developer</span>
                <div className="xp-meta">
                  Triptales Commercial Pvt. Ltd • Bhubaneswar
                </div>
                <div className="xp-chips">
                  {[
                    'Next.js',
                    'Express.js',
                    'PostgreSQL (JSONB)',
                    'JWT / OTP Auth',
                    'React-Bootstrap',
                    'REST API',
                    'Image Crop / Upload',
                    'CI/CD Setup',
                  ].map((t, i) => (
                    <span
                      key={t}
                      className="xp-chip reveal"
                      style={{ transitionDelay: `${80 + i * 35}ms` }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="xp-date">2024 – Present</div>
            </div>

            <ul className="xp-list">
              {[
                'Developing and maintaining full-stack modules (Matrimony, Property, Jobs).',
                'Implemented JWT auth with httpOnly cookies and OTP using MSG91.',
                'Built PostgreSQL schemas with JSONB columns and indexes.',
                'Advanced profile features: editable sections, photo crop & upload, view notifications.',
                'RESTful APIs in Express.js integrated with React/Next.js frontends.',
                'Partner-matching logic via SQL scoring functions.',
                'Responsive UI with React-Bootstrap and custom gradient themes.',
                'Razorpay payments for packages and order flows.',
                'Query optimization and indexing for faster response.',
                'Debugging, deployment, and production testing on Vercel/Render.',
              ].map((li, i) => (
                <li
                  key={i}
                  className="reveal"
                  style={{ transitionDelay: `${120 + i * 45}ms` }}
                >
                  {li}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
