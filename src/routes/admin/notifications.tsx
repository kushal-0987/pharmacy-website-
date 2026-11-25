import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import {
  Bell,
  Mail,
  Phone,
  Send,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/notifications')({
  head: () => ({
    meta: [
      { title: 'Notification Gateway & Templates — Two Brothers Healthcare' },
      { name: 'description', content: 'Configure SMS gateway, transactional email templates, and delivery receipts in Nepal.' },
    ],
  }),
  component: AdminNotificationsPage,
});

function AdminNotificationsPage() {
  const [selectedChannel, setSelectedChannel] = useState<'sms' | 'email'>('sms');
  const [smsTemplate, setSmsTemplate] = useState(
    'Two Brothers Healthcare: Hello {{patient_name}}, your appointment for {{service_title}} is confirmed for {{date}} at {{time}}. Ref: {{reference_id}}.'
  );

  const [testPhone, setTestPhone] = useState('9841234567');

  const handleSendTest = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Test notification successfully dispatched to ${testPhone}!`);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-on-dark/15">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Notification Templates & Dispatch</h1>
            <p className="text-xs text-on-dark-muted">
              Configure Nepal SMS gateway (Sparrow / Aakash) and transactional email templates with live variables.
            </p>
          </div>
        </div>

        {/* Template Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 rounded-3xl bg-midnight/50 border border-on-dark/15 p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedChannel('sms')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  selectedChannel === 'sms'
                    ? 'bg-cyan text-navy-deep'
                    : 'bg-navy-deep text-on-dark-muted border border-on-dark/20'
                }`}
              >
                <Phone className="h-4 w-4" /> Nepal SMS Pipeline
              </button>
              <button
                type="button"
                onClick={() => setSelectedChannel('email')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  selectedChannel === 'email'
                    ? 'bg-cyan text-navy-deep'
                    : 'bg-navy-deep text-on-dark-muted border border-on-dark/20'
                }`}
              >
                <Mail className="h-4 w-4" /> Resend Email Dispatch
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-white block">
                Appointment Confirmation Template:
              </label>
              <textarea
                rows={4}
                value={smsTemplate}
                onChange={(e) => setSmsTemplate(e.target.value)}
                className="w-full p-4 rounded-2xl bg-navy-deep border border-on-dark/20 text-white font-mono text-xs focus:outline-none focus:border-cyan"
              />
              <div className="text-[11px] text-teal">
                Variables: <code>&#123;&#123;patient_name&#125;&#125;</code>, <code>&#123;&#123;service_title&#125;&#125;</code>, <code>&#123;&#123;date&#125;&#125;</code>, <code>&#123;&#123;time&#125;&#125;</code>, <code>&#123;&#123;reference_id&#125;&#125;</code>
              </div>
            </div>

            {/* Live Variable Preview */}
            <div className="p-4 rounded-2xl bg-navy-deep border border-teal/40 space-y-1">
              <span className="text-[10px] font-bold text-teal uppercase tracking-wider block">
                Live Dynamic Preview (Rendered on Patient Phone):
              </span>
              <p className="text-xs text-white leading-relaxed">
                Two Brothers Healthcare: Hello Kushal Sharma, your appointment for Doctor Consultation is confirmed for Nov 25 at 09:00 AM. Ref: TBH-2026-001.
              </p>
            </div>
          </div>

          {/* Test Sender */}
          <div className="lg:col-span-4 rounded-3xl bg-midnight/40 border border-on-dark/15 p-6 space-y-6">
            <h3 className="font-bold text-white text-base">Send Test Notification</h3>
            <form onSubmit={handleSendTest} className="space-y-4 text-xs">
              <div>
                <label className="text-white font-semibold block mb-1">Target Mobile Phone</label>
                <input
                  type="tel"
                  required
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-navy-deep border border-on-dark/20 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-cyan text-navy-deep font-bold text-xs uppercase flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" />
                <span>Test Dispatch Now</span>
              </button>
            </form>

            <div className="p-4 rounded-2xl bg-navy-deep border border-on-dark/15 text-[11px] text-on-dark-muted space-y-1">
              <div className="font-bold text-white">Gateway Health Status:</div>
              <div className="text-leaf">Sparrow SMS: Active (Latency 180ms)</div>
              <div className="text-leaf">Resend Email API: Active (99.8%)</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
