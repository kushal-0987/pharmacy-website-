import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useHealthcare } from '@/lib/healthcare-store';
import { Role } from '@/types/healthcare';
import { ManageUserRolesModal, ROLE_CONFIG } from '@/components/admin/ManageUserRolesModal';
import {
  User,
  ChevronDown,
  Check,
  Lock,
  ShieldCheck,
  LogOut,
  LogIn,
  Settings,
  Bell,
  Sparkles,
} from 'lucide-react';

export const UserRoleDropdown: React.FC = () => {
  const { currentRole, currentUser, activeAccount, logout, users } = useHealthcare();
  const [open, setOpen] = useState(false);
  const [manageModalOpen, setManageModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roleLabels: Record<Role, string> = {
    patient: 'Patient',
    doctor: 'Doctor',
    pharmacist: 'Pharmacist',
    lab_staff: 'Lab Tech',
    receptionist: 'Receptionist',
    delivery: 'Delivery Rider',
    admin: 'Super Admin',
  };

  // Seed sample names for display in dropdown list
  const sampleRoleUsers: { role: Role; sampleName: string }[] = [
    { role: 'patient', sampleName: 'Bikash' },
    { role: 'doctor', sampleName: 'Dr. Suresh' },
    { role: 'pharmacist', sampleName: 'Ph. Manish' },
    { role: 'lab_staff', sampleName: 'Rohan' },
    { role: 'receptionist', sampleName: 'Puja' },
    { role: 'delivery', sampleName: 'Prakash' },
    { role: 'admin', sampleName: 'Kushal Pokhrel' },
  ];

  const currentRoleCfg = ROLE_CONFIG[currentRole];
  const CurrentIcon = currentRoleCfg.icon;

  // Short display name: First name of active account or current user
  const displayName = activeAccount
    ? activeAccount.fullName.split(' ')[0]
    : currentUser.name.split(' ')[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Navbar Role Pill Trigger matching Reference Screenshot */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF5FF] hover:bg-[#DDF0FF] border border-blue-200 text-[#0755D9] transition-all shadow-xs cursor-pointer group"
        aria-label="View current role and permissions"
      >
        <div className="h-5 w-5 rounded-full bg-[#0755D9] text-white flex items-center justify-center text-[10px] font-bold">
          <CurrentIcon className="h-3 w-3" />
        </div>
        <span className="text-xs font-bold tracking-tight text-[#082653]">
          {roleLabels[currentRole]} ({displayName})
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-[#0755D9] transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu matching exact Reference Screenshot */}
      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-blue-100 shadow-2xl p-2 z-[90] animate-in fade-in-50 zoom-in-95 text-[#10243B]">
          {/* Header */}
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5 border-b border-slate-100">
            <User className="h-3.5 w-3.5 text-[#0755D9]" />
            <span>Current Role</span>
          </div>

          {/* List of Roles */}
          <div className="py-1.5 space-y-1">
            {sampleRoleUsers.map((item) => {
              const isSelected = item.role === currentRole;
              const cfg = ROLE_CONFIG[item.role];
              const Icon = cfg.icon;

              return (
                <div
                  key={item.role}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                    isSelected
                      ? 'bg-[#EBF5FF] text-[#0755D9] font-bold border border-blue-200/80 shadow-xs'
                      : 'text-[#64748B] opacity-75 hover:bg-slate-50 cursor-not-allowed'
                  }`}
                  title={
                    isSelected
                      ? 'Currently active authenticated role'
                      : 'Role switching is restricted. Contact Super Admin to change your role.'
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${isSelected ? 'text-[#0755D9]' : 'text-slate-400'}`} />
                    <span>
                      {roleLabels[item.role]} ({item.sampleName})
                    </span>
                  </div>

                  {isSelected ? (
                    <Check className="h-4 w-4 text-[#0755D9]" />
                  ) : (
                    <Lock className="h-3.5 w-3.5 text-slate-300" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer Notice matching Mockup */}
          <div className="mt-1 pt-2 border-t border-slate-100 px-3 py-2 text-[11px] text-[#64748B] bg-slate-50 rounded-xl space-y-2">
            <div className="flex items-start gap-1.5">
              <Lock className="h-3.5 w-3.5 text-[#0755D9] shrink-0 mt-0.5" />
              <span className="leading-tight">Role changes are restricted. Contact Admin for access.</span>
            </div>

            {/* If Super Admin, show Manage User Roles CTA */}
            {currentRole === 'admin' && (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setManageModalOpen(true);
                }}
                className="w-full mt-1 py-2 px-3 rounded-xl bg-[#082653] hover:bg-[#0755D9] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-[#00AAFF]" />
                <span>Manage User Roles</span>
              </button>
            )}

            {/* Account Switcher / Sign Out */}
            <div className="pt-1 flex items-center justify-between text-[11px] font-semibold border-t border-slate-200/60">
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="text-[#0755D9] hover:underline flex items-center gap-1"
              >
                <LogIn className="h-3 w-3" />
                <span>Switch Account</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  logout();
                  navigate({ to: '/login' });
                }}
                className="text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="h-3 w-3" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Super Admin Modal */}
      <ManageUserRolesModal open={manageModalOpen} onClose={() => setManageModalOpen(false)} />
    </div>
  );
};
