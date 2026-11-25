import { createFileRoute } from '@tanstack/react-router';
import { PublicLayout } from '@/components/common/PublicLayout';
import { ShieldCheck, Lock, FileText, CheckCircle2 } from 'lucide-react';

export const Route = createFileRoute('/privacy')({
  head: () => ({
    meta: [
      { title: 'Privacy Policy & Patient Data Protection — Two Brothers Healthcare' },
      {
        name: 'description',
        content: 'Our commitment to protecting patient health records, prescription uploads, and clinical confidentiality in Nepal.',
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <PublicLayout>
      <div className="py-16 bg-navy-deep min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-teal block mb-2">
              Confidentiality & Compliance
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              Patient Data Privacy Policy
            </h1>
            <p className="text-xs text-on-dark-muted">
              Effective Date: November 2026 · Compliant with Nepal Medical Council & MoHP Data Statutes
            </p>
          </div>

          <div className="prose prose-invert max-w-none text-sm text-on-dark-muted leading-relaxed space-y-6">
            <section className="p-6 rounded-3xl bg-midnight/40 border border-on-dark/15 space-y-3">
              <h2 className="text-lg font-bold text-white">1. Scope and Medical Stewardship</h2>
              <p>
                Two Brothers Healthcare Pvt. Ltd. ("TBH", "we", "us") treats medical confidentiality with the utmost seriousness. This policy governs how we collect, process, store, and restrict access to personal identifiers, uploaded prescriptions, and diagnostic laboratory records obtained through our physical clinic in Sanagau and this web platform.
              </p>
            </section>

            <section className="p-6 rounded-3xl bg-midnight/40 border border-on-dark/15 space-y-3">
              <h2 className="text-lg font-bold text-white">2. Information We Collect</h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Patient Identification:</strong> Full legal name, date of birth, biological sex, contact mobile number, and delivery street address.</li>
                <li><strong>Clinical Records:</strong> Medical prescriptions uploaded by patients, clinical notes recorded during OPD visits, and diagnostic test reports.</li>
                <li><strong>Transactional Logs:</strong> Appointment times, booking references, and medicine courier statuses.</li>
              </ul>
            </section>

            <section className="p-6 rounded-3xl bg-midnight/40 border border-on-dark/15 space-y-3">
              <h2 className="text-lg font-bold text-white">3. Access Controls & Private Storage</h2>
              <p>
                All uploaded prescription documents and diagnostic PDF reports are encrypted in rest and transit. Access is strictly role-permissioned: only treating physicians, attending phlebotomists, and licensed dispensing pharmacists assigned to your case can decrypt and inspect your health files.
              </p>
            </section>

            <section className="p-6 rounded-3xl bg-midnight/40 border border-on-dark/15 space-y-3">
              <h2 className="text-lg font-bold text-white">4. Data Retention & Deletion Rights</h2>
              <p>
                Under Nepal medical documentation standards, primary health consultation records and laboratory archives are retained for a minimum of 5 years to ensure continuity of patient care. Patients maintain the right to inspect their complete health vault and request data portability or dependent record correction at any time.
              </p>
            </section>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
