import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminService from '../services/adminService';
import { Button, Input, LoadingScreen } from '../components/common';
import Modal from '../components/common/Modal';

export default function AdminHabits() {
    const navigate = useNavigate();
    const [habitos, setHabitos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
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
            setShowModal(false);
            resetForm();
            await loadData();
        } catch (err) {
            setError(err.message);
        }
    };

    const resetForm = () => {
        setFormData({
            nombre: '',
            descripcion_breve: '',
            descripcion_larga: '',
            categoria_id: ''
        });
        setEditingId(null);
    };

    const handleOpenCreate = () => {
        resetForm();
        setShowModal(true);
    };

    const handleOpenEdit = (habito) => {
        setFormData({
            nombre: habito.nombre,
            descripcion_breve: habito.descripcion_breve,
            descripcion_larga: habito.descripcion_larga || '',
            categoria_id: habito.categoria_id || ''
        });
        setEditingId(habito.id);
        setShowModal(true);
    };

    const handleDelete = async (id, esPredeterminado = false) => {
        const message = esPredeterminado 
            ? '⚠️ Este hábito es predeterminado. ¿Seguro que quieres eliminarlo? Esto podría afectar a usuarios existentes.'
            : '¿Estás seguro de que deseas eliminar este hábito?';
        
        if (window.confirm(message)) {
            try {
                await AdminService.deleteHabit(id);
                await loadData();
            } catch (err) {
                setError(err.message || 'No se pudo eliminar el hábito');
            }
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        resetForm();
    };

    if (loading) return <LoadingScreen />;

    const getCategoryName = (id) => categorias.find(c => c.id === id)?.nombre || 'Sin categoría';

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <button
                        onClick={() => navigate('/admin')}
                        className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 text-lg font-semibold"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Atrás
                    </button>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2">Gestionar Hábitos</h1>
                    <p className="text-gray-600 mt-1">Total: {habitos.length} hábitos</p>
                </div>
                <Button 
                    onClick={handleOpenCreate}
                    className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                >
                    + Nuevo Hábito
                </Button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {/* Modal */}
            <Modal
                isOpen={showModal}
                onClose={handleCloseModal}
                title={editingId ? 'Editar Hábito' : 'Nuevo Hábito'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Nombre"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        required
                        placeholder="Ej: Caminar 10,000 pasos"
                    />
                    <Input
                        label="Descripción Breve"
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
                            placeholder="Descripción detallada (opcional)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            rows="4"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Categoría *
                        </label>
                        <select
                            value={formData.categoria_id}
                            onChange={(e) => setFormData({ ...formData, categoria_id: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Seleccionar categoría</option>
                            {categorias.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.emoji} {cat.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-3 pt-4 border-t">
                        <Button 
                            type="button"
                            onClick={handleCloseModal}
                            className="bg-gray-400 hover:bg-gray-500 flex-1"
                        >
                            Cancelar
                        </Button>
                        <Button 
                            type="submit" 
                            className="bg-green-600 hover:bg-green-700 flex-1"
                        >
                            {editingId ? 'Actualizar' : 'Crear'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Lista */}
            {habitos.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">No hay hábitos</h3>
                    <Button
                        onClick={handleOpenCreate}
                        className="bg-blue-500 hover:bg-blue-600 text-white mt-4"
                    >
                        Crear Primer Hábito
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {habitos.map((habito) => (
                        <div key={habito.id} className="bg-white rounded-lg shadow hover:shadow-md border p-4">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="font-bold text-gray-800">{habito.nombre}</h3>
                                <div className="flex gap-2">
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                        {getCategoryName(habito.categoria_id)}
                                    </span>
                                    {habito.es_predeterminado && (
                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                            Predeterminado
                                        </span>
                                    )}
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">{habito.descripcion_breve}</p>
                            {habito.descripcion_larga && (
                                <p className="text-gray-500 text-xs mb-4 line-clamp-2">
                                    {habito.descripcion_larga}
                                </p>
                            )}
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => handleOpenEdit(habito)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm flex-1"
                                >
                                    Editar
                                </Button>
                                <Button
                                    onClick={() => handleDelete(habito.id, habito.es_predeterminado)}
                                    className="bg-red-500 hover:bg-red-600 text-white text-sm flex-1"
                                >
                                    Eliminar
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}