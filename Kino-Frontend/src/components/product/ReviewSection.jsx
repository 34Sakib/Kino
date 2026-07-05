import React, { useState } from 'react';
import { StarRating } from '../shared/StarRating';
import { toast } from 'react-hot-toast';
import { Check } from 'lucide-react';

const INITIAL_REVIEWS_MOCK = [
  {
    id: 1,
    name: 'Alexandra K.',
    rating: 5,
    date: 'June 12, 2026',
    comment: 'Absolutely stunning finish. The textures are incredibly tactile and it elevates my bedside table design. Packaging was secure and beautiful.',
    verified: true
  },
  {
    id: 2,
    name: 'Marcus G.',
    rating: 4,
    date: 'May 28, 2026',
    comment: 'Beautiful design. The color is slightly more cream than white under warm lighting, but it matches my interior perfectly. Solid weight and feels premium.',
    verified: true
  }
];

export const ReviewSection = ({ productId }) => {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS_MOCK);
  const [newName, setNewName] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) {
      toast.error('Please fill in all review fields.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate delay
    setTimeout(() => {
      const addedReview = {
        id: Date.now(),
        name: newName,
        rating: newRating,
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        comment: newComment,
        verified: false
      };

      setReviews([addedReview, ...reviews]);
      setNewName('');
      setNewRating(5);
      setNewComment('');
      setIsSubmitting(false);
      toast.success('Thank you! Your review has been submitted.');
    }, 800);
  };

  const averageRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <div className="flex flex-col lg:flex-row gap-12 mt-8">
      {/* Left Column: Review Summary & Write Review Form */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        <div className="bg-bg-light/40 p-6 rounded-sm border border-solid border-black/5">
          <h4 className="font-editorial text-2xl font-bold mb-2">Customer Reviews</h4>
          <div className="flex items-center gap-3 mb-2">
            <span className="font-price-label text-4xl font-bold text-[#E8B86D]">
              {averageRating}
            </span>
            <div className="flex flex-col">
              <StarRating rating={parseFloat(averageRating)} size={16} />
              <span className="text-xs text-text-muted mt-1 font-price-label">Based on {reviews.length} reviews</span>
            </div>
          </div>
        </div>

        {/* Submit Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 border-t border-solid border-black/5 pt-6">
          <h5 className="font-editorial text-lg font-bold">Write a Review</h5>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-wider font-semibold text-text-muted">Rating</label>
            <StarRating
              rating={newRating}
              size={20}
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
              className="py-2 px-3 text-sm rounded-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs uppercase tracking-wider font-semibold text-text-muted">Review</label>
            <textarea
              required
              rows="4"
              placeholder="Share details of your experience with this piece"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="py-2 px-3 text-sm rounded-sm resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-gold justify-center py-2 text-xs font-bold text-center w-full mt-2"
          >
            {isSubmitting ? 'Submitting...' : 'Post Review'}
          </button>
        </form>
      </div>

      {/* Right Column: Review List */}
      <div className="w-full lg:w-2/3 flex flex-col gap-6">
        <h4 className="font-editorial text-xl font-bold uppercase tracking-wider border-b border-black/5 pb-2">
          Shared Logs ({reviews.length})
        </h4>

        <div className="flex flex-col gap-6 max-h-[600px] overflow-y-auto pr-2">
          {reviews.map((rev) => (
            <div key={rev.id} className="border-b border-solid border-black/5 pb-6 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-text-dark">{rev.name}</span>
                  {rev.verified && (
                    <span className="text-[0.6rem] uppercase tracking-wider font-bold text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                      <Check size={8} /> Verified Buyer
                    </span>
                  )}
                </div>
                <span className="text-xs text-text-muted font-price-label">{rev.date}</span>
              </div>

              <StarRating rating={rev.rating} size={12} />
              <p className="text-sm text-text-muted mt-1 leading-relaxed">{rev.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ReviewSection;
