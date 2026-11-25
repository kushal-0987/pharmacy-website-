import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ManageUserRolesModal } from '@/components/admin/ManageUserRolesModal';
import { Role } from '@/types/healthcare';
import {
  Users,
  ShieldCheck,
  Plus,
  Mail,
  Phone,
  CheckCircle2,
  Lock,
  UserPlus,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/staff')({
  head: () => ({
    meta: [
      { title: 'Staff & Personnel Directory — Two Brothers Healthcare' },
      { name: 'description', content: 'Manage clinic staff, pharmacists, laboratory technicians, and role assignments.' },
    ],
  }),
  component: AdminStaffPage,
});

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  dutyArea: string;
  status: 'Active' | 'On Leave';
  lastActive: string;
}

function AdminStaffPage() {
  const [manageRolesOpen, setManageRolesOpen] = useState(false);
  const [staffList, setStaffList] = useState<StaffMember[]>([
    {
      id: 'stf-1',
      name: 'Dr. Suresh Shrestha',
      email: 'suresh@twobrothershealthcare.com',
      phone: '9841000001',
      role: 'doctor',
      dutyArea: 'Internal Medicine Suite',
      status: 'Active',
      lastActive: '10 mins ago',
    },
    {
      id: 'stf-2',
      name: 'Ph. Manish Shrestha',
      email: 'manish@twobrothershealthcare.com',
      phone: '9841000002',
      role: 'pharmacist',
      dutyArea: 'Main 24/7 Dispensary',
      status: 'Active',
      lastActive: 'Online',
    },
    {
      id: 'stf-3',
      name: 'Rohan Shakya',
      email: 'rohan@twobrothershealthcare.com',
      phone: '9841000003',
      role: 'lab_staff',
      dutyArea: 'Hematology Analyzer Bay',
      status: 'Active',
      lastActive: '30 mins ago',
    },
    {
      id: 'stf-4',
      name: 'Puja Joshi',
      email: 'puja@twobrothershealthcare.com',
      phone: '9841000004',
      role: 'receptionist',
      dutyArea: 'OPD Front Desk & Triage',
      status: 'Active',
      lastActive: 'Online',
    },
    {
      id: 'stf-5',
      name: 'Prakash Tamang',
      email: 'prakash@twobrothershealthcare.com',
      phone: '9841000005',
      role: 'delivery',
      dutyArea: 'Lalitpur Logistics & Courier',
      status: 'Active',
      lastActive: 'En Route',
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<Role>('doctor');
  const [newDuty, setNewDuty] = useState('Sanagau Clinic');

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newStaff: StaffMember = {
      id: 'stf-' + Date.now(),
      name: newName,
      email: newEmail,
      phone: newPhone,
      role: newRole,
      dutyArea: newDuty,
      status: 'Active',
      lastActive: 'Invited',
    };

    setStaffList((prev) => [newStaff, ...prev]);
    toast.success(`Staff member ${newName} registered with role ${newRole.toUpperCase()}!`);
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setShowAddModal(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-on-dark/15">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Clinical & Operational Staff</h1>
            <p className="text-xs text-on-dark-muted">
              Manage clinicians, pharmacy dispensers, lab phlebotomists, and logistics personnel.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setManageRolesOpen(true)}
              className="px-5 py-2.5 rounded-full bg-white text-[#082653] font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 hover:bg-slate-100 transition-all cursor-pointer"
            >
              <UserPlus className="h-4 w-4 text-[#0755D9]" />
              <span>Manage User Accounts</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAddModal(!showAddModal)}
              className="px-5 py-2.5 rounded-full bg-cyan text-navy-deep font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 hover:scale-105 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Staff Member</span>
            </button>
          </div>
        </div>

        {/* Add Staff Form */}
        {showAddModal && (
          <form
            onSubmit={handleAddStaff}
            className="p-6 rounded-3xl bg-midnight/70 border border-teal/40 space-y-4 text-xs animate-in fade-in shadow-2xl"
          >
            <h3 className="font-bold text-white text-base">Register Employee / Duty Clinician</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-white font-semibold block mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Dr. Sabina Maharjan"
                  className="w-full px-3 py-2.5 rounded-xl bg-navy-deep border border-on-dark/20 text-white"
                />
              </div>
              <div>
                <label className="text-white font-semibold block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="sabina@twobrothershealthcare.com"
                  className="w-full px-3 py-2.5 rounded-xl bg-navy-deep border border-on-dark/20 text-white"
                />
              </div>
              <div>
                <label className="text-white font-semibold block mb-1">Mobile Phone (10 Digits)</label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="9841000000"
                  className="w-full px-3 py-2.5 rounded-xl bg-navy-deep border border-on-dark/20 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-white font-semibold block mb-1">System Role & Permissions</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as Role)}
                  className="w-full px-3 py-2 rounded-xl bg-navy-deep border border-on-dark/20 text-white"
                >
                  <option value="doctor">Doctor / Consultant (OPD & Notes)</option>
                  <option value="pharmacist">Pharmacist (Prescription & Stock)</option>
                  <option value="lab_staff">Lab Technician (Diagnostics Entry)</option>
                  <option value="receptionist">Receptionist (Front Desk Flow)</option>
                  <option value="delivery">Delivery Staff (Courier Kanban)</option>
                  <option value="admin">Super Admin (Facility Management)</option>
                </select>
              </div>

              <div>
                <label className="text-white font-semibold block mb-1">Assigned Station / Department</label>
                <input
                  type="text"
                  required
                  value={newDuty}
                  onChange={(e) => setNewDuty(e.target.value)}
                  placeholder="e.g. Pediatric Clinic / Phlebotomy Room"
                  className="w-full px-3 py-2 rounded-xl bg-navy-deep border border-on-dark/20 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-1.5 rounded-full text-on-dark-muted hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-full bg-cyan text-navy-deep font-bold"
              >
                Save & Issue Credentials
              </button>
            </div>
          </form>
        )}

        {/* Staff Table */}
        <div className="rounded-3xl bg-midnight/40 border border-on-dark/15 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-on-dark/15 text-on-dark-muted bg-navy/60">
                  <th className="py-3 px-4 font-bold">Staff Name</th>
                  <th className="py-3 px-4 font-bold">Role</th>
                  <th className="py-3 px-4 font-bold">Duty Station</th>
                  <th className="py-3 px-4 font-bold">Contact</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold text-right">Telemetry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-on-dark/10">
                {staffList.map((stf) => (
                  <tr key={stf.id} className="hover:bg-navy-deep/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white text-sm">{stf.name}</div>
                      <div className="text-[11px] text-teal">{stf.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase bg-teal/20 text-cyan border border-teal/30">
                        {stf.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white">{stf.dutyArea}</td>
                    <td className="py-3 px-4 text-on-dark-muted">{stf.phone}</td>
                    <td className="py-3 px-4">
                      <span className="text-leaf font-bold text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> {stf.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-on-dark-muted">{stf.lastActive}</td>
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
