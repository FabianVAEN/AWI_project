import React from 'react';

/**
 * Componente Button reutilizable
 * 
 * Props:
 * - variant: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' (default: 'primary')
 * - size: 'sm' | 'md' | 'lg' (default: 'md')
 * - disabled: boolean (default: false)
 * - isLoading: boolean (default: false)
 * - onClick: function
 * - children: ReactNode
 * - className: string (clases adicionales)
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  isLoading = false,
  onClick,
  children,
  className = '',
  type = 'button',
  ...props
}) {
  // Estilos base
  const baseStyles = 'font-medium rounded-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';

  // Variantes de color
  const variantStyles = {
    primary: 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white focus:ring-emerald-500',
    secondary: 'bg-gray-500 hover:bg-gray-600 text-white focus:ring-gray-500',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500',
    success: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500',
    ghost: 'bg-transparent border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-100 focus:ring-gray-300'
  };

  // Tamaños
  const sizeStyles = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-6 py-2 text-base',
    lg: 'px-8 py-3 text-lg'
  };

  const finalClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={finalClassName}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          Cargando...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
