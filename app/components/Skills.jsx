'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { FaReact, FaNodeJs, FaGithub, FaDatabase, FaJava } from 'react-icons/fa';
import {
  SiNextdotjs,
  SiPostgresql,
  SiRedux,
  SiExpress,
  SiCss3,
  SiBootstrap,
  SiJsonwebtokens,
  SiHtml5,
  SiVercel,
  SiVisualstudiocode,
  SiPostman,
  SiGit,
  SiEslint,
  SiPrettier,
  SiGithubactions,
} from 'react-icons/si';

/* -------------------------------
   Tiny 3D tilt wrapper (no deps)
-------------------------------- */
function Tilt({ children, maxTilt = 10, glare = true, revealDelay = 0 }) {
  const outerRef = useRef(null);
  const cardRef = useRef(null);
  const glareRef = useRef(null);

  // scroll reveal
  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    el.style.transitionDelay = `${revealDelay}ms`;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('reveal-in');
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [revealDelay]);

  function handleMove(e) {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width; // 0..1
    const py = (e.clientY - r.top) / r.height; // 0..1
    const rx = (py - 0.5) * -2 * maxTilt;
    const ry = (px - 0.5) * 2 * maxTilt;
    el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    el.style.boxShadow = `0 24px 40px rgba(16,38,73,.16)`;
    if (glare && glareRef.current) {
      const dx = px * 100;
      const dy = py * 100;
      glareRef.current.style.background = `radial-gradient(circle at ${dx}% ${dy}%, rgba(255,255,255,.45), transparent 55%)`;
      glareRef.current.style.opacity = 1;
    }
  }
  function handleLeave() {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = `rotateX(0deg) rotateY(0deg) translateZ(0)`;
    el.style.boxShadow = `0 12px 24px rgba(16,38,73,.10)`;
    if (glareRef.current) glareRef.current.style.opacity = 0;
  }

  return (
    <div ref={outerRef} className="tilt-outer reveal">
      <div
        ref={cardRef}
        className="tilt-inner"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        {glare && <span ref={glareRef} className="tilt-glare" aria-hidden="true" />}
        {children}
      </div>
    </div>
  );
}

