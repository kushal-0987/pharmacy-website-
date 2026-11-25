import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AccountLayout } from '@/components/account/AccountLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import {
  Bell,
  CheckCheck,
  Calendar,
  Pill,
  Truck,
  Activity,
  ShieldAlert,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/account/notifications')({
  head: () => ({
    meta: [
      { title: 'Notifications Inbox — Two Brothers Healthcare' },
      { name: 'description', content: 'Patient alerts, prescription confirmation notices, and appointment reminders.' },
    ],
  }),
  component: PatientNotificationsPage,
});

function PatientNotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useHealthcare();
  const [filterType, setFilterType] = useState<string>('all');

  const filteredNotifs = notifications.filter(
    (n) => filterType === 'all' || n.type === filterType
  );

  return (
    <AccountLayout>
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-on-dark/15">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Notifications Inbox</h1>
            <p className="text-xs text-on-dark-muted">
              Real-time SMS, email, and in-app updates on your clinical coordination.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              markAllNotificationsRead();
              toast.success('All notifications marked as read.');
            }}
            className="px-4 py-2 rounded-full bg-midnight border border-on-dark/20 text-xs text-cyan hover:bg-white/5 font-semibold flex items-center gap-1.5 self-start sm:self-auto"
          >
            <CheckCheck className="h-4 w-4" />
            <span>Mark All as Read</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 border-b border-on-dark/10 pb-3 text-xs overflow-x-auto">
          {['all', 'appointment', 'enquiry', 'delivery', 'lab'].map((ft) => (
            <button
              key={ft}
              type="button"
              onClick={() => setFilterType(ft)}
              className={`px-3.5 py-1.5 rounded-full font-semibold capitalize transition-all ${
                filterType === ft
                  ? 'bg-cyan text-navy-deep font-bold'
                  : 'bg-midnight/60 text-on-dark-muted hover:text-white'
              }`}
            >
              {ft === 'all' ? 'All Alerts' : `${ft} Alerts`}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifs.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-midnight/30 border border-on-dark/15 p-8">
              <Bell className="h-10 w-10 text-on-dark-muted mx-auto mb-3" />
              <div className="font-bold text-white text-base">Your notification inbox is clear</div>
              <p className="text-xs text-on-dark-muted mt-1">
                New clinical reminders and delivery dispatches will appear here.
              </p>
            </div>
          ) : (
            filteredNotifs.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                  !n.read
                    ? 'bg-midnight/70 border-cyan/40 shadow-lg'
                    : 'bg-midnight/30 border-on-dark/10 text-on-dark-muted hover:border-on-dark/20'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      n.type === 'appointment'
                        ? 'bg-cyan/20 text-cyan'
                        : n.type === 'enquiry'
                          ? 'bg-teal/20 text-teal'
                          : n.type === 'delivery'
                            ? 'bg-leaf/20 text-leaf'
                            : 'bg-warm-gold/20 text-warm-gold'
                    }`}
                  >
                    {n.type === 'appointment' && <Calendar className="h-5 w-5" />}
                    {n.type === 'enquiry' && <Pill className="h-5 w-5" />}
                    {n.type === 'delivery' && <Truck className="h-5 w-5" />}
                    {n.type === 'lab' && <Activity className="h-5 w-5" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-sm">{n.title}</h3>
                      {!n.read && (
                        <span className="h-2 w-2 rounded-full bg-cyan inline-block" />
                      )}
                    </div>
                    <p className="text-xs text-on-dark-muted leading-relaxed max-w-2xl">
                      {n.message}
                    </p>
                    <div className="text-[11px] text-teal pt-1">
                      Channel: {n.channel.toUpperCase()} · {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                <span className="text-[10px] uppercase font-bold text-on-dark-muted shrink-0">
                  {n.read ? 'Read' : 'New'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </AccountLayout>
  );
}
