import React from 'react';

/**
 * Componente Card reutilizable
 * 
 * Props:
 * - title: string
 * - description: string
 * - children: ReactNode
 * - variant: 'default' | 'success' | 'error' | 'warning' (default: 'default')
 * - className: string
 */
export default function Card({
  title,
  description,
  children,
  variant = 'default',
  className = '',
  ...props
}) {
  const variantStyles = {
    default: 'bg-white border-gray-300',
    success: 'bg-green-50 border-green-300',
    error: 'bg-red-50 border-red-300',
    warning: 'bg-yellow-50 border-yellow-300'
  };

  return (
    <div
      className={`p-6 rounded-xl border-2 shadow-lg transition-all ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {title && (
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {title}
        </h3>
      )}
      
      {description && (
        <p className="text-gray-600 text-sm mb-4">
          {description}
        </p>
      )}
      
      {children}
    </div>
  );
}
