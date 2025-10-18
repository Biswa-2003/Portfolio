// app/components/Globe3D.jsx
"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";

/* ========= Brand palette ========= */
const BRAND = [
  new THREE.Color("#6a8dff"),
  new THREE.Color("#00d1ff"),
  new THREE.Color("#7a5cff"),
];

const lerp = (a, b, t, out) => (
  (out.r = a.r + (b.r - a.r) * t),
  (out.g = a.g + (b.g - a.g) * t),
  (out.b = a.b + (b.b - a.b) * t),
  out
);
const paletteAt = (p, t, out = new THREE.Color()) => {
  const n = p.length, x = ((t % 1) + 1) % 1;
  const i = Math.floor(x * n), j = (i + 1) % n, f = x * n - i;
  return lerp(p[i], p[j], f, out);
};

/* ========= Animated gradient core ========= */
function GradientMat({ speed = 0.06 }) {
  const mat = useMemo(
    () => new THREE.MeshStandardMaterial({ metalness: 0.25, roughness: 0.45 }),
    []
  );

  if (!mat.userData.uA) {
    mat.userData.uA = new THREE.Color("#6a8dff");
    mat.userData.uB = new THREE.Color("#00d1ff");
  }

  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uA = { value: mat.userData.uA };
    shader.uniforms.uB = { value: mat.userData.uB };
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <color_fragment>",
      `
        float v = (normal.y * 0.5) + 0.5;
        vec3 g = mix(uA, uB, v);
        diffuseColor.rgb *= g;
      `
    );
    mat.userData.shader = shader;
  };

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    paletteAt(BRAND, t, mat.userData.uA);
    paletteAt(BRAND, t + 0.35, mat.userData.uB);
  });

  return <primitive attach="material" object={mat} />;
}

/* ========= Rings ========= */
function Ribbon({ radius, tube, tilt, rotate, offset, speed = 0.06 }) {
  const mesh = useRef(), mat = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    mesh.current.rotation.y = rotate + t * 0.12;
    mesh.current.scale.y = 1 + Math.sin(t * 1.1 + rotate) * 0.03;

    paletteAt(BRAND, t * speed + offset, mat.current.color);
    mat.current.emissive.copy(mat.current.color).multiplyScalar(0.05);
  });

  return (
    <mesh ref={mesh} rotation={[tilt, rotate, 0]}>
      <torusGeometry args={[radius, tube, 48, 256]} />
      <meshStandardMaterial ref={mat} metalness={0.35} roughness={0.22} />
    </mesh>
  );
}

/* ========= Globe group ========= */
function RibbonGlobe() {
  const group = useRef();
  useFrame((_, d) => (group.current.rotation.y += d * 0.15));

  const rings = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        key: i,
        radius: 1.05 + (i % 3) * 0.06,
        tube: 0.06 + (i % 4) * 0.006,
        tilt: THREE.MathUtils.degToRad(-28 + i * 7.2),
        rotate: (i * Math.PI) / 7,
        offset: i * 0.09,
      })),
    []
  );

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[0.95, 4]} />
        <GradientMat />
      </mesh>

      <Float speed={1.1} rotationIntensity={0.5} floatIntensity={0.45}>
        <mesh>
          <icosahedronGeometry args={[1.02, 4]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.10} />
        </mesh>
      </Float>

      {rings.map((r) => (
        <Ribbon key={r.key} {...r} />
      ))}
    </group>
  );
}

/* ========= Make scene background match page ========= */
function MatchBackground({ bgColor }) {
  const { scene, gl } = useThree();
  const [bg, setBg] = useState(null);

  useEffect(() => {
    if (bgColor) {
      setBg(bgColor);
      return;
    }
    // Try to read CSS var --bg from :root. If it's a gradient or empty, stay transparent.
    const root = document.documentElement;
    const raw = getComputedStyle(root).getPropertyValue("--bg").trim();
    const looksColor =
      raw && !raw.includes("gradient") && !raw.includes(",") && raw !== "transparent";
    setBg(looksColor ? raw : null);
  }, [bgColor]);

  useEffect(() => {
    if (bg) {
      const c = new THREE.Color(bg);
      scene.background = c;
      gl.setClearColor(c, 1);
    } else {
      scene.background = null;
      gl.setClearColor(0x000000, 0); // fully transparent
    }
  }, [bg, scene, gl]);

  return null;
}

/* ========= Public component =========
   Pass bgColor="#f7f9ff" if you want a fixed color.
*/
export default function Globe3D({ className, height = 360, bgColor }) {
  return (
    <div
      id="ribbon-globe"
      className={className}
      style={{
        height,
        width: "100%",
        background: "transparent",
        border: "none",
        boxShadow: "none",
        borderRadius: "0",
        padding: 0,
        margin: 0,
        overflow: "visible",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Nuke any inherited box UI */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            #ribbon-globe, #ribbon-globe canvas {
              background: transparent !important;
              border: 0 !important;
              border-radius: 0 !important;
              box-shadow: none !important;
              outline: none !important;
              filter: none !important;
            }
          `,
        }}
      />
      <Canvas
        style={{
          background: "transparent",
          border: "none",
          boxShadow: "none",
          borderRadius: 0,
          display: "block",
          width: "100%",
          height: "100%",
        }}
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        dpr={[1, 2]}
        shadows={false}
        gl={{ antialias: true, alpha: true, premultipliedAlpha: true }}
      >
        {/* Background matches your page (or use prop) */}
        <MatchBackground bgColor={bgColor} />

        <ambientLight intensity={0.6} />
        <directionalLight intensity={1.0} position={[3, 5, 2]} />
        <directionalLight intensity={0.4} position={[-3, -2, -4]} />

        <RibbonGlobe />

        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
