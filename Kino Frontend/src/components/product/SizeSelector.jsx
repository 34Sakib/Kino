import React from 'react';
import { Ruler } from 'lucide-react';

export const SizeSelector = ({ sizes, selectedSize, onSelect, onOpenSizeGuide }) => {
  if (!sizes || sizes.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider font-semibold text-text-muted">
          Size: <span className="text-text-dark font-bold font-price-label">{selectedSize || sizes[0]}</span>
        </span>
        
        {onOpenSizeGuide && (
          <button
            type="button"
            onClick={onOpenSizeGuide}
            className="text-[0.7rem] uppercase tracking-wider font-semibold text-accent-gold hover:text-accent-gold-hover transition-colors flex items-center gap-1.5"
          >
            <Ruler size={12} /> Size Guide
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2.5">
        {sizes.map((size) => {
          const isSelected = selectedSize === size;
          return (
            <button
              key={size}
              type="button"
              onClick={() => onSelect(size)}
              className={`px-4 py-2 text-xs font-semibold tracking-wider font-price-label border rounded-sm transition-all duration-300 ${
                isSelected
                  ? 'bg-[#0D0D0D] text-white border-[#0D0D0D] scale-102 shadow-sm'
                  : 'bg-white text-text-dark border-black/10 hover:border-black/30'
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default SizeSelector;
