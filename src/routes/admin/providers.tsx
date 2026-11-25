import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import { HealthcareProvider } from '@/types/healthcare';
import {
  Stethoscope,
  ShieldCheck,
  Plus,
  Star,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/providers')({
  head: () => ({
    meta: [
      { title: 'Doctor & Clinician Registry — Two Brothers Healthcare' },
      { name: 'description', content: 'Manage verified physicians, NMC registration numbers, and OPD slot capacities.' },
    ],
  }),
  component: AdminProvidersPage,
});

function AdminProvidersPage() {
  const { providers } = useHealthcare();
  const [providerList, setProviderList] = useState<HealthcareProvider[]>(providers);

  const [showAdd, setShowAdd] = useState(false);
  const [docName, setDocName] = useState('');
  const [docTitle, setDocTitle] = useState('Consultant');
  const [docReg, setDocReg] = useState('NMC #');
  const [docDept, setDocDept] = useState('General & Internal Medicine');
  const [docFee, setDocFee] = useState(700);

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    const newDoc: HealthcareProvider = {
      id: 'doc-' + Date.now(),
      name: docName,
      title: docTitle,
      qualifications: 'MBBS, MD',
      registrationNumber: docReg,
      specialties: ['General Medicine'],
      experienceYears: 5,
      languages: ['Nepali', 'English'],
      consultationFee: docFee,
      photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
      rating: 5.0,
      reviewCount: 1,
      availableDays: ['Sunday', 'Tuesday', 'Thursday'],
      availableTimeSlots: ['09:00 AM', '10:00 AM', '11:00 AM'],
      verified: true,
      department: docDept,
    };

    setProviderList((prev) => [newDoc, ...prev]);
    toast.success(`Doctor ${docName} registered with verification checkmark!`);
    setDocName('');
    setShowAdd(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-on-dark/15">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Doctors & Medical Faculty</h1>
            <p className="text-xs text-on-dark-muted">
              Regulatory credentials, NMC validation, and OPD fee structures.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAdd(!showAdd)}
            className="px-5 py-2.5 rounded-full bg-cyan text-navy-deep font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 self-start sm:self-auto hover:scale-105 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add Medical Doctor</span>
          </button>
        </div>

        {/* Add Modal */}
        {showAdd && (
          <form
            onSubmit={handleAddDoctor}
            className="p-6 rounded-3xl bg-midnight/70 border border-teal/40 space-y-4 text-xs animate-in fade-in shadow-2xl"
          >
            <h3 className="font-bold text-white text-base">Register Verified Doctor</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-white font-semibold block mb-1">Doctor Full Name *</label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="Dr. Sabina Maharjan"
                  className="w-full px-3 py-2 rounded-xl bg-navy-deep border border-on-dark/20 text-white"
                />
              </div>
              <div>
                <label className="text-white font-semibold block mb-1">NMC Registration # *</label>
                <input
                  type="text"
                  required
                  value={docReg}
                  onChange={(e) => setDocReg(e.target.value)}
                  placeholder="NMC #10429"
                  className="w-full px-3 py-2 rounded-xl bg-navy-deep border border-on-dark/20 text-white"
                />
              </div>
              <div>
                <label className="text-white font-semibold block mb-1">Department</label>
                <input
                  type="text"
                  required
                  value={docDept}
                  onChange={(e) => setDocDept(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-navy-deep border border-on-dark/20 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-white font-semibold block mb-1">Title / Designation</label>
                <input
                  type="text"
                  required
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-navy-deep border border-on-dark/20 text-white"
                />
              </div>
              <div>
                <label className="text-white font-semibold block mb-1">Consultation Fee (NPR)</label>
                <input
                  type="number"
                  required
                  value={docFee}
                  onChange={(e) => setDocFee(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-navy-deep border border-on-dark/20 text-white font-bold text-cyan"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="px-4 py-1.5 rounded-full text-on-dark-muted hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-full bg-cyan text-navy-deep font-bold"
              >
                Save Clinician
              </button>
            </div>
          </form>
        )}

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {providerList.map((doc) => (
            <div
              key={doc.id}
              className="p-5 rounded-3xl bg-midnight/50 border border-on-dark/15 flex flex-col justify-between space-y-4 hover:border-cyan/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-navy-deep">
                  <img src={doc.photoUrl} alt={doc.name} className="w-full h-full object-cover" />
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-leaf text-navy-deep text-[10px] font-bold flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> NMC Verified
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-teal uppercase tracking-wider block">
                    {doc.department}
                  </span>
                  <h3 className="font-display text-base font-bold text-white">{doc.name}</h3>
                  <div className="text-xs text-on-dark-muted">{doc.title}</div>
                  <div className="text-[11px] text-on-dark-muted/80">{doc.qualifications}</div>
                </div>

                <div className="text-xs text-on-dark-muted pt-2 border-t border-on-dark/10">
                  <div><strong>Reg:</strong> {doc.registrationNumber}</div>
                  <div><strong>Fee:</strong> NPR {doc.consultationFee}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-on-dark/10 flex items-center justify-between text-xs text-leaf font-bold">
                <span>Active on OPD Roster</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
