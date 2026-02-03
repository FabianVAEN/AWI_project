import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '../components/common';
import HabitService from '../services/habitService';

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [habitos, setHabitos] = useState([]);
    const [listaHabitos, setListaHabitos] = useState([]);
    const [error, setError] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({ nombre: '', descripcion: '' });
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

    const crearHabitoPersonalizado = async (e) => {
        e.preventDefault();
        if (!formData.nombre.trim()) {
            setError('El nombre del hábito es obligatorio');
            return;
        }

        try {
            setIsSubmitting(true);
            setError('');
            await HabitService.createCustomHabit(formData);
            setFormData({ nombre: '', descripcion: '' });
            setShowCreateForm(false);
            await cargarDatos();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const editarHabito = async (e) => {
        e.preventDefault();
        try {
            setError('');
            await HabitService.updateHabit(editando.id, {
            nombre: editando.nombre,
            descripcion: editando.descripcion
            });
            setEditando(null);
            await cargarDatos();
        } catch (err) {
            setError('Error al editar hábito');
        }
        };

    const cambiarEstado = async (id, nuevoEstado) => {
        try {
            setError('');
            await HabitService.updateHabit(id, { estado: nuevoEstado });
            await cargarDatos();
        } catch (err) {
            setError('Error al actualizar estado');
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
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-8xl font-bold text-white mb-4 animate-pulse">AWI</h1>
                    <div className="flex justify-center gap-2">
                        <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
                        <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                </div>
            </div>
        );
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
                                                {habito.descripcion}
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
                        <Card className="max-w-2xl mx-auto">
                            <form onSubmit={crearHabitoPersonalizado} className="space-y-4">
                                <Input
                                    label="Nombre del Hábito"
                                    placeholder="Ej: Meditar 20 minutos"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Descripción"
                                    placeholder="Ej: Práctica diaria de meditación"
                                    type="textarea"
                                    value={formData.descripcion}
                                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                />
                                <div className="flex gap-3 justify-end">
                                    <Button
                                        variant="secondary"
                                        onClick={() => {
                                            setShowCreateForm(false);
                                            setFormData({ nombre: '', descripcion: '' });
                                        }}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant="success"
                                        type="submit"
                                        isLoading={isSubmitting}
                                    >
                                        Crear Hábito
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    )}
                </div>

                 {editando && (
                <Card className="max-w-2xl mx-auto mb-6">
                    <h3 className="text-xl font-bold mb-4">Editar Hábito</h3>
                    <form onSubmit={editarHabito} className="space-y-4">
                    <Input
                        label="Nombre"
                        value={editando.nombre}
                        onChange={(e) => setEditando({...editando, nombre: e.target.value})}
                        required
                    />
                    <Input
                        label="Descripción"
                        type="textarea"
                        value={editando.descripcion}
                        onChange={(e) => setEditando({...editando, descripcion: e.target.value})}
                    />
                    <div className="flex gap-3 justify-end">
                        <Button variant="secondary" onClick={() => setEditando(null)}>
                        Cancelar
                        </Button>
                        <Button variant="success" type="submit">
                        Guardar Cambios
                        </Button>
                    </div>
                    </form>
                </Card>
)}

                {/* Lista de hábitos del usuario */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                        Mi Lista de Hábitos ({listaHabitos.length})
                    </h2>

                    {listaHabitos.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-400 text-lg">
                                Tu lista está vacía. Agrega hábitos desde arriba para comenzar.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {listaHabitos.map((habito) => (
                                <div
                                    key={habito.id}
                                    className={`p-5 rounded-lg border-2 transition-all ${habito.estado === 'hecho'
                                        ? 'bg-green-50 border-green-300'
                                        : 'bg-gray-50 border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3
                                                className={`text-lg font-semibold ${habito.estado === 'hecho' ? 'line-through text-gray-500' : 'text-gray-800'
                                                    }`}
                                            >
                                                {habito.nombre}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {habito.descripcion}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Button
                                                size="sm"
                                                variant={habito.estado === 'hecho' ? 'secondary' : 'success'}
                                                onClick={() =>
                                                    cambiarEstado(
                                                        habito.id,
                                                        habito.estado === 'por hacer' ? 'hecho' : 'por hacer'
                                                    )
                                                }
                                            >
                                                {habito.estado === 'hecho' ? 'Desmarcar' : 'Completar'}
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="danger"
                                                onClick={() => eliminarHabito(habito.id)}
                                            >
                                                Eliminar
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => setEditando({
                                                    id: habito.id,
                                                    nombre: habito.nombre,
                                                    descripcion: habito.descripcion
                                                })}
                                                >
                                                Editar
                                            </Button>

                                            <span
                                                className={`px-4 py-2 rounded-full text-sm font-medium ${habito.estado === 'hecho'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-orange-100 text-orange-800'
                                                    }`}
                                            >
                                                {habito.estado === 'hecho' ? '✓ Hecho' : '○ Por hacer'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}