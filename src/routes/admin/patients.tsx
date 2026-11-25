import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import {
  Users,
  Search,
  UserCheck,
  Calendar,
  Pill,
  Activity,
  X,
  ShieldAlert,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/patients')({
  head: () => ({
    meta: [
      { title: 'Patient 360 Registry & History — Two Brothers Healthcare' },
      { name: 'description', content: 'Comprehensive patient directory, family records, and historical clinical tracking.' },
    ],
  }),
  component: AdminPatientsPage,
});

interface PatientRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  bloodGroup: string;
  location: string;
  totalVisits: number;
  lastVisit: string;
  dependentsCount: number;
}

function AdminPatientsPage() {
  const [patients] = useState<PatientRecord[]>([
    {
      id: 'p-1',
      name: 'Kushal Sharma',
      phone: '9841234567',
      email: 'kushal.sharma@example.com',
      bloodGroup: 'B+',
      location: 'Sanagau Ward-4, Lalitpur',
      totalVisits: 6,
      lastVisit: '2026-11-23',
      dependentsCount: 2,
    },
    {
      id: 'p-2',
      name: 'Sunita Maharjan',
      phone: '9801987654',
      email: 'sunita.m@example.com',
      bloodGroup: 'O+',
      location: 'Imadol, Lalitpur',
      totalVisits: 3,
      lastVisit: '2026-11-20',
      dependentsCount: 1,
    },
    {
      id: 'p-3',
      name: 'Ramesh Adhikari',
      phone: '9860112233',
      email: 'ramesh.adhikari@example.com',
      bloodGroup: 'A+',
      location: 'Gwarko, Lalitpur',
      totalVisits: 8,
      lastVisit: '2026-11-18',
      dependentsCount: 3,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-on-dark/15">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Patient 360° Directory</h1>
            <p className="text-xs text-on-dark-muted">
              Unified community patient records, dependent histories, and medical interactions.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-on-dark-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search patient by name, phone or ward..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-midnight border border-on-dark/20 text-white text-xs focus:outline-none focus:border-cyan"
          />
        </div>

        {/* Patients Table */}
        <div className="rounded-3xl bg-midnight/40 border border-on-dark/15 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-on-dark/15 text-on-dark-muted bg-navy/60">
                  <th className="py-3 px-4 font-bold">Patient Name</th>
                  <th className="py-3 px-4 font-bold">Mobile Phone</th>
                  <th className="py-3 px-4 font-bold">Blood Group</th>
                  <th className="py-3 px-4 font-bold">Locality</th>
                  <th className="py-3 px-4 font-bold">Total Visits</th>
                  <th className="py-3 px-4 font-bold">Last Visit</th>
                  <th className="py-3 px-4 font-bold text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-on-dark/10">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-navy-deep/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-white text-sm">{p.name}</td>
                    <td className="py-3 px-4 text-cyan font-mono">{p.phone}</td>
                    <td className="py-3 px-4 text-teal">{p.bloodGroup}</td>
                    <td className="py-3 px-4 text-on-dark-muted">{p.location}</td>
                    <td className="py-3 px-4 text-white">{p.totalVisits} interactions</td>
                    <td className="py-3 px-4 text-on-dark-muted">{p.lastVisit}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedPatient(p)}
                        className="px-3 py-1 rounded-xl bg-on-dark/10 hover:bg-white/10 text-white font-semibold text-[11px] border border-on-dark/20"
                      >
                        Inspect 360°
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Patient 360 Modal */}
        {selectedPatient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-deep/80 backdrop-blur-md animate-in fade-in">
            <div className="relative w-full max-w-lg bg-midnight border border-teal/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <button
                type="button"
                onClick={() => setSelectedPatient(null)}
                className="absolute top-6 right-6 p-2 rounded-full text-on-dark-muted hover:text-white bg-navy-deep"
              >
                <X className="h-5 w-5" />
              </button>

              <div>
                <span className="text-[10px] font-bold text-teal uppercase tracking-wider block">
                  Patient 360° Record
                </span>
                <h2 className="font-display text-2xl font-bold text-white">
                  {selectedPatient.name}
                </h2>
                <div className="text-xs text-on-dark-muted">
                  Phone: {selectedPatient.phone} · Email: {selectedPatient.email}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-navy-deep border border-on-dark/15">
                  <span className="text-on-dark-muted block">Blood Group:</span>
                  <span className="font-bold text-white">{selectedPatient.bloodGroup}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-navy-deep border border-on-dark/15">
                  <span className="text-on-dark-muted block">Registered Dependents:</span>
                  <span className="font-bold text-cyan">{selectedPatient.dependentsCount} Family Members</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-navy-deep border border-on-dark/15 text-xs text-on-dark-muted space-y-2">
                <div className="font-bold text-white">Recent Interactions Summary:</div>
                <div>• Consultation with Dr. Suresh Shrestha (Nov 2026)</div>
                <div>• 2x Doorstep Medicine Delivery (Sanagau Ward-4)</div>
                <div>• Comprehensive Lipid & Blood Sugar Panel (Normal)</div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPatient(null)}
                  className="px-6 py-2 rounded-full bg-cyan text-navy-deep font-bold text-xs"
                >
                  Close Record
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
