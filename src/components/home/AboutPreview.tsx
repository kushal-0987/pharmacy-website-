import { animate, motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, BadgeCheck, HandHeart, ShieldCheck } from "lucide-react";
import { useEffect, useRef } from "react";
import photo from "@/assets/pharmacist_consultation.webp.asset.json";
import logo from "@/assets/two-brothers-logo-256.png.asset.json";
import { scrollToId } from "./site-data";
import { CtaLink, Eyebrow, Reveal } from "./ui";

function CountUp({ to, duration = 1.8 }: { to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!inView || !el) return;
    if (reduced) {
      el.textContent = String(to);
      return;
    }
    const c = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = String(Math.round(v));
      },
    });
    return () => c.stop();
  }, [inView, reduced, to, duration]);
  return (
    <>
      <span ref={ref} aria-hidden className="tabular-nums">
        0
      </span>
      <span className="sr-only">{to}</span>
    </>
  );
}

const PILLARS = [
  { icon: HandHeart, title: "Care", body: "We listen first and look after every visitor like family." },
  { icon: ShieldCheck, title: "Trust", body: "Genuine medicines and honest, clear advice." },
  { icon: BadgeCheck, title: "Professionalism", body: "Careful, knowledgeable service every time you visit." },
];

export function AboutPreview() {
  const imgWrap = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: imgWrap, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);
  const chipY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section id="about" aria-labelledby="about-title" className="relative overflow-hidden bg-background pb-28 pt-0 text-foreground lg:pb-36">
      {/* curved hand-off from the dark showcase */}
      <div aria-hidden className="h-24 w-full bg-navy-deep [clip-path:ellipse(70%_100%_at_50%_0%)] sm:h-32" />
      <div
        aria-hidden
        className="absolute -right-40 top-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--cyan)_18%,transparent),transparent_65%)]"
      />

      <div className="relative mx-auto mt-12 grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:mt-20 lg:grid-cols-12 lg:gap-16">
        <Reveal className="relative lg:col-span-6" y={40}>
          <div ref={imgWrap} className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-[var(--shadow-soft)] sm:aspect-[5/4] lg:aspect-[4/5]">
            <motion.img
              src={photo.url}
              alt="A pharmacist explaining a medicine to an elderly customer at a pharmacy counter"
              loading="lazy"
              width={1400}
              height={933}
              style={{ y: imgY, scale: 1.18 }}
              className="h-full w-full object-cover object-[40%_50%]"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent" />
          </div>

          <motion.div
            style={{ y: chipY }}
            className="absolute -bottom-6 left-4 flex items-center gap-3 rounded-2xl glass-light p-3 pr-5 shadow-[var(--shadow-soft)] sm:-left-6"
          >
            <span className="h-12 w-12 overflow-hidden rounded-full bg-card ring-1 ring-border">
              <img src={logo.url} alt="" width={48} height={48} className="h-full w-full object-cover" />
            </span>
            <span>
              <span className="block text-sm font-bold text-navy">Estd. 2083 B.S.</span>
              <span className="block text-xs text-muted-foreground">Sanagau, Lalitpur</span>
            </span>
          </motion.div>
          <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full glass-light px-3 py-1.5 text-xs font-semibold text-navy sm:right-6 sm:top-6">
            <span className="pulse-dot h-2 w-2 rounded-full bg-teal text-teal" />
            Open 24/7
          </div>
        </Reveal>

        <div className="lg:col-span-6">
          <Reveal>
            <Eyebrow tone="light">About us</Eyebrow>
            <h2 id="about-title" className="mt-5 font-display text-[clamp(2.3rem,4.8vw,3.9rem)] font-light leading-[1.04] tracking-tight text-navy">
              Committed to your <span className="italic text-teal">well-being.</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              At Two Brothers Healthcare Pvt. Ltd., we believe in providing quality healthcare services with care, trust and
              professionalism.
            </p>
          </Reveal>

          <ul className="mt-10 space-y-3">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={0.1 + i * 0.08} y={18}>
                <li className="group flex items-start gap-4 rounded-2xl border border-border bg-card/70 p-4 transition-[transform,box-shadow,border-color] duration-500 hover:-translate-y-0.5 hover:border-teal/40 hover:shadow-[var(--shadow-soft)]">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-teal/10 text-teal transition-colors duration-500 group-hover:bg-[image:var(--gradient-brand)] group-hover:text-navy-deep">
                    <p.icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-semibold text-navy">{p.title}</span>
                    <span className="block text-sm text-muted-foreground">{p.body}</span>
                  </span>
                </li>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.2}>
            <dl className="mt-10 grid grid-cols-3 divide-x divide-border border-y border-border py-6">
              <div className="pr-4">
                <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Established</dt>
                <dd className="mt-1 font-display text-3xl text-navy sm:text-4xl">
                  <CountUp to={2083} />
                  <span className="ml-1 text-base text-teal">B.S.</span>
                </dd>
              </div>
              <div className="px-4">
                <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Service</dt>
                <dd className="mt-1 font-display text-3xl text-navy sm:text-4xl">
                  <CountUp to={24} duration={1.4} />
                  <span className="text-teal">/7</span>
                </dd>
              </div>
              <div className="pl-4">
                <dt className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Home</dt>
                <dd className="mt-2 font-display text-xl leading-tight text-navy sm:text-2xl">Sanagau, Lalitpur</dd>
              </div>
            </dl>
            <div className="mt-10">
              <CtaLink
                href="#contact"
                variant="navy"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("contact");
                }}
                icon={<ArrowRight className="h-4 w-4" />}
              >
                Learn More
              </CtaLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
