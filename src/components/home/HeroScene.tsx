import { Canvas, useFrame, useThree, type ThreeElements } from "@react-three/fiber";
import { Environment, Float, Lightformer } from "@react-three/drei";
import { useEffect, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { PALETTE } from "./palette";

/* ------------------------------------------------------------------ */
/* Tunables                                                            */
/* ------------------------------------------------------------------ */
const PARALLAX_ROT_Y = 0.32;
const PARALLAX_ROT_X = 0.18;
const CAMERA_DRIFT = 0.35;
const FOLLOW = 3; // higher = snappier pointer follow
const INTRO_SECONDS = 1.8;

const pointer = { x: 0, y: 0 };

export type HeroSceneProps = {
  revealed: boolean;
  reducedMotion: boolean;
  active: boolean;
  onReady?: () => void;
};

/* ------------------------------------------------------------------ */
/* Geometry helpers                                                    */
/* ------------------------------------------------------------------ */
function shieldShape(s: number) {
  const k = (v: number) => v * s;
  const p = new THREE.Shape();
  p.moveTo(0, k(0.98));
  p.bezierCurveTo(k(0.32), k(0.86), k(0.62), k(0.84), k(0.92), k(0.86));
  p.bezierCurveTo(k(0.95), k(0.3), k(0.9), k(-0.25), k(0.62), k(-0.6));
  p.bezierCurveTo(k(0.42), k(-0.85), k(0.2), k(-0.98), 0, k(-1.08));
  p.bezierCurveTo(k(-0.2), k(-0.98), k(-0.42), k(-0.85), k(-0.62), k(-0.6));
  p.bezierCurveTo(k(-0.9), k(-0.25), k(-0.95), k(0.3), k(-0.92), k(0.86));
  p.bezierCurveTo(k(-0.62), k(0.84), k(-0.32), k(0.86), 0, k(0.98));
  return p;
}

function crossShape(a = 0.15, l = 0.46) {
  const p = new THREE.Shape();
  p.moveTo(-a, l);
  p.lineTo(a, l);
  p.lineTo(a, a);
  p.lineTo(l, a);
  p.lineTo(l, -a);
  p.lineTo(a, -a);
  p.lineTo(a, -l);
  p.lineTo(-a, -l);
  p.lineTo(-a, -a);
  p.lineTo(-l, -a);
  p.lineTo(-l, a);
  p.lineTo(-a, a);
  p.closePath();
  return p;
}

function leafShape() {
  const p = new THREE.Shape();
  p.moveTo(0, 0);
  p.bezierCurveTo(0.28, 0.12, 0.34, 0.55, 0, 0.9);
  p.bezierCurveTo(-0.34, 0.55, -0.28, 0.12, 0, 0);
  return p;
}

function extrude(shape: THREE.Shape, depth: number, bevel: number) {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel * 0.8,
    bevelSegments: 6,
    curveSegments: 40,
  });
  g.center();
  return g;
}

/** Half a capsule shell, from y=start up to a rounded tip. */
function halfCapsule(r: number, len: number, start = 0) {
  const pts: THREE.Vector2[] = [new THREE.Vector2(r, start), new THREE.Vector2(r, len)];
  for (let i = 1; i <= 12; i++) {
    const t = (i / 12) * (Math.PI / 2);
    pts.push(new THREE.Vector2(Math.cos(t) * r, len + Math.sin(t) * r));
  }
  return new THREE.LatheGeometry(pts, 40);
}

function tablet(R = 0.24, h = 0.075) {
  const pts: THREE.Vector2[] = [new THREE.Vector2(0, -h), new THREE.Vector2(R - h, -h)];
  for (let i = 1; i <= 10; i++) {
    const t = -Math.PI / 2 + (i / 10) * Math.PI;
    pts.push(new THREE.Vector2(R - h + Math.cos(t) * h, Math.sin(t) * h));
  }
  pts.push(new THREE.Vector2(0, h));
  return new THREE.LatheGeometry(pts, 40);
}

