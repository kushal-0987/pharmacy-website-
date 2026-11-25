import { animate, motion, useMotionTemplate, useMotionValue, usePresence, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import logo from "@/assets/two-brothers-logo-256.png.asset.json";

const MIN_MS = 1300;
const FORCE_MS = 4200;
const RING_R = 86;
const RING_C = 2 * Math.PI * RING_R;

export function Loader({ sceneReady, onFinish }: { sceneReady: boolean; onFinish: () => void }) {
  const [progress, setProgress] = useState(0);
  const readyRef = useRef(sceneReady);
  readyRef.current = sceneReady;
  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;
  const reduced = useReducedMotion();

  const [isPresent, safeToRemove] = usePresence();
  const iris = useMotionValue(-10);
  const contentOpacity = useMotionValue(1);
  const contentScale = useMotionValue(1);
  const mask = useMotionTemplate`radial-gradient(circle at 50% 50%, transparent ${iris}vmax, black calc(${iris}vmax + 8vmax))`;

  // Progress: honest-ish — tracks page load and the 3D scene, never blocks for long.
  useEffect(() => {
    const start = performance.now();
    let loaded = document.readyState === "complete";
    const onLoad = () => {
      loaded = true;
    };
    window.addEventListener("load", onLoad);
    let shown = 0;
    let last = start;
    let raf = 0;
    let finished = false;
    const min = reduced ? 400 : MIN_MS;
    const tick = () => {
      const now = performance.now();
      const t = now - start;
      const dt = Math.min(now - last, 100) / 1000;
      last = now;
      let target = Math.min(68, t / 14);
      if (loaded) target = Math.max(target, Math.min(88, t / 12));
      if ((loaded && readyRef.current && t > min) || t > FORCE_MS) target = 100;
      // time-based easing, so slow devices still finish on schedule
      shown += (target - shown) * (1 - Math.exp(-dt * 7));
      if (target === 100 && (shown > 99.4 || t > FORCE_MS + 900)) shown = 100;
      setProgress(Math.round(shown));
      if (shown >= 100) {
        if (!finished) {
          finished = true;
          window.setTimeout(() => finishRef.current(), 220);
        }
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onLoad);
    };
  }, [reduced]);

  // Cinematic exit: the logo lifts away while an iris opens onto the page.
  useEffect(() => {
    if (isPresent) return;
    const d = reduced ? 0.01 : 1;
    animate(contentOpacity, 0, { duration: 0.45 * d, ease: "easeOut" });
    animate(contentScale, 1.25, { duration: 0.6 * d, ease: [0.7, 0, 0.3, 1] });
    animate(iris, 140, { duration: 1.15 * d, delay: 0.12 * d, ease: [0.7, 0, 0.2, 1] }).then(() => safeToRemove?.());
  }, [isPresent, reduced, contentOpacity, contentScale, iris, safeToRemove]);

  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-label={`Loading Two Brothers Healthcare, ${progress}%`}
      className="loader-failsafe fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-navy-deep text-on-dark"
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_45%,color-mix(in_oklab,var(--teal)_28%,transparent),transparent_70%)]"
      />
      <motion.div
        className="relative flex flex-col items-center"
        style={{ opacity: contentOpacity, scale: contentScale }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative grid h-[200px] w-[200px] place-items-center">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 200 200" aria-hidden>
            <defs>
              <linearGradient id="loader-ring" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--teal)" />
                <stop offset="100%" stopColor="var(--cyan)" />
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r={RING_R} fill="none" stroke="var(--on-dark)" strokeOpacity="0.08" strokeWidth="2" />
            <circle
              cx="100"
              cy="100"
              r={RING_R}
              fill="none"
              stroke="url(#loader-ring)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={RING_C}
              strokeDashoffset={RING_C * (1 - progress / 100)}
            />
          </svg>
          <div className="relative h-[136px] w-[136px] overflow-hidden rounded-full bg-on-dark shadow-[var(--shadow-glow-strong)]">
            <img src={logo.url} alt="" width={136} height={136} className="h-full w-full object-cover" />
          </div>
        </div>

        <svg className="mt-6 h-8 w-40 text-cyan" viewBox="0 0 120 40" fill="none" aria-hidden>
          <path
            className="ecg-path"
            d="M0 20 H38 L45 9 L53 31 L61 4 L69 27 L75 20 H120"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <p className="mt-3 font-display text-lg tracking-wide">Two Brothers Healthcare</p>
        <p className="mt-1 text-[11px] uppercase tracking-[0.35em] text-on-dark-muted">Sanagau · Lalitpur</p>
        <p className="mt-6 font-sans text-xs tabular-nums text-cyan/80">{String(progress).padStart(2, "0")}%</p>
      </motion.div>
    </motion.div>
  );
}
