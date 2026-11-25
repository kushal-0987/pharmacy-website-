import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { PublicLayout } from '@/components/common/PublicLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import { HealthPackage } from '@/types/healthcare';
import {
  Package,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  X,
  Sparkles,
  HelpCircle,
  FileCheck,
} from 'lucide-react';

export const Route = createFileRoute('/services/packages')({
  head: () => ({
    meta: [
      { title: 'Preventive Health Packages & Checkups — Two Brothers Healthcare | Lalitpur' },
      {
        name: 'description',
        content:
          'Affordable preventive health checkup packages in Sanagau, Lalitpur. Full body panels, senior citizen wellness, diabetes watch, and comprehensive executive screening.',
      },
    ],
  }),
  component: HealthPackagesPage,
});

function HealthPackagesPage() {
  const { packages } = useHealthcare();
  const [selectedPackage, setSelectedPackage] = useState<HealthPackage | null>(null);

  return (
    <PublicLayout>
      {/* 1. Hero */}
      <section className="py-16 bg-gradient-to-b from-navy to-navy-deep border-b border-on-dark/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan block mb-3">
              Routine Preventive Medicine
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight leading-[1.1] mb-4">
              All-In-One Health Checkup Packages.
            </h1>
            <p className="text-sm sm:text-base text-on-dark-muted leading-relaxed">
              Early detection protects families. Our structured checkup panels bundle routine laboratory tests, resting ECG, vitals mapping, and specialist physician reviews at transparent, discounted package rates.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Package Cards */}
      <section className="py-16 bg-navy-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="rounded-3xl bg-midnight/50 border border-on-dark/15 p-8 flex flex-col justify-between hover:border-cyan/40 transition-all hover:shadow-2xl group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold text-teal uppercase tracking-wider bg-teal/10 border border-teal/20 px-2.5 py-1 rounded-full">
                      {pkg.category} Screening
                    </span>
                    {pkg.badge && (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-cyan/20 text-cyan border border-cyan/30">
                        {pkg.badge}
                      </span>
                    )}
                  </div>

                  <h2 className="font-display text-2xl font-bold text-white mb-2 group-hover:text-cyan transition-colors">
                    {pkg.name}
                  </h2>
                  <p className="text-xs text-on-dark-muted leading-relaxed mb-6">
                    {pkg.tagline}
                  </p>

                  <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-on-dark/10">
                    <span className="text-3xl font-bold text-white">NPR {pkg.price}</span>
                    {pkg.originalPrice && (
                      <span className="text-xs line-through text-on-dark-muted">
                        NPR {pkg.originalPrice}
                      </span>
                    )}
                    <span className="text-xs text-leaf font-bold ml-auto">
                      {pkg.testCount} Tests Included
                    </span>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="text-[11px] font-bold text-teal uppercase tracking-wider mb-2">
                      Key Highlights:
                    </div>
                    {pkg.includedTests.slice(0, 5).map((t, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-on-dark-muted">
                        <CheckCircle2 className="h-3.5 w-3.5 text-teal shrink-0" />
                        <span className="truncate">{t}</span>
                      </div>
                    ))}
                    {pkg.includedTests.length > 5 && (
                      <div className="text-[11px] text-cyan font-semibold pt-1">
                        + {pkg.includedTests.length - 5} more investigations
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-on-dark/10">
                  <button
                    type="button"
                    onClick={() => setSelectedPackage(pkg)}
                    className="w-full py-2.5 rounded-full border border-teal/40 hover:bg-teal/20 text-cyan text-xs font-bold text-center block transition-colors"
                  >
                    View Full Test List & Details
                  </button>
                  <Link
                    to="/book"
                    className="w-full py-3 rounded-full bg-gradient-to-r from-teal to-cyan text-navy-deep text-xs font-bold text-center block shadow-lg hover:opacity-95 transition-opacity"
                  >
                    Book This Package
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Package Detail Modal */}
      {selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-deep/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-midnight border border-teal/40 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedPackage(null)}
              className="absolute top-6 right-6 p-2 rounded-full text-on-dark-muted hover:text-white bg-navy-deep border border-on-dark/15"
            >
              <X className="h-5 w-5" />
            </button>

            <span className="text-[10px] font-bold text-teal uppercase tracking-wider">
              {selectedPackage.category} Panel
            </span>
            <h2 className="font-display text-2xl font-bold text-white mb-2">
              {selectedPackage.name}
            </h2>
            <p className="text-xs text-on-dark-muted mb-6">{selectedPackage.tagline}</p>

            <div className="flex items-center gap-6 p-4 rounded-2xl bg-navy-deep border border-on-dark/15 mb-6 text-xs">
              <div>
                <span className="text-on-dark-muted block">Fee:</span>
                <span className="text-xl font-bold text-cyan">NPR {selectedPackage.price}</span>
              </div>
              <div>
                <span className="text-on-dark-muted block">Estimated Time:</span>
                <span className="font-bold text-white">{selectedPackage.durationMinutes} Minutes</span>
              </div>
              <div>
                <span className="text-on-dark-muted block">Tests Count:</span>
                <span className="font-bold text-leaf">{selectedPackage.testCount} Tests</span>
              </div>
            </div>

            <div className="space-y-4 mb-6 text-xs">
              <div>
                <h3 className="font-bold text-white text-sm mb-2">Tests Included in This Package:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedPackage.includedTests.map((t) => (
                    <div key={t} className="p-2.5 rounded-xl bg-navy-deep/60 border border-on-dark/10 flex items-center gap-2 text-white">
                      <CheckCircle2 className="h-3.5 w-3.5 text-teal shrink-0" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-white text-sm mb-1">Preparation Guidelines:</h3>
                <p className="text-on-dark-muted leading-relaxed">{selectedPackage.preparationNotes}</p>
              </div>

              <div>
                <h3 className="font-bold text-white text-sm mb-1">Recommended Audience:</h3>
                <p className="text-on-dark-muted leading-relaxed">{selectedPackage.targetAudience}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-on-dark/15">
              <button
                type="button"
                onClick={() => setSelectedPackage(null)}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-on-dark-muted hover:text-white"
              >
                Close
              </button>
              <Link
                to="/book"
                className="px-8 py-2.5 rounded-full bg-cyan text-navy-deep font-bold text-xs uppercase tracking-wider shadow-lg"
              >
                Book Package Now
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 4. Compare Packages Table */}
      <section className="py-16 bg-navy border-t border-on-dark/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-teal block mb-2">
              Side-by-Side Evaluation
            </span>
            <h2 className="font-display text-3xl font-bold text-white">
              Package Comparison Matrix
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-on-dark-muted border-collapse">
              <thead>
                <tr className="border-b border-on-dark/15 text-white">
                  <th className="py-4 px-4 font-bold text-sm">Package Name</th>
                  <th className="py-4 px-4 font-bold">Category</th>
                  <th className="py-4 px-4 font-bold">Included Tests</th>
                  <th className="py-4 px-4 font-bold">Duration</th>
                  <th className="py-4 px-4 font-bold">Price</th>
                  <th className="py-4 px-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-on-dark/10">
                {packages.map((p) => (
                  <tr key={p.id} className="hover:bg-midnight/40 transition-colors">
                    <td className="py-4 px-4 font-bold text-white text-sm">{p.name}</td>
                    <td className="py-4 px-4 text-teal">{p.category}</td>
                    <td className="py-4 px-4">{p.testCount} parameters</td>
                    <td className="py-4 px-4">{p.durationMinutes} mins</td>
                    <td className="py-4 px-4 font-bold text-cyan text-sm">NPR {p.price}</td>
                    <td className="py-4 px-4 text-right">
                      <Link
                        to="/book"
                        className="px-4 py-1.5 rounded-full bg-cyan text-navy-deep font-bold text-[11px] inline-block hover:scale-105 transition-transform"
                      >
                        Book
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
