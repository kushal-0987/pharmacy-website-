import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { PublicLayout } from '@/components/common/PublicLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import {
  FlaskConical,
  Search,
  Clock,
  ShieldCheck,
  Home,
  CheckCircle2,
  FileText,
  AlertCircle,
  ArrowRight,
  Filter,
} from 'lucide-react';

export const Route = createFileRoute('/services/lab')({
  head: () => ({
    meta: [
      { title: 'Diagnostic Laboratory Services — Two Brothers Healthcare | Sanagau, Lalitpur' },
      {
        name: 'description',
        content:
          'High-precision medical laboratory testing in Sanagau, Lalitpur. Automated CBC, lipid, kidney, liver, thyroid panels, and home blood sample collection.',
      },
    ],
  }),
  component: LabServicesPage,
});

function LabServicesPage() {
  const { labTests } = useHealthcare();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['Blood', 'Biochemistry', 'Urine', 'Cardiac'];

  const filteredTests = useMemo(() => {
    return labTests.filter((test) => {
      const matchSearch =
        test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = selectedCategory === 'all' || test.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [labTests, searchTerm, selectedCategory]);

  return (
    <PublicLayout>
      {/* 1. Hero & Accreditation */}
      <section className="py-16 bg-gradient-to-b from-navy to-navy-deep border-b border-on-dark/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-leaf block mb-3">
              Accredited Clinical Diagnostics
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight leading-[1.1] mb-4">
              Precision Diagnostics with Rapid Digital Results.
            </h1>
            <p className="text-sm sm:text-base text-on-dark-muted leading-relaxed">
              Equipped with fully automated 5-part hematology and clinical biochemistry analyzers. Fast, reliable results verified by senior pathologists and instantly accessible via your Patient Portal.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4 text-xs font-semibold text-white">
            <div className="flex items-center gap-2 bg-midnight/80 border border-leaf/40 rounded-full px-4 py-2">
              <ShieldCheck className="h-4 w-4 text-leaf" />
              <span>NPHL Registered Diagnostic Category</span>
            </div>
            <div className="flex items-center gap-2 bg-midnight/80 border border-teal/40 rounded-full px-4 py-2">
              <Home className="h-4 w-4 text-cyan" />
              <span>Complimentary Lalitpur Home Sample Collection</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Test Catalogue & Search */}
      <section className="py-16 bg-navy-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-on-dark-muted" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search test by name or organ..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-midnight border border-on-dark/20 text-white placeholder-on-dark-muted text-xs focus:outline-none focus:border-cyan"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-cyan text-navy-deep'
                    : 'bg-midnight text-on-dark-muted border border-on-dark/15'
                }`}
              >
                All Tests ({labTests.length})
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedCategory(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedCategory === c
                      ? 'bg-cyan text-navy-deep'
                      : 'bg-midnight text-on-dark-muted border border-on-dark/15'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Test Rows */}
          <div className="space-y-4">
            {filteredTests.map((test) => (
              <div
                key={test.id}
                className="rounded-3xl bg-midnight/40 border border-on-dark/15 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-cyan/40 transition-all hover:shadow-xl"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-teal uppercase tracking-wider bg-teal/10 border border-teal/20 px-2 py-0.5 rounded-md">
                      {test.category}
                    </span>
                    <h3 className="font-display text-lg font-bold text-white">{test.name}</h3>
                  </div>

                  <p className="text-xs text-on-dark-muted leading-relaxed">
                    {test.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                    <span className="text-on-dark-muted">
                      <strong>Sample:</strong> {test.sampleType}
                    </span>
                    <span className="text-warm-gold font-medium">
                      <strong>Prep:</strong> {test.preparationNotes}
                    </span>
                    <span className="text-leaf font-medium flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> Turnaround: {test.turnaroundTime}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-on-dark/10">
                  <div className="text-right">
                    <span className="text-xs text-on-dark-muted block">Fee:</span>
                    <span className="font-bold text-cyan text-lg">NPR {test.price}</span>
                  </div>

                  <Link
                    to="/book"
                    className="px-6 py-2.5 rounded-full bg-cyan text-navy-deep font-bold text-xs uppercase tracking-wider hover:scale-105 transition-all shadow-md"
                  >
                    Book Test
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Home Sample Collection */}
      <section className="py-16 bg-navy border-t border-on-dark/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan block mb-2">
                Hassle-Free Morning Care
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-6">
                Doorstep Blood Sample Collection in Lalitpur
              </h2>
              <div className="space-y-4 text-sm text-on-dark-muted leading-relaxed">
                <p>
                  Avoid the early morning traffic and fasting stress. Our certified phlebotomists arrive at your home with sterilized vacutainer needles, barcode vials, and temperature-sealed transport cool-boxes.
                </p>
                <p>
                  <strong>Service Window:</strong> 6:30 AM to 11:30 AM daily across Sanagau, Mahalaxmi Municipality, Imadol, Gwarko, and Patan.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/book"
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-teal to-cyan text-navy-deep font-bold text-xs uppercase tracking-wider shadow-lg"
                >
                  Book Home Collection Online
                </Link>
                <a
                  href="tel:015582910"
                  className="px-6 py-3 rounded-full bg-on-dark/10 border border-on-dark/20 text-white font-bold text-xs hover:bg-white/10"
                >
                  Call Phlebotomy Desk: 01-5582910
                </a>
              </div>
            </div>

            <div className="rounded-3xl bg-midnight/60 border border-on-dark/15 p-8 space-y-6">
              <h3 className="font-display text-xl font-bold text-white">How to Receive Your Lab Reports</h3>
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-navy-deep border border-on-dark/10">
                  <span className="text-cyan font-bold block mb-1">1. Patient Portal Download</span>
                  <p className="text-on-dark-muted">
                    Log into your Two Brothers patient dashboard to view and download digitally signed PDF reports the moment they are verified.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-navy-deep border border-on-dark/10">
                  <span className="text-leaf font-bold block mb-1">2. SMS Alert with Secure Link</span>
                  <p className="text-on-dark-muted">
                    Receive an encrypted link via SMS the minute results are ready.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-navy-deep border border-on-dark/10">
                  <span className="text-teal font-bold block mb-1">3. Printed Lab Hardcopy</span>
                  <p className="text-on-dark-muted">
                    Pick up official color-printed hardcopies at our Sanagau reception anytime between 7 AM and 8 PM.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
