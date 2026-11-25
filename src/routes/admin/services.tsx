import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/services')({
  head: () => ({
    meta: [
      { title: 'Service Directory — Two Brothers Healthcare' },
      { name: 'description', content: 'Manage outpatient clinical services, durations, and fee schedules.' },
    ],
  }),
  component: AdminServicesPage,
});

interface ServiceItem {
  id: string;
  name: string;
  category: 'Consultation' | 'Laboratory' | 'Packages' | 'Nursing' | 'Pharmacy';
  durationMins: number;
  bufferMins: number;
  fee: number;
  maxPerDay: number;
  status: 'Active' | 'Paused';
}

function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([
    { id: 'srv-1', name: 'Specialist Physician Consultation', category: 'Consultation', durationMins: 20, bufferMins: 5, fee: 700, maxPerDay: 24, status: 'Active' },
    { id: 'srv-2', name: 'Obstetrics & Gynecologist Consultation', category: 'Consultation', durationMins: 25, bufferMins: 5, fee: 800, maxPerDay: 18, status: 'Active' },
    { id: 'srv-3', name: 'Comprehensive Blood Chemistry (CBC, LFT, KFT)', category: 'Laboratory', durationMins: 15, bufferMins: 5, fee: 2150, maxPerDay: 50, status: 'Active' },
    { id: 'srv-4', name: 'Essential Wellness Health Package', category: 'Packages', durationMins: 45, bufferMins: 15, fee: 1850, maxPerDay: 15, status: 'Active' },
    { id: 'srv-5', name: 'Sterile Wound Dressing & Suture Care', category: 'Nursing', durationMins: 20, bufferMins: 5, fee: 350, maxPerDay: 30, status: 'Active' },
  ]);

  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState<ServiceItem['category']>('Consultation');
  const [newFee, setNewFee] = useState(500);

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setServices((prev) => [
      { id: 'srv-' + Date.now(), name: newName, category: newCat, durationMins: 20, bufferMins: 5, fee: newFee, maxPerDay: 25, status: 'Active' },
      ...prev,
    ]);
    toast.success(`Service "${newName}" added.`);
    setNewName('');
    setShowAdd(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#082653]">Service Directory</h1>
            <p className="text-xs text-[#64748B] mt-0.5">Configure clinic services, durations, and fee schedules.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowAdd(!showAdd)}
            className="px-4 py-2.5 rounded-xl bg-[#0755D9] text-white font-semibold text-xs inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Create Service</span>
          </button>
        </div>

        {showAdd && (
          <form onSubmit={handleCreateService} className="bg-white rounded-2xl border border-[#D9E8FF] p-6 shadow-xs space-y-4 text-xs">
            <h3 className="font-display font-bold text-[#082653] text-base">Configure Clinical Service</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-2">
                <label className="text-[#082653] font-semibold block mb-1">Service Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B]"
                />
              </div>
              <div>
                <label className="text-[#082653] font-semibold block mb-1">Category</label>
                <select
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value as ServiceItem['category'])}
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B]"
                >
                  <option value="Consultation">Consultation</option>
                  <option value="Laboratory">Laboratory</option>
                  <option value="Packages">Packages</option>
                  <option value="Nursing">Nursing</option>
                </select>
              </div>
              <div>
                <label className="text-[#082653] font-semibold block mb-1">Fee (NPR) *</label>
                <input
                  type="number"
                  required
                  value={newFee}
                  onChange={(e) => setNewFee(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#0755D9] font-bold"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-[#64748B]">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-[#0755D9] text-white font-semibold">
                Save Service
              </button>
            </div>
          </form>
        )}

        <div className="bg-white rounded-2xl border border-[#E2ECFA] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F4F8FE] border-b border-slate-100 text-[#64748B]">
                  <th className="py-3.5 px-4 font-semibold">Service Title</th>
                  <th className="py-3.5 px-4 font-semibold">Category</th>
                  <th className="py-3.5 px-4 font-semibold">Duration</th>
                  <th className="py-3.5 px-4 font-semibold">Daily Cap</th>
                  <th className="py-3.5 px-4 font-semibold">Fee</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {services.map((srv) => (
                  <tr key={srv.id} className="hover:bg-[#F4F8FE]/60">
                    <td className="py-3.5 px-4 font-semibold text-[#10243B]">{srv.name}</td>
                    <td className="py-3.5 px-4 text-[#0755D9] font-medium">{srv.category}</td>
                    <td className="py-3.5 px-4 text-[#64748B]">{srv.durationMins} mins</td>
                    <td className="py-3.5 px-4 text-[#64748B]">{srv.maxPerDay} / day</td>
                    <td className="py-3.5 px-4 font-bold text-[#082653]">NPR {srv.fee}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#10B981] border border-emerald-200 text-[11px] font-semibold">
                        {srv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
