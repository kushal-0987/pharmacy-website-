import { createFileRoute } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import { Medicine } from '@/types/healthcare';
import {
  Pill,
  Search,
  Plus,
  AlertTriangle,
  Clock,
  Edit2,
  PackagePlus,
  X,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/pharmacy')({
  head: () => ({
    meta: [
      { title: 'Pharmacy Inventory — Two Brothers Healthcare' },
      { name: 'description', content: 'Enterprise pharmacy stock management, expiry alerts, supplier tracking, and restocking.' },
    ],
  }),
  component: AdminPharmacyPage,
});

type InventoryFilter = 'all' | 'in_stock' | 'low_stock' | 'out_of_stock' | 'expiring_soon';

function isExpiringSoon(expiryDate?: string): boolean {
  if (!expiryDate) return false;
  const now = new Date('2026-11-25');
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() + 90);
  return new Date(expiryDate) <= cutoff;
}

function AdminPharmacyPage() {
  const { medicines, addMedicine, updateMedicine, restockMedicine } = useHealthcare();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<InventoryFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMed, setEditingMed] = useState<Medicine | null>(null);
  const [restockTarget, setRestockTarget] = useState<Medicine | null>(null);
  const [restockDelta, setRestockDelta] = useState<number>(50);

  // Add / Edit form states
  const [formState, setFormState] = useState({
    name: '',
    brand: '',
    genericName: '',
    strength: '500mg',
    form: 'Tablet' as Medicine['form'],
    category: 'Pain Relief & Fever',
    manufacturer: 'Nepal Pharmaceuticals Lab',
    supplier: 'Valley Med Distributors',
    purchasePrice: 14,
    sellingPrice: 20,
    stockCount: 250,
    lowStockThreshold: 150,
    expiryDate: '2028-06-30',
    prescriptionRequired: false,
    imageUrl: '',
  });

  const categories = useMemo(
    () => Array.from(new Set(medicines.map((m) => m.category))).sort(),
    [medicines]
  );

  const lowStockList = useMemo(
    () => medicines.filter((m) => m.stockCount > 0 && m.stockCount <= (m.lowStockThreshold ?? 150)),
    [medicines]
  );

  const outOfStockList = useMemo(
    () => medicines.filter((m) => m.stockCount === 0),
    [medicines]
  );

  const expiringList = useMemo(
    () => medicines.filter((m) => isExpiringSoon(m.expiryDate)),
    [medicines]
  );

  const counts = useMemo(
    () => ({
      all: medicines.length,
      in_stock: medicines.filter((m) => m.stockCount > (m.lowStockThreshold ?? 150)).length,
      low_stock: lowStockList.length,
      out_of_stock: outOfStockList.length,
      expiring_soon: expiringList.length,
    }),
    [medicines, lowStockList, outOfStockList, expiringList]
  );

  const filteredMedicines = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return medicines.filter((m) => {
      const matchSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.genericName.toLowerCase().includes(q) ||
        (m.brand && m.brand.toLowerCase().includes(q)) ||
        (m.supplier && m.supplier.toLowerCase().includes(q));

      if (!matchSearch) return false;
      if (categoryFilter !== 'all' && m.category !== categoryFilter) return false;

      const threshold = m.lowStockThreshold ?? 150;
      switch (statusFilter) {
        case 'in_stock':
          return m.stockCount > threshold;
        case 'low_stock':
          return m.stockCount > 0 && m.stockCount <= threshold;
        case 'out_of_stock':
          return m.stockCount === 0;
        case 'expiring_soon':
          return isExpiringSoon(m.expiryDate);
        default:
          return true;
      }
    });
  }, [medicines, searchTerm, statusFilter, categoryFilter]);

  const openAdd = () => {
    setFormState({
      name: '',
      brand: '',
      genericName: '',
      strength: '500mg',
      form: 'Tablet',
      category: 'Pain Relief & Fever',
      manufacturer: 'Nepal Pharmaceuticals Lab',
      supplier: 'Valley Med Distributors',
      purchasePrice: 14,
      sellingPrice: 20,
      stockCount: 250,
      lowStockThreshold: 150,
      expiryDate: '2028-06-30',
      prescriptionRequired: false,
      imageUrl: '',
    });
    setShowAddModal(true);
  };

  const openEdit = (med: Medicine) => {
    setEditingMed(med);
    setFormState({
      name: med.name,
      brand: med.brand || med.name.split(' ')[0] || '',
      genericName: med.genericName,
      strength: med.strength,
      form: med.form,
      category: med.category,
      manufacturer: med.manufacturer,
      supplier: med.supplier || 'Valley Med Distributors',
      purchasePrice: med.purchasePrice ?? Math.round(med.price * 0.72),
      sellingPrice: med.sellingPrice ?? med.price,
      stockCount: med.stockCount,
      lowStockThreshold: med.lowStockThreshold ?? 150,
      expiryDate: med.expiryDate || '2028-01-01',
      prescriptionRequired: med.prescriptionRequired,
      imageUrl: med.imageUrl || '',
    });
  };

  const handleSaveMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.genericName.trim()) {
      toast.error('Medicine name and generic name are required.');
      return;
    }

    if (editingMed) {
      updateMedicine(editingMed.id, {
        ...formState,
        price: formState.sellingPrice,
      });
      toast.success(`Updated "${formState.name}" inventory record.`);
      setEditingMed(null);
    } else {
      addMedicine({
        ...formState,
        price: formState.sellingPrice,
        inStock: formState.stockCount > 0,
      });
      toast.success(`Added "${formState.name}" to pharmacy inventory.`);
      setShowAddModal(false);
    }
  };

  const handleConfirmRestock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockTarget || restockDelta === 0) return;
    restockMedicine(restockTarget.id, restockDelta);
    toast.success(`Restocked ${restockTarget.name} by ${restockDelta > 0 ? `+${restockDelta}` : restockDelta} units.`);
    setRestockTarget(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#082653]">Pharmacy Inventory</h1>
            <p className="text-xs text-[#64748B] mt-0.5">
              Track medicine stock levels, purchase &amp; selling prices, supplier batches, and expiry alerts.
            </p>
          </div>

          <button
            type="button"
            onClick={openAdd}
            className="px-4 py-2.5 rounded-xl bg-[#0755D9] hover:bg-[#082653] text-white font-semibold text-xs inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Add Medicine</span>
          </button>
        </div>

        {/* Dedicated Low-Stock & Expiry Alert Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Low Stock Alert Card */}
          <div className="bg-white rounded-2xl border border-amber-200 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-amber-50 text-[#F59E0B] flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="font-display text-sm font-bold text-[#082653]">Low &amp; Out-of-Stock Alerts</h2>
                  <p className="text-[11px] text-[#64748B]">
                    {lowStockList.length} low stock &bull; {outOfStockList.length} out of stock
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStatusFilter('low_stock')}
                className="text-xs font-semibold text-[#0755D9] hover:underline cursor-pointer"
              >
                Filter Low Stock →
              </button>
            </div>

            {lowStockList.length === 0 && outOfStockList.length === 0 ? (
              <div className="py-3 text-xs text-[#10B981] flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4" /> All medicines are adequately stocked.
              </div>
            ) : (
              <div className="space-y-2">
                {[...outOfStockList, ...lowStockList].slice(0, 3).map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/50 border border-amber-100 text-xs"
                  >
                    <div>
                      <span className="font-semibold text-[#10243B]">{m.name}</span>
                      <span className="block text-[11px] text-[#64748B]">
                        Supplier: {m.supplier || m.manufacturer}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#F59E0B]">{m.stockCount} left</span>
                      <button
                        type="button"
                        onClick={() => {
                          setRestockTarget(m);
                          setRestockDelta(100);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#0755D9] text-white text-[11px] font-semibold cursor-pointer"
                      >
                        Restock
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Expiry Alert Card */}
          <div className="bg-white rounded-2xl border border-rose-200 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-rose-50 text-[#EF4444] flex items-center justify-center">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="font-display text-sm font-bold text-[#082653]">Expiry Alert (Within 90 Days)</h2>
                  <p className="text-[11px] text-[#64748B]">
                    {expiringList.length} batch(es) approaching expiration date
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStatusFilter('expiring_soon')}
                className="text-xs font-semibold text-[#0755D9] hover:underline cursor-pointer"
              >
                Filter Expiring →
              </button>
            </div>

            {expiringList.length === 0 ? (
              <div className="py-3 text-xs text-[#10B981] flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4" /> No medicine batches expiring within 90 days.
              </div>
            ) : (
              <div className="space-y-2">
                {expiringList.slice(0, 3).map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50/50 border border-rose-100 text-xs"
                  >
                    <div>
                      <span className="font-semibold text-[#10243B]">{m.name}</span>
                      <span className="block text-[11px] text-[#64748B]">
                        Batch {m.batchNumber || 'STD'} &bull; Stock: {m.stockCount}
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-[#EF4444] font-semibold text-[11px]">
                      Exp: {m.expiryDate}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Filters & Search Toolbar */}
        <div className="bg-white rounded-2xl border border-[#E2ECFA] p-4 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { id: 'all', label: 'All Medicines', count: counts.all },
                { id: 'in_stock', label: 'In Stock', count: counts.in_stock },
                { id: 'low_stock', label: 'Low Stock', count: counts.low_stock },
                { id: 'out_of_stock', label: 'Out of Stock', count: counts.out_of_stock },
                { id: 'expiring_soon', label: 'Expiring Soon', count: counts.expiring_soon },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-[#0755D9] text-white'
                    : 'bg-[#F4F8FE] text-[#64748B] hover:text-[#082653] hover:bg-[#E6F5FF]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 rounded-md text-[10px] font-bold ${
                    statusFilter === tab.id ? 'bg-white/20 text-white' : 'bg-white text-[#082653]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search medicine name, brand, generic, supplier..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-xs text-[#10243B] placeholder-[#64748B] focus:outline-none focus:border-[#0755D9] focus:bg-white"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-xs font-medium text-[#10243B] focus:outline-none focus:border-[#0755D9]"
            >
              <option value="all">All Categories ({categories.length})</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Structured Medicine Inventory Table */}
        <div className="bg-white rounded-2xl border border-[#E2ECFA] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F4F8FE] border-b border-slate-100 text-[#64748B]">
                  <th className="py-3.5 px-4 font-semibold">Medicine</th>
                  <th className="py-3.5 px-4 font-semibold">Brand &amp; Category</th>
                  <th className="py-3.5 px-4 font-semibold">Stock Qty</th>
                  <th className="py-3.5 px-4 font-semibold">Expiry Date</th>
                  <th className="py-3.5 px-4 font-semibold">Purchase / Selling</th>
                  <th className="py-3.5 px-4 font-semibold">Supplier</th>
                  <th className="py-3.5 px-4 font-semibold">Availability</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMedicines.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center">
                      <Pill className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                      <div className="text-sm font-semibold text-[#082653]">No medicines match your filters</div>
                    </td>
                  </tr>
                ) : (
                  filteredMedicines.map((med) => {
                    const threshold = med.lowStockThreshold ?? 150;
                    const expiring = isExpiringSoon(med.expiryDate);
                    const isOut = med.stockCount === 0;
                    const isLow = med.stockCount > 0 && med.stockCount <= threshold;
                    const purchase = med.purchasePrice ?? Math.round(med.price * 0.72);
                    const selling = med.sellingPrice ?? med.price;

                    return (
                      <tr key={med.id} className="hover:bg-[#F4F8FE]/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-[#E6F5FF] border border-[#D9E8FF] overflow-hidden flex items-center justify-center shrink-0">
                              {med.imageUrl ? (
                                <img src={med.imageUrl} alt={med.name} className="w-full h-full object-cover" />
                              ) : (
                                <Pill className="h-4 w-4 text-[#0755D9]" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-[#10243B]">{med.name}</div>
                              <div className="text-[11px] text-[#64748B]">
                                {med.genericName} &bull; {med.form} {med.strength}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-[#10243B]">{med.brand || med.name.split(' ')[0]}</div>
                          <div className="text-[11px] text-[#0755D9]">{med.category}</div>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[#082653]">
                          {med.stockCount.toLocaleString()} units
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={expiring ? 'font-semibold text-[#EF4444]' : 'text-[#10243B]'}>
                            {med.expiryDate || '2028-01-01'}
                          </span>
                          {expiring && (
                            <span className="block text-[10px] text-[#EF4444] font-semibold">Expiring soon</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="text-[11px] text-[#64748B]">Buy: NPR {purchase}</div>
                          <div className="font-bold text-[#0755D9]">Sell: NPR {selling}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1 text-[#10243B] font-medium">
                            <Building2 className="h-3.5 w-3.5 text-[#64748B] shrink-0" />
                            <span>{med.supplier || med.manufacturer}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                              isOut
                                ? 'bg-rose-50 text-[#EF4444] border-rose-200'
                                : isLow
                                  ? 'bg-amber-50 text-[#F59E0B] border-amber-200'
                                  : 'bg-emerald-50 text-[#10B981] border-emerald-200'
                            }`}
                          >
                            {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEdit(med)}
                              className="px-2.5 py-1 rounded-lg border border-slate-200 hover:border-[#0755D9] text-[#082653] hover:text-[#0755D9] text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Edit2 className="h-3 w-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setRestockTarget(med);
                                setRestockDelta(100);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-[#E6F5FF] hover:bg-[#0755D9] text-[#0755D9] hover:text-white text-[11px] font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <PackagePlus className="h-3 w-3" />
                              <span>Restock</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit Medicine Modal */}
      {(showAddModal || editingMed) && (
        <div className="fixed inset-0 z-50 bg-[#082653]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveMedicine}
            className="bg-white rounded-2xl border border-[#D9E8FF] shadow-2xl max-w-2xl w-full p-6 space-y-4 text-xs max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display text-base font-bold text-[#082653]">
                {editingMed ? `Edit Medicine: ${editingMed.name}` : 'Add New Medicine'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingMed(null);
                }}
                className="p-1.5 rounded-lg text-[#64748B] hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="font-semibold text-[#082653] block mb-1">Medicine Name *</label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B]"
                />
              </div>
              <div>
                <label className="font-semibold text-[#082653] block mb-1">Brand</label>
                <input
                  type="text"
                  value={formState.brand}
                  onChange={(e) => setFormState({ ...formState, brand: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B]"
                />
              </div>
              <div>
                <label className="font-semibold text-[#082653] block mb-1">Generic Name *</label>
                <input
                  type="text"
                  required
                  value={formState.genericName}
                  onChange={(e) => setFormState({ ...formState, genericName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B]"
                />
              </div>
              <div>
                <label className="font-semibold text-[#082653] block mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={formState.category}
                  onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B]"
                />
              </div>
              <div>
                <label className="font-semibold text-[#082653] block mb-1">Form</label>
                <select
                  value={formState.form}
                  onChange={(e) => setFormState({ ...formState, form: e.target.value as Medicine['form'] })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B]"
                >
                  <option value="Tablet">Tablet</option>
                  <option value="Capsule">Capsule</option>
                  <option value="Syrup">Syrup</option>
                  <option value="Injection">Injection</option>
                  <option value="Ointment">Ointment</option>
                  <option value="Drops">Drops</option>
                  <option value="Inhaler">Inhaler</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-[#082653] block mb-1">Strength</label>
                <input
                  type="text"
                  value={formState.strength}
                  onChange={(e) => setFormState({ ...formState, strength: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B]"
                />
              </div>
              <div>
                <label className="font-semibold text-[#082653] block mb-1">Purchase Price (NPR)</label>
                <input
                  type="number"
                  min={0}
                  value={formState.purchasePrice}
                  onChange={(e) => setFormState({ ...formState, purchasePrice: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B]"
                />
              </div>
              <div>
                <label className="font-semibold text-[#082653] block mb-1">Selling Price (NPR)</label>
                <input
                  type="number"
                  min={0}
                  value={formState.sellingPrice}
                  onChange={(e) => setFormState({ ...formState, sellingPrice: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B]"
                />
              </div>
              <div>
                <label className="font-semibold text-[#082653] block mb-1">Stock Quantity</label>
                <input
                  type="number"
                  min={0}
                  value={formState.stockCount}
                  onChange={(e) => setFormState({ ...formState, stockCount: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B]"
                />
              </div>
              <div>
                <label className="font-semibold text-[#082653] block mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={formState.expiryDate}
                  onChange={(e) => setFormState({ ...formState, expiryDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B]"
                />
              </div>
              <div>
                <label className="font-semibold text-[#082653] block mb-1">Supplier</label>
                <input
                  type="text"
                  value={formState.supplier}
                  onChange={(e) => setFormState({ ...formState, supplier: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B]"
                />
              </div>
              <div>
                <label className="font-semibold text-[#082653] block mb-1">Medicine Image URL (optional)</label>
                <input
                  type="text"
                  value={formState.imageUrl}
                  onChange={(e) => setFormState({ ...formState, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B]"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-[#10243B] cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={formState.prescriptionRequired}
                onChange={(e) => setFormState({ ...formState, prescriptionRequired: e.target.checked })}
                className="rounded border-slate-300 text-[#0755D9]"
              />
              <span>Prescription Required (Schedule Drug)</span>
            </label>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingMed(null);
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 text-[#64748B] font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#0755D9] text-white font-semibold cursor-pointer"
              >
                {editingMed ? 'Save Changes' : 'Save Medicine'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Quick Restock Modal */}
      {restockTarget && (
        <div className="fixed inset-0 z-50 bg-[#082653]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleConfirmRestock}
            className="bg-white rounded-2xl border border-[#D9E8FF] shadow-2xl max-w-sm w-full p-6 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display text-base font-bold text-[#082653]">Restock Medicine</h3>
              <button
                type="button"
                onClick={() => setRestockTarget(null)}
                className="p-1 rounded-lg text-[#64748B] hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA]">
              <div className="font-semibold text-[#10243B]">{restockTarget.name}</div>
              <div className="text-[#64748B] mt-0.5">
                Current Stock: <strong>{restockTarget.stockCount} units</strong>
              </div>
            </div>

            <div>
              <label className="font-semibold text-[#082653] block mb-1.5">Quantity to Add</label>
              <input
                type="number"
                value={restockDelta}
                onChange={(e) => setRestockDelta(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B] font-semibold"
              />
              <div className="flex gap-2 mt-2">
                {[50, 100, 250, 500].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setRestockDelta(amt)}
                    className="px-2.5 py-1 rounded-lg bg-[#E6F5FF] text-[#0755D9] font-semibold hover:bg-[#0755D9] hover:text-white transition-colors cursor-pointer"
                  >
                    +{amt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRestockTarget(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-[#64748B] font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#10B981] text-white font-semibold cursor-pointer"
              >
                Apply Restock
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}
