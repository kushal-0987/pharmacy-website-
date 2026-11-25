import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck, ChevronDown, Menu, Search, X } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import logo from "@/assets/two-brothers-logo-256.png.asset.json";
import { cn } from "@/lib/utils";
import { FEATURES, HEALTH_TIPS, goToFeature, scrollToId } from "./site-data";
import { Magnetic } from "./ui";

type NavItem = { label: string; target?: string; feature?: number; menu?: "services" | "tips" };

const NAV: NavItem[] = [
  { label: "Home", target: "top" },
  { label: "About Us", target: "about" },
  { label: "Our Services", target: "services", menu: "services" },
  { label: "Pharmacy", feature: 0 },
  { label: "Health Tips", menu: "tips" },
  { label: "Contact", target: "contact" },
];

const SECTIONS = ["top", "services", "about", "contact"];

function useActiveSection() {
  const [active, setActive] = useState("top");
  useEffect(() => {
    const els = SECTIONS.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: [0, 0.25, 0.5] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
}

function go(item: NavItem, e?: MouseEvent) {
  e?.preventDefault();
  if (item.feature !== undefined) goToFeature(item.feature);
  else if (item.target) scrollToId(item.target);
}

export function Navbar({ revealed, onOpenSearch }: { revealed: boolean; onOpenSearch: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [menu, setMenu] = useState<NavItem["menu"] | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const active = useActiveSection();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  const openMenu = (m: NavItem["menu"]) => {
    window.clearTimeout(closeTimer.current);
    setMenu(m ?? null);
  };
  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMenu(null), 160);
  };

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={revealed ? { y: 0, opacity: 1 } : { y: -40, opacity: 0 }}
        transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4"
      >
        <nav
          aria-label="Main"
          className={cn(
            "mx-auto flex max-w-7xl items-center gap-3 rounded-full py-2 pl-2 pr-2 text-on-dark transition-[background-color,box-shadow,border-color] duration-500 sm:pl-3",
            scrolled ? "border border-on-dark/10 bg-navy-deep/85 shadow-[var(--shadow-card)] backdrop-blur-xl" : "border border-transparent bg-transparent",
          )}
        >
          <a href="#top" onClick={(e) => go({ label: "Home", target: "top" }, e)} className="flex shrink-0 items-center gap-3 rounded-full pr-2">
            <span className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-on-dark ring-2 ring-cyan/30">
              <img src={logo.url} alt="Two Brothers Healthcare logo" width={44} height={44} className="h-full w-full object-cover" />
            </span>
            <span className="hidden leading-tight sm:block">
              <span className="block font-display text-[15px] font-medium">Two Brothers</span>
              <span className="block text-[10px] uppercase tracking-[0.22em] text-on-dark-muted">Healthcare Pvt. Ltd.</span>
            </span>
          </a>

          <ul className="ml-auto hidden items-center lg:flex" onMouseLeave={() => setHovered(null)}>
            {NAV.map((item) => {
              const isActive = item.target === active && item.feature === undefined;
              const key = item.label;
              return (
                <li
                  key={key}
                  className="relative"
                  onMouseEnter={() => {
                    setHovered(key);
                    if (item.menu) openMenu(item.menu);
                    else scheduleClose();
                  }}
                  onMouseLeave={() => item.menu && scheduleClose()}
                >
                  {item.menu ? (
                    <button
                      type="button"
                      aria-expanded={menu === item.menu}
                      aria-haspopup="true"
                      onClick={() => (menu === item.menu ? setMenu(null) : openMenu(item.menu))}
                      className={cn(
                        "relative z-10 flex items-center gap-1 rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors",
                        isActive || menu === item.menu ? "text-on-dark" : "text-on-dark-muted hover:text-on-dark",
                      )}
                    >
                      {item.label}
                      <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", menu === item.menu && "rotate-180")} />
                    </button>
                  ) : (
                    <a
                      href={item.target ? `#${item.target}` : "#services"}
                      onClick={(e) => go(item, e)}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "relative z-10 block rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors",
                        isActive ? "text-on-dark" : "text-on-dark-muted hover:text-on-dark",
                      )}
                    >
                      {item.label}
                    </a>
                  )}
                  {hovered === key && (
                    <motion.span
                      layoutId="nav-hover"
                      className="absolute inset-0 rounded-full bg-on-dark/10"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  {isActive && (
                    <motion.span layoutId="nav-active" className="absolute inset-x-3 -bottom-0.5 h-px bg-[image:var(--gradient-brand)]" />
                  )}

                  <AnimatePresence>
                    {item.menu && menu === item.menu && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        onMouseEnter={() => openMenu(item.menu)}
                        onMouseLeave={scheduleClose}
                        className="absolute left-1/2 top-full z-20 mt-3 w-[420px] -translate-x-1/2 rounded-3xl glass-dark bg-navy-deep/85 p-3 shadow-[var(--shadow-card)]"
                      >
                        {item.menu === "services" ? (
                          <div className="grid grid-cols-2 gap-1">
                            {FEATURES.slice(0, 4).map((f, i) => (
                              <button
                                key={f.key}
                                type="button"
                                onClick={() => {
                                  setMenu(null);
                                  goToFeature(i);
                                }}
                                className="group/item flex items-start gap-3 rounded-2xl p-3 text-left transition-colors hover:bg-on-dark/5"
                              >
                                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-teal/20 text-cyan transition-colors group-hover/item:bg-[image:var(--gradient-brand)] group-hover/item:text-navy-deep">
                                  <f.icon className="h-4 w-4" />
                                </span>
                                <span>
                                  <span className="block text-sm font-semibold text-on-dark">{f.title}</span>
                                  <span className="block text-xs text-on-dark-muted">{f.tagline}</span>
                                </span>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div>
                            <ul className="space-y-1">
                              {HEALTH_TIPS.map((t) => (
                                <li key={t.title} className="flex gap-3 rounded-2xl p-3">
                                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-leaf/15 text-leaf">
                                    <t.icon className="h-4 w-4" />
                                  </span>
                                  <span>
                                    <span className="block text-sm font-semibold text-on-dark">{t.title}</span>
                                    <span className="block text-xs leading-relaxed text-on-dark-muted">{t.body}</span>
                                  </span>
                                </li>
                              ))}
                            </ul>
                            <p className="mt-1 border-t border-on-dark/10 px-3 pt-3 text-[11px] text-on-dark-muted">
                              General guidance only. Ask our team about your own health needs.
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>

          <div className="ml-auto flex items-center gap-1.5 lg:ml-2">
            <button
              type="button"
              onClick={onOpenSearch}
              aria-label="Search the page"
              className="grid h-11 w-11 place-items-center rounded-full text-on-dark-muted transition-colors hover:bg-on-dark/10 hover:text-on-dark"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>
            <Magnetic className="hidden sm:inline-flex">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("contact");
                }}
                className="group relative inline-flex h-11 items-center gap-2 overflow-hidden rounded-full bg-[image:var(--gradient-brand)] px-5 text-[13px] font-semibold text-navy-deep shadow-[var(--shadow-glow)] transition-shadow hover:shadow-[var(--shadow-glow-strong)]"
              >
                <CalendarCheck className="h-4 w-4" />
                Book Appointment
              </a>
            </Magnetic>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              className="grid h-11 w-11 place-items-center rounded-full bg-on-dark/10 text-on-dark lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[70] overflow-y-auto bg-navy-deep/95 px-6 pb-10 pt-5 text-on-dark backdrop-blur-xl lg:hidden"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-3">
                <span className="h-10 w-10 overflow-hidden rounded-full bg-on-dark">
                  <img src={logo.url} alt="" className="h-full w-full object-cover" />
                </span>
                <span className="font-display">Two Brothers Healthcare</span>
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="grid h-11 w-11 place-items-center rounded-full bg-on-dark/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <ul className="mt-10 space-y-1">
              {NAV.filter((n) => n.menu !== "tips").map((item, i) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i + 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a
                    href={item.target ? `#${item.target}` : "#services"}
                    onClick={(e) => {
                      setMobileOpen(false);
                      go(item, e);
                    }}
                    className="flex items-baseline justify-between border-b border-on-dark/10 py-4 font-display text-3xl"
                  >
                    {item.label}
                    <span className="font-sans text-xs text-on-dark-muted">0{i + 1}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="mt-8 rounded-3xl bg-on-dark/5 p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan">Health tips</p>
              <ul className="mt-3 space-y-3">
                {HEALTH_TIPS.map((t) => (
                  <li key={t.title} className="flex gap-3">
                    <t.icon className="mt-0.5 h-4 w-4 shrink-0 text-leaf" />
                    <span className="text-sm">
                      <span className="font-semibold">{t.title}.</span>{" "}
                      <span className="text-on-dark-muted">{t.body}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <a
              href="#contact"
              onClick={(e) => {
                setMobileOpen(false);
                go({ label: "Contact", target: "contact" }, e);
              }}
              className="mt-6 flex h-14 items-center justify-center gap-2 rounded-full bg-[image:var(--gradient-brand)] font-semibold text-navy-deep"
            >
              <CalendarCheck className="h-4 w-4" /> Book Appointment
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
