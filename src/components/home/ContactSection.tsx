import { ArrowUp, ArrowUpRight, Clock3, MapPin } from "lucide-react";
import logo from "@/assets/two-brothers-logo-256.png.asset.json";
import { MAPS_EMBED, MAPS_URL, scrollToId } from "./site-data";
import { CtaLink, Eyebrow, Reveal } from "./ui";

export function ContactSection() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="grain relative isolate overflow-hidden bg-navy-deep py-28 text-on-dark lg:py-36">
      <div
        aria-hidden
        className="absolute -left-40 top-0 -z-10 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--teal)_25%,transparent),transparent_65%)]"
      />
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <Eyebrow>Visit us</Eyebrow>
          <h2 id="contact-title" className="mt-5 font-display text-[clamp(2.3rem,5vw,4.2rem)] font-light leading-[1.02] tracking-tight">
            Find us in <span className="italic text-gradient-brand">Sanagau, Lalitpur.</span>
          </h2>
          <p className="mt-6 max-w-lg text-lg text-on-dark-muted">
            Drop by any time. We're open 24/7 for your medicines and everyday health questions.
          </p>
          <dl className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl glass-dark p-5">
              <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-cyan">
                <MapPin className="h-4 w-4" /> Location
              </dt>
              <dd className="mt-2 text-lg font-semibold">Sanagau, Lalitpur</dd>
            </div>
            <div className="rounded-2xl glass-dark p-5">
              <dt className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-cyan">
                <Clock3 className="h-4 w-4" /> Hours
              </dt>
              <dd className="mt-2 text-lg font-semibold">Open 24 hours, 7 days</dd>
            </div>
          </dl>
          <div className="mt-10">
            <CtaLink href={MAPS_URL} external icon={<ArrowUpRight className="h-4 w-4" />}>
              Get Directions
            </CtaLink>
          </div>
        </Reveal>

        <Reveal delay={0.15} y={40}>
          <div className="card-frame shadow-[var(--shadow-card)]">
            <div className="overflow-hidden rounded-[27px] bg-navy">
              <iframe
                title="Map showing Sanagau, Lalitpur"
                src={MAPS_EMBED}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block h-[380px] w-full border-0 opacity-90 [filter:saturate(0.8)_contrast(1.05)] sm:h-[440px]"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-on-dark/10 bg-navy-deep text-on-dark-muted">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 py-10 sm:flex-row sm:items-center sm:px-8">
        <div className="flex items-center gap-3">
          <span className="h-10 w-10 overflow-hidden rounded-full bg-on-dark">
            <img src={logo.url} alt="" width={40} height={40} className="h-full w-full object-cover" loading="lazy" />
          </span>
          <span className="text-sm">
            <span className="block font-display text-on-dark">Two Brothers Healthcare Pvt. Ltd.</span>
            <span className="block text-xs">Sanagau, Lalitpur · Estd. 2083 B.S.</span>
          </span>
        </div>
        <p className="text-xs">© {new Date().getFullYear()} Two Brothers Healthcare Pvt. Ltd. All rights reserved.</p>
        <button
          type="button"
          onClick={() => scrollToId("top")}
          className="inline-flex items-center gap-2 rounded-full border border-on-dark/15 px-4 py-2 text-xs text-on-dark transition-colors hover:border-cyan hover:text-cyan"
        >
          <ArrowUp className="h-3.5 w-3.5" /> Back to top
        </button>
      </div>
    </footer>
  );
}
