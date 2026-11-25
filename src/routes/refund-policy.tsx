import { createFileRoute } from '@tanstack/react-router';
import { PublicLayout } from '@/components/common/PublicLayout';

export const Route = createFileRoute('/refund-policy')({
  head: () => ({
    meta: [
      { title: 'Refund & Cancellation Policy — Two Brothers Healthcare' },
      { name: 'description', content: 'Our fair refund policies for appointment cancellations, diagnostic tests, and pharmaceuticals.' },
    ],
  }),
  component: RefundPolicyPage,
});

function RefundPolicyPage() {
  return (
    <PublicLayout>
      <div className="py-16 bg-navy-deep min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan block mb-2">
              Fair & Transparent
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              Refund & Cancellation Policy
            </h1>
            <p className="text-xs text-on-dark-muted">Last Updated: November 2026</p>
          </div>

          <div className="prose prose-invert max-w-none text-sm text-on-dark-muted leading-relaxed space-y-6">
            <section className="p-6 rounded-3xl bg-midnight/40 border border-on-dark/15 space-y-3">
              <h2 className="text-lg font-bold text-white">1. Outpatient Consultations</h2>
              <p>
                If a doctor becomes unavailable due to an emergency or if you cancel your appointment at least 2 hours in advance, any pre-authorized fee is 100% refunded or credited towards your next visit. If you attend your appointment and receive a clinical consultation, consultation fees are non-refundable. Follow-up reviews within 7 days are complimentary.
              </p>
            </section>

            <section className="p-6 rounded-3xl bg-midnight/40 border border-on-dark/15 space-y-3">
              <h2 className="text-lg font-bold text-white">2. Laboratory Diagnostic Testing</h2>
              <p>
                Full refunds are granted if an appointment for sample collection is cancelled prior to specimen draw. Once biological samples have been processed in our analyzers or reported by pathology, laboratory charges cannot be refunded.
              </p>
            </section>

            <section className="p-6 rounded-3xl bg-midnight/40 border border-on-dark/15 space-y-3">
              <h2 className="text-lg font-bold text-white">3. Pharmaceutical Returns (Medicines)</h2>
              <p>
                Under Nepal Pharmacy Council health standards and drug safety regulations, biological products (e.g. insulins, vaccines) and temperature-sensitive liquids cannot be returned once they have left the dispensary control. Unopened blister strips of non-temperature-sensitive tablets accompanied by original purchase cash receipts may be exchanged or refunded within 7 days of delivery.
              </p>
            </section>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
