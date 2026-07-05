import React, { useState } from 'react';

export const StarRating = ({
  rating = 5,
  count = null,
  size = 16,
  interactive = false,
  onChange = null,
  className = ''
}) => {
  const [hoverRating, setHoverRating] = useState(null);

  const handleClick = (value) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(null);
    }
  };

  const displayRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = displayRating >= star;
          const isHalf = !isFilled && displayRating >= star - 0.5;

          return (
            <svg
              key={star}
              onClick={() => handleClick(star)}
              onMouseEnter={() => handleMouseEnter(star)}
              onMouseLeave={handleMouseLeave}
              className={`cursor-${interactive ? 'pointer' : 'default'} transition-all`}
              width={size}
              height={size}
              viewBox="0 0 24 24"
              fill={isFilled ? '#E8B86D' : isHalf ? 'url(#half-gold)' : 'none'}
              stroke="#E8B86D"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isHalf && (
                <defs>
                  <linearGradient id="half-gold">
                    <stop offset="50%" stopColor="#E8B86D" />
                    <stop offset="50%" stopColor="transparent" stopOpacity="1" />
                  </linearGradient>
                </defs>
              )}
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          );
        })}
      </div>
      
      {count !== null && (
        <span className="text-xs text-6b6b6b font-price-label tracking-wide">
          ({count})
        </span>
      )}
    </div>
  );
};
