import { createFileRoute } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import {
  Users,
  Search,
  Phone,
  Calendar,
  Pill,
  X,
  Eye,
} from 'lucide-react';

export const Route = createFileRoute('/admin/patients')({
  head: () => ({
    meta: [
      { title: 'Patients Directory — Two Brothers Healthcare' },
      { name: 'description', content: 'Comprehensive community patient records, bookings, and pharmacy interactions.' },
    ],
  }),
  component: AdminPatientsPage,
});

interface DerivedPatient {
  key: string;
  name: string;
  phone: string;
  email: string;
  status: string;
  bookingCount: number;
  enquiryCount: number;
  lastDate: string;
}

function AdminPatientsPage() {
  const { users, appointments, enquiries } = useHealthcare();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<DerivedPatient | null>(null);

  const patientsList = useMemo(() => {
    const map = new Map<string, DerivedPatient>();

    users
      .filter((u) => u.role === 'patient')
      .forEach((u) => {
        const k = u.fullName.trim().toLowerCase();
        map.set(k, {
          key: k,
          name: u.fullName,
          phone: u.phone || 'Not provided',
          email: u.email,
          status: u.status,
          bookingCount: 0,
          enquiryCount: 0,
          lastDate: u.createdAt.slice(0, 10),
        });
      });

    appointments.forEach((a) => {
      const k = a.patientName.trim().toLowerCase();
      const existing = map.get(k);
      if (existing) {
        existing.bookingCount += 1;
        if (a.appointmentDate > existing.lastDate) existing.lastDate = a.appointmentDate;
      } else {
        map.set(k, {
          key: k,
          name: a.patientName,
          phone: a.patientPhone,
          email: a.patientEmail || 'Walk-in / Phone',
          status: 'active',
          bookingCount: 1,
          enquiryCount: 0,
          lastDate: a.appointmentDate,
        });
      }
    });

    enquiries.forEach((e) => {
      const k = e.patientName.trim().toLowerCase();
      const existing = map.get(k);
      if (existing) {
        existing.enquiryCount += 1;
      } else {
        map.set(k, {
          key: k,
          name: e.patientName,
          phone: e.phone,
          email: e.email || 'Pharmacy Enquiry',
          status: 'active',
          bookingCount: 0,
          enquiryCount: 1,
          lastDate: e.createdAt.slice(0, 10),
        });
      }
    });

    return Array.from(map.values());
  }, [users, appointments, enquiries]);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return patientsList.filter(
      (p) =>
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.email.toLowerCase().includes(q)
    );
  }, [patientsList, searchTerm]);

  const patientBookings = useMemo(() => {
    if (!selectedPatient) return [];
    return appointments.filter((a) => a.patientName.trim().toLowerCase() === selectedPatient.key);
  }, [selectedPatient, appointments]);

  const patientEnquiries = useMemo(() => {
    if (!selectedPatient) return [];
    return enquiries.filter((e) => e.patientName.trim().toLowerCase() === selectedPatient.key);
  }, [selectedPatient, enquiries]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#082653]">Patients Directory</h1>
            <p className="text-xs text-[#64748B] mt-0.5">
              Live community patient registry synchronized with appointments and pharmacy enquiries.
            </p>
          </div>
          <span className="px-3.5 py-1.5 rounded-xl bg-white border border-[#E2ECFA] text-xs font-semibold text-[#082653] self-start sm:self-auto">
            {patientsList.length} Total Patients
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2ECFA] p-4 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search patient name, phone, or email..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-xs text-[#10243B] focus:outline-none focus:border-[#0755D9]"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2ECFA] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F4F8FE] border-b border-slate-100 text-[#64748B]">
                  <th className="py-3.5 px-4 font-semibold">Patient Name</th>
                  <th className="py-3.5 px-4 font-semibold">Phone</th>
                  <th className="py-3.5 px-4 font-semibold">Email / Source</th>
                  <th className="py-3.5 px-4 font-semibold">Bookings</th>
                  <th className="py-3.5 px-4 font-semibold">Rx Enquiries</th>
                  <th className="py-3.5 px-4 font-semibold">Last Activity</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#64748B]">
                      <Users className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                      No patients match your search.
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                    <tr key={p.key} className="hover:bg-[#F4F8FE]/60 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-[#10243B]">{p.name}</td>
                      <td className="py-3.5 px-4 font-mono text-[#0755D9]">{p.phone}</td>
                      <td className="py-3.5 px-4 text-[#64748B]">{p.email}</td>
                      <td className="py-3.5 px-4 font-semibold text-[#082653]">{p.bookingCount}</td>
                      <td className="py-3.5 px-4 font-semibold text-[#082653]">{p.enquiryCount}</td>
                      <td className="py-3.5 px-4 text-[#64748B]">{p.lastDate}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedPatient(p)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#0755D9] text-[#082653] hover:text-[#0755D9] text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" /> Inspect
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

      {selectedPatient && (
        <div className="fixed inset-0 z-50 bg-[#082653]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#D9E8FF] shadow-2xl max-w-lg w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-semibold text-[#0755D9] uppercase">Patient Profile</span>
                <h3 className="font-display text-lg font-bold text-[#082653]">{selectedPatient.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPatient(null)}
                className="p-1.5 rounded-lg text-[#64748B] hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-[#F4F8FE] p-3.5 rounded-xl border border-[#E2ECFA]">
              <div>
                <span className="text-[#64748B] block">Phone</span>
                <span className="font-semibold text-[#10243B] flex items-center gap-1">
                  <Phone className="h-3 w-3 text-[#0755D9]" /> {selectedPatient.phone}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block">Email</span>
                <span className="font-semibold text-[#10243B] truncate block">{selectedPatient.email}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-semibold text-[#082653] flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#0755D9]" /> Appointments ({patientBookings.length})
              </div>
              {patientBookings.length === 0 ? (
                <div className="text-[#64748B] bg-slate-50 p-2.5 rounded-xl">No appointments recorded.</div>
              ) : (
                patientBookings.map((b) => (
                  <div key={b.id} className="flex justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-medium text-[#10243B]">
                      {b.referenceId} &bull; {b.serviceTitle}
                    </span>
                    <span className="text-[#0755D9] font-semibold capitalize">{b.status}</span>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-2">
              <div className="font-semibold text-[#082653] flex items-center gap-1.5">
                <Pill className="h-3.5 w-3.5 text-[#10B981]" /> Pharmacy Enquiries ({patientEnquiries.length})
              </div>
              {patientEnquiries.length === 0 ? (
                <div className="text-[#64748B] bg-slate-50 p-2.5 rounded-xl">No medicine enquiries recorded.</div>
              ) : (
                patientEnquiries.map((e) => (
                  <div key={e.id} className="flex justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-medium text-[#10243B]">
                      {e.referenceId} &bull; {e.medicineList.length} item(s)
                    </span>
                    <span className="text-[#10B981] font-semibold capitalize">{e.status}</span>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedPatient(null)}
                className="px-4 py-2 rounded-xl bg-[#0755D9] text-white font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
