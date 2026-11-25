import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import { HealthArticle } from '@/types/healthcare';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/content')({
  head: () => ({
    meta: [
      { title: 'Health Articles & Content — Two Brothers Healthcare' },
      { name: 'description', content: 'Publish doctor-reviewed health articles and tips.' },
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
    setArticleList((prev) => [
      {
        id: 'art-' + Date.now(),
        slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: newTitle,
        category: newCat,
        excerpt: newExcerpt,
        coverImageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800',
        authorName: newAuthor,
        authorCredentials: 'MBBS, MD',
        reviewedByDoctor: 'Dr. Suresh Shrestha',
        reviewDate: '2026-11-25',
        publishedDate: '2026-11-25',
        readTimeMinutes: 5,
        contentMarkdown: newExcerpt,
      },
      ...prev,
    ]);
    toast.success(`Article "${newTitle}" published.`);
    setNewTitle('');
    setNewExcerpt('');
    setShowAdd(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#082653]">Content &amp; Health Articles</h1>
            <p className="text-xs text-[#64748B] mt-0.5">Manage doctor-reviewed health tips and editorial publications.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowAdd(!showAdd)}
            className="px-4 py-2.5 rounded-xl bg-[#0755D9] text-white font-semibold text-xs inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Draft Article</span>
          </button>
        </div>

        {showAdd && (
          <form onSubmit={handleCreateArticle} className="bg-white rounded-2xl border border-[#D9E8FF] p-6 shadow-xs space-y-4 text-xs">
            <h3 className="font-display font-bold text-[#082653] text-base">Draft Clinically Verified Article</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="text-[#082653] font-semibold block mb-1">Headline *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B]"
                />
              </div>
              <div>
                <label className="text-[#082653] font-semibold block mb-1">Category</label>
                <select
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value as HealthArticle['category'])}
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B]"
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
              <label className="text-[#082653] font-semibold block mb-1">Author</label>
              <select
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B]"
              >
                {providers.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[#082653] font-semibold block mb-1">Summary &amp; Content *</label>
              <textarea
                rows={3}
                required
                value={newExcerpt}
                onChange={(e) => setNewExcerpt(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F4F8FE] border border-[#E2ECFA] text-[#10243B]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-[#64748B]">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-[#0755D9] text-white font-semibold">
                Publish Article
              </button>
            </div>
          </form>
        )}

        <div className="bg-white rounded-2xl border border-[#E2ECFA] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F4F8FE] border-b border-slate-100 text-[#64748B]">
                  <th className="py-3.5 px-4 font-semibold">Title</th>
                  <th className="py-3.5 px-4 font-semibold">Category</th>
                  <th className="py-3.5 px-4 font-semibold">Author</th>
                  <th className="py-3.5 px-4 font-semibold">Published</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {articleList.map((art) => (
                  <tr key={art.id} className="hover:bg-[#F4F8FE]/60">
                    <td className="py-3.5 px-4 font-semibold text-[#10243B] max-w-sm truncate">{art.title}</td>
                    <td className="py-3.5 px-4 text-[#0755D9] font-medium">{art.category}</td>
                    <td className="py-3.5 px-4 text-[#64748B]">{art.authorName}</td>
                    <td className="py-3.5 px-4 text-[#64748B]">{art.publishedDate}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#10B981] border border-emerald-200 text-[11px] font-semibold">
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
