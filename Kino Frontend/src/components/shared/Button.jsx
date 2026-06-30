import React from 'react';

export const Button = ({
  children,
  onClick,
  variant = 'gold',
  type = 'button',
  disabled = false,
  className = '',
  icon: Icon = null,
  fullWidth = false,
  ...props
}) => {
  let btnClass = 'btn-gold';
  if (variant === 'outline') btnClass = 'btn-outline';
  if (variant === 'dark') btnClass = 'btn-dark';
  if (variant === 'text') btnClass = 'btn-text';

  const fullWidthClass = fullWidth ? 'w-full justify-center' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${btnClass} ${fullWidthClass} ${className} ${disabled ? 'opacity-50 cursor-not-allowed transform-none' : ''}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        justifyContent: fullWidth ? 'center' : 'initial',
        width: fullWidth ? '100%' : 'auto',
      }}
      {...props}
    >
      {Icon && <Icon size={18} />}
      <span>{children}</span>
    </button>
  );
};
