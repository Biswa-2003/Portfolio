// app/components/Footer.jsx
"use client";

import dynamic from "next/dynamic";
import ContactForm from "./ContactForm"; // ✅ use your enhanced form (with honeypot, tts, status)
const Globe3D = dynamic(() => import("./Globe3D"), { ssr: false });

export default function Footer() {
  const year = new Date().getFullYear();

  const css = `
    /* ===== Motion ===== */
    @keyframes auroraMove {
      0% { background-position: 0% 0%, 100% 100%; transform: rotate(0deg) scale(1.03); }
      50%{ background-position: 100% 0%, 0% 100%; transform: rotate(3deg)  scale(1.05); }
      100%{ background-position: 0% 0%, 100% 100%; transform: rotate(0deg) scale(1.03); }
    }
    @keyframes stars { 0%{transform:translateY(0)} 100%{transform:translateY(-40px)} }
    @keyframes shift {0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
    @keyframes shineSweep { 0%{ transform: translateX(-130%) skewX(-18deg);} 100%{ transform: translateX(130%) skewX(-18deg);} }

    /* ===== Wrapper ===== */
    .f2 { position: relative; border-top: 1px solid var(--border);
      background: linear-gradient(180deg, color-mix(in oklab, var(--card) 96%, transparent), var(--bg));
      isolation: isolate; overflow: hidden; }
    .f2 .neon-bar{ height:2px; background:var(--rainbow); background-size:300% 100%;
      animation:shift 12s linear infinite; opacity:.95; }

    /* Aurora + stars */
    .f2 .fx-aurora{ position:absolute; inset:-10% -10% -20% -10%; z-index:0; filter: blur(24px); opacity:.50;
      background: radial-gradient(60% 80% at 80% 10%, color-mix(in oklab, #6a8dff 28%, transparent) 0%, transparent 70%),
                  radial-gradient(80% 60% at 10% 80%, color-mix(in oklab, #ff6bd6 22%, transparent) 0%, transparent 70%);
      background-repeat:no-repeat; animation: auroraMove 18s ease-in-out infinite; }
    .f2 .fx-stars{ position:absolute; inset:0; z-index:0; pointer-events:none; opacity:.12;
      background: radial-gradient(circle, currentColor 1px, transparent 1px) 0 0/22px 22px,
                  radial-gradient(circle, currentColor 1px, transparent 1px) 11px 11px/22px 22px;
      color: color-mix(in oklab, var(--text) 30%, transparent); animation: stars 14s linear infinite; }

    /* ===== Left column ===== */
    .f2-left{ position:relative; z-index:1; }
    .f2-badge{ display:inline-block; padding:.35rem .7rem; border-radius:999px;
      background: color-mix(in oklab, var(--card) 92%, transparent);
      border:1px solid var(--border); color: var(--text); font-size:.8rem; }
    .f2-title{ font-weight:900; letter-spacing:.3px; line-height:1.1;
      background: linear-gradient(90deg, #a0b8ff, #7ab8ff, #ff6bd6, #a0b8ff);
      -webkit-background-clip:text; background-clip:text; color:transparent;
      background-size:300% 100%; animation: shift 10s ease-in-out infinite; margin-bottom:.25rem; }
    .f2-squiggle{ display:block; height:18px; margin:.35rem 0 0; }

    /* Globe wrapper – NO box model, pinned left */
    .globe-wrap{
      max-width: 420px;
      margin: 14px 0 18px 0;
      padding: 0;
      border-radius: 0;
      background: transparent;
      box-shadow: none;
    }
    @media (min-width: 992px){
      .globe-wrap{ transform: translateX(-12px); }
    }

    /* Contact details & chips */
    .f2-list{ list-style:none; padding:0; margin:4px 0 0; }
    .f2-list li{ margin:.35rem 0; color: var(--muted); }
    .f2-link{ position:relative; text-decoration:none; color:color-mix(in oklab, var(--text) 92%, white 8%); }
    .f2-link::after{ content:""; position:absolute; left:0; right:0; bottom:-3px; height:2px; border-radius:3px;
      background:var(--rainbow); background-size:250% 100%; transform:scaleX(0); transform-origin:left; transition:transform .22s ease; }
    .f2-link:hover::after{ transform:scaleX(1); }

    .f2-chips{ display:flex; flex-wrap:wrap; gap:8px; margin-top:10px; }
    .f2-chip{ padding:6px 10px; font-size:12px; border-radius:999px;
      background: color-mix(in oklab, var(--card) 92%, transparent);
      border:1px solid var(--border); color:var(--text);
      box-shadow:0 10px 24px rgba(16,38,73,.08);
      transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease; }
    .f2-chip:hover{ transform: translateY(-2px); box-shadow: 0 16px 36px rgba(16,38,73,.16);
      border-color: color-mix(in oklab, var(--primary) 40%, var(--border)); }

    /* ===== Social dock ===== */
    .f2-social-fixed{
      position: fixed; left: 20px; top: 50%; transform: translateY(-50%);
      z-index: 1040; display: flex; flex-direction: column; gap: 12px;
      pointer-events: none;
    }
    .f2-social-fixed .rail{ width:2px; height:120px; border-radius:2px;
      background: var(--rainbow); background-size:300% 100%; animation: shift 14s linear infinite; opacity:.9; align-self:center; }
    .f2-social{ display:flex; flex-direction:column; gap:12px; pointer-events:auto; }
    .f2-social a{
      --ring: var(--rainbow);
      width: 42px; height: 42px; border-radius: 999px;
      display: grid; place-items: center; text-decoration:none;
      background: color-mix(in oklab, var(--bs-body-bg, #fff) 92%, transparent);
      border: 1px solid color-mix(in oklab, #0e1a36 18%, transparent);
      color: color-mix(in oklab, var(--bs-body-color, #0e1a36) 90%, white 10%);
      box-shadow: 0 8px 20px rgba(16,38,73,.14);
      overflow: hidden; position: relative; backdrop-filter: blur(6px) saturate(140%);
      transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease, color .18s ease;
    }
    .f2-social a::before{
      content:""; position:absolute; inset:-1px; border-radius:inherit; padding:1px;
      background: var(--ring); background-size:300% 100%;
      -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
      -webkit-mask-composite: xor; mask-composite: exclude;
      opacity:0; transition:opacity .18s ease;
    }
    .f2-social a:hover{ transform: translateY(-2px); box-shadow: 0 14px 32px rgba(16,38,73,.18);
      border-color: color-mix(in oklab, #275fca 40%, transparent); }
    .f2-social a:hover::before{ opacity:1; }
    .f2-social svg{ width:20px; height:20px; }

    .s-facebook { --ring: linear-gradient(90deg,#1877f2,#42a5f5); }
    .s-linkedin { --ring: linear-gradient(90deg,#0a66c2,#3ea0ff); }
    .s-instagram{ --ring: linear-gradient(45deg,#f58529,#dd2a7b,#8134af,#515bd4); }
    .s-github   { --ring: linear-gradient(90deg,#6a8dff,#00d1ff); }

    @media (max-width: 991.98px){ .f2-social-fixed{ display:none; } }

    /* ===== Card & button ===== */
    .f2-card{ position:relative; z-index:1; border-radius:20px; padding:18px;
      background: var(--card); border:1px solid var(--border); box-shadow: 0 16px 38px rgba(16,38,73,.16);
      overflow:hidden; }
    .f2-card::before{ content:""; position:absolute; inset:-1px; border-radius:inherit; padding:1px; z-index:-1;
      background: conic-gradient(from 0deg, #6a8dff, #00d1ff, #ff6bd6, #6a8dff);
      -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
      -webkit-mask-composite: xor; mask-composite: exclude; animation: shift 18s linear infinite; opacity:.55; }
    .f2-input{ background: color-mix(in oklab, var(--card) 90%, transparent);
      border:1px solid var(--border); color:var(--text); transition: border-color .18s ease, box-shadow .18s ease, transform .12s ease; }
    .f2-input::placeholder{ color: color-mix(in oklab, var(--text) 55%, transparent); }
    .f2-input:focus{ border-color: var(--primary);
      box-shadow: 0 0 0 .2rem color-mix(in oklab, var(--primary) 30%, transparent); transform: translateY(-1px); }
    .f2-btn{ position:relative; overflow:hidden; border:0; border-radius:999px; color:#fff !important;
      background:var(--rainbow); background-size:300% 100%; animation:shift 12s linear infinite;
      box-shadow:0 14px 34px rgba(16,38,73,.18); transition: transform .18s ease, box-shadow .18s ease; }
    .f2-btn:hover{ transform: translateY(-1px); box-shadow:0 18px 42px rgba(16,38,73,.22); }
    .f2-btn::before{ content:""; position:absolute; inset:0;
      background: linear-gradient(120deg, transparent, rgba(255,255,255,.65), transparent);
      transform: translateX(-130%) skewX(-18deg); animation: shineSweep 2.6s ease-in-out infinite; pointer-events:none; }

    .f2-bottom{ border-top:1px solid var(--border); }

    /* === Alignment helpers === */
    @media (min-width: 992px){
      .contact-col { display:flex; flex-direction:column; }
      .contact-offset { margin-top: 22px; }
    }

    /* allow globe glow */
    .f2 .col-lg-5 { overflow: visible; }

    /* make sure any canvas inside globe has NO visual frame */
    .globe-wrap canvas{
      background: transparent !important;
      border: 0 !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      outline: none !important;
    }

    /* ====== ✨ NEW: Get in Touch animations ====== */
    @keyframes floatDot { 0%,100%{ transform: translateY(0)} 50%{ transform: translateY(-8px)} }
    @keyframes pulseGlow { 0%,100%{ opacity:.32; transform: scale(1)} 50%{ opacity:.6; transform: scale(1.04)} }
    @keyframes riseIn { from{opacity:0; transform: translateY(10px)} to{opacity:1; transform: translateY(0)} }

    .contact-animated{ --pad: 18px; }
    .contact-animated .fx-topglow{
      position:absolute; left:0; right:0; top:-1px; height:84px; pointer-events:none;
      background: radial-gradient(60% 100% at 50% 0%, rgba(0,209,255,.28), transparent 70%);
      filter: blur(4px); opacity:.6; }
    .contact-animated .fx-grid{
      position:absolute; inset:0; pointer-events:none; opacity:.25; mix-blend-mode:overlay;
      background:
        linear-gradient(transparent 49%, rgba(0,0,0,.05) 50%, transparent 51%) 0 0/ 100% 22px,
        linear-gradient(90deg, transparent 49%, rgba(0,0,0,.05) 50%, transparent 51%) 0 0/ 22px 100%;
      animation: shift 18s linear infinite; }
    .contact-animated .dot{
      position:absolute; width:10px; height:10px; border-radius:50%;
      background: radial-gradient(circle, rgba(0,209,255,.9), rgba(0,209,255,0));
      filter: blur(.4px); animation: floatDot 3.2s ease-in-out infinite; opacity:.8;
    }
    .contact-animated .dot.d1{ top:18px; right:calc(var(--pad) + 8px); animation-delay:.2s; }
    .contact-animated .dot.d2{ bottom:22px; left:calc(var(--pad) + 12px); animation-delay:.9s; }

    .contact-title{
      display:flex; align-items:center; gap:10px; margin-bottom:.75rem;
      background: linear-gradient(90deg,#a0b8ff,#7ab8ff,#00d1ff,#ff6bd6,#a0b8ff);
      -webkit-background-clip:text; background-clip:text; color:transparent;
      background-size:300% 100%; animation: shift 12s linear infinite;
    }
    .contact-title .pulse{
      width:10px; height:10px; border-radius:50%;
      background: radial-gradient(circle, #00d1ff, transparent 70%); filter: blur(.3px);
      box-shadow: 0 0 18px rgba(0,209,255,.55), 0 0 40px rgba(106,141,255,.35);
      animation: pulseGlow 2.6s ease-in-out infinite;
    }
    .contact-animated .stagger > *{ animation: riseIn .5s ease-out both; }
    .contact-animated .stagger > *:nth-child(1){ animation-delay:.05s }
    .contact-animated .stagger > *:nth-child(2){ animation-delay:.10s }
    .contact-animated .stagger > *:nth-child(3){ animation-delay:.15s }
    .contact-animated .stagger > *:nth-child(4){ animation-delay:.20s }
    .contact-animated [role="status"]{
      display:inline-block; min-width: 160px; text-align:right;
      transition: transform .18s ease, opacity .18s ease;
    }
    .contact-animated [role="status"].text-success{ animation: riseIn .35s ease-out both; }
    .contact-animated [role="status"].text-danger{ animation: riseIn .35s ease-out both; }

    @media (prefers-reduced-motion: reduce){
      .contact-animated .stagger > *, .contact-title, .contact-animated .fx-topglow, .contact-animated .fx-grid,
      .contact-animated .dot, .contact-animated [role="status"]{ animation:none !important; }
    }
  `;

  return (
    <footer className="f2 mt-5" id="contact">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="neon-bar" aria-hidden="true" />
      <div className="fx-aurora" aria-hidden="true" />
      <div className="fx-stars" aria-hidden="true" />

      {/* Fixed social dock */}
      <div className="f2-social-fixed" aria-label="Social links">
        <div className="f2-social">
          <a className="s-facebook"  href="https://facebook.com/your.username" target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12.06C22 6.55 17.52 2 12.06 2 6.55 2 2 6.55 2 12.06c0 4.99 3.66 9.13 8.44 9.94v-7.03H7.9v-2.9h2.54V9.9c0-2.5 1.49-3.87 3.77-3.87 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.55v1.86h2.78l-.44 2.9h-2.34V22c4.78-.81 8.44-4.95 8.44-9.94Z"/></svg>
          </a>
          <a className="s-linkedin"  href="https://www.linkedin.com/in/your-handle" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1 0-5Zm.02 6.5H2v11h3V10Zm4 0H6v11h3v-5.6c0-2.98 3.5-3.22 3.5 0V21h3v-6.39c0-5.27-5.69-5.07-7-2.48V10Z"/></svg>
          </a>
          <a className="s-instagram" href="https://www.instagram.com/your.username" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.5 5.5 0 0 1 12 7.5Zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5ZM18 6.8a1 1 0 1 1-1 1 1 1 0 0 1 1-1Z"/></svg>
          </a>
          <a className="s-github" href="https://github.com/your-username" target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.1-1.47-1.1-1.47-.9-.6.07-.59.07-.59 1 .07 1.53 1.05 1.53 1.05.9 1.52 2.36 1.08 2.94.82.09-.66.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.28.1-2.67 0 0 .84-.27 2.75 1.03a9.4 9.4 0 0 1 5 0c1.9-1.3 2.74-1.03 2.74-1.03.55 1.39.21 2.42.11 2.67.64.7 1.02 1.6 1.02 2.68 0 3.85-2.34 4.69-4.57 4.94.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>
          </a>
        </div>
        <div className="rail" />
      </div>

      <div className="container py-5 position-relative">
        <div className="row g-4 align-items-center">
          {/* LEFT — heading + globe + info */}
          <div className="col-lg-5 f2-left">
            <span className="f2-badge">Available for new projects</span>
            <h2 className="display-6 f2-title mt-2">Let’s build something great.</h2>

            <svg className="f2-squiggle" viewBox="0 0 180 18" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="g2" x1="0" x2="1">
                  <stop offset="0%" stopColor="#6a8dff" />
                  <stop offset="50%" stopColor="#00d1ff" />
                  <stop offset="100%" stopColor="#ff6bd6" />
                </linearGradient>
              </defs>
              <path d="M2 10 Q 25 2, 45 10 T 90 10 T 135 10 T 178 10"
                stroke="url(#g2)" strokeWidth="3" strokeLinecap="round" strokeDasharray="16 16">
                <animate attributeName="stroke-dashoffset" from="0" to="-180" dur="5s" repeatCount="indefinite" />
              </path>
            </svg>

            <div className="globe-wrap">
              <Globe3D height={360} bgColor="#7695ddff" />
            </div>

            <ul className="f2-list">
              <li><strong>Email:</strong> <a className="f2-link" href="mailto:biswajitpanda130203@gmail.com">biswajitpanda130203@gmail.com</a></li>
              <li><strong>Phone:</strong> <a className="f2-link" href="tel:+91966864753">+91&nbsp;96686&nbsp;64753</a></li>
              <li><strong>Location:</strong> India</li>
            </ul>

            <div className="f2-chips">
              {['Next.js','Node & Express','PostgreSQL','Open to freelance'].map(t => (
                <span key={t} className="f2-chip">{t}</span>
              ))}
            </div>
          </div>

          {/* RIGHT — Contact form (animated) */}
          <div className="col-lg-7 contact-col">
            <div className="f2-card contact-offset contact-animated">
              {/* ambient fx */}
              <i className="fx-topglow" aria-hidden="true" />
              <i className="fx-grid" aria-hidden="true" />
              <i className="dot d1" aria-hidden="true" />
              <i className="dot d2" aria-hidden="true" />

              {/* title */}
              <div className="contact-title">
                <i className="pulse" aria-hidden="true" />
                <h3 className="h2 m-0">Get in <span style={{background:'linear-gradient(90deg,#a0b8ff,#7ab8ff,#ff6bd6)',WebkitBackgroundClip:'text',backgroundClip:'text',color:'transparent'}}>Touch</span></h3>
              </div>

              {/* Wrap your ContactForm so its rows/fields stagger in */}
              <div className="stagger">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="f2-bottom">
        <div className="container py-3 d-flex flex-wrap justify-content-between align-items-center gap-2 small">
          <div className="text-muted">© {year} Biswajit Panda</div>
          <div className="d-flex gap-3">
            <a href="#" className="f2-link">Terms of Service</a>
            <a href="#" className="f2-link">Privacy Policy</a>
            <a href="#contact" className="f2-link">Connect With Me</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
