import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import {
  Layers,
  Plus,
  Clock,
  CheckCircle2,
  Trash2,
  Edit2,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/services')({
  head: () => ({
    meta: [
      { title: 'Service Directory & Pricing Management — Two Brothers Healthcare' },
      { name: 'description', content: 'Manage outpatient clinical services, durations, buffer times, and fee schedules.' },
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
    {
      id: 'srv-1',
      name: 'Specialist Physician Consultation',
      category: 'Consultation',
      durationMins: 20,
      bufferMins: 5,
      fee: 700,
      maxPerDay: 24,
      status: 'Active',
    },
    {
      id: 'srv-2',
      name: 'Obstetrics & Gynecologist Consultation',
      category: 'Consultation',
      durationMins: 25,
      bufferMins: 5,
      fee: 800,
      maxPerDay: 18,
      status: 'Active',
    },
    {
      id: 'srv-3',
      name: 'Comprehensive Blood Chemistry (CBC, LFT, KFT)',
      category: 'Laboratory',
      durationMins: 15,
      bufferMins: 5,
      fee: 2150,
      maxPerDay: 50,
      status: 'Active',
    },
    {
      id: 'srv-4',
      name: 'Essential Wellness Health Package',
      category: 'Packages',
      durationMins: 45,
      bufferMins: 15,
      fee: 1850,
      maxPerDay: 15,
      status: 'Active',
    },
    {
      id: 'srv-5',
      name: 'Sterile Wound Dressing & Suture Care',
      category: 'Nursing',
      durationMins: 20,
      bufferMins: 5,
      fee: 350,
      maxPerDay: 30,
      status: 'Active',
    },
  ]);

  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState<ServiceItem['category']>('Consultation');
  const [newDuration, setNewDuration] = useState(20);
  const [newFee, setNewFee] = useState(500);

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newItem: ServiceItem = {
      id: 'srv-' + Date.now(),
      name: newName,
      category: newCat,
      durationMins: newDuration,
      bufferMins: 5,
      fee: newFee,
      maxPerDay: 25,
      status: 'Active',
    };

    setServices((prev) => [newItem, ...prev]);
    toast.success(`Service "${newName}" added to directory!`);
    setNewName('');
    setShowAdd(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-on-dark/15">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Service Management & Rules</h1>
            <p className="text-xs text-on-dark-muted">
              Configure clinic services, duration slots, daily capacity caps, and pricing.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAdd(!showAdd)}
            className="px-5 py-2.5 rounded-full bg-cyan text-navy-deep font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 self-start sm:self-auto hover:scale-105 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Service</span>
          </button>
        </div>

        {/* Add Service Modal */}
        {showAdd && (
          <form
            onSubmit={handleCreateService}
            className="p-6 rounded-3xl bg-midnight/70 border border-teal/40 space-y-4 text-xs animate-in fade-in shadow-2xl"
          >
            <h3 className="font-bold text-white text-base">Configure New Clinical Service</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-2">
                <label className="text-white font-semibold block mb-1">Service Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Pediatric Growth Screening"
                  className="w-full px-3 py-2 rounded-xl bg-navy-deep border border-on-dark/20 text-white"
                />
              </div>
              <div>
                <label className="text-white font-semibold block mb-1">Category</label>
                <select
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-navy-deep border border-on-dark/20 text-white"
                >
                  <option value="Consultation">Consultation</option>
                  <option value="Laboratory">Laboratory</option>
                  <option value="Packages">Packages</option>
                  <option value="Nursing">Nursing</option>
                </select>
              </div>
              <div>
                <label className="text-white font-semibold block mb-1">Fee (NPR) *</label>
                <input
                  type="number"
                  required
                  value={newFee}
                  onChange={(e) => setNewFee(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-navy-deep border border-on-dark/20 text-white font-bold text-cyan"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="px-4 py-1.5 rounded-full text-on-dark-muted hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-full bg-cyan text-navy-deep font-bold"
              >
                Save Service
              </button>
            </div>
          </form>
        )}

        {/* Services Table */}
        <div className="rounded-3xl bg-midnight/40 border border-on-dark/15 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-on-dark/15 text-on-dark-muted bg-navy/60">
                  <th className="py-3 px-4 font-bold">Service Title</th>
                  <th className="py-3 px-4 font-bold">Category</th>
                  <th className="py-3 px-4 font-bold">Slot Duration</th>
                  <th className="py-3 px-4 font-bold">Buffer</th>
                  <th className="py-3 px-4 font-bold">Daily Cap</th>
                  <th className="py-3 px-4 font-bold">Base Fee</th>
                  <th className="py-3 px-4 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-on-dark/10">
                {services.map((srv) => (
                  <tr key={srv.id} className="hover:bg-navy-deep/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white text-sm">{srv.name}</td>
                    <td className="py-3.5 px-4 text-teal">{srv.category}</td>
                    <td className="py-3.5 px-4 text-on-dark-muted">{srv.durationMins} Mins</td>
                    <td className="py-3.5 px-4 text-on-dark-muted">{srv.bufferMins} Mins</td>
                    <td className="py-3.5 px-4 text-white">{srv.maxPerDay} visits/day</td>
                    <td className="py-3.5 px-4 font-bold text-cyan text-sm">NPR {srv.fee}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-leaf/20 text-leaf">
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
