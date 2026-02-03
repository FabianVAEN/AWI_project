// frontend/src/App.jsx - VERSIÓN ACTUALIZADA
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Statistics from './pages/Statistics';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Navbar from './components/common/Navbar';
import AuthService from './services/authService';

// Componente para rutas protegidas
const PrivateRoute = ({ children }) => {
    return AuthService.isAuthenticated() ? children : <Navigate to="/login" />;
};

// Layout principal con Navbar
const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
            <Navbar />
            <main className="flex-grow">
                {children}
            </main>
            <footer className="bg-white border-t py-6 text-center text-gray-600 text-sm">
                <p>© 2024 AWI Hábitos Saludables. Todos los derechos reservados.</p>
                <p className="mt-1">Construyendo mejores hábitos, un día a la vez.</p>
            </footer>
        </div>
    );
};

export default function App() {
    return (
        <Router>
            <Routes>
                {/* Rutas públicas sin layout principal */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Rutas protegidas con layout */}
                <Route 
                    path="/" 
                    element={
                        <PrivateRoute>
                            <MainLayout>
                                <Home />
                            </MainLayout>
                        </PrivateRoute>
                    } 
                />
                
                <Route 
                    path="/perfil" 
                    element={
                        <PrivateRoute>
                            <MainLayout>
                                <Profile />
                            </MainLayout>
                        </PrivateRoute>
                    } 
                />
                
                <Route 
                    path="/estadisticas" 
                    element={
                        <PrivateRoute>
                            <MainLayout>
                                <Statistics />
                            </MainLayout>
                        </PrivateRoute>
                    } 
                />
                
                {/* Ruta por defecto */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}