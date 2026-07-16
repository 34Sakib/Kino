import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '../shared/Button';
import api from '../../utils/api';

export const Hero = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState({
    title: 'Sculptural <br /> <span class="italic text-accent-gold font-medium">Silent</span> Form',
    subtitle: 'Kino Atelier — Collection 04',
    description: 'Elevating architectural spaces with curated interior pieces, handcrafted from single-source raw travertine, white oak, and fluted earthenware.',
    cta_text: 'Shop Now',
    cta_link: '/shop',
    image_url: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1600&q=80',
    meta_data: {
      explore_text: 'Explore Collection',
      explore_link: '/about',
      active_spaces_count: 'Over 12,847 happy spaces curated globally'
    }
  });

  useEffect(() => {
    let active = true;
    api.get('/sections/home_hero')
      .then(res => {
        if (active && res) {
          setContent(res);
        }
      })
      .catch(err => console.error("Failed to load hero content:", err));
    return () => { active = false; };
  }, []);

  const scrollToCollection = () => {
    const section = document.getElementById('featured-collection');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      className="relative w-full min-h-screen bg-[#0D0D0D] flex items-center justify-center overflow-hidden py-24 select-none"
    >
      {/* Background Image overlay with premium gradient */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img
          initial={{ scale: 1.06, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 3, ease: 'easeOut' }}
          src={content.image_url}
          alt="Luxury living space design background"
          className="w-full h-full object-cover filter brightness-[0.8] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="container relative z-10 w-full text-center md:text-left flex flex-col items-center md:items-start gap-6">
        
        {/* Animated Tagline */}
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-accent-gold text-xs font-bold uppercase tracking-[0.3em] font-price-label"
        >
          {content.subtitle}
        </motion.span>

        {/* 2-4 Words Bold Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-editorial text-5xl md:text-7xl lg:text-8xl text-white font-light tracking-wide leading-[1.05] max-w-4xl"
          dangerouslySetInnerHTML={{ __html: content.title }}
        />

        {/* Social Proof Counter */}
        {content.meta_data?.active_spaces_count && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="text-accent-gold text-xs font-bold uppercase tracking-wider font-price-label flex items-center gap-1.5"
          >
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            {content.meta_data.active_spaces_count}
          </motion.p>
        )}

        {/* Value Prop Subline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-white/60 text-sm md:text-base max-w-lg font-light leading-relaxed mt-2"
        >
          {content.description}
        </motion.p>

        {/* Two CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-6 w-full sm:w-auto"
        >
          <Button
            onClick={() => navigate(content.cta_link)}
            variant="gold"
            icon={ArrowRight}
            className="w-full sm:w-auto font-bold tracking-widest px-8"
          >
            {content.cta_text}
          </Button>
          {content.meta_data?.explore_text && (
            <button
              onClick={() => navigate(content.meta_data.explore_link || '/about')}
              className="w-full sm:w-auto btn-outline-white font-bold tracking-widest px-8"
            >
              {content.meta_data.explore_text}
            </button>
          )}
        </motion.div>

        {/* Press logos strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-8 pt-6 border-t border-solid border-white/10 flex flex-wrap items-center gap-x-8 gap-y-3 justify-center md:justify-start w-full opacity-50 text-white/70 text-[0.6rem] uppercase tracking-[0.2em]"
        >
          <span className="font-bold text-accent-gold">Featured In:</span>
          <span className="font-editorial text-xs font-bold">VOGUE</span>
          <span className="font-editorial text-xs font-bold">ARCHITECTURAL DIGEST</span>
          <span className="font-editorial text-xs font-bold">ELLE DECOR</span>
          <span className="font-editorial text-xs font-bold">WALLPAPER*</span>
        </motion.div>

      </div>

      {/* Scroll Down indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        onClick={scrollToCollection}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[0.65rem] uppercase tracking-[0.25em] text-white/40 font-price-label">Scroll to browse</span>
        <div className="w-5 h-9 border border-solid border-white/20 rounded-full flex justify-center p-1.5">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="w-1 h-2 bg-accent-gold rounded-full"
          />
        </div>
      </motion.div>

    </section>
  );
};
export default Hero;
