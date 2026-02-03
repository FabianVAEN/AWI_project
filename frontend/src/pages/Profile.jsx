// frontend/src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '../components/common';
import AuthService from '../services/authService';

export default function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        primer_nombre: '',
        segundo_nombre: '',
        email: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [stats, setStats] = useState({
        totalHabits: 0,
        completedToday: 0,
        streak: 0,
        completionRate: 0
    });

    useEffect(() => {
        loadUserData();
        loadUserStats();
    }, []);

    const loadUserData = () => {
        const currentUser = AuthService.getUser();
        setUser(currentUser);
        if (currentUser) {
            setFormData({
                username: currentUser.username || '',
                primer_nombre: currentUser.primer_nombre || '',
                segundo_nombre: currentUser.segundo_nombre || '',
                email: currentUser.email || ''
            });
        }
        setLoading(false);
    };

    const loadUserStats = async () => {
        // TODO: Conectar con backend para obtener estadísticas reales
        // Por ahora, datos mock
        setStats({
            totalHabits: 8,
            completedToday: 5,
            streak: 14,
            completionRate: 72
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setMessage({ type: 'info', text: 'Guardando cambios...' });

        try {
            // TODO: Conectar con backend para actualizar perfil
            // Por ahora, actualizar solo en localStorage
            AuthService.updateUserData(formData);
            
            setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
            setEditMode(false);
            
            // Recargar datos
            setTimeout(() => {
                setMessage({ type: '', text: '' });
                loadUserData();
            }, 2000);
            
        } catch (error) {
            setMessage({ type: 'error', text: 'Error al actualizar perfil: ' + error.message });
        }
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        loadUserData(); // Restaurar datos originales
        setMessage({ type: '', text: '' });
    };

    const handleChangePassword = () => {
        // TODO: Implementar cambio de contraseña
        setMessage({ type: 'info', text: 'Función de cambio de contraseña en desarrollo' });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando perfil...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="max-w-md w-full text-center p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Usuario no encontrado</h2>
                    <p className="text-gray-600 mb-6">Por favor, inicia sesión para ver tu perfil.</p>
                    <Button variant="primary" onClick={() => window.location.href = '/login'}>
                        Iniciar Sesión
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Mi Perfil</h1>
                    <p className="text-gray-600 mt-2">Administra tu información personal y preferencias</p>
                </div>

                {/* Mensajes */}
                {message.text && (
                    <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : message.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Columna izquierda: Información personal */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-800">Información Personal</h2>
                                {!editMode ? (
                                    <Button 
                                        variant="secondary" 
                                        onClick={() => setEditMode(true)}
                                    >
                                        Editar Perfil
                                    </Button>
                                ) : (
                                    <div className="flex gap-2">
                                        <Button 
                                            variant="danger" 
                                            onClick={handleCancelEdit}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button 
                                            variant="success" 
                                            onClick={handleSaveProfile}
                                        >
                                            Guardar Cambios
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="Nombre de usuario"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        required
                                    />
                                    <Input
                                        label="Email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="Primer Nombre"
                                        name="primer_nombre"
                                        value={formData.primer_nombre}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                    />
                                    <Input
                                        label="Segundo Nombre"
                                        name="segundo_nombre"
                                        value={formData.segundo_nombre}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                    />
                                </div>

                                <div className="pt-4 border-t">
                                    <h3 className="text-lg font-medium text-gray-800 mb-4">Seguridad</h3>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-700">Contraseña</p>
                                            <p className="text-sm text-gray-500">Última actualización: Hace 30 días</p>
                                        </div>
                                        <Button 
                                            variant="outline" 
                                            onClick={handleChangePassword}
                                        >
                                            Cambiar Contraseña
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Estadísticas rápidas */}
                        <Card>
                            <h2 className="text-xl font-semibold text-gray-800 mb-6">Mi Progreso</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-emerald-50 p-4 rounded-lg text-center">
                                    <div className="text-3xl font-bold text-emerald-700">{stats.totalHabits}</div>
                                    <div className="text-sm text-gray-600 mt-1">Hábitos Totales</div>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-lg text-center">
                                    <div className="text-3xl font-bold text-blue-700">{stats.completedToday}</div>
                                    <div className="text-sm text-gray-600 mt-1">Completados Hoy</div>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg text-center">
                                    <div className="text-3xl font-bold text-purple-700">{stats.streak} días</div>
                                    <div className="text-sm text-gray-600 mt-1">Racha Actual</div>
                                </div>
                                <div className="bg-amber-50 p-4 rounded-lg text-center">
                                    <div className="text-3xl font-bold text-amber-700">{stats.completionRate}%</div>
                                    <div className="text-sm text-gray-600 mt-1">Tasa de Éxito</div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Columna derecha: Tarjeta de usuario y acciones */}
                    <div className="space-y-8">
                        {/* Tarjeta de usuario */}
                        <Card className="text-center">
                            <div className="flex justify-center mb-4">
                                <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                                    {user.username?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">{user.username}</h3>
                            <p className="text-gray-600 mt-1">{user.email}</p>
                            <p className="text-gray-500 text-sm mt-2">
                                Miembro desde: {new Date(user.created_at || Date.now()).toLocaleDateString('es-ES')}
                            </p>
                            <div className="mt-6 pt-6 border-t">
                                <p className="text-gray-700 text-sm">ID de usuario: <span className="font-mono text-xs">{user.id}</span></p>
                            </div>
                        </Card>

                        {/* Acciones rápidas */}
                        <Card>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Acciones Rápidas</h3>
                            <div className="space-y-3">
                                <Button 
                                    variant="outline" 
                                    className="w-full justify-start"
                                    onClick={() => window.location.href = '/export-data'}
                                >
                                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Exportar mis datos
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="w-full justify-start"
                                    onClick={() => window.location.href = '/notifications'}
                                >
                                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    Notificaciones
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="w-full justify-start text-red-600 hover:text-red-700 hover:border-red-300"
                                    onClick={() => {
                                        if (window.confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
                                            // TODO: Implementar eliminación de cuenta
                                            alert('Función de eliminación de cuenta en desarrollo');
                                        }
                                    }}
                                >
                                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Eliminar cuenta
                                </Button>
                            </div>
                        </Card>

                        {/* Meta del mes */}
                        <Card>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Meta del Mes</h3>
                            <div className="mb-2 flex justify-between text-sm">
                                <span className="text-gray-600">Progreso</span>
                                <span className="font-medium text-emerald-600">65%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                            </div>
                            <p className="text-sm text-gray-500 mt-3">Mantén tu racha de 14 días para alcanzar la meta mensual</p>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}