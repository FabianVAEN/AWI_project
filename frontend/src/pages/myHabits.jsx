import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, LoadingScreen, HabitForm, Modal } from '../components/common';
import HabitService from '../services/habitService';

export default function MyHabits() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [listaHabitos, setListaHabitos] = useState([]);
    const [error, setError] = useState('');
    const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
    const [habitoAEditar, setHabitoAEditar] = useState(null);
    const [expandedLista, setExpandedLista] = useState({});
    const [completando, setCompletando] = useState(null); // Para feedback visual

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setError('');
            const listaData = await HabitService.getUserHabits();
            // Mantener orden original (por ID o fecha de creación)
            setListaHabitos(listaData.sort((a, b) => a.id - b.id));
        } catch (err) {
            setError('Error de conexión. Verifica que el servidor esté corriendo.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const marcarCompletado = async (id) => {
        try {
            setCompletando(id); // Feedback visual inmediato
            setError('');

            const habitoActual = listaHabitos.find(h => h.id === id);
            if (!habitoActual) return;

            const nuevoEstado = habitoActual.estado === 'completado' ? 'pendiente' : 'completado';

            // OPTIMISTIC UPDATE: Actualizar UI inmediatamente
            setListaHabitos(prev =>
                prev.map(habito =>
                    habito.id === id
                        ? {
                            ...habito,
                            estado: nuevoEstado,
                            // Incrementar racha si se completa, resetear si se desmarca
                            racha_actual: nuevoEstado === 'completado'
                                ? (habito.racha_actual + 1)
                                : Math.max(0, habito.racha_actual - 1)
                        }
                        : habito
                )
            );

            // Llamada al backend
            await HabitService.toggleHabitStatus(id, nuevoEstado);

            // Refrescar datos reales del backend (sin reordenar)
            setTimeout(async () => {
                const dataActualizada = await HabitService.getUserHabits();
                setListaHabitos(dataActualizada.sort((a, b) => a.id - b.id));
            }, 300);

        } catch (err) {
            // Revertir cambios si hay error
            setError('Error al cambiar estado del hábito');
            console.error(err);
            // Recargar datos originales
            await cargarDatos();
        } finally {
            setCompletando(null);
        }
    };

    const eliminarHabito = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este hábito? Esta acción no se puede deshacer.')) {
            try {
                setError('');
                // Feedback visual: animación de salida
                setListaHabitos(prev => prev.filter(habito => habito.id !== id));

                await HabitService.deleteHabit(id);

                // Notificación visual de éxito
                setTimeout(() => {
                    // Opcional: mostrar notificación toast
                }, 300);
            } catch (err) {
                setError('Error al eliminar hábito');
                // Recargar si falla
                await cargarDatos();
            }
        }
    };

    const editarHabito = async (formData) => {
        try {
            setError('');
            await HabitService.updateHabit(habitoAEditar.id, formData);
            setModalEditarAbierto(false);

            // Actualizar solo el hábito editado
            setListaHabitos(prev =>
                prev.map(habito =>
                    habito.id === habitoAEditar.id
                        ? { 
                            ...habito,
                             ...formData,
                            descripcion_breve: formData.descripcion
                        }
                        : habito
                )
            );

            setHabitoAEditar(null);
        } catch (err) {
            setError('Error al editar hábito');
        }
    };

    const toggleListaDescripcion = (id) => {
        setExpandedLista(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Separar hábitos por estado para estadísticas (sin reordenar la vista)
    const habitosCompletados = listaHabitos.filter(h => h.estado === 'completado').length;
    const habitosPendientes = listaHabitos.filter(h => h.estado === 'pendiente').length;

    if (loading) {
        return <LoadingScreen title="Cargando tus hábitos..." variant="dots" />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header mejorado */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <button
                            onClick={() => navigate('/')}
                            className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 text-sm font-semibold hover:underline"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Volver al catálogo
                        </button>
                        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 mt-2">
                            Mis Hábitos
                        </h1>
                        <p className="text-gray-600 mt-1">Gestiona tu progreso personal</p>
                    </div>

                    {/* Estadísticas rápidas */}
                    <div className="flex gap-4">
                        <div className="text-center px-4 py-2 bg-white rounded-lg shadow-sm border">
                            <div className="text-2xl font-bold text-blue-600">{habitosPendientes}</div>
                            <div className="text-xs text-gray-500">Pendientes</div>
                        </div>
                        <div className="text-center px-4 py-2 bg-white rounded-lg shadow-sm border">
                            <div className="text-2xl font-bold text-green-600">{habitosCompletados}</div>
                            <div className="text-xs text-gray-500">Completados</div>
                        </div>
                        <div className="text-center px-4 py-2 bg-white rounded-lg shadow-sm border">
                            <div className="text-2xl font-bold text-purple-600">{listaHabitos.length}</div>
                            <div className="text-xs text-gray-500">Total</div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-3 animate-fadeIn">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span>{error}</span>
                        <button
                            onClick={() => setError('')}
                            className="ml-auto text-red-500 hover:text-red-700"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {listaHabitos.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-6xl text-gray-300 mb-4">📋</div>
                        <h3 className="text-xl text-gray-600 mb-2">Tu lista de hábitos está vacía</h3>
                        <p className="text-gray-500 mb-6">Comienza agregando hábitos desde el catálogo principal</p>
                        <Button
                            onClick={() => navigate('/')}
                            variant="primary"
                            className="px-6"
                        >
                            Explorar Catálogo
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* Filtros rápidos (opcional) */}
                        <div className="mb-6 flex flex-wrap gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => { }}
                                className="bg-white border"
                            >
                                Todos ({listaHabitos.length})
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => { }}
                                className="bg-white border"
                            >
                                Pendientes ({habitosPendientes})
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => { }}
                                className="bg-white border"
                            >
                                Completados ({habitosCompletados})
                            </Button>
                        </div>

                        {/* Grid de hábitos con animaciones */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {listaHabitos.map((habito) => (
                                <div
                                    key={habito.id}
                                    className={`habit-card transition-all duration-300 hover:transform hover:-translate-y-1 ${completando === habito.id ? 'animate-pulse' : ''
                                        }`}
                                >
                                    <Card className={`h-full border-l-4 ${habito.estado === 'completado'
                                        ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50'
                                        : 'border-blue-500 bg-white'
                                        }`}>
                                        <div className="flex flex-col h-full">
                                            {/* Header con badge de estado */}
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex-1">
                                                    <h3 className={`text-lg font-semibold ${habito.estado === 'completado'
                                                        ? 'text-green-700 line-through decoration-2'
                                                        : 'text-gray-800'
                                                        }`}>
                                                        {habito.nombre}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                            {habito.categoria || 'Sin categoría'}
                                                        </span>
                                                        {habito.es_predeterminado && (
                                                            <span className="text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded">
                                                                Catálogo
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${habito.estado === 'completado'
                                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                                                    }`}>
                                                    {habito.estado === 'completado' ? 'Completado' : 'Pendiente'}
                                                </span>
                                            </div>

                                            {/* Descripción */}
                                            <div className="mb-4 flex-grow">
                                                <p className="text-gray-600 text-sm mb-2">
                                                    {habito.descripcion_breve || habito.descripcion || 'Sin descripción'}
                                                </p>
                                                {habito.descripcion_larga && (
                                                    <div className="mb-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleListaDescripcion(habito.id)}
                                                            className="text-emerald-700 text-xs hover:underline font-medium"
                                                        >
                                                            {expandedLista[habito.id] ? 'Ver menos' : 'Ver más detalles'}
                                                        </button>
                                                        {expandedLista[habito.id] && (
                                                            <p className="text-gray-600 text-sm mt-2 p-2 bg-gray-50 rounded">
                                                                {habito.descripcion_larga}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Stats de racha */}
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between text-sm">
                                                    <div className="text-center flex-1">
                                                        <div className={`text-xl font-bold ${habito.racha_actual > 0 ? 'text-emerald-600' : 'text-gray-400'
                                                            }`}>
                                                            {habito.racha_actual}
                                                        </div>
                                                        <div className="text-xs text-gray-500">Racha actual</div>
                                                    </div>
                                                    <div className="h-8 w-px bg-gray-200"></div>
                                                    <div className="text-center flex-1">
                                                        <div className="text-xl font-bold text-purple-600">
                                                            {habito.racha_maxima}
                                                        </div>
                                                        <div className="text-xs text-gray-500">Récord</div>
                                                    </div>
                                                    <div className="h-8 w-px bg-gray-200"></div>
                                                    <div className="text-center flex-1">
                                                        <div className="text-xl font-bold text-blue-600">
                                                            {habito.estado === 'completado' ? '✓' : '○'}
                                                        </div>
                                                        <div className="text-xs text-gray-500">Hoy</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Botones de acción */}
                                            <div className="flex gap-2 pt-4 border-t border-gray-100">
                                                <Button
                                                    onClick={() => marcarCompletado(habito.id)}
                                                    disabled={completando === habito.id}
                                                    variant={habito.estado === 'completado' ? 'outline' : 'primary'}
                                                    className={`flex-1 ${habito.estado === 'completado'
                                                        ? 'border-green-500 text-green-600 hover:bg-green-50'
                                                        : 'bg-emerald-500 hover:bg-emerald-600'
                                                        }`}
                                                >
                                                    {completando === habito.id ? (
                                                        <span className="flex items-center justify-center gap-2">
                                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                            </svg>
                                                            Procesando...
                                                        </span>
                                                    ) : (
                                                        habito.estado === 'completado' ? 'Desmarcar' : '✓ Completar hoy'
                                                    )}
                                                </Button>

                                                <div className="flex gap-2">
                                                    {/* Botón de editar - deshabilitado para predeterminados */}
                                                    <div className="relative group">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                if (!habito.es_predeterminado) {
                                                                    setHabitoAEditar(habito);
                                                                    setModalEditarAbierto(true);
                                                                }
                                                            }}
                                                            disabled={habito.es_predeterminado}
                                                            className={`h-10 w-10 flex items-center justify-center rounded-lg ${habito.es_predeterminado
                                                                ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                                                                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                                                                }`}
                                                            title={habito.es_predeterminado
                                                                ? "Los hábitos del catálogo no se pueden editar"
                                                                : "Editar hábito"
                                                            }
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </Button>

                                                        {/* Tooltip solo para hábitos predeterminados */}
                                                        {habito.es_predeterminado && (
                                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                                                Este hábito del catálogo no se puede editar
                                                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800"></div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => eliminarHabito(habito.id)}
                                                        className="h-10 w-10 flex items-center justify-center rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50"
                                                        title="Eliminar hábito"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Modal de edición */}
            <Modal
                isOpen={modalEditarAbierto}
                onClose={() => {
                    setModalEditarAbierto(false);
                    setHabitoAEditar(null);
                }}
                title="Editar Hábito"
                size="md"
            >
                {habitoAEditar && (
                    <HabitForm
                        mode="edit"
                        initialData={{
                            nombre: habitoAEditar.nombre,
                            descripcion: habitoAEditar.descripcion_breve || habitoAEditar.descripcion
                        }}
                        onSubmit={editarHabito}
                        onCancel={() => {
                            setModalEditarAbierto(false);
                            setHabitoAEditar(null);
                        }}
                        showCategory={false}
                    />
                )}
            </Modal>
        </div>
    );
}