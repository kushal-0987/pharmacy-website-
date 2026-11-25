import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { StaffLayout } from '@/components/staff/StaffLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import { MedicineEnquiry } from '@/types/healthcare';
import {
  Pill,
  Search,
  CheckCircle2,
  XCircle,
  Truck,
  Send,
  X,
  FileCheck,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/staff/enquiries')({
  head: () => ({
    meta: [
      { title: 'Pharmacist Dispensary Queue — Two Brothers Healthcare' },
      { name: 'description', content: 'Prescription verification, stock checks, and pricing quotation desk.' },
    ],
  }),
  component: StaffEnquiriesPage,
});

function StaffEnquiriesPage() {
  const { enquiries, updateEnquiryStatus } = useHealthcare();
  const [selectedEnquiry, setSelectedEnquiry] = useState<MedicineEnquiry | null>(null);

  const [quotePrice, setQuotePrice] = useState<number>(250);
  const [pharmacistNote, setPharmacistNote] = useState('All medicines in stock. Temperature maintained.');

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry) return;

    updateEnquiryStatus(selectedEnquiry.id, 'verified', pharmacistNote, quotePrice);
    toast.success(`Quote of NPR ${quotePrice} sent to patient ${selectedEnquiry.patientName}`);
    setSelectedEnquiry(null);
  };

  return (
    <StaffLayout>
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="pb-4 border-b border-on-dark/15">
          <h1 className="font-display text-2xl font-bold text-white">Pharmacist Prescription Queue</h1>
          <p className="text-xs text-on-dark-muted">
            Licensed dispensing workbench: verify prescriptions, evaluate dosages, quote prices, and dispatch couriers.
          </p>
        </div>

        {/* Enquiries Grid */}
        <div className="space-y-4">
          {enquiries.map((enq) => (
            <div
              key={enq.id}
              className="rounded-3xl bg-midnight/50 border border-on-dark/15 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-cyan/40 transition-colors"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-cyan text-sm">{enq.referenceId}</span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      enq.status === 'confirmed'
                        ? 'bg-leaf/20 text-leaf'
                        : enq.status === 'verified'
                          ? 'bg-cyan/20 text-cyan'
                          : 'bg-warm-gold/20 text-warm-gold'
                    }`}
                  >
                    {enq.status}
                  </span>
                  <span className="text-xs text-white font-semibold">
                    Patient: {enq.patientName} ({enq.phone})
                  </span>
                </div>

                <div className="text-xs text-white">
                  <strong>Items:</strong> {enq.medicineList.map((m) => `${m.medicineName} (${m.quantity})`).join(', ')}
                </div>

                {enq.deliveryAddress && (
                  <div className="text-xs text-on-dark-muted">
                    <strong>Delivery to:</strong> {enq.deliveryAddress} ({enq.deliveryZone})
                  </div>
                )}

                {enq.prescriptionFileUrl && (
                  <div className="text-[11px] text-leaf flex items-center gap-1 font-semibold">
                    <FileCheck className="h-3.5 w-3.5" /> Doctor Prescription Attached
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedEnquiry(enq);
                    setQuotePrice(enq.totalQuoted || 220);
                  }}
                  className="px-5 py-2.5 rounded-full bg-cyan text-navy-deep font-bold text-xs uppercase shadow-md hover:scale-105 transition-all"
                >
                  Verify & Quote
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Pharmacist Verification */}
        {selectedEnquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-deep/80 backdrop-blur-md animate-in fade-in">
            <div className="relative w-full max-w-lg bg-midnight border border-teal/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="absolute top-6 right-6 p-2 rounded-full text-on-dark-muted hover:text-white bg-navy-deep"
              >
                <X className="h-5 w-5" />
              </button>

              <div>
                <span className="text-[10px] font-bold text-teal uppercase tracking-wider block">
                  Dispensary Verification Desk
                </span>
                <h2 className="font-display text-xl font-bold text-white">
                  Enquiry #{selectedEnquiry.referenceId}
                </h2>
                <div className="text-xs text-on-dark-muted">
                  Patient: {selectedEnquiry.patientName} · Phone: {selectedEnquiry.phone}
                </div>
              </div>

              <form onSubmit={handleSendQuote} className="space-y-4 text-xs">
                <div>
                  <label className="text-white font-semibold block mb-1">
                    Calculate Total Price Quote (NPR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={quotePrice}
                    onChange={(e) => setQuotePrice(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-2xl bg-navy-deep border border-on-dark/20 text-white font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="text-white font-semibold block mb-1">
                    Pharmacist Clinical Notes & Advice *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={pharmacistNote}
                    onChange={(e) => setPharmacistNote(e.target.value)}
                    placeholder="e.g. All medicines verified. Brand substitution approved. Take with meals."
                    className="w-full px-4 py-2.5 rounded-2xl bg-navy-deep border border-on-dark/20 text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedEnquiry(null)}
                    className="px-4 py-2 rounded-full text-on-dark-muted hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-cyan text-navy-deep font-bold text-xs uppercase"
                  >
                    Send Quote to Patient
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </StaffLayout>
  );
}
