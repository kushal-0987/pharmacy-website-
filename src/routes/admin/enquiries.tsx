import { createFileRoute } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import { MedicineEnquiry } from '@/types/healthcare';
import {
  ClipboardList,
  Search,
  CheckCircle2,
  XCircle,
  Truck,
  Store,
  Eye,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/enquiries')({
  head: () => ({
    meta: [
      { title: 'Medicine Enquiries — Two Brothers Healthcare' },
      { name: 'description', content: 'Review patient medicine availability enquiries, quote pricing, and route confirmed orders.' },
    ],
  }),
  component: AdminMedicineEnquiriesPage,
});

function getEnquiryBadge(status: MedicineEnquiry['status']) {
  switch (status) {
    case 'confirmed':
    case 'delivered':
      return 'bg-emerald-50 text-[#10B981] border-emerald-200';
    case 'submitted':
      return 'bg-amber-50 text-[#F59E0B] border-amber-200';
    case 'verified':
    case 'dispatched':
      return 'bg-blue-50 text-[#0755D9] border-blue-200';
    case 'declined':
      return 'bg-rose-50 text-[#EF4444] border-rose-200';
    default:
      return 'bg-slate-100 text-[#64748B] border-slate-200';
  }
}

function AdminMedicineEnquiriesPage() {
  const { enquiries, updateEnquiryStatus } = useHealthcare();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<MedicineEnquiry | null>(null);
  const [quoteInput, setQuoteInput] = useState<number>(0);
  const [notesInput, setNotesInput] = useState('');

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return enquiries.filter((e) => {
      const matchSearch =
        !q ||
        e.referenceId.toLowerCase().includes(q) ||
        e.patientName.toLowerCase().includes(q) ||
        e.phone.includes(q);
      const matchStatus = statusFilter === 'all' || e.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [enquiries, searchTerm, statusFilter]);

  const openModal = (enq: MedicineEnquiry) => {
    setSelected(enq);
    setQuoteInput(enq.totalQuoted ?? 0);
    setNotesInput(enq.pharmacistNotes || '');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#082653]">Medicine Enquiries</h1>
            <p className="text-xs text-[#64748B] mt-0.5">
              Verify requested medicines, quote total amounts, and dispatch confirmed orders.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2ECFA] p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search MED reference, patient, phone..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-xs text-[#10243B] placeholder-[#64748B] focus:outline-none focus:border-[#0755D9]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-xs font-medium text-[#10243B]"
          >
            <option value="all">All Statuses ({enquiries.length})</option>
            <option value="submitted">Submitted</option>
            <option value="verified">Verified</option>
            <option value="confirmed">Confirmed</option>
            <option value="dispatched">Dispatched</option>
            <option value="delivered">Delivered</option>
            <option value="declined">Declined</option>
          </select>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2ECFA] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F4F8FE] border-b border-slate-100 text-[#64748B]">
                  <th className="py-3.5 px-4 font-semibold">Enquiry ID</th>
                  <th className="py-3.5 px-4 font-semibold">Patient</th>
                  <th className="py-3.5 px-4 font-semibold">Requested Medicines</th>
                  <th className="py-3.5 px-4 font-semibold">Fulfillment</th>
                  <th className="py-3.5 px-4 font-semibold">Quoted Total</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#64748B]">
                      <ClipboardList className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                      No medicine enquiries found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((enq) => (
                    <tr key={enq.id} className="hover:bg-[#F4F8FE]/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0755D9]">{enq.referenceId}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#10243B]">{enq.patientName}</div>
                        <div className="text-[11px] text-[#64748B]">{enq.phone}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          {enq.medicineList.map((m, idx) => (
                            <div key={idx} className="text-[#10243B]">
                              {m.medicineName} <span className="text-[#64748B]">x{m.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 font-medium text-[#10243B] capitalize">
                          {enq.deliveryType === 'delivery' ? (
                            <Truck className="h-3.5 w-3.5 text-[#0755D9]" />
                          ) : (
                            <Store className="h-3.5 w-3.5 text-[#10B981]" />
                          )}
                          {enq.deliveryType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#082653]">
                        {enq.totalQuoted ? `NPR ${enq.totalQuoted.toLocaleString()}` : 'Pending quote'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold border capitalize ${getEnquiryBadge(enq.status)}`}
                        >
                          {enq.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => openModal(enq)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#0755D9] text-[#082653] hover:text-[#0755D9] text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Review</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-[#082653]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#D9E8FF] shadow-2xl max-w-lg w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono font-bold text-[#0755D9]">{selected.referenceId}</span>
                <h3 className="font-display text-base font-bold text-[#082653]">Review Medicine Enquiry</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="p-1.5 rounded-lg text-[#64748B] hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="bg-[#F4F8FE] p-3.5 rounded-xl border border-[#E2ECFA] space-y-1">
              <div className="font-semibold text-[#10243B]">
                {selected.patientName} &bull; {selected.phone}
              </div>
              <div className="text-[#64748B]">
                {selected.deliveryType === 'delivery'
                  ? `Delivery to: ${selected.deliveryAddress || 'Sanagau'}`
                  : 'Counter Pickup at Sanagau Pharmacy'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-[#082653] block mb-1">Total Quote (NPR)</label>
                <input
                  type="number"
                  value={quoteInput}
                  onChange={(e) => setQuoteInput(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B]"
                />
              </div>
              <div>
                <label className="font-semibold text-[#082653] block mb-1">Current Status</label>
                <div className="py-2 font-semibold capitalize text-[#0755D9]">{selected.status}</div>
              </div>
            </div>

            <div>
              <label className="font-semibold text-[#082653] block mb-1">Pharmacist Notes</label>
              <textarea
                rows={2}
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B]"
              />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  updateEnquiryStatus(selected.id, 'verified', notesInput, quoteInput);
                  toast.success(`${selected.referenceId} marked verified.`);
                  setSelected(null);
                }}
                className="px-3.5 py-2 rounded-xl bg-[#0755D9] text-white font-semibold cursor-pointer"
              >
                Verify
              </button>
              <button
                type="button"
                onClick={() => {
                  updateEnquiryStatus(selected.id, 'confirmed', notesInput, quoteInput);
                  toast.success(`${selected.referenceId} confirmed & queued for delivery/pickup.`);
                  setSelected(null);
                }}
                className="px-3.5 py-2 rounded-xl bg-[#10B981] text-white font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <CheckCircle2 className="h-3.5 w-3.5" /> Confirm Order
              </button>
              <button
                type="button"
                onClick={() => {
                  updateEnquiryStatus(selected.id, 'declined', notesInput, quoteInput);
                  toast.info(`${selected.referenceId} declined.`);
                  setSelected(null);
                }}
                className="px-3.5 py-2 rounded-xl bg-rose-50 text-[#EF4444] border border-rose-200 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <XCircle className="h-3.5 w-3.5" /> Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
