import { createFileRoute } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import {
  History,
  Search,
  Download,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/audit')({
  head: () => ({
    meta: [
      { title: 'System Audit Logs — Two Brothers Healthcare' },
      { name: 'description', content: 'Tamper-evident system audit logs for account, booking, and inventory events.' },
    ],
  }),
  component: AdminAuditPage,
});

function AdminAuditPage() {
  const { auditLogs } = useHealthcare();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return auditLogs.filter(
      (l) =>
        !q ||
        l.action.toLowerCase().includes(q) ||
        l.actorName.toLowerCase().includes(q) ||
        l.entityId.toLowerCase().includes(q) ||
        l.details.toLowerCase().includes(q)
    );
  }, [auditLogs, searchTerm]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#082653]">System Audit Logs</h1>
            <p className="text-xs text-[#64748B] mt-0.5">
              Security and operational activity log recorded across authentication, bookings, and pharmacy stock.
            </p>
          </div>

          <button
            type="button"
            onClick={() => toast.success('Audit log snapshot ready.')}
            className="px-4 py-2 rounded-xl bg-white border border-[#D9E8FF] text-[#082653] hover:bg-[#E6F5FF] font-semibold text-xs inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Download className="h-4 w-4 text-[#0755D9]" />
            <span>Export Log</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2ECFA] p-4 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search action, actor, or entity ID..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-xs text-[#10243B]"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2ECFA] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F4F8FE] border-b border-slate-100 text-[#64748B]">
                  <th className="py-3.5 px-4 font-semibold">Timestamp</th>
                  <th className="py-3.5 px-4 font-semibold">Actor &amp; Role</th>
                  <th className="py-3.5 px-4 font-semibold">Action</th>
                  <th className="py-3.5 px-4 font-semibold">Entity</th>
                  <th className="py-3.5 px-4 font-semibold">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-[#64748B]">
                      <History className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                      No audit events recorded in this session yet. Perform an account, booking, or stock action to generate entries.
                    </td>
                  </tr>
                ) : (
                  filtered.map((log) => (
                    <tr key={log.id} className="hover:bg-[#F4F8FE]/60">
                      <td className="py-3 px-4 font-mono text-[11px] text-[#64748B] whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-[#10243B]">{log.actorName}</span>
                        <span className="ml-1.5 px-2 py-0.5 rounded-md bg-[#E6F5FF] text-[#0755D9] text-[10px] font-semibold uppercase">
                          {log.actorRole}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-[#082653]">{log.action}</td>
                      <td className="py-3 px-4 text-[#0755D9] font-medium">
                        {log.entityType} ({log.entityId})
                      </td>
                      <td className="py-3 px-4 text-[#64748B]">{log.details}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
