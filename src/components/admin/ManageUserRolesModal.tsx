import React, { useState } from 'react';
import { useHealthcare } from '@/lib/healthcare-store';
import { Role, UserAccount } from '@/types/healthcare';
import {
  ShieldCheck,
  X,
  UserPlus,
  Users,
  Search,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Lock,
  User,
  Stethoscope,
  Pill,
  FlaskConical,
  Headphones,
  Truck,
  ShieldAlert,
} from 'lucide-react';
import { toast } from 'sonner';

interface ManageUserRolesModalProps {
  open: boolean;
  onClose: () => void;
}

export const ROLE_CONFIG: Record<
  Role,
  { label: string; icon: React.FC<{ className?: string }>; colorClass: string; bgClass: string }
> = {
  patient: {
    label: 'Patient',
    icon: User,
    colorClass: 'text-[#0755D9]',
    bgClass: 'bg-[#EBF5FF] border-blue-200',
  },
  doctor: {
    label: 'Doctor',
    icon: Stethoscope,
    colorClass: 'text-[#00AAFF]',
    bgClass: 'bg-cyan-50 border-cyan-200',
  },
  pharmacist: {
    label: 'Pharmacist',
    icon: Pill,
    colorClass: 'text-[#19C99A]',
    bgClass: 'bg-emerald-50 border-emerald-200',
  },
  lab_staff: {
    label: 'Lab Tech',
    icon: FlaskConical,
    colorClass: 'text-purple-600',
    bgClass: 'bg-purple-50 border-purple-200',
  },
  receptionist: {
    label: 'Receptionist',
    icon: Headphones,
    colorClass: 'text-amber-600',
    bgClass: 'bg-amber-50 border-amber-200',
  },
  delivery: {
    label: 'Delivery Rider',
    icon: Truck,
    colorClass: 'text-teal-600',
    bgClass: 'bg-teal-50 border-teal-200',
  },
  admin: {
    label: 'Super Admin',
    icon: ShieldCheck,
    colorClass: 'text-[#082653]',
    bgClass: 'bg-indigo-50 border-indigo-200 font-bold',
  },
};

