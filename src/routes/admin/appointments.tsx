import { createFileRoute } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import { Appointment } from '@/types/healthcare';
import {
  Calendar,
  Search,
  Printer,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Phone,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/appointments')({
  head: () => ({
    meta: [
      { title: 'Appointments & Bookings — Two Brothers Healthcare' },
      { name: 'description', content: 'Structured appointment management with Today/Upcoming filters, sorting, pagination, and clinical status workflows.' },
    ],
  }),
  component: AdminAppointmentsRegistryPage,
});

type FilterTab = 'all' | 'today' | 'upcoming' | 'pending' | 'confirmed' | 'completed' | 'cancelled';
type SortField = 'date' | 'patient' | 'fee';

function getBookingStatusStyle(status: Appointment['status']) {
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

function AdminAppointmentsRegistryPage() {
  const { appointments, providers, updateAppointmentStatus, createAppointment } = useHealthcare();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const [selectedBooking, setSelectedBooking] = useState<Appointment | null>(null);
  const [staffNoteDraft, setStaffNoteDraft] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);

  // New Booking Form State
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientPhone, setNewPatientPhone] = useState('');
  const [newServiceType, setNewServiceType] = useState<Appointment['serviceType']>('consultation');
  const [newProviderId, setNewProviderId] = useState(providers[0]?.id || '');
  const [newDate, setNewDate] = useState('2026-11-25');
  const [newTime, setNewTime] = useState('10:00 AM');
  const [newReason, setNewReason] = useState('');

  // Reference today ISO date aligned with current workspace clock (or real today)
  const todayStr = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }, []);

  const counts = useMemo(() => {
    return {
      all: appointments.length,
      today: appointments.filter((a) => a.appointmentDate === todayStr).length,
      upcoming: appointments.filter((a) => a.appointmentDate >= todayStr && a.status !== 'cancelled' && a.status !== 'completed').length,
      pending: appointments.filter((a) => a.status === 'pending' || a.status === 'held').length,
      confirmed: appointments.filter((a) => a.status === 'confirmed' || a.status === 'arrived').length,
      completed: appointments.filter((a) => a.status === 'completed').length,
      cancelled: appointments.filter((a) => a.status === 'cancelled').length,
    };
  }, [appointments, todayStr]);

  const filteredAndSorted = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const filtered = appointments.filter((a) => {
      const matchSearch =
        !q ||
        a.patientName.toLowerCase().includes(q) ||
        a.referenceId.toLowerCase().includes(q) ||
        a.patientPhone.includes(q) ||
        (a.providerName && a.providerName.toLowerCase().includes(q)) ||
        a.serviceTitle.toLowerCase().includes(q);

      if (!matchSearch) return false;

      switch (activeFilter) {
        case 'today':
          return a.appointmentDate === todayStr;
        case 'upcoming':
          return a.appointmentDate >= todayStr && a.status !== 'cancelled' && a.status !== 'completed';
        case 'pending':
          return a.status === 'pending' || a.status === 'held';
        case 'confirmed':
          return a.status === 'confirmed' || a.status === 'arrived';
        case 'completed':
          return a.status === 'completed';
        case 'cancelled':
          return a.status === 'cancelled';
        default:
          return true;
      }
    });

    return [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'date') {
        cmp = a.appointmentDate.localeCompare(b.appointmentDate);
      } else if (sortField === 'patient') {
        cmp = a.patientName.localeCompare(b.patientName);
      } else {
        cmp = a.totalFee - b.totalFee;
      }
      return sortAsc ? cmp : -cmp;
    });
  }, [appointments, searchTerm, activeFilter, sortField, sortAsc, todayStr]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginatedBookings = filteredAndSorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const openDetails = (apt: Appointment) => {
    setSelectedBooking(apt);
    setStaffNoteDraft(apt.internalStaffNotes || '');
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim() || !newPatientPhone.trim()) return;
    const doc = providers.find((p) => p.id === newProviderId);
    const created = createAppointment({
      patientName: newPatientName.trim(),
      patientPhone: newPatientPhone.trim(),
      serviceType: newServiceType,
      serviceTitle:
        newServiceType === 'consultation' && doc
          ? `${doc.department} Consultation`
          : newServiceType === 'lab'
            ? 'Diagnostic Laboratory Screening'
            : newServiceType === 'package'
              ? 'Preventive Health Package'
              : 'Nursing & Clinical Procedure',
      ...(newServiceType === 'consultation' && doc
        ? { providerId: doc.id, providerName: doc.name }
        : {}),
      appointmentDate: newDate,
      timeSlot: newTime,
      status: 'confirmed',
      reasonForVisit: newReason.trim() || 'Walk-in / Phone Desk Booking',
      totalFee: newServiceType === 'consultation' && doc ? doc.consultationFee : 700,
    });
    toast.success(`Booking ${created.referenceId} created and confirmed.`);
    setShowNewModal(false);
    setNewPatientName('');
    setNewPatientPhone('');
    setNewReason('');
  };

  const filterTabs: { id: FilterTab; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: counts.all },
    { id: 'today', label: 'Today', count: counts.today },
    { id: 'upcoming', label: 'Upcoming', count: counts.upcoming },
    { id: 'pending', label: 'Pending', count: counts.pending },
    { id: 'confirmed', label: 'Confirmed', count: counts.confirmed },
    { id: 'completed', label: 'Completed', count: counts.completed },
    { id: 'cancelled', label: 'Cancelled', count: counts.cancelled },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#082653]">Appointments &amp; Bookings</h1>
            <p className="text-xs text-[#64748B] mt-0.5">
              Centralized OPD schedule, diagnostic slot confirmation, and patient visit tracking.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-white border border-[#D9E8FF] text-[#082653] hover:bg-[#E6F5FF] font-semibold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5 text-[#0755D9]" />
              <span>Print Day-Sheet</span>
            </button>
            <button
              type="button"
              onClick={() => setShowNewModal(true)}
              className="px-4 py-2 rounded-xl bg-[#0755D9] hover:bg-[#082653] text-white font-semibold text-xs inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Booking</span>
            </button>
          </div>
        </div>

        {/* Filter Pills & Search Toolbar */}
        <div className="bg-white rounded-2xl border border-[#E2ECFA] p-4 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveFilter(tab.id);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-[#0755D9] text-white shadow-xs'
                    : 'bg-[#F4F8FE] text-[#64748B] hover:text-[#082653] hover:bg-[#E6F5FF]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${
                    activeFilter === tab.id ? 'bg-white/20 text-white' : 'bg-white text-[#082653]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                placeholder="Search ID, patient, doctor, or phone..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-xs text-[#10243B] placeholder-[#64748B] focus:outline-none focus:border-[#0755D9] focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-[#64748B]">
              <span>Sort by:</span>
              <button
                type="button"
                onClick={() => toggleSort('date')}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium inline-flex items-center gap-1 cursor-pointer ${
                  sortField === 'date' ? 'border-[#0755D9] bg-[#E6F5FF] text-[#0755D9]' : 'border-slate-200 bg-white text-[#10243B]'
                }`}
              >
                <span>Date</span>
                <ArrowUpDown className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => toggleSort('patient')}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium inline-flex items-center gap-1 cursor-pointer ${
                  sortField === 'patient' ? 'border-[#0755D9] bg-[#E6F5FF] text-[#0755D9]' : 'border-slate-200 bg-white text-[#10243B]'
                }`}
              >
                <span>Patient</span>
                <ArrowUpDown className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => toggleSort('fee')}
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium inline-flex items-center gap-1 cursor-pointer ${
                  sortField === 'fee' ? 'border-[#0755D9] bg-[#E6F5FF] text-[#0755D9]' : 'border-slate-200 bg-white text-[#10243B]'
                }`}
              >
                <span>Fee</span>
                <ArrowUpDown className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Structured Bookings Table */}
        <div className="bg-white rounded-2xl border border-[#E2ECFA] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F4F8FE] border-b border-slate-100 text-[#64748B]">
                  <th className="py-3.5 px-4 font-semibold">Booking ID</th>
                  <th className="py-3.5 px-4 font-semibold">Patient Name</th>
                  <th className="py-3.5 px-4 font-semibold">Doctor Name</th>
                  <th className="py-3.5 px-4 font-semibold">Appointment Date</th>
                  <th className="py-3.5 px-4 font-semibold">Appointment Time</th>
                  <th className="py-3.5 px-4 font-semibold">Service Type</th>
                  <th className="py-3.5 px-4 font-semibold">Booking Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedBookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-14 text-center">
                      <Calendar className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                      <div className="text-sm font-semibold text-[#082653]">No bookings found</div>
                      <p className="text-xs text-[#64748B] mt-1">
                        Try clearing your search term or switching status filters.
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginatedBookings.map((apt) => (
                    <tr key={apt.id} className="hover:bg-[#F4F8FE]/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0755D9] whitespace-nowrap">
                        {apt.referenceId}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#10243B]">{apt.patientName}</div>
                        <div className="text-[11px] text-[#64748B]">{apt.patientPhone}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#10243B]">
                        {apt.providerName || 'Diagnostic / Clinic Team'}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#10243B] whitespace-nowrap">
                        {apt.appointmentDate}
                      </td>
                      <td className="py-3.5 px-4 text-[#64748B] whitespace-nowrap">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3 text-[#0755D9]" />
                          {apt.timeSlot}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-[#E6F5FF] text-[#0755D9] text-[10px] font-semibold uppercase mb-0.5">
                          {apt.serviceType}
                        </span>
                        <div className="text-[11px] text-[#64748B] truncate max-w-[170px]">{apt.serviceTitle}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border capitalize ${getBookingStatusStyle(apt.status)}`}
                        >
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {apt.status === 'pending' && (
                            <button
                              type="button"
                              onClick={() => {
                                updateAppointmentStatus(apt.id, 'confirmed');
                                toast.success(`${apt.referenceId} confirmed.`);
                              }}
                              title="Confirm Booking"
                              className="p-1.5 rounded-lg bg-emerald-50 text-[#10B981] hover:bg-[#10B981] hover:text-white border border-emerald-200 transition-colors cursor-pointer"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {apt.status === 'confirmed' && (
                            <button
                              type="button"
                              onClick={() => {
                                updateAppointmentStatus(apt.id, 'completed');
                                toast.success(`${apt.referenceId} marked completed.`);
                              }}
                              title="Mark Completed"
                              className="px-2 py-1 rounded-lg bg-[#E6F5FF] text-[#0755D9] hover:bg-[#0755D9] hover:text-white text-[11px] font-semibold transition-colors cursor-pointer"
                            >
                              Complete
                            </button>
                          )}
                          {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                            <button
                              type="button"
                              onClick={() => {
                                updateAppointmentStatus(apt.id, 'cancelled');
                                toast.info(`${apt.referenceId} cancelled.`);
                              }}
                              title="Cancel Booking"
                              className="p-1.5 rounded-lg bg-rose-50 text-[#EF4444] hover:bg-[#EF4444] hover:text-white border border-rose-200 transition-colors cursor-pointer"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => openDetails(apt)}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 hover:border-[#0755D9] text-[#082653] hover:text-[#0755D9] text-[11px] font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>Details</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-4 py-3 border-t border-slate-100 bg-[#F4F8FE]/50 flex items-center justify-between text-xs text-[#64748B]">
            <span>
              Showing {filteredAndSorted.length === 0 ? 0 : (safePage - 1) * pageSize + 1}–
              {Math.min(safePage * pageSize, filteredAndSorted.length)} of {filteredAndSorted.length} bookings
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg bg-white border border-slate-200 disabled:opacity-40 hover:border-[#0755D9] cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-2 font-semibold text-[#082653]">
                Page {safePage} of {totalPages}
              </span>
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg bg-white border border-slate-200 disabled:opacity-40 hover:border-[#0755D9] cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-[#082653]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#D9E8FF] shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-mono font-bold text-[#0755D9]">{selectedBooking.referenceId}</span>
                <h3 className="font-display text-lg font-bold text-[#082653]">Booking Record Details</h3>
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
                <span className="text-[#64748B] block">Patient Name</span>
                <span className="font-semibold text-[#10243B]">{selectedBooking.patientName}</span>
              </div>
              <div>
                <span className="text-[#64748B] block">Phone</span>
                <span className="font-semibold text-[#10243B] flex items-center gap-1">
                  <Phone className="h-3 w-3 text-[#0755D9]" />
                  {selectedBooking.patientPhone}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block">Doctor / Department</span>
                <span className="font-semibold text-[#10243B]">
                  {selectedBooking.providerName || 'Clinic / Lab Team'}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block">Service Type</span>
                <span className="font-semibold text-[#10243B] capitalize">
                  {selectedBooking.serviceType} — {selectedBooking.serviceTitle}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block">Date &amp; Time</span>
                <span className="font-semibold text-[#10243B]">
                  {selectedBooking.appointmentDate} at {selectedBooking.timeSlot}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] block">Consultation / Test Fee</span>
                <span className="font-bold text-[#0755D9]">NPR {selectedBooking.totalFee.toLocaleString()}</span>
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

            <div className="text-xs space-y-1.5">
              <label className="font-semibold text-[#082653] block">Internal Staff / Triage Notes</label>
              <textarea
                rows={2}
                value={staffNoteDraft}
                onChange={(e) => setStaffNoteDraft(e.target.value)}
                placeholder="Add clinical or front-desk notes..."
                className="w-full p-3 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B] focus:outline-none focus:border-[#0755D9]"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <div className="flex flex-wrap gap-1.5">
                {(['confirmed', 'completed', 'cancelled'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      updateAppointmentStatus(selectedBooking.id, st, staffNoteDraft);
                      setSelectedBooking({ ...selectedBooking, status: st, internalStaffNotes: staffNoteDraft });
                      toast.success(`Status updated to ${st}.`);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize cursor-pointer ${
                      st === 'confirmed'
                        ? 'bg-[#10B981] text-white'
                        : st === 'completed'
                          ? 'bg-[#0755D9] text-white'
                          : 'bg-rose-50 text-[#EF4444] border border-rose-200'
                    }`}
                  >
                    Set {st}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  updateAppointmentStatus(selectedBooking.id, selectedBooking.status, staffNoteDraft);
                  toast.success('Notes saved.');
                  setSelectedBooking(null);
                }}
                className="px-4 py-1.5 rounded-xl border border-slate-200 text-[#082653] text-xs font-semibold cursor-pointer"
              >
                Save &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Desk Booking Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-[#082653]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateBooking}
            className="bg-white rounded-2xl border border-[#D9E8FF] shadow-2xl max-w-md w-full p-6 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display text-base font-bold text-[#082653]">Create New Booking</h3>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="p-1 rounded-lg text-[#64748B] hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-semibold text-[#082653] block mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  placeholder="e.g. Sita Gurung"
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B]"
                />
              </div>
              <div>
                <label className="font-semibold text-[#082653] block mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={newPatientPhone}
                  onChange={(e) => setNewPatientPhone(e.target.value)}
                  placeholder="9841XXXXXX"
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#082653] block mb-1">Service Type</label>
                  <select
                    value={newServiceType}
                    onChange={(e) => setNewServiceType(e.target.value as Appointment['serviceType'])}
                    className="w-full px-3 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B]"
                  >
                    <option value="consultation">Doctor Consultation</option>
                    <option value="lab">Lab Diagnostic</option>
                    <option value="package">Health Package</option>
                    <option value="other">Nursing / Procedure</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#082653] block mb-1">Assigned Doctor</label>
                  <select
                    value={newProviderId}
                    onChange={(e) => setNewProviderId(e.target.value)}
                    disabled={newServiceType !== 'consultation'}
                    className="w-full px-3 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B] disabled:opacity-50"
                  >
                    {providers.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#082653] block mb-1">Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#082653] block mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="10:00 AM"
                    className="w-full px-3 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B]"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold text-[#082653] block mb-1">Notes / Reason</label>
                <input
                  type="text"
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  placeholder="Optional visit reason"
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-[#64748B] font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#0755D9] text-white font-semibold cursor-pointer"
              >
                Confirm Booking
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}
