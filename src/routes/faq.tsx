import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { PublicLayout } from '@/components/common/PublicLayout';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  PhoneCall,
  Calendar,
  Pill,
} from 'lucide-react';

export const Route = createFileRoute('/faq')({
  head: () => ({
    meta: [
      { title: 'Frequently Asked Questions (FAQ) — Two Brothers Healthcare | Lalitpur' },
      {
        name: 'description',
        content:
          'Clear answers to common questions about doctor appointments, 24/7 pharmacy, home medicine delivery, diagnostic lab tests, and health packages in Lalitpur.',
      },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Is the pharmacy in Sanagau open 24 hours?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, the Two Brothers Healthcare community dispensary operates 24 hours a day, 7 days a week, including public holidays in Nepal.',
              },
            },
            {
              '@type': 'Question',
              name: 'How does online slot holding prevent double booking?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'When you select an appointment slot on our website, it is temporarily locked for 10 minutes, giving you adequate time to complete your details without risk of another patient claiming the slot.',
              },
            },
          ],
        }),
      },
    ],
  }),
  component: FaqPage,
});

interface FaqItem {
  id: string;
  category: 'Appointments' | 'Pharmacy' | 'Delivery' | 'Laboratory' | 'Privacy';
  q: string;
  a: string;
}

const FAQ_DATA: FaqItem[] = [
  // Appointments
  {
    id: 'f-1',
    category: 'Appointments',
    q: 'How does your 10-minute slot holding work during appointment booking?',
    a: 'When you pick an appointment date and time slot in Step 2 of our booking wizard, our system locks that slot for 10 minutes. If someone else attempts to book that exact slot while you are filling your information, it appears unavailable. If you do not finalize within 10 minutes, the slot is automatically released.',
  },
  {
    id: 'f-2',
    category: 'Appointments',
    q: 'Can I reschedule or cancel my appointment if my plan changes?',
    a: 'Yes. You can reschedule or cancel directly from your Patient Portal up to 2 hours before the scheduled time slot. You can also call our front desk at 01-5582910 for instant assistance.',
  },
  {
    id: 'f-3',
    category: 'Appointments',
    q: 'Do I have to pay upfront to book an appointment online?',
    a: 'No upfront online payment is mandatory. You can pay when you arrive at our Sanagau reception counter via Cash, Fonepay QR, or Debit/Credit Card.',
  },

  // Pharmacy
  {
    id: 'f-4',
    category: 'Pharmacy',
    q: 'Is the pharmacy truly open 24 hours a day?',
    a: 'Yes. Our community pharmacy in Sanagau is staffed 24/7 by licensed personnel, ensuring emergency medications, fever remedies, inhalers, and pediatric syrups are always accessible day and night.',
  },
  {
    id: 'f-5',
    category: 'Pharmacy',
    q: 'Why do certain medications require an uploaded prescription?',
    a: 'Under the Nepal Department of Drug Administration (DDA) guidelines, antibiotics, sedatives, psychiatric drugs, and cardiovascular medications cannot be dispensed without a valid prescription from a registered doctor.',
  },
  {
    id: 'f-6',
    category: 'Pharmacy',
    q: 'Are generic medicines equally effective compared to branded equivalents?',
    a: 'Yes. Certified generic formulations contain the identical active pharmaceutical ingredient (API), chemical structure, and potency as branded counterparts, often at significantly lower cost.',
  },

  // Delivery
  {
    id: 'f-7',
    category: 'Delivery',
    q: 'Which areas in Lalitpur and Kathmandu do you deliver medicines to?',
    a: 'We deliver directly to Sanagau, Mahalaxmi Municipality, Gwarko, Imadol, Tikathali, Patan, Pulchowk, Jawalakhel, Satdobato, and major hubs along the Kathmandu Ring Road.',
  },
  {
    id: 'f-8',
    category: 'Delivery',
    q: 'How fast will my medicine enquiry be delivered?',
    a: 'For Lalitpur Zone 1 (Sanagau, Gwarko, Imadol), deliveries typically take 30 to 60 minutes after pharmacist confirmation. Other areas in the Valley are fulfilled within 2 to 4 hours.',
  },

  // Laboratory
  {
    id: 'f-9',
    category: 'Laboratory',
    q: 'How should I prepare for fasting blood tests (Sugar, Lipids, LFT)?',
    a: 'Fasting tests require an overnight fast of 10 to 12 hours. You should not consume food, tea, coffee, or milk during this period. Plain drinking water is permitted and encouraged.',
  },
  {
    id: 'f-10',
    category: 'Laboratory',
    q: 'How can I access my diagnostic lab reports?',
    a: 'Your reports are uploaded directly to your Patient Portal as secure downloadable PDFs. You will also receive an SMS alert with a download link, or you can pick up a color-printed hardcopy at our Sanagau clinic.',
  },

  // Privacy
  {
    id: 'f-11',
    category: 'Privacy',
    q: 'How is my personal and medical data protected?',
    a: 'All uploaded prescriptions and lab files are stored in private, encrypted vaults with strict access permissions. Only treating physicians and authorized pharmacists can view your medical records.',
  },
];

function FaqPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({ 'f-1': true, 'f-4': true });

  const categories = ['Appointments', 'Pharmacy', 'Delivery', 'Laboratory', 'Privacy'];

  const toggleItem = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchSearch =
        item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.a.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchTerm]);

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-navy to-navy-deep border-b border-on-dark/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-cyan block mb-3">
              Clear & Transparent Answers
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-sm sm:text-base text-on-dark-muted leading-relaxed mb-8">
              Everything you need to know about booking, doctor consultations, 24/7 pharmacy services, and home delivery at Two Brothers Healthcare.
            </p>

            {/* Search */}
            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-on-dark-muted" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search questions (e.g. delivery, fasting, pharmacy hours)..."
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-midnight border border-on-dark/20 text-white placeholder-on-dark-muted text-xs focus:outline-none focus:border-cyan shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Accordion Body */}
      <section className="py-16 bg-navy-deep">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Tabs */}
          <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-cyan text-navy-deep font-bold'
                  : 'bg-midnight text-on-dark-muted border border-on-dark/15 hover:text-white'
              }`}
            >
              All Topics ({FAQ_DATA.length})
            </button>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCategory(c)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === c
                    ? 'bg-cyan text-navy-deep font-bold'
                    : 'bg-midnight text-on-dark-muted border border-on-dark/15 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Accordion Items */}
          <div className="space-y-4">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12 rounded-3xl bg-midnight/30 border border-on-dark/15 p-8">
                <HelpCircle className="h-10 w-10 text-on-dark-muted mx-auto mb-3" />
                <h3 className="font-bold text-white text-base">No matching questions found</h3>
                <p className="text-xs text-on-dark-muted mt-1">
                  Try another keyword or call our Sanagau helpdesk directly at 01-5582910.
                </p>
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isOpen = !!openIds[faq.id];
                return (
                  <div
                    key={faq.id}
                    className="rounded-2xl bg-midnight/40 border border-on-dark/15 overflow-hidden transition-colors hover:border-cyan/30"
                  >
                    <button
                      type="button"
                      onClick={() => toggleItem(faq.id)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-white text-sm sm:text-base hover:text-cyan transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-[10px] uppercase font-bold text-teal bg-teal/15 px-2 py-0.5 rounded-md shrink-0">
                          {faq.category}
                        </span>
                        <span>{faq.q}</span>
                      </span>
                      {isOpen ? (
                        <ChevronUp className="h-5 w-5 text-cyan shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-on-dark-muted shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-on-dark-muted leading-relaxed border-t border-on-dark/10">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Still Need Help Box */}
          <div className="mt-16 rounded-3xl bg-midnight/60 border border-teal/40 p-8 text-center space-y-4">
            <h3 className="font-display text-xl font-bold text-white">Have a Unique Question?</h3>
            <p className="text-xs text-on-dark-muted max-w-md mx-auto">
              Our front desk and pharmaceutical team in Sanagau are available 24/7 to answer your specific medical questions.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <a
                href="tel:015582910"
                className="px-6 py-2.5 rounded-full bg-cyan text-navy-deep font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md"
              >
                <PhoneCall className="h-3.5 w-3.5" /> Call Front Desk (01-5582910)
              </a>
              <Link
                to="/contact"
                className="px-6 py-2.5 rounded-full bg-on-dark/10 border border-on-dark/20 text-white font-semibold text-xs hover:bg-white/10"
              >
                Contact Form
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
