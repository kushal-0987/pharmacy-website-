import { createFileRoute, Link } from '@tanstack/react-router';
import { StaffLayout } from '@/components/staff/StaffLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import {
  Calendar,
  User,
  Clock,
  Phone,
  ArrowLeft,
  CheckCircle2,
  FileText,
  ShieldCheck,
} from 'lucide-react';

export const Route = createFileRoute('/staff/appointments/$id')({
  component: StaffAppointmentDetailPage,
});

function StaffAppointmentDetailPage() {
  const { id } = Route.useParams();
  const { appointments } = useHealthcare();

  const apt = appointments.find((a) => a.id === id) || appointments[0];

  return (
    <StaffLayout>
      <div className="space-y-6 animate-in fade-in duration-300">
        <Link
          to="/staff/appointments"
          className="inline-flex items-center gap-1.5 text-xs text-on-dark-muted hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Master Appointments List
        </Link>

        <div className="p-8 rounded-3xl bg-midnight/60 border border-teal/40 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-on-dark/15">
            <div>
              <span className="text-xs font-bold text-teal uppercase tracking-widest block">
                Appointment File
              </span>
              <h1 className="font-display text-2xl font-bold text-white">
                {apt.referenceId} — {apt.patientName}
              </h1>
            </div>
            <span className="px-3 py-1 rounded-full bg-leaf/20 text-leaf border border-leaf/30 font-bold text-xs uppercase">
              {apt.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-navy-deep border border-on-dark/15">
              <span className="text-on-dark-muted block">Scheduled Slot:</span>
              <span className="font-bold text-white text-sm">{apt.appointmentDate} at {apt.timeSlot}</span>
            </div>
            <div className="p-4 rounded-2xl bg-navy-deep border border-on-dark/15">
              <span className="text-on-dark-muted block">Service:</span>
              <span className="font-bold text-white text-sm">{apt.serviceTitle}</span>
            </div>
            <div className="p-4 rounded-2xl bg-navy-deep border border-on-dark/15">
              <span className="text-on-dark-muted block">Total Fee:</span>
              <span className="font-bold text-cyan text-sm">NPR {apt.totalFee}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-navy-deep border border-on-dark/15 text-xs text-on-dark-muted space-y-2">
            <div className="font-bold text-white">Patient Stated Reason / Symptoms:</div>
            <p>{apt.reasonForVisit || 'Routine checkup and clinical review.'}</p>
          </div>

          {apt.internalStaffNotes && (
            <div className="p-4 rounded-2xl bg-teal/15 border border-teal/30 text-xs text-teal space-y-1">
              <div className="font-bold">Private Internal Staff Notes:</div>
              <p className="text-white">{apt.internalStaffNotes}</p>
            </div>
          )}
        </div>
      </div>
    </StaffLayout>
  );
}
