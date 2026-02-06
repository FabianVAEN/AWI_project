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

                {/* Gráfico de rendimiento - Versión CORREGIDA */}
                <Card className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">{getChartTitle()}</h2>

                    {/* Contenedor de la gráfica */}
                    <div className="relative">
                        <div className={`${isLongRange && displayData.length > 12 ? 'overflow-x-auto' : ''}`}>
                            <div
                                className="flex items-end min-h-[300px] py-4"
                                style={{
                                    minWidth: isLongRange ? `${displayData.length * 60}px` : '100%'
                                }}
                            >
                                {(() => {
                                    // 1. OBTENER TODOS LOS VALORES
                                    const valores = displayData.map(h => h.completados);
                                    const maxValor = Math.max(...valores, 1); // Mínimo 1 para evitar división por 0
                                    const minValor = Math.min(...valores, 0);

                                    // 2. DETECTAR SI TODOS LOS VALORES SON IGUALES
                                    const todosIguales = valores.length > 0 && valores.every(v => v === valores[0]);

                                    // 3. SI TODOS SON IGUALES, CREAR DIFERENCIAS VISUALES
                                    if (todosIguales) {
                                        return displayData.map((item, index) => {
                                            // Altura escalonada para que se vean diferencias
                                            const alturaBase = 25 + (index % 5) * 15;
                                            return renderBarra(item, index, Math.min(alturaBase, 80));
                                        });
                                    }

                                    // 4. CALCULAR ALTURA PROPORCIONAL MEJORADA
                                    return displayData.map((item, index) => {
                                        let alturaPorcentaje;

                                        if (maxValor === 0) {
                                            alturaPorcentaje = 20; // Altura base si todo es 0
                                        } else if (item.completados === 0) {
                                            alturaPorcentaje = 10; // Altura mínima para 0
                                        } else {
                                            // FÓRMULA MEJORADA: Amplificar diferencias pequeñas
                                            // Usamos una escala no lineal para que 1 vs 4 sea más visible
                                            const proporcion = item.completados / maxValor;
                                            
                                            // Aplicar una función de potencia para amplificar diferencias
                                            // Math.pow(proporcion, 0.7) amplifica valores pequeños
                                            const proporcioAmpliada = Math.pow(proporcion, 0.7);
                                            
                                            // Rango: 15% mínimo a 95% máximo
                                            alturaPorcentaje = 15 + proporcioAmpliada * 80;
                                        }

                                        // Asegurar que no exceda 95%
                                        return renderBarra(item, index, Math.min(alturaPorcentaje, 95));
                                    });

                                    // FUNCIÓN PARA RENDERIZAR CADA BARRA
                                    function renderBarra(item, index, alturaPorcentaje) {
                                        // Ancho dinámico
                                        let anchoBarra = 'auto';
                                        if (displayData.length <= 7) {
                                            anchoBarra = `calc(${100 / displayData.length}% - 8px)`;
                                        } else if (displayData.length <= 30) {
                                            anchoBarra = `calc(${100 / displayData.length}% - 4px)`;
                                        } else {
                                            anchoBarra = '45px';
                                        }

                                        // Etiqueta
                                        let label = '';
                                        let tooltipDate = '';

                                        if (isLongRange) {
                                            label = item.fechaFormatted || `${item.month}/${item.year.toString().slice(-2)}`;
                                            tooltipDate = `Mes: ${item.month}/${item.year}`;
                                        } else {
                                            const date = new Date(item.fecha);
                                            label = timeRange === 'week'
                                                ? getDayName(item.fecha)
                                                : `${date.getDate()}/${date.getMonth() + 1}`;
                                            tooltipDate = date.toLocaleDateString();
                                        }

                                        return (
                                            <div
                                                key={index}
                                                className="flex flex-col items-center h-full justify-end mx-1"
                                                style={{
                                                    width: anchoBarra,
                                                    flex: displayData.length <= 30 ? '1 1 auto' : '0 0 auto'
                                                }}
                                            >
                                                {/* Barra principal */}
                                                <div className="relative w-full flex justify-center">
                                                    <div
                                                        className="w-11/12 bg-gradient-to-t from-emerald-500 to-emerald-300 rounded-t-lg transition-all duration-300 hover:from-emerald-600 hover:to-emerald-400 cursor-pointer shadow-lg hover:shadow-xl group"
                                                        style={{
                                                            height: `${alturaPorcentaje}%`,
                                                            minHeight: '20px' // Altura mínima absoluta
                                                        }}
                                                        title={`${tooltipDate}: ${item.completados} completado(s)`}
                                                    >
                                                        {/* Efecto de brillo al pasar el cursor */}
                                                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-t-lg transition-opacity duration-300"></div>

                                                        {/* Tooltip */}
                                                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 shadow-2xl pointer-events-none">
                                                            <div className="font-bold mb-1">{tooltipDate}</div>
                                                            <div className="text-emerald-300">📊 {item.completados} hábito(s) completado(s)</div>
                                                        </div>
                                                    </div>

                                                    {/* Indicador de valor */}
                                                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-800 bg-white/90 px-2 py-1 rounded shadow-sm">
                                                        {item.completados}
                                                    </div>
                                                </div>

                                                {/* Línea divisoria */}
                                                <div className="w-full h-px bg-gray-200 mt-2"></div>

                                                {/* Etiqueta */}
                                                <div className="text-xs text-gray-600 mt-2 truncate w-full text-center font-medium">
                                                    {label}
                                                </div>
                                            </div>
                                        );
                                    }
                                })()}
                            </div>
                        </div>

                        {/* Eje X (línea base) */}
                        <div className="absolute bottom-16 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

                        {/* Leyenda de escala */}
                        <div className="absolute top-0 right-0 bg-white/90 backdrop-blur-sm p-3 rounded-l-lg shadow-sm">
                            <div className="text-xs font-bold text-gray-700 mb-1">📈 ESCALA AMPLIFICADA</div>
                            <div className="text-xs text-gray-600">
                                Diferencias visibles desde<br />1 hasta {Math.max(...displayData.map(h => h.completados), 1)} hábitos
                            </div>
                        </div>
                    </div>

                    {/* Información adicional */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="text-center">
                                <div className="font-semibold text-emerald-700">🏆 Mejor día</div>
                                <div className="text-lg font-bold">
                                    {Math.max(...displayData.map(h => h.completados), 0)} hábitos
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="font-semibold text-gray-600">📅 Promedio</div>
                                <div className="text-lg font-bold">
                                    {displayData.length > 0
                                        ? Math.round(displayData.reduce((sum, h) => sum + h.completados, 0) / displayData.length)
                                        : 0} hábitos/día
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="font-semibold text-blue-600">📊 Total</div>
                                <div className="text-lg font-bold">
                                    {displayData.reduce((sum, h) => sum + h.completados, 0)} hábitos
                                </div>
                            </div>
                        </div>
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
                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
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
