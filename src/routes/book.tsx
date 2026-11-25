import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { PublicLayout } from '@/components/common/PublicLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import { Appointment } from '@/types/healthcare';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  ShieldCheck,
  CheckCircle2,
  Stethoscope,
  FlaskConical,
  Package,
  Layers,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  QrCode,
  Download,
  Share2,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/book')({
  head: () => ({
    meta: [
      { title: 'Book an Appointment — Two Brothers Healthcare | Sanagau, Lalitpur' },
      {
        name: 'description',
        content:
          'Online appointment booking for doctor consultations, diagnostic lab screenings, and health packages in Sanagau, Lalitpur. Instant slot confirmation & zero queue.',
      },
    ],
  }),
  component: BookAppointmentPage,
});

function BookAppointmentPage() {
  const {
    providers,
    labTests,
    packages,
    createAppointment,
    holdSlot,
    releaseSlot,
    currentUser,
  } = useHealthcare();

  // Wizard Step: 1: Service, 2: Date & Slot, 3: Details & OTP, 4: Review, 5: Confirmed
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 1: Service Selection
  const [selectedServiceType, setSelectedServiceType] = useState<'consultation' | 'lab' | 'package' | 'other'>('consultation');
  const [selectedSubServiceId, setSelectedSubServiceId] = useState<string>('doc-1');

  // Step 2: Date & Slot Selection
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-25');
  const [selectedSlot, setSelectedSlot] = useState<string>('09:00 AM');
  const [slotHoldTimeLeft, setSlotHoldTimeLeft] = useState<number | null>(null);

  // Step 3: Patient Information
  const [patientName, setPatientName] = useState(currentUser.name || '');
  const [patientPhone, setPatientPhone] = useState(currentUser.phone || '');
  const [patientEmail, setPatientEmail] = useState(currentUser.email || '');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [reason, setReason] = useState('');
  const [isForDependent, setIsForDependent] = useState(false);
  const [dependentName, setDependentName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  // Step 4: Consent
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  // Step 5: Final confirmed booking record
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);

  // Slot hold timer (10 mins = 600 seconds)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (slotHoldTimeLeft !== null && slotHoldTimeLeft > 0) {
      timer = setInterval(() => {
        setSlotHoldTimeLeft((prev) => (prev && prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (slotHoldTimeLeft === 0) {
      toast.error('Slot hold has expired. Please select a time slot again.');
      setCurrentStep(2);
      setSlotHoldTimeLeft(null);
    }
    return () => clearInterval(timer);
  }, [slotHoldTimeLeft]);

  // Compute selected details & pricing
  const currentProvider = providers.find((p) => p.id === selectedSubServiceId);
  const currentLabTest = labTests.find((l) => l.id === selectedSubServiceId);
  const currentPackage = packages.find((pkg) => pkg.id === selectedSubServiceId);

  const getServiceTitle = () => {
    if (selectedServiceType === 'consultation') {
      return `Doctor Consultation — ${currentProvider ? currentProvider.name : 'Specialist'}`;
    }
    if (selectedServiceType === 'lab') {
      return `Diagnostic Lab — ${currentLabTest ? currentLabTest.name : 'Lab Test'}`;
    }
    if (selectedServiceType === 'package') {
      return `Health Package — ${currentPackage ? currentPackage.name : 'Wellness Checkup'}`;
    }
    return 'Nursing & Minor Clinical Procedures';
  };

  const getServiceFee = () => {
    if (selectedServiceType === 'consultation') return currentProvider?.consultationFee || 700;
    if (selectedServiceType === 'lab') return currentLabTest?.price || 450;
    if (selectedServiceType === 'package') return currentPackage?.price || 1850;
    return 300;
  };

  // Step transitions
  const handleProceedToDate = () => {
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHoldAndProceed = () => {
    const slotKey = `${selectedServiceType}-${selectedSubServiceId}-${selectedDate}-${selectedSlot}`;
    const locked = holdSlot(slotKey);
    if (!locked) {
      toast.error('This slot was just selected by another patient. Please choose another slot.');
      return;
    }
    setSlotHoldTimeLeft(600); // 10 minutes
    toast.success('Time slot temporarily held for 10 minutes!');
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSendOtp = () => {
    if (!patientPhone || patientPhone.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number.');
      return;
    }
    setOtpSent(true);
    setOtpCode('8241'); // simulated SMS OTP
    toast.success('Verification OTP sent to ' + patientPhone + ' (Demo OTP: 8241)');
  };

  const handleVerifyOtp = () => {
    if (otpCode === '8241' || otpCode.length === 4) {
      setOtpVerified(true);
      toast.success('Phone number verified successfully.');
    } else {
      toast.error('Invalid OTP code. Please enter 8241.');
    }
  };

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      toast.error('Please enter patient name.');
      return;
    }
    if (!otpVerified && !currentUser.phone) {
      toast.error('Please complete phone OTP verification.');
      return;
    }
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSubmit = () => {
    if (!privacyAgreed) {
      toast.error('Please agree to the privacy policy and appointment cancellation terms.');
      return;
    }

    const newApt = createAppointment({
      patientId: currentUser.id,
      patientName: isForDependent && dependentName ? dependentName : patientName,
      patientPhone,
      patientEmail: patientEmail || undefined,
      serviceType: selectedServiceType,
      serviceTitle: getServiceTitle(),
      subServiceId: selectedSubServiceId,
      providerId: selectedServiceType === 'consultation' ? selectedSubServiceId : undefined,
      providerName: selectedServiceType === 'consultation' ? currentProvider?.name : undefined,
      appointmentDate: selectedDate,
      timeSlot: selectedSlot,
      status: 'confirmed',
      reasonForVisit: reason || undefined,
      createdForDependent: isForDependent && dependentName ? dependentName : undefined,
      totalFee: getServiceFee(),
    });

    setConfirmedBooking(newApt);
    setCurrentStep(5);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast.success(`Booking confirmed! Reference: ${newApt.referenceId}`);
  };

  return (
    <PublicLayout>
      {/* Wizard Header & Progress Bar */}
      <section className="py-12 bg-gradient-to-b from-navy to-navy-deep border-b border-on-dark/15">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan block mb-2">
            Sanagau Outpatient Department
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Book an Appointment Online
          </h1>

          {/* Slot hold timer pill */}
          {slotHoldTimeLeft !== null && currentStep >= 3 && currentStep < 5 && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan/15 border border-cyan/40 text-cyan text-xs font-semibold animate-pulse">
              <Clock className="h-4 w-4" />
              <span>
                Selected Slot Held for:{' '}
                {Math.floor(slotHoldTimeLeft / 60)}:
                {(slotHoldTimeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
          )}

          {/* Step Progress Indicators */}
          <div className="mt-8 flex items-center justify-between max-w-2xl mx-auto text-xs relative">
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-on-dark/15 -z-10" />
            {[
              { step: 1, label: 'Service' },
              { step: 2, label: 'Date & Time' },
              { step: 3, label: 'Patient Info' },
              { step: 4, label: 'Review' },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center bg-navy-deep px-3">
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    currentStep > s.step
                      ? 'bg-leaf text-navy-deep'
                      : currentStep === s.step
                        ? 'bg-cyan text-navy-deep ring-4 ring-cyan/20'
                        : 'bg-midnight text-on-dark-muted border border-on-dark/20'
                  }`}
                >
                  {currentStep > s.step ? <CheckCircle2 className="h-5 w-5" /> : s.step}
                </div>
                <span
                  className={`mt-2 font-medium hidden sm:block ${
                    currentStep === s.step ? 'text-cyan font-bold' : 'text-on-dark-muted'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Form Body */}
      <section className="py-14 bg-navy-deep min-h-[60vh]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* STEP 1: SELECT SERVICE */}
          {currentStep === 1 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="text-center">
                <h2 className="font-display text-2xl font-bold text-white mb-1">
                  1. Choose Service Category
                </h2>
                <p className="text-xs text-on-dark-muted">
                  Select the type of care you require in Sanagau.
                </p>
              </div>

              {/* Service Type Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { id: 'consultation', label: 'Doctor Consultation', desc: 'Physicians & Specialists', icon: Stethoscope },
                  { id: 'lab', label: 'Laboratory Diagnostics', desc: 'Blood, Urine, ECG', icon: FlaskConical },
                  { id: 'package', label: 'Health Packages', desc: 'Preventive Wellness Bundles', icon: Package },
                  { id: 'other', label: 'Nursing & Procedures', desc: 'Dressing, Injections, Vitals', icon: Layers },
                ].map((st) => {
                  const Icon = st.icon;
                  const isSelected = selectedServiceType === st.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => {
                        setSelectedServiceType(st.id as any);
                        if (st.id === 'consultation') setSelectedSubServiceId('doc-1');
                        if (st.id === 'lab') setSelectedSubServiceId('lab-1');
                        if (st.id === 'package') setSelectedSubServiceId('pkg-1');
                      }}
                      className={`p-6 rounded-3xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-cyan bg-midnight shadow-xl ring-2 ring-cyan/20'
                          : 'border-on-dark/15 bg-midnight/40 hover:border-teal/50'
                      }`}
                    >
                      <div className="h-12 w-12 rounded-2xl bg-teal/20 text-cyan flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm mb-1">{st.label}</div>
                        <div className="text-xs text-on-dark-muted">{st.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Sub-Option Selector */}
              <div className="rounded-3xl bg-midnight/50 border border-on-dark/15 p-6 sm:p-8">
                <h3 className="font-bold text-white text-base mb-4">
                  {selectedServiceType === 'consultation' && 'Select Specialist or Doctor'}
                  {selectedServiceType === 'lab' && 'Select Laboratory Diagnostic Test'}
                  {selectedServiceType === 'package' && 'Select Comprehensive Health Package'}
                  {selectedServiceType === 'other' && 'Nursing & Minor Clinical Care'}
                </h3>

                {selectedServiceType === 'consultation' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {providers.map((doc) => (
                      <div
                        key={doc.id}
                        onClick={() => setSelectedSubServiceId(doc.id)}
                        className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-4 transition-all ${
                          selectedSubServiceId === doc.id
                            ? 'border-cyan bg-navy-deep ring-2 ring-cyan/20'
                            : 'border-on-dark/15 bg-navy-deep/40 hover:border-on-dark/30'
                        }`}
                      >
                        <img
                          src={doc.photoUrl}
                          alt={doc.name}
                          className="h-16 w-16 rounded-xl object-cover"
                        />
                        <div className="flex-1 text-xs">
                          <span className="text-[10px] text-teal font-semibold block">{doc.department}</span>
                          <span className="font-bold text-white text-sm block">{doc.name}</span>
                          <span className="text-on-dark-muted line-clamp-1">{doc.title}</span>
                          <span className="text-leaf font-bold block mt-1">Fee: NPR {doc.consultationFee}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedServiceType === 'lab' && (
                  <div className="space-y-3">
                    {labTests.map((test) => (
                      <div
                        key={test.id}
                        onClick={() => setSelectedSubServiceId(test.id)}
                        className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between gap-4 transition-all ${
                          selectedSubServiceId === test.id
                            ? 'border-cyan bg-navy-deep ring-2 ring-cyan/20'
                            : 'border-on-dark/15 bg-navy-deep/40 hover:border-on-dark/30'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-white text-sm">{test.name}</div>
                          <div className="text-xs text-on-dark-muted">
                            Prep: {test.preparationNotes} · Turnaround: {test.turnaroundTime}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-bold text-cyan text-sm">NPR {test.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedServiceType === 'package' && (
                  <div className="space-y-3">
                    {packages.map((pkg) => (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedSubServiceId(pkg.id)}
                        className={`p-5 rounded-2xl border cursor-pointer flex items-center justify-between gap-4 transition-all ${
                          selectedSubServiceId === pkg.id
                            ? 'border-cyan bg-navy-deep ring-2 ring-cyan/20'
                            : 'border-on-dark/15 bg-navy-deep/40 hover:border-on-dark/30'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-base">{pkg.name}</span>
                            {pkg.badge && (
                              <span className="text-[10px] bg-cyan/20 text-cyan px-2 py-0.5 rounded-full font-bold">
                                {pkg.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-on-dark-muted mt-1">{pkg.tagline}</div>
                          <div className="text-[11px] text-teal mt-1">
                            {pkg.testCount} Tests Included · Est. {pkg.durationMinutes} Mins Visit
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-bold text-cyan text-lg">NPR {pkg.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedServiceType === 'other' && (
                  <div className="p-4 rounded-2xl bg-navy-deep border border-on-dark/15 text-xs text-on-dark-muted leading-relaxed">
                    General nursing procedures include wound dressing, intramuscular/intravenous injections, vitals recording (BP, Pulse, SPO2), and emergency nebulization at our Sanagau clinic. Standard base charge NPR 300 + materials at retail cost.
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleProceedToDate}
                  className="px-8 py-3.5 rounded-full bg-cyan text-navy-deep font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                >
                  <span>Select Date & Time Slot</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SELECT DATE & TIME */}
          {currentStep === 2 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center gap-1 text-xs text-on-dark-muted hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to service selection
                </button>
                <div className="text-xs text-teal font-semibold">
                  Selected: {getServiceTitle()}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Date Picker (Calendar selection) */}
                <div className="md:col-span-5 rounded-3xl bg-midnight/50 border border-on-dark/15 p-6">
                  <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-cyan" /> Choose Appointment Date
                  </h3>
                  <div className="space-y-2">
                    {['2026-11-25', '2026-11-26', '2026-11-27', '2026-11-28', '2026-11-29', '2026-11-30'].map((d) => {
                      const isSelected = selectedDate === d;
                      const dateObj = new Date(d);
                      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                      const monthDay = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setSelectedDate(d)}
                          className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                            isSelected
                              ? 'border-cyan bg-navy-deep ring-2 ring-cyan/20 text-white font-bold'
                              : 'border-on-dark/15 bg-navy-deep/40 text-on-dark-muted hover:border-on-dark/30'
                          }`}
                        >
                          <span className="text-xs">{dayName}, {monthDay}</span>
                          <span className="text-[11px] text-teal">Available</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Slots (Morning / Afternoon / Evening) */}
                <div className="md:col-span-7 rounded-3xl bg-midnight/50 border border-on-dark/15 p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <Clock className="h-4 w-4 text-cyan" /> Available Slots for {selectedDate}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setSelectedSlot('08:00 AM')}
                      className="text-[11px] text-cyan hover:underline font-semibold"
                    >
                      Soonest Available Quick-Pick
                    </button>
                  </div>

                  {/* Morning */}
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-teal mb-2">
                      Morning (07:00 AM – 11:30 AM)
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {['07:30 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM'].map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-2.5 rounded-xl text-xs font-semibold border transition-all ${
                            selectedSlot === slot
                              ? 'bg-cyan text-navy-deep border-cyan shadow-md'
                              : 'bg-navy-deep text-on-dark-muted border-on-dark/15 hover:border-teal'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Afternoon */}
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-teal mb-2">
                      Afternoon (12:00 PM – 03:30 PM)
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {['12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM'].map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-2.5 rounded-xl text-xs font-semibold border transition-all ${
                            selectedSlot === slot
                              ? 'bg-cyan text-navy-deep border-cyan shadow-md'
                              : 'bg-navy-deep text-on-dark-muted border-on-dark/15 hover:border-teal'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Evening */}
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-teal mb-2">
                      Evening (04:00 PM – 07:30 PM)
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {['04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM'].map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-2.5 rounded-xl text-xs font-semibold border transition-all ${
                            selectedSlot === slot
                              ? 'bg-cyan text-navy-deep border-cyan shadow-md'
                              : 'bg-navy-deep text-on-dark-muted border-on-dark/15 hover:border-teal'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <div className="text-xs text-on-dark-muted">
                  Locking slot holds it for 10 minutes to prevent double-booking.
                </div>
                <button
                  type="button"
                  onClick={handleHoldAndProceed}
                  className="px-8 py-3.5 rounded-full bg-cyan text-navy-deep font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                >
                  <span>Hold Slot & Fill Details</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PATIENT DETAILS & OTP VERIFICATION */}
          {currentStep === 3 && (
            <form onSubmit={handleProceedToReview} className="space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="inline-flex items-center gap-1 text-xs text-on-dark-muted hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" /> Change slot
                </button>
                <div className="text-xs text-teal font-semibold">
                  Held: {selectedDate} at {selectedSlot}
                </div>
              </div>

              <div className="rounded-3xl bg-midnight/50 border border-on-dark/15 p-6 sm:p-8 space-y-6">
                <h2 className="font-display text-xl font-bold text-white mb-2">
                  3. Patient Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-white block mb-1">
                      Patient Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="e.g. Kushal Sharma"
                      className="w-full px-4 py-3 rounded-2xl bg-navy-deep border border-on-dark/20 text-white text-xs focus:outline-none focus:border-cyan"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-white block mb-1">
                        Mobile Phone Number (For SMS confirmation) *
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="tel"
                          required
                          value={patientPhone}
                          onChange={(e) => setPatientPhone(e.target.value)}
                          placeholder="9841234567"
                          className="flex-1 px-4 py-3 rounded-2xl bg-navy-deep border border-on-dark/20 text-white text-xs focus:outline-none focus:border-cyan"
                        />
                        {!otpVerified && (
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            className="px-4 py-2 rounded-xl bg-teal/20 border border-teal text-cyan font-bold text-xs hover:bg-teal hover:text-navy-deep transition-colors"
                          >
                            Send OTP
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-white block mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={patientEmail}
                        onChange={(e) => setPatientEmail(e.target.value)}
                        placeholder="kushal@example.com"
                        className="w-full px-4 py-3 rounded-2xl bg-navy-deep border border-on-dark/20 text-white text-xs focus:outline-none focus:border-cyan"
                      />
                    </div>
                  </div>

                  {/* OTP Verification Box */}
                  {otpSent && !otpVerified && (
                    <div className="p-4 rounded-2xl bg-navy-deep border border-teal/40 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">Enter 4-Digit SMS Code</span>
                        <span className="text-teal text-[11px]">Demo OTP: 8241</span>
                      </div>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          maxLength={4}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="8241"
                          className="w-32 text-center tracking-widest font-bold px-3 py-2 rounded-xl bg-midnight border border-cyan text-white text-sm"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          className="px-5 py-2 rounded-xl bg-cyan text-navy-deep font-bold text-xs"
                        >
                          Verify Phone
                        </button>
                      </div>
                    </div>
                  )}

                  {otpVerified && (
                    <div className="p-3 rounded-xl bg-leaf/20 border border-leaf/40 text-leaf text-xs font-semibold flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" /> Phone number verified!
                    </div>
                  )}

                  {/* Add Family Member Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                      <input
                        type="checkbox"
                        checked={isForDependent}
                        onChange={(e) => setIsForDependent(e.target.checked)}
                        className="rounded border-on-dark/30 text-cyan focus:ring-0"
                      />
                      <span>Booking for a family member or dependent (e.g. Parent or Child)</span>
                    </label>

                    {isForDependent && (
                      <div className="mt-3 pl-6">
                        <input
                          type="text"
                          required
                          value={dependentName}
                          onChange={(e) => setDependentName(e.target.value)}
                          placeholder="Family Member's Full Name (e.g. Gita Sharma)"
                          className="w-full px-4 py-2.5 rounded-xl bg-navy-deep border border-on-dark/20 text-white text-xs focus:outline-none focus:border-cyan"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-white block mb-1">
                      Reason for Consultation / Symptoms / Clinical Notes
                    </label>
                    <textarea
                      rows={3}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Briefly describe your symptoms, duration, or any current medications..."
                      className="w-full px-4 py-2.5 rounded-2xl bg-navy-deep border border-on-dark/20 text-white text-xs focus:outline-none focus:border-cyan"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-full bg-cyan text-navy-deep font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                >
                  <span>Review & Confirm</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: REVIEW & POLICIES */}
          {currentStep === 4 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="inline-flex items-center gap-1 text-xs text-on-dark-muted hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" /> Edit details
                </button>
                <div className="text-xs text-teal font-semibold">Step 4 of 4</div>
              </div>

              <div className="rounded-3xl bg-midnight/60 border border-teal/40 p-6 sm:p-8 shadow-2xl space-y-6">
                <h2 className="font-display text-2xl font-bold text-white mb-2">
                  4. Review Appointment Summary
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-navy-deep border border-on-dark/15">
                    <span className="text-teal font-bold block mb-1">Service & Department</span>
                    <div className="text-white font-bold text-sm">{getServiceTitle()}</div>
                    <div className="text-on-dark-muted mt-1">Sanagau OPD Clinic, Lalitpur</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-navy-deep border border-on-dark/15">
                    <span className="text-teal font-bold block mb-1">Scheduled Date & Time</span>
                    <div className="text-white font-bold text-sm">
                      {selectedDate} at {selectedSlot}
                    </div>
                    <div className="text-leaf text-[11px] font-semibold mt-1">Guaranteed held slot</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-navy-deep border border-on-dark/15">
                    <span className="text-teal font-bold block mb-1">Patient Details</span>
                    <div className="text-white font-semibold">
                      {isForDependent ? `${dependentName} (Caregiver: ${patientName})` : patientName}
                    </div>
                    <div className="text-on-dark-muted">{patientPhone}</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-navy-deep border border-on-dark/15">
                    <span className="text-teal font-bold block mb-1">Consultation / Testing Fee</span>
                    <div className="text-cyan font-bold text-lg">NPR {getServiceFee()}</div>
                    <div className="text-on-dark-muted text-[11px]">Payable at clinic desk or via Fonepay</div>
                  </div>
                </div>

                {/* Policies & Consent */}
                <div className="p-4 rounded-2xl bg-navy-deep/60 border border-on-dark/15 space-y-3 text-xs text-on-dark-muted">
                  <div className="font-semibold text-white">Cancellation & Reschedule Policy:</div>
                  <p>
                    Appointments can be cancelled or rescheduled up to 2 hours prior without penalty through your Patient Portal or by calling 01-5582910.
                  </p>
                  <label className="flex items-start gap-2 pt-2 cursor-pointer text-white">
                    <input
                      type="checkbox"
                      checked={privacyAgreed}
                      onChange={(e) => setPrivacyAgreed(e.target.checked)}
                      className="mt-0.5 rounded border-on-dark/30 text-cyan focus:ring-0"
                    />
                    <span>
                      I agree to the healthcare data handling policy and understand this booking locks medical staff resources.
                    </span>
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-teal to-cyan text-navy-deep font-bold text-sm uppercase tracking-wider shadow-2xl hover:opacity-95 transition-all"
                >
                  Confirm & Finalize Appointment
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: CONFIRMATION & QR CODE */}
          {currentStep === 5 && confirmedBooking && (
            <div className="rounded-3xl bg-midnight/70 border border-leaf/40 p-8 sm:p-10 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-400">
              <div className="h-16 w-16 rounded-full bg-leaf/20 text-leaf flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <div>
                <span className="text-xs font-bold text-teal uppercase tracking-widest block mb-1">
                  Booking Confirmed
                </span>
                <h2 className="font-display text-3xl font-bold text-white mb-2">
                  Appointment Reference: {confirmedBooking.referenceId}
                </h2>
                <p className="text-sm text-on-dark-muted max-w-lg mx-auto">
                  A confirmation SMS has been dispatched to <strong>{confirmedBooking.patientPhone}</strong>. Please present this reference or QR code at our Sanagau reception.
                </p>
              </div>

              {/* QR Code & Pass Card */}
              <div className="max-w-md mx-auto p-6 rounded-3xl bg-navy-deep border border-on-dark/20 text-left space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-on-dark/10">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white ring-2 ring-cyan/40 p-1 shrink-0 shadow-sm">
                      <img src="/logo.png" alt="Two Brothers Healthcare logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <div className="text-[11px] text-teal font-semibold">Two Brothers Healthcare</div>
                      <div className="text-base font-bold text-white">{confirmedBooking.serviceTitle}</div>
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-white text-navy-deep">
                    <QrCode className="h-8 w-8" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-on-dark-muted block">Date & Time:</span>
                    <span className="font-bold text-white">{confirmedBooking.appointmentDate} at {confirmedBooking.timeSlot}</span>
                  </div>
                  <div>
                    <span className="text-on-dark-muted block">Patient:</span>
                    <span className="font-bold text-white">{confirmedBooking.patientName}</span>
                  </div>
                  <div>
                    <span className="text-on-dark-muted block">Fee Due:</span>
                    <span className="font-bold text-cyan">NPR {confirmedBooking.totalFee}</span>
                  </div>
                  <div>
                    <span className="text-on-dark-muted block">Status:</span>
                    <span className="text-leaf font-bold">Confirmed</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3 pt-4">
                <Link
                  to="/account/appointments"
                  className="px-6 py-3 rounded-full bg-cyan text-navy-deep font-bold text-xs shadow-lg"
                >
                  View in Patient Portal
                </Link>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-6 py-3 rounded-full bg-on-dark/10 border border-on-dark/20 text-white font-semibold text-xs hover:bg-white/10 flex items-center gap-2"
                >
                  <Download className="h-4 w-4" /> Print Booking Slip
                </button>
                <Link
                  to="/"
                  className="px-6 py-3 rounded-full bg-on-dark/5 text-on-dark-muted text-xs hover:text-white"
                >
                  Return to Homepage
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
