import React, { useState, useEffect } from 'react';
import { StarRating } from '../shared/StarRating';
import { toast } from 'react-hot-toast';
import { Check, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import api from '../../utils/api';

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
  const { user } = useUserStore();
  const [reviews, setReviews] = useState(INITIAL_REVIEWS_MOCK);
  const [loading, setLoading] = useState(true);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    api.get(`/products/${productId}/reviews`)
      .then(res => {
        if (active) {
          // If no reviews in DB, fall back to initial mock items for visual fullness
          setReviews(res.length > 0 ? res : INITIAL_REVIEWS_MOCK);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error("Failed to fetch product reviews:", err);
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [productId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error('Please write a review comment.');
      return;
    }

    setIsSubmitting(true);
    
    api.post(`/products/${productId}/reviews`, {
      rating: newRating,
      body: newComment.trim()
    })
      .then(res => {
        // Prepend new review
        setReviews(prev => [res.review, ...prev.filter(r => r.id !== 1 && r.id !== 2)]);
        setNewComment('');
        setNewRating(5);
        setIsSubmitting(false);
        toast.success(res.message || 'Your review has been published.');
      })
      .catch(err => {
        toast.error(err.message || 'Failed to publish review.');
        setIsSubmitting(false);
      });
  };

  const averageRating = reviews.length > 0 ? (
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  ).toFixed(1) : "5.0";

  return (
    <div className="flex flex-col lg:flex-row gap-12 mt-8 animate-fade-in">
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
        {user ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 border-t border-solid border-black/5 pt-6 animate-fade-in">
            <h5 className="font-editorial text-lg font-bold">Write a Review</h5>
            <p className="text-[0.65rem] text-text-muted uppercase tracking-wider">
              Posting as: <span className="font-bold text-text-dark">{user.name}</span>
            </p>
            
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
        ) : (
          <div className="border-t border-solid border-black/5 pt-6 text-center flex flex-col items-center gap-4 animate-fade-in">
            <Lock className="text-accent-gold" size={24} />
            <div>
              <h5 className="font-editorial text-base font-bold">Write a Review</h5>
              <p className="text-xs text-text-muted mt-1 leading-normal max-w-[240px] mx-auto">
                Only authenticated clients can share impressions of these curated works.
              </p>
            </div>
            <Link to="/account" className="btn-outline justify-center py-2 text-xs font-bold tracking-widest uppercase w-full">
              Sign In to Post
            </Link>
          </div>
        )}
      </div>

      {/* Right Column: Review List */}
      <div className="w-full lg:w-2/3 flex flex-col gap-6">
        <h4 className="font-editorial text-xl font-bold uppercase tracking-wider border-b border-black/5 pb-2">
          Shared Logs ({reviews.length})
        </h4>

        {loading ? (
          <div className="text-xs text-text-muted">Loading logs...</div>
        ) : (
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
        )}
      </div>
    </div>
  );
};
export default ReviewSection;
