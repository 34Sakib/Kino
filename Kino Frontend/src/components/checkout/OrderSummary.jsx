import React from 'react';
import { useCartStore } from '../../store/cartStore';

export const OrderSummary = ({ pricingInfo }) => {
  const items = useCartStore((state) => state.items);

  const subtotal = pricingInfo?.subtotal || 0;
  const shipping = pricingInfo?.shipping || 0;
  const discount = pricingInfo?.discount || 0;
  const total = pricingInfo?.total || 0;
  const promoCode = pricingInfo?.code || '';

  return (
    <div className="bg-bg-light/40 p-6 rounded-sm border border-solid border-black/5 flex flex-col gap-6 sticky top-24">
      <h3 className="font-editorial text-lg font-bold uppercase tracking-wider border-b border-black/5 pb-2">
        Your Order
      </h3>

      {/* Product list */}
      <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={`${item.id}-${item.selectedColor?.name || 'none'}-${item.selectedSize || 'none'}`} className="flex gap-3 items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex-shrink-0">
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-12 h-16 object-cover bg-white border border-black/5 rounded-xs"
                />
                <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[0.55rem] font-bold w-4 h-4 rounded-full flex items-center justify-center font-price-label">
                  {item.qty}
                </span>
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-text-dark truncate leading-tight">
                  {item.name}
                </h4>
                <p className="text-[0.65rem] text-text-muted mt-0.5 font-price-label">
                  {item.selectedSize && `Size: ${item.selectedSize}`}
                  {item.selectedColor && ` / Color: ${item.selectedColor.name}`}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-text-dark font-price-label">
              ${(item.price * item.qty).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Calculations */}
      <div className="border-t border-black/5 pt-4 flex flex-col gap-2.5 text-xs">
        <div className="flex justify-between">
          <span className="text-text-muted">Subtotal</span>
          <span className="font-bold text-text-dark font-price-label">${subtotal.toFixed(2)}</span>
        </div>

        {promoCode && (
          <div className="flex justify-between text-green-600 font-semibold">
            <span>Promo Code ({promoCode})</span>
            <span className="font-price-label">-${discount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-text-muted">Shipping</span>
          <span className="font-bold text-text-dark font-price-label">
            {shipping === 0 ? 'Complimentary' : `$${shipping.toFixed(2)}`}
          </span>
        </div>

        <div className="flex justify-between items-baseline border-t border-black/5 pt-4 mt-1">
          <span className="text-xs uppercase tracking-wider font-bold">Total due</span>
          <span className="text-lg font-bold font-price-label text-accent-gold">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};
export default OrderSummary;
