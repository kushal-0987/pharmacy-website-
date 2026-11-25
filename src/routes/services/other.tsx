import { createFileRoute, Link } from '@tanstack/react-router';
import { PublicLayout } from '@/components/common/PublicLayout';
import {
  Layers,
  HeartPulse,
  Syringe,
  Activity,
  Wind,
  CheckCircle2,
  PhoneCall,
  Calendar,
  Clock,
} from 'lucide-react';

export const Route = createFileRoute('/services/other')({
  head: () => ({
    meta: [
      { title: 'Nursing, Injections & Clinical Procedures — Two Brothers Healthcare' },
      {
        name: 'description',
        content:
          'Sterile dressing, intravenous/intramuscular injections, nebulization, vitals mapping, and home nursing care in Sanagau, Lalitpur.',
      },
    ],
  }),
  component: OtherServicesPage,
});

function OtherServicesPage() {
  const ancillaryServices = [
    {
      title: 'Sterile Wound Dressing & Suture Care',
      icon: Activity,
      desc: 'Antiseptic surgical wound cleaning, post-operative dressing changes, diabetic foot care, and sterile suture/staple removal.',
      prep: 'Bring discharge summary or physician instructions if post-operative.',
      eligibility: 'All age groups with acute or healing wounds.',
      fee: 'NPR 250 – 500 (Depending on dressing complexity)',
      turnaround: '15 – 30 Minutes',
    },
    {
      title: 'Prescribed Injections (IM / IV / SC)',
      icon: Syringe,
      desc: 'Safe administration of physician-prescribed antibiotics, painkillers, vitamins, and insulin by certified nursing staff.',
      prep: 'Doctor prescription and medication vial/ampoule must be brought.',
      eligibility: 'Must possess a valid, signed doctor prescription.',
      fee: 'NPR 100 (IM/SC) / NPR 250 (IV Infusion)',
      turnaround: '10 – 45 Minutes',
    },
    {
      title: 'Nebulization & Respiratory Therapy',
      icon: Wind,
      desc: 'Rapid relief for bronchial asthma, acute bronchitis, and seasonal wheezing using calibrated medical nebulizers and oxygen support.',
      prep: 'Bring prescribed bronchodilator respules or obtain from our pharmacy.',
      eligibility: 'Pediatric and adult patients with respiratory distress.',
      fee: 'NPR 200 per session',
      turnaround: '20 Minutes',
    },
    {
      title: 'Comprehensive Vitals & Cardiac Rhythm Check',
      icon: HeartPulse,
      desc: 'Accurate multi-parameter vitals recording: Blood Pressure (Digital & Manual Sphygmomanometer), Pulse, SPO2, Blood Glucose, and 12-lead ECG.',
      prep: 'Rest seated 10 minutes prior to vitals capture.',
      eligibility: 'Open to all walk-in patients and monitoring checkups.',
      fee: 'Free BP/Pulse check · ECG NPR 500',
      turnaround: '10 – 15 Minutes',
    },
  ];

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-navy to-navy-deep border-b border-on-dark/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan block mb-3">
              Ancillary Clinical Care
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight leading-[1.1] mb-4">
              Nursing, Minor Procedures & Clinical Care.
            </h1>
            <p className="text-sm sm:text-base text-on-dark-muted leading-relaxed">
              Sterile treatment facilities in Sanagau for day-to-day healthcare necessities. Certified nursing staff ready for prompt dressings, vaccinations, injections, and vitals assessment.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-navy-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ancillaryServices.map((srv) => {
              const Icon = srv.icon;
              return (
                <div
                  key={srv.title}
                  className="rounded-3xl bg-midnight/40 border border-on-dark/15 p-8 flex flex-col justify-between hover:border-cyan/40 transition-all hover:shadow-2xl"
                >
                  <div className="space-y-4">
                    <div className="h-12 w-12 rounded-2xl bg-teal/20 text-cyan flex items-center justify-center">
                      <Icon className="h-6 w-6" />
                    </div>

                    <h2 className="font-display text-xl font-bold text-white">{srv.title}</h2>
                    <p className="text-xs sm:text-sm text-on-dark-muted leading-relaxed">
                      {srv.desc}
                    </p>

                    <div className="space-y-2 pt-2 border-t border-on-dark/10 text-xs">
                      <div className="text-on-dark-muted">
                        <strong className="text-teal">Preparation:</strong> {srv.prep}
                      </div>
                      <div className="text-on-dark-muted">
                        <strong className="text-teal">Eligibility:</strong> {srv.eligibility}
                      </div>
                      <div className="text-on-dark-muted">
                        <strong className="text-teal">Duration:</strong> {srv.turnaround}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-on-dark/10 flex items-center justify-between flex-wrap gap-4 mt-6">
                    <div>
                      <span className="text-[11px] text-on-dark-muted block">Estimated Fee:</span>
                      <span className="text-sm font-bold text-cyan">{srv.fee}</span>
                    </div>

                    <Link
                      to="/book"
                      className="px-6 py-2.5 rounded-full bg-cyan text-navy-deep font-bold text-xs uppercase tracking-wider hover:scale-105 transition-all shadow-md"
                    >
                      Request Procedure
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Walk-in notice */}
      <section className="py-12 bg-navy border-t border-on-dark/10 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="font-display text-xl font-bold text-white mb-2">
            Walk-in Nursing Procedures Welcome
          </h3>
          <p className="text-xs sm:text-sm text-on-dark-muted max-w-xl mx-auto mb-6">
            For routine blood pressure checks, dressing changes, or urgent nebulization, you may visit our Sanagau clinic anytime between 7:00 AM and 8:00 PM without prior appointment.
          </p>
          <a
            href="tel:015582910"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-on-dark/10 border border-on-dark/20 text-white font-bold text-xs hover:bg-white/10 transition-colors"
          >
            <PhoneCall className="h-4 w-4 text-cyan" />
            <span>Call Nursing Desk: 01-5582910</span>
          </a>
        </div>
      </section>
    </PublicLayout>
  );
}
