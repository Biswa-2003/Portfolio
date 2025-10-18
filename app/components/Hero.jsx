'use client';

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { SiReact, SiRedux, SiNodedotjs, SiNextdotjs } from "react-icons/si";

/* ---------- Lightweight 3D ring (auto-pauses) ---------- */
function Ring({ pause }) {
  const ref = useRef();
  useFrame((_, delta) => {
    if (!pause && ref.current) ref.current.rotation.z += delta * 0.35;
  });
  return (
    <mesh ref={ref}>
      <ringGeometry args={[0.88, 1.06, 64]} />
      <meshBasicMaterial wireframe transparent opacity={0.45} />
    </mesh>
  );
}

export default function Hero() {
  const css = `
    /* ========= Theme ========= */
    .hero-theme{
      --g1:#6a8dff;
      --g2:#00d1ff;
      --g3:#ff5bd1;
      --ink:#0e1a36;
      --bgSoft:#D8E3F1;
      --brand:#275FCA;
    }
    /* ========= Animations ========= */
    @keyframes fadeUp { from {opacity:0; transform: translateY(12px) scale(.98);} to {opacity:1; transform: translateY(0) scale(1);} }
    @keyframes floatY { 0%,100% {transform: translateY(0);} 50% {transform: translateY(-10px);} }
    @keyframes photoFloat { 0%,100% {transform: translateY(0) scale(1);} 50% {transform: translateY(-8px) scale(1.005);} }
    @keyframes shineSweep { 0%{ transform: translateX(-130%);} 100%{ transform: translateX(130%);} }
    @keyframes underlineSlide { 0%{ background-position: 0% 50%; } 100%{ background-position: 200% 50%; } }
    @keyframes haloPulse { 0%,100% { transform: translate(-50%,-50%) scale(1); opacity:.9;} 50% { transform: translate(-50%,-50%) scale(1.05); opacity:1;} }
    @keyframes shadowPulse { 0%,100% { transform: translateX(-50%) scale(1); opacity:.35;} 50% { transform: translateX(-50%) scale(1.15); opacity:.5;} }
    @keyframes sparkRise { 0%{ transform: translateY(12px) scale(.8); opacity:0; } 20%{ opacity:.8; } 100%{ transform: translateY(-42px) scale(1); opacity:0; } }
    @keyframes gradientShift { 0%{background-position:0% 50%;} 50%{background-position:100% 50%;} 100%{background-position:0% 50%;} }
    @keyframes borderSpin { to { transform: rotate(360deg); } }
    @keyframes blobMoveA { 0%,100%{ transform: translate(-10%, -6%) scale(1);} 50%{ transform: translate(6%, 8%) scale(1.06);} }
    @keyframes blobMoveB { 0%,100%{ transform: translate(8%, 10%) scale(1.04);} 50%{ transform: translate(-8%, -8%) scale(.98);} }
    @keyframes hueShift { from { filter: hue-rotate(0deg);} to { filter: hue-rotate(360deg);} }
    @keyframes twinkle { 0%,100%{opacity:.25; transform: scale(1);} 50%{opacity:1; transform: scale(1.35);} }
    @keyframes gridDrift { 0%{background-position: 0 0, 0 0;} 100%{background-position: 120px 120px, -120px -120px;} }

    /* ========= Base / ambient ========= */
    [data-hero="wrap"], [data-hero-stage], [data-hero-stage] * { background: transparent !important; }
    [data-hero="wrap"]{ position:relative; overflow:hidden; }
    [data-hero="wrap"]::before{
      content:"";
      position:absolute; inset:-10px 0 0 0;
      background:
        radial-gradient(1000px 420px at 85% 28%, rgba(0,209,255,.08), transparent 60%),
        radial-gradient(820px 420px at 8% 85%, rgba(47,107,255,.08), transparent 65%),
        radial-gradient(circle, var(--bgSoft) 1px, transparent 1px);
      background-size: auto, auto, 28px 28px;
      background-repeat: no-repeat, no-repeat, repeat;
      opacity:.65; pointer-events:none; z-index:0;
      mask-image: radial-gradient(1200px 620px at 60% 40%, #000, transparent 70%);
    }

    [data-hero-stage]{ margin-top: -110px; }
    @media (min-width: 1200px){ [data-hero-stage]{ margin-top: -140px; } }

    .edge-fade{
      -webkit-mask-image: linear-gradient(to bottom, #000 83%, rgba(0,0,0,0) 100%);
              mask-image: linear-gradient(to bottom, #000 83%, rgba(0,0,0,0) 100%);
      -webkit-mask-size: 100% 115%; mask-size: 100% 115%;
      -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
    }

    /* ========= RIGHT: glow/photo ========= */
    .neon-wrap{ position:absolute; inset:0; display:grid; place-items:center; pointer-events:none; z-index:0; }
    .neon-wrap.hue { animation: hueShift 16s linear infinite; }
    .neon-bg{
      position:absolute; width:min(560px,92vw); height:min(560px,92vw);
      top:66%; left:50%; transform:translate(-50%,-50%); border-radius:50%;
      background: radial-gradient(closest-side, rgba(3,25,46,.85) 0%, rgba(3,25,46,.6) 65%, rgba(3,25,46,0) 100%);
      filter: blur(2px);
      box-shadow: 0 40px 120px rgba(0,209,255,.25), 0 18px 50px rgba(16,38,73,.18);
      animation: haloPulse 6s ease-in-out infinite;
    }
    .neon-svg{ position:absolute; width:min(560px,92vw); height:min(560px,92vw); top:66%; left:50%; transform:translate(-50%,-50%); overflow:visible; filter: drop-shadow(0 0 14px rgba(0,209,255,.55)) drop-shadow(0 0 26px rgba(47,107,255,.35)); }

    .grid-overlay{
      position:absolute; width:min(560px,92vw); height:min(560px,92vw);
      top:66%; left:50%; transform:translate(-50%,-50%) rotate(10deg);
      background:
        repeating-linear-gradient(45deg, rgba(255,255,255,.10) 0 1px, transparent 1px 20px),
        repeating-linear-gradient(-45deg, rgba(255,255,255,.08) 0 1px, transparent 1px 20px);
      pointer-events:none; mix-blend-mode:overlay; opacity:.35;
      animation: gridDrift 24s linear infinite;
    }

    .ground-shadow{
      position:absolute; left:50%; bottom:18px; width:68%; height:34px; transform:translateX(-50%);
      background: radial-gradient(closest-side, rgba(0,0,0,.35), rgba(0,0,0,0) 70%); filter: blur(10px); opacity:.4; z-index:0;
      animation: shadowPulse 3.6s ease-in-out infinite;
    }
    .spark{
      position:absolute; width:10px; height:10px; border-radius:50%;
      background: radial-gradient(circle, rgba(0,209,255,.9), rgba(0,209,255,0));
      filter: blur(.5px); opacity:0; animation: sparkRise 3.2s ease-in-out infinite;
    }
    .spark.s1{ left:62%; bottom:90px;  animation-delay:.0s; }
    .spark.s2{ left:72%; bottom:120px; animation-delay:.8s; }
    .spark.s3{ left:54%; bottom:140px; animation-delay:1.6s; }

    .photo-float{ animation: photoFloat 4.2s ease-in-out .1s infinite, fadeUp .65s ease-out .12s both; }
    .bubble-fast-1{ animation: floatY 3.0s ease-in-out .05s infinite; }
    .bubble-fast-2{ animation: floatY 3.2s ease-in-out .15s infinite; }
    .bubble-fast-3{ animation: floatY 2.9s ease-in-out .10s infinite; }
    .bubble-fast-4{ animation: floatY 3.1s ease-in-out .20s infinite; }

    .photo-gleam{
      position:absolute; inset:0; z-index:2; pointer-events:none; mix-blend-mode:screen;
      background: linear-gradient(115deg, rgba(255,255,255,0) 40%, rgba(255,255,255,.28) 52%, rgba(255,255,255,0) 64%);
      transform: translateX(-130%) skewX(-18deg);
      animation: shineSweep 4.2s ease-in-out infinite;
    }
    .photo-duo{
      position:absolute; inset:0; pointer-events:none; mix-blend-mode:soft-light; opacity:.55; z-index:2;
      background: radial-gradient(120% 120% at 0% 100%, rgba(255,91,209,.35), transparent 60%),
                  radial-gradient(120% 120% at 100% 0%, rgba(0,209,255,.30), transparent 60%);
    }
    .twinkle{ position:absolute; width:8px; height:8px; border-radius:50%; background: radial-gradient(#fff, rgba(255,255,255,0)); opacity:.6; animation: twinkle 2.8s ease-in-out infinite; }
    .tw1{ top:10%; right:8%; animation-delay:.2s; }
    .tw2{ top:38%; left:4%;  animation-delay:1s; }
    .tw3{ bottom:22%; right:12%; animation-delay:1.8s; }

    /* ========= LEFT ========= */
    .left-wrap{ position:relative; z-index:1; color:var(--ink); }
    .left-rays{ position:absolute; inset:-40px -60px auto -60px; height:240px; z-index:0; pointer-events:none; }
    .left-rays::before{
      content:""; position:absolute; inset:0; border-radius:28px;
      background: conic-gradient(from 0deg, rgba(106,141,255,.20), rgba(0,209,255,.20), rgba(255,91,209,.20), rgba(106,141,255,.20));
      mask: radial-gradient(180px 120px at 30% 60%, transparent 38%, #000 50%);
      filter: blur(10px);
      animation: borderSpin 16s linear infinite;
    }
    .left-blobs{ position:absolute; inset: -40px -40px auto -40px; height: 220px; z-index:0; pointer-events:none; }
    .blob{ position:absolute; width: 260px; height: 260px; border-radius: 50%; filter: blur(28px); opacity:.35; }
    .blob.a{ left:-30px; top:-10px; background: radial-gradient(circle at 30% 30%, rgba(106,141,255,.55), rgba(106,141,255,0)); animation: blobMoveA 9s ease-in-out infinite; }
    .blob.b{ left:160px; top:10px; background: radial-gradient(circle at 50% 50%, rgba(0,209,255,.45), rgba(0,209,255,0)); animation: blobMoveB 11s ease-in-out infinite; }

    .left-card{
      position:relative; border-radius:22px; padding:22px; z-index:1;
      background: rgba(255,255,255,.68);
      border:1px solid rgba(39,95,202,.16);
      box-shadow: 0 14px 34px rgba(16,38,73,.12);
      backdrop-filter: blur(8px);
    }
    .left-card::before{
      content:""; position:absolute; inset:-1px; border-radius:inherit; padding:1px;
      background: conic-gradient(from 0deg, var(--g1), var(--g2), var(--g3), var(--g1));
      -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
      -webkit-mask-composite: xor; mask-composite: exclude;
      animation: borderSpin 8s linear infinite;
    }

    .hero-badge{
      position:relative; z-index:1; display:inline-flex; align-items:center; gap:10px;
      padding:6px 12px; font-size:12px; border-radius:999px;
      color:var(--brand); background:rgba(39,95,202,.10); border:1px solid rgba(39,95,202,.20);
    }
    .hero-title{ line-height:1.08; letter-spacing:.2px; margin-top:10px; }
    .ink{
      background: linear-gradient(90deg, var(--g1), var(--g2), var(--g3), var(--g1));
      background-size: 300% 100%;
      -webkit-background-clip:text; background-clip:text; color:transparent;
      animation: gradientShift 10s ease-in-out infinite;
    }
    .slide-underline{
      position:relative; display:inline-block; padding-bottom:6px;
      background-image: linear-gradient(90deg, rgba(47,107,255,.85), rgba(0,209,255,.85), rgba(255,91,209,.85), rgba(47,107,255,.85));
      background-size: 250% 3px; background-repeat: no-repeat; background-position: 0 100%;
      animation: underlineSlide 2.6s linear infinite;
    }
    .type-line{
      margin-top:8px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size:14px; color:#49566e; display:flex; align-items:center; gap:8px;
    }
    .type-line .bar{
      display:inline-block; width:0ch; white-space:nowrap; overflow:hidden; border-right:2px solid rgba(39,95,202,.65);
      animation: typing 4.4s steps(21,end) infinite alternate, caret 1s step-end infinite;
    }
    .subtext{ animation: fadeUp .6s ease-out .1s both; }

    .btn-gradient{
      background: linear-gradient(90deg, var(--g1), var(--g2), var(--g3));
      border: none; color: #fff;
      box-shadow: 0 14px 34px rgba(39,95,202,.28);
    }
    .btn-ghost{ background: rgba(39,95,202,.08); border: 1px solid rgba(39,95,202,.25); color:var(--brand); }
    .btn-lift{ position:relative; overflow:hidden; transition: transform .22s ease, box-shadow .22s ease; }
    .btn-lift:hover{ transform: translateY(-2px); box-shadow: 0 14px 34px rgba(39,95,202,.28); }
    .btn-lift::before{
      content:""; position:absolute; top:0; bottom:0; width:60%;
      background: linear-gradient(120deg, transparent, rgba(255,255,255,.6), transparent);
      transform: translateX(-130%) skewX(-18deg);
      animation: shineSweep 2.8s ease-in-out infinite;
    }

    /* ===== Slim Meta Pills ===== */
    .hero-meta{
      display:flex; flex-wrap:wrap; gap:8px; margin-top:12px;
    }
    .meta-pill{
      display:inline-flex; align-items:center; gap:8px;
      padding:8px 12px; border-radius:999px;
      background: rgba(39,95,202,.08);
      border:1px solid rgba(39,95,202,.18);
      color: var(--ink); font-weight:600; text-decoration:none;
      box-shadow: 0 10px 24px rgba(16,38,73,.08);
      transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
    }
    .meta-pill:hover{
      transform: translateY(-2px);
      box-shadow: 0 14px 30px rgba(16,38,73,.12);
      border-color: rgba(39,95,202,.28);
    }
    .meta-pill .dot{
      width:8px; height:8px; border-radius:50%;
      background: linear-gradient(90deg, var(--g1), var(--g2));
    }
    .link-pill{
      background: linear-gradient(180deg, rgba(255,255,255,.92), rgba(255,255,255,.78));
    }

    @media (prefers-reduced-motion: reduce){
      .photo-float, .bubble-fast-1, .bubble-fast-2, .bubble-fast-3, .bubble-fast-4,
      .neon-bg, .grid-overlay, .ground-shadow, .spark, .twinkle,
      .ink, .slide-underline, .btn-lift::before,
      .left-card::before, .blob, .left-rays::before { animation:none !important; transform:none !important; }
    }
  `;

  const bubble = {
    width: 86,
    height: 86,
    background: "rgba(255,255,255,.6)",
    backdropFilter: "blur(4px)",
    border: "1px solid rgba(39,95,202,.16)",
    boxShadow: "0 12px 26px rgba(16,38,73,.12)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  };

  /* ---------- Pause 3D on small/reduced motion ---------- */
  const [pause3D, setPause3D] = useState(true);
  useEffect(() => {
    const update = () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const small = window.innerWidth < 640;
      setPause3D(reduced || small);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  /* ---------- Anime.js hue shimmer on the name ---------- */
  const nameRef = useRef(null);
  useEffect(() => {
    if (!nameRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    let running = true;
    let anim;

    (async () => {
      try {
        const mod = await import('animejs'); // works with Next exports
        const anime = mod.default || mod.anime || mod;
        if (!running || typeof anime !== 'function') return;

        anim = anime({
          targets: nameRef.current,
          duration: 6000,
          easing: 'linear',
          loop: true,
          update: (a) => {
            const hue = Math.round((a.progress / 100) * 360);
            nameRef.current.style.filter = `hue-rotate(${hue}deg)`;
          }
        });
      } catch (e) {
        console.error('Anime.js failed to load:', e);
      }
    })();

    return () => {
      running = false;
      if (anim && typeof anim.pause === 'function') anim.pause();
    };
  }, []);

  /* ---------- Framer Motion variants ---------- */
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { margin: "-20% 0px -10% 0px", once: true });

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 16 } }
  };

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } }
  };

  return (
    <section
      id="home"                                                     /* ✅ anchor target */
      data-hero="wrap"
      className="hero-theme section position-relative"
      style={{ paddingTop: 22, paddingBottom: 88, scrollMarginTop: '80px' }}  /* ✅ prevents overlap under sticky nav */
      tabIndex={-1}
      aria-label="Home"
    >
      <div className="container position-relative" style={{ zIndex: 1 }}>
        <motion.div
          ref={containerRef}
          variants={stagger}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="row align-items-center g-4"
        >
          {/* LEFT */}
          <motion.div variants={fadeUp} className="col-lg-6 left-wrap" style={{ animation: "fadeUp .6s ease-out .03s both" }}>
            <div className="left-rays" aria-hidden="true" />
            <div className="left-blobs" aria-hidden="true">
              <div className="blob a" />
              <div className="blob b" />
            </div>

            <div className="left-card">
              <span className="hero-badge">
                <span className="dot" aria-hidden="true" /> Available for new projects
              </span>

              <h1 className="hero-title display-5 fw-bold mt-2">
                Building <span className="ink">modern web apps</span> for the{" "}
                <span className="slide-underline">future</span>.
              </h1>

              <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: 600,
  }}
