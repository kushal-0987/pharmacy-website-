import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { StaffLayout } from '@/components/staff/StaffLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import {
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/staff/schedule')({
  head: () => ({
    meta: [
      { title: 'My Schedule & Shift Hours — Two Brothers Healthcare' },
      { name: 'description', content: 'Personal clinical shift hours and time-off request management.' },
    ],
  }),
  component: StaffSchedulePage,
});

function StaffSchedulePage() {
  const { currentUser, appointments } = useHealthcare();
  const [showTimeOff, setShowTimeOff] = useState(false);
  const [leaveDate, setLeaveDate] = useState('2026-12-01');
  const [leaveReason, setLeaveReason] = useState('');

  const shifts = [
    { day: 'Sunday', hours: '08:00 AM – 02:00 PM', department: 'Sanagau OPD Suite 1', status: 'Scheduled' },
    { day: 'Monday', hours: '08:00 AM – 02:00 PM', department: 'Sanagau OPD Suite 1', status: 'Scheduled' },
    { day: 'Tuesday', hours: '08:00 AM – 02:00 PM', department: 'Sanagau OPD Suite 1', status: 'Scheduled' },
    { day: 'Wednesday', hours: '08:00 AM – 02:00 PM', department: 'Sanagau OPD Suite 1', status: 'Active Today' },
    { day: 'Thursday', hours: '08:00 AM – 02:00 PM', department: 'Sanagau OPD Suite 1', status: 'Scheduled' },
    { day: 'Friday', hours: '08:00 AM – 01:00 PM', department: 'Sanagau OPD Suite 1', status: 'Scheduled' },
    { day: 'Saturday', hours: 'Off Duty', department: 'Weekly Rest', status: 'Off' },
  ];

  const handleRequestTimeOff = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Time-off request for ${leaveDate} submitted to Clinical Director.`);
    setShowTimeOff(false);
    setLeaveReason('');
  };

  return (
    <StaffLayout>
      <div className="space-y-8 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-on-dark/15">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">My Clinical Duty Schedule</h1>
            <p className="text-xs text-on-dark-muted">
              Shift hours, roster duties, and leave balance for {currentUser.name}.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowTimeOff(!showTimeOff)}
            className="px-4 py-2 rounded-full bg-cyan text-navy-deep font-bold text-xs uppercase shadow-md flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Clock className="h-4 w-4" />
            <span>Request Time Off</span>
          </button>
        </div>

        {/* Time Off Modal */}
        {showTimeOff && (
          <form
            onSubmit={handleRequestTimeOff}
            className="p-6 rounded-3xl bg-midnight/70 border border-teal/40 space-y-4 text-xs animate-in fade-in shadow-2xl"
          >
            <h3 className="font-bold text-white text-base">Request Shift Leave / Substitute</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-white font-semibold block mb-1">Date Requested</label>
                <input
                  type="date"
                  required
                  value={leaveDate}
                  onChange={(e) => setLeaveDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-navy-deep border border-on-dark/20 text-white"
                />
              </div>
              <div>
                <label className="text-white font-semibold block mb-1">Reason / Covering Clinician</label>
                <input
                  type="text"
                  required
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  placeholder="e.g. CME Medical Conference / Personal Leave"
                  className="w-full px-3 py-2 rounded-xl bg-navy-deep border border-on-dark/20 text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowTimeOff(false)}
                className="px-4 py-1.5 rounded-full text-on-dark-muted hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-1.5 rounded-full bg-cyan text-navy-deep font-bold"
              >
                Submit Request
              </button>
            </div>
          </form>
        )}

        {/* Weekly Shifts Grid */}
        <div className="rounded-3xl bg-midnight/40 border border-on-dark/15 overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-on-dark/15 font-bold text-white text-sm">
            Weekly Roster Hours
          </div>
          <div className="divide-y divide-on-dark/10 text-xs">
            {shifts.map((s) => (
              <div
                key={s.day}
                className={`p-4 flex items-center justify-between ${
                  s.status === 'Active Today' ? 'bg-teal/15 font-bold text-white' : 'text-on-dark-muted'
                }`}
              >
                <div className="w-28 font-bold text-white">{s.day}</div>
                <div className="text-cyan font-mono">{s.hours}</div>
                <div className="hidden sm:block text-on-dark-muted">{s.department}</div>
                <div className="text-right">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      s.status === 'Active Today'
                        ? 'bg-leaf text-navy-deep'
                        : s.status === 'Off'
                          ? 'bg-on-dark/10 text-on-dark-muted'
                          : 'bg-teal/20 text-teal'
                    }`}
                  >
                    {s.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}
