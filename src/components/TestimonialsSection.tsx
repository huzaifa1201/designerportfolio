import React, { useState } from 'react';
import { Star, Plus, Check, Quote, X } from 'lucide-react';
import { Testimonial } from '../types';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  onAddTestimonial: (
    author: string,
    role: string,
    company: string,
    quote: string,
    rating: number
  ) => Promise<void>;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials,
  onAddTestimonial,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [author, setAuthor] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [quote, setQuote] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !quote) return;

    setLoading(true);
    try {
      await onAddTestimonial(author, role, company, quote, rating);
      setSubmitted(true);
      setTimeout(() => {
        setShowAddModal(false);
        setSubmitted(false);
        setAuthor('');
        setRole('');
        setCompany('');
        setQuote('');
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative z-10 w-full py-16 lg:py-24 bg-[#F5F3EF]" id="testimonials">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#E8E5DF]">
          <div>
            <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-white border border-[#E8E5DF] mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6900]" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#FF6900] font-bold">
                Client &amp; Academic Endorsements
              </span>
            </div>
            <h2 className="text-[34px] sm:text-[42px] font-extrabold text-[#111318] tracking-tight">
              Words From Collaborators
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#5A606D] max-w-xl leading-relaxed">
              Authentic feedback from instructors, studio partners, and project collaborators.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 rounded-full border border-[#E8E5DF] bg-white hover:bg-[#FAF8F5] px-5 py-2.5 text-xs font-semibold tracking-wide text-[#111318] transition-all whitespace-nowrap shrink-0 self-start md:self-auto shadow-xs cursor-pointer"
          >
            <Plus className="h-4 w-4 text-[#FF6900]" />
            <span>Add Recommendation</span>
          </button>
        </div>

        {/* 3-Column Modern Testimonials Spread */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <blockquote
              key={t.id}
              className="flex flex-col justify-between rounded-[24px] border border-[#E8E5DF] bg-white p-7 shadow-xs hover:shadow-md transition-all duration-200"
            >
              <div>
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1 mb-4 text-[#FF6900]">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-[14px] text-[#5A606D] leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="mt-6 pt-4 border-t border-[#F0ECE5] flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#FFF2E5] text-[#FF6900] font-bold flex items-center justify-center text-xs">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <cite className="font-bold text-[14px] not-italic text-[#111318] block leading-tight">
                    {t.author}
                  </cite>
                  <span className="text-[12px] text-[#717684]">
                    {t.role}
                    {t.company ? ` • ${t.company}` : ''}
                  </span>
                </div>
              </div>
            </blockquote>
          ))}
        </div>
      </div>

      {/* Add Recommendation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-[24px] bg-white p-7 shadow-2xl border border-[#E8E5DF]">
            <div className="flex items-center justify-between border-b border-[#F0ECE5] pb-3 mb-4">
              <h3 className="text-lg font-bold text-[#111318]">Add Client Recommendation</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full text-[#717684] hover:bg-[#F5F3EF]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitted ? (
              <div className="py-8 text-center text-[#10B981] font-semibold flex flex-col items-center gap-2">
                <Check className="h-8 w-8" />
                <span>Thank you! Recommendation added successfully.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#5A606D] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Asad Rehman"
                    className="w-full rounded-xl border border-[#DDD7CD] bg-[#FAF8F5] px-3.5 py-2 text-sm text-[#111318] focus:border-[#FF6900] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#5A606D] mb-1">
                      Role / Title
                    </label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Project Lead"
                      className="w-full rounded-xl border border-[#DDD7CD] bg-[#FAF8F5] px-3.5 py-2 text-sm text-[#111318] focus:border-[#FF6900] focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-[#5A606D] mb-1">
                      Organization
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Media Studio"
                      className="w-full rounded-xl border border-[#DDD7CD] bg-[#FAF8F5] px-3.5 py-2 text-sm text-[#111318] focus:border-[#FF6900] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#5A606D] mb-1">
                    Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-1 rounded transition-colors ${
                          star <= rating ? 'text-[#FF6900]' : 'text-neutral-300'
                        }`}
                      >
                        <Star className="h-5 w-5 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#5A606D] mb-1">
                    Endorsement Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    placeholder="Share your experience working with Munazza..."
                    className="w-full rounded-xl border border-[#DDD7CD] bg-[#FAF8F5] px-3.5 py-2 text-sm text-[#111318] focus:border-[#FF6900] focus:bg-white focus:outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#F0ECE5]">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-full border border-[#DDD7CD] text-xs font-semibold text-[#5A606D] hover:bg-[#F5F3EF]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 rounded-full bg-[#111318] text-white text-xs font-semibold hover:bg-[#232730] transition-colors"
                  >
                    {loading ? 'Submitting...' : 'Post Recommendation'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
