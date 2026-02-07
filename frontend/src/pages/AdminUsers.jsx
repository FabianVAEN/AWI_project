import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminService from '../services/adminService';
import { Button, LoadingScreen } from '../components/common';

export default function AdminUsers() {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadUsuarios();
    }, []);

    const loadUsuarios = async () => {
        try {
            setLoading(true);
            const data = await AdminService.getAllUsers();
            setUsuarios(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleAdmin = async (userId, currentStatus) => {
        try {
            await AdminService.updateUserRole(userId, !currentStatus);
            await loadUsuarios();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.')) {
            try {
                await AdminService.deleteUser(userId);
                await loadUsuarios();
            } catch (err) {
                setError(err.message);
            }
        }
    };

    if (loading) return <LoadingScreen />;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <button
                            onClick={() => navigate('/admin')}
                            className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 text-lg font-semibold hover:underline"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Atras
                        </button>
                <h1 className="text-4xl font-bold text-gray-800">Gestionar Usuarios</h1>
                <p className="text-gray-600 mt-2">Total: {usuarios.length} usuario(s)</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {/* Tabla de Usuarios */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Usuario</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Hábitos</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Rol</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((usuario) => (
                                <tr key={usuario.id} className="border-b hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                        {usuario.username}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {usuario.email}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {usuario.primer_nombre} {usuario.segundo_nombre || ''}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {usuario.suscripciones?.length || 0}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {usuario.es_admin ? (
                                            <span className="inline-block bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full">
                                                Administrador
                                            </span>
                                        ) : (
                                            <span className="inline-block bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
                                                Usuario
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm space-x-2">
                                        <button
                                            onClick={() => handleToggleAdmin(usuario.id, usuario.es_admin)}
                                            className={`px-3 py-1 rounded text-white text-xs font-semibold transition ${
                                                usuario.es_admin
                                                    ? 'bg-orange-600 hover:bg-orange-700'
                                                    : 'bg-green-600 hover:bg-green-700'
                                            }`}
                                        >
                                            {usuario.es_admin ? 'Revocar Admin' : 'Hacer Admin'}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(usuario.id)}
                                            className="px-3 py-1 rounded text-white text-xs font-semibold bg-red-600 hover:bg-red-700 transition"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {usuarios.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No hay usuarios registrados</p>
                </div>
            )}
        </div>
    );
}
