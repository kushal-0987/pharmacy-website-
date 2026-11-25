import {
  Clock3,
  Droplets,
  Footprints,
  HeartPulse,
  MapPin,
  Pill,
  ClipboardCheck,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";

export const COMPANY = {
  name: "Two Brothers Healthcare Pvt. Ltd.",
  short: "Two Brothers Healthcare",
  location: "Sanagau, Lalitpur",
  established: "2083 B.S.",
} as const;

export const MAPS_QUERY = "Sanagau, Lalitpur, Nepal";
export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAPS_QUERY)}`;
export const MAPS_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(MAPS_QUERY)}&output=embed`;

export type Feature = {
  key: string;
  title: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  link?: { label: string; href: string };
};

export const FEATURES: Feature[] = [
  {
    key: "medicines",
    title: "Quality Medicines",
    tagline: "Trusted & Genuine",
    description:
      "Carefully sourced, genuine medicines, dispensed with clear and honest guidance on how to take them.",
    icon: Pill,
  },
  {
    key: "care",
    title: "Expert Care",
    tagline: "Professional Support",
    description:
      "Friendly, knowledgeable support to help you understand your prescriptions and everyday health needs.",
    icon: Stethoscope,
  },
  {
    key: "service",
    title: "24/7 Service",
    tagline: "Always Here for You",
    description:
      "Health needs don't keep office hours. Day or night, we're here when you need us.",
    icon: Clock3,
  },
  {
    key: "health",
    title: "Better Health",
    tagline: "A Healthier Community",
    description:
      "Working every day toward a healthier, happier Sanagau, one family and one visit at a time.",
    icon: HeartPulse,
  },
  {
    key: "location",
    title: "Sanagau, Lalitpur",
    tagline: "Our Location",
    description: "Your neighbourhood pharmacy, close to home in Sanagau, Lalitpur.",
    icon: MapPin,
    link: { label: "Get directions", href: MAPS_URL },
  },
];

export type HealthTip = { title: string; body: string; icon: LucideIcon };

export const HEALTH_TIPS: HealthTip[] = [
  { title: "Stay hydrated", body: "Drink water regularly through the day, more in warm weather.", icon: Droplets },
  {
    title: "Take medicines as directed",
    body: "Follow the dose and timing on your prescription. Ask us if you're unsure.",
    icon: ClipboardCheck,
  },
  { title: "Keep moving", body: "A daily walk supports your heart and lifts your mood.", icon: Footprints },
];

/** Event the nav and search use to open a specific feature card in the showcase. */
export const FEATURE_EVENT = "tbh:feature";

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
}

export function goToFeature(index: number) {
  window.dispatchEvent(new CustomEvent<number>(FEATURE_EVENT, { detail: index }));
  scrollToId("services");
}
