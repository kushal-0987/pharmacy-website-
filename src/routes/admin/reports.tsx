import { createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import {
  Download,
  TrendingUp,
  Pill,
  Calendar,
  Truck,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const Route = createFileRoute('/admin/reports')({
  head: () => ({
    meta: [
      { title: 'Reports & Analytics — Two Brothers Healthcare' },
      { name: 'description', content: 'Financial revenue breakdown, booking volume, and inventory valuation from live system records.' },
    ],
  }),
  component: AdminReportsPage,
});

function AdminReportsPage() {
  const { appointments, enquiries, medicines, deliveries } = useHealthcare();

  // Compute actual revenue by service division directly from store records
  const divisionData = useMemo(() => {
    const activeApts = appointments.filter((a) => a.status !== 'cancelled');
    const consultationRev = activeApts
      .filter((a) => a.serviceType === 'consultation')
      .reduce((s, a) => s + a.totalFee, 0);
    const labRev = activeApts
      .filter((a) => a.serviceType === 'lab')
      .reduce((s, a) => s + a.totalFee, 0);
    const packageRev = activeApts
      .filter((a) => a.serviceType === 'package')
      .reduce((s, a) => s + a.totalFee, 0);
    const otherRev = activeApts
      .filter((a) => a.serviceType === 'other')
      .reduce((s, a) => s + a.totalFee, 0);
    const pharmacyRev = enquiries
      .filter((e) => e.status === 'confirmed' || e.status === 'dispatched' || e.status === 'delivered')
      .reduce((s, e) => s + (e.totalQuoted ?? 0), 0);

    return [
      { department: 'Doctor OPD', revenue: consultationRev },
      { department: 'Health Packages', revenue: packageRev },
      { department: 'Diagnostic Lab', revenue: labRev },
      { department: 'Pharmacy Orders', revenue: pharmacyRev },
      { department: 'Nursing & Other', revenue: otherRev },
    ];
  }, [appointments, enquiries]);

  const totalRevenue = divisionData.reduce((s, d) => s + d.revenue, 0);
  const inventoryRetailValue = medicines.reduce((s, m) => s + m.stockCount * (m.sellingPrice ?? m.price), 0);
  const inventoryPurchaseValue = medicines.reduce(
    (s, m) => s + m.stockCount * (m.purchasePrice ?? Math.round(m.price * 0.72)),
    0
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#082653]">Reports &amp; Analytics</h1>
            <p className="text-xs text-[#64748B] mt-0.5">
              Real-time revenue, booking fulfillment, and pharmacy stock valuation computed from active records.
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl bg-[#0755D9] hover:bg-[#082653] text-white font-semibold text-xs inline-flex items-center gap-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
          >
            <Download className="h-4 w-4" />
            <span>Print / Export Report</span>
          </button>
        </div>

        {/* Summary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-[#E2ECFA] p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#64748B] mb-2">
              <span>Recognized Revenue</span>
              <TrendingUp className="h-4 w-4 text-[#0755D9]" />
            </div>
            <div className="font-display text-2xl font-bold text-[#082653]">NPR {totalRevenue.toLocaleString()}</div>
            <div className="text-[11px] text-[#64748B] mt-1">Non-cancelled bookings + confirmed Rx</div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E2ECFA] p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#64748B] mb-2">
              <span>Total Appointments</span>
              <Calendar className="h-4 w-4 text-[#00AAFF]" />
            </div>
            <div className="font-display text-2xl font-bold text-[#082653]">{appointments.length}</div>
            <div className="text-[11px] text-[#10B981] mt-1">
              {appointments.filter((a) => a.status === 'confirmed' || a.status === 'completed').length} confirmed / completed
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E2ECFA] p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#64748B] mb-2">
              <span>Inventory Retail Value</span>
              <Pill className="h-4 w-4 text-[#10B981]" />
            </div>
            <div className="font-display text-2xl font-bold text-[#082653]">
              NPR {inventoryRetailValue.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#64748B] mt-1">
              Cost basis: NPR {inventoryPurchaseValue.toLocaleString()}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E2ECFA] p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#64748B] mb-2">
              <span>Active Deliveries</span>
              <Truck className="h-4 w-4 text-[#0755D9]" />
            </div>
            <div className="font-display text-2xl font-bold text-[#082653]">{deliveries.length}</div>
            <div className="text-[11px] text-[#64748B] mt-1">
              {deliveries.filter((d) => d.status === 'completed').length} completed
            </div>
          </div>
        </div>

        {/* Revenue by Division Chart */}
        <div className="bg-white rounded-2xl border border-[#E2ECFA] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0755D9]">
                Service Division Revenue
              </span>
              <h2 className="font-display text-lg font-bold text-[#082653]">
                Actual Revenue by Clinical Division (NPR)
              </h2>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={divisionData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2ECFA" />
                <XAxis dataKey="department" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#D9E8FF',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="revenue" fill="#0755D9" radius={[8, 8, 0, 0]} name="Revenue (NPR)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
