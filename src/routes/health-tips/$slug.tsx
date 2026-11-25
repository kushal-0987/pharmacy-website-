import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { PublicLayout } from '@/components/common/PublicLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import {
  Calendar,
  Clock,
  User,
  ShieldCheck,
  Share2,
  Bookmark,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/health-tips/$slug')({
  component: ArticleDetailPage,
});

function ArticleDetailPage() {
  const { slug } = Route.useParams();
  const { articles } = useHealthcare();

  const article = articles.find((a) => a.slug === slug) || articles[0];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Article link copied to clipboard!');
    }
  };

  const relatedArticles = articles.filter((a) => a.id !== article.id).slice(0, 2);

  return (
    <PublicLayout>
      <article className="py-12 bg-navy-deep min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            to="/health-tips"
            className="inline-flex items-center gap-2 text-xs text-on-dark-muted hover:text-cyan mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Health Tips
          </Link>

          {/* Article Header */}
          <div className="space-y-4 mb-8">
            <span className="text-[11px] font-bold text-cyan bg-cyan/15 border border-cyan/30 px-3 py-1 rounded-full uppercase tracking-wider inline-block">
              {article.category}
            </span>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.15]">
              {article.title}
            </h1>

            {article.titleNe && (
              <p className="text-base sm:text-lg text-teal font-medium">
                {article.titleNe}
              </p>
            )}

            {/* Author & Meta Row */}
            <div className="pt-4 border-t border-on-dark/15 flex flex-wrap items-center justify-between gap-4 text-xs text-on-dark-muted">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-teal/20 text-cyan flex items-center justify-center font-bold">
                  {article.authorName.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-white">{article.authorName}</div>
                  <div className="text-[11px] text-teal">{article.authorCredentials}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> {article.publishedDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> {article.readTimeMinutes} min read
                </span>
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share article"
                  className="p-2 rounded-full bg-midnight hover:text-white border border-on-dark/15 transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="rounded-3xl overflow-hidden border border-on-dark/15 h-80 sm:h-96 w-full mb-10 bg-midnight">
            <img
              src={article.coverImageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Table of Contents Box */}
          <div className="p-6 rounded-2xl bg-midnight/50 border border-on-dark/15 mb-10 text-xs">
            <div className="font-bold text-white uppercase tracking-wider mb-2">Table of Contents:</div>
            <ul className="space-y-1.5 text-cyan">
              <li>• Key Health Realities in Lalitpur & Kathmandu</li>
              <li>• Practical Everyday Steps for Prevention</li>
              <li>• When to Seek Urgent Clinical Consultation</li>
              <li>• Safe Medication & Hydration Principles</li>
            </ul>
          </div>

          {/* Article Body */}
          <div className="prose prose-invert max-w-none text-sm sm:text-base text-on-dark-muted leading-relaxed space-y-6">
            <p className="text-lg text-white font-medium leading-relaxed">
              {article.excerpt}
            </p>

            <div className="p-6 rounded-3xl bg-midnight/30 border-l-4 border-teal my-6 text-sm text-white">
              "Preventive lifestyle awareness and consistent biomarker tracking can prevent up to 80% of avoidable cardiovascular and metabolic hospitalizations." — Two Brothers Clinical Board
            </div>

            <div className="whitespace-pre-line font-sans text-on-dark-muted">
              {article.contentMarkdown}
            </div>

            <h3 className="font-display text-xl font-bold text-white mt-8 mb-3">
              Essential Takeaways for Household Caregivers
            </h3>
            <ul className="space-y-2 text-sm text-on-dark-muted">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-leaf shrink-0 mt-1" />
                <span>Maintain a dedicated medicine journal for elders taking antihypertensives.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-leaf shrink-0 mt-1" />
                <span>Verify expiry dates and storage temperature conditions on all insulin vials.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-leaf shrink-0 mt-1" />
                <span>Consult our Sanagau pharmacists for complimentary medication interaction checks.</span>
              </li>
            </ul>
          </div>

          {/* Medical Review Footer */}
          <div className="mt-12 p-6 rounded-2xl bg-midnight border border-teal/40 flex items-start sm:items-center gap-4 text-xs">
            <ShieldCheck className="h-8 w-8 text-leaf shrink-0" />
            <div className="flex-1">
              <div className="font-bold text-white text-sm">
                Clinically Reviewed by {article.reviewedByDoctor}
              </div>
              <div className="text-on-dark-muted mt-0.5">
                Verified on {article.reviewDate}. All facts conform to Ministry of Health & Population (MoHP) clinical protocols and WHO guidelines.
              </div>
            </div>
          </div>

          {/* Educational Disclaimer */}
          <div className="mt-6 p-4 rounded-xl bg-navy/60 border border-on-dark/10 text-center text-xs text-on-dark-muted">
            <strong className="text-white">Medical Disclaimer:</strong> The information in this article is provided for educational purposes only and should not be used as a substitute for professional diagnosis or clinical advice. Always consult a qualified physician regarding any medical symptoms.
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="mt-16 pt-10 border-t border-on-dark/15">
              <h3 className="font-display text-2xl font-bold text-white mb-6">
                Related Health Articles
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.id}
                    to="/health-tips/$slug"
                    params={{ slug: rel.slug }}
                    className="p-5 rounded-2xl bg-midnight/40 border border-on-dark/15 hover:border-cyan/40 transition-colors block group"
                  >
                    <span className="text-[10px] text-teal font-bold block mb-1">
                      {rel.category}
                    </span>
                    <h4 className="font-bold text-white text-sm group-hover:text-cyan transition-colors mb-2">
                      {rel.title}
                    </h4>
                    <p className="text-xs text-on-dark-muted line-clamp-2">{rel.excerpt}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </PublicLayout>
  );
}
