import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { StaffLayout } from '@/components/staff/StaffLayout';
import {
  MessageSquare,
  Send,
  User,
  Search,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/staff/messages')({
  head: () => ({
    meta: [
      { title: 'Patient Communication & SMS Logs — Two Brothers Healthcare' },
      { name: 'description', content: 'Threaded patient conversations, quick templates, and enquiry coordination.' },
    ],
  }),
  component: StaffMessagesPage,
});

interface ChatThread {
  id: string;
  patientName: string;
  phone: string;
  subject: string;
  lastMessage: string;
  timestamp: string;
  messages: { sender: 'patient' | 'staff'; text: string; time: string }[];
}

function StaffMessagesPage() {
  const [threads, setThreads] = useState<ChatThread[]>([
    {
      id: 'th-1',
      patientName: 'Kushal Sharma',
      phone: '9841234567',
      subject: 'Consultation with Dr. Suresh (TBH-2026-001)',
      lastMessage: 'Should I bring my previous fasting glucose reports tomorrow?',
      timestamp: '10:45 AM',
      messages: [
        { sender: 'patient', text: 'Namaste! I booked for 9:00 AM tomorrow.', time: '10:30 AM' },
        { sender: 'staff', text: 'Namaste Mr. Sharma! Your slot is confirmed.', time: '10:35 AM' },
        { sender: 'patient', text: 'Should I bring my previous fasting glucose reports tomorrow?', time: '10:45 AM' },
      ],
    },
    {
      id: 'th-2',
      patientName: 'Sunita Maharjan',
      phone: '9801987654',
      subject: 'Lab Fasting Clarification',
      lastMessage: 'Is drinking plain water allowed before the Lipid Profile draw?',
      timestamp: 'Yesterday',
      messages: [
        { sender: 'patient', text: 'Is drinking plain water allowed before the Lipid Profile draw?', time: 'Yesterday' },
        { sender: 'staff', text: 'Yes Mrs. Maharjan, plain water is allowed and recommended! Avoid milk, tea or sugar.', time: 'Yesterday' },
      ],
    },
  ]);

  const [activeThreadId, setActiveThreadId] = useState<string>('th-1');
  const [replyText, setReplyText] = useState('');

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThreadId
          ? {
              ...t,
              lastMessage: replyText,
              timestamp: 'Just now',
              messages: [
                ...t.messages,
                { sender: 'staff', text: replyText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
              ],
            }
          : t
      )
    );

    toast.success('Reply and SMS notification sent to patient!');
    setReplyText('');
  };

  const templates = [
    'Yes, please bring all past prescriptions and lab reports.',
    'Your medicine order is packed and dispatched with our rider.',
    'Please fast for 10-12 hours overnight. Drinking plain water is allowed.',
    'Your appointment with Dr. Suresh is confirmed for tomorrow.',
  ];

  return (
    <StaffLayout>
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="pb-4 border-b border-on-dark/15">
          <h1 className="font-display text-2xl font-bold text-white">Patient Clinical Communication</h1>
          <p className="text-xs text-on-dark-muted">
            Direct SMS and threaded portal messaging for pre-consultation inquiries and lab prep notes.
          </p>
        </div>

        {/* Chat UI Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[550px] rounded-3xl bg-midnight/50 border border-on-dark/15 overflow-hidden shadow-2xl">
          {/* Threads List (4 cols) */}
          <div className="lg:col-span-4 border-r border-on-dark/15 p-4 space-y-3 bg-midnight/30">
            <div className="text-xs font-bold text-teal uppercase tracking-wider mb-2">
              Recent Patient Threads
            </div>

            <div className="space-y-2">
              {threads.map((th) => (
                <div
                  key={th.id}
                  onClick={() => setActiveThreadId(th.id)}
                  className={`p-3.5 rounded-2xl cursor-pointer transition-all text-xs space-y-1 ${
                    activeThreadId === th.id
                      ? 'bg-navy-deep border border-cyan/40 shadow-md'
                      : 'bg-navy-deep/40 border border-on-dark/10 hover:border-on-dark/20 text-on-dark-muted'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{th.patientName}</span>
                    <span className="text-[10px] text-teal">{th.timestamp}</span>
                  </div>
                  <div className="text-[11px] text-cyan font-medium truncate">{th.subject}</div>
                  <div className="text-[11px] text-on-dark-muted truncate">{th.lastMessage}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Chat Conversation (8 cols) */}
          <div className="lg:col-span-8 flex flex-col justify-between p-6 bg-navy-deep/60">
            {/* Thread Header */}
            <div className="pb-4 border-b border-on-dark/15 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">{activeThread.patientName}</h3>
                <div className="text-xs text-on-dark-muted">
                  Phone: {activeThread.phone} · Thread: {activeThread.subject}
                </div>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-leaf/20 text-leaf font-bold">
                SMS Connected
              </span>
            </div>

            {/* Messages Feed */}
            <div className="py-6 space-y-4 max-h-[350px] overflow-y-auto">
              {activeThread.messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${m.sender === 'staff' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                      m.sender === 'staff'
                        ? 'bg-cyan text-navy-deep font-medium rounded-br-none'
                        : 'bg-midnight text-white border border-on-dark/15 rounded-bl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[10px] text-on-dark-muted/70 mt-1 px-1">
                    {m.sender === 'staff' ? 'Clinical Staff' : activeThread.patientName} · {m.time}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick Templates & Input Bar */}
            <div className="space-y-3 pt-4 border-t border-on-dark/15">
              <div className="flex items-center gap-2 overflow-x-auto text-[11px]">
                <span className="text-on-dark-muted shrink-0">Quick reply:</span>
                {templates.map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setReplyText(tmpl)}
                    className="px-2.5 py-1 rounded-lg bg-midnight border border-on-dark/20 text-white truncate max-w-xs hover:border-cyan text-left"
                  >
                    {tmpl}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSendReply} className="flex gap-2">
                <input
                  type="text"
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type a clinical reply or dispatch notification..."
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-midnight border border-on-dark/20 text-white text-xs focus:outline-none focus:border-cyan"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-cyan text-navy-deep font-bold text-xs flex items-center gap-1.5"
                >
                  <Send className="h-4 w-4" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}