function glowTexture(rgb: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d");
  if (g) {
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, `rgba(${rgb},1)`);
    grd.addColorStop(0.3, `rgba(${rgb},0.45)`);
    grd.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* ------------------------------------------------------------------ */
/* Shared assets                                                       */
/* ------------------------------------------------------------------ */
function useAssets() {
  const assets = useMemo(() => {
    const geo = {
      rim: extrude(shieldShape(1.1), 0.16, 0.06),
      body: extrude(shieldShape(1.0), 0.26, 0.07),
      plate: extrude(shieldShape(0.8), 0.05, 0.03),
      cross: extrude(crossShape(), 0.12, 0.045),
      capBody: halfCapsule(0.13, 0.22),
      capCap: halfCapsule(0.137, 0.22, -0.1),
      tablet: tablet(),
      leaf: extrude(leafShape(), 0.012, 0.018),
      atom: new THREE.SphereGeometry(1, 24, 24),
      bond: new THREE.CylinderGeometry(0.025, 0.025, 1, 10),
      bead: new THREE.SphereGeometry(0.035, 16, 16),
    };
    const mat = {
      rim: new THREE.MeshStandardMaterial({ color: "#bfe6ec", metalness: 1, roughness: 0.2 }),
      body: new THREE.MeshPhysicalMaterial({
        color: "#123f78",
        metalness: 0.25,
        roughness: 0.2,
        clearcoat: 1,
        clearcoatRoughness: 0.06,
        envMapIntensity: 1.3,
      }),
      plate: new THREE.MeshPhysicalMaterial({
        color: PALETTE.navy,
        metalness: 0.1,
        roughness: 0.08,
        clearcoat: 1,
        clearcoatRoughness: 0.03,
        envMapIntensity: 1.6,
      }),
      cross: new THREE.MeshPhysicalMaterial({
        color: "#eafcff",
        emissive: PALETTE.cyan,
        emissiveIntensity: 0.9,
        roughness: 0.15,
        clearcoat: 1,
      }),
      white: new THREE.MeshPhysicalMaterial({ color: "#f3f7fa", roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.1 }),
      blue: new THREE.MeshPhysicalMaterial({ color: PALETTE.blue, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.08 }),
      teal: new THREE.MeshPhysicalMaterial({ color: PALETTE.teal, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.08 }),
      glass: new THREE.MeshPhysicalMaterial({
        color: "#bfefff",
        roughness: 0.05,
        metalness: 0.1,
        clearcoat: 1,
        transparent: true,
        opacity: 0.32,
        envMapIntensity: 2,
        depthWrite: false,
      }),
      molecule: new THREE.MeshPhysicalMaterial({
        color: "#7fe3ee",
        roughness: 0.1,
        clearcoat: 1,
        transparent: true,
        opacity: 0.75,
        emissive: PALETTE.teal,
        emissiveIntensity: 0.25,
      }),
      leaf: new THREE.MeshPhysicalMaterial({ color: PALETTE.leaf, roughness: 0.35, clearcoat: 0.6, side: THREE.DoubleSide }),
      bead: new THREE.MeshStandardMaterial({ color: "#ffffff", emissive: PALETTE.cyan, emissiveIntensity: 1.6 }),
      glowCyan: new THREE.MeshBasicMaterial({
        map: glowTexture("34,211,238"),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 0.55,
      }),
      glowTeal: new THREE.MeshBasicMaterial({
        map: glowTexture("13,148,136"),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 0.45,
      }),
    };
    return { geo, mat };
  }, []);

  useEffect(
    () => () => {
      Object.values(assets.geo).forEach((g) => g.dispose());
      Object.values(assets.mat).forEach((m) => {
        if ("map" in m && m.map) m.map.dispose();
        m.dispose();
      });
    },
    [assets],
  );
  return assets;
}

type Assets = ReturnType<typeof useAssets>;

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */
function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function Shield({ a, revealed, reduced }: { a: Assets; revealed: boolean; reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const intro = useRef(reduced ? 1 : 0);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const dt = Math.min(delta, 0.05);
    if (revealed) intro.current = Math.min(1, intro.current + dt / INTRO_SECONDS);
    const e = easeOut(intro.current);
    const t = state.clock.elapsedTime;
    g.scale.setScalar(0.5 + 0.5 * e);
    g.rotation.y = (1 - e) * -1.4 + (reduced ? 0 : Math.sin(t * 0.45) * 0.14);
    g.position.y = reduced ? 0 : Math.sin(t * 0.8) * 0.05;
    a.mat.cross.emissiveIntensity = 0.8 + (reduced ? 0 : Math.sin(t * 1.6) * 0.25) + (1 - e) * 1.5;
  });

  return (
    <group ref={group} scale={0.5}>
      <mesh geometry={a.geo.rim} material={a.mat.rim} position={[0, 0, -0.12]} />
      <mesh geometry={a.geo.body} material={a.mat.body} />
      <mesh geometry={a.geo.plate} material={a.mat.plate} position={[0, 0.02, 0.22]} />
      <mesh material={a.mat.glowCyan} position={[0, 0.02, 0.29]} renderOrder={2}>
        <planeGeometry args={[1.9, 1.9]} />
      </mesh>
      <mesh geometry={a.geo.cross} material={a.mat.cross} position={[0, 0.04, 0.38]} />
    </group>
  );
}

