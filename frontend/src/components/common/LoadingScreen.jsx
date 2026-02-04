import React from 'react';

/**
 * Componente LoadingScreen reutilizable
 * 
 * Props:
 * - title: string (ej: "AWI", "Cargando...")
 * - message: string (ej: "Por favor espera")
 * - variant: 'splash' | 'inline' (default: 'splash')
 */
export default function LoadingScreen({ 
  title = 'AWI', 
  message = 'Cargando...', 
  variant = 'splash' 
}) {
  if (variant === 'inline') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{message}</p>
        </div>
      </div>
    );
  }

  // Splash variant (por defecto)
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-white mb-4 animate-pulse">{title}</h1>
        <div className="flex justify-center gap-2">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
          <div 
            className="w-3 h-3 bg-white rounded-full animate-bounce" 
            style={{ animationDelay: '0.1s' }}
          ></div>
          <div 
            className="w-3 h-3 bg-white rounded-full animate-bounce" 
            style={{ animationDelay: '0.2s' }}
          ></div>
        </div>
      </div>
    </div>
  );
}