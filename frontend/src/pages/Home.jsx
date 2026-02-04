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
            setListaHabitos(listaData);
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
                    {habitos.length === 0 ? (
                        <Card variant="warning" className="text-center">
                            <p className="text-gray-600">No hay hábitos disponibles en el catálogo</p>
                        </Card>
                    ) : (
                        <div className="overflow-x-auto pb-4">
                            <div className="flex gap-4 min-w-max px-4">
                                {habitos.map((habito) => {
                                    const yaAgregado = habitosYaAgregados.includes(habito.id);
                                    return (
                                        <button
                                            key={habito.id}
                                            onClick={() => !yaAgregado && agregarHabito(habito.id)}
                                            disabled={yaAgregado}
                                            className={`flex-shrink-0 w-64 p-6 rounded-xl shadow-lg transition-all transform hover:scale-105 ${yaAgregado
                                                ? 'bg-gray-300 cursor-not-allowed opacity-60'
                                                : 'bg-gradient-to-br from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 cursor-pointer'
                                                }`}
                                        >
                                            <h3 className="text-white font-bold text-lg mb-2">
                                                {habito.nombre}
                                            </h3>
                                            <p className="text-white text-sm opacity-90">
                                                {habito.descripcion_breve}
                                            </p>
                                            {yaAgregado && (
                                                <span className="inline-block mt-3 px-3 py-1 bg-white text-gray-700 text-xs rounded-full">
                                                    ✓ Agregado
                                                </span>
                                            )}
                                        </button>
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
                <button
                    onClick={() => setModalCrearAbierto(true)}
                    className="fixed bottom-8 right-8 bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-4 rounded-full shadow-2xl hover:shadow-emerald-500/50 hover:scale-110 transition-all duration-300 z-40"
                    title="Crear Hábito Personalizado"
                >
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </button>

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
