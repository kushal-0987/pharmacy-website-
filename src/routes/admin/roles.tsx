import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ManageUserRolesModal } from '@/components/admin/ManageUserRolesModal';
import { useHealthcare } from '@/lib/healthcare-store';
import {
  Check,
  X,
  Save,
  UserPlus,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/roles')({
  head: () => ({
    meta: [
      { title: 'Users & Roles (RBAC) — Two Brothers Healthcare' },
      { name: 'description', content: 'Enterprise Role-Based Access Control matrix and Super Admin user account management.' },
    ],
  }),
  component: AdminRolesPage,
});

interface PermissionRow {
  key: string;
  label: string;
  category: string;
  patient: boolean;
  doctor: boolean;
  pharmacist: boolean;
  lab_staff: boolean;
  receptionist: boolean;
  delivery: boolean;
  admin: boolean;
}

function AdminRolesPage() {
  const { users } = useHealthcare();
  const [manageRolesOpen, setManageRolesOpen] = useState(false);
  const [permissions, setPermissions] = useState<PermissionRow[]>([
    {
      key: 'view_appointments',
      label: 'View Appointments Roster',
      category: 'Appointments',
      patient: true,
      doctor: true,
      pharmacist: false,
      lab_staff: true,
      receptionist: true,
      delivery: false,
      admin: true,
    },
    {
      key: 'manage_clinical_notes',
      label: 'Record & Sign Clinical Notes',
      category: 'Appointments',
      patient: false,
      doctor: true,
      pharmacist: false,
      lab_staff: false,
      receptionist: false,
      delivery: false,
      admin: true,
    },
    {
      key: 'dispense_medicines',
      label: 'Dispense & Verify Prescriptions',
      category: 'Pharmacy',
      patient: false,
      doctor: false,
      pharmacist: true,
      lab_staff: false,
      receptionist: false,
      delivery: false,
      admin: true,
    },
    {
      key: 'enter_lab_results',
      label: 'Enter & Sign Diagnostic Tests',
      category: 'Laboratory',
      patient: false,
      doctor: true,
      pharmacist: false,
      lab_staff: true,
      receptionist: false,
      delivery: false,
      admin: true,
    },
    {
      key: 'update_delivery_kanban',
      label: 'Update Courier Status & Proof',
      category: 'Logistics',
      patient: false,
      doctor: false,
      pharmacist: true,
      lab_staff: false,
      receptionist: false,
      delivery: true,
      admin: true,
    },
    {
      key: 'financial_reporting',
      label: 'Access Financial Revenue Analytics',
      category: 'Executive',
      patient: false,
      doctor: false,
      pharmacist: false,
      lab_staff: false,
      receptionist: false,
      delivery: false,
      admin: true,
    },
  ]);

  const togglePermission = (key: string, role: keyof Omit<PermissionRow, 'key' | 'label' | 'category'>) => {
    if (role === 'admin') {
      toast.info('Super Admin retains immutable all-access clearance.');
      return;
    }
    setPermissions((prev) =>
      prev.map((row) => (row.key === key ? { ...row, [role]: !row[role] } : row))
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#082653]">Users &amp; Roles (RBAC)</h1>
            <p className="text-xs text-[#64748B] mt-0.5">
              Manage authenticated accounts ({users.length} total users) and Role-Based Access Control permissions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setManageRolesOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#0755D9] hover:bg-[#082653] text-white font-semibold text-xs inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              <span>Manage User Accounts</span>
            </button>

            <button
              type="button"
              onClick={() => toast.success('RBAC Permission Matrix saved.')}
              className="px-4 py-2.5 rounded-xl bg-white border border-[#D9E8FF] text-[#082653] hover:bg-[#E6F5FF] font-semibold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Save className="h-4 w-4 text-[#0755D9]" />
              <span>Save Matrix</span>
            </button>
          </div>
        </div>

        {/* Security Summary Card */}
        <div className="bg-white rounded-2xl border border-[#D9E8FF] p-4 shadow-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#E6F5FF] text-[#0755D9] flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#082653]">Role Switching Strictly Restricted</div>
              <div className="text-[11px] text-[#64748B]">
                Only Super Admin can create accounts, reset passwords, or reassign roles across the platform.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setManageRolesOpen(true)}
            className="text-xs font-semibold text-[#0755D9] hover:underline shrink-0 cursor-pointer"
          >
            Open User Registry →
          </button>
        </div>

        {/* Matrix Table */}
        <div className="bg-white rounded-2xl border border-[#E2ECFA] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F4F8FE] border-b border-slate-100 text-[#64748B]">
                  <th className="py-3.5 px-4 font-semibold">Permission Capability</th>
                  <th className="py-3.5 px-2 font-semibold text-center">Patient</th>
                  <th className="py-3.5 px-2 font-semibold text-center">Doctor</th>
                  <th className="py-3.5 px-2 font-semibold text-center">Pharmacist</th>
                  <th className="py-3.5 px-2 font-semibold text-center">Lab Tech</th>
                  <th className="py-3.5 px-2 font-semibold text-center">Reception</th>
                  <th className="py-3.5 px-2 font-semibold text-center">Delivery</th>
                  <th className="py-3.5 px-2 font-semibold text-center text-[#0755D9]">Super Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {permissions.map((perm) => (
                  <tr key={perm.key} className="hover:bg-[#F4F8FE]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#10243B]">{perm.label}</div>
                      <div className="text-[10px] font-semibold uppercase text-[#0755D9]">{perm.category}</div>
                    </td>
                    {(['patient', 'doctor', 'pharmacist', 'lab_staff', 'receptionist', 'delivery', 'admin'] as const).map(
                      (role) => (
                        <td key={role} className="py-3.5 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => togglePermission(perm.key, role)}
                            className={`h-7 w-7 rounded-lg inline-flex items-center justify-center transition-colors cursor-pointer ${
                              perm[role]
                                ? 'bg-emerald-50 text-[#10B981] border border-emerald-200'
                                : 'bg-slate-50 text-slate-300 border border-slate-200 hover:text-[#64748B]'
                            }`}
                          >
                            {perm[role] ? <Check className="h-4 w-4" /> : <X className="h-3.5 w-3.5" />}
                          </button>
                        </td>
                      )
                    )}
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
