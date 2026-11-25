import { createFileRoute } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import { Appointment } from '@/types/healthcare';
import {
  Calendar,
  Search,
  Filter,
  Download,
  Trash2,
  CheckCircle2,
  Clock,
  Printer,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/appointments')({
  head: () => ({
    meta: [
      { title: 'Super Admin Appointments Master Registry — Two Brothers Healthcare' },
      { name: 'description', content: 'Enterprise appointment management with filtering, staff assignment, and print day-sheets.' },
    ],
  }),
  component: AdminAppointmentsRegistryPage,
});

function AdminAppointmentsRegistryPage() {
  const { appointments, updateAppointmentStatus } = useHealthcare();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredAppointments = useMemo(() => {
    return appointments.filter((a) => {
      const matchSearch =
        a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.referenceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.patientPhone.includes(searchTerm);
      const matchStatus = statusFilter === 'all' || a.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [appointments, searchTerm, statusFilter]);

  const handlePrintDaySheet = () => {
    window.print();
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-on-dark/15">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Master Appointments Registry</h1>
            <p className="text-xs text-on-dark-muted">
              Centralized appointment schedule across all clinical specialties and diagnostic bays.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrintDaySheet}
              className="px-4 py-2 rounded-full bg-midnight border border-on-dark/20 text-white font-semibold text-xs flex items-center gap-1.5 hover:bg-white/5"
            >
              <Printer className="h-4 w-4 text-cyan" />
              <span>Print Day-Sheet</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 rounded-3xl bg-midnight/50 border border-on-dark/15 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-on-dark-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by patient, phone or TBH-..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-navy-deep border border-on-dark/20 text-white text-xs focus:outline-none focus:border-cyan"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-navy-deep border border-on-dark/20 text-white text-xs focus:outline-none"
            >
              <option value="all">All Statuses ({appointments.length})</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="arrived">Arrived</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Master Table */}
        <div className="rounded-3xl bg-midnight/40 border border-on-dark/15 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-on-dark/15 text-on-dark-muted bg-navy/60">
                  <th className="py-3 px-4 font-bold">Reference</th>
                  <th className="py-3 px-4 font-bold">Patient & Contact</th>
                  <th className="py-3 px-4 font-bold">Service Title</th>
                  <th className="py-3 px-4 font-bold">Slot</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold">Total Fee</th>
                  <th className="py-3 px-4 font-bold text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-on-dark/10">
                {filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-navy-deep/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-cyan font-mono">{apt.referenceId}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{apt.patientName}</div>
                      <div className="text-[11px] text-on-dark-muted">{apt.patientPhone}</div>
                    </td>
                    <td className="py-3 px-4 text-white">{apt.serviceTitle}</td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-white">{apt.appointmentDate}</span>
                      <span className="block text-[11px] text-teal">{apt.timeSlot}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                          apt.status === 'confirmed'
                            ? 'bg-leaf/20 text-leaf'
                            : apt.status === 'arrived'
                              ? 'bg-cyan/20 text-cyan'
                              : apt.status === 'completed'
                                ? 'bg-teal/20 text-teal'
                                : apt.status === 'cancelled'
                                  ? 'bg-destructive/20 text-destructive'
                                  : 'bg-warm-gold/20 text-warm-gold'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-cyan">NPR {apt.totalFee}</td>
                    <td className="py-3 px-4 text-right">
                      {apt.status === 'pending' && (
                        <button
                          type="button"
                          onClick={() => {
                            updateAppointmentStatus(apt.id, 'confirmed');
                            toast.success('Confirmed by Super Admin.');
                          }}
                          className="px-3 py-1 rounded-xl bg-leaf text-navy-deep font-bold text-[11px]"
                        >
                          Confirm
                        </button>
                      )}
                      {apt.status === 'confirmed' && (
                        <button
                          type="button"
                          onClick={() => {
                            updateAppointmentStatus(apt.id, 'arrived');
                            toast.success('Marked as arrived.');
                          }}
                          className="px-3 py-1 rounded-xl bg-cyan text-navy-deep font-bold text-[11px]"
                        >
                          Mark Arrived
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
