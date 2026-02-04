import React, { useState, useEffect } from 'react';
import AdminService from '../services/adminService';
import { Button, Input, LoadingScreen } from '../components/common';

export default function AdminCategories() {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        icono: ''
    });

    useEffect(() => {
        loadCategorias();
    }, []);

    const loadCategorias = async () => {
        try {
            setLoading(true);
            const data = await AdminService.getAllCategories();
            setCategorias(data);
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
                await AdminService.updateCategory(editingId, formData);
            } else {
                await AdminService.createCategory(formData);
            }
            setFormData({ nombre: '', descripcion: '', icono: '' });
            setShowForm(false);
            setEditingId(null);
            await loadCategorias();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEdit = (categoria) => {
        setFormData({
            nombre: categoria.nombre,
            descripcion: categoria.descripcion || '',
            icono: categoria.icono || ''
        });
        setEditingId(categoria.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
            try {
                await AdminService.deleteCategory(id);
                await loadCategorias();
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({ nombre: '', descripcion: '', icono: '' });
    };

    if (loading) return <LoadingScreen />;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800">Gestionar Categorías</h1>
                    <p className="text-gray-600 mt-2">Total: {categorias.length} categorías</p>
                </div>
                <Button 
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    {showForm ? 'Cancelar' : '+ Nueva Categoría'}
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
                        {editingId ? 'Editar Categoría' : 'Nueva Categoría'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Nombre"
                            type="text"
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            required
                            placeholder="Ej: Movimiento Verde"
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción
                            </label>
                            <textarea
                                value={formData.descripcion}
                                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                placeholder="Descripción de la categoría"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows="3"
                            />
                        </div>
                        <Input
                            label="Icono (FontAwesome class)"
                            type="text"
                            value={formData.icono}
                            onChange={(e) => setFormData({ ...formData, icono: e.target.value })}
                            placeholder="Ej: fa-bicycle"
                        />
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

            {/* Lista de Categorías */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categorias.map((categoria) => (
                    <div key={categoria.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">{categoria.nombre}</h3>
                                {categoria.icono && (
                                    <p className="text-sm text-gray-500 mt-1">Icono: {categoria.icono}</p>
                                )}
                            </div>
                            {categoria.icono && (
                                <div className="text-3xl">
                                    <i className={`fas ${categoria.icono}`}></i>
                                </div>
                            )}
                        </div>
                        {categoria.descripcion && (
                            <p className="text-gray-600 mb-4 text-sm">{categoria.descripcion}</p>
                        )}
                        <p className="text-sm text-gray-500 mb-4">
                            {categoria.habitos?.length || 0} hábito(s)
                        </p>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => handleEdit(categoria)}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm"
                            >
                                Editar
                            </Button>
                            <Button
                                onClick={() => handleDelete(categoria.id)}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-sm"
                            >
                                Eliminar
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {categorias.length === 0 && !showForm && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No hay categorías aún</p>
                </div>
            )}
        </div>
    );
}
