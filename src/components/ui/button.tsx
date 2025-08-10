import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'default', className = '', ...props }) => {
  const base = 'px-4 py-2 rounded font-semibold focus:outline-none';
  const variants: Record<string, string> = {
    default: 'bg-green-500 text-white hover:bg-green-600',
    ghost: 'bg-transparent text-green-700 hover:bg-green-100',
  };
  return (
    <button className={`${base} ${variants[variant] || ''} ${className}`} {...props} />
  );
};
