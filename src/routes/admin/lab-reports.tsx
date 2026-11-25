import { createFileRoute } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import { LabReport } from '@/types/healthcare';
import {
  FlaskConical,
  Search,
  Eye,
  X,
  CheckCircle2,
  Printer,
} from 'lucide-react';

export const Route = createFileRoute('/admin/lab-reports')({
  head: () => ({
    meta: [
      { title: 'Lab Reports — Two Brothers Healthcare' },
      { name: 'description', content: 'Review verified diagnostic laboratory reports, biomarker readings, and available test panels.' },
    ],
  }),
  component: AdminLabReportsPage,
});

function AdminLabReportsPage() {
  const { labReports, labTests } = useHealthcare();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState<LabReport | null>(null);

  const filteredReports = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return labReports.filter(
      (r) =>
        !q ||
        r.referenceId.toLowerCase().includes(q) ||
        r.patientName.toLowerCase().includes(q) ||
        r.testName.toLowerCase().includes(q)
    );
  }, [labReports, searchTerm]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#082653]">Lab Reports</h1>
            <p className="text-xs text-[#64748B] mt-0.5">
              Diagnostic reports, verified biomarker values, and active laboratory test catalogue ({labTests.length} assays).
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2ECFA] p-4 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search report ID, patient, test name..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-xs text-[#10243B]"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2ECFA] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F4F8FE] border-b border-slate-100 text-[#64748B]">
                  <th className="py-3.5 px-4 font-semibold">Report ID</th>
                  <th className="py-3.5 px-4 font-semibold">Patient</th>
                  <th className="py-3.5 px-4 font-semibold">Diagnostic Panel</th>
                  <th className="py-3.5 px-4 font-semibold">Date</th>
                  <th className="py-3.5 px-4 font-semibold">Verified By</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-[#F4F8FE]/60">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0755D9]">{rep.referenceId}</td>
                    <td className="py-3.5 px-4 font-semibold text-[#10243B]">{rep.patientName}</td>
                    <td className="py-3.5 px-4 text-[#10243B]">{rep.testName}</td>
                    <td className="py-3.5 px-4 text-[#64748B]">{rep.date}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[#10B981] font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {rep.verifiedByDoctor}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedReport(rep)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#0755D9] text-[#082653] text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" /> View Results
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-[#082653]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#D9E8FF] shadow-2xl max-w-xl w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono font-bold text-[#0755D9]">{selectedReport.referenceId}</span>
                <h3 className="font-display text-base font-bold text-[#082653]">{selectedReport.testName}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="p-1.5 rounded-lg text-[#64748B] hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex justify-between bg-[#F4F8FE] p-3 rounded-xl border border-[#E2ECFA]">
              <span>
                Patient: <strong>{selectedReport.patientName}</strong>
              </span>
              <span>
                Date: <strong>{selectedReport.date}</strong>
              </span>
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[#64748B]">
                  <th className="py-2 font-semibold">Parameter</th>
                  <th className="py-2 font-semibold">Result</th>
                  <th className="py-2 font-semibold">Normal Range</th>
                  <th className="py-2 font-semibold text-right">Flag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {selectedReport.results.map((r) => (
                  <tr key={r.id}>
                    <td className="py-2 font-medium text-[#10243B]">{r.testName}</td>
                    <td className="py-2 font-bold text-[#082653]">
                      {r.measuredValue} {r.unit}
                    </td>
                    <td className="py-2 text-[#64748B]">{r.normalRange}</td>
                    <td className="py-2 text-right">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          r.status === 'normal'
                            ? 'bg-emerald-50 text-[#10B981]'
                            : r.status === 'high'
                              ? 'bg-amber-50 text-[#F59E0B]'
                              : 'bg-rose-50 text-[#EF4444]'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
              <span className="text-[#64748B]">Signed: {selectedReport.verifiedByDoctor}</span>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-1.5 rounded-xl bg-[#0755D9] text-white font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5" /> Print
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
