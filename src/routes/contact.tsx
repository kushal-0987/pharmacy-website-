import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { PublicLayout } from '@/components/common/PublicLayout';
import {
  MapPin,
  PhoneCall,
  Mail,
  Clock,
  Send,
  AlertTriangle,
  Building,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/contact')({
  head: () => ({
    meta: [
      { title: 'Contact & Location — Two Brothers Healthcare | Sanagau, Lalitpur' },
      {
        name: 'description',
        content:
          'Get in touch with Two Brothers Healthcare in Sanagau, Lalitpur. 24/7 Pharmacy hotline, doctor appointment desk, ambulance emergency contacts, and driving directions.',
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('General Enquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) {
      toast.error('Please complete all required fields.');
      return;
    }
    setSubmitted(true);
    toast.success('Your message has been received! Our front desk will respond shortly.');
  };

  return (
    <PublicLayout>
      {/* 1. Hero */}
      <section className="py-16 bg-gradient-to-b from-navy to-navy-deep border-b border-on-dark/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan block mb-3">
              Always Here for You
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight leading-[1.1] mb-4">
              Contact & Visit Our Sanagau Clinic.
            </h1>
            <p className="text-sm sm:text-base text-on-dark-muted leading-relaxed">
              We are located on the main Sanagau road in Lalitpur. Whether you need immediate medicine assistance, wish to book specialist consultation, or enquire about diagnostic packages, our team is standing by.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Main Two-Column Contact Section */}
      <section className="py-16 bg-navy-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Contact Form */}
            <div className="lg:col-span-7 rounded-3xl bg-midnight/50 border border-on-dark/15 p-8 sm:p-10 shadow-2xl">
              <h2 className="font-display text-2xl font-bold text-white mb-2">
                Send Us a Message
              </h2>
              <p className="text-xs text-on-dark-muted mb-8">
                Fill out the form below and our administrative or pharmacy team will reply within 2 hours.
              </p>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-leaf/20 border border-leaf/40 text-center space-y-4">
                  <CheckCircle2 className="h-12 w-12 text-leaf mx-auto" />
                  <h3 className="text-lg font-bold text-white">Thank You, {name}!</h3>
                  <p className="text-xs text-on-dark-muted max-w-md mx-auto">
                    Your message regarding <strong>{department}</strong> has been forwarded to the clinic team. We will call you at <strong>{phone}</strong> shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setMessage('');
                    }}
                    className="px-6 py-2.5 rounded-full bg-cyan text-navy-deep font-bold text-xs uppercase"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-white block mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Kushal Sharma"
                        className="w-full px-4 py-3 rounded-2xl bg-navy-deep border border-on-dark/20 text-white text-xs focus:outline-none focus:border-cyan"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-white block mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="9841234567"
                        className="w-full px-4 py-3 rounded-2xl bg-navy-deep border border-on-dark/20 text-white text-xs focus:outline-none focus:border-cyan"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-white block mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-2xl bg-navy-deep border border-on-dark/20 text-white text-xs focus:outline-none focus:border-cyan"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-white block mb-1">
                        Department / Subject
                      </label>
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-navy-deep border border-on-dark/20 text-white text-xs focus:outline-none"
                      >
                        <option value="General Enquiry">General Enquiry</option>
                        <option value="Pharmacy & Medicine Stock">Pharmacy & Medicine Stock</option>
                        <option value="Doctor Appointment Booking">Doctor Appointment Booking</option>
                        <option value="Laboratory Reports & Home Collection">Laboratory Reports & Home Collection</option>
                        <option value="Billing & Corporate Feedback">Billing & Corporate Feedback</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-white block mb-1">
                      Your Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please let us know how we can assist you..."
                      className="w-full px-4 py-3 rounded-2xl bg-navy-deep border border-on-dark/20 text-white text-xs focus:outline-none focus:border-cyan"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-full bg-gradient-to-r from-teal to-cyan text-navy-deep font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send Message to Two Brothers Team</span>
                  </button>
                </form>
              )}
            </div>

            {/* Right: Contact Details & Hours */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-3xl bg-midnight/40 border border-on-dark/15 p-8 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-on-dark/10">
                  <div className="h-12 w-12 rounded-2xl bg-white p-1.5 ring-2 ring-cyan/40 shrink-0 shadow-md">
                    <img src="/logo.png" alt="Two Brothers Healthcare logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-white">Two Brothers Healthcare</h3>
                    <span className="text-[11px] text-teal font-medium">Sanagau, Lalitpur, Nepal</span>
                  </div>
                </div>

                <h4 className="font-display text-lg font-bold text-white">Direct Department Contacts</h4>

                <div className="space-y-4 text-xs">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-cyan shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Physical Location:</strong>
                      <span className="text-on-dark-muted">
                        Ward No. 4, Sanagau (Near Shiva Temple), Mahalaxmi Municipality, Lalitpur, Bagmati Province, Nepal
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <PhoneCall className="h-5 w-5 text-leaf shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Phone Lines:</strong>
                      <div className="text-cyan font-bold mt-0.5">
                        <a href="tel:015582910" className="hover:underline">01-5582910 (Front Desk)</a>
                      </div>
                      <div className="text-leaf font-bold">
                        <a href="tel:9801234567" className="hover:underline">9801234567 (Emergency / 24/7 Pharmacy)</a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-warm-gold shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Operating Schedule:</strong>
                      <div className="text-on-dark-muted">
                        <div>• Pharmacy: Open 24/7 (All Days)</div>
                        <div>• Doctor OPD & Lab: 7:00 AM – 8:00 PM (Daily)</div>
                        <div>• Emergency Care & Vitals: 24 Hours</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-cyan shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">Email Enquiries:</strong>
                      <a href="mailto:care@twobrothershealthcare.com" className="text-on-dark-muted hover:text-white">
                        care@twobrothershealthcare.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Emergency Notice Box */}
              <div className="rounded-3xl bg-destructive/15 border border-destructive/40 p-6 space-y-2">
                <div className="flex items-center gap-2 text-destructive font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle className="h-4 w-4" />
                  <span>When to Seek Immediate Hospital Trauma Care</span>
                </div>
                <p className="text-xs text-on-dark-muted leading-relaxed">
                  Two Brothers Healthcare provides licensed primary healthcare, diagnostics, and 24/7 pharmacy. For severe medical crises (severe chest pain with sweating, acute loss of consciousness, uncontrolled hemorrhage, or major trauma), please call an ambulance immediately (Dial 102) for transport to an emergency tertiary hospital.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Map Embed Section */}
      <section className="py-16 bg-navy border-t border-on-dark/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="font-display text-2xl font-bold text-white">Find Us on the Map</h3>
              <p className="text-xs text-on-dark-muted">Sanagau main road, 5 minutes from Gwarko junction.</p>
            </div>
            <a
              href="https://maps.google.com/?q=Sanagau+Lalitpur+Nepal"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan text-navy-deep font-bold text-xs shadow-md"
            >
              <span>Open in Google Maps App</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div className="rounded-3xl overflow-hidden border border-on-dark/20 h-96 w-full shadow-2xl bg-midnight">
            <iframe
              title="Two Brothers Healthcare Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14136.257041760467!2d85.34291885!3d27.6534572!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb175be62cb473%3A0x8aa863c8b417c8cf!2sSanagaun%2C%20Lalitpur!5e0!3m2!1sen!2snp!4v1700000000000!5m2!1sen!2snp"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(90%)' }}
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
