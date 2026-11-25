import React, { ReactNode, useState, useEffect, useRef, useMemo } from 'react';
import { Link, useRouterState, useNavigate } from '@tanstack/react-router';
import { useHealthcare } from '@/lib/healthcare-store';
import { ManageUserRolesModal } from '@/components/admin/ManageUserRolesModal';
import {
  LayoutDashboard,
  Calendar,
  Users,
  ShieldCheck,
  Stethoscope,
  Pill,
  FileText,
  BarChart3,
  Bell,
  Settings,
  Lock,
  Menu,
  X,
  Search,
  UserPlus,
  ClipboardList,
  FlaskConical,
  Truck,
  LogOut,
  ChevronDown,
  Globe,
  CheckCheck,
  Crown,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

interface NavItem {
  label: string;
  to: string;
  icon: React.FC<{ className?: string }>;
  badge?: number | undefined;
  badgeColor?: 'red' | 'amber' | 'blue' | undefined;
  roles: string[];
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

export const AdminLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    isAuthenticated,
    activeAccount,
    currentRole,
    currentUser,
    appointments,
    medicines,
    enquiries,
    providers,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    logout,
  } = useHealthcare();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [manageRolesModalOpen, setManageRolesModalOpen] = useState(false);
  const [nowText, setNowText] = useState<string>('');

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const navigate = useNavigate();

  // Client-only date/time formatting to avoid SSR hydration mismatches
  useEffect(() => {
    const updateClock = () => {
      const d = new Date();
      const datePart = d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      const timePart = d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
      setNowText(`${datePart} • ${timePart}`);
    };
    updateClock();
    const id = setInterval(updateClock, 30000);
    return () => clearInterval(id);
  }, []);

  // Click-outside handlers
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (searchRef.current && !searchRef.current.contains(target)) setSearchFocused(false);
      if (notifRef.current && !notifRef.current.contains(target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  // Live search results across real store datasets
  const searchResults = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    if (!q) return [];
    const results: { type: string; title: string; subtitle: string; to: string }[] = [];

    appointments.forEach((a) => {
      if (
        a.patientName.toLowerCase().includes(q) ||
        a.referenceId.toLowerCase().includes(q) ||
        (a.providerName && a.providerName.toLowerCase().includes(q))
      ) {
        results.push({
          type: 'Booking',
          title: `${a.referenceId} — ${a.patientName}`,
          subtitle: `${a.serviceTitle} (${a.appointmentDate} ${a.timeSlot})`,
          to: '/admin/appointments',
        });
      }
    });

    medicines.forEach((m) => {
      if (
        m.name.toLowerCase().includes(q) ||
        m.genericName.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q)
      ) {
        results.push({
          type: 'Medicine',
          title: m.name,
          subtitle: `${m.stockCount} in stock • NPR ${m.sellingPrice ?? m.price}`,
          to: '/admin/pharmacy',
        });
      }
    });

    providers.forEach((p) => {
      if (p.name.toLowerCase().includes(q) || p.department.toLowerCase().includes(q)) {
        results.push({
          type: 'Doctor',
          title: p.name,
          subtitle: `${p.title} • ${p.registrationNumber}`,
          to: '/admin/providers',
        });
      }
    });

    enquiries.forEach((e) => {
      if (e.patientName.toLowerCase().includes(q) || e.referenceId.toLowerCase().includes(q)) {
        results.push({
          type: 'Enquiry',
          title: `${e.referenceId} — ${e.patientName}`,
          subtitle: `${e.medicineList.length} item(s) • ${e.status}`,
          to: '/admin/enquiries',
        });
      }
    });

    return results.slice(0, 8);
  }, [globalSearch, appointments, medicines, providers, enquiries]);

  // Strict Role-Based Access Control
  if (!isAuthenticated || !activeAccount || currentRole !== 'admin') {
    return (
      <div className="min-h-screen bg-[#F4F8FE] flex items-center justify-center p-4 text-[#10243B]">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-[#D9E8FF] shadow-lg text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-rose-50 border border-rose-200 text-[#EF4444] mx-auto flex items-center justify-center">
            <Lock className="h-7 w-7" />
          </div>
          <h2 className="font-display text-xl font-bold text-[#082653]">Super Admin Access Restricted</h2>
          <p className="text-xs text-[#64748B] leading-relaxed">
            {isAuthenticated && activeAccount
              ? <>You are currently signed in as <strong>{activeAccount.fullName} ({currentRole})</strong>. The Super Admin Console requires verified administrator privileges.</>
              : <>Please sign in with your verified Super Admin credentials to access the administration dashboard.</>}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-xl bg-[#0755D9] text-white text-xs font-semibold hover:bg-[#082653] transition-colors"
            >
              Sign In as Super Admin
            </Link>
            <Link
              to="/"
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-[#10243B] text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              Return to Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const pendingBookingsCount = appointments.filter((a) => a.status === 'pending' || a.status === 'held').length;
  const lowStockCount = medicines.filter((m) => m.stockCount <= (m.lowStockThreshold ?? 150)).length;
  const pendingEnquiriesCount = enquiries.filter((e) => e.status === 'submitted').length;
  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const adminMenuGroups: NavGroup[] = [
    {
      group: 'OVERVIEW',
      items: [
        { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, roles: ['admin'] },
      ],
    },
    {
      group: 'OPERATIONS',
      items: [
        {
          label: 'Appointments & Bookings',
          to: '/admin/appointments',
          icon: Calendar,
          badge: pendingBookingsCount > 0 ? pendingBookingsCount : undefined,
          badgeColor: 'red',
          roles: ['admin'],
        },
        { label: 'Patients', to: '/admin/patients', icon: Users, roles: ['admin'] },
        { label: 'Doctors', to: '/admin/providers', icon: Stethoscope, roles: ['admin'] },
        {
          label: 'Pharmacy Inventory',
          to: '/admin/pharmacy',
          icon: Pill,
          badge: lowStockCount > 0 ? lowStockCount : undefined,
          badgeColor: 'amber',
          roles: ['admin'],
        },
        {
          label: 'Medicine Enquiries',
          to: '/admin/enquiries',
          icon: ClipboardList,
          badge: pendingEnquiriesCount > 0 ? pendingEnquiriesCount : undefined,
          badgeColor: 'blue',
          roles: ['admin'],
        },
        { label: 'Prescriptions', to: '/admin/prescriptions', icon: FileText, roles: ['admin'] },
        { label: 'Lab Reports', to: '/admin/lab-reports', icon: FlaskConical, roles: ['admin'] },
        { label: 'Delivery Management', to: '/admin/deliveries', icon: Truck, roles: ['admin'] },
      ],
    },
    {
      group: 'ADMINISTRATION',
      items: [
        { label: 'Users & Roles', to: '/admin/roles', icon: ShieldCheck, roles: ['admin'] },
        { label: 'Staff Management', to: '/admin/staff', icon: UserPlus, roles: ['admin'] },
        { label: 'Reports & Analytics', to: '/admin/reports', icon: BarChart3, roles: ['admin'] },
        {
          label: 'Notifications',
          to: '/admin/notifications',
          icon: Bell,
          badge: unreadNotifsCount > 0 ? unreadNotifsCount : undefined,
          badgeColor: 'red',
          roles: ['admin'],
        },
        { label: 'Settings', to: '/admin/settings', icon: Settings, roles: ['admin'] },
      ],
    },
  ];

  const handleLogout = () => {
    logout();
    navigate({ to: '/login' });
  };

  const renderBadge = (count?: number, color: 'red' | 'amber' | 'blue' = 'red') => {
    if (!count) return null;
    const classes =
      color === 'red'
        ? 'bg-[#EF4444] text-white'
        : color === 'amber'
          ? 'bg-[#F59E0B] text-white'
          : 'bg-[#00AAFF] text-[#082653]';
    return (
      <span className={`px-1.5 py-0.5 min-w-[20px] text-center rounded-full text-[10px] font-bold leading-none ${classes}`}>
        {count}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#F4F8FE] text-[#10243B] flex font-sans">
      {/* Desktop Left Sidebar — Deep Navy (#082653) */}
      <aside
        className={`hidden lg:flex flex-col bg-[#082653] text-white shrink-0 sticky top-0 h-screen transition-all duration-200 border-r border-white/10 z-30 ${
          sidebarCollapsed ? 'w-[76px]' : 'w-[260px]'
        }`}
      >
        {/* Brand Header */}
        <div className="px-4 py-4 border-b border-white/10 flex items-center justify-between gap-2">
          <Link to="/admin" className="flex items-center gap-2.5 min-w-0">
            <div className="h-10 w-10 rounded-full bg-white p-1 shrink-0 ring-2 ring-[#00AAFF]/40 shadow-sm">
              <img src="/logo.png" alt="Two Brothers Healthcare" className="w-full h-full object-contain" />
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <span className="font-display text-sm font-bold text-white block leading-tight truncate">
                  Two Brothers
                </span>
                <span className="text-[10px] text-[#A9DFFF] font-medium block truncate">
                  Healthcare Pvt. Ltd.
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Admin Identity Card (matching mockup) */}
        {!sidebarCollapsed && (
          <div className="px-4 py-3.5 border-b border-white/10 bg-[#0B2E66]/60">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#E6F5FF] text-[#082653] font-display font-bold text-sm flex items-center justify-center shrink-0 ring-2 ring-[#00AAFF]/50">
                {currentUser.name
                  .split(' ')
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-white truncate">{currentUser.name}</div>
                <div className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-full bg-[#0755D9]/70 border border-[#00AAFF]/30 text-[10px] font-semibold text-[#E6F5FF]">
                  <Crown className="h-2.5 w-2.5 text-[#F59E0B]" />
                  <span>Super Admin</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-[10px] text-[#A9DFFF]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                  <span>Online</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Groups */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin">
          {adminMenuGroups.map((grp) => {
            const visibleItems = grp.items.filter((i) => i.roles.includes(currentRole));
            if (visibleItems.length === 0) return null;

            return (
              <div key={grp.group} className="space-y-1">
                {!sidebarCollapsed && (
                  <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#A9DFFF]/60">
                    {grp.group}
                  </div>
                )}
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.to === '/admin' ? currentPath === '/admin' : currentPath.startsWith(item.to);

                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      title={sidebarCollapsed ? item.label : undefined}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-[#0755D9] to-[#00AAFF] text-white font-semibold shadow-sm'
                          : 'text-blue-100/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-[#A9DFFF]'}`} />
                        {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                      </div>
                      {!sidebarCollapsed && renderBadge(item.badge, item.badgeColor)}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Bottom Logout Action */}
        <div className="p-3 border-t border-white/10 space-y-2">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FCA5A5] text-[#DC2626] font-bold text-xs transition-colors shadow-sm cursor-pointer"
          >
            <LogOut className="h-4 w-4 text-[#DC2626] shrink-0" />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-[#082653]/50 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 max-w-[85vw] bg-[#082653] text-white h-full flex flex-col z-10 shadow-2xl">
            <div className="px-4 py-4 border-b border-white/10 flex items-center justify-between">
              <Link to="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-full bg-white p-1">
                  <img src="/logo.png" alt="Two Brothers Healthcare" className="w-full h-full object-contain" />
                </div>
                <div>
                  <span className="font-display text-sm font-bold block">Two Brothers</span>
                  <span className="text-[10px] text-[#A9DFFF] block">Super Admin</span>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:bg-white/10"
                aria-label="Close navigation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
              {adminMenuGroups.map((grp) => (
                <div key={grp.group} className="space-y-1">
                  <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#A9DFFF]/60">
                    {grp.group}
                  </div>
                  {grp.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.to === '/admin' ? currentPath === '/admin' : currentPath.startsWith(item.to);
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium ${
                          isActive
                            ? 'bg-gradient-to-r from-[#0755D9] to-[#00AAFF] text-white font-semibold'
                            : 'text-blue-100/85 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="h-4 w-4 shrink-0" />
                          <span>{item.label}</span>
                        </div>
                        {renderBadge(item.badge, item.badgeColor)}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>

            <div className="p-3 border-t border-white/10">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FCA5A5] text-[#DC2626] font-bold text-xs"
              >
                <LogOut className="h-4 w-4 text-[#DC2626]" />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Right Main Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Clean White Top Header */}
        <header className="sticky top-0 z-20 bg-white border-b border-[#E2ECFA] px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Left: Collapse Toggle & Global Search */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-[#082653] hover:bg-[#F4F8FE] border border-slate-200"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => setSidebarCollapsed((c) => !c)}
              className="hidden lg:inline-flex p-2 rounded-xl text-[#64748B] hover:text-[#082653] hover:bg-[#F4F8FE] border border-slate-200/80 transition-colors cursor-pointer"
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>

            {/* Global Search */}
            <div ref={searchRef} className="relative w-full max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
              <input
                type="text"
                value={globalSearch}
                onFocus={() => setSearchFocused(true)}
                onChange={(e) => {
                  setGlobalSearch(e.target.value);
                  setSearchFocused(true);
                }}
                placeholder="Search patients, bookings, medicines..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-xs text-[#10243B] placeholder-[#64748B] focus:outline-none focus:border-[#0755D9] focus:bg-white transition-colors"
              />

              {/* Search Dropdown */}
              {searchFocused && globalSearch.trim().length > 0 && (
                <div className="absolute left-0 right-0 mt-2 bg-white border border-[#D9E8FF] rounded-2xl shadow-xl p-2 z-50 max-h-80 overflow-y-auto">
                  {searchResults.length === 0 ? (
                    <div className="py-6 text-center text-xs text-[#64748B]">
                      No records match "{globalSearch}".
                    </div>
                  ) : (
                    searchResults.map((res, idx) => (
                      <Link
                        key={idx}
                        to={res.to}
                        onClick={() => {
                          setSearchFocused(false);
                          setGlobalSearch('');
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F4F8FE] transition-colors"
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-[#10243B] truncate">{res.title}</div>
                          <div className="text-[11px] text-[#64748B] truncate">{res.subtitle}</div>
                        </div>
                        <span className="ml-2 px-2 py-0.5 rounded-md bg-[#E6F5FF] text-[#0755D9] text-[10px] font-semibold shrink-0">
                          {res.type}
                        </span>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Notifications, Date & Time, Admin Profile Pill */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
            {/* Notification Centre */}
            <div ref={notifRef} className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((o) => !o)}
                className="relative p-2 rounded-xl bg-[#F4F8FE] hover:bg-[#E6F5FF] text-[#10243B] border border-[#E2ECFA] transition-colors cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4 text-[#082653]" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 rounded-full bg-[#EF4444] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-[#D9E8FF] rounded-2xl shadow-xl p-3 z-50">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <span className="font-display text-xs font-bold text-[#082653]">
                      Notification Centre ({unreadNotifsCount} unread)
                    </span>
                    <button
                      type="button"
                      onClick={markAllNotificationsRead}
                      className="text-[11px] font-semibold text-[#0755D9] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCheck className="h-3 w-3" /> Mark all read
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-[#64748B]">All caught up.</div>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <button
                          key={n.id}
                          type="button"
                          onClick={() => markNotificationRead(n.id)}
                          className={`w-full text-left p-2.5 rounded-xl transition-colors cursor-pointer ${
                            n.read ? 'bg-white hover:bg-slate-50' : 'bg-[#E6F5FF]/60 hover:bg-[#E6F5FF]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-[#10243B] truncate">{n.title}</span>
                            {!n.read && <span className="h-2 w-2 rounded-full bg-[#0755D9] shrink-0" />}
                          </div>
                          <p className="text-[11px] text-[#64748B] line-clamp-2 mt-0.5">{n.message}</p>
                        </button>
                      ))
                    )}
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-100 text-center">
                    <Link
                      to="/admin/notifications"
                      onClick={() => setNotifOpen(false)}
                      className="text-xs font-semibold text-[#0755D9] hover:underline"
                    >
                      Open Notification Gateway →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Date & Time */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[11px] font-medium text-[#64748B]">
              <Calendar className="h-3.5 w-3.5 text-[#0755D9]" />
              <span className="text-[#10243B] font-semibold">{nowText || 'Loading time...'}</span>
            </div>

            {/* Admin Profile Dropdown */}
            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((o) => !o)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#082653] hover:bg-[#0755D9] text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
              >
                <Crown className="h-3.5 w-3.5 text-[#F59E0B]" />
                <span className="hidden sm:inline">Super Admin</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-80" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white border border-[#D9E8FF] rounded-2xl shadow-xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <div className="text-xs font-bold text-[#082653]">{currentUser.name}</div>
                    <div className="text-[11px] text-[#64748B] truncate">{currentUser.email}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      setManageRolesModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#0755D9] hover:bg-[#E6F5FF] transition-colors cursor-pointer"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Manage User Roles</span>
                  </button>
                  <Link
                    to="/staff"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[#10243B] hover:bg-[#F4F8FE]"
                  >
                    <Stethoscope className="h-4 w-4 text-[#64748B]" />
                    <span>Clinical Staff View</span>
                  </Link>
                  <Link
                    to="/"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[#10243B] hover:bg-[#F4F8FE]"
                  >
                    <Globe className="h-4 w-4 text-[#64748B]" />
                    <span>Public Website</span>
                  </Link>
                  <div className="my-1 border-t border-slate-100" />
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#DC2626] hover:bg-[#FEF2F2] transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 text-[#DC2626]" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Visible Top-Bar Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FEF2F2] hover:bg-[#FEE2E2] border border-[#FCA5A5] text-[#DC2626] text-xs font-bold transition-colors shadow-2xs cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5 text-[#DC2626]" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Main Content Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Super Admin User & Role Management Modal */}
      <ManageUserRolesModal
        open={manageRolesModalOpen}
        onClose={() => setManageRolesModalOpen(false)}
      />
    </div>
  );
};
