import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { CartItem } from './CartItem';
import { Button } from '../shared/Button';

export const CartDrawer = () => {
  const navigate = useNavigate();
  
  // Zustand State hooks
  const isOpen = useCartStore((state) => state.isDrawerOpen);
  const closeDrawer = useCartStore((state) => state.closeDrawer);
  const items = useCartStore((state) => state.items);
  const getSubtotal = useCartStore((state) => state.getTotal);
  const getCount = useCartStore((state) => state.getCount);

  const subtotal = getSubtotal();
  const count = getCount();

  // Free shipping bar computations
  const shippingThreshold = 50;
  const progressPercent = Math.min((subtotal / shippingThreshold) * 100, 100);
  const amountToFreeShipping = Math.max(shippingThreshold - subtotal, 0);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleCheckoutClick = () => {
    closeDrawer();
    navigate('/checkout');
  };

  const handleViewCartClick = () => {
    closeDrawer();
    navigate('/cart');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          
          {/* Blur Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="absolute inset-0 bg-[#0D0D0D]/40 backdrop-blur-xs"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
            className="relative w-full max-w-[450px] h-full bg-white shadow-2xl flex flex-col justify-between z-10"
            style={{ backgroundColor: '#FFFFFF', borderLeft: '1px solid rgba(0,0,0,0.05)' }}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-solid border-black/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-accent-gold" />
                <h3 className="font-editorial text-lg font-bold uppercase tracking-wide">
                  Shopping Bag ({count})
                </h3>
              </div>
              <button
                onClick={closeDrawer}
                className="p-1 hover:bg-black/5 rounded-full transition-colors text-text-dark"
              >
                <X size={18} />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            {items.length > 0 && (
              <div className="bg-bg-light/40 px-6 py-3 border-b border-solid border-black/5 flex flex-col gap-2">
                <p className="text-[0.65rem] uppercase tracking-wider font-semibold text-text-muted">
                  {amountToFreeShipping > 0 ? (
                    <span>
                      Spend <span className="font-bold text-accent-gold font-price-label">${amountToFreeShipping.toFixed(2)}</span> more for complimentary shipping
                    </span>
                  ) : (
                    <span className="text-green-600 font-bold">You qualify for complimentary shipping!</span>
                  )}
                </p>
                <div className="w-full h-1 bg-black/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent-gold transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-2">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                  <ShoppingBag size={48} strokeWidth={1} className="text-text-muted/40 animate-float" />
                  <div>
                    <p className="font-editorial text-lg italic text-text-muted">Your bag is currently empty.</p>
                    <button
                      onClick={closeDrawer}
                      className="text-xs uppercase tracking-widest text-accent-gold font-bold hover:underline mt-2"
                    >
                      Browse Collection
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col">
                  {items.map((item) => (
                    <CartItem key={`${item.id}-${item.selectedColor?.name || 'none'}-${item.selectedSize || 'none'}`} item={item} />
                  ))}
                </div>
              )}
            </div>

            {/* Footer Summary & CTAs */}
            {items.length > 0 && (
              <div className="px-6 py-6 border-t border-solid border-black/5 bg-white">
                <div className="flex justify-between items-baseline mb-4">
                  <span className="text-xs uppercase tracking-wider font-semibold text-text-muted">Estimated Subtotal</span>
                  <span className="text-lg font-bold font-price-label text-accent-gold">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                
                <p className="text-[0.65rem] text-text-muted mb-4 leading-normal">
                  Shipping fees and discount promo codes are applied during checkout.
                </p>

                <div className="flex flex-col gap-2.5">
                  <Button
                    onClick={handleCheckoutClick}
                    variant="gold"
                    fullWidth
                    className="py-3 font-bold"
                  >
                    Checkout
                  </Button>
                  <button
                    onClick={handleViewCartClick}
                    className="w-full py-2.5 text-xs font-bold uppercase tracking-wider text-center text-text-dark hover:bg-black/5 transition-colors duration-300"
                  >
                    View Detailed Bag
                  </button>
                </div>
              </div>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default CartDrawer;
