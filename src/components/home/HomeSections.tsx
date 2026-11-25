import React from 'react';
import { Link } from '@tanstack/react-router';
import { useI18n } from '@/lib/i18n';
import { useHealthcare } from '@/lib/healthcare-store';
import {
  Pill,
  Stethoscope,
  FlaskConical,
  Package,
  Layers,
  ArrowRight,
  ShieldCheck,
  Building2,
  Receipt,
  Truck,
  CheckCircle2,
  Calendar,
  Clock,
  Star,
  MapPin,
  PhoneCall,
  UserCheck,
  ChevronRight,
  ExternalLink,
  Heart,
  Zap,
  Users,
  Shield,
  HelpCircle,
  Activity,
  FileCheck2,
  ArrowUpRight,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* 1. Feature Strip (Directly beneath hero - matches master reference image)   */
/* -------------------------------------------------------------------------- */
export const FeatureStrip: React.FC = () => {
  const features = [
    { icon: Heart, label: 'Compassionate Care' },
    { icon: Shield, label: 'Trusted & Reliable' },
    { icon: Zap, label: '24/7 Support' },
    { icon: Users, label: 'A Healthier Community Together' },
  ];

  return (
    <div className="bg-[#082653] border-y border-white/10 py-3.5 px-4 relative z-20 text-white shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Pills */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-4 text-xs font-medium">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 transition-all text-white/95"
              >
                <Icon className="h-3.5 w-3.5 text-[#00AAFF] shrink-0" />
                <span className="text-[11px] sm:text-xs font-medium tracking-wide">{f.label}</span>
              </div>
            );
          })}
        </div>

        {/* Right Slogan */}
        <div className="text-[11px] sm:text-xs text-blue-200/90 font-medium text-center md:text-right shrink-0">
          <span className="font-semibold text-white">Two Brothers Healthcare</span>
          <span className="mx-2 text-[#00AAFF]">•</span>
          <span className="italic font-serif text-[#A9DFFF]">Better Health. A Brighter Tomorrow.</span>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 2. Quick Portal Cards (3 Prominent Cards from Mockup 2)                    */
