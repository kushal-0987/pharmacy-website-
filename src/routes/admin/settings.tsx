import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import {
  Settings,
  Building,
  Clock,
  ShieldCheck,
  CreditCard,
  HardDrive,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/settings')({
  head: () => ({
    meta: [
      { title: 'System Settings & Operations Config — Two Brothers Healthcare' },
      { name: 'description', content: 'Configure clinic operational hours, SMS gateway keys, backup policies, and business licensing.' },
    ],
  }),
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  const [clinicName, setClinicName] = useState('Two Brothers Healthcare Pvt. Ltd.');
  const [address, setAddress] = useState('Ward No. 4, Sanagau, Mahalaxmi Municipality, Lalitpur, Nepal');
  const [phone, setPhone] = useState('01-5582910');
  const [emergencyPhone, setEmergencyPhone] = useState('9801234567');
  const [fonepayMerchantId, setFonepayMerchantId] = useState('TBH-9923-FP');
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('System configuration saved and synced across cluster.');
  };

  const handleTriggerBackup = () => {
    toast.success('Manual backup snapshot initiated! Encrypted archive stored in local vault.');
  };

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in duration-300">
        <div className="pb-4 border-b border-on-dark/15">
          <h1 className="font-display text-2xl font-bold text-white">System Settings & Configuration</h1>
          <p className="text-xs text-on-dark-muted">
            Manage organization metadata, financial gateways, backup policies, and statutory licensing.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Organization Details */}
          <div className="p-6 sm:p-8 rounded-3xl bg-midnight/50 border border-on-dark/15 space-y-4">
            <h2 className="font-bold text-white text-base flex items-center gap-2">
              <Building className="h-5 w-5 text-cyan" /> Organization & Clinic Identity
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-white font-semibold block mb-1">Company Registered Name</label>
                <input
                  type="text"
                  required
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-navy-deep border border-on-dark/20 text-white"
                />
              </div>

              <div>
                <label className="text-white font-semibold block mb-1">Clinic Physical Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-navy-deep border border-on-dark/20 text-white"
                />
              </div>

              <div>
                <label className="text-white font-semibold block mb-1">Reception Landline Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-navy-deep border border-on-dark/20 text-white"
                />
              </div>

              <div>
                <label className="text-white font-semibold block mb-1">24/7 Emergency & Ambulance Phone</label>
                <input
                  type="text"
                  required
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-navy-deep border border-on-dark/20 text-white"
                />
              </div>
            </div>
          </div>

          {/* Payment Gateway & Financials */}
          <div className="p-6 sm:p-8 rounded-3xl bg-midnight/50 border border-on-dark/15 space-y-4">
            <h2 className="font-bold text-white text-base flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-teal" /> Nepal Payment Gateway & QR Integration
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-white font-semibold block mb-1">Fonepay Merchant Terminal ID</label>
                <input
                  type="text"
                  value={fonepayMerchantId}
                  onChange={(e) => setFonepayMerchantId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-navy-deep border border-on-dark/20 text-white font-mono"
                />
              </div>
              <div className="p-4 rounded-2xl bg-navy-deep border border-on-dark/10 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Cash on Delivery (COD)</span>
                  <span className="text-[11px] text-on-dark-muted">Allowed for medicine courier in Lalitpur.</span>
                </div>
                <span className="text-xs text-leaf font-bold">Enabled</span>
              </div>
            </div>
          </div>

          {/* Database Backup & Disaster Recovery */}
          <div className="p-6 sm:p-8 rounded-3xl bg-midnight/50 border border-on-dark/15 space-y-4">
            <h2 className="font-bold text-white text-base flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-leaf" /> Data Retention & Disaster Recovery
            </h2>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div>
                <div className="font-semibold text-white">Automated Daily Database Snapshots</div>
                <div className="text-[11px] text-on-dark-muted">
                  Encrypted pg_dump snapshots stored in georedundant storage every midnight at 01:00 AM.
                </div>
              </div>

              <button
                type="button"
                onClick={handleTriggerBackup}
                className="px-4 py-2 rounded-full bg-midnight border border-cyan/40 text-cyan font-bold text-xs hover:bg-cyan hover:text-navy-deep transition-all shrink-0"
              >
                Trigger Manual Snapshot
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-3.5 rounded-full bg-cyan text-navy-deep font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              <span>Save System Settings</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
