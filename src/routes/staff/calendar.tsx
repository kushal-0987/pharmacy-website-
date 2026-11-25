import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { StaffLayout } from '@/components/staff/StaffLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import {
  CalendarDays,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/staff/calendar')({
  head: () => ({
    meta: [
      { title: 'Appointment & Duty Calendar — Two Brothers Healthcare' },
      { name: 'description', content: 'Day, week, and month views for clinical schedules, doctor consultations, and diagnostic tests.' },
    ],
  }),
  component: StaffCalendarPage,
});

function StaffCalendarPage() {
  const { appointments, providers, updateAppointmentStatus } = useHealthcare();
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [selectedStaff, setSelectedStaff] = useState<string>('all');

  const daysOfWeek = [
    { name: 'Sun', date: 'Nov 22' },
    { name: 'Mon', date: 'Nov 23' },
    { name: 'Tue', date: 'Nov 24' },
    { name: 'Wed', date: 'Nov 25' },
    { name: 'Thu', date: 'Nov 26' },
    { name: 'Fri', date: 'Nov 27' },
    { name: 'Sat', date: 'Nov 28' },
  ];

  const timeSlots = [
    '08:00 AM',
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
    '06:00 PM',
  ];

  return (
    <StaffLayout>
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-on-dark/15">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Clinical Appointment Calendar</h1>
            <p className="text-xs text-on-dark-muted">
              Synchronized schedule for doctor consultations, lab tests, and nursing procedures.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Selector */}
            <div className="flex items-center gap-1 bg-midnight border border-on-dark/15 rounded-xl p-1 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('day')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  viewMode === 'day' ? 'bg-cyan text-navy-deep' : 'text-on-dark-muted hover:text-white'
                }`}
              >
                Day
              </button>
              <button
                type="button"
                onClick={() => setViewMode('week')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  viewMode === 'week' ? 'bg-cyan text-navy-deep' : 'text-on-dark-muted hover:text-white'
                }`}
              >
                Week
              </button>
              <button
                type="button"
                onClick={() => setViewMode('month')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  viewMode === 'month' ? 'bg-cyan text-navy-deep' : 'text-on-dark-muted hover:text-white'
                }`}
              >
                Month
              </button>
            </div>

            {/* Filter by Staff */}
            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="px-3 py-2 rounded-xl bg-midnight border border-on-dark/20 text-white text-xs focus:outline-none"
            >
              <option value="all">All Clinicians</option>
              {providers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="rounded-3xl bg-midnight/50 border border-on-dark/15 overflow-hidden shadow-2xl">
          {/* Days Header */}
          <div className="grid grid-cols-7 border-b border-on-dark/15 text-center text-xs">
            {daysOfWeek.map((d, i) => (
              <div
                key={d.name}
                className={`py-3.5 px-2 border-r border-on-dark/10 last:border-r-0 ${
                  i === 3 ? 'bg-teal/15 text-white font-bold' : 'text-on-dark-muted'
                }`}
              >
                <span className="block text-[11px] font-semibold">{d.name}</span>
                <span className="font-bold text-white text-sm">{d.date}</span>
              </div>
            ))}
          </div>

          {/* Slots Matrix */}
          <div className="divide-y divide-on-dark/10 max-h-[600px] overflow-y-auto">
            {timeSlots.map((slot) => (
              <div key={slot} className="grid grid-cols-7 min-h-[70px]">
                {daysOfWeek.map((day, dIdx) => {
                  // Find matching appointments for Wednesday Nov 25 or demo slots
                  const matchingApt = appointments.find(
                    (a) => dIdx === 3 && a.timeSlot === slot
                  );

                  return (
                    <div
                      key={day.name}
                      className="border-r border-on-dark/10 last:border-r-0 p-1.5 relative hover:bg-navy-deep/40 transition-colors"
                    >
                      <span className="text-[9px] text-on-dark-muted/60 block">{slot}</span>

                      {matchingApt && (
                        <div
                          onClick={() => toast.info(`Appointment: ${matchingApt.patientName} (${matchingApt.serviceTitle})`)}
                          className="mt-1 p-2 rounded-xl bg-teal/20 border border-teal text-white cursor-pointer hover:scale-[1.02] transition-transform text-xs space-y-0.5"
                        >
                          <div className="font-bold text-cyan truncate">{matchingApt.patientName}</div>
                          <div className="text-[10px] text-on-dark-muted truncate">{matchingApt.serviceTitle}</div>
                          <div className="text-[10px] text-leaf font-semibold uppercase">{matchingApt.status}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}
