import { createFileRoute, Link } from '@tanstack/react-router';
import { AccountLayout } from '@/components/account/AccountLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import {
  Calendar,
  Pill,
  Truck,
  Activity,
  Plus,
  ArrowRight,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/account/')({
  head: () => ({
    meta: [
      { title: 'Patient Dashboard — Two Brothers Healthcare' },
      { name: 'description', content: 'View next appointments, active medicine orders, and recent laboratory reports.' },
    ],
  }),
  component: PatientDashboardPage,
});

function PatientDashboardPage() {
  const {
    currentUser,
    appointments,
    enquiries,
    deliveries,
    notifications,
    updateAppointmentStatus,
  } = useHealthcare();

  // Find next upcoming appointment
  const nextAppointment = appointments.find(
    (a) => a.status === 'confirmed' || a.status === 'pending'
  );

  // Active medicine enquiries
  const activeEnquiries = enquiries.filter(
    (e) => e.status !== 'delivered' && e.status !== 'declined'
  );

  // Active deliveries
  const activeDeliveries = deliveries.filter((d) => d.status !== 'completed');

  // Unread notifications
  const recentNotifs = notifications.slice(0, 3);

  const handleCancelAppointment = (id: string) => {
    updateAppointmentStatus(id, 'cancelled');
    toast.success('Appointment cancelled successfully.');
  };

  return (
    <AccountLayout>
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* Top Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-on-dark/15">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Good day, {currentUser.name}!
            </h1>
            <p className="text-xs sm:text-sm text-on-dark-muted mt-1">
              Welcome to your personal health hub at Two Brothers Healthcare (Sanagau, Lalitpur).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/book"
              className="px-4 py-2 rounded-full bg-cyan text-navy-deep font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all flex items-center gap-1.5"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Book Appointment</span>
            </Link>
            <Link
              to="/pharmacy"
              className="px-4 py-2 rounded-full bg-midnight border border-cyan/40 text-cyan font-bold text-xs hover:bg-white/5 transition-all flex items-center gap-1.5"
            >
              <Pill className="h-3.5 w-3.5" />
              <span>Enquire Medicine</span>
            </Link>
          </div>
        </div>

        {/* 1. Next Appointment Card */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal">
              Upcoming Consultation / Test
            </h2>
            <Link to="/account/appointments" className="text-xs text-cyan hover:underline">
              View All ({appointments.length}) →
            </Link>
          </div>

          {nextAppointment ? (
            <div className="rounded-3xl bg-midnight/60 border border-teal/40 p-6 sm:p-7 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-leaf/20 text-leaf border border-leaf/30 uppercase">
                    {nextAppointment.status}
                  </span>
                  <span className="text-xs font-semibold text-cyan">
                    Ref: {nextAppointment.referenceId}
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold text-white">
                  {nextAppointment.serviceTitle}
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-on-dark-muted">
                  <span className="flex items-center gap-1.5 text-white font-semibold">
                    <Calendar className="h-3.5 w-3.5 text-cyan" />
                    {nextAppointment.appointmentDate} at {nextAppointment.timeSlot}
                  </span>
                  <span>•</span>
                  <span>Patient: {nextAppointment.patientName}</span>
                  <span>•</span>
                  <span className="text-teal font-semibold">Sanagau OPD Clinic</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to="/account/appointments"
                  className="px-4 py-2 rounded-xl bg-on-dark/10 hover:bg-white/10 text-white font-semibold text-xs border border-on-dark/20"
                >
                  View Slip
                </Link>
                <button
                  type="button"
                  onClick={() => handleCancelAppointment(nextAppointment.id)}
                  className="px-4 py-2 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive hover:bg-destructive hover:text-white font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl bg-midnight/30 border border-on-dark/15 p-8 text-center space-y-3">
              <Calendar className="h-10 w-10 text-on-dark-muted mx-auto" />
              <div className="font-bold text-white text-sm">No upcoming appointments scheduled</div>
              <p className="text-xs text-on-dark-muted max-w-sm mx-auto">
                Need a checkup or routine blood testing? Reserve your slot in 2 minutes.
              </p>
              <Link
                to="/book"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-cyan text-navy-deep font-bold text-xs"
              >
                Book Appointment Online
              </Link>
            </div>
          )}
        </div>

        {/* 2-Column: Active Medicine Enquiries & Delivery Tracking */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Medicine Enquiries */}
          <div className="rounded-3xl bg-midnight/40 border border-on-dark/15 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Pill className="h-4 w-4 text-cyan" /> Active Medicine Enquiries
              </h2>
              <Link to="/account/enquiries" className="text-xs text-cyan hover:underline">
                View All →
              </Link>
            </div>

            {activeEnquiries.length === 0 ? (
              <div className="py-8 text-center text-xs text-on-dark-muted">
                No active medicine enquiries right now.
              </div>
            ) : (
              <div className="space-y-3">
                {activeEnquiries.map((enq) => (
                  <div
                    key={enq.id}
                    className="p-4 rounded-2xl bg-navy-deep border border-on-dark/15 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{enq.referenceId}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal/20 text-teal uppercase">
                        {enq.status}
                      </span>
                    </div>
                    <div className="text-on-dark-muted line-clamp-1">
                      {enq.medicineList.map((m) => m.medicineName).join(', ')}
                    </div>
                    {enq.pharmacistNotes && (
                      <div className="text-[11px] text-cyan italic pt-1 border-t border-on-dark/10">
                        Pharmacist: "{enq.pharmacistNotes}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Deliveries */}
          <div className="rounded-3xl bg-midnight/40 border border-on-dark/15 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Truck className="h-4 w-4 text-leaf" /> Doorstep Delivery Status
              </h2>
              <Link to="/account/deliveries" className="text-xs text-cyan hover:underline">
                Track Deliveries →
              </Link>
            </div>

            {activeDeliveries.length === 0 ? (
              <div className="py-8 text-center text-xs text-on-dark-muted">
                No active medicine deliveries en route.
              </div>
            ) : (
              <div className="space-y-3">
                {activeDeliveries.map((del) => (
                  <div
                    key={del.id}
                    className="p-4 rounded-2xl bg-navy-deep border border-leaf/30 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{del.referenceId}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan/20 text-cyan uppercase">
                        {del.status}
                      </span>
                    </div>
                    <div className="text-on-dark-muted">
                      <strong>To:</strong> {del.address}
                    </div>
                    <div className="text-[11px] text-leaf font-semibold flex items-center justify-between pt-1 border-t border-on-dark/10">
                      <span>Rider: {del.assignedStaffName || 'Assigned'}</span>
                      <span>ETA: {del.estimatedDeliveryTime || 'In transit'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 3. Quick Actions Grid */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-teal mb-4">
            Quick Patient Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link
              to="/book"
              className="p-4 rounded-2xl bg-midnight/50 border border-on-dark/15 hover:border-cyan/40 transition-all text-center block group"
            >
              <Calendar className="h-6 w-6 text-cyan mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">Book Appointment</div>
              <div className="text-[10px] text-on-dark-muted mt-0.5">Doctor or Lab</div>
            </Link>

            <Link
              to="/pharmacy"
              className="p-4 rounded-2xl bg-midnight/50 border border-on-dark/15 hover:border-cyan/40 transition-all text-center block group"
            >
              <Pill className="h-6 w-6 text-teal mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">Order Medicines</div>
              <div className="text-[10px] text-on-dark-muted mt-0.5">24/7 Delivery</div>
            </Link>

            <Link
              to="/account/documents"
              className="p-4 rounded-2xl bg-midnight/50 border border-on-dark/15 hover:border-cyan/40 transition-all text-center block group"
            >
              <FileText className="h-6 w-6 text-leaf mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">Upload Prescription</div>
              <div className="text-[10px] text-on-dark-muted mt-0.5">Store in Vault</div>
            </Link>

            <Link
              to="/account/results"
              className="p-4 rounded-2xl bg-midnight/50 border border-on-dark/15 hover:border-cyan/40 transition-all text-center block group"
            >
              <Activity className="h-6 w-6 text-cyan mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">View Lab Trends</div>
              <div className="text-[10px] text-on-dark-muted mt-0.5">Sugar & Lipids</div>
            </Link>
          </div>
        </div>

        {/* 4. Recent Notifications Preview */}
        {recentNotifs.length > 0 && (
          <div className="rounded-3xl bg-midnight/40 border border-on-dark/15 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">Recent Alerts & Updates</h2>
              <Link to="/account/notifications" className="text-xs text-cyan hover:underline">
                View Inbox →
              </Link>
            </div>
            <div className="space-y-2">
              {recentNotifs.map((n) => (
                <div
                  key={n.id}
                  className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between gap-4 ${
                    !n.read
                      ? 'bg-navy-deep border-cyan/30 text-white'
                      : 'bg-navy-deep/40 border-on-dark/10 text-on-dark-muted'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-white">{n.title}</div>
                    <div className="text-[11px] text-on-dark-muted mt-0.5">{n.message}</div>
                  </div>
                  <span className="text-[10px] text-teal shrink-0 uppercase tracking-wider">
                    {n.channel}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
