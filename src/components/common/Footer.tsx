import React from 'react';
import { Link } from '@tanstack/react-router';
import {
  PhoneCall,
  MapPin,
  Clock,
  ShieldCheck,
  Mail,
  Heart,
  Facebook,
  Instagram,
  Linkedin,
  ArrowRight,
} from 'lucide-react';

export const SiteFooter: React.FC = () => {
  return (
    <footer className="bg-[#082653] text-slate-300 border-t border-[#00AAFF]/20 pt-16 pb-24 lg:pb-12 text-sm relative overflow-hidden">
      {/* Subtle glowing ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00AAFF]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#0755D9]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: About & Licensing */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white ring-2 ring-[#00AAFF]/40 p-1 flex-shrink-0 shadow-md">
                <img
                  src="/logo.png"
                  alt="Two Brothers Healthcare logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="block font-display text-base font-bold text-white tracking-tight">
                  Two Brothers
                </span>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-[#00AAFF] font-semibold">
                  Healthcare Pvt. Ltd.
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-300/90">
              Dedicated to compassionate, verified, and community-rooted healthcare services in Sanagau, Lalitpur. Providing licensed pharmacy services, specialist outpatient consultations, and accredited laboratory diagnostics.
            </p>

            <div className="pt-2 border-t border-white/10 space-y-1.5 text-[11px]">
              <div className="flex items-center gap-1.5 text-[#19C99A]">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                <span className="font-semibold">Licensed Pharmacy (#TBH-9923)</span>
              </div>
              <div className="text-slate-400">
                Nepal Pharmacy Council & Ministry of Health Regd.
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-[#0755D9] text-white flex items-center justify-center transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-[#00AAFF] text-white flex items-center justify-center transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-[#0755D9] text-white flex items-center justify-center transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h3 className="font-display text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00AAFF]" />
              Healthcare Services
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/pharmacy" className="hover:text-[#00AAFF] transition-colors">
                  Community Pharmacy & Delivery
                </Link>
              </li>
              <li>
                <Link to="/services/consultation" className="hover:text-[#00AAFF] transition-colors">
                  Doctor Consultation (OPD Specialists)
                </Link>
              </li>
              <li>
                <Link to="/services/lab" className="hover:text-[#00AAFF] transition-colors">
                  Diagnostic Laboratory Services
                </Link>
              </li>
              <li>
                <Link to="/services/packages" className="hover:text-[#00AAFF] transition-colors">
                  Preventive Health Packages & Checkups
                </Link>
              </li>
              <li>
                <Link to="/services/other" className="hover:text-[#00AAFF] transition-colors">
                  Nursing, Injections & Wound Dressing
                </Link>
              </li>
              <li className="pt-1">
                <Link to="/book" className="text-[#00AAFF] font-semibold hover:underline inline-flex items-center gap-1">
                  <span>Book Online Appointment</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Patient Resources & Legal */}
          <div>
            <h3 className="font-display text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#19C99A]" />
              Patient Resources
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-[#00AAFF] transition-colors">
                  About Our Medical Team & Story
                </Link>
              </li>
              <li>
                <Link to="/health-tips" className="hover:text-[#00AAFF] transition-colors">
                  Health Tips & Medical Blog
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#00AAFF] transition-colors">
                  Frequently Asked Questions (FAQ)
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-[#00AAFF] transition-colors">
                  Patient Health Records Portal
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#00AAFF] transition-colors">
                  Privacy Policy & Data Security
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#00AAFF] transition-colors">
                  Terms of Service & Booking Rules
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-[#00AAFF] transition-colors">
                  Refund & Cancellation Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Location & Hours */}
          <div className="space-y-3.5">
            <h3 className="font-display text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#A9DFFF]" />
              Sanagau Clinic & Contact
            </h3>
            <div className="flex items-start gap-2.5 text-xs">
              <MapPin className="h-4 w-4 text-[#00AAFF] shrink-0 mt-0.5" />
              <span className="text-slate-300">
                Ward No. 4, Sanagau, Mahalaxmi Municipality, Lalitpur, Bagmati Province, Nepal
              </span>
            </div>
            <div className="flex items-start gap-2.5 text-xs">
              <Clock className="h-4 w-4 text-[#19C99A] shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-white">Pharmacy: Open 24/7</div>
                <div className="text-slate-400">OPD & Lab: 7:00 AM – 8:00 PM (Daily)</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 text-xs">
              <PhoneCall className="h-4 w-4 text-[#00AAFF] shrink-0" />
              <div className="flex flex-wrap gap-2 text-white font-medium">
                <a href="tel:015582910" className="hover:text-[#00AAFF]">01-5582910</a>
                <span>/</span>
                <a href="tel:9801234567" className="text-[#19C99A] hover:underline">9801234567</a>
              </div>
            </div>
            <div className="flex items-center gap-2.5 text-xs">
              <Mail className="h-4 w-4 text-[#00AAFF] shrink-0" />
              <a href="mailto:care@twobrothershealthcare.com" className="hover:text-[#00AAFF] text-slate-300">
                care@twobrothershealthcare.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Disclaimers */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} Two Brothers Healthcare Pvt. Ltd. All rights reserved.
          </div>
          <div className="text-[11px] text-center sm:text-right max-w-xl text-slate-400/90 leading-relaxed">
            Disclaimer: Information on this website is for educational and appointment coordination purposes and does not constitute automated medical diagnosis. In life-threatening emergencies, please call emergency services immediately.
          </div>
        </div>
      </div>
    </footer>
  );
};
