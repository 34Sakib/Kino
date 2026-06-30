import React, { useState } from 'react';
import { useCartStore } from '../../store/cartStore';
import { Button } from '../shared/Button';
import { toast } from 'react-hot-toast';
import { Tag } from 'lucide-react';

export const CartSummary = ({ onCheckout }) => {
  const getTotal = useCartStore((state) => state.getTotal);
  const subtotal = getTotal();
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [activeCode, setActiveCode] = useState('');

  // Shipping logic
  const shippingThreshold = 50;
  const shippingCost = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 9.99;
  const discountAmount = subtotal * (discountPercent / 100);
  const total = subtotal - discountAmount + shippingCost;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();

    if (code === 'GOLDEN' || code === 'ATELIER') {
      setDiscountPercent(10);
      setActiveCode(code);
      setPromoCode('');
      toast.success('10% discount applied to order!');
    } else {
      toast.error('Invalid promo code.');
    }
  };

  const handleRemovePromo = () => {
    setDiscountPercent(0);
    setActiveCode('');
    toast.success('Promo code removed.');
  };

  return (
    <div className="bg-bg-light/50 p-6 rounded-sm border border-solid border-black/5 flex flex-col gap-5">
      <h3 className="font-editorial text-xl font-bold uppercase tracking-wider border-b border-black/5 pb-2">
        Order Summary
      </h3>

      <div className="flex flex-col gap-3 text-sm">
        <div className="flex justify-between">
          <span className="text-text-muted">Subtotal</span>
          <span className="font-bold text-text-dark font-price-label">${subtotal.toFixed(2)}</span>
        </div>

        {activeCode && (
          <div className="flex justify-between text-green-600 font-semibold">
            <span className="flex items-center gap-1.5">
              <Tag size={12} /> Discount ({activeCode})
              <button 
                onClick={handleRemovePromo}
                className="text-[0.65rem] underline text-red-500 hover:text-red-700 ml-1"
              >
                Remove
              </button>
            </span>
            <span className="font-price-label">-${discountAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-text-muted">Shipping</span>
          <span className="font-bold text-text-dark font-price-label">
            {shippingCost === 0 ? 'Complimentary' : `$${shippingCost.toFixed(2)}`}
          </span>
        </div>

        {shippingCost > 0 && (
          <p className="text-[0.65rem] text-accent-gold font-bold uppercase tracking-wide">
            Add ${(shippingThreshold - subtotal).toFixed(2)} more for free shipping!
          </p>
        )}
      </div>

      {/* Promo Code Input */}
      <form onSubmit={handleApplyPromo} className="flex gap-2 border-t border-black/5 pt-4">
        <input
          type="text"
          placeholder="PROMO CODE"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          className="py-1.5 px-3 text-xs uppercase tracking-wider rounded-sm flex-1"
        />
        <button
          type="submit"
          className="bg-black text-white hover:bg-accent-gold hover:text-black transition-colors px-4 py-1.5 text-xs font-bold uppercase"
        >
          Apply
        </button>
      </form>

      {/* Total Display */}
      <div className="flex justify-between items-baseline border-t border-black/5 pt-4 mt-1">
        <span className="text-sm uppercase tracking-wider font-bold">Est. Total</span>
        <span className="text-xl font-bold font-price-label text-accent-gold">
          ${total.toFixed(2)}
        </span>
      </div>

      {onCheckout && (
        <Button
          onClick={() => onCheckout({ total, subtotal, discount: discountAmount, shipping: shippingCost, code: activeCode })}
          variant="gold"
          fullWidth
          disabled={subtotal === 0}
          className="py-3 font-bold mt-2"
        >
          Continue to Checkout
        </Button>
      )}
    </div>
  );
};
export default CartSummary;
