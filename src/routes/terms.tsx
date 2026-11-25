import { createFileRoute } from '@tanstack/react-router';
import { PublicLayout } from '@/components/common/PublicLayout';

export const Route = createFileRoute('/terms')({
  head: () => ({
    meta: [
      { title: 'Terms of Service — Two Brothers Healthcare' },
      {
        name: 'description',
        content: 'Terms and conditions governing online appointment booking, pharmacy availability enquiries, and clinical services in Lalitpur.',
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <PublicLayout>
      <div className="py-16 bg-navy-deep min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan block mb-2">
              Legal Agreement
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              Terms of Service & Clinical Policies
            </h1>
            <p className="text-xs text-on-dark-muted">Last Updated: November 2026</p>
          </div>

          <div className="prose prose-invert max-w-none text-sm text-on-dark-muted leading-relaxed space-y-6">
            <section className="p-6 rounded-3xl bg-midnight/40 border border-on-dark/15 space-y-3">
              <h2 className="text-lg font-bold text-white">1. Appointment Booking & 10-Minute Hold Policy</h2>
              <p>
                When you initiate an appointment booking, the selected clinician or diagnostic slot is held exclusively for 10 minutes to allow completion of details. Abandoned slots are automatically returned to public availability. We make every effort to minimize patient waiting times, but emergency medical triage at the Sanagau clinic may occasionally cause brief schedule adjustments.
              </p>
            </section>

            <section className="p-6 rounded-3xl bg-midnight/40 border border-on-dark/15 space-y-3">
              <h2 className="text-lg font-bold text-white">2. Medicine Enquiries vs Commercial Sales</h2>
              <p>
                Submitting a medicine availability enquiry through this platform does not constitute an automated commercial sale. All requests for prescription-only pharmaceuticals require evaluation and approval by a Nepal Pharmacy Council-certified pharmacist. We reserve the statutory right to refuse dispensing if a prescription is expired, unclear, or medically contraindicated.
              </p>
            </section>

            <section className="p-6 rounded-3xl bg-midnight/40 border border-on-dark/15 space-y-3">
              <h2 className="text-lg font-bold text-white">3. Cancellation & Rescheduling</h2>
              <p>
                Patients may cancel or reschedule appointments without penalty up to 2 hours before the scheduled time via the Patient Portal or by phone. Late cancellations prevent other community members in Sanagau from accessing timely care.
              </p>
            </section>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
