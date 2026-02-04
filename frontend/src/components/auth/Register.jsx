import React, { useState } from 'react';
import { Card, Button, Input } from '../../components/common'; 
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../services/authService';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        primer_nombre: '',
        segundo_nombre: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Validaciones
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {
            setLoading(true);
            const userData = {
                username: formData.username,
                primer_nombre: formData.primer_nombre,
                segundo_nombre: formData.segundo_nombre || null,
                email: formData.email,
                password: formData.password
            };

            const response = await AuthService.register(userData);
            
            if (response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.usuario));
                navigate('/');
            }
        } catch (err) {
            setError(err.message || 'Error en el registro');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-cyan-50 py-12 px-4">
            <Card className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Crear Cuenta</h1>
                    <p className="text-gray-600 mt-2">Regístrate para comenzar tu viaje de hábitos saludables</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Nombre"
                            name="primer_nombre"
                            value={formData.primer_nombre}
                            onChange={handleChange}
                            required
                            maxLength={20}
                        />
                        <Input
                            label="Apellido"
                            name="segundo_nombre"
                            value={formData.segundo_nombre}
                            onChange={handleChange}
                            maxLength={20}
                        />
                    </div>

                    <Input
                        label="Nombre de usuario"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        minLength={3}
                        maxLength={20}
                    />

                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        maxLength={30}
                    />

                    <Input
                        label="Contraseña"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                        maxLength={30}
                    />

                    <Input
                        label="Confirmar Contraseña"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        maxLength={30}
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        isLoading={loading}
                    >
                        Crear Cuenta
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        ¿Ya tienes una cuenta?{' '}
                        <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
                            Inicia sesión aquí
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    );
}
