import React, { useState } from 'react';
import { testimonials } from '../data/testimonials';
import { StarRating } from '../components/shared/StarRating';
import { Button } from '../components/shared/Button';
import { toast } from 'react-hot-toast';
import { CheckCircle, Award } from 'lucide-react';

const PRESS_REVIEWS = [
  { publisher: 'Architectural Digest', quote: 'Kino Atelier has defined the new standard of silent structural forms inside residential interior aesthetics.', rating: 5 },
  { publisher: 'Vogue Living', quote: 'Handcrafted travertine vessels that command a room without speaking. Heirloom designs built to survive centuries.', rating: 5 },
  { publisher: 'Wallpaper*', quote: 'Clean, tapered oak joinery and wheel-thrown clay dropping lamps that bring unparalleled tactile warmth.', rating: 5 }
];

export const ReviewsPage = () => {
  const [reviewsList, setReviewsList] = useState([
    { id: 101, name: 'Valerie H.', rating: 5, date: 'June 26, 2026', comment: 'The travertine vessel is incredibly heavy and beautiful. Natural imperfections make it completely unique. Fast shipping to London.' },
    { id: 102, name: 'Adrian T.', rating: 5, date: 'June 22, 2026', comment: 'Nordic Oak Writing Desk drawers are smooth and felt-lined. Joinery details are flawless. Completely changes my office mood.' },
    { id: 103, name: 'Clara M.', rating: 4, date: 'June 18, 2026', comment: 'Linen sheets are cool and drape beautifully. They crease naturally as expected. Packaging came inside a premium organic cotton sack.' }
  ]);

  const [newName, setNewName] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) {
      toast.error('Please complete your review details.');
      return;
    }

    const addedReview = {
      id: Date.now(),
      name: newName,
      rating: newRating,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      comment: newComment
    };

    setReviewsList([addedReview, ...reviewsList]);
    setNewName('');
    setNewRating(5);
    setNewComment('');
    toast.success('Your review has been published.');
  };

  const aggregateRating = (
    (reviewsList.reduce((sum, r) => sum + r.rating, 0) + testimonials.reduce((sum, t) => sum + t.rating, 0)) /
    (reviewsList.length + testimonials.length)
  ).toFixed(1);

  const totalCount = reviewsList.length + testimonials.length;

  return (
    <div className="pt-28 pb-20 bg-white min-h-screen select-none animate-fade-in">
      <div className="container max-w-5xl">
        
        {/* Title */}
        <div className="mb-12 text-center flex flex-col items-center gap-2">
          <span className="text-[0.65rem] uppercase tracking-[0.25em] font-bold text-accent-gold font-price-label">
            Social Proof Logs
          </span>
          <h1 className="font-editorial text-4xl md:text-5xl font-medium text-text-dark">
            Studio Impressions
          </h1>
          <div className="w-12 h-[1px] bg-accent-gold mt-4" />
        </div>

        {/* Core aggregate metrics banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-bg-light/40 border border-solid border-black/5 rounded-sm p-8 mb-16 text-center md:text-left items-center justify-between">
          <div className="flex flex-col gap-2 items-center md:items-start">
            <span className="text-[0.65rem] uppercase tracking-wider font-bold text-text-muted">Client Rating</span>
            <div className="flex items-baseline gap-2">
              <span className="font-price-label text-5xl font-extrabold text-text-dark">{aggregateRating}</span>
              <span className="text-xl text-text-muted">/ 5.0</span>
            </div>
            <StarRating rating={parseFloat(aggregateRating)} size={16} />
            <span className="text-[0.65rem] text-text-muted font-price-label mt-1">Based on {totalCount} verified buyers</span>
          </div>

          <div className="flex items-start gap-4 text-left border-t md:border-t-0 md:border-l md:border-r border-black/5 py-6 md:py-0 md:px-8">
            <Award size={28} className="text-accent-gold mt-1 flex-shrink-0" />
            <div className="flex flex-col gap-1 text-xs text-text-muted">
              <h4 className="font-bold text-text-dark uppercase tracking-wider">Certified Handcrafted</h4>
              <p className="leading-normal">
                Every customer review log maps to a unique, verified purchase order dispatched from Tuscany or Copenhagen.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end justify-center gap-2">
            <CheckCircle className="text-green-600 mb-1" size={28} />
            <span className="font-price-label text-2xl font-bold text-text-dark">12,847+</span>
            <span className="text-[0.65rem] uppercase tracking-wider font-bold text-text-muted">Spaces curated globally</span>
          </div>
        </div>

        {/* Press Column reviews */}
        <div className="mb-16">
          <h3 className="font-editorial text-2xl font-bold uppercase tracking-wider border-b border-black/5 pb-2 mb-8">
            Press Logs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRESS_REVIEWS.map((press, idx) => (
              <div key={idx} className="border border-solid border-black/5 p-6 rounded-sm bg-white flex flex-col gap-3.5">
                <span className="font-editorial text-base font-bold text-accent-gold tracking-wide">
                  {press.publisher}
                </span>
                <p className="text-xs italic text-text-muted leading-relaxed flex-1">
                  "{press.quote}"
                </p>
                <StarRating rating={press.rating} size={10} />
              </div>
            ))}
          </div>
        </div>

        {/* Grid Reviews & Submit Form Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-black/5 pt-16">
          
          {/* Write review Form */}
          <div className="lg:col-span-1">
            <form onSubmit={handleSubmitReview} className="flex flex-col gap-4 sticky top-24 bg-bg-light/30 border border-solid border-black/5 p-6 rounded-sm">
              <h3 className="font-editorial text-xl font-bold uppercase tracking-wider">Leave a Review</h3>
              
              <div className="flex flex-col gap-1.5 mt-2">
                <label className="text-xs uppercase tracking-wider font-semibold text-text-muted">Rating</label>
                <StarRating
                  rating={newRating}
                  size={18}
                  interactive={true}
                  onChange={(val) => setNewRating(val)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-text-muted">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="py-2 px-3 text-xs rounded-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-text-muted">Comment</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Describe your tactile experience..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="py-2 px-3 text-xs rounded-sm resize-none"
                />
              </div>

              <Button
                type="submit"
                variant="gold"
                fullWidth
                className="py-2 text-xs font-bold uppercase mt-1"
              >
                Publish Review
              </Button>
            </form>
          </div>

          {/* Reviews logs list */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <h3 className="font-editorial text-xl font-bold uppercase tracking-wider border-b border-black/5 pb-2">
              Buyer logs ({totalCount})
            </h3>
            
            <div className="flex flex-col gap-6">
              {reviewsList.map((rev) => (
                <div key={rev.id} className="border-b border-solid border-black/5 pb-5 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-text-dark">{rev.name}</span>
                    <span className="text-text-muted font-price-label">{rev.date}</span>
                  </div>
                  <StarRating rating={rev.rating} size={10} />
                  <p className="text-xs text-text-muted leading-relaxed">{rev.comment}</p>
                </div>
              ))}

              {testimonials.map((t) => (
                <div key={t.id} className="border-b border-solid border-black/5 pb-5 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-text-dark">{t.name}</span>
                    <span className="text-text-muted font-price-label">verified</span>
                  </div>
                  <StarRating rating={t.rating} size={10} />
                  <p className="text-xs text-text-muted leading-relaxed">{t.content}</p>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
export default ReviewsPage;
