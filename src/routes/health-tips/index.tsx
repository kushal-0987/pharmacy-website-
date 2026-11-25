import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { PublicLayout } from '@/components/common/PublicLayout';
import { useHealthcare } from '@/lib/healthcare-store';
import {
  BookOpen,
  Calendar,
  Clock,
  User,
  ArrowRight,
  Search,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/health-tips/')({
  head: () => ({
    meta: [
      { title: 'Health Tips & Medical Blog — Two Brothers Healthcare | Lalitpur' },
      {
        name: 'description',
        content:
          'Doctor-reviewed healthcare articles, medication safety guides, dietary tips, and chronic disease management for families in Lalitpur and Kathmandu.',
      },
    ],
  }),
  component: HealthTipsIndexPage,
});

function HealthTipsIndexPage() {
  const { articles } = useHealthcare();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const categories = [
    'Chronic Conditions',
    'Seasonal Health',
    'Prevention',
    'Nutrition',
    'Medication Safety',
  ];

  const featuredArticle = articles[0];

  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchCat = selectedCategory === 'all' || art.category === selectedCategory;
      const matchSearch =
        art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [articles, selectedCategory, searchTerm]);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    toast.success('Thank you! You have subscribed to our monthly health digest.');
    setNewsletterEmail('');
  };

  return (
    <PublicLayout>
      {/* 1. Hero & Featured Article */}
      <section className="py-16 bg-gradient-to-b from-navy to-navy-deep border-b border-on-dark/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan block mb-3">
              Doctor-Reviewed Health Guidance
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight leading-[1.1] mb-4">
              Community Health Tips & Wellness Insights
            </h1>
            <p className="text-sm sm:text-base text-on-dark-muted leading-relaxed">
              Evidence-based health knowledge tailored to everyday lifestyle and environmental health factors in the Kathmandu Valley. Written and verified by our clinical specialists.
            </p>
          </div>

          {/* Featured Article Card */}
          {featuredArticle && (
            <Link
              to="/health-tips/$slug"
              params={{ slug: featuredArticle.slug }}
              className="rounded-3xl bg-midnight/60 border border-on-dark/15 overflow-hidden flex flex-col lg:flex-row hover:border-cyan/40 transition-all hover:shadow-2xl group"
            >
              <div className="lg:w-1/2 h-64 lg:h-auto overflow-hidden bg-navy">
                <img
                  src={featuredArticle.coverImageUrl}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="lg:w-1/2 p-8 sm:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold text-cyan bg-cyan/15 border border-cyan/30 px-3 py-0.5 rounded-full uppercase tracking-wider">
                      Featured · {featuredArticle.category}
                    </span>
                    <span className="text-xs text-on-dark-muted flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {featuredArticle.readTimeMinutes} min read
                    </span>
                  </div>

                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-white group-hover:text-cyan transition-colors mb-4 leading-snug">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-on-dark-muted leading-relaxed mb-6">
                    {featuredArticle.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-on-dark/10 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{featuredArticle.authorName}</span>
                    <span className="text-[11px] text-teal">{featuredArticle.authorCredentials}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 font-bold text-cyan group-hover:translate-x-1 transition-transform">
                    <span>Read Article</span>
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* 2. Category Filter & Search Bar */}
      <section className="py-8 bg-navy border-b border-on-dark/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-cyan text-navy-deep font-bold'
                  : 'bg-midnight text-on-dark-muted border border-on-dark/15 hover:text-white'
              }`}
            >
              All Topics
            </button>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCategory(c)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === c
                    ? 'bg-cyan text-navy-deep font-bold'
                    : 'bg-midnight text-on-dark-muted border border-on-dark/15 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-on-dark-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-navy-deep border border-on-dark/20 text-white placeholder-on-dark-muted text-xs focus:outline-none focus:border-cyan"
            />
          </div>
        </div>
      </section>

      {/* 3. Article Grid */}
      <section className="py-16 bg-navy-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((art) => (
              <Link
                key={art.id}
                to="/health-tips/$slug"
                params={{ slug: art.slug }}
                className="rounded-3xl bg-midnight/40 border border-on-dark/15 overflow-hidden flex flex-col justify-between hover:border-cyan/40 transition-all hover:shadow-2xl group"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-navy">
                    <img
                      src={art.coverImageUrl}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-navy-deep/85 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-cyan border border-cyan/30">
                      {art.category}
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 text-[11px] text-on-dark-muted mb-2">
                      <span>{art.publishedDate}</span>
                      <span>•</span>
                      <span>{art.readTimeMinutes} min read</span>
                    </div>

                    <h3 className="font-display text-lg font-bold text-white mb-2 group-hover:text-cyan transition-colors leading-snug">
                      {art.title}
                    </h3>
                    <p className="text-xs text-on-dark-muted line-clamp-3 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-on-dark/10 flex items-center justify-between text-xs text-teal">
                  <span className="font-medium truncate">By {art.authorName}</span>
                  <span className="text-cyan group-hover:underline shrink-0">Read →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Newsletter Signup */}
      <section className="py-16 bg-navy border-t border-on-dark/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="h-12 w-12 rounded-full bg-cyan/20 text-cyan flex items-center justify-center mx-auto">
            <Mail className="h-6 w-6" />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Receive Our Monthly Community Health Digest
          </h2>
          <p className="text-xs sm:text-sm text-on-dark-muted max-w-lg mx-auto">
            Practical health tips, seasonal epidemic warnings, and pharmacy updates delivered directly to your inbox. No spam, ever.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address..."
              className="flex-1 px-4 py-3 rounded-full bg-navy-deep border border-on-dark/20 text-white placeholder-on-dark-muted text-xs focus:outline-none focus:border-cyan"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-cyan text-navy-deep font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              Subscribe Free
            </button>
          </form>
        </div>
      </section>
    </PublicLayout>
  );
}
