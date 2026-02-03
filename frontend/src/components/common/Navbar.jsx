import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthService from '../../services/authService';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = AuthService.getUser();
    const isAuthenticated = AuthService.isAuthenticated();

    // No mostrar navbar en páginas de auth si no está autenticado
    const showNavbar = !['/login', '/register'].includes(location.pathname) || isAuthenticated;

    const handleLogout = () => {
        AuthService.logout();
        navigate('/login');
    };

    if (!showNavbar) {
        return null;
    }

    return (
        <nav className="bg-gradient-to-r from-emerald-600 to-cyan-600 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                <span className="text-emerald-600 font-bold text-lg">A</span>
                            </div>
                            <span className="text-white text-xl font-bold">AWI Hábitos</span>
                        </Link>
                    </div>

                    {/* Menú de navegación */}
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                {/* Menú usuario autenticado */}
                                <div className="flex items-center space-x-4">
                                    <Link 
                                        to="/" 
                                        className="text-white hover:text-emerald-100 px-3 py-2 rounded-md text-sm font-medium transition"
                                    >
                                        Mis Hábitos
                                    </Link>
                                    <Link 
                                        to="/estadisticas" 
                                        className="text-white hover:text-emerald-100 px-3 py-2 rounded-md text-sm font-medium transition"
                                    >
                                        Estadísticas
                                    </Link>
                                    
                                    <div className="relative group">
                                        <button className="flex items-center space-x-2 text-white hover:text-emerald-100">
                                            <div className="w-8 h-8 bg-emerald-800 rounded-full flex items-center justify-center">
                                                <span className="font-semibold">
                                                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                                                </span>
                                            </div>
                                            <span className="hidden md:inline">{user?.username || 'Usuario'}</span>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        
                                        {/* Dropdown menu */}
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                                            <div className="px-4 py-2 border-b">
                                                <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                                                <p className="text-xs text-gray-500">{user?.email}</p>
                                            </div>
                                            <Link 
                                                to="/perfil" 
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Mi Perfil
                                            </Link>
                                            <Link 
                                                to="/configuracion" 
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Configuración
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                            >
                                                Cerrar Sesión
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            /* Menú usuario NO autenticado */
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/"
                                    className="text-white hover:text-emerald-100 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Inicio
                                </Link>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-emerald-600 bg-white rounded-lg hover:bg-emerald-50 transition font-medium"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 bg-emerald-800 text-white rounded-lg hover:bg-emerald-900 transition font-medium"
                                >
                                    Registrarse
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}