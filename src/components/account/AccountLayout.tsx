import React, { ReactNode, useState } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { useHealthcare } from '@/lib/healthcare-store';
import { TopEmergencyBar } from '@/components/common/Header';
import logo from '@/assets/two-brothers-logo-256.png.asset.json';
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
  Plus,
  Users,
} from 'lucide-react';

export const AccountLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser, notifications, setCurrentRole } = useHealthcare();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeDependent, setActiveDependent] = useState<string>('self');

  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

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
        <div className="flex items-center gap-3">
          {/* Dependent Switcher */}
          <div className="hidden sm:flex items-center gap-1.5 bg-midnight border border-on-dark/15 rounded-full px-3 py-1 text-xs">
            <Users className="h-3.5 w-3.5 text-cyan" />
            <span className="text-on-dark-muted text-[11px]">Active Profile:</span>
            <select
              value={activeDependent}
              onChange={(e) => setActiveDependent(e.target.value)}
              className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
            >
              <option value="self" className="bg-navy">{currentUser.name} (Self)</option>
              {currentUser.dependents?.map((dep) => (
                <option key={dep.id} value={dep.id} className="bg-navy">
                  {dep.name} ({dep.relationship})
                </option>
              ))}
            </select>
          </div>

          <Link
            to="/account/notifications"
            className="relative p-2 rounded-full text-on-dark-muted hover:text-white hover:bg-white/10 transition-colors"
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
            onClick={() => setCurrentRole('patient')}
            className="flex items-center gap-1 text-xs text-on-dark-muted hover:text-white px-3 py-1.5 rounded-full border border-on-dark/15 hover:bg-white/5"
          >
            <span>Exit Portal</span>
          </Link>
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
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-white text-sm truncate">{currentUser.name}</div>
                  <div className="text-[11px] text-teal">{currentUser.phone}</div>
                </div>
              </div>
              <div className="pt-2 border-t border-on-dark/10 flex items-center justify-between text-[11px] text-on-dark-muted">
                <span>Blood: <strong>{currentUser.bloodGroup || 'B+'}</strong></span>
                <span className="text-leaf font-semibold">Active Member</span>
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
          </div>
        </aside>

        {/* Mobile Sidebar Drawer */}
        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-navy-deep/90 backdrop-blur-md p-6 overflow-y-auto animate-in fade-in">
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
        )}

        {/* Main Content Pane */}
        <main className="flex-1 min-w-0 pb-16">{children}</main>
      </div>
    </div>
  );
};
