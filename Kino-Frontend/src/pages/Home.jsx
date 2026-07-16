import React, { useState, useEffect } from 'react';
import { Hero } from '../components/home/Hero';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { BrandStory } from '../components/home/BrandStory';
import { Bestsellers } from '../components/home/Bestsellers';
import { PromoBanner } from '../components/home/PromoBanner';
import { Newsletter } from '../components/home/Newsletter';
import { testimonials } from '../data/testimonials';
import { StarRating } from '../components/shared/StarRating';
import { ArrowRight } from 'lucide-react';
import api from '../utils/api';

const INSTA_IMAGES = [
  'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=400&h=400&q=80',
  'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=400&h=400&q=80'
];

export const Home = () => {
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);
  const [reviews, setReviews] = useState(testimonials);
  const [instaData, setInstaData] = useState(null);

  useEffect(() => {
    let active = true;
    
    api.get('/reviews')
      .then(res => {
        if (active && res && res.length > 0) {
          setReviews(res);
        }
      })
      .catch(err => console.error("Failed to load home testimonials:", err));

    api.get('/sections/instagram_feed')
      .then(res => {
        if (active) {
          setInstaData(res);
        }
      })
      .catch(err => console.error("Failed to load home instagram section:", err));

    return () => { active = false; };
  }, []);

  return (
    <div className="w-full">
      {/* 1. HERO */}
      <Hero />

      {/* 2. CATEGORY GRID */}
      <CategoryGrid />

      {/* 3. FEATURED PRODUCTS */}
      <FeaturedProducts />

      {/* 4. BRAND STORY */}
      <BrandStory />

      {/* 5. BESTSELLERS */}
      <Bestsellers />

      {/* 6. PROMO BANNER */}
      <PromoBanner />

      {/* 7. TESTIMONIALS / REVIEWS */}
      <section className="py-24 bg-white border-b border-black/5 text-center">
        <div className="container max-w-4xl flex flex-col items-center gap-6">
          <span className="text-[0.65rem] uppercase tracking-[0.25em] font-bold text-accent-gold font-price-label">
            Client Voices
          </span>
          <h2 className="font-editorial text-4xl md:text-5xl text-text-dark font-medium mb-4">
            Atelier Impressions
          </h2>
          
          {reviews.length > 0 && (
            <div className="min-h-[220px] flex flex-col items-center justify-center gap-4 py-4 animate-fade-in">
              <StarRating rating={reviews[activeReviewIdx].rating} size={18} className="justify-center" />
              
              <p className="font-editorial text-xl md:text-2xl italic text-text-dark max-w-2xl leading-relaxed">
                "{reviews[activeReviewIdx].content || reviews[activeReviewIdx].comment}"
              </p>

              <div className="flex items-center gap-3 mt-4">
                <img
                  src={reviews[activeReviewIdx].avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'}
                  alt={reviews[activeReviewIdx].name}
                  className="w-10 h-10 rounded-full object-cover border border-solid border-black/5"
                />
                <div className="text-left">
                  <p className="text-xs font-bold text-text-dark">{reviews[activeReviewIdx].name}</p>
                  <p className="text-[0.65rem] text-text-muted uppercase tracking-wider">{reviews[activeReviewIdx].role || 'Collector'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Carousel dots */}
          <div className="flex items-center gap-2 mt-4">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveReviewIdx(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeReviewIdx === idx ? 'w-6 bg-accent-gold' : 'bg-black/10 hover:bg-black/30'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 8. INSTAGRAM FEED visual strip */}
      <section className="w-full bg-[#0D0D0D] py-16 text-white overflow-hidden text-center relative">
        <div className="container mb-8 flex flex-col items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-gold"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          <span className="text-[0.65rem] uppercase tracking-[0.25em] font-bold text-accent-gold font-price-label">
            {instaData?.subtitle || 'Share Your Form'}
          </span>
          <h2 className="font-editorial text-3xl md:text-4xl text-white font-medium">
            {instaData?.title || '#KinoAtelier'}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-1.5 w-full px-1.5">
          {(instaData?.meta_data
            ? [
                instaData.meta_data.image_1,
                instaData.meta_data.image_2,
                instaData.meta_data.image_3,
                instaData.meta_data.image_4,
                instaData.meta_data.image_5
              ].filter(Boolean)
            : INSTA_IMAGES
          ).map((img, idx) => (
            <a
              key={idx}
              href={instaData?.meta_data?.instagram_link || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group block aspect-square overflow-hidden bg-black"
            >
              <img
                src={img}
                alt={`Client styled space photo ${idx + 1}`}
                className="w-full h-full object-cover opacity-80 group-hover:scale-103 group-hover:opacity-60 transition-all duration-700"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-xs uppercase tracking-widest font-semibold flex items-center gap-1 font-price-label">
                  View Post <ArrowRight size={10} />
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 9. NEWSLETTER */}
      <Newsletter />
    </div>
  );
};
export default Home;
