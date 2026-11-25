import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { StaffLayout } from '@/components/staff/StaffLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import { Appointment } from '@/types/healthcare';
import {
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  FileText,
  Download,
  Clock,
  User,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/staff/appointments/')({
  head: () => ({
    meta: [
      { title: 'Appointment Registry & Management — Two Brothers Healthcare' },
      { name: 'description', content: 'Comprehensive patient appointment management with status update controls.' },
    ],
  }),
  component: StaffAppointmentsListPage,
});

function StaffAppointmentsListPage() {
  const { appointments, updateAppointmentStatus } = useHealthcare();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterService, setFilterService] = useState<string>('all');
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);
  const [staffNote, setStaffNote] = useState('');

  const filtered = useMemo(() => {
    return appointments.filter((a) => {
      const matchSearch =
        a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.patientPhone.includes(searchTerm) ||
        a.referenceId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = filterStatus === 'all' || a.status === filterStatus;
      const matchService = filterService === 'all' || a.serviceType === filterService;
      return matchSearch && matchStatus && matchService;
    });
  }, [appointments, searchTerm, filterStatus, filterService]);

  const handleUpdateStatus = (id: string, status: Appointment['status']) => {
    updateAppointmentStatus(id, status, staffNote || undefined);
    toast.success(`Appointment status updated to ${status.toUpperCase()}`);
    setSelectedApt(null);
    setStaffNote('');
  };

  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Reference,Patient,Phone,Service,Date,Time,Status,Fee\n' +
      appointments
        .map(
          (a) =>
            `${a.referenceId},"${a.patientName}",${a.patientPhone},"${a.serviceTitle}",${a.appointmentDate},${a.timeSlot},${a.status},${a.totalFee}`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TBH_Appointments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    toast.success('Appointments exported to CSV!');
  };

  return (
    <StaffLayout>
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-on-dark/15">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">All Clinic Appointments</h1>
            <p className="text-xs text-on-dark-muted">
              Live consultation roster, status updates, and OPD arrival desk.
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            className="px-4 py-2 rounded-full bg-midnight border border-on-dark/20 text-white font-semibold text-xs flex items-center gap-1.5 self-start sm:self-auto hover:bg-white/5"
          >
            <Download className="h-4 w-4 text-cyan" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Filter Bar */}
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

          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-xl bg-navy-deep border border-on-dark/20 text-white text-xs focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="arrived">Arrived</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
              className="px-3 py-2 rounded-xl bg-navy-deep border border-on-dark/20 text-white text-xs focus:outline-none"
            >
              <option value="all">All Services</option>
              <option value="consultation">Doctor Consultations</option>
              <option value="lab">Lab Investigations</option>
              <option value="package">Health Packages</option>
            </select>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="rounded-3xl bg-midnight/40 border border-on-dark/15 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-on-dark/15 text-on-dark-muted bg-navy/60">
                  <th className="py-3 px-4 font-bold">Ref ID</th>
                  <th className="py-3 px-4 font-bold">Patient</th>
                  <th className="py-3 px-4 font-bold">Service & Provider</th>
                  <th className="py-3 px-4 font-bold">Scheduled Slot</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold">Fee</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-on-dark/10">
                {filtered.map((apt) => (
                  <tr key={apt.id} className="hover:bg-navy-deep/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-cyan font-mono">{apt.referenceId}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{apt.patientName}</div>
                      <div className="text-[11px] text-on-dark-muted">{apt.patientPhone}</div>
                    </td>
                    <td className="py-3 px-4 text-white">
                      <div>{apt.serviceTitle}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-white font-medium">{apt.appointmentDate}</div>
                      <div className="text-teal text-[11px]">{apt.timeSlot}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
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
                      <button
                        type="button"
                        onClick={() => setSelectedApt(apt)}
                        className="px-3 py-1 rounded-xl bg-on-dark/10 hover:bg-white/10 text-white font-semibold text-[11px] border border-on-dark/20"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Modal */}
        {selectedApt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-deep/80 backdrop-blur-md animate-in fade-in">
            <div className="relative w-full max-w-lg bg-midnight border border-teal/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
              <button
                type="button"
                onClick={() => setSelectedApt(null)}
                className="absolute top-6 right-6 p-2 rounded-full text-on-dark-muted hover:text-white bg-navy-deep"
              >
                <X className="h-5 w-5" />
              </button>

              <div>
                <span className="text-[10px] font-bold text-teal uppercase tracking-wider block">
                  Manage Patient Appointment
                </span>
                <h2 className="font-display text-xl font-bold text-white">
                  {selectedApt.patientName} ({selectedApt.referenceId})
                </h2>
                <div className="text-xs text-on-dark-muted mt-1">
                  {selectedApt.serviceTitle} · {selectedApt.appointmentDate} at {selectedApt.timeSlot}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-white block mb-1">
                  Internal Clinical Staff Notes:
                </label>
                <textarea
                  rows={2}
                  value={staffNote}
                  onChange={(e) => setStaffNote(e.target.value)}
                  placeholder="e.g. Patient checked in at counter, BP 120/80, waiting in room 2..."
                  className="w-full px-3 py-2 rounded-xl bg-navy-deep border border-on-dark/20 text-white text-xs"
                />
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-white block">Update Appointment State:</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedApt.id, 'confirmed')}
                    className="p-2.5 rounded-xl bg-leaf text-navy-deep font-bold"
                  >
                    Confirm Booking
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedApt.id, 'arrived')}
                    className="p-2.5 rounded-xl bg-cyan text-navy-deep font-bold"
                  >
                    Mark Arrived (In Clinic)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedApt.id, 'completed')}
                    className="p-2.5 rounded-xl bg-teal text-white font-bold"
                  >
                    Mark Completed & Discharged
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedApt.id, 'cancelled')}
                    className="p-2.5 rounded-xl bg-destructive text-white font-bold"
                  >
                    Cancel Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </StaffLayout>
  );
}
