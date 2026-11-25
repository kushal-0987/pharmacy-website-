import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ManageUserRolesModal } from '@/components/admin/ManageUserRolesModal';
import { useHealthcare } from '@/lib/healthcare-store';
import { Appointment } from '@/types/healthcare';
import {
  Calendar,
  Users,
  Stethoscope,
  Pill,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Clock,
  CheckCircle2,
  UserPlus,
  BarChart3,
  Eye,
  X,
  Phone,
  FileText,
  ChevronRight,
  Activity,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/')({
  head: () => ({
    meta: [
      { title: 'Super Admin Dashboard — Two Brothers Healthcare' },
      { name: 'description', content: 'Clinical operations, booking management, pharmacy inventory, and analytics overview.' },
    ],
  }),
  component: AdminExecutiveDashboardPage,
});

function getStatusBadge(status: Appointment['status']) {
  switch (status) {
    case 'confirmed':
      return 'bg-emerald-50 text-[#10B981] border-emerald-200';
    case 'pending':
    case 'held':
      return 'bg-amber-50 text-[#F59E0B] border-amber-200';
    case 'completed':
      return 'bg-blue-50 text-[#0755D9] border-blue-200';
    case 'cancelled':
      return 'bg-rose-50 text-[#EF4444] border-rose-200';
    case 'arrived':
      return 'bg-sky-50 text-[#00AAFF] border-sky-200';
    default:
      return 'bg-slate-100 text-[#64748B] border-slate-200';
  }
}

