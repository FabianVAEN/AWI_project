// frontend/src/pages/Statistics.jsx
import React, { useState, useEffect } from 'react';
import { Card, Button } from '../components/common';
import StatsCard from '../components/common/StatsCard';
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

    const [timeRange, setTimeRange] = useState('week'); // week, month, year, all
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        loadStatistics();
    }, [timeRange]);

    const loadStatistics = async () => {
        try {
            // TODO: Conectar con backend para obtener estadísticas reales
            // Por ahora, datos mock
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

    if (stats.loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando estadísticas...</p>
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
                                variant={timeRange === button.id ? 'primary' : 'outline'}
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
                                        className="w-3/4 bg-gradient-to-t from-emerald-400 to-emerald-300 rounded-t-lg transition-all hover:opacity-80"
                                        style={{ height: `${percentage}%` }}
                                        title={`${percentage}% completado`}
                                    >
                                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
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
                                                style={{
                                                    backgroundColor: [
                                                        '#10B981', // emerald
                                                        '#3B82F6', // blue
                                                        '#8B5CF6', // purple
                                                        '#F59E0B', // amber
                                                        '#EF4444', // red
                                                        '#06B6D4'  // cyan
                                                    ][index % 6]
                                                }}
                                            ></div>
                                            <span className="font-medium">{category.name}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-bold">{category.count} hábitos</span>
                                            <span className="text-gray-600 ml-2">({category.completion}% completados)</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="h-2 rounded-full"
                                            style={{
                                                width: `${category.completion}%`,
                                                backgroundColor: [
                                                    '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'
                                                ][index % 6]
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card>
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Insights y Recomendaciones</h2>
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <h4 className="font-medium text-blue-800">Mejor día: Jueves</h4>
                                        <p className="text-blue-700 text-sm mt-1">Tienes un 95% de completitud los jueves. ¡Sigue así!</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.73 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    <div>
                                        <h4 className="font-medium text-amber-800">Día débil: Sábado</h4>
                                        <p className="text-amber-700 text-sm mt-1">Solo completas el 45% de hábitos los sábados. Considera ajustar tu rutina.</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-emerald-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <h4 className="font-medium text-emerald-800">Racha en peligro</h4>
                                        <p className="text-emerald-700 text-sm mt-1">Llevas 14 días consecutivos. ¡Solo 1 día más para tu récord personal!</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-purple-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    <div>
                                        <h4 className="font-medium text-purple-800">Meta alcanzable</h4>
                                        <p className="text-purple-700 text-sm mt-1">Si mantienes el ritmo actual, alcanzarás tu meta mensual en 7 días.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-6 pt-6 border-t">
                            <Button variant="primary" className="w-full">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Ver Reporte Detallado
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Exportar datos */}
                <Card className="mt-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">¿Quieres analizar más a fondo?</h3>
                            <p className="text-gray-600 mt-1">Exporta tus datos para analizarlos en Excel o herramientas de BI.</p>
                        </div>
                        <div className="flex gap-3 mt-4 md:mt-0">
                            <Button variant="outline">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Exportar CSV
                            </Button>
                            <Button variant="primary">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Generar Reporte PDF
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}