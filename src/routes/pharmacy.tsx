import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { PublicLayout } from '@/components/common/PublicLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import { Medicine } from '@/types/healthcare';
import {
  Pill,
  Search,
  UploadCloud,
  FileCheck,
  ShieldAlert,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Send,
  MapPin,
  HelpCircle,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/pharmacy')({
  head: () => ({
    meta: [
      { title: 'Community Pharmacy & Medicine Availability Enquiry — Two Brothers Healthcare' },
      {
        name: 'description',
        content:
          'Search authentic medicines, check live stock, upload prescriptions, and request home delivery in Sanagau, Lalitpur. Licensed pharmacist verification on every enquiry.',
      },
    ],
  }),
  component: PharmacyPage,
});

function PharmacyPage() {
  const { medicines, createMedicineEnquiry } = useHealthcare();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPrescription, setFilterPrescription] = useState<'all' | 'rx' | 'otc'>('all');
  const [filterForm, setFilterForm] = useState<string>('all');

  // Selected medicines for enquiry basket
  const [selectedItems, setSelectedItems] = useState<{ medicine: Medicine; quantity: number }[]>([]);

  // Prescription upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  // Form State
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('delivery');
  const [deliveryZone, setDeliveryZone] = useState('Lalitpur Zone 1 (Sanagau, Gwarko, Imadol) - NPR 50');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  // Filtered medicines
  const filteredMedicines = useMemo(() => {
    return medicines.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRx =
        filterPrescription === 'all'
          ? true
          : filterPrescription === 'rx'
            ? m.prescriptionRequired
            : !m.prescriptionRequired;

      const matchesForm = filterForm === 'all' || m.form === filterForm;

      return matchesSearch && matchesRx && matchesForm;
    });
  }, [medicines, searchTerm, filterPrescription, filterForm]);

  const handleAddItem = (medicine: Medicine) => {
    setSelectedItems((prev) => {
      const existing = prev.find((item) => item.medicine.id === medicine.id);
      if (existing) {
        return prev.map((item) =>
          item.medicine.id === medicine.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { medicine, quantity: 1 }];
    });
    toast.success(`Added ${medicine.name} to enquiry list`);
  };

  const handleRemoveItem = (id: string) => {
    setSelectedItems((prev) => prev.filter((item) => item.medicine.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size exceeds 10MB limit.');
        return;
      }
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setUploadPreview(url);
      toast.success('Prescription image attached successfully.');
    }
  };

  const handleSubmitEnquiry = (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientName.trim()) {
      toast.error('Please provide your name.');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      toast.error('Please provide a valid 10-digit mobile number.');
      return;
    }
    if (selectedItems.length === 0 && !uploadedFile) {
      toast.error('Please select at least one medicine or attach a prescription.');
      return;
    }
    if (deliveryType === 'delivery' && !deliveryAddress.trim()) {
      toast.error('Please enter your delivery street address or landmark.');
      return;
    }

    const newEnquiry = createMedicineEnquiry({
      patientName,
      phone,
      email: email || undefined,
      deliveryType,
      deliveryAddress: deliveryType === 'delivery' ? deliveryAddress : undefined,
      deliveryZone: deliveryType === 'delivery' ? deliveryZone : undefined,
      deliveryFee: deliveryType === 'delivery' ? (deliveryZone.includes('Zone 1') ? 50 : 90) : 0,
      medicineList: selectedItems.map((i) => ({
        medicineId: i.medicine.id,
        medicineName: `${i.medicine.name} (${i.medicine.strength})`,
        quantity: i.quantity,
      })),
      prescriptionFileUrl: uploadPreview || undefined,
      pharmacistNotes: notes || undefined,
    });

    setSubmittedRef(newEnquiry.referenceId);
    toast.success(`Enquiry submitted! Reference: ${newEnquiry.referenceId}`);
    // Reset basket
    setSelectedItems([]);
    setUploadedFile(null);
    setUploadPreview(null);
  };

  const deliveryZones = [
    {
      name: 'Zone 1: Core Lalitpur',
      areas: 'Sanagau, Mahalaxmi-4, Gwarko, Imadol, Tikathali',
      time: '30 - 60 Minutes',
      fee: 'NPR 50 (Free over NPR 1,500)',
      color: 'border-leaf/40 bg-leaf/10',
    },
    {
      name: 'Zone 2: Urban Lalitpur',
      areas: 'Patan, Mangalbazar, Pulchowk, Jawalakhel, Satdobato, Kumaripati',
      time: '1 - 2 Hours',
      fee: 'NPR 80',
      color: 'border-teal/40 bg-teal/10',
    },
    {
      name: 'Zone 3: Kathmandu Ring Road',
      areas: 'Koteshwor, Baneshwor, New Road, Tripureshwor, Kalanki',
      time: 'Same Day (2 - 4 Hours)',
      fee: 'NPR 120',
      color: 'border-cyan/40 bg-cyan/10',
    },
  ];

  return (
    <PublicLayout>
      {/* 1. Hero & Mandatory Disclaimer */}
      <section className="py-16 bg-gradient-to-b from-navy to-navy-deep border-b border-on-dark/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan block mb-3">
              Licensed Pharmacy Dispensary
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight leading-[1.1] mb-4">
              Medicine Availability & Doorstep Delivery Enquiry
            </h1>
            <p className="text-sm sm:text-base text-on-dark-muted leading-relaxed">
              Search authentic, temperature-controlled medicines stored at our Sanagau pharmacy or upload your doctor’s prescription. Every enquiry is verified by a licensed pharmacist before dispatch.
            </p>
          </div>

          {/* Disclaimer Banner */}
          <div className="mt-8 rounded-2xl bg-midnight/90 border border-teal/40 p-4 sm:p-5 flex items-start gap-4">
            <ShieldAlert className="h-6 w-6 text-cyan shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-on-dark-muted">
              <span className="font-bold text-white block mb-0.5">
                Pharmacist Review Disclaimer & Compliance:
              </span>
              Availability and dosages are confirmed personally by our Nepal Pharmacy Council-certified pharmacists. This is an official healthcare enquiry and prescription coordination service, not an automatic commerce sale. Controlled substances require valid original prescriptions.
            </div>
          </div>
        </div>
      </section>

      {/* Confirmation State Modal/Banner */}
      {submittedRef && (
        <section className="bg-leaf/20 border-b border-leaf/40 py-6 px-4">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-leaf shrink-0" />
              <div>
                <div className="font-bold text-white text-base">Enquiry Successfully Logged!</div>
                <div className="text-xs text-on-dark-muted">
                  Reference ID: <strong className="text-cyan text-sm">{submittedRef}</strong>. Our on-duty pharmacist at Sanagau is reviewing stock and will call your phone shortly.
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/account/enquiries"
                className="px-4 py-2 rounded-full bg-cyan text-navy-deep font-bold text-xs"
              >
                Track in Patient Portal
              </Link>
              <button
                type="button"
                onClick={() => setSubmittedRef(null)}
                className="p-2 text-on-dark-muted hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Main Pharmacy Workspace */}
      <section className="py-16 bg-navy-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Cols: Medicine Directory & Filters */}
            <div className="lg:col-span-7 space-y-6">
              <div className="rounded-3xl bg-midnight/50 border border-on-dark/15 p-6">
                <h2 className="font-display text-xl font-bold text-white mb-4">
                  Search Authentic Medicines
                </h2>

                {/* Search Input */}
                <div className="relative mb-4">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-on-dark-muted" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by brand name, generic formulation, or health category..."
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-navy-deep border border-on-dark/20 text-white placeholder-on-dark-muted text-sm focus:outline-none focus:border-cyan"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-on-dark-muted hover:text-white text-xs font-bold"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <div className="flex items-center gap-1 bg-navy-deep border border-on-dark/15 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => setFilterPrescription('all')}
                      className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                        filterPrescription === 'all' ? 'bg-cyan text-navy-deep font-bold' : 'text-on-dark-muted'
                      }`}
                    >
                      All Types
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterPrescription('otc')}
                      className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                        filterPrescription === 'otc' ? 'bg-cyan text-navy-deep font-bold' : 'text-on-dark-muted'
                      }`}
                    >
                      OTC Only
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterPrescription('rx')}
                      className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                        filterPrescription === 'rx' ? 'bg-cyan text-navy-deep font-bold' : 'text-on-dark-muted'
                      }`}
                    >
                      Prescription Required
                    </button>
                  </div>

                  <select
                    value={filterForm}
                    onChange={(e) => setFilterForm(e.target.value)}
                    aria-label="Filter medicine by form"
                    className="px-3 py-2 rounded-xl bg-navy-deep border border-on-dark/20 text-white text-xs focus:outline-none"
                  >
                    <option value="all">All Forms</option>
                    <option value="Tablet">Tablets</option>
                    <option value="Capsule">Capsules</option>
                    <option value="Syrup">Syrups</option>
                    <option value="Injection">Injections</option>
                    <option value="Drops">Drops & ORS</option>
                  </select>
                </div>
              </div>

              {/* Medicine Results List */}
              <div className="space-y-3">
                {filteredMedicines.length === 0 ? (
                  <div className="rounded-3xl bg-midnight/30 border border-on-dark/15 p-12 text-center">
                    <AlertTriangle className="h-10 w-10 text-warm-gold mx-auto mb-3" />
                    <h3 className="text-base font-bold text-white mb-1">
                      No exact medicine match found
                    </h3>
                    <p className="text-xs text-on-dark-muted max-w-md mx-auto mb-4">
                      We stock over 2,500 medicines at our Sanagau store. Please attach your doctor’s prescription in the enquiry form or call our pharmacist directly to verify immediate availability.
                    </p>
                    <a
                      href="tel:015582910"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan text-navy-deep font-bold text-xs"
                    >
                      Call Pharmacist: 01-5582910
                    </a>
                  </div>
                ) : (
                  filteredMedicines.map((med) => (
                    <div
                      key={med.id}
                      className="rounded-2xl bg-midnight/40 border border-on-dark/15 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-cyan/40 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-bold text-white text-base">{med.name}</h3>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-teal/20 text-cyan border border-teal/30">
                            {med.strength}
                          </span>
                          {med.prescriptionRequired ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-destructive/20 text-destructive border border-destructive/30 font-semibold">
                              Rx Required
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-leaf/20 text-leaf border border-leaf/30 font-semibold">
                              OTC
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-on-dark-muted">
                          <strong>Generic:</strong> {med.genericName} · <strong>Mfr:</strong> {med.manufacturer}
                        </div>

                        {med.dosageGuidelines && (
                          <div className="text-[11px] text-teal/90 mt-1 italic">
                            {med.dosageGuidelines}
                          </div>
                        )}

                        <div className="flex items-center gap-3 text-xs mt-2">
                          <span className="text-white font-bold">NPR {med.price}</span>
                          <span className="text-[11px] text-leaf font-medium flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-leaf inline-block" />
                            In Stock at Sanagau ({med.stockCount} units)
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddItem(med)}
                        className="px-4 py-2 rounded-xl bg-teal/20 border border-teal/40 text-cyan hover:bg-cyan hover:text-navy-deep font-bold text-xs transition-colors shrink-0"
                      >
                        + Add to Enquiry
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right 5 Cols: Prescription Upload & Enquiry Basket Form */}
            <div className="lg:col-span-5 space-y-6">
              {/* Basket & Enquiry Form */}
              <div className="rounded-3xl bg-midnight/70 border border-teal/30 p-6 sm:p-7 shadow-2xl">
                <h2 className="font-display text-xl font-bold text-white mb-2">
                  Submit Availability Enquiry
                </h2>
                <p className="text-xs text-on-dark-muted mb-6">
                  Add medicines or attach a photo of your doctor’s prescription.
                </p>

                {/* Selected Basket Items */}
                <div className="space-y-2 mb-6">
                  <div className="text-xs font-semibold text-teal uppercase tracking-wider">
                    Selected Medicines ({selectedItems.length})
                  </div>
                  {selectedItems.length === 0 ? (
                    <div className="text-xs text-on-dark-muted/70 italic p-3 rounded-xl bg-navy-deep/60 border border-on-dark/10">
                      No medicines picked yet. Search on the left or upload a prescription below.
                    </div>
                  ) : (
                    selectedItems.map((item) => (
                      <div
                        key={item.medicine.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-navy-deep border border-on-dark/15 text-xs"
                      >
                        <div>
                          <div className="font-semibold text-white">{item.medicine.name}</div>
                          <div className="text-[11px] text-on-dark-muted">NPR {item.medicine.price} each</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => {
                              const q = Math.max(1, parseInt(e.target.value) || 1);
                              setSelectedItems((prev) =>
                                prev.map((it) => (it.medicine.id === item.medicine.id ? { ...it, quantity: q } : it))
                              );
                            }}
                            className="w-14 px-2 py-1 rounded bg-midnight border border-on-dark/20 text-center text-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.medicine.id)}
                            className="text-on-dark-muted hover:text-destructive p-1"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Prescription Upload Dropzone */}
                <div className="mb-6">
                  <div className="text-xs font-semibold text-teal uppercase tracking-wider mb-2">
                    Attach Doctor's Prescription (Optional / Rx)
                  </div>
                  <label className="border-2 border-dashed border-teal/40 hover:border-cyan rounded-2xl p-4 text-center cursor-pointer block bg-navy-deep/50 transition-colors">
                    <UploadCloud className="h-7 w-7 text-cyan mx-auto mb-1.5" />
                    <span className="text-xs font-semibold text-white block">
                      {uploadedFile ? uploadedFile.name : 'Click to select or drag prescription image'}
                    </span>
                    <span className="text-[11px] text-on-dark-muted block mt-0.5">
                      JPG, PNG, PDF up to 10MB
                    </span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  {uploadPreview && (
                    <div className="mt-2 flex items-center justify-between p-2 rounded-xl bg-navy-deep border border-leaf/30 text-xs text-leaf font-medium">
                      <span className="flex items-center gap-1.5">
                        <FileCheck className="h-4 w-4" /> Attached & ready for review
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedFile(null);
                          setUploadPreview(null);
                        }}
                        className="text-on-dark-muted hover:text-white"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Contact & Delivery Form */}
                <form onSubmit={handleSubmitEnquiry} className="space-y-4">
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-navy-deep border border-on-dark/20 text-white text-xs focus:outline-none focus:border-cyan"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-white block mb-1">
                        Mobile Phone (10 Digits) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 9841234567"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-navy-deep border border-on-dark/20 text-white text-xs focus:outline-none focus:border-cyan"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-white block mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-navy-deep border border-on-dark/20 text-white text-xs focus:outline-none focus:border-cyan"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-white block mb-1">
                      Fulfillment Preference
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDeliveryType('delivery')}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                          deliveryType === 'delivery'
                            ? 'bg-cyan text-navy-deep border-cyan'
                            : 'bg-navy-deep text-on-dark-muted border-on-dark/20'
                        }`}
                      >
                        <Truck className="h-4 w-4" /> Home Delivery
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeliveryType('pickup')}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                          deliveryType === 'pickup'
                            ? 'bg-cyan text-navy-deep border-cyan'
                            : 'bg-navy-deep text-on-dark-muted border-on-dark/20'
                        }`}
                      >
                        <MapPin className="h-4 w-4" /> Counter Pickup
                      </button>
                    </div>
                  </div>

                  {deliveryType === 'delivery' && (
                    <div className="space-y-3 pt-1">
                      <div>
                        <label className="text-xs font-semibold text-white block mb-1">
                          Delivery Zone
                        </label>
                        <select
                          value={deliveryZone}
                          onChange={(e) => setDeliveryZone(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-navy-deep border border-on-dark/20 text-white text-xs focus:outline-none"
                        >
                          <option value="Lalitpur Zone 1 (Sanagau, Gwarko, Imadol) - NPR 50">
                            Zone 1: Sanagau / Gwarko / Imadol (NPR 50)
                          </option>
                          <option value="Lalitpur Zone 2 (Patan, Pulchowk, Jawalakhel) - NPR 80">
                            Zone 2: Patan / Pulchowk / Jawalakhel (NPR 80)
                          </option>
                          <option value="Kathmandu Zone 3 (Ring Road & City Core) - NPR 120">
                            Zone 3: Kathmandu Ring Road (NPR 120)
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-white block mb-1">
                          Delivery Street Address & Landmark *
                        </label>
                        <input
                          type="text"
                          required
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="e.g. Sanagau Ward-4, 50m west of Shiva Temple"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-navy-deep border border-on-dark/20 text-white text-xs focus:outline-none focus:border-cyan"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-semibold text-white block mb-1">
                      Pharmacist Notes or Brand Preferences
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Specify strip counts, dosage strengths or generic preferences..."
                      className="w-full px-3.5 py-2 rounded-xl bg-navy-deep border border-on-dark/20 text-white text-xs focus:outline-none focus:border-cyan"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-gradient-to-r from-teal to-cyan text-navy-deep font-bold text-xs uppercase tracking-wider shadow-xl hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Submit Enquiry to Pharmacist</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. How It Works (4 Steps) */}
      <section className="py-16 bg-navy border-t border-on-dark/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-teal block mb-2">
              Safe & Compliant
            </span>
            <h2 className="font-display text-3xl font-bold text-white">
              How Medicine Availability Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: '1', title: 'Search or Upload', desc: 'Find medicines or upload an image of your physician’s prescription.' },
              { num: '2', title: 'Submit Enquiry', desc: 'Provide contact and delivery details. No upfront payment required.' },
              { num: '3', title: 'Pharmacist Reviews', desc: 'Our licensed staff verifies stock, dosage, validity and quotes exact prices.' },
              { num: '4', title: 'Confirm & Receive', desc: 'Confirm your order for doorstep courier or collect at the Sanagau counter.' },
            ].map((st) => (
              <div key={st.num} className="rounded-2xl bg-midnight/40 border border-on-dark/15 p-6 text-center">
                <span className="h-10 w-10 rounded-full bg-teal/20 text-cyan font-bold text-sm flex items-center justify-center mx-auto mb-3">
                  {st.num}
                </span>
                <h3 className="font-bold text-white text-sm mb-1">{st.title}</h3>
                <p className="text-xs text-on-dark-muted leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Delivery Coverage Zones */}
      <section className="py-16 bg-navy-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan block mb-2">
              Doorstep Delivery Zones
            </span>
            <h2 className="font-display text-3xl font-bold text-white">
              Lalitpur & Kathmandu Courier Timelines
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {deliveryZones.map((zone) => (
              <div
                key={zone.name}
                className={`rounded-3xl border p-7 ${zone.color} backdrop-blur-xl flex flex-col justify-between`}
              >
                <div>
                  <h3 className="font-display text-lg font-bold text-white mb-2">{zone.name}</h3>
                  <div className="text-xs text-on-dark-muted mb-4">
                    <strong>Coverage:</strong> {zone.areas}
                  </div>
                  <div className="text-xs text-white flex items-center gap-1.5 mb-2">
                    <Clock className="h-4 w-4 text-cyan" />
                    <span>Estimated: {zone.time}</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-on-dark/15 font-bold text-cyan text-sm">
                  {zone.fee}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
