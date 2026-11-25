import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import {
  ShieldCheck,
  Plus,
  Star,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/providers')({
  head: () => ({
    meta: [
      { title: 'Doctors & Clinicians — Two Brothers Healthcare' },
      { name: 'description', content: 'Manage verified physicians, NMC registration numbers, and OPD consultation schedules.' },
    ],
  }),
  component: AdminProvidersPage,
});

function AdminProvidersPage() {
  const { providers, addProvider } = useHealthcare();

  const [showAdd, setShowAdd] = useState(false);
  const [docName, setDocName] = useState('');
  const [docTitle, setDocTitle] = useState('Consultant Physician');
  const [docReg, setDocReg] = useState('NMC #');
  const [docDept, setDocDept] = useState('General & Internal Medicine');
  const [docFee, setDocFee] = useState(700);

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    addProvider({
      name: docName.trim(),
      title: docTitle.trim(),
      qualifications: 'MBBS, MD',
      registrationNumber: docReg.trim(),
      specialties: [docDept.trim()],
      experienceYears: 5,
      languages: ['Nepali', 'English'],
      consultationFee: docFee,
      photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
      rating: 5.0,
      reviewCount: 0,
      availableDays: ['Sunday', 'Tuesday', 'Thursday'],
      availableTimeSlots: ['09:00 AM', '10:00 AM', '11:00 AM'],
      verified: true,
      department: docDept.trim(),
    });

    toast.success(`${docName} registered and added to OPD roster.`);
    setDocName('');
    setShowAdd(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#082653]">Doctors &amp; Clinicians</h1>
            <p className="text-xs text-[#64748B] mt-0.5">
              NMC-verified physicians, specialty departments, and consultation fee schedule.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAdd(!showAdd)}
            className="px-4 py-2.5 rounded-xl bg-[#0755D9] hover:bg-[#082653] text-white font-semibold text-xs inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Add Doctor</span>
          </button>
        </div>

        {showAdd && (
          <form
            onSubmit={handleAddDoctor}
            className="bg-white rounded-2xl border border-[#D9E8FF] p-6 shadow-sm space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display font-bold text-[#082653] text-base">Register Verified Doctor</h3>
              <button type="button" onClick={() => setShowAdd(false)} className="text-[#64748B] hover:text-[#082653]">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[#082653] font-semibold block mb-1">Doctor Full Name *</label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="Dr. Sabina Maharjan"
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B]"
                />
              </div>
              <div>
                <label className="text-[#082653] font-semibold block mb-1">NMC Registration # *</label>
                <input
                  type="text"
                  required
                  value={docReg}
                  onChange={(e) => setDocReg(e.target.value)}
                  placeholder="NMC #10429"
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B]"
                />
              </div>
              <div>
                <label className="text-[#082653] font-semibold block mb-1">Department</label>
                <input
                  type="text"
                  required
                  value={docDept}
                  onChange={(e) => setDocDept(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[#082653] font-semibold block mb-1">Title / Designation</label>
                <input
                  type="text"
                  required
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B]"
                />
              </div>
              <div>
                <label className="text-[#082653] font-semibold block mb-1">Consultation Fee (NPR)</label>
                <input
                  type="number"
                  required
                  value={docFee}
                  onChange={(e) => setDocFee(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#0755D9] font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-[#64748B] font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#0755D9] text-white font-semibold"
              >
                Save Doctor
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {providers.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-[#E2ECFA] p-4 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#0755D9]/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="relative h-44 w-full rounded-xl overflow-hidden bg-[#F4F8FE]">
                  <img src={doc.photoUrl} alt={doc.name} className="w-full h-full object-cover" />
                  <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-white/95 text-[#10B981] border border-emerald-200 text-[10px] font-bold flex items-center gap-1 shadow-xs">
                    <ShieldCheck className="h-3 w-3" /> NMC Verified
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-[#0755D9] uppercase tracking-wider block">
                    {doc.department}
                  </span>
                  <h3 className="font-display text-base font-bold text-[#082653] mt-0.5">{doc.name}</h3>
                  <div className="text-xs text-[#64748B]">{doc.title}</div>
                  <div className="text-[11px] text-[#64748B] mt-0.5">{doc.qualifications}</div>
                </div>

                <div className="text-xs text-[#64748B] pt-3 border-t border-slate-100 space-y-1">
                  <div className="flex justify-between">
                    <span>Registration:</span>
                    <strong className="text-[#10243B]">{doc.registrationNumber}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>OPD Fee:</span>
                    <strong className="text-[#0755D9]">NPR {doc.consultationFee}</strong>
                  </div>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-[#10B981] font-semibold">Active on OPD</span>
                <span className="inline-flex items-center gap-1 text-[#082653] font-semibold">
                  <Star className="h-3.5 w-3.5 text-[#F59E0B] fill-[#F59E0B]" /> {doc.rating}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
