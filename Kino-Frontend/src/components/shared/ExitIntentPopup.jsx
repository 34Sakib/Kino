import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, CheckCircle, Copy, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const ExitIntentPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: Email capture, 2: Reveal Code
  const [email, setEmail] = useState('');
  
  useEffect(() => {
    // Check if dismissed before
    const isDismissed = localStorage.getItem('kino-exit-intent-dismissed');
    if (isDismissed) return;

    const handleMouseLeave = (e) => {
      // Trigger when mouse moves above viewport (clientY < 15)
      if (e.clientY < 15) {
        setIsOpen(true);
        // Remove listener after first trigger to prevent repeatedly pestering
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    localStorage.setItem('kino-exit-intent-dismissed', 'true');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setStep(2);
      toast.success('Discount activated!');
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('GOLDEN');
    toast.success('Promo code copied!');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="absolute inset-0 bg-[#0D0D0D]/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative bg-white w-full max-w-md rounded-sm shadow-2xl p-8 z-10 text-center overflow-hidden border border-black/5"
            style={{ backgroundColor: '#FFFFFF' }}
          >
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-1 hover:bg-black/5 rounded-full text-text-muted hover:text-text-dark transition-colors"
            >
              <X size={16} />
            </button>

            {step === 1 ? (
              /* Step 1: Capture Email */
              <form onSubmit={handleSubmit} className="flex flex-col items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-accent-gold/10 text-accent-gold flex items-center justify-center mb-1">
                  <Mail size={20} />
                </div>
                
                <span className="text-[0.65rem] uppercase tracking-[0.25em] font-bold text-accent-gold font-price-label">
                  Before you depart
                </span>

                <h3 className="font-editorial text-3xl font-bold text-text-dark leading-tight">
                  Unlock 10% Off <br />
                  <span className="italic text-accent-gold font-medium">Your First Piece</span>
                </h3>

                <p className="text-xs text-text-muted leading-relaxed max-w-sm">
                  Join our Lookbook Journal to claim your private discount code, with premium doorstep delivery options now available across Bangladesh.
                </p>

                <div className="flex flex-col gap-2 w-full mt-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="py-2.5 px-3 text-sm rounded-sm border border-black/10 focus:border-accent-gold w-full text-center"
                  />
                  <button
                    type="submit"
                    className="btn-gold justify-center py-2.5 font-bold tracking-widest text-xs uppercase w-full text-center"
                  >
                    Unlock Discount
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleDismiss}
                  className="text-[0.65rem] text-text-muted hover:text-text-dark uppercase tracking-widest font-bold mt-1"
                >
                  No thanks, I prefer full price
                </button>
              </form>
            ) : (
              /* Step 2: Show Promo Code */
              <div className="flex flex-col items-center gap-5 animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 border border-green-200 flex items-center justify-center mb-1">
                  <CheckCircle size={20} />
                </div>

                <span className="text-[0.65rem] uppercase tracking-[0.25em] font-bold text-accent-gold font-price-label">
                  Welcome to the studio
                </span>

                <h3 className="font-editorial text-3xl font-bold text-text-dark leading-tight">
                  Your Access Code
                </h3>

                <p className="text-xs text-text-muted leading-relaxed">
                  Apply this private code during checkout to deduct 10% off your entire selection.
                </p>

                {/* Promo Code Box */}
                <div className="flex items-center justify-between border border-dashed border-accent-gold rounded-sm p-4 w-full bg-bg-light/30 mt-2">
                  <span className="font-price-label text-xl font-bold text-text-dark tracking-widest">
                    GOLDEN
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="text-xs text-accent-gold hover:text-accent-gold-hover font-bold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <Copy size={12} /> Copy
                  </button>
                </div>

                <button
                  onClick={handleDismiss}
                  className="bg-black text-white hover:bg-accent-gold hover:text-black transition-colors w-full py-2.5 font-bold text-xs uppercase tracking-widest mt-2 rounded-sm"
                >
                  Start Shopping
                </button>
              </div>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default ExitIntentPopup;
