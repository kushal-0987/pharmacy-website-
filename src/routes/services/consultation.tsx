import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { PublicLayout } from '@/components/common/PublicLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import {
  Stethoscope,
  ShieldCheck,
  Star,
  Clock,
  Calendar,
  Globe,
  Filter,
  CheckCircle2,
  FileText,
  CreditCard,
  Video,
} from 'lucide-react';

export const Route = createFileRoute('/services/consultation')({
  head: () => ({
    meta: [
      { title: 'Doctor & Specialist Consultation — Two Brothers Healthcare | Lalitpur' },
      {
        name: 'description',
        content:
          'Consult verified senior physicians, pediatricians, gynecologists, and cardiologists in Sanagau, Lalitpur. Attentive outpatient appointments with NMC-registered faculty.',
      },
    ],
  }),
  component: DoctorConsultationPage,
});

function DoctorConsultationPage() {
  const { providers } = useHealthcare();

  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

  const specialties = [
    'General & Internal Medicine',
    'Obstetrics & Gynecology',
    'Pediatrics & Child Care',
    'Cardiology',
  ];

  const filteredDoctors = useMemo(() => {
    return providers.filter((doc) => {
      const matchSpec =
        selectedSpecialty === 'all' || doc.department.toLowerCase().includes(selectedSpecialty.toLowerCase());
      const matchLang =
        selectedLanguage === 'all' || doc.languages.some((l) => l.toLowerCase() === selectedLanguage.toLowerCase());
      return matchSpec && matchLang;
    });
  }, [providers, selectedSpecialty, selectedLanguage]);

  return (
    <PublicLayout>
      {/* 1. Hero */}
      <section className="py-16 bg-gradient-to-b from-navy to-navy-deep border-b border-on-dark/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan block mb-3">
              Outpatient Department (OPD)
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight leading-[1.1] mb-4">
              Experienced Doctors Who Truly Listen.
            </h1>
            <p className="text-sm sm:text-base text-on-dark-muted leading-relaxed">
              At Two Brothers Healthcare, outpatient visits are unhurried. Our NMC-certified consultants take the time to examine thoroughly, review past medical reports, and co-create an evidence-based care plan for you and your loved ones.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Filter Bar */}
      <section className="py-8 bg-navy border-b border-on-dark/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-white">
            <Filter className="h-4 w-4 text-cyan" />
            <span className="font-bold">Filter By Specialty:</span>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-navy-deep border border-on-dark/20 text-white text-xs focus:outline-none"
            >
              <option value="all">All Specialties ({providers.length})</option>
              {specialties.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs text-white">
            <Globe className="h-4 w-4 text-teal" />
            <span className="font-bold">Language Spoken:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-navy-deep border border-on-dark/20 text-white text-xs focus:outline-none"
            >
              <option value="all">All Languages</option>
              <option value="nepali">Nepali</option>
              <option value="newari">Newari</option>
              <option value="english">English</option>
            </select>
          </div>
        </div>
      </section>

      {/* 3. Provider List */}
      <section className="py-16 bg-navy-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="rounded-3xl bg-midnight/50 border border-on-dark/15 p-6 sm:p-8 flex flex-col justify-between hover:border-cyan/40 transition-all hover:shadow-2xl group"
              >
                <div>
                  <div className="flex items-start gap-5">
                    <img
                      src={doc.photoUrl}
                      alt={doc.name}
                      className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl object-cover shrink-0 border border-on-dark/20 group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-1 mb-1">
                        <span className="text-[10px] font-bold text-teal uppercase tracking-wider">
                          {doc.department}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] text-leaf font-semibold bg-leaf/10 border border-leaf/20 px-2 py-0.5 rounded-full">
                          <ShieldCheck className="h-3 w-3" />
                          <span>{doc.registrationNumber}</span>
                        </span>
                      </div>

                      <h3 className="font-display text-lg sm:text-xl font-bold text-white group-hover:text-cyan transition-colors">
                        {doc.name}
                      </h3>
                      <div className="text-xs text-on-dark-muted font-medium mb-1">{doc.title}</div>
                      <div className="text-[11px] text-on-dark-muted/80 mb-2">{doc.qualifications}</div>

                      <div className="flex items-center gap-1 text-xs text-warm-gold">
                        <Star className="h-3.5 w-3.5 fill-current text-warm-gold" />
                        <span className="font-bold text-white">{doc.rating}</span>
                        <span className="text-[11px] text-on-dark-muted">({doc.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-on-dark/10 space-y-2 text-xs">
                    <div className="text-on-dark-muted">
                      <strong>Clinical Focus:</strong> {doc.specialties.join(', ')}
                    </div>
                    <div className="text-on-dark-muted">
                      <strong>Experience:</strong> {doc.experienceYears} Years · <strong>Languages:</strong> {doc.languages.join(', ')}
                    </div>
                    <div className="text-on-dark-muted">
                      <strong>Available Days:</strong> {doc.availableDays.join(', ')}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-on-dark/10 flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <span className="text-[11px] text-on-dark-muted block">OPD Fee:</span>
                    <span className="text-lg font-bold text-cyan">NPR {doc.consultationFee}</span>
                  </div>

                  <Link
                    to="/book"
                    className="px-6 py-2.5 rounded-full bg-cyan text-navy-deep font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all"
                  >
                    Book Consultation
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Consultation Types & Pricing */}
      <section className="py-16 bg-navy border-t border-on-dark/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan block mb-2">
              Flexible Clinical Formats
            </span>
            <h2 className="font-display text-3xl font-bold text-white">
              Consultation Formats & Transparency
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl bg-midnight/40 border border-on-dark/15 p-6 space-y-4">
              <Stethoscope className="h-8 w-8 text-cyan" />
              <h3 className="font-bold text-white text-base">In-Person Clinic Visit</h3>
              <p className="text-xs text-on-dark-muted leading-relaxed">
                Full physical examination in our Sanagau suite. Vitals check (BP, Sugar, O2, Weight) included at no extra charge.
              </p>
              <div className="text-sm font-bold text-teal">NPR 650 – 900</div>
            </div>

            <div className="rounded-3xl bg-midnight/40 border border-on-dark/15 p-6 space-y-4">
              <Calendar className="h-8 w-8 text-leaf" />
              <h3 className="font-bold text-white text-base">7-Day Free Follow-Up</h3>
              <p className="text-xs text-on-dark-muted leading-relaxed">
                Review your laboratory test results with the prescribing doctor within 7 days at zero additional consultation fee.
              </p>
              <div className="text-sm font-bold text-leaf">Complimentary (NPR 0)</div>
            </div>

            <div className="rounded-3xl bg-midnight/40 border border-on-dark/15 p-6 space-y-4">
              <Video className="h-8 w-8 text-cyan" />
              <h3 className="font-bold text-white text-base">Secure Teleconsultation</h3>
              <p className="text-xs text-on-dark-muted leading-relaxed">
                Phase 2 rollout: Video follow-up for chronic prescription adjustments and lab reviews from home.
              </p>
              <div className="text-sm font-bold text-cyan">Coming Soon</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. What to Bring */}
      <section className="py-16 bg-navy-deep">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-midnight/60 border border-teal/30 p-8 sm:p-10 space-y-6">
            <h2 className="font-display text-2xl font-bold text-white">
              What to Bring to Your Doctor's Appointment
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-on-dark-muted">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-leaf shrink-0 mt-0.5" />
                <span>
                  <strong>Previous Prescriptions & Discharges:</strong> Bring all medication strips or doctor slips from the past 6 months.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-leaf shrink-0 mt-0.5" />
                <span>
                  <strong>Recent Lab or Imaging Reports:</strong> Blood tests, X-rays, Ultrasounds, or ECG recordings.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-leaf shrink-0 mt-0.5" />
                <span>
                  <strong>Symptom Timeline:</strong> Note down when symptoms began, what triggers them, and any drug allergies.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
