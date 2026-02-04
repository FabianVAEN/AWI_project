import React, { useState, useEffect } from 'react';
import AdminService from '../services/adminService';
import { Button, Input, LoadingScreen } from '../components/common';

export default function AdminHabits() {
    const [habitos, setHabitos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion_breve: '',
        descripcion_larga: '',
        categoria_id: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [habitosData, categoriasData] = await Promise.all([
                AdminService.getAllHabits(),
                AdminService.getAllCategories()
            ]);
            setHabitos(habitosData);
            setCategorias(categoriasData);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await AdminService.updateHabit(editingId, formData);
            } else {
                await AdminService.createHabit(formData);
            }
            setFormData({
                nombre: '',
                descripcion_breve: '',
                descripcion_larga: '',
                categoria_id: ''
            });
            setShowForm(false);
            setEditingId(null);
            await loadData();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEdit = (habito) => {
        setFormData({
            nombre: habito.nombre,
            descripcion_breve: habito.descripcion_breve,
            descripcion_larga: habito.descripcion_larga || '',
            categoria_id: habito.categoria_id || ''
        });
        setEditingId(habito.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este hábito?')) {
            try {
                await AdminService.deleteHabit(id);
                await loadData();
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({
            nombre: '',
            descripcion_breve: '',
            descripcion_larga: '',
            categoria_id: ''
        });
    };

    if (loading) return <LoadingScreen />;

    const getCategoryName = (id) => {
        const cat = categorias.find(c => c.id === id);
        return cat ? cat.nombre : 'Sin categoría';
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800">Gestionar Hábitos</h1>
                    <p className="text-gray-600 mt-2">Total: {habitos.length} hábitos</p>
                </div>
                <Button 
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    {showForm ? 'Cancelar' : '+ Nuevo Hábito'}
                </Button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {/* Formulario */}
            {showForm && (
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">
                        {editingId ? 'Editar Hábito' : 'Nuevo Hábito'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Nombre"
                            type="text"
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            required
                            placeholder="Ej: Caminar 10,000 pasos"
                        />
                        <Input
                            label="Descripción Breve"
                            type="text"
                            value={formData.descripcion_breve}
                            onChange={(e) => setFormData({ ...formData, descripcion_breve: e.target.value })}
                            required
                            placeholder="Máximo 255 caracteres"
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción Larga
                            </label>
                            <textarea
                                value={formData.descripcion_larga}
                                onChange={(e) => setFormData({ ...formData, descripcion_larga: e.target.value })}
                                placeholder="Descripción detallada del hábito"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows="4"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Categoría
                            </label>
                            <select
                                value={formData.categoria_id}
                                onChange={(e) => setFormData({ ...formData, categoria_id: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Seleccionar categoría</option>
                                {categorias.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-4">
                            <Button type="submit" className="bg-green-600 hover:bg-green-700">
                                {editingId ? 'Actualizar' : 'Crear'}
                            </Button>
                            <Button 
                                type="button"
                                onClick={handleCancel}
                                className="bg-gray-400 hover:bg-gray-500"
                            >
                                Cancelar
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Lista de Hábitos */}
            <div className="space-y-4">
                {habitos.map((habito) => (
                    <div key={habito.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-800">{habito.nombre}</h3>
                                <p className="text-gray-600 text-sm mt-2">{habito.descripcion_breve}</p>
                                {habito.descripcion_larga && (
                                    <p className="text-gray-500 text-sm mt-2 italic">{habito.descripcion_larga.substring(0, 100)}...</p>
                                )}
                            </div>
                            <div className="text-right">
                                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                                    {getCategoryName(habito.categoria_id)}
                                </span>
                                {habito.es_predeterminado && (
                                    <span className="ml-2 inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                                        Predeterminado
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => handleEdit(habito)}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm"
                            >
                                Editar
                            </Button>
                            <Button
                                onClick={() => handleDelete(habito.id)}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-sm"
                            >
                                Eliminar
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {habitos.length === 0 && !showForm && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No hay hábitos aún</p>
                </div>
            )}
        </div>
    );
}