export const ManageUserRolesModal: React.FC<ManageUserRolesModalProps> = ({ open, onClose }) => {
  const {
    users,
    currentRole,
    activeAccount,
    adminCreateUser,
    adminUpdateUser,
    adminResetPassword,
    adminToggleUserStatus,
    adminDeleteUser,
  } = useHealthcare();

  // Create user form state
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Edit User State
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [editRole, setEditRole] = useState<Role>('patient');
  const [editFullName, setEditFullName] = useState('');

  // Password Reset Result modal/toast
  const [resetResult, setResetResult] = useState<{ username: string; tempPass: string } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password.trim()) {
      toast.error('Please fill in username, email, and password.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await adminCreateUser({
        fullName: fullName.trim() || username.trim(),
        username: username.trim(),
        email: email.trim(),
        role: selectedRole,
        tempPassword: password,
      });

      if (res.success) {
        toast.success(`User ${username} created with role ${ROLE_CONFIG[selectedRole].label}!`);
        setFullName('');
        setUsername('');
        setEmail('');
        setPassword('');
        setSelectedRole('patient');
      } else {
        toast.error(res.error || 'Failed to create user.');
      }
    } catch {
      toast.error('An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (user: UserAccount) => {
    const res = await adminResetPassword(user.id);
    if (res.success && res.tempPassword) {
      setResetResult({ username: user.username, tempPass: res.tempPassword });
      toast.success(`Temporary password generated for ${user.username}`);
    } else {
      toast.error(res.error || 'Failed to reset password.');
    }
  };

  const handleToggleStatus = async (user: UserAccount) => {
    const res = await adminToggleUserStatus(user.id);
    if (res.success) {
      toast.success(`Status updated for ${user.username}`);
    } else {
      toast.error(res.error || 'Failed to update status.');
    }
  };

  const handleDeleteUser = async (user: UserAccount) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${user.username}"?`)) {
      return;
    }
    const res = await adminDeleteUser(user.id);
    if (res.success) {
      toast.success(`Account ${user.username} deleted.`);
    } else {
      toast.error(res.error || 'Failed to delete user.');
    }
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    const res = await adminUpdateUser(editingUser.id, {
      fullName: editFullName.trim() || editingUser.fullName,
      role: editRole,
    });
    if (res.success) {
      toast.success(`Updated ${editingUser.username}'s profile and role to ${ROLE_CONFIG[editRole].label}`);
      setEditingUser(null);
    } else {
      toast.error(res.error || 'Failed to update user.');
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-[#082653]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header Bar matching Reference UI */}
        <div className="bg-[#082653] text-white px-6 py-4.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#0755D9] text-[#00AAFF] flex items-center justify-center shadow-md">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-white tracking-tight">Manage User Roles</h2>
              <p className="text-[11px] text-blue-200">Super Admin User & RBAC Management Console</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 rounded-full text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 text-[#10243B]">
          {/* Notice Box */}
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#EBF5FF] border border-blue-200 text-[#0755D9] text-xs leading-relaxed">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-[#0755D9]" />
            <div>
              <strong className="font-bold">Security Notice: </strong>
              Only Super Admin can assign roles and provision accounts. Role switching is strictly governed by authenticated credentials.
            </div>
          </div>

          {/* Section 1: Add New User */}
          <div className="p-5 rounded-3xl bg-[#F2F8FF] border border-blue-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#082653]">
              <UserPlus className="h-4 w-4 text-[#0755D9]" />
              <span>Add New User</span>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Full Name */}
                <div>
                  <label className="text-[11px] font-semibold text-[#64748B] block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Dr. Rajesh KC"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-blue-200 text-xs text-[#10243B] focus:outline-none focus:border-[#0755D9]"
                  />
                </div>

                {/* Username */}
                <div>
                  <label className="text-[11px] font-semibold text-[#64748B] block mb-1">Username</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. rajeshkc"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-blue-200 text-xs text-[#10243B] focus:outline-none focus:border-[#0755D9]"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-[11px] font-semibold text-[#64748B] block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. rajesh@twobrothers.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-blue-200 text-xs text-[#10243B] focus:outline-none focus:border-[#0755D9]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-[#64748B]">Initial Password</label>
                    <button
                      type="button"
                      onClick={() => setPassword('Temp@' + Math.floor(1000 + Math.random() * 9000))}
                      className="text-[10px] text-[#0755D9] hover:underline"
                    >
                      Generate Temp
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Set secure password"
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-white border border-blue-200 text-xs text-[#10243B] focus:outline-none focus:border-[#0755D9]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#082653]"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Assign Role */}
                <div>
                  <label className="text-[11px] font-semibold text-[#64748B] block mb-1">Assign Role</label>
                  <div className="relative">
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as Role)}
                      aria-label="Assign Role"
                      className="w-full pl-3.5 pr-8 py-2.5 rounded-xl bg-white border border-blue-200 text-xs font-semibold text-[#082653] focus:outline-none focus:border-[#0755D9] cursor-pointer"
                    >
                      <option value="patient">Patient</option>
                      <option value="doctor">Doctor</option>
                      <option value="pharmacist">Pharmacist</option>
                      <option value="lab_staff">Lab Tech</option>
                      <option value="receptionist">Receptionist</option>
                      <option value="delivery">Delivery Rider</option>
                      <option value="admin">Super Admin</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-full bg-[#0755D9] hover:bg-[#00AAFF] text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>{submitting ? 'Creating...' : '+ Create User'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Section 2: Manage Existing Users */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-bold text-[#082653]">
                <Users className="h-4 w-4 text-[#0755D9]" />
                <span>Manage Existing Users ({users.length})</span>
              </div>

              {/* Search & Filter */}
              <div className="flex items-center gap-2">
                <div className="relative w-full sm:w-64">
                  <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search users..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-blue-100 text-xs text-[#10243B] focus:outline-none focus:border-[#0755D9]"
                  />
                </div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  aria-label="Filter by role"
                  className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-blue-100 text-xs font-medium text-[#64748B] focus:outline-none focus:border-[#0755D9]"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Super Admin</option>
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="pharmacist">Pharmacist</option>
                  <option value="lab_staff">Lab Tech</option>
                  <option value="receptionist">Receptionist</option>
                  <option value="delivery">Delivery</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="rounded-2xl border border-blue-100 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F2F8FF] border-b border-blue-100 text-[#64748B] uppercase font-bold text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((u) => {
                      const cfg = ROLE_CONFIG[u.role];
                      const Icon = cfg.icon;
                      const isPrimaryAdmin = u.id === 'usr-admin-1';
                      const isCurrent = activeAccount?.id === u.id;

                      return (
                        <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                          {/* User info */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="h-8 w-8 rounded-full bg-blue-100/70 text-[#0755D9] font-bold flex items-center justify-center shrink-0">
                                {u.fullName.charAt(0)}
                              </div>
                              <div>
                                <div className="font-bold text-[#082653] flex items-center gap-1.5">
                                  <span>{u.fullName}</span>
                                  {isCurrent && (
                                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-100 text-[#0755D9] font-semibold">
                                      You
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-[#64748B]">@{u.username} · {u.email}</div>
                              </div>
                            </div>
                          </td>

                          {/* Role Badge */}
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] border font-semibold ${cfg.bgClass} ${cfg.colorClass}`}
                            >
                              <Icon className="h-3 w-3 shrink-0" />
                              <span>{cfg.label}</span>
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4">
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(u)}
                              disabled={isPrimaryAdmin}
                              title="Click to toggle status"
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all ${
                                u.status === 'active'
                                  ? 'bg-emerald-50 text-[#19C99A] hover:bg-emerald-100'
                                  : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                              } ${isPrimaryAdmin ? 'cursor-default' : 'cursor-pointer'}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  u.status === 'active' ? 'bg-[#19C99A]' : 'bg-rose-500'
                                }`}
                              />
                              <span className="capitalize">{u.status}</span>
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Edit User Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingUser(u);
                                  setEditRole(u.role);
                                  setEditFullName(u.fullName);
                                }}
                                title="Edit user role & details"
                                className="p-1.5 rounded-lg border border-slate-200 text-[#64748B] hover:text-[#0755D9] hover:bg-blue-50 transition-colors"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>

                              {/* Reset Password Button */}
                              <button
                                type="button"
                                onClick={() => handleResetPassword(u)}
                                title="Reset password (generates temporary password)"
                                className="p-1.5 rounded-lg border border-slate-200 text-[#64748B] hover:text-amber-600 hover:bg-amber-50 transition-colors"
                              >
                                <KeyRound className="h-3.5 w-3.5" />
                              </button>

                              {/* Delete Account Button */}
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(u)}
                                disabled={isPrimaryAdmin}
                                title={
                                  isPrimaryAdmin
                                    ? 'Primary Super Admin account is protected and cannot be deleted.'
                                    : 'Delete user account'
                                }
                                className={`p-1.5 rounded-lg border border-slate-200 transition-colors ${
                                  isPrimaryAdmin
                                    ? 'opacity-30 cursor-not-allowed text-slate-400'
                                    : 'text-[#64748B] hover:text-rose-600 hover:bg-rose-50'
                                }`}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between text-xs text-[#64748B] shrink-0">
          <div className="flex items-center gap-1.5 text-[11px]">
            <ShieldAlert className="h-3.5 w-3.5 text-[#0755D9]" />
            <span>Protected by Two Brothers Healthcare Security Gateways</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-full border border-slate-300 hover:bg-slate-200 font-semibold text-[#082653] transition-colors"
          >
            Done
          </button>
        </div>
      </div>

      {/* Nested Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-blue-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-[#082653]">Edit User: @{editingUser.username}</h3>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#64748B] block mb-1">Full Name</label>
                <input
                  type="text"
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#0755D9]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#64748B] block mb-1">Change Assigned Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as Role)}
                  aria-label="Edit assigned role"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-[#082653] focus:outline-none focus:border-[#0755D9]"
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="pharmacist">Pharmacist</option>
                  <option value="lab_staff">Lab Tech</option>
                  <option value="receptionist">Receptionist</option>
                  <option value="delivery">Delivery Rider</option>
                  <option value="admin">Super Admin</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 rounded-full border border-slate-300 text-xs font-semibold text-[#64748B] hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-5 py-2 rounded-full bg-[#0755D9] text-white text-xs font-bold hover:bg-[#00AAFF] shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Reset Result Notification */}
      {resetResult && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-blue-200 space-y-4 text-center">
            <div className="h-12 w-12 rounded-2xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center">
              <KeyRound className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-base text-[#082653]">Temporary Password Generated</h3>
            <p className="text-xs text-[#64748B]">
              Share this one-time temporary password with <strong>@{resetResult.username}</strong>. They will be prompted to change it upon first login.
            </p>
            <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-between font-mono text-sm font-bold text-[#082653]">
              <span>{resetResult.tempPass}</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(resetResult.tempPass);
                  setCopied(true);
                  toast.success('Temporary password copied to clipboard!');
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="p-1 text-[#0755D9] hover:text-[#00AAFF]"
                title="Copy temporary password"
              >
                {copied ? <Check className="h-4 w-4 text-[#19C99A]" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <button
              type="button"
              onClick={() => setResetResult(null)}
              className="w-full py-2.5 rounded-full bg-[#082653] text-white text-xs font-bold hover:bg-[#0755D9]"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
