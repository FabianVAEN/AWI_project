import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminService from '../services/adminService';
import { Button, LoadingScreen } from '../components/common';

export default function AdminUsers() {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRol, setFilterRol] = useState('todos');

    // Usar useMemo para filtrar usuarios sin estado adicional
    const filteredUsuarios = useMemo(() => {
        if (!usuarios.length) return [];
        
        return usuarios.filter(usuario => {
            // Filtrar por término de búsqueda
            const matchesSearch = !searchTerm.trim() || 
                [usuario.username, usuario.email, usuario.primer_nombre, usuario.segundo_nombre]
                    .some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()));
            
            // Filtrar por rol
            const matchesRol = filterRol === 'todos' || 
                (filterRol === 'admin' ? usuario.es_admin : !usuario.es_admin);
            
            return matchesSearch && matchesRol;
        });
    }, [usuarios, searchTerm, filterRol]);

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

    const handleClearFilters = () => {
        setSearchTerm('');
        setFilterRol('todos');
    };

    if (loading) return <LoadingScreen />;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
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
                <p className="text-gray-600 mt-2">
                    Mostrando: {filteredUsuarios.length} de {usuarios.length} usuario(s)
                </p>
            </div>

            {/* Mensaje de error */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {/* Filtros */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Filtrar Usuarios</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Buscador */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Buscar usuario</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar por usuario, email o nombre..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        </div>
                    </div>

                    {/* Filtro por rol */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por rol</label>
                        <select
                            value={filterRol}
                            onChange={(e) => setFilterRol(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        >
                            <option value="todos">Todos los roles</option>
                            <option value="admin">Solo administradores</option>
                            <option value="usuario">Solo usuarios</option>
                        </select>
                    </div>

                    {/* Botones */}
                    <div className="flex items-end gap-2">
                        <button
                            onClick={handleClearFilters}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Limpiar filtros
                        </button>
                        <button
                            onClick={loadUsuarios}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700"
                        >
                            Actualizar lista
                        </button>
                    </div>
                </div>

                {/* Filtros activos */}
                {(searchTerm || filterRol !== 'todos') && (
                    <div className="mt-4 flex items-center flex-wrap gap-2">
                        <span className="text-sm text-gray-600">Filtros activos:</span>
                        
                        {searchTerm && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Buscar: "{searchTerm}"
                                <button onClick={() => setSearchTerm('')} className="ml-2 text-blue-600 hover:text-blue-800">×</button>
                            </span>
                        )}
                        
                        {filterRol !== 'todos' && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                Rol: {filterRol === 'admin' ? 'Administrador' : 'Usuario'}
                                <button onClick={() => setFilterRol('todos')} className="ml-2 text-purple-600 hover:text-purple-800">×</button>
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                {['Usuario', 'Email', 'Nombre', 'Hábitos', 'Rol', 'Acciones'].map((header) => (
                                    <th key={header} className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsuarios.map((usuario) => (
                                <tr key={usuario.id} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">{usuario.username}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{usuario.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {usuario.primer_nombre} {usuario.segundo_nombre || ''}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{usuario.suscripciones?.length || 0}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${usuario.es_admin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {usuario.es_admin ? 'Administrador' : 'Usuario'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 space-x-2">
                                        <button
                                            onClick={() => handleToggleAdmin(usuario.id, usuario.es_admin)}
                                            className={`px-3 py-1 text-xs font-semibold text-white rounded ${usuario.es_admin ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'}`}
                                        >
                                            {usuario.es_admin ? 'Revocar Admin' : 'Hacer Admin'}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(usuario.id)}
                                            className="px-3 py-1 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded"
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

            {/* Sin resultados */}
            {filteredUsuarios.length === 0 && (
                <div className="text-center py-12">
                    {usuarios.length === 0 ? (
                        <p className="text-gray-500 text-lg">No hay usuarios registrados</p>
                    ) : (
                        <div>
                            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-gray-500 text-lg mb-2">No se encontraron usuarios con los filtros aplicados</p>
                            <button 
                                onClick={handleClearFilters}
                                className="text-emerald-600 hover:text-emerald-800 font-medium"
                            >
                                Limpiar filtros para ver todos
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}