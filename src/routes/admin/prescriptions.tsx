import { createFileRoute } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import {
  FileText,
  Search,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Pill,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/prescriptions')({
  head: () => ({
    meta: [
      { title: 'Prescriptions Verification — Two Brothers Healthcare' },
      { name: 'description', content: 'Review uploaded prescriptions, schedule drugs, and pharmacist verification logs.' },
    ],
  }),
  component: AdminPrescriptionsPage,
});

function AdminPrescriptionsPage() {
  const { enquiries, medicines, updateEnquiryStatus } = useHealthcare();
  const [searchTerm, setSearchTerm] = useState('');

  const rxMedicines = useMemo(() => medicines.filter((m) => m.prescriptionRequired), [medicines]);

  const filteredEnquiries = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return enquiries.filter(
      (e) =>
        !q ||
        e.referenceId.toLowerCase().includes(q) ||
        e.patientName.toLowerCase().includes(q) ||
        e.medicineList.some((m) => m.medicineName.toLowerCase().includes(q))
    );
  }, [enquiries, searchTerm]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#082653]">Prescriptions</h1>
            <p className="text-xs text-[#64748B] mt-0.5">
              DDA compliance queue for prescription verification and schedule-drug dispensing approvals.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-[#E2ECFA] p-4 shadow-xs">
            <span className="text-xs text-[#64748B]">Prescription Requests</span>
            <div className="font-display text-2xl font-bold text-[#082653] mt-1">{enquiries.length}</div>
          </div>
          <div className="bg-white rounded-2xl border border-[#E2ECFA] p-4 shadow-xs">
            <span className="text-xs text-[#64748B]">Verified / Confirmed</span>
            <div className="font-display text-2xl font-bold text-[#10B981] mt-1">
              {enquiries.filter((e) => e.status !== 'submitted' && e.status !== 'declined').length}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-[#E2ECFA] p-4 shadow-xs">
            <span className="text-xs text-[#64748B]">Schedule Drugs in Inventory</span>
            <div className="font-display text-2xl font-bold text-[#0755D9] mt-1">{rxMedicines.length}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2ECFA] p-4 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search patient or prescription reference..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-xs text-[#10243B]"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2ECFA] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F4F8FE] border-b border-slate-100 text-[#64748B]">
                  <th className="py-3.5 px-4 font-semibold">Reference</th>
                  <th className="py-3.5 px-4 font-semibold">Patient</th>
                  <th className="py-3.5 px-4 font-semibold">Prescribed Items</th>
                  <th className="py-3.5 px-4 font-semibold">Pharmacist Review</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-[#F4F8FE]/60">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0755D9]">{enq.referenceId}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#10243B]">{enq.patientName}</div>
                      <div className="text-[11px] text-[#64748B]">{enq.phone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {enq.medicineList.map((m, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[#10243B]">
                          <Pill className="h-3 w-3 text-[#0755D9]" />
                          <span>{m.medicineName} ({m.quantity})</span>
                        </div>
                      ))}
                    </td>
                    <td className="py-3.5 px-4 text-[#64748B] max-w-xs">
                      {enq.pharmacistNotes || 'Awaiting pharmacist check'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border capitalize ${
                          enq.status === 'submitted'
                            ? 'bg-amber-50 text-[#F59E0B] border-amber-200'
                            : enq.status === 'declined'
                              ? 'bg-rose-50 text-[#EF4444] border-rose-200'
                              : 'bg-emerald-50 text-[#10B981] border-emerald-200'
                        }`}
                      >
                        {enq.status === 'submitted' ? (
                          <AlertCircle className="h-3 w-3" />
                        ) : (
                          <CheckCircle2 className="h-3 w-3" />
                        )}
                        {enq.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {enq.status === 'submitted' ? (
                        <button
                          type="button"
                          onClick={() => {
                            updateEnquiryStatus(enq.id, 'verified', 'Prescription verified by Super Admin / Duty Pharmacist.');
                            toast.success(`Prescription ${enq.referenceId} verified.`);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#0755D9] text-white text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <ShieldCheck className="h-3.5 w-3.5" /> Verify Rx
                        </button>
                      ) : (
                        <span className="text-[11px] text-[#64748B] font-medium">Reviewed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
