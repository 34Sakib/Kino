import React from 'react';

export const ColorSelector = ({ colors, selectedColor, onSelect }) => {
  if (!colors || colors.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider font-semibold text-text-muted">
          Color: <span className="text-text-dark font-bold font-price-label">{selectedColor?.name || colors[0]?.name}</span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        {colors.map((color) => {
          const isSelected = selectedColor?.name === color.name;
          return (
            <button
              key={color.name}
              type="button"
              onClick={() => onSelect(color)}
              className={`w-7 h-7 rounded-full transition-all duration-300 relative ${
                isSelected 
                  ? 'ring-2 ring-accent-gold ring-offset-2 scale-105' 
                  : 'hover:scale-105 border border-solid border-black/10'
              }`}
              style={{
                backgroundColor: color.hex,
                boxShadow: isSelected ? '0 0 10px rgba(232, 184, 109, 0.4)' : 'none'
              }}
              title={color.name}
            />
          );
        })}
      </div>
    </div>
  );
};
export default ColorSelector;
