import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Statistics from './pages/Statistics';
import AdminDashboard from './pages/AdminDashboard';
import AdminCategories from './pages/AdminCategories';
import AdminHabits from './pages/AdminHabits';
import AdminUsers from './pages/AdminUsers';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Navbar from './components/common/Navbar';
import AuthService from './services/authService';

// Componente para rutas protegidas
const PrivateRoute = ({ children }) => {
    return AuthService.isAuthenticated() ? children : <Navigate to="/login" />;
};

// Componente para rutas de administrador
const AdminRoute = ({ children }) => {
    const user = AuthService.getUser();
    if (!AuthService.isAuthenticated()) {
        return <Navigate to="/login" />;
    }
    if (!user?.es_admin) {
        return <Navigate to="/" />;
    }
    return children;
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

                {/* Rutas de Administración */}
                <Route 
                    path="/admin" 
                    element={
                        <AdminRoute>
                            <MainLayout>
                                <AdminDashboard />
                            </MainLayout>
                        </AdminRoute>
                    } 
                />

                <Route 
                    path="/admin/categorias" 
                    element={
                        <AdminRoute>
                            <MainLayout>
                                <AdminCategories />
                            </MainLayout>
                        </AdminRoute>
                    } 
                />

                <Route 
                    path="/admin/habitos" 
                    element={
                        <AdminRoute>
                            <MainLayout>
                                <AdminHabits />
                            </MainLayout>
                        </AdminRoute>
                    } 
                />

                <Route 
                    path="/admin/usuarios" 
                    element={
                        <AdminRoute>
                            <MainLayout>
                                <AdminUsers />
                            </MainLayout>
                        </AdminRoute>
                    } 
                />
                
                {/* Ruta por defecto */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}
