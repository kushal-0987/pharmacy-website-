import { createFileRoute, Link } from '@tanstack/react-router';
import { StaffLayout } from '@/components/staff/StaffLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import {
  Calendar,
  Pill,
  Truck,
  CheckCircle2,
  Clock,
  UserCheck,
  AlertCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/staff/')({
  head: () => ({
    meta: [
      { title: 'Staff Clinical Dashboard — Two Brothers Healthcare' },
      { name: 'description', content: 'Operational KPIs, upcoming patient arrivals, and pharmacy queue management.' },
    ],
  }),
  component: StaffDashboardPage,
});

function StaffDashboardPage() {
  const {
    currentRole,
    currentUser,
    appointments,
    enquiries,
    deliveries,
    updateAppointmentStatus,
  } = useHealthcare();

  // KPIs
  const todayBookings = appointments.length;
  const pendingConfirmations = appointments.filter((a) => a.status === 'pending').length;
  const confirmedCount = appointments.filter((a) => a.status === 'confirmed').length;
  const arrivedCount = appointments.filter((a) => a.status === 'arrived').length;
  const completedCount = appointments.filter((a) => a.status === 'completed').length;

  const upcomingAppointments = appointments.slice(0, 5);
  const pendingEnquiries = enquiries.filter((e) => e.status === 'submitted' || e.status === 'verified');
  const activeDeliveries = deliveries.filter((d) => d.status !== 'completed');

  const handleMarkArrived = (id: string) => {
    updateAppointmentStatus(id, 'arrived');
    toast.success('Patient marked as arrived at Sanagau clinic reception.');
  };

  const handleConfirmAppointment = (id: string) => {
    updateAppointmentStatus(id, 'confirmed');
    toast.success('Appointment confirmed. SMS alert dispatched to patient.');
  };

  return (
    <StaffLayout>
      <div className="space-y-8 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-on-dark/15">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Clinical Operations Overview</h1>
            <p className="text-xs text-on-dark-muted">
              Live patient arrivals, appointment verification, and queue management for Sanagau Clinic.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/staff/calendar"
              className="px-4 py-2 rounded-full bg-cyan text-navy-deep font-bold text-xs uppercase shadow-md flex items-center gap-1.5"
            >
              <Calendar className="h-4 w-4" />
              <span>Open Calendar View</span>
            </Link>
          </div>
        </div>

        {/* Top Row KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="p-4 rounded-3xl bg-midnight/50 border border-on-dark/15 space-y-1">
            <span className="text-[10px] font-bold text-teal uppercase tracking-wider block">Total Bookings</span>
            <div className="text-2xl font-bold text-white">{todayBookings}</div>
            <div className="text-[10px] text-on-dark-muted">Today's active flow</div>
          </div>

          <div className="p-4 rounded-3xl bg-midnight/50 border border-on-dark/15 space-y-1">
            <span className="text-[10px] font-bold text-warm-gold uppercase tracking-wider block">Pending Review</span>
            <div className="text-2xl font-bold text-warm-gold">{pendingConfirmations}</div>
            <div className="text-[10px] text-on-dark-muted">Awaiting confirmation</div>
          </div>

          <div className="p-4 rounded-3xl bg-midnight/50 border border-on-dark/15 space-y-1">
            <span className="text-[10px] font-bold text-leaf uppercase tracking-wider block">Confirmed</span>
            <div className="text-2xl font-bold text-leaf">{confirmedCount}</div>
            <div className="text-[10px] text-on-dark-muted">Slots held & validated</div>
          </div>

          <div className="p-4 rounded-3xl bg-midnight/50 border border-on-dark/15 space-y-1">
            <span className="text-[10px] font-bold text-cyan uppercase tracking-wider block">In Clinic (Arrived)</span>
            <div className="text-2xl font-bold text-cyan">{arrivedCount}</div>
            <div className="text-[10px] text-on-dark-muted">Waiting in OPD lounge</div>
          </div>

          <div className="p-4 rounded-3xl bg-midnight/50 border border-on-dark/15 space-y-1">
            <span className="text-[10px] font-bold text-on-dark-muted uppercase tracking-wider block">Completed</span>
            <div className="text-2xl font-bold text-white">{completedCount}</div>
            <div className="text-[10px] text-on-dark-muted">Discharged today</div>
          </div>
        </div>

        {/* Next 5 Upcoming Appointments */}
        <div className="rounded-3xl bg-midnight/40 border border-on-dark/15 p-6 sm:p-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 text-cyan" /> Patient Arrival Queue
            </h2>
            <Link to="/staff/appointments" className="text-xs text-cyan hover:underline">
              View All Appointments →
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingAppointments.map((apt) => (
              <div
                key={apt.id}
                className="p-4 rounded-2xl bg-navy-deep border border-on-dark/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-white text-sm">{apt.patientName}</span>
                    <span className="text-teal font-mono">({apt.referenceId})</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        apt.status === 'confirmed'
                          ? 'bg-leaf/20 text-leaf'
                          : apt.status === 'arrived'
                            ? 'bg-cyan/20 text-cyan'
                            : 'bg-warm-gold/20 text-warm-gold'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>
                  <div className="text-on-dark-muted">
                    {apt.serviceTitle} · <strong>{apt.appointmentDate} at {apt.timeSlot}</strong>
                  </div>
                  <div className="text-[11px] text-on-dark-muted">
                    Contact: {apt.patientPhone}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {apt.status === 'pending' && (
                    <button
                      type="button"
                      onClick={() => handleConfirmAppointment(apt.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-leaf text-navy-deep font-bold text-xs"
                    >
                      Confirm Booking
                    </button>
                  )}

                  {apt.status === 'confirmed' && (
                    <button
                      type="button"
                      onClick={() => handleMarkArrived(apt.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-cyan text-navy-deep font-bold text-xs"
                    >
                      Mark Arrived at Clinic
                    </button>
                  )}

                  <Link
                    to="/staff/appointments"
                    className="px-3.5 py-1.5 rounded-xl bg-on-dark/10 hover:bg-white/10 text-white font-semibold text-xs border border-on-dark/20"
                  >
                    Clinical Notes
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2 Columns: Pharmacy Queue (if Pharmacist/General) & Delivery Kanban Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pharmacy Enquiries */}
          <div className="rounded-3xl bg-midnight/40 border border-on-dark/15 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Pill className="h-4 w-4 text-cyan" /> Prescription Review Queue
              </h2>
              <Link to="/staff/enquiries" className="text-xs text-cyan hover:underline">
                Open Dispensary Queue ({pendingEnquiries.length}) →
              </Link>
            </div>

            <div className="space-y-3">
              {pendingEnquiries.length === 0 ? (
                <div className="py-6 text-center text-xs text-on-dark-muted">
                  No pending prescriptions in queue.
                </div>
              ) : (
                pendingEnquiries.slice(0, 3).map((enq) => (
                  <div key={enq.id} className="p-3.5 rounded-2xl bg-navy-deep border border-on-dark/15 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{enq.patientName}</span>
                      <span className="text-[10px] text-cyan font-mono">{enq.referenceId}</span>
                    </div>
                    <div className="text-on-dark-muted truncate">
                      {enq.medicineList.map((m) => m.medicineName).join(', ')}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Delivery Requests */}
          <div className="rounded-3xl bg-midnight/40 border border-on-dark/15 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Truck className="h-4 w-4 text-leaf" /> Active Doorstep Deliveries
              </h2>
              <Link to="/staff/deliveries" className="text-xs text-cyan hover:underline">
                Full Kanban Board →
              </Link>
            </div>

            <div className="space-y-3">
              {activeDeliveries.length === 0 ? (
                <div className="py-6 text-center text-xs text-on-dark-muted">
                  No active courier dispatches right now.
                </div>
              ) : (
                activeDeliveries.slice(0, 3).map((del) => (
                  <div key={del.id} className="p-3.5 rounded-2xl bg-navy-deep border border-leaf/30 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{del.patientName}</span>
                      <span className="text-[10px] text-leaf font-bold uppercase">{del.status}</span>
                    </div>
                    <div className="text-on-dark-muted truncate">{del.address}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}
