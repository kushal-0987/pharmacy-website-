import { motion, useReducedMotion, useSpring } from "framer-motion";
import { useRef, type MouseEventHandler, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Pulls its child gently toward the cursor (mouse only, off for reduced motion). */
export function Magnetic({
  children,
  strength = 0.3,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const x = useSpring(0, { stiffness: 220, damping: 16, mass: 0.4 });
  const y = useSpring(0, { stiffness: 220, damping: 16, mass: 0.4 });
  return (
    <motion.div
      ref={ref}
      className={cn("inline-flex", className)}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (reduced || e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

type CtaVariant = "primary" | "glass" | "navy" | "outline";

const CTA_BASE =
  "group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full px-6 text-sm font-semibold tracking-wide transition-[box-shadow,background-color,color,border-color] duration-300 sm:h-14 sm:px-7";

const CTA_VARIANTS: Record<CtaVariant, string> = {
  primary:
    "bg-[image:var(--gradient-brand)] text-navy-deep shadow-[var(--shadow-glow)] hover:shadow-[var(--shadow-glow-strong)] before:absolute before:inset-0 before:-translate-x-full before:bg-[linear-gradient(110deg,transparent_30%,color-mix(in_oklab,var(--on-dark)_55%,transparent)_50%,transparent_70%)] before:transition-transform before:duration-700 hover:before:translate-x-full",
  glass: "glass-dark text-on-dark hover:bg-on-dark/10",
  navy: "bg-navy text-on-dark shadow-[var(--shadow-soft)] hover:bg-midnight",
  outline: "border border-navy/15 text-navy hover:border-teal hover:text-teal",
};

export function CtaLink({
  href,
  children,
  variant = "primary",
  icon,
  className,
  onClick,
  external,
  magnetic = true,
}: {
  href: string;
  children: ReactNode;
  variant?: CtaVariant;
  icon?: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  external?: boolean;
  magnetic?: boolean;
}) {
  const link = (
    <a
      href={href}
      onClick={onClick}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      className={cn(CTA_BASE, CTA_VARIANTS[variant], className)}
    >
      <span className="relative z-10">{children}</span>
      {icon && (
        <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5">{icon}</span>
      )}
    </a>
  );
  return magnetic ? <Magnetic>{link}</Magnetic> : link;
}

/** Fade-and-rise when scrolled into view. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children, tone = "dark" }: { children: ReactNode; tone?: "dark" | "light" }) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em]",
        tone === "dark" ? "text-cyan" : "text-teal",
      )}
    >
      <span className={cn("h-px w-8", tone === "dark" ? "bg-cyan/60" : "bg-teal/60")} />
      {children}
    </p>
  );
}
