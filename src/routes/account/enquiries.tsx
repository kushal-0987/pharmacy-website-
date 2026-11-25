import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { AccountLayout } from '@/components/account/AccountLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import { MedicineEnquiry } from '@/types/healthcare';
import {
  Pill,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  ArrowRight,
  X,
  FileCheck,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/account/enquiries')({
  head: () => ({
    meta: [
      { title: 'Medicine Enquiries — Two Brothers Healthcare' },
      { name: 'description', content: 'Track prescription checks, availability quotes, and pharmacist verification status.' },
    ],
  }),
  component: MyEnquiriesPage,
});

function MyEnquiriesPage() {
  const { enquiries, updateEnquiryStatus } = useHealthcare();
  const [selectedEnquiry, setSelectedEnquiry] = useState<MedicineEnquiry | null>(null);

  const handleConfirmQuote = (id: string) => {
    updateEnquiryStatus(id, 'confirmed', 'Confirmed by patient for delivery.');
    toast.success('Enquiry confirmed! Delivery request initiated.');
    setSelectedEnquiry(null);
  };

  const handleDeclineQuote = (id: string) => {
    updateEnquiryStatus(id, 'declined', 'Declined by patient.');
    toast.info('Enquiry declined.');
    setSelectedEnquiry(null);
  };

  return (
    <AccountLayout>
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-on-dark/15">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Medicine Enquiries</h1>
            <p className="text-xs text-on-dark-muted">
              Live status on stock verification, pharmacist price quotes, and delivery progress.
            </p>
          </div>

          <Link
            to="/pharmacy"
            className="px-5 py-2.5 rounded-full bg-cyan text-navy-deep font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all inline-flex items-center gap-2"
          >
            <Pill className="h-4 w-4" />
            <span>New Medicine Enquiry</span>
          </Link>
        </div>

        {/* Enquiries Table / List */}
        <div className="space-y-4">
          {enquiries.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-midnight/30 border border-on-dark/15 p-8">
              <Pill className="h-10 w-10 text-on-dark-muted mx-auto mb-3" />
              <div className="font-bold text-white text-base">No medicine enquiries found</div>
              <p className="text-xs text-on-dark-muted mt-1 max-w-sm mx-auto">
                Search medicines or upload a prescription to check availability with our licensed pharmacists.
              </p>
            </div>
          ) : (
            enquiries.map((enq) => (
              <div
                key={enq.id}
                className="rounded-3xl bg-midnight/50 border border-on-dark/15 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-cyan/40 transition-colors"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-cyan">{enq.referenceId}</span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                        enq.status === 'confirmed'
                          ? 'bg-leaf/20 text-leaf border border-leaf/30'
                          : enq.status === 'verified'
                            ? 'bg-cyan/20 text-cyan border border-cyan/30'
                            : enq.status === 'dispatched'
                              ? 'bg-teal/20 text-teal border border-teal/30'
                              : enq.status === 'declined'
                                ? 'bg-destructive/20 text-destructive border border-destructive/30'
                                : 'bg-warm-gold/20 text-warm-gold border border-warm-gold/30'
                      }`}
                    >
                      {enq.status}
                    </span>
                    <span className="text-xs text-on-dark-muted capitalize">
                      • {enq.deliveryType} ({enq.deliveryType === 'delivery' ? 'Sanagau Doorstep' : 'Counter Pickup'})
                    </span>
                  </div>

                  <h3 className="font-display text-base font-bold text-white">
                    {enq.medicineList.map((m) => `${m.medicineName} (${m.quantity})`).join(', ')}
                  </h3>

                  {enq.pharmacistNotes && (
                    <div className="text-xs text-teal italic">
                      Pharmacist: "{enq.pharmacistNotes}"
                    </div>
                  )}

                  <div className="text-xs text-on-dark-muted">
                    Logged: {new Date(enq.createdAt).toLocaleDateString()} · Quoted Total: <strong className="text-cyan">NPR {enq.totalQuoted || 'Pending'}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedEnquiry(enq)}
                    className="px-4 py-2 rounded-xl bg-on-dark/10 hover:bg-white/10 text-white font-semibold text-xs border border-on-dark/20"
                  >
                    View Status Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Enquiry Detail Modal */}
        {selectedEnquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-deep/80 backdrop-blur-md animate-in fade-in">
            <div className="relative w-full max-w-lg bg-midnight border border-teal/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="absolute top-6 right-6 p-2 rounded-full text-on-dark-muted hover:text-white bg-navy-deep"
              >
                <X className="h-5 w-5" />
              </button>

              <div>
                <span className="text-[10px] font-bold text-teal uppercase tracking-wider block">
                  Medicine Availability Order
                </span>
                <h2 className="font-display text-xl font-bold text-white">
                  {selectedEnquiry.referenceId}
                </h2>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-2xl bg-navy-deep border border-on-dark/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-on-dark-muted">Status:</span>
                    <span className="font-bold text-cyan uppercase">{selectedEnquiry.status}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-on-dark-muted">Delivery Option:</span>
                    <span className="font-semibold text-white capitalize">{selectedEnquiry.deliveryType}</span>
                  </div>
                  {selectedEnquiry.deliveryAddress && (
                    <div>
                      <span className="text-on-dark-muted block">Address:</span>
                      <span className="text-white">{selectedEnquiry.deliveryAddress}</span>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-white mb-2">Medicines Requested:</h4>
                  <div className="space-y-1.5">
                    {selectedEnquiry.medicineList.map((m, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-navy-deep/60 border border-on-dark/10 flex items-center justify-between text-white">
                        <span>{m.medicineName}</span>
                        <span className="text-cyan font-bold">{m.quantity} Units</span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedEnquiry.pharmacistNotes && (
                  <div className="p-3.5 rounded-xl bg-teal/15 border border-teal/30 text-teal text-xs">
                    <strong>Pharmacist Evaluation:</strong>
                    <div className="text-white mt-1">{selectedEnquiry.pharmacistNotes}</div>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between font-bold text-sm text-white">
                  <span>Total Quoted Amount:</span>
                  <span className="text-cyan text-base">NPR {selectedEnquiry.totalQuoted || 'Pending'}</span>
                </div>
              </div>

              {selectedEnquiry.status === 'verified' && (
                <div className="flex justify-end gap-3 pt-4 border-t border-on-dark/10">
                  <button
                    type="button"
                    onClick={() => handleDeclineQuote(selectedEnquiry.id)}
                    className="px-5 py-2.5 rounded-full text-xs font-semibold text-destructive hover:bg-destructive/10"
                  >
                    Decline Quote
                  </button>
                  <button
                    type="button"
                    onClick={() => handleConfirmQuote(selectedEnquiry.id)}
                    className="px-6 py-2.5 rounded-full bg-cyan text-navy-deep font-bold text-xs uppercase"
                  >
                    Confirm & Dispatch
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