function Orbit({
  a,
  radius,
  tilt,
  speed,
  beads,
  opacity,
  reduced,
}: {
  a: Assets;
  radius: number;
  tilt: [number, number, number];
  speed: number;
  beads: number[];
  opacity: number;
  reduced: boolean;
}) {
  const spin = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!reduced && spin.current) spin.current.rotation.z += Math.min(delta, 0.05) * speed;
  });
  return (
    <group rotation={tilt}>
      <group ref={spin}>
        <mesh>
          <torusGeometry args={[radius, 0.007, 10, 220]} />
          <meshStandardMaterial
            color={PALETTE.cyan}
            emissive={PALETTE.teal}
            emissiveIntensity={0.7}
            metalness={0.6}
            roughness={0.3}
            transparent
            opacity={opacity}
          />
        </mesh>
        {beads.map((angle) => (
          <mesh
            key={angle}
            geometry={a.geo.bead}
            material={a.mat.bead}
            position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}
          />
        ))}
      </group>
    </group>
  );
}

function Capsule({
  a,
  body,
  cap,
  ...props
}: { a: Assets; body: THREE.Material; cap: THREE.Material } & ThreeElements["group"]) {
  return (
    <group {...props}>
      <mesh geometry={a.geo.capBody} material={body} />
      <mesh geometry={a.geo.capCap} material={cap} rotation={[Math.PI, 0, 0]} />
    </group>
  );
}

function Tablet({ a, ...props }: { a: Assets } & ThreeElements["group"]) {
  return (
    <group {...props}>
      <mesh geometry={a.geo.tablet} material={a.mat.white} />
      <mesh position={[0, 0.076, 0]} material={a.mat.blue}>
        <boxGeometry args={[0.36, 0.006, 0.025]} />
      </mesh>
    </group>
  );
}

const ATOMS: [number, number, number][] = [
  [0.32, 0.18, 0],
  [-0.3, 0.2, 0.08],
  [0.02, -0.34, -0.06],
];

function Molecule({ a, ...props }: { a: Assets } & ThreeElements["group"]) {
  const bonds = useMemo(
    () =>
      ATOMS.map((p) => {
        const dir = new THREE.Vector3(...p);
        const len = dir.length();
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
        return { mid: dir.clone().multiplyScalar(0.5), q, len };
      }),
    [],
  );
  return (
    <group {...props}>
      <mesh geometry={a.geo.atom} material={a.mat.molecule} scale={0.11} />
      {ATOMS.map((p, i) => (
        <mesh key={i} geometry={a.geo.atom} material={a.mat.molecule} position={p} scale={0.075} />
      ))}
      {bonds.map((b, i) => (
        <mesh key={i} geometry={a.geo.bond} material={a.mat.molecule} position={b.mid} quaternion={b.q} scale={[1, b.len, 1]} />
      ))}
    </group>
  );
}

