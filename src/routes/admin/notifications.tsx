import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import {
  Bell,
  Mail,
  Phone,
  Send,
  CheckCheck,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/notifications')({
  head: () => ({
    meta: [
      { title: 'Notifications & Templates — Two Brothers Healthcare' },
      { name: 'description', content: 'Review system alerts and configure SMS/email templates.' },
    ],
  }),
  component: AdminNotificationsPage,
});

function AdminNotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useHealthcare();
  const [selectedChannel, setSelectedChannel] = useState<'sms' | 'email'>('sms');
  const [smsTemplate, setSmsTemplate] = useState(
    'Two Brothers Healthcare: Hello {{patient_name}}, your appointment for {{service_title}} is confirmed for {{date}} at {{time}}. Ref: {{reference_id}}.'
  );
  const [testPhone, setTestPhone] = useState('9841234567');

  const handleSendTest = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Test ${selectedChannel.toUpperCase()} preview prepared for ${testPhone}.`);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#082653]">Notifications</h1>
            <p className="text-xs text-[#64748B] mt-0.5">
              System activity notifications and Nepal SMS / transactional email templates.
            </p>
          </div>

          <button
            type="button"
            onClick={markAllNotificationsRead}
            className="px-4 py-2 rounded-xl bg-white border border-[#D9E8FF] text-[#0755D9] font-semibold text-xs inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <CheckCheck className="h-4 w-4" />
            <span>Mark All Read</span>
          </button>
        </div>

        {/* Recent System Notifications */}
        <div className="bg-white rounded-2xl border border-[#E2ECFA] p-5 shadow-xs space-y-3">
          <h2 className="font-display text-base font-bold text-[#082653] flex items-center gap-2">
            <Bell className="h-4 w-4 text-[#0755D9]" /> Recent Alerts ({notifications.length})
          </h2>

          <div className="divide-y divide-slate-100">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`py-3 px-3 rounded-xl flex items-start justify-between gap-4 cursor-pointer transition-colors ${
                  n.read ? 'hover:bg-slate-50' : 'bg-[#E6F5FF]/50 hover:bg-[#E6F5FF]'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold text-[#10243B] flex items-center gap-2">
                    {!n.read && <span className="h-2 w-2 rounded-full bg-[#0755D9]" />}
                    <span>{n.title}</span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-0.5">{n.message}</p>
                </div>
                <span className="text-[11px] font-medium text-[#64748B] uppercase shrink-0">{n.channel}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Template Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E2ECFA] p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedChannel('sms')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer ${
                  selectedChannel === 'sms'
                    ? 'bg-[#0755D9] text-white'
                    : 'bg-[#F4F8FE] text-[#64748B] border border-[#E2ECFA]'
                }`}
              >
                <Phone className="h-3.5 w-3.5" /> Nepal SMS Template
              </button>
              <button
                type="button"
                onClick={() => setSelectedChannel('email')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer ${
                  selectedChannel === 'email'
                    ? 'bg-[#0755D9] text-white'
                    : 'bg-[#F4F8FE] text-[#64748B] border border-[#E2ECFA]'
                }`}
              >
                <Mail className="h-3.5 w-3.5" /> Email Dispatch
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-semibold text-[#082653] block">Appointment Confirmation Template</label>
              <textarea
                rows={4}
                value={smsTemplate}
                onChange={(e) => setSmsTemplate(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B] font-mono text-xs focus:outline-none focus:border-[#0755D9]"
              />
            </div>
          </div>

          <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E2ECFA] p-6 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-[#082653] text-sm">Send Test Preview</h3>
            <form onSubmit={handleSendTest} className="space-y-4 text-xs">
              <div>
                <label className="text-[#082653] font-semibold block mb-1">Target Mobile / Email</label>
                <input
                  type="text"
                  required
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#0755D9] hover:bg-[#082653] text-white font-semibold text-xs inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Test Dispatch</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
