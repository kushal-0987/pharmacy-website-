import { createFileRoute } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ManageUserRolesModal } from '@/components/admin/ManageUserRolesModal';
import { useHealthcare } from '@/lib/healthcare-store';
import {
  CheckCircle2,
  UserPlus,
  Search,
} from 'lucide-react';

export const Route = createFileRoute('/admin/staff')({
  head: () => ({
    meta: [
      { title: 'Staff Management — Two Brothers Healthcare' },
      { name: 'description', content: 'Manage clinic staff, doctors, pharmacists, lab technicians, and role accounts.' },
    ],
  }),
  component: AdminStaffPage,
});

function AdminStaffPage() {
  const { users } = useHealthcare();
  const [manageRolesOpen, setManageRolesOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const staffAccounts = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return users
      .filter((u) => u.role !== 'patient')
      .filter(
        (u) =>
          !q ||
          u.fullName.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q)
      );
  }, [users, searchTerm]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#082653]">Staff Management</h1>
            <p className="text-xs text-[#64748B] mt-0.5">
              Authorized doctors, pharmacists, laboratory technicians, receptionists, and delivery riders.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setManageRolesOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#0755D9] hover:bg-[#082653] text-white font-semibold text-xs inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <UserPlus className="h-4 w-4" />
            <span>Create / Manage Staff Accounts</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2ECFA] p-4 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search staff name, username, or role..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-xs text-[#10243B]"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2ECFA] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F4F8FE] border-b border-slate-100 text-[#64748B]">
                  <th className="py-3.5 px-4 font-semibold">Staff Member</th>
                  <th className="py-3.5 px-4 font-semibold">Username</th>
                  <th className="py-3.5 px-4 font-semibold">Assigned Role</th>
                  <th className="py-3.5 px-4 font-semibold">Phone</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {staffAccounts.map((stf) => (
                  <tr key={stf.id} className="hover:bg-[#F4F8FE]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#10243B]">{stf.fullName}</div>
                      <div className="text-[11px] text-[#64748B]">{stf.email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#0755D9]">{stf.username}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E6F5FF] text-[#0755D9] border border-blue-200 capitalize">
                        {stf.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#64748B]">{stf.phone || '—'}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 font-semibold text-[11px] ${
                          stf.status === 'active' ? 'text-[#10B981]' : 'text-[#EF4444]'
                        }`}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span className="capitalize">{stf.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-[#64748B]">
                      {stf.createdAt.slice(0, 10)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ManageUserRolesModal open={manageRolesOpen} onClose={() => setManageRolesOpen(false)} />
    </AdminLayout>
  );
}
