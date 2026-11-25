import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ManageUserRolesModal } from '@/components/admin/ManageUserRolesModal';
import {
  Lock,
  ShieldCheck,
  Check,
  X,
  Plus,
  Save,
  UserPlus,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/roles')({
  head: () => ({
    meta: [
      { title: 'Roles & RBAC Permission Matrix — Two Brothers Healthcare' },
      { name: 'description', content: 'Enterprise Role-Based Access Control matrix for clinicians, pharmacists, and staff.' },
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
      label: 'Access Financial & Audit Reports',
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

  const togglePerm = (rowKey: string, role: keyof PermissionRow) => {
    setPermissions((prev) =>
      prev.map((row) =>
        row.key === rowKey ? { ...row, [role]: !row[role] } : row
      )
    );
  };

  const handleSaveMatrix = () => {
    toast.success('RBAC Permission Matrix successfully committed!');
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-on-dark/15">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Roles & Permissions Matrix (RBAC)</h1>
            <p className="text-xs text-on-dark-muted">
              Role-Based Access Control matrix governing medical record access and operational capabilities.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setManageRolesOpen(true)}
              className="px-5 py-2.5 rounded-full bg-white text-[#082653] font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 hover:bg-slate-100 transition-all cursor-pointer"
            >
              <UserPlus className="h-4 w-4 text-[#0755D9]" />
              <span>Manage User Roles</span>
            </button>

            <button
              type="button"
              onClick={handleSaveMatrix}
              className="px-6 py-2.5 rounded-full bg-cyan text-navy-deep font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 hover:scale-105 transition-all"
            >
              <Save className="h-4 w-4" />
              <span>Commit Matrix Changes</span>
            </button>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="rounded-3xl bg-midnight/40 border border-on-dark/15 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-on-dark/15 text-on-dark-muted bg-navy/60">
                  <th className="py-3 px-4 font-bold">Permission Capability</th>
                  <th className="py-3 px-2 font-bold text-center">Patient</th>
                  <th className="py-3 px-2 font-bold text-center">Doctor</th>
                  <th className="py-3 px-2 font-bold text-center">Pharmacist</th>
                  <th className="py-3 px-2 font-bold text-center">Lab Tech</th>
                  <th className="py-3 px-2 font-bold text-center">Reception</th>
                  <th className="py-3 px-2 font-bold text-center">Delivery</th>
                  <th className="py-3 px-2 font-bold text-center">Super Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-on-dark/10">
                {permissions.map((perm) => (
                  <tr key={perm.key} className="hover:bg-navy-deep/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white text-sm">{perm.label}</div>
                      <div className="text-[10px] text-teal uppercase">{perm.category}</div>
                    </td>

                    {(['patient', 'doctor', 'pharmacist', 'lab_staff', 'receptionist', 'delivery', 'admin'] as const).map(
                      (role) => (
                        <td key={role} className="py-3 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => togglePerm(perm.key, role)}
                            className={`h-7 w-7 rounded-lg inline-flex items-center justify-center transition-colors ${
                              perm[role]
                                ? 'bg-leaf/20 text-leaf border border-leaf/40'
                                : 'bg-on-dark/5 text-on-dark-muted/40 hover:text-white'
                            }`}
                          >
                            {perm[role] ? <Check className="h-4 w-4" /> : <X className="h-3 w-3" />}
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

      <ManageUserRolesModal
        open={manageRolesOpen}
        onClose={() => setManageRolesOpen(false)}
      />
    </AdminLayout>
  );
}
