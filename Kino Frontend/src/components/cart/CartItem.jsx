import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

export const CartItem = ({ item }) => {
  const { updateQty, removeItem } = useCartStore();

  const handleQtyChange = (newQty) => {
    updateQty(item.id, item.selectedColor?.name, item.selectedSize, newQty);
  };

  const handleRemove = () => {
    removeItem(item.id, item.selectedColor?.name, item.selectedSize);
  };

  return (
    <div className="flex gap-4 py-4 border-b border-solid border-black/5 items-center justify-between">
      {/* Item Image */}
      <img
        src={item.images[0]}
        alt={item.name}
        className="w-16 h-20 object-cover bg-bg-light rounded-sm flex-shrink-0"
      />

      {/* Description */}
      <div className="flex-1 min-w-0">
        <h4 className="font-editorial text-sm font-bold text-text-dark truncate">
          {item.name}
        </h4>
        
        {/* Selected variants info */}
        <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5 text-[0.7rem] text-text-muted">
          {item.selectedColor && (
            <span className="flex items-center gap-1">
              <span 
                className="w-2.5 h-2.5 rounded-full inline-block border border-black/5" 
                style={{ backgroundColor: item.selectedColor.hex }}
              />
              {item.selectedColor.name}
            </span>
          )}
          {item.selectedSize && (
            <span>• Size: {item.selectedSize}</span>
          )}
        </div>

        {/* Stepper (Quantity controls) */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center border border-black/10 rounded-sm">
            <button
              onClick={() => handleQtyChange(item.qty - 1)}
              className="px-2 py-1 text-text-dark hover:bg-black/5"
              type="button"
            >
              <Minus size={10} />
            </button>
            <span className="px-2.5 text-xs font-bold font-price-label">
              {item.qty}
            </span>
            <button
              onClick={() => handleQtyChange(item.qty + 1)}
              className="px-2 py-1 text-text-dark hover:bg-black/5"
              type="button"
            >
              <Plus size={10} />
            </button>
          </div>
        </div>
      </div>

      {/* Price & Delete */}
      <div className="flex flex-col items-end gap-2">
        <span className="font-bold text-sm font-price-label text-accent-gold">
          ${(item.price * item.qty).toFixed(2)}
        </span>
        <button
          onClick={handleRemove}
          className="text-text-muted hover:text-red-500 p-1 transition-colors"
          type="button"
        >
          <Trash2 size={14} />
        </button>
      </div>

    </div>
  );
};
export default CartItem;
