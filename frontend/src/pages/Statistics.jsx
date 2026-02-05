import React, { useState, useEffect } from 'react';
import { Card, Button, StatsCard, LoadingScreen } from '../components/common';
import HabitService from '../services/habitService';

export default function Statistics() {
    const [stats, setStats] = useState({
        overall: {
            totalHabits: 0,
            activeHabits: 0,
            completionRate: 0,
            currentStreak: 0,
            bestStreak: 0
        },
        weekly: {
            monday: 0,
            tuesday: 0,
            wednesday: 0,
            thursday: 0,
            friday: 0,
            saturday: 0,
            sunday: 0
        },
        categories: [],
        loading: true
    });

    const [timeRange, setTimeRange] = useState('week');

    useEffect(() => {
        loadStatistics();
    }, [timeRange]);

    const loadStatistics = async () => {
        try {
            // TODO: Conectar con backend para obtener estadísticas reales
            // Cuando el backend tenga los endpoints de estadísticas, reemplazar esto
            const mockStats = {
                overall: {
                    totalHabits: 12,
                    activeHabits: 8,
                    completionRate: 72,
                    currentStreak: 14,
                    bestStreak: 30
                },
                weekly: {
                    monday: 85,
                    tuesday: 90,
                    wednesday: 70,
                    thursday: 95,
                    friday: 60,
                    saturday: 45,
                    sunday: 80
                },
                categories: [
                    { name: 'Salud', count: 4, completion: 80 },
                    { name: 'Ejercicio', count: 3, completion: 65 },
                    { name: 'Productividad', count: 3, completion: 75 },
                    { name: 'Mental', count: 2, completion: 85 }
                ]
            };
            
            setStats({ ...mockStats, loading: false });
        } catch (error) {
            console.error('Error cargando estadísticas:', error);
            setStats(prev => ({ ...prev, loading: false }));
        }
    };

    const timeRangeButtons = [
        { id: 'week', label: 'Esta semana' },
        { id: 'month', label: 'Este mes' },
        { id: 'year', label: 'Este año' },
        { id: 'all', label: 'Todo el tiempo' }
    ];

    const getDayName = (dayKey) => {
        const days = {
            monday: 'Lunes',
            tuesday: 'Martes',
            wednesday: 'Miércoles',
            thursday: 'Jueves',
            friday: 'Viernes',
            saturday: 'Sábado',
            sunday: 'Domingo'
        };
        return days[dayKey] || dayKey;
    };

    const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'];

    if (stats.loading) {
        return <LoadingScreen message="Cargando estadísticas..." variant="inline" />;
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
                        title="Hábitos Activos"
                        value={stats.overall.activeHabits}
                        subtitle={`de ${stats.overall.totalHabits} totales`}
                        color="emerald"
                        trend={{ direction: 'up', value: '+2', label: 'vs semana pasada' }}
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                    />
                    
                    <StatsCard
                        title="Tasa de Completitud"
                        value={`${stats.overall.completionRate}%`}
                        subtitle="Promedio diario"
                        color="blue"
                        trend={{ direction: 'up', value: '+5%', label: 'vs semana pasada' }}
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                            </svg>
                        }
                    />
                    
                    <StatsCard
                        title="Racha Actual"
                        value={`${stats.overall.currentStreak} días`}
                        subtitle={`Récord: ${stats.overall.bestStreak} días`}
                        color="purple"
                        trend={{ direction: 'up', value: '+3 días', label: 'en progreso' }}
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        }
                    />
                    
                    <StatsCard
                        title="Consistencia"
                        value="B+"
                        subtitle="Nivel de compromiso"
                        color="amber"
                        trend={{ direction: 'neutral', value: '→', label: 'estable' }}
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        }
                    />
                </div>

                {/* Gráfico de rendimiento semanal */}
                <Card className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Rendimiento Semanal</h2>
                    <div className="h-64 flex items-end justify-between space-x-2">
                        {Object.entries(stats.weekly).map(([day, percentage]) => (
                            <div key={day} className="flex-1 flex flex-col items-center">
                                <div className="text-xs text-gray-500 mb-2">{getDayName(day).slice(0, 3)}</div>
                                <div className="relative w-full flex justify-center">
                                    <div 
                                        className="w-3/4 bg-gradient-to-t from-emerald-400 to-emerald-300 rounded-t-lg transition-all hover:opacity-80 cursor-pointer"
                                        style={{ height: `${percentage}%` }}
                                        title={`${percentage}% completado`}
                                    >
                                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity">
                                            {percentage}%
                                        </div>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-600 mt-2">{percentage}%</div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Categorías y distribución */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card>
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Distribución por Categoría</h2>
                        <div className="space-y-4">
                            {stats.categories.map((category, index) => (
                                <div key={category.name} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <div 
                                                className="w-3 h-3 rounded-full mr-3"
                                                style={{ backgroundColor: colors[index % colors.length] }}
                                            ></div>
                                            <span className="font-medium">{category.name}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-bold">{category.count} hábitos</span>
                                            <span className="text-gray-600 ml-2">({category.completion}%)</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="h-2 rounded-full transition-all"
                                            style={{
                                                width: `${category.completion}%`,
                                                backgroundColor: colors[index % colors.length]
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Información adicional */}
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
                                    <strong>🎯 Meta:</strong> Intenta alcanzar un 80% de completitud en tus hábitos esta semana.
                                </p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                <p className="text-sm text-purple-800">
                                    <strong>📈 Progreso:</strong> Has mejorado un 5% comparado con la semana anterior. ¡Sigue así!
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}