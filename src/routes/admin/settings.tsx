import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import {
  Building,
  CreditCard,
  HardDrive,
  Save,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/settings')({
  head: () => ({
    meta: [
      { title: 'System Settings — Two Brothers Healthcare' },
      { name: 'description', content: 'Configure clinic operational hours, payment gateways, and clinic details.' },
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('System configuration saved.');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#082653]">Settings</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Manage organization details, payment terminals, and clinic backup policies.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E2ECFA] p-6 shadow-xs space-y-4">
            <h2 className="font-display font-bold text-[#082653] text-base flex items-center gap-2">
              <Building className="h-4 w-4 text-[#0755D9]" /> Organization &amp; Clinic Identity
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[#082653] font-semibold block mb-1">Registered Name</label>
                <input
                  type="text"
                  required
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B]"
                />
              </div>

              <div>
                <label className="text-[#082653] font-semibold block mb-1">Physical Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B]"
                />
              </div>

              <div>
                <label className="text-[#082653] font-semibold block mb-1">Reception Phone</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B]"
                />
              </div>

              <div>
                <label className="text-[#082653] font-semibold block mb-1">24/7 Emergency Phone</label>
                <input
                  type="text"
                  required
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B]"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E2ECFA] p-6 shadow-xs space-y-4">
            <h2 className="font-display font-bold text-[#082653] text-base flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-[#0755D9]" /> Payment Gateway &amp; Billing
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[#082653] font-semibold block mb-1">Fonepay Merchant Terminal ID</label>
                <input
                  type="text"
                  value={fonepayMerchantId}
                  onChange={(e) => setFonepayMerchantId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B] font-mono"
                />
              </div>
              <div className="p-4 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#082653] block">Cash on Delivery (COD)</span>
                  <span className="text-[11px] text-[#64748B]">Enabled for Lalitpur medicine orders.</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#10B981] border border-emerald-200 font-semibold">
                  Enabled
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E2ECFA] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-start gap-3">
              <HardDrive className="h-5 w-5 text-[#10B981] shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-[#082653]">Data Export &amp; Snapshots</div>
                <div className="text-[11px] text-[#64748B]">
                  Automated snapshots protect bookings, inventory, and audit logs.
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#0755D9] hover:bg-[#082653] text-white font-semibold text-xs inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Save className="h-4 w-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
