import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import { Medicine } from '@/types/healthcare';
import {
  Pill,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Package,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/pharmacy')({
  head: () => ({
    meta: [
      { title: 'Pharmacy & Drug Inventory Master — Two Brothers Healthcare' },
      { name: 'description', content: 'Manage authentic pharmaceuticals, batch levels, cold-chain monitoring, and stock alerts.' },
    ],
  }),
  component: AdminPharmacyPage,
});

function AdminPharmacyPage() {
  const { medicines } = useHealthcare();
  const [medicineList, setMedicineList] = useState<Medicine[]>(medicines);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [generic, setGeneric] = useState('');
  const [strength, setStrength] = useState('500mg');
  const [form, setForm] = useState<Medicine['form']>('Tablet');
  const [mfr, setMfr] = useState('Nepal Pharma Lab');
  const [price, setPrice] = useState(40);
  const [stock, setStock] = useState(500);
  const [isRx, setIsRx] = useState(false);

  const filtered = medicineList.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.genericName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newMed: Medicine = {
      id: 'med-' + Date.now(),
      name,
      genericName: generic,
      strength,
      form,
      manufacturer: mfr,
      prescriptionRequired: isRx,
      price,
      inStock: stock > 0,
      stockCount: stock,
      category: 'General Therapeutics',
    };

    setMedicineList((prev) => [newMed, ...prev]);
    toast.success(`Medicine "${name}" added to Sanagau pharmacy inventory!`);
    setName('');
    setGeneric('');
    setShowAdd(false);
  };

  const handleUpdateStock = (id: string, delta: number) => {
    setMedicineList((prev) =>
      prev.map((m) => (m.id === id ? { ...m, stockCount: Math.max(0, m.stockCount + delta) } : m))
    );
    toast.success('Stock inventory updated.');
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-on-dark/15">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Pharmacy Stock & Inventory Control</h1>
            <p className="text-xs text-on-dark-muted">
              Live inventory tracking, DDA licensing checks, expiry management, and dispensing controls.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAdd(!showAdd)}
            className="px-5 py-2.5 rounded-full bg-cyan text-navy-deep font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 self-start sm:self-auto hover:scale-105 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add Pharmaceutical</span>
          </button>
        </div>

        {/* Add Modal */}
        {showAdd && (
          <form
            onSubmit={handleAddMedicine}
            className="p-6 rounded-3xl bg-midnight/70 border border-teal/40 space-y-4 text-xs animate-in fade-in shadow-2xl"
          >
            <h3 className="font-bold text-white text-base">Add New Pharmaceutical Product</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-white font-semibold block mb-1">Brand Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Paracetamol 500"
                  className="w-full px-3 py-2 rounded-xl bg-navy-deep border border-on-dark/20 text-white"
                />
              </div>
              <div>
                <label className="text-white font-semibold block mb-1">Generic Name *</label>
                <input
                  type="text"
                  required
                  value={generic}
                  onChange={(e) => setGeneric(e.target.value)}
                  placeholder="Paracetamol"
                  className="w-full px-3 py-2 rounded-xl bg-navy-deep border border-on-dark/20 text-white"
                />
              </div>
              <div>
                <label className="text-white font-semibold block mb-1">Dosage Strength</label>
                <input
                  type="text"
                  required
                  value={strength}
                  onChange={(e) => setStrength(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-navy-deep border border-on-dark/20 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-white font-semibold block mb-1">Dosage Form</label>
                <select
                  value={form}
                  onChange={(e) => setForm(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-navy-deep border border-on-dark/20 text-white"
                >
                  <option value="Tablet">Tablet</option>
                  <option value="Capsule">Capsule</option>
                  <option value="Syrup">Syrup</option>
                  <option value="Injection">Injection</option>
                  <option value="Drops">Drops</option>
                </select>
              </div>
              <div>
                <label className="text-white font-semibold block mb-1">Manufacturer</label>
                <input
                  type="text"
                  required
                  value={mfr}
                  onChange={(e) => setMfr(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-navy-deep border border-on-dark/20 text-white"
                />
              </div>
              <div>
                <label className="text-white font-semibold block mb-1">Retail Price (NPR)</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-navy-deep border border-on-dark/20 text-white"
                />
              </div>
              <div>
                <label className="text-white font-semibold block mb-1">Current Stock Count</label>
                <input
                  type="number"
                  required
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-navy-deep border border-on-dark/20 text-white"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRx}
                  onChange={(e) => setIsRx(e.target.checked)}
                  className="rounded border-on-dark/30 text-cyan"
                />
                <span>Prescription Required (Schedule Drug)</span>
              </label>
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
                Save Product
              </button>
            </div>
          </form>
        )}

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-on-dark-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search medicine by brand or generic..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-midnight border border-on-dark/20 text-white text-xs focus:outline-none focus:border-cyan"
          />
        </div>

        {/* Master Table */}
        <div className="rounded-3xl bg-midnight/40 border border-on-dark/15 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-on-dark/15 text-on-dark-muted bg-navy/60">
                  <th className="py-3 px-4 font-bold">Brand & Generic</th>
                  <th className="py-3 px-4 font-bold">Form & Strength</th>
                  <th className="py-3 px-4 font-bold">Manufacturer</th>
                  <th className="py-3 px-4 font-bold">Rx Required?</th>
                  <th className="py-3 px-4 font-bold">Retail Fee</th>
                  <th className="py-3 px-4 font-bold">Live Stock</th>
                  <th className="py-3 px-4 font-bold text-right">Stock Adjust</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-on-dark/10">
                {filtered.map((med) => (
                  <tr key={med.id} className="hover:bg-navy-deep/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white text-sm">{med.name}</div>
                      <div className="text-[11px] text-teal">{med.genericName}</div>
                    </td>
                    <td className="py-3 px-4 text-white">
                      {med.form} · {med.strength}
                    </td>
                    <td className="py-3 px-4 text-on-dark-muted">{med.manufacturer}</td>
                    <td className="py-3 px-4">
                      {med.prescriptionRequired ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-destructive/20 text-destructive border border-destructive/30">
                          Yes (Rx)
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-leaf/20 text-leaf border border-leaf/30">
                          OTC
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-cyan">NPR {med.price}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-bold ${
                          med.stockCount < 150 ? 'text-warm-gold animate-pulse' : 'text-leaf'
                        }`}
                      >
                        {med.stockCount} Units
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleUpdateStock(med.id, 50)}
                          className="px-2 py-0.5 rounded bg-teal/20 text-cyan text-[11px] font-bold"
                        >
                          +50
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateStock(med.id, -10)}
                          className="px-2 py-0.5 rounded bg-on-dark/10 text-on-dark-muted hover:text-white text-[11px]"
                        >
                          -10
                        </button>
                      </div>
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