function AdminExecutiveDashboardPage() {
  const {
    currentUser,
    appointments,
    medicines,
    enquiries,
    providers,
    users,
    auditLogs,
    updateAppointmentStatus,
  } = useHealthcare();

  const [bookingFilter, setBookingFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [selectedBooking, setSelectedBooking] = useState<Appointment | null>(null);
  const [manageUsersOpen, setManageUsersOpen] = useState(false);

  const firstName = currentUser.name.split(' ')[0] || 'Kushal';

  // Real calculated KPIs — zero invented stats
  const totalBookings = appointments.length;
  const pendingBookingsCount = appointments.filter((a) => a.status === 'pending' || a.status === 'held').length;

  const totalPatients = useMemo(() => {
    const uniquePatients = new Set<string>();
    users.filter((u) => u.role === 'patient').forEach((u) => uniquePatients.add(u.fullName.toLowerCase()));
    appointments.forEach((a) => uniquePatients.add(a.patientName.toLowerCase()));
    enquiries.forEach((e) => uniquePatients.add(e.patientName.toLowerCase()));
    return uniquePatients.size;
  }, [users, appointments, enquiries]);

  const totalDoctors = providers.length;
  const totalMedicineUnits = medicines.reduce((sum, m) => sum + m.stockCount, 0);
  const lowStockMedicines = medicines.filter((m) => m.stockCount <= (m.lowStockThreshold ?? 150));

  const expiringSoonCount = useMemo(() => {
    const now = new Date('2026-11-25');
    const cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() + 90);
    return medicines.filter((m) => m.expiryDate && new Date(m.expiryDate) <= cutoff).length;
  }, [medicines]);

  const appointmentRevenue = appointments
    .filter((a) => a.status !== 'cancelled')
    .reduce((sum, a) => sum + a.totalFee, 0);
  const pharmacyRevenue = enquiries
    .filter((e) => e.status === 'confirmed' || e.status === 'dispatched' || e.status === 'delivered')
    .reduce((sum, e) => sum + (e.totalQuoted ?? 0), 0);
  const totalRevenue = appointmentRevenue + pharmacyRevenue;

  // Filtered bookings for dashboard table
  const visibleBookings = useMemo(() => {
    const list =
      bookingFilter === 'all'
        ? appointments
        : appointments.filter((a) => a.status === bookingFilter);
    return list.slice(0, 6);
  }, [appointments, bookingFilter]);

  // Real appointment status breakdown for System Overview Donut Chart
  const statusBreakdown = useMemo(() => {
    const confirmed = appointments.filter((a) => a.status === 'confirmed' || a.status === 'arrived').length;
    const pending = appointments.filter((a) => a.status === 'pending' || a.status === 'held').length;
    const completed = appointments.filter((a) => a.status === 'completed').length;
    const cancelled = appointments.filter((a) => a.status === 'cancelled').length;

    const total = Math.max(1, appointments.length);
    return {
      total: appointments.length,
      activeSuccessPct: Math.round(((confirmed + completed) / total) * 100),
      data: [
        { name: 'Confirmed', value: confirmed, pct: Math.round((confirmed / total) * 100), color: '#10B981' },
        { name: 'Pending', value: pending, pct: Math.round((pending / total) * 100), color: '#F59E0B' },
        { name: 'Completed', value: completed, pct: Math.round((completed / total) * 100), color: '#0755D9' },
        { name: 'Cancelled', value: cancelled, pct: Math.round((cancelled / total) * 100), color: '#EF4444' },
      ].filter((d) => d.value > 0),
    };
  }, [appointments]);

  // Prioritized medicine snapshot (low stock first)
  const prioritizedMedicines = useMemo(() => {
    return [...medicines]
      .sort((a, b) => a.stockCount - b.stockCount)
      .slice(0, 5);
  }, [medicines]);

  // Recent activities derived from real auditLogs or latest appointments/enquiries
  const recentActivities = useMemo(() => {
    if (auditLogs.length > 0) {
      return auditLogs.slice(0, 5).map((log) => ({
        id: log.id,
        text: `${log.action.replace(/_/g, ' ')}: ${log.details}`,
        time: new Date(log.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      }));
    }
    return [
      ...appointments.slice(0, 3).map((a) => ({
        id: a.id,
        text: `Booking ${a.referenceId} (${a.patientName}) — ${a.status}`,
        time: a.appointmentDate,
      })),
      ...enquiries.slice(0, 2).map((e) => ({
        id: e.id,
        text: `Enquiry ${e.referenceId} (${e.patientName}) — ${e.status}`,
        time: e.deliveryType,
      })),
    ];
  }, [auditLogs, appointments, enquiries]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 1. Welcome Hero Banner */}
        <section className="relative rounded-2xl bg-gradient-to-r from-[#E6F5FF] via-[#F2F8FF] to-white border border-[#D9E8FF] overflow-hidden shadow-xs">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 sm:p-7">
            <div className="space-y-2 max-w-xl">
              <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#0755D9]">
                TWO BROTHERS HEALTHCARE PVT. LTD.
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#082653] leading-tight">
                Welcome back, <span className="text-[#0755D9]">{firstName}!</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B]">
                Manage appointments, patient diagnostics, pharmacy inventory, and community care operations in real time.
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="hidden sm:block text-right">
                <div className="font-display text-sm font-bold text-[#082653]">Better Care.</div>
                <div className="text-xs font-medium text-[#0755D9]">A Healthier Community.</div>
              </div>
              <div className="h-20 w-36 rounded-xl overflow-hidden border border-[#D9E8FF] shadow-xs hidden sm:block">
                <img
                  src="/images/redesign/reception-bg.jpg"
                  alt="Two Brothers Healthcare Clinic"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2. 5 KPI Cards Row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Total Bookings */}
          <Link
            to="/admin/appointments"
            className="bg-white rounded-2xl p-5 border border-[#E2ECFA] shadow-xs hover:border-[#0755D9]/40 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-[#64748B]">Total Bookings</span>
              <div className="h-9 w-9 rounded-xl bg-[#E6F5FF] text-[#0755D9] flex items-center justify-center">
                <Calendar className="h-4 w-4" />
              </div>
            </div>
            <div className="font-display text-2xl font-bold text-[#082653]">{totalBookings}</div>
            <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-[#F59E0B]">
              <span>{pendingBookingsCount} pending review</span>
            </div>
          </Link>

          {/* Total Patients */}
          <Link
            to="/admin/patients"
            className="bg-white rounded-2xl p-5 border border-[#E2ECFA] shadow-xs hover:border-[#0755D9]/40 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-[#64748B]">Total Patients</span>
              <div className="h-9 w-9 rounded-xl bg-sky-50 text-[#00AAFF] flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="font-display text-2xl font-bold text-[#082653]">{totalPatients}</div>
            <div className="mt-1.5 text-[11px] font-medium text-[#10B981]">
              Active records &amp; accounts
            </div>
          </Link>

          {/* Total Doctors */}
          <Link
            to="/admin/providers"
            className="bg-white rounded-2xl p-5 border border-[#E2ECFA] shadow-xs hover:border-[#0755D9]/40 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-[#64748B]">Total Doctors</span>
              <div className="h-9 w-9 rounded-xl bg-indigo-50 text-[#0755D9] flex items-center justify-center">
                <Stethoscope className="h-4 w-4" />
              </div>
            </div>
            <div className="font-display text-2xl font-bold text-[#082653]">{totalDoctors}</div>
            <div className="mt-1.5 text-[11px] font-medium text-[#64748B]">
              NMC verified faculty
            </div>
          </Link>

          {/* Medicines in Stock */}
          <Link
            to="/admin/pharmacy"
            className="bg-white rounded-2xl p-5 border border-[#E2ECFA] shadow-xs hover:border-[#0755D9]/40 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-[#64748B]">Medicines in Stock</span>
              <div className="h-9 w-9 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center">
                <Pill className="h-4 w-4" />
              </div>
            </div>
            <div className="font-display text-2xl font-bold text-[#082653]">{totalMedicineUnits.toLocaleString()}</div>
            <div className="mt-1.5 text-[11px] font-medium text-[#64748B]">
              {medicines.length} SKUs &bull;{' '}
              <span className={lowStockMedicines.length > 0 ? 'text-[#F59E0B] font-semibold' : 'text-[#10B981]'}>
                {lowStockMedicines.length} low stock
              </span>
            </div>
          </Link>

          {/* Total Revenue */}
          <Link
            to="/admin/reports"
            className="bg-white rounded-2xl p-5 border border-[#E2ECFA] shadow-xs hover:border-[#0755D9]/40 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-[#64748B]">Total Revenue</span>
              <div className="h-9 w-9 rounded-xl bg-blue-50 text-[#0755D9] flex items-center justify-center">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="font-display text-2xl font-bold text-[#082653]">
              NPR {totalRevenue.toLocaleString()}
            </div>
            <div className="mt-1.5 text-[11px] font-medium text-[#64748B]">
              Bookings + Pharmacy confirmed
            </div>
          </Link>
        </section>

        {/* 3. Main Operations Row: Bookings Table (Left 8 cols) + Medicine Inventory (Right 4 cols) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Upcoming & Recent Bookings */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E2ECFA] shadow-xs flex flex-col overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-[#E6F5FF] text-[#0755D9] flex items-center justify-center">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="font-display text-base font-bold text-[#082653]">Upcoming Bookings</h2>
                  <p className="text-[11px] text-[#64748B]">Manage appointments, OPD consultations, and diagnostics</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setBookingFilter(tab)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize transition-colors cursor-pointer ${
                      bookingFilter === tab
                        ? 'bg-[#0755D9] text-white'
                        : 'bg-[#F4F8FE] text-[#64748B] hover:text-[#082653]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
                <Link
                  to="/admin/appointments"
                  className="ml-1 inline-flex items-center gap-1 text-xs font-semibold text-[#0755D9] hover:underline"
                >
                  <span>View All</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F4F8FE] text-[#64748B] border-b border-slate-100">
                    <th className="py-3 px-4 font-semibold">Booking ID</th>
                    <th className="py-3 px-4 font-semibold">Patient</th>
                    <th className="py-3 px-4 font-semibold">Doctor / Service</th>
                    <th className="py-3 px-4 font-semibold">Date &amp; Time</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visibleBookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-xs text-[#64748B]">
                        No bookings match the "{bookingFilter}" filter.
                      </td>
                    </tr>
                  ) : (
                    visibleBookings.map((apt) => (
                      <tr key={apt.id} className="hover:bg-[#F4F8FE]/60 transition-colors">
                        <td className="py-3 px-4 font-mono font-semibold text-[#0755D9]">
                          {apt.referenceId}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-[#10243B]">{apt.patientName}</div>
                          <div className="text-[11px] text-[#64748B]">{apt.patientPhone}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-[#10243B]">
                            {apt.providerName || 'Clinic / Lab Team'}
                          </div>
                          <div className="text-[11px] text-[#64748B] truncate max-w-[180px]">{apt.serviceTitle}</div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-medium text-[#10243B]">{apt.appointmentDate}</div>
                          <div className="text-[11px] text-[#64748B]">{apt.timeSlot}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border capitalize ${getStatusBadge(apt.status)}`}
                          >
                            {apt.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            {apt.status === 'pending' && (
                              <button
                                type="button"
                                onClick={() => {
                                  updateAppointmentStatus(apt.id, 'confirmed');
                                  toast.success(`Booking ${apt.referenceId} confirmed.`);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-[#10B981] hover:bg-emerald-600 text-white text-[11px] font-semibold transition-colors cursor-pointer"
                              >
                                Confirm
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setSelectedBooking(apt)}
                              className="px-2.5 py-1 rounded-lg border border-slate-200 hover:border-[#0755D9] text-[#082653] hover:text-[#0755D9] text-[11px] font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Eye className="h-3 w-3" />
                              <span>View</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Medicine Inventory Snapshot */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E2ECFA] shadow-xs flex flex-col overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-[#E6F5FF] text-[#0755D9] flex items-center justify-center">
                  <Pill className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="font-display text-base font-bold text-[#082653]">Medicine Inventory</h2>
                  <p className="text-[11px] text-[#64748B]">Stock &amp; expiry monitoring</p>
                </div>
              </div>
              <Link
                to="/admin/pharmacy"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#0755D9] hover:underline"
              >
                <span>View All</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="p-4 space-y-2.5 flex-1">
              {prioritizedMedicines.map((med) => {
                const threshold = med.lowStockThreshold ?? 150;
                const isOut = med.stockCount === 0;
                const isLow = med.stockCount > 0 && med.stockCount <= threshold;

                return (
                  <Link
                    key={med.id}
                    to="/admin/pharmacy"
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-slate-100 hover:border-[#0755D9]/30 hover:bg-[#F4F8FE]/60 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-xl bg-[#E6F5FF] text-[#0755D9] flex items-center justify-center shrink-0">
                        <Pill className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-[#10243B] truncate">{med.name}</div>
                        <div className="text-[11px] text-[#64748B]">
                          Stock: <span className="font-semibold text-[#10243B]">{med.stockCount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          isOut
                            ? 'bg-rose-50 text-[#EF4444] border-rose-200'
                            : isLow
                              ? 'bg-amber-50 text-[#F59E0B] border-amber-200'
                              : 'bg-emerald-50 text-[#10B981] border-emerald-200'
                        }`}
                      >
                        {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-[#64748B]" />
                    </div>
                  </Link>
                );
              })}
            </div>

            {(lowStockMedicines.length > 0 || expiringSoonCount > 0) && (
              <div className="px-4 py-3 bg-amber-50/80 border-t border-amber-200/60 flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 font-semibold text-amber-800">
                  <AlertTriangle className="h-3.5 w-3.5 text-[#F59E0B]" />
                  <span>
                    {lowStockMedicines.length} low stock &bull; {expiringSoonCount} expiring soon
                  </span>
                </span>
                <Link to="/admin/pharmacy" className="font-bold text-[#0755D9] hover:underline">
                  Restock →
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* 4. Bottom Grid: Quick Actions + System Overview Chart + Recent Activities */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E2ECFA] p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-4 w-4 text-[#0755D9]" />
              <h2 className="font-display text-base font-bold text-[#082653]">Quick Actions</h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/admin/appointments"
                className="p-4 rounded-xl bg-[#E6F5FF] hover:bg-blue-100/80 border border-blue-200/60 flex flex-col items-center text-center gap-2 transition-colors"
              >
                <div className="h-9 w-9 rounded-lg bg-white text-[#0755D9] flex items-center justify-center shadow-2xs">
                  <Calendar className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold text-[#082653]">Manage Bookings</span>
              </Link>

              <button
                type="button"
                onClick={() => setManageUsersOpen(true)}
                className="p-4 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/60 flex flex-col items-center text-center gap-2 transition-colors cursor-pointer"
              >
                <div className="h-9 w-9 rounded-lg bg-white text-[#10B981] flex items-center justify-center shadow-2xs">
                  <UserPlus className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold text-[#082653]">Users &amp; Roles</span>
              </button>

              <Link
                to="/admin/pharmacy"
                className="p-4 rounded-xl bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200/60 flex flex-col items-center text-center gap-2 transition-colors"
              >
                <div className="h-9 w-9 rounded-lg bg-white text-[#0755D9] flex items-center justify-center shadow-2xs">
                  <Pill className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold text-[#082653]">Add Medicine</span>
              </Link>

              <Link
                to="/admin/reports"
                className="p-4 rounded-xl bg-sky-50 hover:bg-sky-100/80 border border-sky-200/60 flex flex-col items-center text-center gap-2 transition-colors"
              >
                <div className="h-9 w-9 rounded-lg bg-white text-[#00AAFF] flex items-center justify-center shadow-2xs">
                  <BarChart3 className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold text-[#082653]">View Reports</span>
              </Link>
            </div>
          </div>

          {/* System Overview Donut Chart */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E2ECFA] p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#0755D9]" />
                <h2 className="font-display text-base font-bold text-[#082653]">Booking Overview</h2>
              </div>
              <span className="text-[11px] font-semibold text-[#64748B] bg-[#F4F8FE] px-2.5 py-1 rounded-lg">
                {statusBreakdown.total} Total
              </span>
            </div>

            <div className="flex items-center gap-4 my-auto">
              <div className="relative h-36 w-36 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusBreakdown.data}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={42}
                      outerRadius={60}
                      paddingAngle={3}
                    >
                      {statusBreakdown.data.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#D9E8FF',
                        borderRadius: '10px',
                        fontSize: '11px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="font-display text-xl font-bold text-[#082653]">
                    {statusBreakdown.activeSuccessPct}%
                  </span>
                  <span className="text-[10px] text-[#64748B]">Active/Done</span>
                </div>
              </div>

              <div className="flex-1 space-y-2 text-xs">
                {statusBreakdown.data.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-[#10243B] font-medium">{item.name}</span>
                    </div>
                    <span className="font-semibold text-[#082653]">
                      {item.value} ({item.pct}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E2ECFA] p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#0755D9]" />
                <h2 className="font-display text-base font-bold text-[#082653]">Recent Activities</h2>
              </div>
              <Link to="/admin/audit" className="text-xs font-semibold text-[#0755D9] hover:underline">
                View All →
              </Link>
            </div>

            <div className="space-y-3 flex-1">
              {recentActivities.map((act) => (
                <div key={act.id} className="flex items-start justify-between gap-3 text-xs border-b border-slate-50 pb-2.5 last:border-0 last:pb-0">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span className="h-2 w-2 rounded-full bg-[#0755D9] mt-1.5 shrink-0" />
                    <span className="text-[#10243B] leading-snug line-clamp-2">{act.text}</span>
                  </div>
                  <span className="text-[11px] text-[#64748B] shrink-0 whitespace-nowrap">{act.time}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Booking Quick Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-[#082653]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#D9E8FF] shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-mono font-bold text-[#0755D9]">{selectedBooking.referenceId}</span>
                <h3 className="font-display text-lg font-bold text-[#082653]">Booking Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 rounded-lg text-[#64748B] hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-[#F4F8FE] p-4 rounded-xl border border-[#E2ECFA]">
              <div>
                <span className="text-[#64748B] block">Patient</span>
                <span className="font-semibold text-[#10243B]">{selectedBooking.patientName}</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Contact Phone</span>
                <span className="font-semibold text-[#10243B] flex items-center gap-1">
                  <Phone className="h-3 w-3 text-[#0755D9]" />
                  {selectedBooking.patientPhone}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block">Service / Doctor</span>
                <span className="font-semibold text-[#10243B]">
                  {selectedBooking.providerName || selectedBooking.serviceTitle}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block">Appointment Slot</span>
                <span className="font-semibold text-[#10243B]">
                  {selectedBooking.appointmentDate} &bull; {selectedBooking.timeSlot}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block">Fee</span>
                <span className="font-bold text-[#0755D9]">NPR {selectedBooking.totalFee.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Status</span>
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold border capitalize ${getStatusBadge(selectedBooking.status)}`}
                >
                  {selectedBooking.status}
                </span>
              </div>
            </div>

            {selectedBooking.reasonForVisit && (
              <div className="text-xs space-y-1">
                <span className="font-semibold text-[#082653] flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5 text-[#0755D9]" /> Reason for Visit
                </span>
                <p className="text-[#64748B] bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedBooking.reasonForVisit}
                </p>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100">
              {selectedBooking.status !== 'confirmed' && (
                <button
                  type="button"
                  onClick={() => {
                    updateAppointmentStatus(selectedBooking.id, 'confirmed');
                    setSelectedBooking({ ...selectedBooking, status: 'confirmed' });
                    toast.success('Booking confirmed.');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#10B981] text-white text-xs font-semibold cursor-pointer"
                >
                  Confirm
                </button>
              )}
              {selectedBooking.status !== 'completed' && (
                <button
                  type="button"
                  onClick={() => {
                    updateAppointmentStatus(selectedBooking.id, 'completed');
                    setSelectedBooking({ ...selectedBooking, status: 'completed' });
                    toast.success('Booking marked completed.');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#0755D9] text-white text-xs font-semibold cursor-pointer"
                >
                  Mark Completed
                </button>
              )}
              {selectedBooking.status !== 'cancelled' && (
                <button
                  type="button"
                  onClick={() => {
                    updateAppointmentStatus(selectedBooking.id, 'cancelled');
                    setSelectedBooking({ ...selectedBooking, status: 'cancelled' });
                    toast.success('Booking cancelled.');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-rose-50 text-[#EF4444] border border-rose-200 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-[#10243B] text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ManageUserRolesModal open={manageUsersOpen} onClose={() => setManageUsersOpen(false)} />
    </AdminLayout>
  );
}
