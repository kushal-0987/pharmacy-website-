import { createFileRoute, Link } from '@tanstack/react-router';
import { PublicLayout } from '@/components/common/PublicLayout';
import {
  Pill,
  Stethoscope,
  FlaskConical,
  Package,
  Layers,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  PhoneCall,
  Calendar,
} from 'lucide-react';

export const Route = createFileRoute('/services/')({
  head: () => ({
    meta: [
      { title: 'Healthcare Services Hub — Two Brothers Healthcare | Sanagau, Lalitpur' },
      {
        name: 'description',
        content:
          'Explore comprehensive healthcare services: 24/7 community pharmacy, specialist physician consultations, accredited diagnostic laboratory, wellness packages, and nursing care.',
      },
    ],
  }),
  component: ServicesIndexPage,
});

function ServicesIndexPage() {
  const serviceCards = [
    {
      title: 'Community Pharmacy & Home Delivery',
      slug: '/pharmacy',
      icon: Pill,
      badge: '24/7 Available',
      summary:
        'Sustainably sourced genuine pharmaceuticals, OTC health supplies, pediatric formulations, and temperature-controlled biological storage. Doorstep prescription delivery across Lalitpur and Kathmandu.',
      highlights: ['Licensed dispensing pharmacists', 'Emergency 24/7 dispensary', 'Prescription upload verification', 'Free doorstep delivery options'],
      action: 'Search Medicines & Enquire',
      color: 'from-teal/25 to-teal/5',
      iconColor: 'text-cyan',
    },
    {
      title: 'Doctor & Specialist Consultation',
      slug: '/services/consultation',
      icon: Stethoscope,
      badge: 'NMC Certified',
      summary:
        'Consult seasoned internal medicine consultants, general physicians, pediatricians, gynecologists, and cardiologists. Attentive outpatient slots designed for unhurried clinical attention.',
      highlights: ['Experienced hospital faculty', 'Pediatric & Geriatric care', 'Personalized diet & medication plans', 'Follow-up appointment tracking'],
      action: 'View Doctors & Book',
      color: 'from-cyan/25 to-cyan/5',
      iconColor: 'text-cyan',
    },
    {
      title: 'Diagnostic Laboratory Services',
      slug: '/services/lab',
      icon: FlaskConical,
      badge: 'Accredited Lab',
      summary:
        'High-precision automated testing including Complete Blood Counts, fasting glucose, comprehensive lipid profiles, liver/kidney function tests, and cardiac ECG tracings. Fast digital report delivery.',
      highlights: ['Fully automated analyzers', 'Stringent pre-analytical controls', 'Home blood sample collection', 'Patient portal report archives'],
      action: 'Explore Lab Tests',
      color: 'from-leaf/25 to-leaf/5',
      iconColor: 'text-leaf',
    },
    {
      title: 'Preventive Health Packages',
      slug: '/services/packages',
      icon: Package,
      badge: 'Save up to 35%',
      summary:
        'All-in-one routine health screenings designed for individuals, working executives, senior parents, and diabetic patients. Early biomarker detection with structured physician review.',
      highlights: ['Essential to Executive panels', 'Parent & Senior Care bundles', 'Transparent all-inclusive rates', 'Same-day consultation review'],
      action: 'Compare Packages',
      color: 'from-teal/25 to-teal/5',
      iconColor: 'text-teal',
    },
    {
      title: 'Nursing & Minor Procedures',
      slug: '/services/other',
      icon: Layers,
      badge: 'Walk-ins Welcome',
      summary:
        'Sterile wound dressings, intravenous & intramuscular injections, continuous blood pressure monitoring, oxygen support, nebulization, and home nursing assistance for elderly patients.',
      highlights: ['Sterile treatment room', 'Nebulization & vitals check', 'Tetanus & routine vaccination', 'Post-discharge wound care'],
      action: 'View Nursing Services',
      color: 'from-cyan/25 to-cyan/5',
      iconColor: 'text-cyan',
    },
  ];

  const serviceFaqs = [
    {
      q: 'Do I need an appointment for pharmacy or laboratory testing?',
      a: 'The pharmacy is open 24/7 for immediate walk-ins. Most routine laboratory tests (CBC, urine routine, glucose) accept walk-ins daily from 7:00 AM to 8:00 PM. However, booking an appointment online guarantees priority sampling and zero waiting queue.',
    },
    {
      q: 'Can I get lab sample collection or medicines at my home in Lalitpur?',
      a: 'Yes! We provide home blood sample collection in Sanagau, Imadol, Gwarko, and Mahalaxmi Municipality every morning from 6:30 AM to 11:30 AM. Prescriptions can be submitted via our Pharmacy page for same-day delivery.',
    },
    {
      q: 'Are all medications genuine and properly stored?',
      a: 'Absolutely. Every batch of pharmaceuticals at Two Brothers Healthcare is sourced exclusively from DDA-registered licensed pharmaceutical manufacturers and wholesalers. Temperature-sensitive vaccines and insulins are stored in calibrated medical refrigerators with constant power backup.',
    },
  ];

  return (
    <PublicLayout>
      {/* 1. Header */}
      <section className="relative py-20 bg-gradient-to-b from-navy to-navy-deep border-b border-on-dark/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan block mb-3">
              Two Brothers Healthcare Services
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.08] mb-6">
              Complete Community Healthcare Under One Roof.
            </h1>
            <p className="text-base sm:text-lg text-on-dark-muted leading-relaxed">
              Explore our core clinical areas in Sanagau, Lalitpur. Whether you need immediate medicines, specialist physician guidance, routine blood screenings, or minor nursing care, we provide licensed, transparent medical care.
            </p>
          </div>
        </div>
      </section>

      {/* 2. 5 Large Service Cards in a Grid */}
      <section className="py-20 bg-navy-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {serviceCards.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.slug}
                  className="rounded-3xl bg-midnight/40 border border-on-dark/15 p-8 lg:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 hover:border-cyan/40 transition-all hover:shadow-2xl group"
                >
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 rounded-2xl bg-teal/20 flex items-center justify-center shrink-0">
                        <Icon className={`h-7 w-7 ${service.iconColor}`} />
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold text-teal uppercase tracking-wider block">
                          Service Area {index + 1}
                        </span>
                        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white group-hover:text-cyan transition-colors">
                          {service.title}
                        </h2>
                      </div>
                    </div>

                    <p className="text-sm sm:text-base text-on-dark-muted leading-relaxed max-w-3xl">
                      {service.summary}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                      {service.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-on-dark-muted">
                          <CheckCircle2 className="h-3.5 w-3.5 text-teal shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full sm:w-auto">
                    <Link
                      to={service.slug}
                      className="px-6 py-3 rounded-full bg-cyan text-navy-deep font-bold text-xs text-center hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      <span>{service.action}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <Link
                      to="/book"
                      className="px-6 py-3 rounded-full bg-on-dark/10 hover:bg-white/10 text-white font-semibold text-xs text-center border border-on-dark/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Calendar className="h-3.5 w-3.5 text-cyan" />
                      <span>Book Online</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Decision Helper Block */}
      <section className="py-16 bg-navy border-t border-on-dark/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-teal/20 via-midnight to-cyan/20 border border-teal/40 p-8 sm:p-12">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-cyan/20 text-cyan mb-2">
                <HelpCircle className="h-6 w-6" />
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Not Sure Which Service Matches Your Need?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left pt-2">
                <div className="p-4 rounded-2xl bg-navy-deep/80 border border-on-dark/15">
                  <div className="text-xs font-bold text-cyan mb-1">Have a doctor’s prescription?</div>
                  <p className="text-xs text-on-dark-muted mb-3">
                    Check immediate stock, verify generic alternatives, or request doorstep courier.
                  </p>
                  <Link to="/pharmacy" className="text-xs font-bold text-teal hover:underline flex items-center gap-1">
                    <span>Go to Pharmacy</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                <div className="p-4 rounded-2xl bg-navy-deep/80 border border-on-dark/15">
                  <div className="text-xs font-bold text-leaf mb-1">Need blood or urine tests?</div>
                  <p className="text-xs text-on-dark-muted mb-3">
                    Review fasting preparation guidelines, test turnaround times, and book home collection.
                  </p>
                  <Link to="/services/lab" className="text-xs font-bold text-teal hover:underline flex items-center gap-1">
                    <span>Go to Diagnostic Lab</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                <div className="p-4 rounded-2xl bg-navy-deep/80 border border-on-dark/15">
                  <div className="text-xs font-bold text-cyan mb-1">Feeling unwell or need advice?</div>
                  <p className="text-xs text-on-dark-muted mb-3">
                    Book an in-person consultation with an experienced physician in Sanagau.
                  </p>
                  <Link to="/services/consultation" className="text-xs font-bold text-teal hover:underline flex items-center gap-1">
                    <span>Consult a Doctor</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap justify-center items-center gap-4 text-xs text-on-dark-muted">
                <span>Still have questions? Call our front desk directly:</span>
                <a href="tel:015582910" className="inline-flex items-center gap-1.5 text-cyan font-bold hover:underline">
                  <PhoneCall className="h-3.5 w-3.5" />
                  <span>01-5582910</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Related FAQs */}
      <section className="py-20 bg-navy-deep">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan block mb-2">
              Helpful Information
            </span>
            <h2 className="font-display text-3xl font-bold text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {serviceFaqs.map((faq, i) => (
              <div key={i} className="rounded-2xl bg-midnight/40 border border-on-dark/15 p-6">
                <h3 className="font-bold text-white text-base mb-2">{faq.q}</h3>
                <p className="text-xs sm:text-sm text-on-dark-muted leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/faq" className="text-xs font-bold text-cyan hover:underline">
              View all general healthcare & appointment FAQs →
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