function Appear({
  revealed,
  reduced,
  delay = 0,
  children,
}: {
  revealed: boolean;
  reduced: boolean;
  delay?: number;
  children: ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  const t = useRef(0);
  useFrame((_, delta) => {
    const g = ref.current;
    if (!g || !revealed) return;
    if (reduced) {
      g.scale.setScalar(1);
      return;
    }
    if (t.current > delay + 1.4) return;
    t.current += Math.min(delta, 0.05);
    const p = THREE.MathUtils.clamp((t.current - delay) / 1.2, 0, 1);
    g.scale.setScalar(Math.max(0.0001, easeOut(p)));
  });
  return (
    <group ref={ref} scale={reduced ? 1 : 0.0001}>
      {children}
    </group>
  );
}

function Rig({ reduced, children }: { reduced: boolean; children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);
  useFrame((state, delta) => {
    const g = ref.current;
    if (!g) return;
    const k = 1 - Math.exp(-FOLLOW * Math.min(delta, 0.05));
    const t = state.clock.elapsedTime;
    const px = reduced ? 0 : pointer.x + Math.sin(t * 0.3) * 0.15;
    const py = reduced ? 0 : pointer.y + Math.cos(t * 0.25) * 0.1;
    g.rotation.y += (px * PARALLAX_ROT_Y - g.rotation.y) * k;
    g.rotation.x += (py * PARALLAX_ROT_X - g.rotation.x) * k;
    const cam = state.camera;
    cam.position.x += (px * CAMERA_DRIFT - cam.position.x) * k;
    cam.position.y += (-py * CAMERA_DRIFT * 0.6 - cam.position.y) * k;
    cam.lookAt(0, 0, 0);
    if (light.current) {
      light.current.position.x += (px * 4 - light.current.position.x) * k;
      light.current.position.y += (-py * 2.5 - light.current.position.y) * k;
    }
  });
  return (
    <>
      <pointLight ref={light} position={[0, 0, 3.2]} intensity={7} distance={9} color={PALETTE.cyan} />
      <group ref={ref}>{children}</group>
    </>
  );
}

function Ready({ onReady }: { onReady?: (() => void) | undefined }) {
  const frames = useRef(0);
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    frames.current += 1;
    if (frames.current > 2) {
      done.current = true;
      onReady?.();
    }
  });
  return null;
}

type Item = {
  kind: "capsule" | "tablet" | "molecule" | "leaf";
  pos: [number, number, number];
  rot: [number, number, number];
  scale: number;
  look?: "blue" | "teal" | "glass";
  compact?: boolean;
};

const ITEMS: Item[] = [
  { kind: "capsule", pos: [-1.75, 1.05, 0.5], rot: [0.4, 0.2, 0.95], scale: 1, look: "blue", compact: true },
  { kind: "capsule", pos: [1.7, 1.25, -0.3], rot: [0.2, 0.4, -0.7], scale: 0.9, look: "teal", compact: true },
  { kind: "capsule", pos: [1.85, -0.85, 0.8], rot: [-0.3, 0.1, 0.5], scale: 1.15, look: "blue", compact: true },
  { kind: "capsule", pos: [-1.35, -1.3, 1.0], rot: [0.5, 0.3, -0.4], scale: 1.1, look: "glass" },
  { kind: "capsule", pos: [0.35, 1.8, -0.9], rot: [0.1, 0, 1.3], scale: 0.75, look: "glass" },
  { kind: "capsule", pos: [-1.95, 0.7, -1.4], rot: [0.6, 0.2, 0.2], scale: 0.7, look: "teal" },
  { kind: "tablet", pos: [1.3, 0.25, 1.35], rot: [1.1, 0.3, 0.2], scale: 1, compact: true },
  { kind: "tablet", pos: [-1.6, -0.95, 0.3], rot: [0.6, -0.4, 0.5], scale: 0.85, compact: true },
  { kind: "tablet", pos: [0.8, -1.65, 0.4], rot: [1.3, 0, -0.3], scale: 0.8 },
  { kind: "molecule", pos: [2.35, 0.45, -1.0], rot: [0.2, 0.5, 0], scale: 1 },
  { kind: "molecule", pos: [-2.2, 1.65, -1.4], rot: [0.5, 0, 0.6], scale: 0.85 },
  { kind: "leaf", pos: [1.05, -1.3, 1.0], rot: [0.3, -0.5, -0.9], scale: 0.55, compact: true },
  { kind: "leaf", pos: [1.3, -1.15, 0.85], rot: [0.2, 0.4, -0.3], scale: 0.42 },
];

