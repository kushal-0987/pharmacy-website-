import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { cn } from "@/lib/utils";
import { circularOffset, wrapIndex } from "./carousel";
import { FEATURES, FEATURE_EVENT, type Feature } from "./site-data";
import { Eyebrow, Reveal } from "./ui";

const AUTO_MS = 5000;

function CardFace({
  feature,
  index,
  total,
  active,
}: {
  feature: Feature;
  index: number;
  total: number;
  active: boolean;
}) {
  const Icon = feature.icon;
  return (
    <div className="card-frame shadow-[var(--shadow-card)]">
      <div className="card-glass relative flex h-[380px] flex-col overflow-hidden p-7 sm:h-[400px]">
        <div className="card-glare" />
        <Icon aria-hidden className="absolute -bottom-10 -right-10 h-52 w-52 text-cyan/[0.05]" strokeWidth={1} />
        <div className="relative flex items-start justify-between">
          <div key={active ? "on" : "off"} className={cn("icon-tile", active && "is-active")}>
            <Icon className="h-7 w-7" strokeWidth={1.6} />
          </div>
          <span className="font-display text-sm text-on-dark-muted">
            0{index + 1}
            <span className="opacity-40"> / 0{total}</span>
          </span>
        </div>
        <div className="relative mt-auto [transform:translateZ(40px)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan">{feature.tagline}</p>
          <h3 className="mt-2 font-display text-[1.9rem] font-normal leading-tight text-on-dark">{feature.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-on-dark-muted">{feature.description}</p>
          {feature.link && (
            <a
              href={feature.link.href}
              target="_blank"
              rel="noreferrer noopener"
              tabIndex={active ? 0 : -1}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan hover:underline"
            >
              {feature.link.label}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function FeatureShowcase() {
  const n = FEATURES.length;
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [spread, setSpread] = useState(320);
  const reduced = useReducedMotion() ?? false;
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.35 });
  const paused = hovering || focusWithin || !inView || reduced;
  const dragStart = useRef<number | null>(null);
  const dragged = useRef(false);

  const go = useCallback((i: number) => setActive(wrapIndex(i, n)), [n]);

  useEffect(() => {
    if (paused) return;
    const t = window.setTimeout(() => setActive((a) => wrapIndex(a + 1, n)), AUTO_MS);
    return () => window.clearTimeout(t);
  }, [active, paused, n]);

  useEffect(() => {
    const onFeature = (e: Event) => {
      const d = (e as CustomEvent<number>).detail;
      if (typeof d === "number") go(d);
    };
    window.addEventListener(FEATURE_EVENT, onFeature);
    return () => window.removeEventListener(FEATURE_EVENT, onFeature);
  }, [go]);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setSpread(w < 640 ? Math.min(w * 0.6, 240) : w < 1024 ? 270 : 330);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const onSectionMove = (e: ReactPointerEvent<HTMLElement>) => {
    const el = sectionRef.current;
    if (!el || reduced) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const onTilt = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - y) * 14}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * 18}deg`);
    el.style.setProperty("--gx", `${x * 100}%`);
    el.style.setProperty("--gy", `${y * 100}%`);
  };
  const resetTilt = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  const current = FEATURES[active];

  return (
    <section
      id="services"
      ref={sectionRef}
      onPointerMove={onSectionMove}
      aria-labelledby="services-title"
      className="relative isolate overflow-hidden bg-navy-deep pb-32 pt-24 text-on-dark sm:pt-32"
    >
      <div aria-hidden className="spotlight absolute inset-0 -z-10" />
      <div aria-hidden className="grid-lines absolute inset-0 -z-10 opacity-70" />
      <div
        aria-hidden
        className="absolute left-1/2 top-[58%] -z-10 h-[340px] w-[min(900px,90vw)] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--cyan)_16%,transparent),transparent)] blur-2xl"
      />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <Reveal className="max-w-2xl">
            <Eyebrow>Our services</Eyebrow>
            <h2 id="services-title" className="mt-5 font-display text-[clamp(2.3rem,5vw,4rem)] font-light leading-[1.02] tracking-tight">
              Five promises, <span className="italic text-gradient-brand">one neighbourhood pharmacy.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.15} className="max-w-sm">
            <p className="text-on-dark-muted">
              Everything we do at Two Brothers Healthcare comes back to these commitments, for every visitor and every
              family in our community.
            </p>
          </Reveal>
        </div>
      </div>

      <Reveal delay={0.1} y={50}>
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="What we offer"
          className={cn("relative mt-16 select-none", paused && "is-paused")}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onFocus={() => setFocusWithin(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusWithin(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") go(active + 1);
            if (e.key === "ArrowLeft") go(active - 1);
          }}
          onPointerDown={(e) => {
            dragStart.current = e.clientX;
            dragged.current = false;
          }}
          onPointerUp={(e) => {
            if (dragStart.current === null) return;
            const dx = e.clientX - dragStart.current;
            dragStart.current = null;
            if (Math.abs(dx) > 45) {
              dragged.current = true;
              go(active + (dx < 0 ? 1 : -1));
            }
          }}
        >
          <div className="relative mx-auto h-[540px] w-full [perspective:1600px] sm:h-[580px]">
            <div className="absolute inset-0 [transform-style:preserve-3d]">
              {FEATURES.map((f, i) => {
                const off = circularOffset(i, active, n);
                const abs = Math.abs(off);
                const isActive = off === 0;
                return (
                  <div
                    key={f.key}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${i + 1} of ${n}: ${f.title}`}
                    aria-hidden={!isActive}
                    data-active={isActive}
                    onClick={() => {
                      if (!isActive && !dragged.current) go(i);
                    }}
                    className={cn(
                      "absolute left-1/2 top-4 w-[280px] transition-[transform,opacity,filter] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d] sm:w-[340px]",
                      !isActive && "cursor-pointer",
                    )}
                    style={{
                      transform: `translateX(-50%) translateX(${off * spread}px) translateZ(${-abs * 220}px) rotateY(${-off * 30}deg) scale(${1 - abs * 0.05})`,
                      opacity: abs > 2 ? 0 : 1 - abs * 0.3,
                      zIndex: 10 - abs,
                      filter: isActive ? "none" : `saturate(${1 - abs * 0.25}) brightness(${1 - abs * 0.12})`,
                    }}
                  >
                    <div
                      className={cn("card-tilt", isActive && "transition-transform")}
                      onPointerMove={isActive ? onTilt : undefined}
                      onPointerLeave={isActive ? resetTilt : undefined}
                      style={{ transform: isActive ? undefined : "none" }}
                    >
                      <motion.div
                        animate={{ y: isActive ? -10 : 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <CardFace feature={f} index={i} total={n} active={isActive} />
                      </motion.div>
                    </div>
                    {/* mirror reflection */}
                    <div aria-hidden className="card-reflection pointer-events-none absolute inset-x-0 top-full mt-4 opacity-80">
                      <div className="[transform:scaleY(-1)]">
                        <CardFace feature={f} index={i} total={n} active={false} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative z-20 mx-auto -mt-10 flex max-w-md flex-col items-center gap-5 px-5">
            <div className="h-6 overflow-hidden text-center" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.p
                  key={current?.key}
                  initial={{ y: 18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -18, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="text-sm text-on-dark-muted"
                >
                  <span className="font-semibold text-on-dark">{current?.title}</span> — {current?.tagline}
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => go(active - 1)}
                aria-label="Previous service"
                className="grid h-12 w-12 place-items-center rounded-full glass-dark transition-colors hover:bg-on-dark/10"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2">
                {FEATURES.map((f, i) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`Show ${f.title}`}
                    aria-current={i === active ? "true" : undefined}
                    className={cn(
                      "relative h-1.5 overflow-hidden rounded-full bg-on-dark/15 transition-all duration-500",
                      i === active ? "w-12" : "w-4 hover:bg-on-dark/30",
                    )}
                  >
                    {i === active && (
                      <span
                        key={`${active}-${paused}`}
                        className="dot-progress absolute inset-0 rounded-full bg-[image:var(--gradient-brand)]"
                        style={{ ["--dur" as string]: `${AUTO_MS}ms` }}
                      />
                    )}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => go(active + 1)}
                aria-label="Next service"
                className="grid h-12 w-12 place-items-center rounded-full glass-dark transition-colors hover:bg-on-dark/10"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