export default function Skills() {
  const groups = [
    {
      key: 'languages',
      label: 'Languages',
      color: '#6a8dff',
      items: [
        { icon: <SiHtml5 style={{ color: '#E44D26' }} />, name: 'HTML5', desc: 'Semantic markup' },
        { icon: <SiCss3 style={{ color: '#1572B6' }} />, name: 'CSS3', desc: 'Responsive layouts' },
        { icon: <FaReact style={{ color: '#F7DF1E' }} />, name: 'JavaScript (ES6+)', desc: 'Frontend scripting' },
        { icon: <FaJava style={{ color: '#EA2D2E' }} />, name: 'Java', desc: 'OOP, backend logic' },
        { icon: <SiPostgresql style={{ color: '#336791' }} />, name: 'SQL', desc: 'Joins, indexing' },
      ],
    },
    {
      key: 'frontend',
      label: 'Frontend',
      color: '#7ab8ff',
      items: [
        { icon: <FaReact style={{ color: '#61DAFB' }} />, name: 'React', desc: 'Hooks, forms, state' },
        { icon: <SiNextdotjs style={{ color: '#000000' }} />, name: 'Next.js', desc: 'App Router, SSR/ISR' },
        { icon: <SiRedux style={{ color: '#764ABC' }} />, name: 'Redux', desc: 'RTK, async flows' },
        { icon: <SiBootstrap style={{ color: '#7952B3' }} />, name: 'React-Bootstrap', desc: 'Grid, modals, forms' },
      ],
    },
    {
      key: 'backend',
      label: 'Backend',
      color: '#00d1ff',
      items: [
        { icon: <FaNodeJs style={{ color: '#539E43' }} />, name: 'Node.js', desc: 'REST APIs, utils' },
        { icon: <SiExpress style={{ color: '#000000' }} />, name: 'Express', desc: 'Routing & middleware' },
        { icon: <SiJsonwebtokens style={{ color: '#D63AFF' }} />, name: 'JWT', desc: 'HTTP-only cookies auth' },
      ],
    },
    {
      key: 'database',
      label: 'Database',
      color: '#48dbfb',
      items: [
        { icon: <SiPostgresql style={{ color: '#336791' }} />, name: 'PostgreSQL', desc: 'JSONB, indexing' },
        { icon: <FaDatabase style={{ color: '#FFCC00' }} />, name: 'pgAdmin', desc: 'DB GUI & admin' },
      ],
    },
    {
      key: 'tools',
      label: 'Tools & Platforms',
      color: '#ff6bd6',
      items: [
        { icon: <SiGit style={{ color: '#F05032' }} />, name: 'Git', desc: 'Branching & merges' },
        { icon: <FaGithub style={{ color: '#171515' }} />, name: 'GitHub', desc: 'PRs, issues' },
        { icon: <SiVisualstudiocode style={{ color: '#007ACC' }} />, name: 'VS Code', desc: 'Editor, debug, tasks' },
        { icon: <SiPostman style={{ color: '#FF6C37' }} />, name: 'Postman', desc: 'API testing' },
        { icon: <SiVercel style={{ color: '#000000' }} />, name: 'Vercel', desc: 'Deploy & envs' },
        { icon: <SiEslint style={{ color: '#4B32C3' }} />, name: 'ESLint', desc: 'Code quality' },
        { icon: <SiPrettier style={{ color: '#F7B93E' }} />, name: 'Prettier', desc: 'Formatting' },
        { icon: <SiGithubactions style={{ color: '#2088FF' }} />, name: 'GitHub Actions', desc: 'CI/CD workflows' },
      ],
    },
  ];

  const [active, setActive] = useState(groups[0].key);
  const [query, setQuery] = useState('');
  const wrapRef = useRef(null);

  const current = useMemo(
    () => groups.find((g) => g.key === active) || groups[0],
    [active]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return current.items;
    return current.items.filter(
      (it) =>
        it.name.toLowerCase().includes(q) ||
        it.desc.toLowerCase().includes(q)
    );
  }, [current, query]);

  // Arrow-key tab change when focused/hovered
  useEffect(() => {
    function onKey(e) {
      if (!wrapRef.current) return;
      const area = wrapRef.current.getBoundingClientRect();
      const within =
        e.clientX >= area.left &&
        e.clientX <= area.right &&
        e.clientY >= area.top &&
        e.clientY <= area.bottom;
      if (document.activeElement === wrapRef.current || within) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          const idx = groups.findIndex((g) => g.key === active);
          const next =
            e.key === 'ArrowRight'
              ? (idx + 1) % groups.length
              : (idx - 1 + groups.length) % groups.length;
          setActive(groups[next].key);
        }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, groups]);

  const css = `
    /* ===== Animated BG blob with depth ===== */
    .skills-bg {
      position: absolute; inset: -20% -10% -30% -10%;
      z-index: 0; filter: blur(120px); opacity: .14; border-radius: 80px;
      background: radial-gradient(60% 60% at 20% 10%, #6a8dff 40%, transparent 70%),
                  radial-gradient(60% 60% at 85% 30%, #00d1ff 35%, transparent 70%),
                  radial-gradient(60% 60% at 60% 90%, #ff6bd6 30%, transparent 75%);
      animation: bgDrift 26s ease-in-out infinite alternate;
      transform: translateZ(0);
    }
    @keyframes bgDrift {
      0%   { transform: translate3d(-10px,-6px,0) scale(1); }
      50%  { transform: translate3d(6px,10px,0) scale(1.04); }
      100% { transform: translate3d(-4px,4px,0) scale(1.02); }
    }

    /* ===== Core Layout ===== */
    .sk-wrap{position:relative; overflow:hidden; border-radius: 20px; padding: 40px 20px; perspective: 1000px;}
    .sk-head{display:grid; place-items:center; gap:.4rem; margin-bottom:10px; position: relative; z-index: 1;}
    .sk-title{
      font-weight:800; letter-spacing:.2px;
      background: linear-gradient(90deg,#a0b8ff,#7ab8ff,#ff6bd6,#a0b8ff);
      -webkit-background-clip:text; background-clip:text; color:transparent;
    }

    .sk-search{
      width:100%; max-width:520px; margin: 6px auto 14px;
      display:flex; gap:8px; position:relative; z-index:1;
    }
    .sk-search input{
      flex:1; padding:.65rem .85rem; border-radius:12px; border:1px solid rgba(24,39,75,.12);
      background: rgba(255,255,255,.8); backdrop-filter: blur(8px);
      outline: none; color:#0e1a36;
    }
    .sk-search input:focus{ border-color:#6a8dff; box-shadow: 0 0 0 4px rgba(106,141,255,.18); }

    .sk-tabs{
      display:flex; gap:10px; padding:8px;
      border:1px solid rgba(24,39,75,.12);
      border-radius:16px; background: rgba(255,255,255,.6);
      backdrop-filter: blur(8px);
      overflow-x:auto; scrollbar-width:none;
      position: relative; z-index: 1;
    }
    .sk-tabs::-webkit-scrollbar{display:none}
    .sk-tab{
      display:inline-flex; align-items:center; gap:.5rem;
      padding:.55rem .85rem; border-radius:999px; cursor:pointer;
      border:1px solid rgba(24,39,75,.10);
      background: linear-gradient(180deg, rgba(255,255,255,.9), rgba(255,255,255,.75));
      color:#0e1a36; white-space:nowrap;
      transition: transform .15s ease, box-shadow .15s ease, background .15s ease, border-color .15s ease;
      transform-style: preserve-3d;
      will-change: transform;
    }
    .sk-tab[aria-selected="true"]{
      background: linear-gradient(90deg, var(--tab-color), #ffffff);
      color:#0e1a36; border-color: rgba(24,39,75,.18);
      box-shadow: 0 8px 22px rgba(16,38,73,.12);
      transform: translateZ(8px);
    }
    .sk-tab:hover{ transform: translateZ(8px) translateY(-2px); }
    .sk-dot{width:8px; height:8px; border-radius:50%; background:var(--tab-color)}

    .sk-grid{ display:grid; gap:14px; margin-top:16px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); position: relative; z-index: 1; }

    /* ===== 3D Cards ===== */
    .tilt-outer{ perspective: 900px; }
    .tilt-inner{
      position:relative;
      will-change: transform;
      transform-style: preserve-3d;
      transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease, opacity .35s ease, translate .35s ease;
      border-radius:16px; border:1px solid rgba(24,39,75,.12);
      background: rgba(255,255,255,.65);
      backdrop-filter: blur(10px);
    }
    .tilt-glare{
      content:""; position:absolute; inset:-1px; border-radius:16px; pointer-events:none;
      opacity:0; transition: opacity .15s ease; mix-blend-mode: screen;
    }
    .sk-card{
      position: relative; display:flex; gap:.75rem; align-items:flex-start;
      padding:14px; border-radius:16px; transform-style: preserve-3d;
    }
    .sk-ico{
      width:44px; height:44px; border-radius:12px; flex:0 0 auto;
      display:grid; place-items:center; font-size:1.28rem;
      background: rgba(255,255,255,.95);
      transform: translateZ(24px);
      animation: bob 4.2s ease-in-out infinite;
    }
    @keyframes bob {
      0%,100% { transform: translateZ(24px) translateY(0); }
      50%     { transform: translateZ(24px) translateY(-4px); }
    }
    .sk-name{margin:0; font-weight:800; color:#0e1a36; transform: translateZ(12px); }
    .sk-desc{margin:.2rem 0 0; color:#5e6b86; font-size:.92rem; transform: translateZ(8px); }

    .reveal{ opacity:0; translate: 0 12px; }
    .reveal.reveal-in{ opacity:1; translate: 0 0; }

    /* Dark theme polish */
    [data-theme="dark"] .sk-tab{ background: linear-gradient(180deg, rgba(16,24,40,.82), rgba(16,24,40,.72)); color:#e6edf7 }
    [data-theme="dark"] .sk-tabs{ background: rgba(16,24,40,.6); border-color: rgba(255,255,255,.08) }
    [data-theme="dark"] .tilt-inner{ background: rgba(16,24,40,.65); border-color: rgba(255,255,255,.08) }
    [data-theme="dark"] .sk-name{ color:#e6edf7 }
    [data-theme="dark"] .sk-desc{ color:#a7b3c6 }
    [data-theme="dark"] .sk-search input{ background: rgba(16,24,40,.7); color:#e6edf7; border-color: rgba(255,255,255,.08) }
  `;

  // Magnetic movement for tabs (tiny follow effect)
  function onTabMove(e) {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 6;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 6;
    el.style.transform = `translateZ(8px) translate(${x}px, ${y}px)`;
  }
  function onTabLeave(e) {
    e.currentTarget.style.transform = `translateZ(8px)`;
  }

  return (
    <section id="skills" className="section position-relative" ref={wrapRef} tabIndex={-1}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="container sk-wrap">
        <div className="skills-bg" />

        <div className="sk-head">
          <h2 className="sk-title fs-3">Skills</h2>
          <p className="text-muted m-0">Search and explore by category.</p>
        </div>

        {/* search */}
        <div className="sk-search">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search skills (e.g. React, SQL, JWT)…"
            aria-label="Search skills"
          />
        </div>

        {/* tabs */}
        <div className="sk-tabs" role="tablist" aria-label="Skill categories">
          {groups.map((g) => (
            <button
              key={g.key}
              className="sk-tab"
              role="tab"
              aria-selected={active === g.key}
              aria-controls={`panel-${g.key}`}
              onClick={() => setActive(g.key)}
              onMouseMove={onTabMove}
              onMouseLeave={onTabLeave}
              style={{ '--tab-color': g.color }}
            >
              <span className="sk-dot" />
              {g.label}
            </button>
          ))}
        </div>

        {/* grid */}
        <div id={`panel-${current.key}`} role="tabpanel" className="sk-grid">
          {filtered.map((it, i) => (
            <Tilt key={`${it.name}-${i}`} revealDelay={i * 60}>
              <div className="sk-card">
                <div className="sk-ico">{it.icon}</div>
                <div>
                  <p className="sk-name">{it.name}</p>
                  <p className="sk-desc">{it.desc}</p>
                </div>
              </div>
            </Tilt>
          ))}
        </div>
      </div>
    </section>
  );
}