function Composition({ revealed, reduced }: { revealed: boolean; reduced: boolean }) {
  const a = useAssets();
  const size = useThree((s) => s.size);
  const viewport = useThree((s) => s.viewport);
  const compact = size.width < 900;
  const anchor: [number, number, number] = compact
    ? [0, viewport.height * 0.3, 0]
    : [Math.min(viewport.width * 0.25, 2.85), 0.05, 0];
  const scale = compact ? Math.min(0.62, viewport.width / 4.2) : 0.95;
  const items = compact ? ITEMS.filter((i) => i.compact) : ITEMS;

  return (
    <group position={anchor} scale={scale}>
      {/* soft teal halo far behind */}
      <mesh material={a.mat.glowTeal} position={[0, 0, -1.4]}>
        <planeGeometry args={[7, 7]} />
      </mesh>
      <Shield a={a} revealed={revealed} reduced={reduced} />
      <Appear revealed={revealed} reduced={reduced} delay={0.35}>
        <Orbit a={a} radius={1.55} tilt={[1.2, 0.15, 0]} speed={0.35} beads={[0.4, 3.6]} opacity={0.75} reduced={reduced} />
        <Orbit a={a} radius={1.9} tilt={[1.05, -0.5, 0.3]} speed={-0.22} beads={[1.8]} opacity={0.5} reduced={reduced} />
        {!compact && (
          <Orbit a={a} radius={2.3} tilt={[1.35, 0.6, -0.2]} speed={0.14} beads={[5.2]} opacity={0.3} reduced={reduced} />
        )}
      </Appear>
      {items.map((it, i) => {
        const look = it.look ?? "blue";
        const node =
          it.kind === "capsule" ? (
            <Capsule
              a={a}
              body={look === "glass" ? a.mat.glass : a.mat.white}
              cap={look === "glass" ? a.mat.glass : look === "teal" ? a.mat.teal : a.mat.blue}
              rotation={it.rot}
              scale={it.scale}
            />
          ) : it.kind === "tablet" ? (
            <Tablet a={a} rotation={it.rot} scale={it.scale} />
          ) : it.kind === "molecule" ? (
            <Molecule a={a} rotation={it.rot} scale={it.scale} />
          ) : (
            <mesh geometry={a.geo.leaf} material={a.mat.leaf} rotation={it.rot} scale={it.scale} />
          );
        return (
          <group key={i} position={it.pos}>
            <Appear revealed={revealed} reduced={reduced} delay={0.5 + i * 0.07}>
              <Float
                speed={reduced ? 0 : 1 + (i % 3) * 0.35}
                rotationIntensity={reduced ? 0 : 0.6}
                floatIntensity={reduced ? 0 : 0.5}
              >
                {node}
              </Float>
            </Appear>
          </group>
        );
      })}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Canvas                                                              */
/* ------------------------------------------------------------------ */
export default function HeroScene({ revealed, reducedMotion, active, onReady }: HeroSceneProps) {
  useEffect(() => {
    if (reducedMotion) return;
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reducedMotion]);

  const narrow = typeof window !== "undefined" && window.innerWidth < 900;

  return (
    <Canvas
      dpr={[1, narrow ? 1.5 : 1.8]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 7], fov: 35 }}
      frameloop={active ? "always" : "never"}
      style={{ pointerEvents: "none" }}
      aria-hidden
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[-3, 4, 5]} intensity={1.6} />
      <pointLight position={[4, -2, -2]} intensity={10} distance={12} color={PALETTE.teal} />
      <pointLight position={[-4, 2, -3]} intensity={8} distance={12} color={PALETTE.blue} />
      <Environment resolution={narrow ? 128 : 256} frames={1}>
        <Lightformer form="rect" intensity={2.5} position={[0, 5, -2]} rotation-x={Math.PI / 2} scale={[10, 2, 1]} />
        <Lightformer form="rect" intensity={3} color={PALETTE.cyan} position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[4, 8, 1]} />
        <Lightformer form="rect" intensity={2} color={PALETTE.teal} position={[5, -1, 0]} rotation-y={-Math.PI / 2} scale={[4, 6, 1]} />
        <Lightformer form="ring" intensity={1.5} position={[0, 0, 6]} scale={3} />
      </Environment>
      <Rig reduced={reducedMotion}>
        <Composition revealed={revealed} reduced={reducedMotion} />
      </Rig>
      <Ready onReady={onReady} />
    </Canvas>
  );
}
