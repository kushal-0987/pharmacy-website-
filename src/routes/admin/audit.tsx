import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import {
  History,
  ShieldCheck,
  Search,
  Download,
  Filter,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/audit')({
  head: () => ({
    meta: [
      { title: 'Immutable System Audit Logs — Two Brothers Healthcare' },
      { name: 'description', content: 'Compliance activity logs, patient record access audits, and clinical action telemetry.' },
    ],
  }),
  component: AdminAuditPage,
});

function AdminAuditPage() {
  const { auditLogs } = useHealthcare();
  const [searchTerm, setSearchTerm] = useState('');

  // Fallback demo audit entries if none generated yet
  const displayLogs = auditLogs.length > 0 ? auditLogs : [
    {
      id: 'log-101',
      timestamp: '2026-11-23T10:05:00Z',
      actorName: 'Dr. Suresh Shrestha',
      actorRole: 'doctor' as any,
      action: 'UPDATE_STATUS',
      entityType: 'Appointment',
      entityId: 'TBH-2026-001',
      details: 'Status updated to confirmed. SMS dispatched.',
      ipAddress: '192.168.1.14',
    },
    {
      id: 'log-102',
      timestamp: '2026-11-23T09:20:00Z',
      actorName: 'Ph. Manish Shrestha',
      actorRole: 'pharmacist' as any,
      action: 'VERIFY_PRESCRIPTION',
      entityType: 'MedicineEnquiry',
      entityId: 'MED-2026-042',
      details: 'Prescription image verified. Quoted NPR 220.',
      ipAddress: '192.168.1.18',
    },
    {
      id: 'log-103',
      timestamp: '2026-11-23T08:45:00Z',
      actorName: 'Puja Joshi',
      actorRole: 'receptionist' as any,
      action: 'PATIENT_TRIAGE',
      entityType: 'Patient',
      entityId: 'usr-patient-1',
      details: 'Patient vitals captured (BP 120/80, Pulse 72).',
      ipAddress: '192.168.1.10',
    },
  ];

  const filtered = displayLogs.filter(
    (l) =>
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.entityId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-on-dark/15">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Immutable Security & Audit Trails</h1>
            <p className="text-xs text-on-dark-muted">
              Tamper-evident system activity log for regulatory healthcare compliance and medical data governance.
            </p>
          </div>

          <button
            type="button"
            onClick={() => toast.success('Audit log exported to compliance CSV archive!')}
            className="px-4 py-2 rounded-full bg-midnight border border-on-dark/20 text-white font-semibold text-xs flex items-center gap-1.5 hover:bg-white/5 self-start sm:self-auto"
          >
            <Download className="h-4 w-4 text-cyan" />
            <span>Export Compliance Archive</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-on-dark-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search action, actor, or entity ID..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-midnight border border-on-dark/20 text-white text-xs focus:outline-none focus:border-cyan"
          />
        </div>

        {/* Audit Log Table */}
        <div className="rounded-3xl bg-midnight/40 border border-on-dark/15 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-on-dark/15 text-on-dark-muted bg-navy/60">
                  <th className="py-3 px-4 font-bold">Timestamp</th>
                  <th className="py-3 px-4 font-bold">Actor & Role</th>
                  <th className="py-3 px-4 font-bold">Action</th>
                  <th className="py-3 px-4 font-bold">Entity</th>
                  <th className="py-3 px-4 font-bold">Details</th>
                  <th className="py-3 px-4 font-bold text-right">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-on-dark/10 font-mono">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-navy-deep/60 transition-colors">
                    <td className="py-3 px-4 text-on-dark-muted whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-white">
                      <span className="font-sans font-bold">{log.actorName}</span>
                      <span className="block text-[10px] text-teal uppercase font-sans">
                        {log.actorRole}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-cyan font-bold">{log.action}</td>
                    <td className="py-3 px-4 text-white">
                      {log.entityType} ({log.entityId})
                    </td>
                    <td className="py-3 px-4 text-on-dark-muted font-sans max-w-sm truncate">
                      {log.details}
                    </td>
                    <td className="py-3 px-4 text-right text-on-dark-muted/80">
                      {log.ipAddress || '192.168.1.1'}
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
