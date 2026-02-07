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
            await AuthService.login(formData); 
            navigate('/');
        } catch (err) {
            setError(err.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Banner de bienvenida - Similar al Home.jsx */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 mb-2">
                        Bienvenido a AWI
                    </h1>
                    <p className="text-gray-600 text-lg">Construye hábitos saludables y sostenibles</p>
                </div>

                {/* Contenido principal centrado */}
                <div className="flex justify-center">
                    <Card className="max-w-md w-full">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800">Iniciar Sesión</h2>
                            <p className="text-gray-600 mt-2">Ingresa a tu cuenta para continuar con tus hábitos</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
                                <span>⚠️</span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                label="Email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                maxLength={30}
                                required
                                placeholder="ejemplo@email.com"
                            />

                            <Input
                                label="Contraseña"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                minLength={6}
                                maxLength={30}
                                required
                                placeholder="••••••••"
                            />

                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl transition-all duration-300"
                                isLoading={loading}
                            >
                                Iniciar Sesión
                            </Button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                            <p className="text-gray-600">
                                ¿No tienes una cuenta?{' '}
                                <Link to="/register" className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline">
                                    Regístrate aquí
                                </Link>
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}