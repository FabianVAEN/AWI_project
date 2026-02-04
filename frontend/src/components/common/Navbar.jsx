import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthService from '../../services/authService';
import { Button } from './index';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    // Efecto para sincronizar estado de autenticación
    useEffect(() => {
        const updateAuthState = () => {
            setUser(AuthService.getUser());
            setIsAuthenticated(AuthService.isAuthenticated());
        };

        // Estado inicial
        updateAuthState();

        // Suscribirse a cambios
        const unsubscribe = AuthService.onAuthChange(updateAuthState);

        // Actualizar al cambiar ruta
        const handleRouteChange = () => {
            setShowDropdown(false);
            updateAuthState();
        };

        window.addEventListener('popstate', handleRouteChange);

        return () => {
            unsubscribe();
            window.removeEventListener('popstate', handleRouteChange);
        };
    }, []);

    // No mostrar navbar en páginas de auth si no está autenticado
    const showNavbar = !['/login', '/register'].includes(location.pathname) || isAuthenticated;

    const handleLogout = () => {
        if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            AuthService.logout();
        }
    };

    const handleProfileClick = () => {
        setShowDropdown(false);
        navigate('/perfil');
    };

    const handleSettingsClick = () => {
        setShowDropdown(false);
        navigate('/configuracion');
    };

    if (!showNavbar) {
        return null;
    }

    return (
        <nav className="bg-gradient-to-r from-emerald-600 to-cyan-600 shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                <span className="text-emerald-600 font-bold text-lg">A</span>
                            </div>
                            <span className="text-white text-xl font-bold hidden sm:inline">AWI Hábitos</span>
                        </Link>
                    </div>

                    {/* Menú de navegación */}
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                {/* Menú usuario autenticado */}
                                <div className="hidden md:flex items-center space-x-4">
                                    <Link 
                                        to="/" 
                                        className="text-white hover:text-emerald-100 px-3 py-2 rounded-md text-sm font-medium transition hover:bg-white/10"
                                    >
                                        Mis Hábitos
                                    </Link>
                                    <Link 
                                        to="/estadisticas" 
                                        className="text-white hover:text-emerald-100 px-3 py-2 rounded-md text-sm font-medium transition hover:bg-white/10"
                                    >
                                        Estadísticas
                                    </Link>
                                    <Link 
                                        to="/perfil" 
                                        className="text-white hover:text-emerald-100 px-3 py-2 rounded-md text-sm font-medium transition hover:bg-white/10"
                                    >
                                        Perfil
                                    </Link>
                                    {user?.es_admin && (
                                        <Link 
                                            to="/admin" 
                                            className="text-white hover:text-emerald-100 px-3 py-2 rounded-md text-sm font-medium transition hover:bg-white/10 bg-white/20"
                                        >
                                            Admin
                                        </Link>
                                    )}
                                </div>
                                
                                {/* Dropdown para móvil/avatar */}
                                <div className="relative">
                                    <button 
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        className="flex items-center space-x-2 text-white hover:text-emerald-100 focus:outline-none transition"
                                    >
                                        <div className="w-10 h-10 bg-emerald-800 rounded-full flex items-center justify-center border-2 border-white/30">
                                            <span className="font-semibold text-lg">
                                                {user?.username?.charAt(0).toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                        <span className="hidden md:inline font-medium">{user?.username || 'Usuario'}</span>
                                        <svg 
                                            className={`w-5 h-5 transition-transform ${showDropdown ? 'rotate-180' : ''}`} 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    
                                    {/* Dropdown menu */}
                                    {showDropdown && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200">
                                            <div className="px-4 py-3 border-b">
                                                <p className="text-sm font-semibold text-gray-900 truncate">{user?.username}</p>
                                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                            </div>
                                            
                                            <div className="py-1">
                                                <button
                                                    onClick={handleProfileClick}
                                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                                                >
                                                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    Mi Perfil
                                                </button>
                                                
                                                <button
                                                    onClick={handleSettingsClick}
                                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                                                >
                                                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    Configuración
                                                </button>
                                            </div>
                                            
                                            <div className="border-t py-1">
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                                                >
                                                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                    Cerrar Sesión
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            /* Menú usuario NO autenticado */
                            <div className="flex items-center space-x-3">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigate('/login')}
                                    className="!text-white !border-white hover:!bg-white/10"
                                >
                                    Iniciar Sesión
                                </Button>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => navigate('/register')}
                                >
                                    Registrarse
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Overlay para cerrar dropdown al hacer clic fuera */}
            {showDropdown && (
                <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowDropdown(false)}
                />
            )}
        </nav>
    );
}