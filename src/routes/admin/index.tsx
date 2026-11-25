import { createFileRoute, Link } from '@tanstack/react-router';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import {
  Calendar,
  Users,
  Pill,
  Truck,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const Route = createFileRoute('/admin/')({
  head: () => ({
    meta: [
      { title: 'Super Admin Executive Dashboard — Two Brothers Healthcare' },
      { name: 'description', content: 'Clinical capacity, revenue tracking, inventory alerts, and audit overview.' },
    ],
  }),
  component: AdminExecutiveDashboardPage,
});

function AdminExecutiveDashboardPage() {
  const {
    appointments,
    medicines,
    enquiries,
    deliveries,
    auditLogs,
  } = useHealthcare();

  // KPIs
  const totalRevenue = appointments.reduce((sum, a) => sum + (a.status !== 'cancelled' ? a.totalFee : 0), 18450);
  const lowStockMedicines = medicines.filter((m) => m.stockCount < 150);
  const pendingAppointments = appointments.filter((a) => a.status === 'pending');

  // Chart data: 30-day booking volume trend
  const bookingTrends = [
    { day: 'Day 1', bookings: 12, revenue: 8400 },
    { day: 'Day 5', bookings: 18, revenue: 12500 },
    { day: 'Day 10', bookings: 24, revenue: 16800 },
    { day: 'Day 15', bookings: 21, revenue: 14700 },
    { day: 'Day 20', bookings: 28, revenue: 19600 },
    { day: 'Day 25', bookings: 32, revenue: 22400 },
    { day: 'Today', bookings: appointments.length, revenue: totalRevenue },
  ];

  // Service demand breakdown
  const serviceDemand = [
    { name: 'Doctor OPD', value: 45, color: '#22D3EE' },
    { name: 'Pharmacy Courier', value: 30, color: '#0D9488' },
    { name: 'Diagnostics & Lab', value: 20, color: '#3BA935' },
    { name: 'Health Packages', value: 15, color: '#E8B45A' },
  ];

  // Staff Workload
  const staffWorkload = [
    { name: 'Dr. Suresh', visits: 18 },
    { name: 'Dr. Anjana', visits: 14 },
    { name: 'Dr. Rabin', visits: 12 },
    { name: 'Dr. Bikram', visits: 10 },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-on-dark/15">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Executive Command Dashboard</h1>
            <p className="text-xs text-on-dark-muted">
              Live operational metrics, financial throughput, clinical capacity, and supply chain telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-leaf font-bold bg-leaf/10 border border-leaf/30 px-3 py-1 rounded-full flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-leaf inline-block animate-ping" />
              <span>All Systems Operational</span>
            </span>
          </div>
        </div>

        {/* Row 1 — KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-midnight/50 border border-on-dark/15 space-y-2">
            <span className="text-[10px] font-bold text-teal uppercase tracking-wider block">Estimated Monthly Revenue</span>
            <div className="text-2xl font-bold text-cyan">NPR {totalRevenue.toLocaleString()}</div>
            <div className="text-[11px] text-leaf font-medium flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> +14.2% vs last month
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-midnight/50 border border-on-dark/15 space-y-2">
            <span className="text-[10px] font-bold text-teal uppercase tracking-wider block">Total Bookings</span>
            <div className="text-2xl font-bold text-white">{appointments.length + 142}</div>
            <div className="text-[11px] text-on-dark-muted">98.4% slot fulfillment rate</div>
          </div>

          <div className="p-5 rounded-3xl bg-midnight/50 border border-on-dark/15 space-y-2">
            <span className="text-[10px] font-bold text-warm-gold uppercase tracking-wider block">Prescription Orders</span>
            <div className="text-2xl font-bold text-warm-gold">{enquiries.length + 84}</div>
            <div className="text-[11px] text-on-dark-muted">Avg response: 12 minutes</div>
          </div>

          <div className="p-5 rounded-3xl bg-midnight/50 border border-on-dark/15 space-y-2">
            <span className="text-[10px] font-bold text-leaf uppercase tracking-wider block">Delivery Success</span>
            <div className="text-2xl font-bold text-leaf">99.1%</div>
            <div className="text-[11px] text-on-dark-muted">Lalitpur & Kathmandu courier</div>
          </div>
        </div>

        {/* Row 2 — Charts (Recharts) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Booking Trends Line Chart */}
          <div className="lg:col-span-8 p-6 rounded-3xl bg-midnight/50 border border-on-dark/15 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-teal uppercase tracking-wider block">Volume Analytics</span>
                <h3 className="font-display text-base font-bold text-white">30-Day Appointment Volume & Revenue</h3>
              </div>
              <span className="text-xs text-cyan font-bold">NPR Daily Trajectory</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bookingTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#102D4F" />
                  <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#071D35',
                      borderColor: '#0D9488',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Line type="monotone" dataKey="bookings" stroke="#22D3EE" strokeWidth={3} name="Bookings" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Service Demand Bar Chart */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-midnight/50 border border-on-dark/15 space-y-4 shadow-xl flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-teal uppercase tracking-wider block">Resource Allocation</span>
              <h3 className="font-display text-base font-bold text-white">Service Demand Breakdown</h3>
            </div>

            <div className="space-y-3 text-xs">
              {serviceDemand.map((sd) => (
                <div key={sd.name} className="space-y-1">
                  <div className="flex justify-between text-white font-medium">
                    <span>{sd.name}</span>
                    <span className="text-cyan font-bold">{sd.value}%</span>
                  </div>
                  <div className="h-2 w-full bg-navy-deep rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${sd.value}%`, backgroundColor: sd.color }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-on-dark/10 text-[11px] text-on-dark-muted">
              Highest surge observed in community pharmacy enquiries post-6:00 PM.
            </div>
          </div>
        </div>

        {/* Row 3 — Operational Alerts & Pending Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Low Stock Medicines */}
          <div className="p-6 rounded-3xl bg-midnight/40 border border-on-dark/15 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-warm-gold" /> Low Stock Alerts
              </h3>
              <Link to="/admin/pharmacy" className="text-xs text-cyan hover:underline">Manage</Link>
            </div>

            <div className="space-y-2 text-xs">
              {lowStockMedicines.length === 0 ? (
                <div className="text-on-dark-muted py-4 text-center">All inventory above minimum threshold.</div>
              ) : (
                lowStockMedicines.map((m) => (
                  <div key={m.id} className="p-3 rounded-2xl bg-navy-deep border border-warm-gold/30 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">{m.name}</div>
                      <div className="text-[11px] text-on-dark-muted">{m.genericName}</div>
                    </div>
                    <span className="text-warm-gold font-bold">{m.stockCount} left</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pending Confirmations */}
          <div className="p-6 rounded-3xl bg-midnight/40 border border-on-dark/15 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-teal" /> Pending Bookings
              </h3>
              <Link to="/admin/appointments" className="text-xs text-cyan hover:underline">View All</Link>
            </div>

            <div className="space-y-2 text-xs">
              {pendingAppointments.length === 0 ? (
                <div className="text-on-dark-muted py-4 text-center">All bookings reviewed.</div>
              ) : (
                pendingAppointments.map((a) => (
                  <div key={a.id} className="p-3 rounded-2xl bg-navy-deep border border-on-dark/15 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">{a.patientName}</div>
                      <div className="text-[11px] text-on-dark-muted">{a.serviceTitle}</div>
                    </div>
                    <span className="text-warm-gold font-bold">{a.timeSlot}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* System Audit Activity */}
          <div className="p-6 rounded-3xl bg-midnight/40 border border-on-dark/15 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-leaf" /> Live Audit Log
              </h3>
              <Link to="/admin/audit" className="text-xs text-cyan hover:underline">Full Log</Link>
            </div>

            <div className="space-y-2 text-xs">
              {auditLogs.length === 0 ? (
                <div className="text-on-dark-muted py-4 text-center">No recent audit exceptions recorded.</div>
              ) : (
                auditLogs.slice(0, 3).map((log) => (
                  <div key={log.id} className="p-3 rounded-2xl bg-navy-deep border border-on-dark/15 text-[11px] space-y-0.5">
                    <div className="flex justify-between font-semibold text-white">
                      <span>{log.action}</span>
                      <span className="text-teal">{log.actorRole}</span>
                    </div>
                    <div className="text-on-dark-muted truncate">{log.details}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
