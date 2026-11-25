import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useHealthcare } from '@/lib/healthcare-store';
import { useI18n } from '@/lib/i18n';
import { Role } from '@/types/healthcare';
import { ManageUserRolesModal } from '@/components/admin/ManageUserRolesModal';
import {
  MoreVertical,
  User,
  ShieldCheck,
  Bell,
  Settings,
  Info,
  LogIn,
  LogOut,
  LayoutDashboard,
  UserPlus,
  Globe,
  Clock,
  ChevronRight,
} from 'lucide-react';

const ROLE_DISPLAY: Record<Role, string> = {
  patient: 'Patient',
  doctor: 'Doctor',
  pharmacist: 'Pharmacist',
  lab_staff: 'Lab Tech',
  receptionist: 'Receptionist',
  delivery: 'Delivery Rider',
  admin: 'Super Admin',
};

export const ThreeDotAccountMenu: React.FC = () => {
  const { isAuthenticated, activeAccount, currentRole, notifications, logout } = useHealthcare();
  const { lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const [showPublicUpdates, setShowPublicUpdates] = useState(false);
  const [manageModalOpen, setManageModalOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const unreadCount = isAuthenticated ? notifications.filter((n) => !n.read).length : 0;

  const portalRoute =
    currentRole === 'admin'
      ? '/admin'
      : currentRole === 'patient'
        ? '/account'
        : '/staff';

  const profileRoute =
    currentRole === 'admin'
      ? '/admin/settings'
      : currentRole === 'patient'
        ? '/account/profile'
        : '/staff/schedule';

  const notificationsRoute =
    currentRole === 'admin'
      ? '/admin/notifications'
      : currentRole === 'patient'
        ? '/account/notifications'
        : '/staff/messages';

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate({ to: '/login' });
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Vertical Three-Dot Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={isAuthenticated ? 'Account menu' : 'Visitor and access menu'}
        className={`relative h-10 w-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs ${
          open
            ? 'bg-[#0755D9] text-white ring-4 ring-[#00AAFF]/20'
            : 'bg-[#082653] hover:bg-[#0755D9] text-white'
        }`}
      >
        <MoreVertical className="h-4.5 w-4.5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] px-1 rounded-full bg-[#EF4444] text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2.5 w-72 max-w-[calc(100vw-2rem)] rounded-2xl bg-white border border-[#D9E8FF] shadow-[0_16px_48px_rgba(8,38,83,0.16)] p-2 z-[90] animate-in fade-in-50 zoom-in-95 duration-150 text-[#10243B]"
        >
          {/* GUEST VISITOR MENU */}
          {!isAuthenticated || !activeAccount ? (
            <>
              {/* 1. Guest Visitor / Welcome */}
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] mb-1.5">
                <div className="h-10 w-10 rounded-full bg-[#0755D9] text-white flex items-center justify-center shrink-0">
                  <User className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#082653]">Guest Visitor</div>
                  <div className="text-[11px] text-[#64748B] truncate">Welcome to Two Brothers</div>
                </div>
              </div>

              {/* 2. Login / Admin Access */}
              <div className="py-1 space-y-0.5">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-[#082653] hover:bg-[#E6F5FF] hover:text-[#0755D9] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="h-4 w-4 text-[#0755D9]" />
                    <span>Login / Admin Access</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-[#64748B]" />
                </Link>

                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[#10243B] hover:bg-[#F4F8FE] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <LogIn className="h-4 w-4 text-[#0755D9]" />
                    <span>Register Patient Account</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-[#64748B]" />
                </Link>

                {/* 3. Public Notifications / Clinic Updates */}
                <button
                  type="button"
                  onClick={() => setShowPublicUpdates((v) => !v)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[#10243B] hover:bg-[#F4F8FE] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Bell className="h-4 w-4 text-[#0755D9]" />
                    <span>Notifications &amp; Clinic Alerts</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded-full bg-[#E6F5FF] text-[#0755D9] text-[10px] font-bold">
                    2
                  </span>
                </button>

                {showPublicUpdates && (
                  <div className="mx-2 my-1 p-2.5 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] space-y-2 text-[11px]">
                    <div className="flex items-start gap-2">
                      <Clock className="h-3.5 w-3.5 text-[#10B981] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-[#082653]">24/7 Pharmacy Active</div>
                        <div className="text-[#64748B]">Clinic OPD open 7 AM – 8 PM daily.</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Bell className="h-3.5 w-3.5 text-[#0755D9] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-[#082653]">Doorstep Delivery</div>
                        <div className="text-[#64748B]">Same-day medicine delivery across Lalitpur.</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Language & Website Settings */}
                <div className="px-3 py-2 rounded-xl hover:bg-[#F4F8FE] transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs font-medium text-[#10243B]">
                    <Globe className="h-4 w-4 text-[#0755D9]" />
                    <span>Language</span>
                  </div>
                  <div className="flex items-center gap-1 bg-white border border-[#D0E6FC] rounded-full p-0.5">
                    <button
                      type="button"
                      onClick={() => setLang('en')}
                      className={`px-2 py-0.5 text-[10px] rounded-full cursor-pointer transition-colors ${
                        lang === 'en' ? 'bg-[#0755D9] text-white font-bold' : 'text-[#64748B]'
                      }`}
                    >
                      EN
                    </button>
                    <button
                      type="button"
                      onClick={() => setLang('ne')}
                      className={`px-2 py-0.5 text-[10px] rounded-full cursor-pointer transition-colors ${
                        lang === 'ne' ? 'bg-[#0755D9] text-white font-bold' : 'text-[#64748B]'
                      }`}
                    >
                      नेपाली
                    </button>
                  </div>
                </div>

                {/* 5. About This Website */}
                <Link
                  to="/about"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[#10243B] hover:bg-[#F4F8FE] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Info className="h-4 w-4 text-[#0755D9]" />
                    <span>About This Website</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-[#64748B]" />
                </Link>
              </div>
            </>
          ) : (
            /* AUTHENTICATED USER MENU */
            <>
              <div className="px-3 py-2.5 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] mb-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-full bg-[#0755D9] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {activeAccount.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-[#082653] truncate">{activeAccount.fullName}</div>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-[#E6F5FF] text-[#0755D9] border border-blue-200 text-[10px] font-semibold">
                      {ROLE_DISPLAY[activeAccount.role]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="py-1 space-y-0.5">
                <Link
                  to={portalRoute}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#082653] hover:bg-[#E6F5FF] hover:text-[#0755D9] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className="h-4 w-4 text-[#0755D9]" />
                    <span>My Account</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-[#64748B]" />
                </Link>

                <Link
                  to={profileRoute}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[#10243B] hover:bg-[#F4F8FE] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <User className="h-4 w-4 text-[#0755D9]" />
                    <span>My Profile</span>
                  </div>
                </Link>

                <Link
                  to={notificationsRoute}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[#10243B] hover:bg-[#F4F8FE] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Bell className="h-4 w-4 text-[#0755D9]" />
                    <span>Notifications</span>
                  </div>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-[#EF4444] text-white text-[10px] font-bold">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                <Link
                  to={profileRoute}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[#10243B] hover:bg-[#F4F8FE] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Settings className="h-4 w-4 text-[#0755D9]" />
                    <span>Account Settings</span>
                  </div>
                </Link>

                {/* Super Admin Only Option */}
                {activeAccount.role === 'admin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setManageModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#0755D9] bg-[#E6F5FF]/70 hover:bg-[#E6F5FF] transition-colors cursor-pointer"
                  >
                    <UserPlus className="h-4 w-4 text-[#0755D9]" />
                    <span>Manage Users &amp; Roles</span>
                  </button>
                )}

                {/* Language Selector */}
                <div className="px-3 py-2 rounded-xl hover:bg-[#F4F8FE] transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs font-medium text-[#10243B]">
                    <Globe className="h-4 w-4 text-[#0755D9]" />
                    <span>Language</span>
                  </div>
                  <div className="flex items-center gap-1 bg-white border border-[#D0E6FC] rounded-full p-0.5">
                    <button
                      type="button"
                      onClick={() => setLang('en')}
                      className={`px-2 py-0.5 text-[10px] rounded-full cursor-pointer ${
                        lang === 'en' ? 'bg-[#0755D9] text-white font-bold' : 'text-[#64748B]'
                      }`}
                    >
                      EN
                    </button>
                    <button
                      type="button"
                      onClick={() => setLang('ne')}
                      className={`px-2 py-0.5 text-[10px] rounded-full cursor-pointer ${
                        lang === 'ne' ? 'bg-[#0755D9] text-white font-bold' : 'text-[#64748B]'
                      }`}
                    >
                      नेपाली
                    </button>
                  </div>
                </div>
              </div>

              {/* Prominent Logout Button */}
              <div className="pt-1.5 mt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FCA5A5] text-[#DC2626] font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4 text-[#DC2626]" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {isAuthenticated && activeAccount?.role === 'admin' && (
        <ManageUserRolesModal open={manageModalOpen} onClose={() => setManageModalOpen(false)} />
      )}
    </div>
  );
};
