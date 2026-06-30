import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ANNOUNCEMENTS = [
  'Complimentary shipping on orders over $50',
  'Artisanal designs hand-sourced from Tuscan workshops',
  'Enter code ATELIER at checkout for 10% off your first purchase',
  'Sign up for our Lookbook for early capsule releases'
];

export const AnnouncementBar = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % ANNOUNCEMENTS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      className="w-full text-center py-2 px-4 z-50 select-none overflow-hidden relative"
      style={{
        backgroundColor: '#0D0D0D',
        color: '#FFFFFF',
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
          className="font-price-label text-white/90"
        >
          {ANNOUNCEMENTS[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
export default AnnouncementBar;
