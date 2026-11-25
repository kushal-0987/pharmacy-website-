import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { PublicLayout } from '@/components/common/PublicLayout';
import { toast } from 'sonner';

export const Route = createFileRoute('/cookies')({
  head: () => ({
    meta: [
      { title: 'Cookie Policy & Consent Settings — Two Brothers Healthcare' },
      { name: 'description', content: 'Understand and manage essential, preference, and analytical cookie usage.' },
    ],
  }),
  component: CookiesPage,
});

function CookiesPage() {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [preferencesEnabled, setPreferencesEnabled] = useState(true);

  const handleSave = () => {
    toast.success('Cookie preferences updated and saved.');
  };

  return (
    <PublicLayout>
      <div className="py-16 bg-navy-deep min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan block mb-2">
              Privacy Controls
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              Cookie Policy & Preferences
            </h1>
            <p className="text-xs text-on-dark-muted">
              We respect your right to privacy. We do not use third-party advertising or cross-site tracking cookies.
            </p>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-midnight/40 border border-on-dark/15 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-bold text-white text-base">Essential Healthcare Cookies</h3>
                <p className="text-xs text-on-dark-muted mt-1 leading-relaxed">
                  Required for appointment slot locking (10-minute hold), secure session tokens, and language switching. These cannot be deactivated.
                </p>
              </div>
              <span className="text-xs font-bold text-leaf bg-leaf/10 px-3 py-1 rounded-full shrink-0">
                Always Active
              </span>
            </div>

            <div className="p-6 rounded-3xl bg-midnight/40 border border-on-dark/15 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-bold text-white text-base">Preferences & Language Storage</h3>
                <p className="text-xs text-on-dark-muted mt-1 leading-relaxed">
                  Stores your chosen display language (English / Nepali) and selected patient profile defaults across visits.
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferencesEnabled}
                onChange={(e) => setPreferencesEnabled(e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-on-dark/30 text-cyan focus:ring-0 cursor-pointer"
              />
            </div>

            <div className="p-6 rounded-3xl bg-midnight/40 border border-on-dark/15 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-bold text-white text-base">Anonymous Performance Analytics</h3>
                <p className="text-xs text-on-dark-muted mt-1 leading-relaxed">
                  Aggregated, privacy-respecting metrics to identify slow pages and improve booking responsiveness on mobile devices in Nepal.
                </p>
              </div>
              <input
                type="checkbox"
                checked={analyticsEnabled}
                onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-on-dark/30 text-cyan focus:ring-0 cursor-pointer"
              />
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="px-8 py-3.5 rounded-full bg-cyan text-navy-deep font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all"
            >
              Save Cookie Preferences
            </button>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
