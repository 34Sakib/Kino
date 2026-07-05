import React from 'react';

export const Badge = ({ children, variant = 'default', className = '' }) => {
  let badgeStyles = {
    backgroundColor: '#0D0D0D',
    color: '#FFFFFF',
  };

  if (variant === 'sale') {
    badgeStyles = {
      backgroundColor: '#E8B86D',
      color: '#0D0D0D',
    };
  } else if (variant === 'new') {
    badgeStyles = {
      backgroundColor: '#FFFFFF',
      color: '#0D0D0D',
      border: '1px solid #0D0D0D',
    };
  } else if (variant === 'soldout') {
    badgeStyles = {
      backgroundColor: '#6B6B6B',
      color: '#FFFFFF',
    };
  }

  return (
    <span
      className={`font-price-label text-xs uppercase tracking-wider px-2.5 py-1 font-semibold rounded-sm ${className}`}
      style={{
        display: 'inline-block',
        fontSize: '0.65rem',
        ...badgeStyles
      }}
    >
      {children}
    </span>
  );
};
