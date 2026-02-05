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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [habitoAEditar, setHabitoAEditar] = useState(null);
    const [expandedLista, setExpandedLista] = useState({});

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            cargarDatos();
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const cargarDatos = async () => {
        try {
            setError('');
            const listaData = await HabitService.getUserHabits();
            setListaHabitos(listaData);
        } catch (err) {
            setError('Error de conexión. Verifica que el servidor esté corriendo.');
            console.error(err);
        }
    };

    const marcarCompletado = async (id) => {
        try {
            setError('');
            const habitoActual = listaHabitos.find(h => h.id === id);
            if (!habitoActual) return;

            const nuevoEstado = habitoActual.estado === 'completado' ? 'pendiente' : 'completado';
            await HabitService.toggleHabitStatus(id, nuevoEstado);
            await cargarDatos();
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

    const editarHabito = async (formData) => {
        try {
            setIsSubmitting(true);
            setError('');
            await HabitService.updateHabit(habitoAEditar.id, formData);
            setModalEditarAbierto(false);
            setHabitoAEditar(null);
            await cargarDatos();
        } catch (err) {
            setError('Error al editar hábito');
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleListaDescripcion = (id) => {
            setExpandedLista(prev => ({ ...prev, [id]: !prev[id] }));
    };

    if (loading) {
        return <LoadingScreen title="AWI" variant="splash" />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 text-sm font-semibold"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Volver al inicio
                    </button>
                </div>
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 mb-2">
                        Mi Lista de Hábitos
                    </h1>
                    <p className="text-gray-600 text-lg">Aquí están los hábitos que has agregado</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
                        <span>⚠️</span>
                        {error}
                    </div>
                )}

                {listaHabitos.length === 0 ? (
                    <Card className="text-center">
                        <p className="text-gray-600">Aún no has agregado hábitos. ¡Comienza ahora!</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {listaHabitos.map((habito) => (
                            <Card key={habito.id} className="flex flex-col">
                                <div className="flex-1">
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

                                    {habito.racha_actual > 0 && (
                                        <div className="mb-4 p-2 bg-emerald-50 rounded-lg">
                                            <p className="text-sm text-emerald-700">
                                                🔥 Racha: {habito.racha_actual} días
                                            </p>
                                        </div>
                                    )}
                                </div>

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
                                            setHabitoAEditar(habito);
                                            setModalEditarAbierto(true);
                                        }}
                                        className="flex-1"
                                    >
                                        Editar
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
    );
}