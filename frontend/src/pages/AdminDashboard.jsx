import React, { useState, useEffect } from 'react';
import AdminService from '../services/adminService';
import { LoadingScreen } from '../components/common';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            const data = await AdminService.getDashboardStats();
            setStats(data);
            setError(null);
        } catch (err) {
            setError(err.message || 'Error al cargar estadísticas');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingScreen />;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Panel de Administración</h1>
                <p className="text-gray-600">Gestiona categorías, hábitos y usuarios del sistema</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Total Usuarios */}
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Usuarios</p>
                                <p className="text-3xl font-bold text-blue-600">{stats.totalUsuarios}</p>
                            </div>
                            <div className="text-4xl text-blue-200">👥</div>
                        </div>
                    </div>

                    {/* Total Hábitos */}
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Hábitos</p>
                                <p className="text-3xl font-bold text-green-600">{stats.totalHabitos}</p>
                            </div>
                            <div className="text-4xl text-green-200">📋</div>
                        </div>
                    </div>

                    {/* Hábitos Predeterminados */}
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Predeterminados</p>
                                <p className="text-3xl font-bold text-purple-600">{stats.habitosPredeterminados}</p>
                            </div>
                            <div className="text-4xl text-purple-200">⭐</div>
                        </div>
                    </div>

                    {/* Hábitos Personalizados */}
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Personalizados</p>
                                <p className="text-3xl font-bold text-orange-600">{stats.habitosPersonalizados}</p>
                            </div>
                            <div className="text-4xl text-orange-200">✨</div>
                        </div>
                    </div>

                    {/* Total Categorías */}
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-pink-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Categorías</p>
                                <p className="text-3xl font-bold text-pink-600">{stats.totalCategorias}</p>
                            </div>
                            <div className="text-4xl text-pink-200">🏷️</div>
                        </div>
                    </div>

                    {/* Total Suscripciones */}
                    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-teal-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Suscripciones</p>
                                <p className="text-3xl font-bold text-teal-600">{stats.totalSuscripciones}</p>
                            </div>
                            <div className="text-4xl text-teal-200">🔗</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Accesos rápidos */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Accesos Rápidos</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a href="/admin/categorias" className="block p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg hover:shadow-lg transition">
                        <h3 className="font-semibold text-blue-700 mb-1">Gestionar Categorías</h3>
                        <p className="text-sm text-blue-600">Crear, editar o eliminar categorías de hábitos</p>
                    </a>
                    <a href="/admin/habitos" className="block p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg hover:shadow-lg transition">
                        <h3 className="font-semibold text-green-700 mb-1">Gestionar Hábitos</h3>
                        <p className="text-sm text-green-600">Administrar el catálogo global de hábitos</p>
                    </a>
                    <a href="/admin/usuarios" className="block p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg hover:shadow-lg transition">
                        <h3 className="font-semibold text-purple-700 mb-1">Gestionar Usuarios</h3>
                        <p className="text-sm text-purple-600">Ver y administrar roles de usuarios</p>
                    </a>
                </div>
            </div>
        </div>
    );
}