import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import { HealthPackage } from '@/types/healthcare';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/packages')({
  head: () => ({
    meta: [
      { title: 'Health Packages — Two Brothers Healthcare' },
      { name: 'description', content: 'Manage wellness screening packages and pricing.' },
    ],
  }),
  component: AdminPackagesPage,
});

function AdminPackagesPage() {
  const { packages } = useHealthcare();
  const [packageList, setPackageList] = useState<HealthPackage[]>(packages);
  const [showAdd, setShowAdd] = useState(false);
  const [pkgName, setPkgName] = useState('');
  const [pkgPrice, setPkgPrice] = useState(2500);
  const [pkgTagline, setPkgTagline] = useState('Routine annual baseline screen');
  const [pkgBadge, setPkgBadge] = useState('New');

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkgName.trim()) return;
    setPackageList((prev) => [
      {
        id: 'pkg-' + Date.now(),
        name: pkgName,
        slug: pkgName.toLowerCase().replace(/\s+/g, '-'),
        category: 'Basic',
        tagline: pkgTagline,
        price: pkgPrice,
        originalPrice: pkgPrice + 600,
        testCount: 20,
        durationMinutes: 45,
        includedTests: ['Complete Blood Count', 'Fasting Blood Sugar', 'Lipid Screen', 'Urine Routine'],
        exclusions: ['CT Scan'],
        preparationNotes: 'Fasting 10-12 hours.',
        targetAudience: 'Community adults',
        badge: pkgBadge,
      },
      ...prev,
    ]);
    toast.success(`Package "${pkgName}" added.`);
    setPkgName('');
    setShowAdd(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#082653]">Health Checkup Packages</h1>
            <p className="text-xs text-[#64748B] mt-0.5">Configure preventive diagnostic panels and pricing.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowAdd(!showAdd)}
            className="px-4 py-2.5 rounded-xl bg-[#0755D9] text-white font-semibold text-xs inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Create Package</span>
          </button>
        </div>

        {showAdd && (
          <form onSubmit={handleCreatePackage} className="bg-white rounded-2xl border border-[#D9E8FF] p-6 shadow-xs space-y-4 text-xs">
            <h3 className="font-display font-bold text-[#082653] text-base">New Preventive Package</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[#082653] font-semibold block mb-1">Package Name *</label>
                <input
                  type="text"
                  required
                  value={pkgName}
                  onChange={(e) => setPkgName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B]"
                />
              </div>
              <div>
                <label className="text-[#082653] font-semibold block mb-1">Price (NPR) *</label>
                <input
                  type="number"
                  required
                  value={pkgPrice}
                  onChange={(e) => setPkgPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#0755D9] font-bold"
                />
              </div>
              <div>
                <label className="text-[#082653] font-semibold block mb-1">Badge</label>
                <input
                  type="text"
                  value={pkgBadge}
                  onChange={(e) => setPkgBadge(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B]"
                />
              </div>
            </div>
            <div>
              <label className="text-[#082653] font-semibold block mb-1">Tagline *</label>
              <input
                type="text"
                required
                value={pkgTagline}
                onChange={(e) => setPkgTagline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-[#64748B]">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-[#0755D9] text-white font-semibold">
                Save Package
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {packageList.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-2xl border border-[#E2ECFA] p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#0755D9] uppercase tracking-wider">{pkg.category} Panel</span>
                  {pkg.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E6F5FF] text-[#0755D9]">
                      {pkg.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-display text-lg font-bold text-[#082653]">{pkg.name}</h3>
                <p className="text-xs text-[#64748B]">{pkg.tagline}</p>
                <div className="flex items-baseline justify-between pt-3 border-t border-slate-100">
                  <span className="text-xl font-bold text-[#0755D9]">NPR {pkg.price.toLocaleString()}</span>
                  <span className="text-xs text-[#10B981] font-semibold">{pkg.testCount} Tests</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-[#64748B] flex justify-between">
                <span>Duration: {pkg.durationMinutes} mins</span>
                <span className="text-[#10B981] font-semibold">Active</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
