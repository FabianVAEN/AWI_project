import React, { useState, useEffect } from 'react';
import { Card, Button, LoadingScreen, HabitForm } from '../components/common';
import HabitService from '../services/habitService';

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [habitos, setHabitos] = useState([]);
    const [listaHabitos, setListaHabitos] = useState([]);
    const [error, setError] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editando, setEditando] = useState(null);

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
            setShowCreateForm(false);
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
            await HabitService.updateHabit(editando.id, formData);
            setEditando(null);
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

                {/* Crear hábito personalizado */}
                <div className="mb-12">
                    <div className="text-center mb-6">
                        <Button
                            variant={showCreateForm ? 'secondary' : 'primary'}
                            onClick={() => setShowCreateForm(!showCreateForm)}
                        >
                            {showCreateForm ? 'Cancelar' : '+ Crear Hábito Personalizado'}
                        </Button>
                    </div>

                    {showCreateForm && (
                        <HabitForm
                            mode="create"
                            initialData={{ nombre: '', descripcion_breve: '' }}
                            onSubmit={crearHabitoPersonalizado}
                            onCancel={() => setShowCreateForm(false)}
                            isSubmitting={isSubmitting}
                            title="Crear Hábito Personalizado"
                        />
                    )}
                </div>

                {/* Editar hábito */}
                {editando && (
                    <div className="mb-12">
                        <HabitForm
                            mode="edit"
                            initialData={{
                                nombre: editando.nombre,
                                descripcion_breve: editando.descripcion_breve || editando.descripcion
                            }}
                            onSubmit={editarHabito}
                            onCancel={() => setEditando(null)}
                            isSubmitting={isSubmitting}
                            title="Editar Hábito"
                        />
                    </div>
                )}

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
                                            onClick={() => !habito.es_predeterminado && setEditando(habito)}
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
            </div>
        </div>
    );
}