>
  <span style={{ color: "#5e6b86", minWidth: "48px" }}>Role:</span>

  <span
    style={{
      flex: 1,
      padding: "6px 12px",
      borderRadius: "999px",
      border: "1px solid rgba(24,39,75,0.12)",
      background:
        "linear-gradient(90deg, rgba(106,141,255,0.1), rgba(0,209,255,0.1), rgba(255,107,214,0.1))",
      color: "#0e1a36",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "inline-block",
      fontFamily: "monospace",
      width: "26ch",
      animation: "typing 3.2s steps(26), blink .6s step-end infinite alternate",
    }}
  >
    Full-Stack Developer · Next.js · React
  </span>

  <style>{`
    @keyframes typing {
      from { width: 0 }
      to { width: 26ch }
    }
    @keyframes blink {
      50% { border-color: transparent }
    }
    .bar {
      border-right: 2px solid #0e1a36;
    }
  `}</style>
</div>


              <p className="text-muted mt-2 subtext">
                I&apos;m <strong ref={nameRef}>Biswajit Panda</strong>, a Full-Stack Developer specializing in
                <span className="text-primary fw-semibold"> Next.js</span>, React, Node, Express, PostgreSQL, Redux & JWT.
              </p>

              {/* CTAs with springy hover/tap */}
              <div className="d-flex flex-wrap gap-2 mt-3">
                <motion.a
                  href="#projects"
                  className="btn btn-gradient btn-lg btn-lift"
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 16 }}
                >
                  View Projects
                </motion.a>

                <motion.a
                  href="https://drive.google.com/file/d/1R1mf3mtI_2Hz35CGY14qr0fcPH5-Q8Wz/view?usp=drive_link"
                  className="btn btn-ghost btn-lg btn-lift"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 16 }}
                >
                  View Résumé
                </motion.a>

                <motion.a
                  href="#contact"
                  className="btn btn-ghost btn-lg btn-lift"
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 16 }}
                >
                  Contact
                </motion.a>
              </div>

              {/* ✅ Only Meta Pills kept */}
              <motion.div variants={fadeUp} className="hero-meta">
                <span className="meta-pill"><span className="dot" aria-hidden="true" /> Open to work</span>
                <span className="meta-pill"><span className="dot" aria-hidden="true" /> Remote friendly</span>
                <span className="meta-pill"><span className="dot" aria-hidden="true" /> Replies fast</span>
                <a className="meta-pill link-pill" href="#contact">
                  <span className="dot" aria-hidden="true" /> Contact me
                </a>
              </motion.div>
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div variants={fadeUp} className="col-lg-6 d-flex justify-content-lg-end">
            <div data-hero-stage className="position-relative" style={{ width: "min(520px, 90vw)" }}>
              {/* Super-light rotating ring (auto-pauses on small/reduced motion) */}
              <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
                <Canvas orthographic camera={{ zoom: 60, position: [0, 0, 10] }} style={{ width: "100%", height: "100%" }}>
                  <Ring pause={pause3D} />
                </Canvas>
              </div>

              <div className="neon-wrap hue">
                <div className="neon-bg" aria-hidden="true" />
                <svg className="neon-svg" viewBox="0 0 560 560" aria-hidden="true">
                  <defs>
                    <radialGradient id="neonGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="rgba(0,209,255,.9)" />
                      <stop offset="100%" stopColor="rgba(47,107,255,0)" />
                    </radialGradient>
                    <filter id="blurGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>
                  <path d="M280 70C410 40 525 155 520 270c-5 115-110 220-240 220S35 380 50 265 150 85 280 70Z"
                        fill="url(#neonGlow)" stroke="none" opacity="0.35" filter="url(#blurGlow)"/>
                </svg>
              </div>

              <div className="grid-overlay" aria-hidden="true" />

              <div className="bubble-fast-1" style={{ ...bubble, position: "absolute", right: -20, top: 40 }}>
                <SiRedux size={36} color="#7a52ff" />
              </div>
              <div className="bubble-fast-2" style={{ ...bubble, position: "absolute", right: -30, top: "48%", transform: "translateY(-50%)" }}>
                <SiReact size={38} color="#00d8ff" />
              </div>
              <div className="bubble-fast-3" style={{ ...bubble, position: "absolute", right: 28, bottom: 26 }}>
                <SiNodedotjs size={38} color="#69a35b" />
              </div>
              <div className="bubble-fast-4" style={{ ...bubble, position: "absolute", left: -30, top: "58%", transform: "translateY(-50%)" }}>
                <SiNextdotjs size={38} />
              </div>

              <div className="twinkle tw1" />
              <div className="twinkle tw2" />
              <div className="twinkle tw3" />
              <div className="spark s1" aria-hidden="true" />
              <div className="spark s2" aria-hidden="true" />
              <div className="spark s3" aria-hidden="true" />
              <div className="ground-shadow" aria-hidden="true" />
              <div className="photo-gleam" aria-hidden="true" />
              <div className="photo-duo" aria-hidden="true" />

              <Image
                src="/biswajit_pt.png"
                alt="Biswajit Panda"
                width={1040}
                height={520}
                priority
                sizes="(max-width: 768px) 90vw, 520px"
                className="photo-float edge-fade"
                style={{ width: "100%", height: "auto", objectFit: "contain", display: "block", position: "relative", zIndex: 1 }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: css }} />
    </section>
  );
}
