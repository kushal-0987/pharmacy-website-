import React, { ReactNode, useState } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { useHealthcare } from '@/lib/healthcare-store';
import { TopEmergencyBar } from '@/components/common/Header';
import { ManageUserRolesModal } from '@/components/admin/ManageUserRolesModal';
import logo from '@/assets/two-brothers-logo-256.png.asset.json';
import {
  LayoutDashboard,
  Calendar,
  Users,
  ShieldCheck,
  Stethoscope,
  Pill,
  Package,
  Layers,
  FileText,
  BarChart3,
  Bell,
  Settings,
  History,
  Lock,
  Menu,
  X,
  Search,
  UserPlus,
} from 'lucide-react';

export const AdminLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentRole, currentUser } = useHealthcare();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [manageRolesModalOpen, setManageRolesModalOpen] = useState(false);

  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  // Strict Role-Based Access Control
  if (currentRole !== 'admin') {
    return (
      <div className="min-h-screen bg-[#F2F8FF] flex items-center justify-center p-4 text-[#10243B]">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-rose-200 shadow-xl text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center shadow-inner">
            <Lock className="h-8 w-8" />
          </div>
          <h2 className="font-display text-xl font-bold text-[#082653]">Super Admin Access Restricted</h2>
          <p className="text-xs text-[#64748B] leading-relaxed">
            You are currently signed in as <strong>{currentUser.name} ({currentRole})</strong>. The Super Admin Console requires verified administrator privileges.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-full bg-[#0755D9] text-white text-xs font-bold hover:bg-[#00AAFF]"
            >
              Sign In as Super Admin
            </Link>
            <Link
              to="/"
              className="px-5 py-2.5 rounded-full border border-slate-300 text-[#082653] text-xs font-semibold hover:bg-slate-100"
            >
              Return to Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const adminMenuGroups = [
    {
      group: 'Executive & Insights',
      items: [
        { label: 'Executive Dashboard', to: '/admin', icon: LayoutDashboard },
        { label: 'Reports & Analytics', to: '/admin/reports', icon: BarChart3 },
        { label: 'System Audit Logs', to: '/admin/audit', icon: History },
      ],
    },
    {
      group: 'Clinical Services',
      items: [
        { label: 'Appointments Registry', to: '/admin/appointments', icon: Calendar },
        { label: 'Patient Directory (360°)', to: '/admin/patients', icon: Users },
        { label: 'Service Catalogue', to: '/admin/services', icon: Layers },
        { label: 'Doctors & Providers', to: '/admin/providers', icon: Stethoscope },
        { label: 'Health Packages', to: '/admin/packages', icon: Package },
      ],
    },
    {
      group: 'Pharmacy & Operations',
      items: [
        { label: 'Pharmacy & Inventory', to: '/admin/pharmacy', icon: Pill },
        { label: 'Notification Templates', to: '/admin/notifications', icon: Bell },
        { label: 'Content & Articles', to: '/admin/content', icon: FileText },
      ],
    },
    {
      group: 'System & Governance',
      items: [
        { label: 'Staff Management', to: '/admin/staff', icon: Users },
        { label: 'Roles & Permissions', to: '/admin/roles', icon: Lock },
        { label: 'System Settings', to: '/admin/settings', icon: Settings },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-navy-deep text-foreground flex flex-col">
      <TopEmergencyBar />

      {/* Admin Top Bar with Global Search */}
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

          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-white ring-2 ring-cyan/40 p-0.5 shrink-0 shadow-sm">
              <img src="/logo.png" alt="Two Brothers Healthcare logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-display text-sm font-bold text-white block leading-tight">
                Two Brothers
              </span>
              <span className="text-[10px] text-cyan uppercase tracking-widest font-semibold block">
                Super Admin Console
              </span>
            </div>
          </Link>
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex items-center relative w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-on-dark-muted" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search patients, doctors, medicines, ref IDs..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-navy-deep border border-on-dark/20 text-white placeholder-on-dark-muted text-xs focus:outline-none focus:border-cyan"
          />
        </div>

        {/* Right Admin Duty Status */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setManageRolesModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan text-navy-deep font-bold text-xs shadow-md hover:bg-white transition-colors cursor-pointer"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Manage Users & Roles</span>
          </button>

          <div className="flex items-center gap-1.5 bg-midnight border border-cyan/40 rounded-full px-3 py-1 text-xs">
            <ShieldCheck className="h-3.5 w-3.5 text-cyan" />
            <span className="text-white font-bold hidden sm:inline">{currentUser.name}</span>
            <span className="text-cyan font-semibold text-[10px] uppercase">(SUPER ADMIN)</span>
          </div>

          <Link
            to="/staff"
            className="hidden sm:inline-flex text-xs text-teal hover:underline font-semibold"
          >
            Staff View
          </Link>

          <Link
            to="/"
            className="text-xs text-on-dark-muted hover:text-white px-3 py-1.5 rounded-full border border-on-dark/15 hover:bg-white/5"
          >
            Back to Site
          </Link>
        </div>
      </header>

      {/* Main Workspace: Left Sidebar + Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        {/* Left Sidebar (Desktop) */}
        <aside className="w-64 shrink-0 hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <nav className="space-y-6">
              {adminMenuGroups.map((grp) => (
                <div key={grp.group} className="space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-teal px-3 mb-1">
                    {grp.group}
                  </div>
                  {grp.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.to === '/admin' ? currentPath === '/admin' : currentPath.startsWith(item.to);

                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-cyan text-navy-deep font-bold shadow-md'
                            : 'text-on-dark-muted hover:text-white hover:bg-midnight/50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-navy-deep/95 backdrop-blur-md p-6 overflow-y-auto animate-in fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-on-dark/15 mb-6">
              <span className="font-display font-bold text-white text-base">Admin Navigation</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-full text-white bg-midnight"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="space-y-4">
              {adminMenuGroups.map((grp) => (
                <div key={grp.group} className="space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-teal mb-1">
                    {grp.group}
                  </div>
                  {grp.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-between p-3 rounded-2xl bg-midnight/50 text-white text-xs font-semibold"
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="h-4 w-4 text-cyan" />
                          <span>{item.label}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>
          </div>
        )}

        {/* Main Content Pane */}
        <main className="flex-1 min-w-0 pb-16">{children}</main>
      </div>

      {/* Super Admin User & Role Management Modal */}
      <ManageUserRolesModal
        open={manageRolesModalOpen}
        onClose={() => setManageRolesModalOpen(false)}
      />
    </div>
  );
};
