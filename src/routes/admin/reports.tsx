import { createFileRoute } from '@tanstack/react-router';
import { AdminLayout } from '@/components/admin/AdminLayout';
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  Users,
  CheckCircle2,
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
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/reports')({
  head: () => ({
    meta: [
      { title: 'Executive Reports & Analytics — Two Brothers Healthcare' },
      { name: 'description', content: 'Comprehensive financial, clinical volume, and operational utilization reports.' },
    ],
  }),
  component: AdminReportsPage,
});

function AdminReportsPage() {
  const departmentRevenue = [
    { department: 'Pharmacy', revenue: 48500 },
    { department: 'Doctor OPD', revenue: 32400 },
    { department: 'Diagnostic Lab', revenue: 26800 },
    { department: 'Health Packages', revenue: 19500 },
    { department: 'Nursing Care', revenue: 8200 },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-on-dark/15">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Reports & Financial Analytics</h1>
            <p className="text-xs text-on-dark-muted">
              Monthly utilization summaries, departmental turnover, and clinical audit metrics.
            </p>
          </div>

          <button
            type="button"
            onClick={() => toast.success('Executive audit report downloaded in PDF!')}
            className="px-5 py-2.5 rounded-full bg-cyan text-navy-deep font-bold text-xs uppercase shadow-md flex items-center gap-1.5 self-start sm:self-auto hover:scale-105 transition-all"
          >
            <Download className="h-4 w-4" />
            <span>Export Executive PDF</span>
          </button>
        </div>

        {/* Department Revenue Bar Chart */}
        <div className="rounded-3xl bg-midnight/50 border border-teal/40 p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-teal uppercase tracking-widest block">
                Department Turnover
              </span>
              <h2 className="font-display text-xl font-bold text-white">
                Monthly Revenue by Clinical Division (NPR)
              </h2>
            </div>
            <span className="text-xs font-bold text-cyan">Nov 2026</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentRevenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#102D4F" />
                <XAxis dataKey="department" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#071D35',
                    borderColor: '#0D9488',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="revenue" fill="#22D3EE" radius={[8, 8, 0, 0]} name="Revenue (NPR)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Operational Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-midnight/40 border border-on-dark/15 space-y-2">
            <span className="text-xs font-bold text-teal block">Average Consultation Length</span>
            <div className="text-2xl font-bold text-white">22.4 Minutes</div>
            <p className="text-xs text-on-dark-muted">Exceeds national average of 8 mins; ensures clinical thoroughness.</p>
          </div>

          <div className="p-6 rounded-3xl bg-midnight/40 border border-on-dark/15 space-y-2">
            <span className="text-xs font-bold text-leaf block">Prescription Sourcing Accuracy</span>
            <div className="text-2xl font-bold text-leaf">100.0%</div>
            <p className="text-xs text-on-dark-muted">100% genuine DDA-registered batches with zero counterfeit reports.</p>
          </div>

          <div className="p-6 rounded-3xl bg-midnight/40 border border-on-dark/15 space-y-2">
            <span className="text-xs font-bold text-cyan block">Community Patient Retention</span>
            <div className="text-2xl font-bold text-cyan">88.6%</div>
            <p className="text-xs text-on-dark-muted">Families across Mahalaxmi Municipality returning for recurring care.</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
