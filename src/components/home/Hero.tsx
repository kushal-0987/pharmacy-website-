import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, Clock3, MapPin, ShieldCheck } from "lucide-react";
import { Component, lazy, Suspense, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import logo from "@/assets/two-brothers-logo-256.png.asset.json";
import videoMp4 from "@/assets/hero_capsules_loop.mp4.asset.json";
import videoWebm from "@/assets/hero_capsules_loop.webm.asset.json";
import poster from "@/assets/hero_capsules_poster.webp.asset.json";
import { scrollToId } from "./site-data";
import { CtaLink } from "./ui";

const HeroScene = lazy(() => import("./HeroScene"));

class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  override componentDidCatch() {
    this.props.onError();
  }
  override render() {
    return this.state.failed ? null : this.props.children;
  }
}

const EASE = [0.22, 1, 0.36, 1] as const;

type Word = { text: string; className?: string };

function RevealLine({ words, revealed, delay }: { words: Word[]; revealed: boolean; delay: number }) {
  return (
    <span className="block">
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className={`inline-block ${w.className ?? ""}`}
            initial={{ y: "110%", rotate: 4 }}
            animate={revealed ? { y: "0%", rotate: 0 } : {}}
            transition={{ duration: 1.1, delay: delay + i * 0.09, ease: EASE }}
          >
            {w.text}
          </motion.span>
          {i < words.length - 1 && "\u00a0"}
        </span>
      ))}
    </span>
  );
}

