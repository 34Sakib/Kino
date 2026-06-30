import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X } from 'lucide-react';

const RECENT_SALES = [
  { name: 'Sarah from London', product: 'Travertine Sculpture Vessel', time: '3 minutes ago' },
  { name: 'William from Milan', product: 'Atelier Oak Lounge Chair', time: '12 minutes ago' },
  { name: 'Oliver from Copenhagen', product: 'Nordic Oak Writing Desk', time: '45 minutes ago' },
  { name: 'Charlotte from Paris', product: 'Pure Flax Linen Bedding', time: '1 hour ago' },
  { name: 'Elena from Tuscany', product: 'Artisan Ceramic Table Set', time: '2 hours ago' }
];

export const ActivityPopup = () => {
  const [activeSale, setActiveSale] = useState(null);
  const [salesIndex, setSalesIndex] = useState(0);

  useEffect(() => {
    // Wait 10 seconds before displaying the first notification
    const initialDelay = setTimeout(() => {
      setActiveSale(RECENT_SALES[0]);
    }, 10000);

    // Dynamic rotation interval
    const interval = setInterval(() => {
      setActiveSale(null); // Dismiss current first
      
      setTimeout(() => {
        setSalesIndex((prev) => {
          const nextIdx = (prev + 1) % RECENT_SALES.length;
          setActiveSale(RECENT_SALES[nextIdx]);
          return nextIdx;
        });
      }, 1000); // Small pause before next slide

    }, 25000); // Pop up every 25 seconds

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, []);

  const handleDismiss = () => {
    setActiveSale(null);
  };

  return (
    <AnimatePresence>
      {activeSale && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 260, damping: 25 }}
          className="fixed bottom-6 left-6 z-[99] bg-white border border-solid border-black/5 rounded-sm p-4 flex gap-3.5 items-center w-[320px] max-w-[calc(100vw-32px)]"
          style={{
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          }}
        >
          {/* Visual Shopping icon */}
          <div className="w-9 h-9 rounded-full bg-accent-gold/10 text-accent-gold flex items-center justify-center flex-shrink-0">
            <ShoppingBag size={16} />
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <p className="text-[0.65rem] text-text-muted uppercase tracking-wider font-semibold">
              Recent Purchase
            </p>
            <p className="text-xs font-bold text-text-dark truncate mt-0.5">
              {activeSale.name}
            </p>
            <p className="text-xs text-text-muted line-clamp-1 italic">
              Purchased {activeSale.product}
            </p>
            <p className="text-[0.6rem] text-accent-gold font-price-label font-bold mt-1 uppercase tracking-wide">
              {activeSale.time}
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-black/5 rounded-full text-text-muted hover:text-text-dark transition-colors self-start"
          >
            <X size={12} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default ActivityPopup;
