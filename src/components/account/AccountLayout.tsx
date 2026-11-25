import React, { ReactNode, useState } from 'react';
import { Link, useRouterState, useNavigate } from '@tanstack/react-router';
import { useHealthcare } from '@/lib/healthcare-store';
import { TopEmergencyBar } from '@/components/common/Header';
import {
  LayoutDashboard,
  Calendar,
  Pill,
  Truck,
  FileText,
  Activity,
  User,
  Bell,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Users,
  Lock,
} from 'lucide-react';

export const AccountLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, activeAccount, currentUser, currentRole, notifications, logout } = useHealthcare();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeDependent, setActiveDependent] = useState<string>('self');

  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const navigate = useNavigate();

  // Enforce authentication & authorization for Patient Portal
  if (!isAuthenticated || !activeAccount) {
    return (
      <div className="min-h-screen bg-[#F4F8FE] flex items-center justify-center p-4 text-[#10243B]">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-[#D9E8FF] shadow-lg text-center space-y-4">
          <div className="h-14 w-14 rounded-full bg-[#E6F5FF] text-[#0755D9] mx-auto flex items-center justify-center">
            <Lock className="h-7 w-7" />
          </div>
          <h2 className="font-display text-xl font-bold text-[#082653]">Sign In Required</h2>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Please sign in with your patient account to view appointments, prescriptions, lab reports, and delivery tracking.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-xl bg-[#0755D9] text-white text-xs font-semibold hover:bg-[#082653] transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-xl border border-[#D9E8FF] text-[#082653] text-xs font-semibold hover:bg-[#F4F8FE] transition-colors"
            >
              Register Patient Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (currentRole !== 'patient' && currentRole !== 'admin') {
    return (
      <div className="min-h-screen bg-[#F4F8FE] flex items-center justify-center p-4 text-[#10243B]">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-rose-200 shadow-lg text-center space-y-4">
          <div className="h-14 w-14 rounded-full bg-rose-50 text-[#EF4444] mx-auto flex items-center justify-center">
            <Lock className="h-7 w-7" />
          </div>
          <h2 className="font-display text-xl font-bold text-[#082653]">Patient Portal Restricted</h2>
          <p className="text-xs text-[#64748B] leading-relaxed">
            You are currently signed in as <strong>{activeAccount.fullName} ({currentRole.replace('_', ' ')})</strong>. Please use your assigned Staff Portal.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
            <Link
              to="/staff"
              className="px-5 py-2.5 rounded-xl bg-[#0755D9] text-white text-xs font-semibold hover:bg-[#082653] transition-colors"
            >
              Go to Staff Portal
            </Link>
            <Link
              to="/"
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-[#10243B] text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const menuItems = [
    { label: 'Overview Dashboard', to: '/account', icon: LayoutDashboard },
    { label: 'My Appointments', to: '/account/appointments', icon: Calendar },
    { label: 'Medicine Enquiries', to: '/account/enquiries', icon: Pill },
    { label: 'Delivery Requests', to: '/account/deliveries', icon: Truck },
    { label: 'Prescriptions & Vault', to: '/account/documents', icon: FileText },
    { label: 'Lab Results & Trends', to: '/account/results', icon: Activity },
    { label: 'Profile & Settings', to: '/account/profile', icon: User },
    { label: 'Notifications', to: '/account/notifications', icon: Bell, badge: unreadNotifs },
  ];

  const handleLogout = () => {
    logout();
    navigate({ to: '/login' });
  };

  return (
    <div className="min-h-screen bg-navy-deep text-foreground flex flex-col">
      <TopEmergencyBar />

      {/* Portal Top Bar */}
      <header className="bg-navy border-b border-on-dark/15 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-xl text-white hover:bg-white/10 lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-white ring-2 ring-cyan/40 p-0.5 shrink-0 shadow-sm">
              <img src="/logo.png" alt="Two Brothers Healthcare logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-display text-sm font-bold text-white block leading-tight">
                Two Brothers
              </span>
              <span className="text-[10px] text-teal uppercase tracking-widest font-semibold block">
                Patient Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Right Header items */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Authenticated User Badge */}
          <div className="hidden md:flex items-center gap-2 bg-midnight border border-on-dark/15 rounded-full px-3 py-1 text-xs">
            <User className="h-3.5 w-3.5 text-cyan" />
            <span className="text-white font-bold">{activeAccount.fullName}</span>
            <span className="text-teal text-[10px] font-semibold uppercase">(Patient)</span>
          </div>

          {/* Dependent Switcher (Family Profiles only, never role switching) */}
          {currentUser.dependents && currentUser.dependents.length > 0 && (
            <div className="hidden xl:flex items-center gap-1.5 bg-midnight border border-on-dark/15 rounded-full px-3 py-1 text-xs">
              <Users className="h-3.5 w-3.5 text-cyan" />
              <select
                value={activeDependent}
                onChange={(e) => setActiveDependent(e.target.value)}
                aria-label="Select family member"
                className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
              >
                <option value="self" className="bg-navy">{activeAccount.fullName} (Self)</option>
                {currentUser.dependents.map((dep) => (
                  <option key={dep.id} value={dep.id} className="bg-navy">
                    {dep.name} ({dep.relationship})
                  </option>
                ))}
              </select>
            </div>
          )}

          <Link
            to="/account/notifications"
            className="relative p-2 rounded-full text-on-dark-muted hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadNotifs > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-white flex items-center justify-center">
                {unreadNotifs}
              </span>
            )}
          </Link>

          <Link
            to="/"
            className="hidden sm:inline-flex items-center gap-1 text-xs text-on-dark-muted hover:text-white px-3 py-1.5 rounded-full border border-on-dark/15 hover:bg-white/5"
          >
            <span>Website</span>
          </Link>

          {/* Visible Prominent Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FCA5A5] text-[#DC2626] text-xs font-bold transition-colors cursor-pointer shadow-2xs"
          >
            <LogOut className="h-3.5 w-3.5 text-[#DC2626]" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Workspace: Left Sidebar + Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        {/* Left Sidebar (Desktop) */}
        <aside className="w-64 shrink-0 hidden lg:block">
          <div className="sticky top-24 space-y-6">
            {/* Patient Greeting Card */}
            <div className="p-5 rounded-3xl bg-midnight/60 border border-on-dark/15 text-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-teal/20 text-cyan flex items-center justify-center font-bold text-base">
                  {activeAccount.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-white text-sm truncate">{activeAccount.fullName}</div>
                  <div className="text-[11px] text-teal truncate">{activeAccount.phone || activeAccount.email}</div>
                </div>
              </div>
              <div className="pt-2 border-t border-on-dark/10 flex items-center justify-between text-[11px] text-on-dark-muted">
                <span>Role: <strong className="text-white">Patient</strong></span>
                <span className="text-leaf font-semibold">Active Session</span>
              </div>
            </div>

            {/* Nav Menu */}
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.to === '/account' ? currentPath === '/account' : currentPath.startsWith(item.to);

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-cyan text-navy-deep font-bold shadow-md'
                        : 'text-on-dark-muted hover:text-white hover:bg-midnight/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-destructive text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Quick Action Book Button */}
            <Link
              to="/book"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-teal to-cyan text-navy-deep font-bold text-xs uppercase tracking-wider text-center block shadow-lg hover:opacity-95 transition-opacity"
            >
              + Book New Appointment
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-2.5 px-4 rounded-2xl bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FCA5A5] text-[#DC2626] font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4 text-[#DC2626]" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar Drawer */}
        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-navy-deep/95 backdrop-blur-md p-6 overflow-y-auto animate-in fade-in flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-on-dark/15 mb-6">
                <span className="font-display font-bold text-white text-base">Patient Menu</span>
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-2 rounded-full text-white bg-midnight"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileSidebarOpen(false)}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-midnight/50 text-white text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-cyan" />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-on-dark-muted" />
                    </Link>
                  );
                })}
              </nav>
            </div>

            <button
              type="button"
              onClick={() => {
                setMobileSidebarOpen(false);
                handleLogout();
              }}
              className="mt-6 w-full py-3 rounded-2xl bg-[#FEF2F2] border border-[#FCA5A5] text-[#DC2626] font-bold text-xs flex items-center justify-center gap-2"
            >
              <LogOut className="h-4 w-4 text-[#DC2626]" />
              <span>Logout</span>
            </button>
          </div>
        )}

        {/* Main Content Pane */}
        <main className="flex-1 min-w-0 pb-16">{children}</main>
      </div>
    </div>
  );
};