export function Hero({ revealed, onSceneReady }: { revealed: boolean; onSceneReady: () => void }) {
  const reduced = useReducedMotion() ?? false;
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);
  const [inView, setInView] = useState(true);
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(!!e?.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Mouse depth for the DOM layers (CSS vars, no re-render).
  useEffect(() => {
    const el = rootRef.current;
    if (!el || reduced) return;
    let raf = 0;
    let x = 0;
    let y = 0;
    const onMove = (e: PointerEvent) => {
      x = (e.clientX / window.innerWidth) * 2 - 1;
      y = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0;
          el.style.setProperty("--px", x.toFixed(3));
          el.style.setProperty("--py", y.toFixed(3));
        });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (reduced || !inView) v.pause();
    else void v.play().catch(() => undefined);
  }, [reduced, inView]);

  const { scrollYProgress } = useScroll({ target: rootRef, offset: ["start start", "end start"] });
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.18]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const sceneY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  const markReady = () => {
    setSceneReady(true);
    onSceneReady();
  };

  return (
    <section
      id="top"
      ref={rootRef}
      aria-label="Welcome"
      className="relative isolate min-h-[100svh] overflow-hidden bg-[#F2F8FF] text-[#10243B]"
      style={{ "--px": 0, "--py": 0 } as CSSProperties}
    >
      {/* Layer 0 — Supplied clinical blue-and-white healthcare background */}
      <motion.div aria-hidden className="absolute inset-0 -z-30" style={{ y: videoY, scale: videoScale }}>
        <img
          src="/images/redesign/hero-bg.jpg"
          alt="Two Brothers Healthcare Reception"
          className="h-full w-full object-cover object-center opacity-85"
        />
        {/* Soft clinical gradient overlays for readable contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent lg:w-3/5" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#F2F8FF] to-transparent" />
      </motion.div>

      {/* Layer 1 — interactive 3D shield & capsules */}
      <motion.div className="absolute inset-0 -z-10" style={{ y: sceneY }} data-scene-ready={sceneReady ? "true" : undefined}>
        {mounted && (
          <SceneBoundary onError={markReady}>
            <Suspense fallback={null}>
              <HeroScene revealed={revealed} reducedMotion={reduced} active={inView} onReady={markReady} />
            </Suspense>
          </SceneBoundary>
        )}
      </motion.div>

      {/* Layer 2 — copy */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-16 pt-[38svh] sm:px-8 lg:justify-center lg:pb-20 lg:pt-24"
      >
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={revealed ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
            className="inline-flex items-center gap-2.5 rounded-full bg-white/95 border border-blue-200/90 shadow-xs py-1.5 pl-2 pr-4 text-xs font-semibold text-[#0755D9]"
          >
            <span className="h-6 w-6 overflow-hidden rounded-full bg-white p-0.5 ring-1 ring-blue-200">
              <img src="/logo.png" alt="" width={24} height={24} className="h-full w-full object-contain" />
            </span>
            <span className="font-semibold text-[#082653]">Your neighbourhood pharmacy</span>
            <span className="h-3 w-px bg-blue-200" />
            <span className="text-[#64748B] font-normal">Estd. 2083 B.S.</span>
          </motion.div>

          <h1 className="mt-5 font-display text-[clamp(2.8rem,7vw,5.6rem)] font-extrabold leading-[1.04] tracking-[-0.03em] text-[#082653]">
            <span className="sr-only">Your health, our priority — Two Brothers Healthcare Pvt. Ltd.</span>
            <span aria-hidden>
              <RevealLine words={[{ text: "Your", className: "text-[#082653]" }, { text: "health,", className: "text-[#082653]" }]} revealed={revealed} delay={0.35} />
              <RevealLine
                words={[{ text: "our", className: "text-[#082653]" }, { text: "priority.", className: "italic font-serif font-normal text-[#00AAFF] pr-[0.08em]" }]}
                revealed={revealed}
                delay={0.55}
              />
            </span>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={revealed ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.9, ease: EASE }}
          >
            <p className="mt-5 flex items-center gap-3 text-xs sm:text-[13px] font-bold uppercase tracking-[0.25em] text-[#0755D9]">
              <span className="h-[2px] w-8 bg-[#0755D9] rounded-full" />
              Two Brothers Healthcare Pvt. Ltd.
            </p>
            <p className="mt-3.5 max-w-xl text-base sm:text-lg leading-relaxed text-[#64748B]">
              Trusted pharmacy and healthcare services in Sanagau, Lalitpur — for a healthier and happier community.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={revealed ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 1.05, ease: EASE }}
            className="mt-8 flex flex-wrap items-center gap-3.5"
          >
            <a
              href="#services"
              onClick={(e) => {
                e.preventDefault();
                scrollToId("services");
              }}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#0755D9] hover:bg-[#00AAFF] text-white font-bold text-sm shadow-[0_10px_25px_rgba(7,85,217,0.35)] hover:shadow-[0_14px_30px_rgba(0,170,255,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Explore Our Services</span>
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                scrollToId("about");
              }}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/95 hover:bg-white text-[#082653] border border-blue-200/90 shadow-xs hover:border-[#0755D9] font-bold text-sm transition-all"
            >
              <span>Discover Our Story</span>
            </a>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={revealed ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 1.3 }}
            className="mt-10 grid max-w-xl grid-cols-3 gap-3 border-t border-blue-100 pt-6 text-xs text-[#64748B] sm:text-sm"
          >
            {[
              { icon: ShieldCheck, label: "Genuine medicines", color: "text-[#19C99A]" },
              { icon: Clock3, label: "Open 24/7", color: "text-[#0755D9]" },
              { icon: MapPin, label: "Sanagau, Lalitpur", color: "text-[#00AAFF]" },
            ].map((t) => (
              <li key={t.label} className="flex items-center gap-2 font-medium text-[#10243B]">
                <t.icon className={`h-4 w-4 shrink-0 ${t.color}`} />
                <span className="text-xs sm:text-[13px]">{t.label}</span>
              </li>
            ))}
          </motion.ul>
        </div>
      </motion.div>

      {/* Layer 3 — foreground floating glass chips */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
        <motion.div
          className="absolute right-[5%] top-[22%]"
          initial={{ opacity: 0, y: 24 }}
          animate={revealed ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.4, ease: EASE }}
        >
          <div className="flex items-center gap-3 rounded-2xl bg-white/95 backdrop-blur-md border border-blue-100 px-4 py-3 shadow-[0_12px_30px_rgba(7,85,217,0.12)]">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00AAFF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0755D9]"></span>
            </span>
            <span>
              <span className="block text-sm font-bold text-[#082653]">Open 24/7</span>
              <span className="block text-xs text-[#64748B]">Always here for you</span>
            </span>
          </div>
        </motion.div>
        <motion.div
          className="absolute bottom-[16%] right-[28%]"
          initial={{ opacity: 0, y: 24 }}
          animate={revealed ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1.6, ease: EASE }}
        >
          <div className="flex items-center gap-3 rounded-2xl bg-white/95 backdrop-blur-md border border-emerald-100 px-4 py-3 shadow-[0_12px_30px_rgba(25,201,154,0.15)]">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#19C99A]/15 text-[#19C99A]">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-bold text-[#082653]">Quality medicines</span>
              <span className="block text-xs text-[#64748B]">Trusted &amp; genuine</span>
            </span>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.a
        href="#services"
        onClick={(e) => {
          e.preventDefault();
          scrollToId("services");
        }}
        initial={{ opacity: 0 }}
        animate={revealed ? { opacity: 1 } : {}}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-7 right-8 hidden items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-on-dark-muted transition-colors hover:text-on-dark lg:flex"
        aria-label="Scroll to services"
      >
        Scroll
        <span className="relative flex h-10 w-6 justify-center rounded-full border border-on-dark/25 pt-2">
          <span className="scroll-cue-dot h-1.5 w-1.5 rounded-full bg-cyan" />
        </span>
        <ArrowDown className="sr-only" />
      </motion.a>
    </section>
  );
}
