import React, { useState, useEffect } from 'react';
import { Card, Button, Input, LoadingScreen } from '../components/common';
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
        // Cuando el backend tenga los endpoints de estadísticas, reemplazar esto
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
        loadUserData();
        setMessage({ type: '', text: '' });
    };

    const handleChangePassword = () => {
        setMessage({ type: 'info', text: 'Función de cambio de contraseña en desarrollo' });
    };

    if (loading) {
        return <LoadingScreen message="Cargando perfil..." variant="inline" />;
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

    const statItems = [
        { label: 'Hábitos Totales', value: stats.totalHabits, color: 'emerald' },
        { label: 'Completados Hoy', value: stats.completedToday, color: 'blue' },
        { label: 'Racha Actual', value: `${stats.streak} días`, color: 'purple' },
        { label: 'Tasa de Éxito', value: `${stats.completionRate}%`, color: 'amber' }
    ];

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
                    <div className={`mb-6 p-4 rounded-lg ${
                        message.type === 'success' ? 'bg-green-100 text-green-800' : 
                        message.type === 'error' ? 'bg-red-100 text-red-800' : 
                        'bg-blue-100 text-blue-800'
                    }`}>
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Columna izquierda: Información personal */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Información Personal */}
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
                                            variant="secondary" 
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
                                            variant="ghost" 
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
                                {statItems.map((item) => {
                                    const colorMap = {
                                        emerald: 'bg-emerald-50 text-emerald-700',
                                        blue: 'bg-blue-50 text-blue-700',
                                        purple: 'bg-purple-50 text-purple-700',
                                        amber: 'bg-amber-50 text-amber-700'
                                    };
                                    return (
                                        <div key={item.label} className={`${colorMap[item.color]} p-4 rounded-lg text-center`}>
                                            <div className="text-3xl font-bold">{item.value}</div>
                                            <div className="text-sm text-gray-600 mt-1">{item.label}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    </div>

                    {/* Columna derecha: Tarjeta de usuario */}
                    <div className="space-y-8">
                        <Card className="text-center">
                            <div className="flex justify-center mb-4">
                                <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                                    {user.username?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">{user.username}</h3>
                            <p className="text-gray-600 text-sm mt-1">{user.email}</p>
                            
                            <div className="mt-6 pt-6 border-t space-y-3">
                                <div className="text-sm text-gray-600">
                                    <p className="font-medium">Miembro desde</p>
                                    <p className="text-xs">Enero 2024</p>
                                </div>
                                <div className="text-sm text-gray-600">
                                    <p className="font-medium">Estado</p>
                                    <p className="text-xs text-green-600 font-semibold">Activo</p>
                                </div>
                            </div>
                        </Card>

                        {/* Acciones rápidas */}
                        <Card>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Acciones Rápidas</h3>
                            <div className="space-y-2">
                                <Button variant="ghost" className="w-full justify-start" onClick={() => window.location.href = '/estadisticas'}>
                                    📊 Ver Estadísticas
                                </Button>
                                <Button variant="ghost" className="w-full justify-start" onClick={() => window.location.href = '/mis-habitos'}>
                                    🎯 Mis Hábitos
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-red-600 hover:bg-red-50">
                                    🗑️ Eliminar Cuenta
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
