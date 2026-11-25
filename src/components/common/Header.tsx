import React, { useState } from 'react';
import { Link, useRouterState, useNavigate } from '@tanstack/react-router';
import { useI18n } from '@/lib/i18n';
import { useHealthcare } from '@/lib/healthcare-store';
import { ThreeDotAccountMenu } from '@/components/common/ThreeDotAccountMenu';
import {
  PhoneCall,
  MapPin,
  Calendar,
  Search,
  Menu,
  X,
  ChevronDown,
  Pill,
  Stethoscope,
  FlaskConical,
  Package,
  Layers,
  LogIn,
  LogOut,
  User,
} from 'lucide-react';

export const TopEmergencyBar: React.FC = () => {
  const { lang, setLang, t } = useI18n();

  return (
    <div className="bg-[#EBF5FF] text-[#10243B] border-b border-[#D0E6FC] py-2 px-4 text-xs font-medium z-50 relative">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Hours, Emergency, Location */}
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#19C99A] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#19C99A]"></span>
            </span>
            <span className="font-semibold text-[11px] sm:text-xs text-[#082653] tracking-tight">
              {t('topbar.openNow')}
            </span>
          </div>

          <a
            href="tel:015582910"
            className="flex items-center gap-1.5 text-[#64748B] hover:text-[#0755D9] transition-colors"
          >
            <PhoneCall className="h-3.5 w-3.5 text-[#0755D9] shrink-0" />
            <span className="hidden sm:inline">Emergency line:</span>
            <span className="font-bold text-[#0755D9]">01-5582910</span>
          </a>

          <div className="hidden lg:flex items-center gap-1.5 text-[#64748B]">
            <MapPin className="h-3.5 w-3.5 text-[#00AAFF] shrink-0" />
            <span>Sanagau Ward-4, Lalitpur</span>
          </div>
        </div>

        {/* Right: Language Switcher */}
        <div className="flex items-center gap-2 ml-auto">
          <div className="flex items-center gap-1 bg-white border border-[#D0E6FC] rounded-full p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-2.5 py-0.5 text-[11px] rounded-full transition-all cursor-pointer ${
                lang === 'en'
                  ? 'bg-[#0755D9] text-white font-bold shadow-2xs'
                  : 'text-[#64748B] hover:text-[#082653]'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang('ne')}
              className={`px-2.5 py-0.5 text-[11px] rounded-full transition-all cursor-pointer ${
                lang === 'ne'
                  ? 'bg-[#0755D9] text-white font-bold shadow-2xs'
                  : 'text-[#64748B] hover:text-[#082653]'
              }`}
            >
              नेपाली
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MainNavbar: React.FC<{ onOpenSearch?: () => void }> = ({ onOpenSearch }) => {
  const { t } = useI18n();
  const { isAuthenticated, activeAccount, currentRole, logout } = useHealthcare();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);

  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const navigate = useNavigate();

  const navLinks = [
    { label: t('nav.home'), to: '/' },
    { label: t('nav.about'), to: '/about' },
    {
      label: t('nav.services'),
      to: '/services',
      hasDropdown: true,
    },
    { label: t('nav.pharmacy'), to: '/pharmacy' },
    { label: t('nav.healthTips'), to: '/health-tips' },
    { label: t('nav.contact'), to: '/contact' },
    { label: 'FAQ', to: '/faq' },
  ];

  const serviceSubItems = [
    { label: 'Doctor Consultation', desc: 'Specialist physicians & GPs', to: '/services/consultation', icon: Stethoscope },
    { label: 'Laboratory Diagnostics', desc: 'Blood, urine & cardiac tests', to: '/services/lab', icon: FlaskConical },
    { label: 'Health Packages', desc: 'Wellness checkup packages', to: '/services/packages', icon: Package },
    { label: 'Pharmacy & Medicine', desc: 'Prescription enquiry & delivery', to: '/pharmacy', icon: Pill },
    { label: 'Nursing & Other Care', desc: 'Vitals, dressings & home care', to: '/services/other', icon: Layers },
  ];

  const portalRoute = currentRole === 'admin' ? '/admin' : currentRole === 'patient' ? '/account' : '/staff';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-blue-100 shadow-[0_4px_24px_rgba(7,85,217,0.06)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative h-12 w-12 rounded-full overflow-hidden bg-white ring-2 ring-[#00AAFF]/40 p-1 flex-shrink-0 transition-transform group-hover:scale-105 shadow-sm">
              <img
                src="/logo.png"
                alt="Two Brothers Healthcare logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="block font-display text-lg font-bold tracking-tight text-[#082653] group-hover:text-[#0755D9] transition-colors leading-tight">
                Two Brothers
              </span>
              <span className="block text-[10px] uppercase tracking-[0.18em] text-[#0755D9] font-bold">
                Healthcare Pvt. Ltd.
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = link.to === '/' ? currentPath === '/' : currentPath.startsWith(link.to);

              if (link.hasDropdown) {
                return (
                  <div
                    key={link.to}
                    className="relative"
                    onMouseEnter={() => setServicesDropdown(true)}
                    onMouseLeave={() => setServicesDropdown(false)}
                  >
                    <Link
                      to={link.to}
                      className={`flex items-center gap-1 px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
                        isActive
                          ? 'text-[#0755D9] bg-[#EBF5FF] font-bold'
                          : 'text-[#64748B] hover:text-[#082653] hover:bg-slate-100/70'
                      }`}
                    >
                      {link.label}
                      <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                    </Link>

                    {servicesDropdown && (
                      <div className="absolute top-full left-0 w-80 bg-white border border-blue-100 rounded-2xl p-2.5 shadow-2xl animate-in fade-in-50 slide-in-from-top-2 z-50">
                        {serviceSubItems.map((sub) => {
                          const SubIcon = sub.icon;
                          return (
                            <Link
                              key={sub.to}
                              to={sub.to}
                              onClick={() => setServicesDropdown(false)}
                              className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F2F8FF] transition-colors group"
                            >
                              <div className="p-2 rounded-lg bg-[#EBF5FF] text-[#0755D9] group-hover:bg-[#0755D9] group-hover:text-white transition-colors">
                                <SubIcon className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-[#10243B] group-hover:text-[#0755D9] transition-colors">
                                  {sub.label}
                                </div>
                                <div className="text-xs text-[#64748B]">{sub.desc}</div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#0755D9] text-white shadow-sm font-bold'
                      : 'text-[#64748B] hover:text-[#082653] hover:bg-slate-100/70'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Public Actions: Search, Book Appointment, Three-Dot Menu */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {onOpenSearch && (
              <button
                type="button"
                onClick={onOpenSearch}
                aria-label="Search services and medicines"
                className="p-2.5 rounded-full bg-[#F4F8FE] hover:bg-[#E6F5FF] text-[#082653] hover:text-[#0755D9] border border-[#D9E8FF] transition-colors cursor-pointer"
              >
                <Search className="h-4 w-4" />
              </button>
            )}

            {/* Book Appointment CTA */}
            <Link
              to="/book"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0755D9] hover:bg-[#082653] text-white text-xs font-bold shadow-sm hover:shadow-md transition-all"
            >
              <Calendar className="h-3.5 w-3.5 text-[#A9DFFF]" />
              <span>{t('nav.bookAppointment')}</span>
            </Link>

            {/* Vertical Three-Dot Menu */}
            <ThreeDotAccountMenu />

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#082653] hover:bg-slate-100 lg:hidden cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-2xl border-b border-blue-100 px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
            <Link
              to="/book"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#0755D9] text-white font-bold text-xs"
            >
              <Calendar className="h-3.5 w-3.5 text-[#A9DFFF]" /> Book Appointment
            </Link>
            <Link
              to="/pharmacy"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#EBF5FF] border border-[#0755D9]/30 text-[#0755D9] font-bold text-xs"
            >
              <Pill className="h-3.5 w-3.5" /> Enquire Medicine
            </Link>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#10243B] hover:bg-[#F2F8FF] hover:text-[#0755D9]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            {!isAuthenticated || !activeAccount ? (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#F4F8FE] border border-[#D9E8FF] text-xs font-bold text-[#082653]"
              >
                <LogIn className="h-4 w-4 text-[#0755D9]" /> Login / Admin Access
              </Link>
            ) : (
              <>
                <Link
                  to={portalRoute}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#E6F5FF] text-xs font-bold text-[#0755D9]"
                >
                  <User className="h-4 w-4" /> My Account ({activeAccount.fullName})
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    navigate({ to: '/login' });
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-[#DC2626] font-bold text-xs"
                >
                  <LogOut className="h-4 w-4 text-[#DC2626]" /> Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export const MobileStickyBottomBar: React.FC = () => {
  const { isAuthenticated, currentRole } = useHealthcare();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const accountTarget = !isAuthenticated
    ? '/login'
    : currentRole === 'admin'
      ? '/admin'
      : currentRole === 'patient'
        ? '/account'
        : '/staff';

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-xl border-t border-blue-100 lg:hidden py-2 px-4 shadow-[0_-4px_25px_rgba(7,85,217,0.08)]">
      <div className="grid grid-cols-4 items-center gap-1 text-center">
        <Link
          to="/"
          className={`flex flex-col items-center py-1 transition-colors ${
            currentPath === '/' ? 'text-[#0755D9] font-bold' : 'text-[#64748B] hover:text-[#082653]'
          }`}
        >
          <div className="h-5 w-5 flex items-center justify-center">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </div>
          <span className="text-[10px] mt-1">Home</span>
        </Link>

        <Link
          to="/book"
          className={`flex flex-col items-center py-1 transition-colors ${
            currentPath.startsWith('/book') ? 'text-[#0755D9] font-bold' : 'text-[#64748B] hover:text-[#082653]'
          }`}
        >
          <Calendar className="h-5 w-5" />
          <span className="text-[10px] mt-1">Book</span>
        </Link>

        <Link
          to="/pharmacy"
          className={`flex flex-col items-center py-1 transition-colors ${
            currentPath.startsWith('/pharmacy') ? 'text-[#0755D9] font-bold' : 'text-[#64748B] hover:text-[#082653]'
          }`}
        >
          <Pill className="h-5 w-5" />
          <span className="text-[10px] mt-1">Enquire</span>
        </Link>

        <Link
          to={accountTarget}
          className={`flex flex-col items-center py-1 transition-colors ${
            currentPath.startsWith('/account') ||
            currentPath.startsWith('/staff') ||
            currentPath.startsWith('/admin') ||
            currentPath.startsWith('/login')
              ? 'text-[#0755D9] font-bold'
              : 'text-[#64748B] hover:text-[#082653]'
          }`}
        >
          <User className="h-5 w-5" />
          <span className="text-[10px] mt-1">{isAuthenticated ? 'Portal' : 'Login'}</span>
        </Link>
      </div>
    </div>
  );
};
