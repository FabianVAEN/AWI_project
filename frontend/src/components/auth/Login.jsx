import React, { useState } from 'react';
import { Card, Button, Input } from '../../components/common';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../services/authService';

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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

        if (!formData.email || !formData.password) {
            setError('Por favor, completa todos los campos');
            return;
        }

        try {
            setLoading(true);
            const response = await AuthService.login(formData);
            
            if (response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.usuario));
                navigate('/');
            }
        } catch (err) {
            setError(err.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-cyan-50 py-12 px-4">
            <Card className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Iniciar Sesión</h1>
                    <p className="text-gray-600 mt-2">Ingresa a tu cuenta para continuar con tus hábitos</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        label="Contraseña"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        isLoading={loading}
                    >
                        Iniciar Sesión
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        ¿No tienes una cuenta?{' '}
                        <Link to="/register" className="text-emerald-600 hover:text-emerald-700 font-medium">
                            Regístrate aquí
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    );
}