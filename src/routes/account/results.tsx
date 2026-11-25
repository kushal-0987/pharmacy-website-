import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AccountLayout } from '@/components/account/AccountLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import {
  Activity,
  FileText,
  Download,
  ShieldCheck,
  TrendingUp,
  Calendar,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { toast } from 'sonner';

export const Route = createFileRoute('/account/results')({
  head: () => ({
    meta: [
      { title: 'Diagnostic Lab Reports & Trends — Two Brothers Healthcare' },
      { name: 'description', content: 'Download verified lab PDFs and track longitudinal blood glucose and cholesterol health markers.' },
    ],
  }),
  component: LabResultsPage,
});

function LabResultsPage() {
  const { labReports, currentUser } = useHealthcare();

  // Historical trend data for Glucose & HbA1c
  const trendData = [
    { date: 'Nov 2025', glucose: 112, cholesterol: 210, hba1c: 6.1 },
    { date: 'Feb 2026', glucose: 106, cholesterol: 198, hba1c: 5.9 },
    { date: 'May 2026', glucose: 102, cholesterol: 195, hba1c: 5.8 },
    { date: 'Oct 2026', glucose: 94, cholesterol: 182, hba1c: 5.4 },
  ];

  return (
    <AccountLayout>
      <div className="space-y-8 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-on-dark/15">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Diagnostic Reports & Trends</h1>
            <p className="text-xs text-on-dark-muted">
              Digitally verified laboratory investigations and longitudinal health biomarkers.
            </p>
          </div>
        </div>

        {/* Longitudinal Biomarker Trend Chart (Recharts) */}
        <div className="rounded-3xl bg-midnight/50 border border-teal/40 p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold text-teal uppercase tracking-widest block">
                Biomarker Tracking
              </span>
              <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-cyan" /> Fasting Blood Glucose (mg/dL) & HbA1c (%)
              </h2>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-cyan font-bold">
                <span className="h-2 w-2 rounded-full bg-cyan" /> Glucose (mg/dL)
              </span>
              <span className="flex items-center gap-1.5 text-leaf font-bold">
                <span className="h-2 w-2 rounded-full bg-leaf" /> Total Cholesterol
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#102D4F" />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#071D35',
                    borderColor: '#0D9488',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="glucose"
                  stroke="#22D3EE"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#22D3EE' }}
                  name="Fasting Glucose"
                />
                <Line
                  type="monotone"
                  dataKey="cholesterol"
                  stroke="#3BA935"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 4, fill: '#3BA935' }}
                  name="Cholesterol"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="p-4 rounded-2xl bg-navy-deep border border-on-dark/10 text-xs text-on-dark-muted flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 text-leaf shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Doctor’s Clinical Note:</strong> Patient exhibits an encouraging 16% reduction in fasting plasma glucose over the last 12 months following regular walks and reduced dietary carbohydrate intake.
            </div>
          </div>
        </div>

        {/* Completed Lab Reports List */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-teal">
            Verified Laboratory Reports ({labReports.length})
          </h2>

          <div className="space-y-4">
            {labReports.map((report) => (
              <div
                key={report.id}
                className="rounded-3xl bg-midnight/40 border border-on-dark/15 p-6 sm:p-7 space-y-4 hover:border-cyan/40 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-on-dark/10">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-base font-bold text-white">
                        {report.testName}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-leaf/20 text-leaf border border-leaf/30">
                        Verified
                      </span>
                    </div>
                    <div className="text-xs text-on-dark-muted mt-0.5">
                      Ref: {report.referenceId} · Sample Date: {report.date}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toast.success(`Downloading signed lab report ${report.referenceId}.pdf...`)}
                    className="px-4 py-2 rounded-xl bg-cyan text-navy-deep font-bold text-xs uppercase flex items-center gap-1.5 shadow-md self-start sm:self-auto"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>

                {/* Report Test Parameter Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-on-dark/10 text-on-dark-muted">
                        <th className="py-2 px-3 font-semibold">Test Parameter</th>
                        <th className="py-2 px-3 font-semibold">Result Value</th>
                        <th className="py-2 px-3 font-semibold">Reference Range</th>
                        <th className="py-2 px-3 font-semibold text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-on-dark/10">
                      {report.results.map((res) => (
                        <tr key={res.id} className="hover:bg-navy-deep/40 transition-colors">
                          <td className="py-2.5 px-3 font-semibold text-white">{res.testName}</td>
                          <td className="py-2.5 px-3 font-bold text-cyan">
                            {res.measuredValue} {res.unit}
                          </td>
                          <td className="py-2.5 px-3 text-on-dark-muted">{res.normalRange} {res.unit}</td>
                          <td className="py-2.5 px-3 text-right">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                                res.status === 'normal'
                                  ? 'bg-leaf/20 text-leaf'
                                  : 'bg-warm-gold/20 text-warm-gold'
                              }`}
                            >
                              {res.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-on-dark-muted">
                  <span>Sign-off: <strong>{report.verifiedByDoctor}</strong></span>
                  <span className="text-leaf">NPHL Category Accredited</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}
