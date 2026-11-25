import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { AccountLayout } from '@/components/account/AccountLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import { Appointment } from '@/types/healthcare';
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  FileText,
  Download,
  AlertCircle,
  QrCode,
  X,
  Stethoscope,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/account/appointments')({
  head: () => ({
    meta: [
      { title: 'My Appointments — Two Brothers Healthcare' },
      { name: 'description', content: 'Track upcoming, past, and cancelled appointments with full status history.' },
    ],
  }),
  component: MyAppointmentsPage,
});

function MyAppointmentsPage() {
  const { appointments, updateAppointmentStatus } = useHealthcare();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const filteredAppointments = appointments.filter((apt) => {
    if (activeTab === 'upcoming') return apt.status === 'confirmed' || apt.status === 'pending';
    if (activeTab === 'past') return apt.status === 'completed';
    return apt.status === 'cancelled';
  });

  const handleCancel = (id: string) => {
    updateAppointmentStatus(id, 'cancelled', 'Cancelled by patient from portal.');
    toast.success('Appointment marked as cancelled.');
    setSelectedAppointment(null);
  };

  return (
    <AccountLayout>
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-on-dark/15">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">My Appointments</h1>
            <p className="text-xs text-on-dark-muted">
              Manage your clinic visits, diagnostic schedules, and consultation receipts.
            </p>
          </div>

          <Link
            to="/book"
            className="px-5 py-2.5 rounded-full bg-cyan text-navy-deep font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all inline-flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            <span>Book New Appointment</span>
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-on-dark/10 pb-3 text-xs">
          {[
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'past', label: 'Past & Completed' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                activeTab === t.id
                  ? 'bg-cyan text-navy-deep'
                  : 'bg-midnight/60 text-on-dark-muted hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Appointment Cards List */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-midnight/30 border border-on-dark/15 p-8">
              <Calendar className="h-10 w-10 text-on-dark-muted mx-auto mb-3" />
              <div className="font-bold text-white text-base">No {activeTab} appointments</div>
              <p className="text-xs text-on-dark-muted mt-1 max-w-sm mx-auto">
                Appointments you schedule will appear here with instant live status updates.
              </p>
            </div>
          ) : (
            filteredAppointments.map((apt) => (
              <div
                key={apt.id}
                className="rounded-3xl bg-midnight/50 border border-on-dark/15 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-cyan/40 transition-colors"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-cyan">{apt.referenceId}</span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                        apt.status === 'confirmed'
                          ? 'bg-leaf/20 text-leaf border border-leaf/30'
                          : apt.status === 'completed'
                            ? 'bg-teal/20 text-teal border border-teal/30'
                            : apt.status === 'cancelled'
                              ? 'bg-destructive/20 text-destructive border border-destructive/30'
                              : 'bg-warm-gold/20 text-warm-gold border border-warm-gold/30'
                      }`}
                    >
                      {apt.status}
                    </span>
                    <span className="text-xs text-on-dark-muted">
                      Fee: <strong className="text-white">NPR {apt.totalFee}</strong>
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-white">
                    {apt.serviceTitle}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-on-dark-muted">
                    <span className="text-white flex items-center gap-1.5 font-medium">
                      <Calendar className="h-3.5 w-3.5 text-cyan" />
                      {apt.appointmentDate} at {apt.timeSlot}
                    </span>
                    <span>•</span>
                    <span>Patient: {apt.patientName}</span>
                    {apt.providerName && (
                      <>
                        <span>•</span>
                        <span>Doctor: {apt.providerName}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedAppointment(apt)}
                    className="px-4 py-2 rounded-xl bg-on-dark/10 hover:bg-white/10 text-white font-semibold text-xs border border-on-dark/20"
                  >
                    View Details & Slip
                  </button>

                  {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                    <button
                      type="button"
                      onClick={() => handleCancel(apt.id)}
                      className="px-4 py-2 rounded-xl bg-destructive/15 hover:bg-destructive text-destructive hover:text-white font-semibold text-xs border border-destructive/30 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Appointment Detail Modal */}
        {selectedAppointment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-deep/80 backdrop-blur-md animate-in fade-in">
            <div className="relative w-full max-w-lg bg-midnight border border-teal/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="absolute top-6 right-6 p-2 rounded-full text-on-dark-muted hover:text-white bg-navy-deep"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center justify-between pb-3 border-b border-on-dark/10">
                <div>
                  <span className="text-[10px] font-bold text-teal uppercase tracking-wider block">
                    Two Brothers Healthcare · Sanagau Clinic
                  </span>
                  <h2 className="font-display text-xl font-bold text-white">
                    {selectedAppointment.referenceId}
                  </h2>
                </div>
                <div className="p-2 rounded-xl bg-white text-navy-deep">
                  <QrCode className="h-7 w-7" />
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-on-dark-muted block">Service:</span>
                  <div className="font-bold text-white text-sm">{selectedAppointment.serviceTitle}</div>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-navy-deep border border-on-dark/10">
                  <div>
                    <span className="text-on-dark-muted block">Date & Time:</span>
                    <span className="font-bold text-white">{selectedAppointment.appointmentDate} at {selectedAppointment.timeSlot}</span>
                  </div>
                  <div>
                    <span className="text-on-dark-muted block">Status:</span>
                    <span className="font-bold text-leaf capitalize">{selectedAppointment.status}</span>
                  </div>
                  <div>
                    <span className="text-on-dark-muted block">Patient Name:</span>
                    <span className="font-bold text-white">{selectedAppointment.patientName}</span>
                  </div>
                  <div>
                    <span className="text-on-dark-muted block">Consultation Fee:</span>
                    <span className="font-bold text-cyan">NPR {selectedAppointment.totalFee}</span>
                  </div>
                </div>

                {selectedAppointment.reasonForVisit && (
                  <div>
                    <span className="text-on-dark-muted block">Reason for Visit / Symptoms:</span>
                    <div className="text-white mt-0.5">{selectedAppointment.reasonForVisit}</div>
                  </div>
                )}

                {selectedAppointment.internalStaffNotes && (
                  <div className="p-3 rounded-xl bg-teal/10 border border-teal/20 text-teal">
                    <strong>Staff Notes:</strong> {selectedAppointment.internalStaffNotes}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-on-dark/10">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-full bg-on-dark/10 text-white font-semibold text-xs border border-on-dark/20 flex items-center gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" /> Print Slip
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedAppointment(null)}
                  className="px-5 py-2.5 rounded-full bg-cyan text-navy-deep font-bold text-xs"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
