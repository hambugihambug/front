import React from 'react';

export function Badge({ 
  children, 
  variant = 'default', 
  className = '',
  ...props 
}) {
  const baseStyle = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
    secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
    outline: 'text-foreground',
  };
  
  const variantStyle = variants[variant] || variants.default;
  
  return (
    <div 
      className={`${baseStyle} ${variantStyle} ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
}