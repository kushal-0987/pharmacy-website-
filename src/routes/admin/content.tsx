import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import { HealthArticle } from '@/types/healthcare';
import {
  FileText,
  Plus,
  HelpCircle,
  CheckCircle2,
  Trash2,
  Edit,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/content')({
  head: () => ({
    meta: [
      { title: 'Clinical Content & Editorial CMS — Two Brothers Healthcare' },
      { name: 'description', content: 'Publish doctor-reviewed articles, update FAQ accordions, and manage static copy.' },
    ],
  }),
  component: AdminContentPage,
});

function AdminContentPage() {
  const { articles, providers } = useHealthcare();
  const [articleList, setArticleList] = useState<HealthArticle[]>(articles);

  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCat, setNewCat] = useState<HealthArticle['category']>('Prevention');
  const [newAuthor, setNewAuthor] = useState('Dr. Suresh Shrestha');
  const [newExcerpt, setNewExcerpt] = useState('');

  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newArt: HealthArticle = {
      id: 'art-' + Date.now(),
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: newTitle,
      category: newCat,
      excerpt: newExcerpt,
      coverImageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800',
      authorName: newAuthor,
      authorCredentials: 'MBBS, MD',
      reviewedByDoctor: 'Dr. Suresh Shrestha (Senior Consultant)',
      reviewDate: '2026-11-23',
      publishedDate: '2026-11-23',
      readTimeMinutes: 5,
      contentMarkdown: newExcerpt,
    };

    setArticleList((prev) => [newArt, ...prev]);
    toast.success(`Article "${newTitle}" published to health tips hub!`);
    setNewTitle('');
    setNewExcerpt('');
    setShowAdd(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-on-dark/15">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Content & Editorial Management</h1>
            <p className="text-xs text-on-dark-muted">
              Doctor-reviewed wellness blog articles, medical reviewers, and community FAQ knowledge.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAdd(!showAdd)}
            className="px-5 py-2.5 rounded-full bg-cyan text-navy-deep font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 self-start sm:self-auto hover:scale-105 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Draft New Article</span>
          </button>
        </div>

        {/* Add Article Modal */}
        {showAdd && (
          <form
            onSubmit={handleCreateArticle}
            className="p-6 rounded-3xl bg-midnight/70 border border-teal/40 space-y-4 text-xs animate-in fade-in shadow-2xl"
          >
            <h3 className="font-bold text-white text-base">Draft Clinically Verified Article</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="text-white font-semibold block mb-1">Article Headline *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Safe Winter Hydration & Pediatric Respiratory Care"
                  className="w-full px-3 py-2 rounded-xl bg-navy-deep border border-on-dark/20 text-white"
                />
              </div>
              <div>
                <label className="text-white font-semibold block mb-1">Health Category</label>
                <select
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-navy-deep border border-on-dark/20 text-white"
                >
                  <option value="Prevention">Prevention</option>
                  <option value="Chronic Conditions">Chronic Conditions</option>
                  <option value="Seasonal Health">Seasonal Health</option>
                  <option value="Nutrition">Nutrition</option>
                  <option value="Medication Safety">Medication Safety</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-white font-semibold block mb-1">Assigned Medical Author *</label>
              <select
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-navy-deep border border-on-dark/20 text-white"
              >
                {providers.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name} ({p.title})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-white font-semibold block mb-1">Article Summary & Body *</label>
              <textarea
                rows={4}
                required
                value={newExcerpt}
                onChange={(e) => setNewExcerpt(e.target.value)}
                placeholder="Write evidence-based health guidance..."
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
                Publish Article
              </button>
            </div>
          </form>
        )}

        {/* Articles Table */}
        <div className="rounded-3xl bg-midnight/40 border border-on-dark/15 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-on-dark/15 text-on-dark-muted bg-navy/60">
                  <th className="py-3 px-4 font-bold">Article Title</th>
                  <th className="py-3 px-4 font-bold">Category</th>
                  <th className="py-3 px-4 font-bold">Doctor Author</th>
                  <th className="py-3 px-4 font-bold">Medical Reviewer</th>
                  <th className="py-3 px-4 font-bold">Publish Date</th>
                  <th className="py-3 px-4 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-on-dark/10">
                {articleList.map((art) => (
                  <tr key={art.id} className="hover:bg-navy-deep/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white text-sm max-w-sm truncate">{art.title}</td>
                    <td className="py-3.5 px-4 text-cyan">{art.category}</td>
                    <td className="py-3.5 px-4 text-white">{art.authorName}</td>
                    <td className="py-3.5 px-4 text-teal">{art.reviewedByDoctor}</td>
                    <td className="py-3.5 px-4 text-on-dark-muted">{art.publishedDate}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-leaf/20 text-leaf">
                        Published
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