/* -------------------------------------------------------------------------- */
export const QuickPortalCards: React.FC = () => {
  const { isAuthenticated, currentRole } = useHealthcare();
  const portalHref = !isAuthenticated
    ? '/login'
    : currentRole === 'admin'
      ? '/admin'
      : currentRole === 'patient'
        ? '/account'
        : '/staff';

  return (
    <section className="py-8 bg-[#F2F8FF] border-b border-blue-100/60 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Patient Portal */}
          <div className="relative rounded-3xl p-6 bg-gradient-to-br from-white via-[#F2F8FF] to-[#E3F2FD] border border-blue-200/80 shadow-[0_8px_30px_rgba(7,85,217,0.06)] hover:shadow-[0_12px_40px_rgba(7,85,217,0.12)] transition-all duration-300 group flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 rounded-full bg-[#00AAFF]/10 blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-2xl bg-[#0755D9] text-white flex items-center justify-center shadow-md shadow-[#0755D9]/25 group-hover:scale-105 transition-transform">
                  <UserCheck className="h-6 w-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-100/80 text-[11px] font-semibold text-[#0755D9] border border-blue-200">
                  Secure Access
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-[#082653] mb-1 group-hover:text-[#0755D9] transition-colors">
                Patient Portal
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed mb-6">
                Your health, in your hands. View prescription history, lab reports, and manage family profiles.
              </p>
            </div>
            <Link
              to={portalHref}
              className="inline-flex items-center justify-between px-4 py-2.5 rounded-full bg-[#0755D9] text-white text-xs font-semibold hover:bg-[#00AAFF] transition-colors shadow-sm"
            >
              <span>{isAuthenticated ? 'Access Portal' : 'Sign In to Portal'}</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Card 2: Book Appointment */}
          <div className="relative rounded-3xl p-6 bg-gradient-to-br from-white via-[#F2F8FF] to-[#E8F8F5] border border-blue-200/80 shadow-[0_8px_30px_rgba(7,85,217,0.06)] hover:shadow-[0_12px_40px_rgba(7,85,217,0.12)] transition-all duration-300 group flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 rounded-full bg-[#19C99A]/15 blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-2xl bg-[#082653] text-[#00AAFF] flex items-center justify-center shadow-md shadow-[#082653]/25 group-hover:scale-105 transition-transform">
                  <Calendar className="h-6 w-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100/80 text-[11px] font-semibold text-[#19C99A] border border-emerald-200">
                  Instant Hold
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-[#082653] mb-1 group-hover:text-[#0755D9] transition-colors">
                Book Appointment
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed mb-6">
                Schedule your visit easily. Choose from experienced physicians, gynecologists & pediatricians.
              </p>
            </div>
            <Link
              to="/book"
              className="inline-flex items-center justify-between px-4 py-2.5 rounded-full bg-[#082653] text-white text-xs font-semibold hover:bg-[#0755D9] transition-colors shadow-sm"
            >
              <span>Book Now</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Card 3: FAQ */}
          <div className="relative rounded-3xl p-6 bg-gradient-to-br from-white via-[#F2F8FF] to-[#EFF6FF] border border-blue-200/80 shadow-[0_8px_30px_rgba(7,85,217,0.06)] hover:shadow-[0_12px_40px_rgba(7,85,217,0.12)] transition-all duration-300 group flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 rounded-full bg-[#0755D9]/10 blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#0755D9] to-[#00AAFF] text-white flex items-center justify-center shadow-md shadow-[#00AAFF]/25 group-hover:scale-105 transition-transform">
                  <HelpCircle className="h-6 w-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-100/80 text-[11px] font-semibold text-[#0755D9] border border-blue-200">
                  24/7 Help
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-[#082653] mb-1 group-hover:text-[#0755D9] transition-colors">
                FAQ & Support
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed mb-6">
                Find answers to common questions about medicine delivery, insurance, lab reports & timings.
              </p>
            </div>
            <Link
              to="/faq"
              className="inline-flex items-center justify-between px-4 py-2.5 rounded-full bg-white text-[#0755D9] border border-blue-200 hover:border-[#0755D9] text-xs font-semibold hover:bg-blue-50 transition-colors shadow-sm"
            >
              <span>Explore FAQ</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* 3. Quick Services Grid (Sanagau Community Healthcare)                      */
/* -------------------------------------------------------------------------- */
export const QuickServicesGrid: React.FC = () => {
  const services = [
    {
      title: 'Community Pharmacy',
      desc: 'Genuine medicines, temperature-monitored storage & doorstep delivery across Lalitpur.',
      icon: Pill,
      link: '/pharmacy',
      badge: '24/7 Available',
      badgeIcon: Clock,
      secondaryBadge: 'Doorstep Delivery',
      image: '/images/services/pharmacy.jpg',
    },
    {
      title: 'Doctor Consultation',
      desc: 'NMC-certified specialist physicians, pediatricians, gynecologists & cardiologists.',
      icon: Stethoscope,
      link: '/services/consultation',
      badge: 'In-person & OPD',
      badgeIcon: Stethoscope,
      secondaryBadge: 'NMC Certified',
      image: '/images/services/consultation.jpg',
    },
    {
      title: 'Diagnostic Laboratory',
      desc: 'Accredited blood, urine, metabolic & cardiac investigations with rapid digital reports.',
      icon: FlaskConical,
      link: '/services/lab',
      badge: 'Certified Lab',
      badgeIcon: FlaskConical,
      secondaryBadge: 'Digital Reports',
      image: '/images/services/laboratory.jpg',
    },
    {
      title: 'Health Checkup Packages',
      desc: 'Discounted preventive panels for individuals, working professionals & senior parents.',
      icon: Package,
      link: '/services/packages',
      badge: 'Save up to 35%',
      badgeIcon: Package,
      secondaryBadge: 'Preventive Care',
      image: '/images/services/packages.jpg',
    },
    {
      title: 'Nursing & Minor Procedures',
      desc: 'Wound dressing, injections, ECG, nebulization & compassionate elderly assistance.',
      icon: Layers,
      link: '/services/other',
      badge: 'Walk-in Welcome',
      badgeIcon: Layers,
      secondaryBadge: 'Express Care',
      image: '/images/services/nursing.jpg',
    },
  ];

  return (
    <section id="services" className="py-24 bg-[#F2F8FF] relative overflow-hidden text-[#10243B]">
      {/* Subtle clinical hexagonal / dot background watermark */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="medical-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0755D9" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#medical-grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-[2px] bg-[#0755D9] rounded-full inline-block" />
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#0755D9]">
                SANAGAU COMMUNITY HEALTHCARE
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#082653] leading-[1.15]">
              Comprehensive <span className="font-serif italic font-normal text-[#0755D9] tracking-normal">Medical Services</span>
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#64748B] max-w-2xl leading-relaxed">
              From verified daily prescriptions to experienced physician consultations and precision diagnostics, everything you need under one roof.
            </p>
          </div>

          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0755D9] hover:text-[#00AAFF] transition-colors group shrink-0"
          >
            <span>ALL CLINICAL DEPARTMENTS</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 5 Service Cards + 1 Emergency Assistance Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((item) => (
            <Link
              key={item.title}
              to={item.link}
              className="relative rounded-3xl p-5 bg-white border border-blue-100 hover:border-[#0755D9]/40 shadow-[0_4px_25px_rgba(7,85,217,0.06)] hover:shadow-[0_16px_40px_rgba(7,85,217,0.14)] transition-all duration-300 hover:-translate-y-1.5 group flex flex-col sm:flex-row gap-4 items-center sm:items-stretch overflow-hidden"
            >
              {/* Left Thumbnail Image */}
              <div className="relative w-full sm:w-28 sm:h-28 h-36 rounded-2xl overflow-hidden shrink-0 ring-1 ring-blue-100 shadow-sm">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Right Content Column */}
              <div className="flex flex-col justify-between flex-1 min-w-0 w-full h-full">
                <div>
                  {/* Top Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EBF5FF] border border-blue-200 text-[10px] sm:text-[11px] font-semibold text-[#0755D9]">
                      <item.badgeIcon className="h-3 w-3 shrink-0" />
                      <span>{item.badge}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E8FAF5] border border-emerald-200 text-[10px] sm:text-[11px] font-semibold text-[#19C99A]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#19C99A] animate-pulse" />
                      <span>{item.secondaryBadge}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-base sm:text-lg font-bold text-[#082653] group-hover:text-[#0755D9] transition-colors leading-snug">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[11px] sm:text-xs text-[#64748B] leading-relaxed line-clamp-2 mt-1">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom Action */}
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
                  <span className="text-xs font-bold text-[#0755D9] group-hover:text-[#00AAFF] transition-colors">
                    Learn more
                  </span>
                  <div className="w-8 h-8 rounded-full border border-blue-200 bg-[#F2F8FF] flex items-center justify-center text-[#0755D9] group-hover:bg-[#0755D9] group-hover:text-white group-hover:border-[#0755D9] transition-all shadow-sm">
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {/* 6th Card: Fast Track Clinic / Emergency Assistance Card */}
          <div className="relative rounded-3xl p-6 bg-gradient-to-br from-[#082653] via-[#0755D9] to-[#0A3C82] text-white overflow-hidden flex flex-col justify-between group shadow-xl">
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#00AAFF]/20 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 border border-white/20 text-[10px] sm:text-[11px] font-bold text-white uppercase tracking-wider">
                  <PhoneCall className="h-3 w-3 shrink-0 text-[#00AAFF]" />
                  24/7 Sanagau Support
                </span>
                <span className="h-2 w-2 rounded-full bg-[#19C99A] animate-ping" />
              </div>

              <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-2 leading-tight">
                Need Immediate Healthcare Assistance?
              </h3>
              <p className="text-[11px] sm:text-xs text-blue-100/90 leading-relaxed mb-4">
                Our Sanagau emergency helpline and on-call medical team are active 24/7 for urgent consultations and doorstep delivery.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <a
                href="tel:015582910"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00AAFF] text-[#082653] text-xs font-bold shadow-md hover:bg-white transition-colors"
              >
                <PhoneCall className="h-3.5 w-3.5" />
                <span>Call 01-5582910</span>
              </a>
              <Link
                to="/book"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-white/30 bg-white/10 text-white hover:bg-white/20 text-xs font-semibold transition-colors"
              >
                <Calendar className="h-3.5 w-3.5 text-[#00AAFF]" />
                <span>Book Slot</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Not sure decision helper */}
        <div className="mt-12 rounded-3xl bg-white border border-blue-100 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_4px_25px_rgba(7,85,217,0.04)]">
          <div>
            <h4 className="text-base sm:text-lg font-bold text-[#082653] mb-1">Not sure which service you need?</h4>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Have a prescription? → <Link to="/pharmacy" className="text-[#0755D9] font-medium underline">Pharmacy</Link> &nbsp;|&nbsp;
              Need diagnostic tests? → <Link to="/services/lab" className="text-[#0755D9] font-medium underline">Lab Diagnostics</Link> &nbsp;|&nbsp;
              Need specialist advice? → <Link to="/services/consultation" className="text-[#0755D9] font-medium underline">Doctor Consultation</Link>
            </p>
          </div>
          <Link
            to="/contact"
            className="shrink-0 px-5 py-2.5 rounded-full bg-[#F2F8FF] hover:bg-[#0755D9] hover:text-white text-[#0755D9] text-xs font-bold transition-all border border-blue-200"
          >
            Speak with our Front Desk
          </Link>
        </div>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* 4. "How it Works" Section (3 Steps)                                        */
/* -------------------------------------------------------------------------- */
export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Choose a Service',
      desc: 'Browse doctor consultations, diagnostic lab tests, wellness checkup bundles, or search our medicine directory.',
      action: 'Browse options',
      link: '/services',
    },
    {
      num: '02',
      title: 'Book or Enquire Online',
      desc: 'Lock in your preferred slot with our 10-minute hold guarantee, or upload your doctor’s prescription securely.',
      action: 'Book appointment',
      link: '/book',
    },
    {
      num: '03',
      title: 'Visit Clinic or Doorstep Care',
      desc: 'Receive attentive treatment at our Sanagau clinic or get genuine medicines delivered straight to your door across Lalitpur.',
      action: 'View location',
      link: '/contact',
    },
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0755D9] block mb-2">
            Seamless Patient Journey
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#082653]">
            How Two Brothers Healthcare Works
          </h2>
          <p className="mt-3 text-sm text-[#64748B]">
            Simple, transparent, and completely verified healthcare tailored to your family's daily comfort.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((s) => (
            <div
              key={s.num}
              className="relative rounded-3xl bg-[#F2F8FF] border border-blue-100 p-8 flex flex-col justify-between hover:border-[#0755D9]/40 hover:shadow-[0_12px_35px_rgba(7,85,217,0.08)] transition-all group"
            >
              <div>
                <span className="font-display text-5xl font-bold text-[#0755D9]/25 block mb-4 group-hover:text-[#0755D9]/50 transition-colors">
                  {s.num}
                </span>
                <h3 className="text-xl font-bold text-[#082653] mb-2">{s.title}</h3>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed mb-6">
                  {s.desc}
                </p>
              </div>

              <Link
                to={s.link}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0755D9] group-hover:text-[#00AAFF] transition-colors"
              >
                <span>{s.action}</span>
                <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* 5. Featured Health Packages                                                */
/* -------------------------------------------------------------------------- */
export const FeaturedPackagesSection: React.FC = () => {
  const { packages } = useHealthcare();
  const featured = packages.slice(0, 3);

  return (
    <section className="py-20 bg-[#F2F8FF] relative border-t border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0755D9] block mb-2">
              Preventive Diagnostics
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#082653]">
              Featured Health Packages
            </h2>
            <p className="mt-2 text-sm text-[#64748B] max-w-xl">
              Annual wellness screens and targeted metabolic checkups designed to detect early indicators before symptoms surface.
            </p>
          </div>

          <Link
            to="/services/packages"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#0755D9] hover:text-[#00AAFF] transition-colors"
          >
            <span>Compare all packages</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((pkg) => (
            <div
              key={pkg.id}
              className="rounded-3xl bg-white border border-blue-100 p-7 flex flex-col justify-between hover:border-[#0755D9]/40 hover:shadow-[0_12px_35px_rgba(7,85,217,0.1)] transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold text-[#0755D9] uppercase tracking-wider">
                    {pkg.category} Panel
                  </span>
                  {pkg.badge && (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E8FAF5] text-[#19C99A] border border-emerald-200">
                      {pkg.badge}
                    </span>
                  )}
                </div>

                <h3 className="font-display text-xl font-bold text-[#082653] mb-2 group-hover:text-[#0755D9] transition-colors">
                  {pkg.name}
                </h3>
                <p className="text-xs text-[#64748B] mb-4">{pkg.tagline}</p>

                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-2xl font-bold text-[#082653]">NPR {pkg.price}</span>
                  {pkg.originalPrice && (
                    <span className="text-xs line-through text-slate-400">
                      NPR {pkg.originalPrice}
                    </span>
                  )}
                  <span className="text-xs text-[#19C99A] font-semibold ml-auto">
                    {pkg.testCount} Tests Included
                  </span>
                </div>

                <div className="space-y-2 mb-6 border-t border-slate-100 pt-4">
                  {pkg.includedTests.slice(0, 4).map((t) => (
                    <div key={t} className="flex items-center gap-2 text-xs text-[#64748B]">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#19C99A] shrink-0" />
                      <span className="truncate">{t}</span>
                    </div>
                  ))}
                  {pkg.includedTests.length > 4 && (
                    <div className="text-[11px] text-[#0755D9] font-medium pl-5">
                      + {pkg.includedTests.length - 4} more specialized tests
                    </div>
                  )}
                </div>
              </div>

              <Link
                to="/book"
                className="w-full py-2.5 rounded-full bg-[#0755D9] text-white text-xs font-bold text-center block hover:bg-[#00AAFF] transition-colors shadow-sm"
              >
                Book Package
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* 6. Why Two Brothers Healthcare (4 Trust Pillars)                           */
/* -------------------------------------------------------------------------- */
export const TrustPillarsSection: React.FC = () => {
  const pillars = [
    {
      icon: UserCheck,
      title: 'Qualified & Verified Team',
      desc: 'All doctors are registered with the Nepal Medical Council (NMC), and pharmacists are licensed under the Nepal Pharmacy Council.',
    },
    {
      icon: Building2,
      title: 'Modern Sanitary Facility',
      desc: 'Fully air-conditioned clinic with temperature-regulated cold storage for biological medicines, vaccines, and sterile sampling.',
    },
    {
      icon: Receipt,
      title: '100% Transparent Pricing',
      desc: 'No hidden laboratory charges or inflated medicine prices. Clear bills issued for all consultations, tests, and pharmacy sales.',
    },
    {
      icon: Truck,
      title: 'Doorstep Delivery Network',
      desc: 'Reliable medicine courier across Sanagau, Imadol, Gwarko, Mahalaxmi Municipality, and greater Lalitpur / Kathmandu.',
    },
  ];

  return (
    <section className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0755D9] block mb-2">
            Why Patients Choose Us
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#082653]">
            Built on Medical Integrity & Community Trust
          </h2>
          <p className="mt-3 text-sm text-[#64748B]">
            Healthcare is personal. Here are the core values guiding every interaction at Two Brothers Healthcare.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="rounded-3xl bg-[#F2F8FF] border border-blue-100 p-6 flex flex-col justify-between hover:border-[#0755D9]/40 hover:shadow-[0_8px_25px_rgba(7,85,217,0.06)] transition-all"
              >
                <div>
                  <div className="h-12 w-12 rounded-xl bg-white border border-blue-200 text-[#0755D9] flex items-center justify-center mb-5 shadow-sm">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-base font-bold text-[#082653] mb-2">{p.title}</h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">{p.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* 7. Doctor / Provider Spotlight (Verified Faculty)                          */
/* -------------------------------------------------------------------------- */
export const ProviderSpotlightSection: React.FC = () => {
  const { providers } = useHealthcare();

  return (
    <section className="py-20 bg-[#F2F8FF] relative border-t border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0755D9] block mb-2">
              Verified Medical Faculty
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#082653]">
              Doctor & Specialist Spotlight
            </h2>
            <p className="mt-2 text-sm text-[#64748B] max-w-xl">
              Meet our resident and visiting clinical specialists dedicated to personalized, evidence-based care in Sanagau.
            </p>
          </div>

          <Link
            to="/services/consultation"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#0755D9] hover:text-[#00AAFF] transition-colors"
          >
            <span>View all doctors</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {providers.map((doc) => (
            <div
              key={doc.id}
              className="rounded-3xl bg-white border border-blue-100 overflow-hidden flex flex-col justify-between hover:border-[#0755D9]/40 transition-all hover:shadow-[0_12px_35px_rgba(7,85,217,0.1)] group"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={doc.photoUrl}
                    alt={doc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-[#19C99A] border border-emerald-200 shadow-sm flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    <span>{doc.registrationNumber}</span>
                  </div>
                </div>

                <div className="p-5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0755D9] block mb-1">
                    {doc.department}
                  </span>
                  <h3 className="font-display text-base font-bold text-[#082653] group-hover:text-[#0755D9] transition-colors">
                    {doc.name}
                  </h3>
                  <div className="text-xs text-[#64748B] mb-2">{doc.title}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-1 mb-3">
                    {doc.qualifications}
                  </div>

                  <div className="flex items-center gap-1 text-xs text-amber-500 mb-3">
                    <Star className="h-3.5 w-3.5 fill-current text-amber-400" />
                    <span className="font-bold text-[#082653]">{doc.rating}</span>
                    <span className="text-slate-400 text-[11px]">({doc.reviewCount} reviews)</span>
                  </div>

                  <div className="text-[11px] text-[#64748B] flex items-center justify-between pt-3 border-t border-slate-100">
                    <span>Fee: <strong className="text-[#082653]">NPR {doc.consultationFee}</strong></span>
                    <span className="text-[#19C99A] font-semibold">Available</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Link
                  to="/book"
                  className="w-full py-2 rounded-full border border-[#0755D9] text-[#0755D9] hover:bg-[#0755D9] hover:text-white text-xs font-bold text-center block transition-colors"
                >
                  Book Consultation
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* 8. Patient Testimonials                                                    */
/* -------------------------------------------------------------------------- */
export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Binod Shakya',
      location: 'Sanagau, Lalitpur',
      service: 'Senior Health Package',
      comment:
        'Took my mother for the senior vitality checkup. The staff were exceptionally courteous and gentle with her blood sampling. Received digital reports on my phone the very same evening.',
      rating: 5,
    },
    {
      name: 'Pratima Shrestha',
      location: 'Mahalaxmi-4, Lalitpur',
      service: 'Pharmacy Home Delivery',
      comment:
        'Uploaded my father’s monthly blood pressure and diabetes prescription. The pharmacist called within 15 minutes to verify dosages, and medicines were delivered to our gate safely.',
      rating: 5,
    },
    {
      name: 'Rohan Adhikari',
      location: 'Gwarko, Lalitpur',
      service: 'General Physician Consultation',
      comment:
        'Dr. Suresh was patient and thorough in diagnosing my respiratory allergies. No unnecessary tests recommended. Two Brothers Healthcare is a true blessing for our locality.',
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0755D9] block mb-2">
            Community Voices
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#082653]">
            Trusted by Families Across Lalitpur
          </h2>
          <p className="mt-3 text-sm text-[#64748B]">
            Read verified experiences from patients who visited our Sanagau clinic or received home medicine delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-3xl bg-[#F2F8FF] border border-blue-100 p-7 flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(7,85,217,0.06)] transition-all"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#64748B] italic leading-relaxed mb-6">
                  "{t.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-blue-200/50">
                <div className="font-bold text-[#082653] text-sm">{t.name}</div>
                <div className="text-[11px] text-[#0755D9]">{t.location} · {t.service}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* 9. Health Tips Preview (3 Latest Articles)                                 */
/* -------------------------------------------------------------------------- */
export const HealthTipsPreviewSection: React.FC = () => {
  const { articles } = useHealthcare();
  const latestArticles = articles.slice(0, 3);

  return (
    <section className="py-20 bg-[#F2F8FF] relative border-t border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0755D9] block mb-2">
              Preventive Education
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#082653]">
              Latest Health Insights & Advice
            </h2>
            <p className="mt-2 text-sm text-[#64748B] max-w-xl">
              Doctor-reviewed wellness articles addressing everyday health challenges in the Kathmandu Valley.
            </p>
          </div>

          <Link
            to="/health-tips"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#0755D9] hover:text-[#00AAFF] transition-colors"
          >
            <span>View all articles</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestArticles.map((art) => (
            <Link
              key={art.id}
              to="/health-tips/$slug"
              params={{ slug: art.slug }}
              className="rounded-3xl bg-white border border-blue-100 overflow-hidden flex flex-col justify-between hover:border-[#0755D9]/40 transition-all hover:shadow-[0_12px_35px_rgba(7,85,217,0.1)] group"
            >
              <div>
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={art.coverImageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-[#0755D9] border border-blue-200 shadow-sm">
                    {art.category}
                  </span>
                </div>

                <div className="p-6">
                  <div className="text-[11px] text-slate-400 mb-2 flex items-center gap-2">
                    <span>{art.publishedDate}</span>
                    <span>•</span>
                    <span>{art.readTimeMinutes} min read</span>
                  </div>
                  <h3 className="font-display text-base font-bold text-[#082653] mb-2 group-hover:text-[#0755D9] transition-colors leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 text-[11px] text-[#0755D9] font-medium flex items-center justify-between border-t border-slate-100">
                <span>By {art.authorName}</span>
                <span className="text-[#0755D9] group-hover:underline">Read article →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/* 10. Location & Operating Hours                                             */
/* -------------------------------------------------------------------------- */
export const LocationHoursSection: React.FC = () => {
  return (
    <section id="location" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Details */}
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0755D9] block mb-2">
              Sanagau, Lalitpur
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#082653] mb-6">
              Visit Our Clinic & Pharmacy
            </h2>
            <p className="text-sm text-[#64748B] leading-relaxed mb-8">
              Conveniently located on the main road in Sanagau (Mahalaxmi-4, Lalitpur). Dedicated parking, ground-floor accessibility for elderly patients, and a welcoming waiting lounge.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#F2F8FF] border border-blue-100">
                <MapPin className="h-5 w-5 text-[#0755D9] shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <span className="font-bold text-[#082653] block">Physical Location:</span>
                  <span className="text-[#64748B]">
                    Ward No. 4, Sanagau (Near Shiva Temple / Main Chowk), Mahalaxmi Municipality, Lalitpur, Nepal
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#F2F8FF] border border-blue-100">
                <Clock className="h-5 w-5 text-[#19C99A] shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <span className="font-bold text-[#082653] block">Operating Hours:</span>
                  <div className="text-[#64748B]">
                    <div>• <strong>Pharmacy & Emergency Medicine:</strong> 24 Hours / 7 Days a Week</div>
                    <div>• <strong>Doctor OPD & Diagnostics:</strong> 7:00 AM – 8:00 PM (Daily)</div>
                    <div>• <strong>Sample Collection & Home Visits:</strong> 6:30 AM – 11:30 AM</div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#F2F8FF] border border-blue-100">
                <PhoneCall className="h-5 w-5 text-[#0755D9] shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <span className="font-bold text-[#082653] block">Contact Numbers:</span>
                  <div className="text-[#64748B] flex flex-wrap gap-4 mt-1">
                    <a href="tel:015582910" className="text-[#0755D9] font-bold hover:underline">
                      01-5582910 (Front Desk)
                    </a>
                    <a href="tel:9801234567" className="text-[#19C99A] font-bold hover:underline">
                      9801234567 (Emergency & Pharmacy)
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/book"
                className="px-6 py-3 rounded-full bg-[#0755D9] text-white text-xs font-bold shadow-md hover:bg-[#00AAFF] transition-all"
              >
                Schedule an Appointment
              </Link>
              <a
                href="https://maps.google.com/?q=Sanagau+Lalitpur+Nepal"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-full bg-[#F2F8FF] hover:bg-blue-100 text-[#0755D9] text-xs font-bold transition-all border border-blue-200 inline-flex items-center gap-1.5"
              >
                <span>Get Driving Directions</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Right Map View */}
          <div className="rounded-3xl overflow-hidden border border-blue-100 shadow-xl h-[420px] bg-slate-100 relative">
            <iframe
              title="Two Brothers Healthcare Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14136.257041760467!2d85.34291885!3d27.6534572!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb175be62cb473%3A0x8aa863c8b417c8cf!2sSanagaun%2C%20Lalitpur!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-blue-100 shadow-md text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#0755D9]" />
                <span className="font-semibold text-[#082653]">Two Brothers Healthcare Pvt. Ltd.</span>
              </div>
              <span className="text-[#19C99A] text-[11px] font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Open 24/7
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
