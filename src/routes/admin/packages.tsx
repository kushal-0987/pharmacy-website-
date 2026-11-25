import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import { HealthPackage } from '@/types/healthcare';
import {
  Package,
  Plus,
  CheckCircle2,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/packages')({
  head: () => ({
    meta: [
      { title: 'Health Package Management — Two Brothers Healthcare' },
      { name: 'description', content: 'Manage wellness screening packages, test parameters, and seasonal discounts.' },
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

    const newPkg: HealthPackage = {
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
    };

    setPackageList((prev) => [newPkg, ...prev]);
    toast.success(`Package "${pkgName}" published!`);
    setPkgName('');
    setShowAdd(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-on-dark/15">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Health Checkup Packages</h1>
            <p className="text-xs text-on-dark-muted">
              Configure bundled preventive tests, pricing discounts, and promotional banners.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAdd(!showAdd)}
            className="px-5 py-2.5 rounded-full bg-cyan text-navy-deep font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 self-start sm:self-auto hover:scale-105 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Package</span>
          </button>
        </div>

        {/* Add Package Modal */}
        {showAdd && (
          <form
            onSubmit={handleCreatePackage}
            className="p-6 rounded-3xl bg-midnight/70 border border-teal/40 space-y-4 text-xs animate-in fade-in shadow-2xl"
          >
            <h3 className="font-bold text-white text-base">New Preventive Package</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-white font-semibold block mb-1">Package Name *</label>
                <input
                  type="text"
                  required
                  value={pkgName}
                  onChange={(e) => setPkgName(e.target.value)}
                  placeholder="Cardiac & Metabolic Screen"
                  className="w-full px-3 py-2 rounded-xl bg-navy-deep border border-on-dark/20 text-white"
                />
              </div>
              <div>
                <label className="text-white font-semibold block mb-1">Price (NPR) *</label>
                <input
                  type="number"
                  required
                  value={pkgPrice}
                  onChange={(e) => setPkgPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-navy-deep border border-on-dark/20 text-white font-bold text-cyan"
                />
              </div>
              <div>
                <label className="text-white font-semibold block mb-1">Promotional Badge</label>
                <input
                  type="text"
                  value={pkgBadge}
                  onChange={(e) => setPkgBadge(e.target.value)}
                  placeholder="Popular / Best Value"
                  className="w-full px-3 py-2 rounded-xl bg-navy-deep border border-on-dark/20 text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-white font-semibold block mb-1">One-Line Tagline *</label>
              <input
                type="text"
                required
                value={pkgTagline}
                onChange={(e) => setPkgTagline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-navy-deep border border-on-dark/20 text-white"
              />
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
                Publish Package
              </button>
            </div>
          </form>
        )}

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packageList.map((pkg) => (
            <div
              key={pkg.id}
              className="p-6 rounded-3xl bg-midnight/50 border border-on-dark/15 flex flex-col justify-between space-y-4 hover:border-cyan/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-teal uppercase tracking-wider">
                    {pkg.category} Panel
                  </span>
                  {pkg.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan/20 text-cyan">
                      {pkg.badge}
                    </span>
                  )}
                </div>

                <h3 className="font-display text-xl font-bold text-white">{pkg.name}</h3>
                <p className="text-xs text-on-dark-muted">{pkg.tagline}</p>

                <div className="flex items-baseline gap-2 pt-2 border-t border-on-dark/10">
                  <span className="text-2xl font-bold text-cyan">NPR {pkg.price}</span>
                  <span className="text-xs text-leaf font-bold ml-auto">{pkg.testCount} Tests</span>
                </div>
              </div>

              <div className="pt-3 border-t border-on-dark/10 text-xs text-on-dark-muted flex justify-between items-center">
                <span>Duration: {pkg.durationMinutes} mins</span>
                <span className="text-leaf font-semibold">Active in Online Wizard</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
