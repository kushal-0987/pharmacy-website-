import React, { ReactNode, useState } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { useHealthcare } from '@/lib/healthcare-store';
import { TopEmergencyBar } from '@/components/common/Header';
import logo from '@/assets/two-brothers-logo-256.png.asset.json';
import {
  LayoutDashboard,
  Calendar,
  CalendarDays,
  Pill,
  Truck,
  MessageSquare,
  Clock,
  User,
  ShieldCheck,
  Menu,
  X,
  ChevronRight,
  LogOut,
  Bell,
  Layers,
} from 'lucide-react';

export const StaffLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentRole, currentUser } = useHealthcare();
  const [mobileOpen, setMobileOpen] = useState(false);

  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  // Strict Role-Based Access Control: Patients cannot access clinical staff portal
  if (currentRole === 'patient') {
    return (
      <div className="min-h-screen bg-[#F2F8FF] flex items-center justify-center p-4 text-[#10243B]">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-blue-200 shadow-xl text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-blue-50 text-[#0755D9] mx-auto flex items-center justify-center shadow-inner">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h2 className="font-display text-xl font-bold text-[#082653]">Staff Portal Access Restricted</h2>
          <p className="text-xs text-[#64748B] leading-relaxed">
            You are currently signed in as <strong>{currentUser.name} (Patient)</strong>. Clinical and operations dashboards require authorized staff or clinician credentials.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
            <Link
              to="/staff/login"
              className="px-5 py-2.5 rounded-full bg-[#0755D9] text-white text-xs font-bold hover:bg-[#00AAFF] transition-colors"
            >
              Sign In as Staff
            </Link>
            <Link
              to="/account"
              className="px-5 py-2.5 rounded-full border border-slate-300 text-[#082653] text-xs font-semibold hover:bg-slate-100 transition-colors"
            >
              Go to Patient Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const staffNavItems = [
    { label: 'Staff Dashboard', to: '/staff', icon: LayoutDashboard },
    { label: 'OPD Calendar', to: '/staff/calendar', icon: CalendarDays },
    { label: 'All Appointments', to: '/staff/appointments', icon: Calendar },
    { label: 'Pharmacy Queue', to: '/staff/enquiries', icon: Pill },
    { label: 'Delivery Kanban', to: '/staff/deliveries', icon: Truck },
    { label: 'Patient Messages', to: '/staff/messages', icon: MessageSquare },
    { label: 'My Duty Schedule', to: '/staff/schedule', icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-navy-deep text-foreground flex flex-col">
      <TopEmergencyBar />

      {/* Staff Header */}
      <header className="bg-navy border-b border-on-dark/15 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl text-white hover:bg-white/10 lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link to="/staff" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-white ring-2 ring-teal/40 p-0.5 shrink-0 shadow-sm">
              <img src="/logo.png" alt="Two Brothers Healthcare logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-display text-sm font-bold text-white block leading-tight">
                Two Brothers Healthcare
              </span>
              <span className="text-[10px] text-teal uppercase tracking-widest font-semibold block">
                Clinical & Staff Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Staff Duty Pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-midnight/90 border border-teal/40 rounded-full px-3 py-1 text-xs">
            <span className="h-2 w-2 rounded-full bg-leaf animate-pulse" />
            <span className="text-white font-bold">{currentUser.name}</span>
            <span className="text-teal font-semibold text-[11px] uppercase">({currentRole})</span>
          </div>

          <Link
            to="/admin"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-cyan/40 bg-cyan/15 text-cyan hover:bg-cyan hover:text-navy-deep text-xs font-bold transition-all"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Admin Portal</span>
          </Link>

          <Link
            to="/"
            className="text-xs text-on-dark-muted hover:text-white px-3 py-1.5 rounded-full border border-on-dark/15 hover:bg-white/5"
          >
            Exit
          </Link>
        </div>
      </header>

      {/* Staff Workspace: Left Sidebar + Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        {/* Left Sidebar (Desktop) */}
        <aside className="w-64 shrink-0 hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <nav className="space-y-1">
              {staffNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.to === '/staff' ? currentPath === '/staff' : currentPath.startsWith(item.to);

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
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 rounded-2xl bg-midnight/40 border border-on-dark/15 text-xs text-on-dark-muted space-y-2">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-cyan" /> Duty Hours
              </div>
              <div>Sanagau Clinic: 07:00 AM – 08:00 PM</div>
              <div className="text-[11px] text-teal">Emergency Dispensary: 24/7 Active</div>
            </div>
          </div>
        </aside>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-navy-deep/95 backdrop-blur-md p-6 overflow-y-auto animate-in fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-on-dark/15 mb-6">
              <span className="font-display font-bold text-white text-base">Staff Navigation</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-full text-white bg-midnight"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="space-y-2">
              {staffNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
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
        )}

        {/* Main Content Pane */}
        <main className="flex-1 min-w-0 pb-16">{children}</main>
      </div>
    </div>
  );
};
