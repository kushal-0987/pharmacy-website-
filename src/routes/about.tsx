import { createFileRoute, Link } from '@tanstack/react-router';
import { PublicLayout } from '@/components/common/PublicLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import {
  ShieldCheck,
  Award,
  HeartHandshake,
  Users,
  Building,
  Target,
  Sparkles,
  MapPin,
  Calendar,
  CheckCircle,
} from 'lucide-react';

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      { title: 'About Us — Two Brothers Healthcare Pvt. Ltd. | Sanagau, Lalitpur' },
      {
        name: 'description',
        content:
          'Learn about Two Brothers Healthcare in Sanagau, Lalitpur. Verified medical team, licensed pharmacy, modern laboratory diagnostics and community values.',
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { providers } = useHealthcare();

  const milestones = [
    {
      year: '2080 B.S. (2023)',
      title: 'Foundation in Sanagau',
      desc: 'Established with the mission to bring trustworthy, 24/7 pharmaceutical services and essential medical care to the growing neighborhood of Mahalaxmi Municipality.',
    },
    {
      year: '2081 B.S. (2024)',
      title: 'Laboratory & Specialty OPD Expansion',
      desc: 'Upgraded facility with fully automated biochemistry analyzers, 12-lead ECG diagnostics, and weekly visiting consultant physicians.',
    },
    {
      year: '2082 B.S. (2025)',
      title: 'Home Medicine Delivery Network',
      desc: 'Launched temperature-maintained doorstep delivery for chronic medication across Lalitpur and Kathmandu with online prescription verification.',
    },
    {
      year: '2083 B.S. (2026)',
      title: 'Integrated Digital Health Platform',
      desc: 'Unveiled patient health portals, digital lab reports with trend lines, and multi-role clinical management systems.',
    },
  ];

  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      desc: 'To deliver compassionate, evidence-based, and easily accessible primary healthcare and genuine pharmaceuticals to every family in Sanagau and surrounding districts.',
    },
    {
      icon: Sparkles,
      title: 'Our Vision',
      desc: 'To become the gold standard of community health in Nepal by bridging the gap between local clinical warmth and rigorous medical standards.',
    },
    {
      icon: HeartHandshake,
      title: 'Core Values',
      desc: 'Uncompromising integrity, transparency in pricing, empathetic patient communication, continuous professional education, and zero tolerance for spurious drugs.',
    },
  ];

  const galleryImages = [
    {
      url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600',
      caption: 'Clean, sanitized consultation suites',
    },
    {
      url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=600',
      caption: 'Temperature-monitored pharmaceutical storage',
    },
    {
      url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=600',
      caption: 'High-precision diagnostic biochemistry equipment',
    },
    {
      url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=600',
      caption: 'Dedicated patient phlebotomy station',
    },
    {
      url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600',
      caption: 'Emergency dressing & minor procedure suite',
    },
    {
      url: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80&w=600',
      caption: 'Welcoming reception and waiting lounge',
    },
  ];

  const licenses = [
    {
      authority: 'Nepal Pharmacy Council (NPC)',
      id: 'Reg. #TBH-9923',
      desc: 'Licensed Retail & Dispensing Community Pharmacy',
    },
    {
      authority: 'Department of Drug Administration (DDA)',
      id: 'License #DDA-LAL-4402',
      desc: 'Approved Pharmaceutical Distribution & Storage Standards',
    },
    {
      authority: 'Ministry of Health & Population (MoHP)',
      id: 'Clinic Reg. #MOH-2080-891',
      desc: 'Registered Outpatient Polyclinic & Diagnostic Center',
    },
    {
      authority: 'National Public Health Laboratory (NPHL)',
      id: 'Cat. C Diagnostic Lab Reg.',
      desc: 'Accredited Routine Blood, Urine & Biochemistry Testing',
    },
  ];

  return (
    <PublicLayout>
      {/* 1. Hero with Mission Statement */}
      <section className="relative py-20 bg-gradient-to-b from-navy to-navy-deep border-b border-on-dark/15 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-white p-2 ring-4 ring-cyan/30 shadow-2xl shrink-0">
              <img src="/logo.png" alt="Two Brothers Healthcare logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan block mb-1">
                Established Community Healthcare
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white leading-tight">
                Two Brothers Healthcare Pvt. Ltd.
              </h2>
              <span className="text-xs text-teal font-medium">Sanagau, Mahalaxmi-4, Lalitpur, Nepal</span>
            </div>
          </div>

          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan block mb-3">
              About Our Facility & Mission
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.08] mb-6">
              Compassionate Care Rooted in Our Community.
            </h1>
            <p className="text-base sm:text-lg text-on-dark-muted leading-relaxed mb-8">
              Founded on the belief that premium, certified healthcare shouldn't require long travel into congested city centers. We bring verified physicians, accredited lab testing, and authentic 24/7 pharmaceuticals right to Sanagau, Lalitpur.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-white">
              <div className="flex items-center gap-2 bg-midnight/70 border border-teal/40 rounded-full px-4 py-2">
                <ShieldCheck className="h-4 w-4 text-leaf" />
                <span>Government Registered & Certified</span>
              </div>
              <div className="flex items-center gap-2 bg-midnight/70 border border-cyan/40 rounded-full px-4 py-2">
                <Users className="h-4 w-4 text-cyan" />
                <span>NMC Certified Medical Practitioners</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Our Story & Milestones Timeline */}
      <section className="py-20 bg-navy-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-teal block mb-2">
                Our Genesis & Growth
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-6">
                From a Neighborhood Chemist to a Multi-Specialty Health Hub
              </h2>
              <div className="space-y-4 text-sm text-on-dark-muted leading-relaxed">
                <p>
                  Two Brothers Healthcare was established by medical and pharmaceutical professionals from Sanagau who observed firsthand the challenges local families faced when seeking reliable medicine at night or trustworthy laboratory diagnoses.
                </p>
                <p>
                  Starting with a humble community pharmacy committed to 100% genuine sourcing directly from certified manufacturers, we quickly realized our neighbors needed more: timely outpatient consultations with senior doctors who listen, and blood testing done with strict quality controls.
                </p>
                <p>
                  Today, we are honored to serve thousands of residents across Mahalaxmi Municipality, Gwarko, Imadol, and Greater Lalitpur with warmth, precision, and state-of-the-art medical equipment.
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-6 relative border-l border-teal/30 pl-6 ml-2 sm:ml-4">
              {milestones.map((m, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full bg-cyan ring-4 ring-navy-deep group-hover:scale-125 transition-transform" />
                  <span className="text-xs font-bold text-teal block mb-1">{m.year}</span>
                  <h3 className="text-base font-bold text-white mb-1">{m.title}</h3>
                  <p className="text-xs sm:text-sm text-on-dark-muted leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mission, Vision, Values (3 Cards) */}
      <section className="py-20 bg-navy border-t border-on-dark/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="rounded-3xl bg-midnight/50 border border-on-dark/15 p-8 flex flex-col justify-between hover:border-cyan/40 transition-all hover:shadow-xl"
                >
                  <div>
                    <div className="h-12 w-12 rounded-2xl bg-teal/20 text-cyan flex items-center justify-center mb-6">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-white mb-3">{v.title}</h3>
                    <p className="text-xs sm:text-sm text-on-dark-muted leading-relaxed">
                      {v.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Leadership & Licensed Professionals */}
      <section className="py-20 bg-navy-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-teal block mb-2">
              Verified Medical Board
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
              Leadership & Clinical Practitioners
            </h2>
            <p className="mt-3 text-sm text-on-dark-muted">
              Every doctor and pharmacist at Two Brothers Healthcare is verified with official regulatory numbers displayed transparently.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {providers.map((doc) => (
              <div
                key={doc.id}
                className="rounded-3xl bg-midnight/40 border border-on-dark/15 overflow-hidden flex flex-col justify-between hover:border-teal/50 transition-all"
              >
                <div>
                  <div className="h-52 w-full overflow-hidden bg-navy">
                    <img
                      src={doc.photoUrl}
                      alt={doc.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-leaf bg-leaf/10 border border-leaf/20 px-2.5 py-0.5 rounded-full mb-2">
                      <ShieldCheck className="h-3 w-3" />
                      <span>{doc.registrationNumber}</span>
                    </div>
                    <h3 className="font-display text-base font-bold text-white">{doc.name}</h3>
                    <div className="text-xs text-teal font-medium mb-1">{doc.title}</div>
                    <div className="text-[11px] text-on-dark-muted leading-tight mb-3">
                      {doc.qualifications}
                    </div>
                    <div className="text-[11px] text-on-dark-muted/80">
                      <strong>Experience:</strong> {doc.experienceYears}+ Years
                    </div>
                    <div className="text-[11px] text-on-dark-muted/80">
                      <strong>Languages:</strong> {doc.languages.join(', ')}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    to="/book"
                    className="w-full py-2 rounded-full border border-cyan/40 hover:bg-cyan hover:text-navy-deep text-cyan text-xs font-bold text-center block transition-colors"
                  >
                    Book with {doc.name.split(' ')[1]}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Facility Tour Photo Gallery */}
      <section className="py-20 bg-navy border-t border-on-dark/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan block mb-2">
              Sanagau Facility Tour
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
              Modern, Hygienic Clinical Environment
            </h2>
            <p className="mt-3 text-sm text-on-dark-muted">
              Designed for clinical excellence, patient privacy, and wheelchair-accessible comfort.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((img, i) => (
              <div
                key={i}
                className="group relative rounded-3xl overflow-hidden border border-on-dark/15 h-64 bg-navy-deep shadow-lg"
              >
                <img
                  src={img.url}
                  alt={img.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-xs font-semibold text-white drop-shadow-md">{img.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Accreditations & Licenses */}
      <section className="py-20 bg-navy-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-teal block mb-2">
              Regulatory Transparency
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
              Official Licenses & Registrations
            </h2>
            <p className="mt-3 text-sm text-on-dark-muted">
              We operate strictly within national healthcare statutes and pharmacy guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {licenses.map((lic) => (
              <div
                key={lic.id}
                className="rounded-3xl bg-midnight/40 border border-teal/20 p-6 flex flex-col justify-between"
              >
                <div>
                  <Award className="h-7 w-7 text-cyan mb-4" />
                  <h3 className="font-bold text-white text-sm mb-1">{lic.authority}</h3>
                  <div className="text-xs font-semibold text-teal mb-3">{lic.id}</div>
                  <p className="text-xs text-on-dark-muted leading-relaxed">{lic.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-on-dark/10 flex items-center gap-1.5 text-[11px] text-leaf font-semibold">
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>Active & Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Community Involvement & Health Camps */}
      <section className="py-20 bg-navy border-t border-on-dark/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan block mb-2">
                Social Responsibility
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-6">
                Giving Back Through Free Community Health Camps
              </h2>
              <div className="space-y-4 text-sm text-on-dark-muted leading-relaxed">
                <p>
                  At Two Brothers Healthcare, social responsibility is woven into our identity. We regularly partner with local youth clubs, schools, and ward committees across Mahalaxmi Municipality to conduct complimentary diabetes screenings, pediatric nutrition camps, and blood pressure awareness drives.
                </p>
                <p>
                  Over the past year alone, our medical staff provided free health screenings to over 1,200 local residents and distributed free basic multivitamins and rehydration supplies to elderly pensioners.
                </p>
              </div>
            </div>

            <div className="rounded-3xl bg-midnight/60 border border-on-dark/15 p-8 space-y-6">
              <h3 className="font-display text-xl font-bold text-white">Upcoming Community Initiatives</h3>
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-navy-deep border border-on-dark/10">
                  <span className="text-cyan font-bold block mb-1">First Saturday of Every Month</span>
                  <h4 className="text-sm font-semibold text-white">Free Senior Citizen Sugar & Vitals Check</h4>
                  <p className="text-on-dark-muted mt-1">Sanagau Clinic ground floor between 7:00 AM - 10:00 AM.</p>
                </div>
                <div className="p-4 rounded-2xl bg-navy-deep border border-on-dark/10">
                  <span className="text-teal font-bold block mb-1">Quarterly Youth & School Outreach</span>
                  <h4 className="text-sm font-semibold text-white">Adolescent Hygiene & First-Aid Workshops</h4>
                  <p className="text-on-dark-muted mt-1">Hands-on basic CPR and hygiene sessions in local community schools.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CTA — Visit Us */}
      <section className="py-16 bg-gradient-to-r from-teal/20 via-navy-deep to-cyan/20 border-t border-on-dark/15 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            Experience Genuine Care Close to Home
          </h2>
          <p className="text-sm sm:text-base text-on-dark-muted mb-8 max-w-2xl mx-auto">
            Whether you need a quick prescription filled, regular health monitoring, or specialist medical consultation, we are ready to welcome you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/book"
              className="px-8 py-3.5 rounded-full bg-cyan text-navy-deep font-bold text-sm shadow-xl hover:shadow-cyan/20 hover:scale-105 transition-all"
            >
              Book an Appointment
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3.5 rounded-full bg-on-dark/10 border border-on-dark/20 text-white font-bold text-sm hover:bg-white/10 transition-all"
            >
              Get Location & Directions
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
