import React, { useState, useEffect } from 'react';
import { Card, Button, StatsCard, LoadingScreen } from '../components/common';
import HabitService from '../services/habitService';

export default function Statistics() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState('week');

    useEffect(() => {
        loadStatistics();
    }, []);

    const loadStatistics = async () => {
        try {
            setLoading(true);
            const data = await HabitService.getUserStats();
            setStats(data);
            setError(null);
        } catch (err) {
            setError(err.message || 'Error al cargar estadísticas');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const timeRangeButtons = [
        { id: 'week', label: 'Esta semana' },
        { id: 'month', label: 'Este mes' },
        { id: 'year', label: 'Este año' },
        { id: 'all', label: 'Todo el tiempo' }
    ];

    const getDayName = (date) => {
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        return days[new Date(date).getDay()];
    };

    if (loading) {
        return <LoadingScreen />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <h2 className="text-red-800 font-bold mb-2">Error al cargar estadísticas</h2>
                        <p className="text-red-700">{error}</p>
                        <Button onClick={loadStatistics} className="mt-4 bg-red-600 hover:bg-red-700">
                            Reintentar
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Estadísticas</h1>
                    <p className="text-gray-600 mt-2">Visualiza tu progreso y métricas de hábitos</p>
                </div>

                {/* Filtros de tiempo */}
                <Card className="mb-8">
                    <div className="flex flex-wrap gap-2">
                        {timeRangeButtons.map((button) => (
                            <Button
                                key={button.id}
                                variant={timeRange === button.id ? 'primary' : 'ghost'}
                                size="sm"
                                onClick={() => setTimeRange(button.id)}
                            >
                                {button.label}
                            </Button>
                        ))}
                    </div>
                </Card>

                {/* Resumen general */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatsCard
                        title="Total de Hábitos"
                        value={stats?.totalHabitos || 0}
                        subtitle="Hábitos activos"
                        color="emerald"
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                    />
                    
                    <StatsCard
                        title="Racha Promedio"
                        value={`${stats?.rachaPromedio || 0} días`}
                        subtitle="Promedio de tus hábitos"
                        color="blue"
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                            </svg>
                        }
                    />
                    
                    <StatsCard
                        title="Mejor Racha"
                        value={`${stats?.mejorRacha || 0} días`}
                        subtitle="Tu récord personal"
                        color="purple"
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        }
                    />
                    
                    <StatsCard
                        title="Consistencia"
                        value={stats?.mejorRacha > 7 ? 'A' : stats?.mejorRacha > 3 ? 'B' : 'C'}
                        subtitle="Nivel de compromiso"
                        color="amber"
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        }
                    />
                </div>

                {/* Gráfico de rendimiento últimos 7 días */}
                <Card className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Últimos 7 Días</h2>
                    <div className="h-64 flex items-end justify-between space-x-2">
                        {stats?.historial?.map((day) => {
                            const maxCompletados = Math.max(...stats.historial.map(h => h.completados), 1);
                            const percentage = (day.completados / maxCompletados) * 100;
                            return (
                                <div key={day.fecha} className="flex-1 flex flex-col items-center">
                                    <div className="text-xs text-gray-500 mb-2">{getDayName(day.fecha).slice(0, 3)}</div>
                                    <div className="relative w-full flex justify-center">
                                        <div 
                                            className="w-3/4 bg-gradient-to-t from-emerald-400 to-emerald-300 rounded-t-lg transition-all hover:opacity-80 cursor-pointer"
                                            style={{ height: `${Math.max(percentage, 10)}%` }}
                                            title={`${day.completados} completado(s)`}
                                        >
                                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity">
                                                {day.completados}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-600 mt-2">{day.completados}</div>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                {/* Información adicional */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card>
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Consejos de Mejora</h2>
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-sm text-blue-800">
                                    <strong>💡 Consejo:</strong> Mantén una racha consistente. Incluso un pequeño progreso diario es mejor que nada.
                                </p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                <p className="text-sm text-green-800">
                                    <strong>🎯 Meta:</strong> Intenta alcanzar una racha de 30 días en al menos un hábito.
                                </p>
                            </div>
                            <div className="p4 bg-purple-50 rounded-lg border border-purple-200">
                                <p className="text-sm text-purple-800">
                                    <strong>📈 Progreso:</strong> Tu racha promedio es de {stats?.rachaPromedio} días. ¡Sigue así!
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Resumen</h2>
                        <div className="space-y-4">
                            <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                                <p className="text-sm text-gray-700">
                                    <strong className="text-emerald-700">Total de Hábitos:</strong> {stats?.totalHabitos}
                                </p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                                <p className="text-sm text-gray-700">
                                    <strong className="text-blue-700">Racha Promedio:</strong> {stats?.rachaPromedio} días
                                </p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                                <p className="text-sm text-gray-700">
                                    <strong className="text-purple-700">Mejor Racha:</strong> {stats?.mejorRacha} días
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
