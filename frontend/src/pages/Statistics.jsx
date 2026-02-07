    import React, { useState, useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { Card, Button, StatsCard, LoadingScreen } from '../components/common';
    import HabitService from '../services/habitService';

    export default function Statistics() {
        const navigate = useNavigate();
        const [stats, setStats] = useState(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const [timeRange, setTimeRange] = useState('week');

        useEffect(() => {
            loadStatistics();
        }, [timeRange]);

        const loadStatistics = async () => {
            try {
                setLoading(true);
                const data = await HabitService.getUserStats(timeRange); // Enviar el rango
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

        const getChartTitle = () => {
            switch (timeRange) {
                case 'week': return 'Últimos 7 Días';
                case 'month': return 'Últimos 30 Días';
                case 'year': return 'Últimos 12 Meses';
                case 'all': return 'Historial Completo';
                default: return 'Últimos 7 Días';
            }
        };

        const groupDataByMonth = (historial) => {
            const grouped = {};

            historial.forEach(day => {
                const date = new Date(day.fecha);
                const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;

                if (!grouped[monthKey]) {
                    grouped[monthKey] = {
                        fecha: monthKey, // Mantener el formato YYYY-MM para procesamiento
                        completados: 0,
                        dias: 0,
                        year: date.getFullYear(),
                        month: date.getMonth() + 1
                    };
                }

                grouped[monthKey].completados += day.completados;
                grouped[monthKey].dias++;
            });

            // Calcular promedio diario por mes y ordenar por fecha
            return Object.values(grouped)
                .map(month => ({
                    ...month,
                    completados: month.dias > 0 ? Math.round(month.completados / month.dias) : 0,
                    fechaFormatted: `${String(month.month).padStart(2, '0')}/${month.year.toString().slice(-2)}`
                }))
                .sort((a, b) => {
                    if (a.year !== b.year) return a.year - b.year;
                    return a.month - b.month;
                });
        };

        const getDayName = (date) => {
            const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
            return days[new Date(date).getDay()];
        };

        // Agregar después de getDayName() y antes del if (loading)

        // Función para determinar color según hábitos completados
        const getColorByCount = (count) => {
            if (count === 0) return 'bg-gray-200';
            if (count <= 2) return 'bg-emerald-300';
            if (count <= 4) return 'bg-emerald-500';
            return 'bg-emerald-700';
        };

        // Función para renderizar vista de días (semana/mes)
        const renderDaysGrid = () => {
            if (timeRange === 'week') {
                // Para semana: mostrar 7 días con nombres
                return displayData.map((day, index) => {
                    const date = new Date(day.fecha);
                    const dayName = getDayName(day.fecha);
                    const dayNumber = date.getDate();

                    return (
                        <div key={index} className="flex flex-col items-center">
                            <div className={`w-10 h-10 ${getColorByCount(day.completados)} rounded-lg flex items-center justify-center`}
                                title={`${date.toLocaleDateString()}: ${day.completados} hábitos`}>
                                <span className="text-xs font-medium text-white">
                                    {day.completados}
                                </span>
                            </div>
                            <div className="mt-1 text-xs text-gray-600">
                                {dayName}
                            </div>
                            <div className="text-xs text-gray-400">
                                {dayNumber}
                            </div>
                        </div>
                    );
                });
            } else {
                // Para mes: mostrar todos los días del mes actual
                const today = new Date();
                const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

                const days = [];
                // Crear un mapa de los datos para acceso rápido
                const dataMap = {};
                displayData.forEach(day => {
                    const date = new Date(day.fecha);
                    const dayNum = date.getDate();
                    dataMap[dayNum] = day.completados;
                });

                for (let day = 1; day <= daysInMonth; day++) {
                    const count = dataMap[day] || 0;
                    days.push(
                        <div key={day} className="flex flex-col items-center">
                            <div className={`w-8 h-8 ${getColorByCount(count)} rounded flex items-center justify-center`}
                                title={`Día ${day}: ${count} hábitos`}>
                                <span className="text-xs font-medium text-white">
                                    {count > 0 ? count : ''}
                                </span>
                            </div>
                            <div className="mt-1 text-xs text-gray-400">
                                {day}
                            </div>
                        </div>
                    );
                }
                return days;
            }
        };

        // Función para renderizar vista de meses (año/todo)
        const renderMonthsOverview = () => {
            // Agrupar por mes si es necesario
            const monthlyData = isLongRange ? displayData : [];

            return monthlyData.map((month, index) => (
                <div key={index} className="flex flex-col items-center">
                    <div className="text-sm font-medium text-gray-700 mb-2">
                        {month.fechaFormatted}
                    </div>
                    {/* Simular un mini-calendario del mes */}
                    <div className="grid grid-cols-4 gap-1">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div
                                key={i}
                                className={`w-6 h-6 ${getColorByCount(Math.min(month.completados, 5))} rounded`}
                                title={`Promedio: ${month.completados} hábitos/día`}
                            />
                        ))}
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                        {month.completados}/día
                    </div>
                </div>
            ));
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

        // Determinar qué datos mostrar
        const isLongRange = timeRange === 'year' || timeRange === 'all';
        const displayData = isLongRange
            ? groupDataByMonth(stats?.historial || [])
            : stats?.historial || [];

        // Si no hay datos, mostrar un mensaje
        if (!stats || displayData.length === 0) {
            return (
                <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8">
                            <button
                                onClick={() => navigate('/')}
                                className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 text-sm font-semibold hover:underline"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Volver al catalogo
                            </button>
                            <h1 className="text-3xl font-bold text-gray-800">Estadísticas</h1>
                            <p className="text-gray-600 mt-2">Visualiza tu progreso y métricas de hábitos</p>
                        </div>

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

                        <Card className="text-center py-12">
                            <div className="text-gray-500">
                                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                <h3 className="text-xl font-semibold mb-2">No hay datos disponibles</h3>
                                <p className="mb-4">No tienes registros de hábitos para este período.</p>
                                <p className="text-sm">Comienza a completar tus hábitos diarios para ver estadísticas.</p>
                            </div>
                        </Card>
                    </div>
                </div>
            );
        }

        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={() => navigate('/')}
                            className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 text-sm font-semibold hover:underline"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Volver al catalogo
                        </button>
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

                    {/* Calendario de Hábitos */}
                    <Card className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">
                            {getChartTitle()} - Vista Calendario
                        </h2>

                        {/* Instrucciones simples */}
                        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800">
                                <strong>📅 Entiende tu calendario:</strong> Cada cuadrado es un día.
                                Color más oscuro = más hábitos completados ese día.
                            </p>
                        </div>

                        {/* Contenedor del calendario */}
                        <div className="relative">
                            {/* Si es rango largo (año/todo), mostrar vista mensual compacta */}
                            {isLongRange ? (
                                <div className="overflow-x-auto">
                                    <div className="flex gap-6 min-w-max">
                                        {renderMonthsOverview()}
                                    </div>
                                </div>
                            ) : (
                                /* Si es rango corto (semana/mes), mostrar vista diaria detallada */
                                <div className="grid grid-cols-7 gap-2">
                                    {renderDaysGrid()}
                                </div>
                            )}
                        </div>

                        {/* Leyenda de colores */}
                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <div className="flex items-center justify-center gap-4 flex-wrap text-sm">
                                <div className="flex items-center gap-1">
                                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                                    <span className="text-gray-600">0 hábitos</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-4 h-4 bg-emerald-300 rounded"></div>
                                    <span className="text-gray-600">1-2 hábitos</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                                    <span className="text-gray-600">3-4 hábitos</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-4 h-4 bg-emerald-700 rounded"></div>
                                    <span className="text-gray-600">5+ hábitos</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                    {/* Información adicional */}

                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="text-center">
                                <div className="font-semibold text-emerald-700">🏆 Día más productivo</div>
                                <div className="text-lg font-bold">
                                    {Math.max(...displayData.map(h => h.completados), 0)} hábitos
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="font-semibold text-gray-600">📅 Promedio diario</div>
                                <div className="text-lg font-bold">
                                    {displayData.length > 0
                                        ? Math.round(displayData.reduce((sum, h) => sum + h.completados, 0) / displayData.length)
                                        : 0} hábitos
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="font-semibold text-blue-600">📊 Por periodo </div>
                                <div className="text-lg font-bold">
                                    {displayData.reduce((sum, h) => sum + h.completados, 0)} hábitos
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

