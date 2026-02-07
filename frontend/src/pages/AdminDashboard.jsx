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

    // Funciones auxiliares simplificadas
    const getUsername = (item) => {
        if (!item) return 'Usuario';
        if (item.Usuario?.username) return item.Usuario.username;
        if (item.usuario?.username) return item.usuario.username;
        return 'Usuario';
    };

    const getHabitName = (item) => {
        if (!item) return 'Hábito';
        if (item.detalle_habito?.nombre) return item.detalle_habito.nombre;
        if (item.Habito?.nombre) return item.Habito.nombre;
        return 'Hábito';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header simple */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Panel de Administración</h1>
                    <p className="text-gray-600">Gestiona categorías, hábitos y usuarios del sistema</p>
                </div>

                {/* Error message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {stats && (
                    <>
                        {/* Stats Grid - Simplificado */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {/* Total Usuarios */}
                            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-gray-600 text-sm">Total Usuarios</p>
                                        <p className="text-3xl font-bold text-gray-800">{stats.totalUsuarios}</p>
                                    </div>
                                    <div className="text-4xl text-blue-300">👥</div>
                                </div>
                            </div>

                            {/* Total Hábitos */}
                            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-emerald-500">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-gray-600 text-sm">Total Hábitos</p>
                                        <p className="text-3xl font-bold text-gray-800">{stats.totalHabitos}</p>
                                    </div>
                                    <div className="text-4xl text-emerald-300">📋</div>
                                </div>
                            </div>

                            {/* Top Habito */}
                            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-pink-500">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-gray-600 text-sm">Hábito Top</p>
                                        <p className="text-xl font-bold text-gray-800 truncate max-w-[180px]">
                                            {stats.habitosPopulares && stats.habitosPopulares.length > 0
                                                ? stats.habitosPopulares[0].nombre
                                                : 'Sin datos'}
                                        </p>
                                        <p className="text-gray-600 text-sm mt-1">
                                            {stats.habitosPopulares && stats.habitosPopulares.length > 0
                                                ? `${stats.habitosPopulares[0].total_suscripciones} seguidores`
                                                : ''}
                                        </p>
                                    </div>
                                    <div className="text-4xl text-pink-300">👑</div>
                                </div>
                            </div>

                            {/* Hábitos Predeterminados */}
                            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-amber-500">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-gray-600 text-sm">Predeterminados</p>
                                        <p className="text-3xl font-bold text-gray-800">{stats.habitosPredeterminados}</p>
                                    </div>
                                    <div className="text-4xl text-amber-300">⭐</div>
                                </div>
                            </div>

                            {/* Hábitos Personalizados */}
                            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-orange-500">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-gray-600 text-sm">Personalizados</p>
                                        <p className="text-3xl font-bold text-gray-800">{stats.habitosPersonalizados}</p>
                                    </div>
                                    <div className="text-4xl text-orange-300">✨</div>
                                </div>
                            </div>

                            {/* Total Suscripciones */}
                            <div className="bg-white p-6 rounded-xl shadow border-l-4 border-teal-500">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-gray-600 text-sm">Suscripciones</p>
                                        <p className="text-3xl font-bold text-gray-800">{stats.totalSuscripciones}</p>
                                    </div>
                                    <div className="text-4xl text-teal-300">🔗</div>
                                </div>
                            </div>
                        </div>

                        {/* Top 5 Rachas y Hábitos Populares */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            {/* Top 5 Rachas - Simplificado */}
                            <div className="bg-white rounded-xl shadow p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <span className="text-2xl">🔥</span> Rachas más seguidas
                                </h2>
                                {stats.rankingRachas && stats.rankingRachas.length > 0 ? (
                                    <div className="space-y-4">
                                        {stats.rankingRachas.map((item, index) => (
                                            <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-100">
                                                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-full">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-gray-600 truncate">{getHabitName(item)}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-amber-700">{item.racha_actual}</p>
                                                    <p className="text-xs text-gray-500">días</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">No hay datos de rachas aún</p>
                                )}
                            </div>

                            {/* Hábitos Más Populares - Simplificado */}
                            <div className="bg-white rounded-xl shadow p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <span className="text-2xl">⭐</span> Hábitos Más Seguidos
                                </h2>
                                {stats.habitosPopulares && stats.habitosPopulares.length > 0 ? (
                                    <div className="space-y-4">
                                        {stats.habitosPopulares.map((habito, index) => {
                                            // Calcular el porcentaje de suscripciones
                                            const porcentaje = stats.totalSuscripciones > 0
                                                ? Math.round((habito.total_suscripciones / stats.totalSuscripciones) * 100)
                                                : 0;

                                            return (
                                                <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <p className="font-semibold text-gray-800 truncate">{habito.nombre}</p>
                                                        <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                            #{index + 1}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex-1">
                                                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                                                <span>{habito.total_suscripciones} suscriptores</span>
                                                                <span className="font-medium">{porcentaje}%</span>
                                                            </div>
                                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                                <div
                                                                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full"
                                                                    style={{ width: `${Math.min(porcentaje, 100)}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">No hay hábitos populares aún</p>
                                )}
                            </div>
                        </div>

                        {/* Accesos Rápidos - Colores actualizados */}
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl shadow p-6 border border-emerald-100">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Accesos Rápidos</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <a href="/admin/categorias" className="block p-4 bg-white rounded-lg shadow hover:shadow-lg transition border border-emerald-200">
                                    <h3 className="font-semibold text-emerald-700 mb-1">Gestionar Categorías</h3>
                                    <p className="text-sm text-emerald-600">Crear, editar o eliminar categorías de hábitos</p>
                                </a>
                                <a href="/admin/habitos" className="block p-4 bg-white rounded-lg shadow hover:shadow-lg transition border border-emerald-200">
                                    <h3 className="font-semibold text-emerald-700 mb-1">Gestionar Hábitos</h3>
                                    <p className="text-sm text-emerald-600">Administrar el catálogo global de hábitos</p>
                                </a>
                                <a href="/admin/usuarios" className="block p-4 bg-white rounded-lg shadow hover:shadow-lg transition border border-emerald-200">
                                    <h3 className="font-semibold text-emerald-700 mb-1">Gestionar Usuarios</h3>
                                    <p className="text-sm text-emerald-600">Ver y administrar roles de usuarios</p>
                                </a>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
