import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, CornerDownLeft, Search } from "lucide-react";
import { useMemo, useState, type ComponentType } from "react";
import { cn } from "@/lib/utils";
import { FEATURES, goToFeature, scrollToId } from "./site-data";
import { Home, Info, MapPin, Sparkles } from "lucide-react";

type Result = { label: string; hint: string; group: string; icon: ComponentType<{ className?: string }>; run: () => void };

const RESULTS: Result[] = [
  { label: "Home", hint: "Back to the top", group: "Sections", icon: Home, run: () => scrollToId("top") },
  { label: "Our Services", hint: "What we offer", group: "Sections", icon: Sparkles, run: () => scrollToId("services") },
  { label: "About Us", hint: "Committed to your well-being", group: "Sections", icon: Info, run: () => scrollToId("about") },
  { label: "Contact & Location", hint: "Visit us in Sanagau, Lalitpur", group: "Sections", icon: MapPin, run: () => scrollToId("contact") },
  ...FEATURES.map((f, i) => ({
    label: f.title,
    hint: f.tagline,
    group: "Services",
    icon: f.icon,
    run: () => goToFeature(i),
  })),
];

export function SearchOverlay({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return RESULTS;
    return RESULTS.filter((r) => `${r.label} ${r.hint} ${r.group}`.toLowerCase().includes(q));
  }, [query]);

  const choose = (r: Result | undefined) => {
    if (!r) return;
    onOpenChange(false);
    setQuery("");
    window.setTimeout(r.run, 60);
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) setQuery("");
        setCursor(0);
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-navy-deep/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <Dialog.Content className="fixed left-1/2 top-[12vh] z-[91] w-[min(92vw,620px)] -translate-x-1/2 overflow-hidden rounded-3xl glass-dark bg-navy-deep/90 text-on-dark shadow-[var(--shadow-card)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0">
          <Dialog.Title className="sr-only">Search the homepage</Dialog.Title>
          <Dialog.Description className="sr-only">Find a section or service on this page.</Dialog.Description>
          <div className="flex items-center gap-3 border-b border-on-dark/10 px-5">
            <Search className="h-5 w-5 text-cyan" />
            <input
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCursor(0);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setCursor((c) => Math.min(c + 1, results.length - 1));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setCursor((c) => Math.max(c - 1, 0));
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  choose(results[cursor]);
                }
              }}
              placeholder="Search services and sections…"
              aria-label="Search"
              className="h-16 w-full bg-transparent text-base text-on-dark placeholder:text-on-dark-muted/70 focus:outline-none"
            />
            <kbd className="hidden rounded-md border border-on-dark/15 px-2 py-1 text-[10px] text-on-dark-muted sm:block">ESC</kbd>
          </div>
          <ul role="listbox" aria-label="Results" className="max-h-[52vh] overflow-y-auto p-2">
            {results.length === 0 && (
              <li className="px-4 py-10 text-center text-sm text-on-dark-muted">Nothing found for “{query}”.</li>
            )}
            {results.map((r, i) => (
              <li key={`${r.group}-${r.label}`} role="option" aria-selected={i === cursor}>
                <button
                  type="button"
                  onMouseEnter={() => setCursor(i)}
                  onClick={() => choose(r)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors",
                    i === cursor ? "bg-on-dark/10" : "hover:bg-on-dark/5",
                  )}
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-teal/20 text-cyan">
                    <r.icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{r.label}</span>
                    <span className="block truncate text-xs text-on-dark-muted">{r.hint}</span>
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-on-dark-muted">{r.group}</span>
                  {i === cursor ? <CornerDownLeft className="h-4 w-4 text-cyan" /> : <ArrowRight className="h-4 w-4 opacity-0" />}
                </button>
              </li>
            ))}
          </ul>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
