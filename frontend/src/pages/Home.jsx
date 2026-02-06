import React, { useState, useEffect } from 'react';
import { Card, Button, LoadingScreen, HabitForm, Modal } from '../components/common';
import HabitService from '../services/habitService';

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [habitos, setHabitos] = useState([]);
    const [listaHabitos, setListaHabitos] = useState([]);
    const [error, setError] = useState('');
    const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
    const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [habitoAEditar, setHabitoAEditar] = useState(null);
    const [categoriaActiva, setCategoriaActiva] = useState('Todas');
    const [expandedCatalog, setExpandedCatalog] = useState({});
    const [expandedLista, setExpandedLista] = useState({});

    useEffect(() => {
        // Pantalla de carga por 2 segundos
        const timer = setTimeout(() => {
            setLoading(false);
            cargarDatos();
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const cargarDatos = async () => {
        try {
            setError('');
            const [habitosData, listaData] = await Promise.all([
                HabitService.getAllDefaults(),
                HabitService.getUserHabits()
            ]);

            setHabitos(habitosData);
            // Ordenar por ID para mantener orden consistente
            const listaOrdenada = listaData.sort((a, b) => a.id - b.id);
            setListaHabitos(listaOrdenada);
        } catch (err) {
            setError('Error de conexión. Verifica que el servidor esté corriendo.');
            console.error(err);
        }
    };

    const agregarHabito = async (habitoId) => {
        try {
            setError('');
            await HabitService.addHabitFromCatalog(habitoId);
            await cargarDatos();
        } catch (err) {
            setError(err.message);
        }
    };

    const crearHabitoPersonalizado = async (formData) => {
        try {
            setIsSubmitting(true);
            setError('');
            await HabitService.createCustomHabit(formData);
            setModalCrearAbierto(false);
            await cargarDatos();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const editarHabito = async (formData) => {
        try {
            setError('');
            await HabitService.updateHabit(habitoAEditar.id, formData);
            setModalEditarAbierto(false);
            setHabitoAEditar(null);
            await cargarDatos();
        } catch (err) {
            setError('Error al editar hábito');
        }
    };

    const marcarCompletado = async (id) => {
        try {
            setError('');
            // Obtener el hábito actual
            const habitoActual = listaHabitos.find(h => h.id === id);
            if (!habitoActual) return;

            // Alternar estado
            const nuevoEstado = habitoActual.estado === 'completado' ? 'pendiente' : 'completado';

            await HabitService.toggleHabitStatus(id, nuevoEstado);
            await cargarDatos(); // Esto recarga los datos
        } catch (err) {
            setError('Error al cambiar estado del hábito');
            console.error(err);
        }
    };

    const eliminarHabito = async (id) => {
        if (confirm('¿Estás seguro de que deseas eliminar este hábito?')) {
            try {
                setError('');
                await HabitService.deleteHabit(id);
                await cargarDatos();
            } catch (err) {
                setError('Error al eliminar hábito');
            }
        }
    };

    if (loading) {
        return <LoadingScreen title="AWI" variant="splash" />;
    }

    const habitosYaAgregados = listaHabitos
        .filter(h => h.habito_id !== null)
        .map(h => h.habito_id);

    const categorias = ['Todas', ...Array.from(new Set(
        habitos.map(h => (h.categoria?.nombre || 'Sin Categoría'))
    ))];

    const habitosFiltrados = categoriaActiva === 'Todas'
        ? habitos
        : habitos.filter(h => (h.categoria?.nombre || 'Sin Categoría') === categoriaActiva);

    const toggleCatalogDescripcion = (id) => {
        setExpandedCatalog(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const toggleListaDescripcion = (id) => {
        setExpandedLista(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 mb-2">
                        Bienvenido a AWI
                    </h1>
                    <p className="text-gray-600 text-lg">Construye hábitos saludables y sostenibles</p>
                </div>

                {/* Error message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
                        <span>⚠️</span>
                        {error}
                    </div>
                )}

                {/* Hábitos disponibles */}
                <div className="mb-12">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                        Hábitos Disponibles
                    </h2>
                    {/* Filtros de categoría */}
                    {categorias.length > 1 && (
                        <div className="flex flex-wrap justify-center gap-2 mb-6">
                            {categorias.map((categoria) => (
                                <Button
                                    key={categoria}
                                    variant={categoriaActiva === categoria ? 'primary' : 'ghost'}
                                    size="sm"
                                    onClick={() => setCategoriaActiva(categoria)}
                                >
                                    {categoria}
                                </Button>
                            ))}
                        </div>
                    )}
                    {habitos.length === 0 ? (
                        <Card variant="warning" className="text-center">
                            <p className="text-gray-600">No hay hábitos disponibles en el catálogo</p>
                        </Card>
                    ) : (
                        <div className="overflow-x-auto pb-4">
                            <div className="flex gap-4 min-w-max px-4 items-stretch">
                                {habitosFiltrados.map((habito) => {
                                    const yaAgregado = habitosYaAgregados.includes(habito.id);
                                    return (
                                        <div
                                            key={habito.id}
                                            className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-200 hover:shadow-xl transition-all flex flex-col"
                                        >
                                            {/* Header de la tarjeta */}
                                            <div className={`p-4 ${yaAgregado ? 'bg-gray-200' : 'bg-gradient-to-r from-emerald-500 to-teal-500'}`}>
                                                <h3 className={`text-lg font-bold ${yaAgregado ? 'text-gray-700' : 'text-white'}`}>
                                                    {habito.nombre}
                                                </h3>
                                                {habito.categoria && (
                                                    <span className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full ${yaAgregado
                                                        ? 'bg-gray-300 text-gray-700'
                                                        : 'bg-white/20 text-white'
                                                        }`}>
                                                        {habito.categoria.nombre}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Contenido de la tarjeta */}
                                            <div className="p-4 flex-1 flex flex-col">
                                                <div className="flex-1">
                                                    <p className="text-gray-700 text-sm mb-3">
                                                        {habito.descripcion_breve}
                                                    </p>

                                                    {/* Botón "Saber más" */}
                                                    {habito.descripcion_larga && (
                                                        <div className="mb-3">
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleCatalogDescripcion(habito.id)}
                                                                className="text-emerald-700 text-xs font-medium underline underline-offset-2 hover:text-emerald-800 transition-colors"
                                                            >
                                                                {expandedCatalog[habito.id] ? '▲ Ver menos' : '▼ Saber más'}
                                                            </button>
                                                            {expandedCatalog[habito.id] && (
                                                                <p className="text-gray-600 text-sm mt-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                                                                    {habito.descripcion_larga}
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Botón de acción */}
                                                <Button
                                                    variant={yaAgregado ? 'ghost' : 'primary'}
                                                    size="sm"
                                                    onClick={() => !yaAgregado && agregarHabito(habito.id)}
                                                    disabled={yaAgregado}
                                                    className="w-full mt-auto"
                                                >
                                                    {yaAgregado ? '✓ Ya está en tu lista' : '+ Agregar a mi lista'}
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Botón destacado para crear hábito personalizado */}
                <div className="mb-12">
                    <div className="max-w-2xl mx-auto bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-8 shadow-xl">
                        <div className="text-center text-white">
                            <h3 className="text-2xl font-bold mb-3">
                                ¿No encuentras el hábito perfecto?
                            </h3>
                            <p className="mb-6 text-emerald-50">
                                Crea tu propio hábito personalizado y adáptalo a tus necesidades
                            </p>
                            <button
                                onClick={() => setModalCrearAbierto(true)}
                                className="bg-white text-emerald-600 font-bold px-8 py-3 rounded-full hover:bg-emerald-50 transform hover:scale-105 transition-all duration-300 shadow-lg inline-flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Crear Mi Hábito Personalizado
                            </button>
                        </div>
                    </div>
                </div>

                {/* Crear hábito personalizado */}
                <div className="fixed bottom-8 right-8 z-50 group">
                    {/* Tooltip */}
                    <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Crear Hábito Rápido
                        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                    </div>

                    {/* Botón */}
                    <button
                        onClick={() => setModalCrearAbierto(true)}
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-4 rounded-full shadow-2xl hover:shadow-emerald-500/50 hover:scale-110 transition-all duration-300"
                        aria-label="Crear Hábito Personalizado"
                    >
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>

                {/* Mi Lista de Hábitos */}
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                        Mi Lista de Hábitos
                    </h2>
                    {listaHabitos.length === 0 ? (
                        <Card className="text-center">
                            <p className="text-gray-600">Aún no has agregado hábitos. ¡Comienza ahora!</p>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {listaHabitos.map((habito) => (
                                <Card key={habito.id} className="flex flex-col">
                                    <div className="flex-1">
                                        {/* Estado del hábito - NUEVO */}
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                {habito.nombre}
                                            </h3>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${habito.estado === 'completado'
                                                ? 'bg-green-100 text-green-800 border border-green-200'
                                                : 'bg-yellow-100 text-yellow-800 border border-yellow-200'}`}>
                                                {habito.estado === 'completado' ? '✓ Completado' : '⏳ Pendiente'}
                                            </span>
                                        </div>

                                        {/* Descripción breve - NUEVO */}
                                        <p className="text-gray-600 text-sm mb-2">
                                            {habito.descripcion_breve || habito.descripcion}
                                        </p>
                                        {habito.descripcion_larga && (
                                            <div className="mb-2">
                                                <button
                                                    type="button"
                                                    onClick={() => toggleListaDescripcion(habito.id)}
                                                    className="text-emerald-700 text-xs underline underline-offset-2"
                                                >
                                                    {expandedLista[habito.id] ? 'Ver menos' : 'Ver más'}
                                                </button>
                                                {expandedLista[habito.id] && (
                                                    <p className="text-gray-600 text-lg mt-2">
                                                        {habito.descripcion_larga}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                        {/* Racha */}

                                        {habito.racha_actual > 0 && (
                                            <div className="mb-4 p-2 bg-emerald-50 rounded-lg">
                                                <p className="text-sm text-emerald-700">
                                                    🔥 Racha: {habito.racha_actual} días
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Botones - MODIFICADO */}
                                    <div className="flex gap-2 pt-4 border-t">
                                        <Button
                                            variant={habito.estado === 'completado' ? 'secondary' : 'success'}
                                            size="sm"
                                            onClick={() => marcarCompletado(habito.id)}
                                            className="flex-1"
                                        >
                                            {habito.estado === 'completado' ? '↶ Pendiente' : '✓ Completar'}
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => {
                                                if (!habito.es_predeterminado) {
                                                    setHabitoAEditar(habito);
                                                    setModalEditarAbierto(true);
                                                }
                                            }}
                                            className="flex-1"
                                            disabled={habito.es_predeterminado}
                                        >
                                            {habito.es_predeterminado ? 'No editable' : 'Editar'}
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => eliminarHabito(habito.id)}
                                            className="flex-1"
                                        >
                                            Eliminar
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
                {/* Modal para crear hábito */}
                <Modal
                    isOpen={modalCrearAbierto}
                    onClose={() => setModalCrearAbierto(false)}
                    title="Crear Hábito Personalizado"
                >
                    <HabitForm
                        mode="create"
                        initialData={{ nombre: '', descripcion: '' }}
                        onSubmit={crearHabitoPersonalizado}
                        onCancel={() => setModalCrearAbierto(false)}
                        isSubmitting={isSubmitting}
                        showCategory={true}
                    />
                </Modal>

                {/* Modal para editar hábito */}
                <Modal
                    isOpen={modalEditarAbierto}
                    onClose={() => {
                        setModalEditarAbierto(false);
                        setHabitoAEditar(null);
                    }}
                    title="Editar Hábito"
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
                            isSubmitting={isSubmitting}
                            showCategory={false}
                        />
                    )}
                </Modal>
            </div>
        </div>
    );
}
