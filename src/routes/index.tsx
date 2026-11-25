import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import logo from "@/assets/two-brothers-logo-256.png.asset.json";
import { Hero } from "@/components/home/Hero";
import { Loader } from "@/components/home/Loader";
import { SearchOverlay } from "@/components/home/SearchOverlay";
import { TopEmergencyBar, MainNavbar, MobileStickyBottomBar } from "@/components/common/Header";
import { SiteFooter } from "@/components/common/Footer";
import {
  FeatureStrip,
  QuickPortalCards,
  QuickServicesGrid,
  HowItWorksSection,
  FeaturedPackagesSection,
  TrustPillarsSection,
  ProviderSpotlightSection,
  TestimonialsSection,
  HealthTipsPreviewSection,
  LocationHoursSection,
} from "@/components/home/HomeSections";
import { ShieldCheck, UserCheck, Truck, Clock } from "lucide-react";

const TITLE = "Two Brothers Healthcare Pvt. Ltd. — Pharmacy, Consultation, Lab & Checkups in Lalitpur";
const DESCRIPTION =
  "Trusted pharmacy, specialist doctor consultations, accredited diagnostics and home medicine delivery in Sanagau, Lalitpur, Nepal.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "preload", as: "image", href: "/logo.png" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "MedicalOrganization",
          name: "Two Brothers Healthcare Pvt. Ltd.",
          url: "https://twobrothershealthcare.com",
          logo: "https://twobrothershealthcare.com/logo.png",
          description: "Licensed community pharmacy, specialist doctor consultations, and certified diagnostic laboratory in Sanagau, Lalitpur, Nepal.",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Ward No. 4, Sanagau",
            addressLocality: "Mahalaxmi Municipality, Lalitpur",
            addressRegion: "Bagmati Province",
            postalCode: "44700",
            addressCountry: "NP",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: "27.653457",
            longitude: "85.342918",
          },
          telephone: "+977-01-5582910",
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
              opens: "00:00",
              closes: "23:59",
            },
          ],
        }),
      },
    ],
  }),
  component: Home,
});

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-teal to-cyan"
      style={{ scaleX }}
    />
  );
}

function Home() {
  const [loading, setLoading] = useState(true);
  const [sceneReady, setSceneReady] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = loading ? "hidden" : "";
  }, [loading]);

  // Safety net: never keep visitors behind the loader
  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 5000);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onSceneReady = useCallback(() => setSceneReady(true), []);
  const onFinish = useCallback(() => setLoading(false), []);

  return (
    <>
      <a
        href="#services"
        className="sr-only z-[110] rounded-full bg-cyan px-4 py-2 text-navy-deep focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <AnimatePresence>{loading && <Loader key="loader" sceneReady={sceneReady} onFinish={onFinish} />}</AnimatePresence>
      <ScrollProgress />
      
      {/* 1. Sticky Top Bar */}
      <TopEmergencyBar />
      
      {/* 2. Main Navbar */}
      <MainNavbar onOpenSearch={() => setSearchOpen(true)} />
      
      <main>
        {/* 3. Cinematic 3D Hero */}
        <Hero revealed={!loading} onSceneReady={onSceneReady} />
        
        {/* Feature strip below hero */}
        <FeatureStrip />
        
        {/* Quick Portal Cards (Patient Portal, Book Appointment, FAQ) */}
        <QuickPortalCards />
        
        {/* 4. Quick Services Grid (5 cards) */}
        <QuickServicesGrid />
        
        {/* 5. How It Works Section (3 steps) */}
        <HowItWorksSection />
        
        {/* 6. Featured Health Packages */}
        <FeaturedPackagesSection />
        
        {/* 7. Why Two Brothers Healthcare (4 trust pillars) */}
        <TrustPillarsSection />
        
        {/* 8. Doctor / Provider Spotlight */}
        <ProviderSpotlightSection />
        
        {/* 9. Patient Testimonials */}
        <TestimonialsSection />
        
        {/* 10. Health Tips Preview */}
        <HealthTipsPreviewSection />
        
        {/* 11. Location & Hours */}
        <LocationHoursSection />
      </main>

      {/* 12. Footer */}
      <SiteFooter />
      
      {/* Sticky Mobile Bar */}
      <MobileStickyBottomBar />
      
      <SearchOverlay open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
