import React, { useState } from 'react';
import { Card, Button, Input } from '../../components/common'; 
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../services/authService';

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: '', primer_nombre: '', segundo_nombre: '', email: '', password: '', confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        // Limpiar error del campo al escribir
        if (errors[name]) setErrors({ ...errors, [name]: '' });
    };

    const validate = () => {
        const newErrors = {};
        
        // Validación de nombre (obligatorio, min 2 letras)
        if (!form.primer_nombre.trim()) {
            newErrors.primer_nombre = 'El nombre es obligatorio';
        } else if (form.primer_nombre.trim().length < 2) {
            newErrors.primer_nombre = 'Debe tener al menos 2 letras';
        }
        
        // Validación de apellido (obligatorio, min 2 letras)
        if (!form.segundo_nombre.trim()) {
            newErrors.segundo_nombre = 'El apellido es obligatorio';
        } else if (form.segundo_nombre.trim().length < 2) {
            newErrors.segundo_nombre = 'Debe tener al menos 2 letras';
        }
        
        // Validación de username (obligatorio, min 3 caracteres, sin espacios)
        if (!form.username.trim()) {
            newErrors.username = 'Usuario obligatorio';
        } else if (form.username.trim().length < 3) {
            newErrors.username = 'Mínimo 3 caracteres';
        } else if (/\s/.test(form.username)) {
            newErrors.username = 'No se permiten espacios';
        }
        
        // Validación de email
        if (!form.email.trim()) {
            newErrors.email = 'Email obligatorio';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = 'Email inválido';
        }
        
        // Validación de contraseña
        if (!form.password) {
            newErrors.password = 'Contraseña obligatoria';
        } else if (form.password.length < 6) {
            newErrors.password = 'Mínimo 6 caracteres';
        }
        
        // Confirmación de contraseña
        if (!form.confirmPassword) {
            newErrors.confirmPassword = 'Confirma tu contraseña';
        } else if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }
        
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        
        try {
            setLoading(true);
            const userData = {
                username: form.username.trim(),
                primer_nombre: form.primer_nombre.trim(),
                segundo_nombre: form.segundo_nombre.trim(),
                email: form.email.trim(),
                password: form.password
            };
            
            const response = await AuthService.register(userData);
            
            if (response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.usuario));
                navigate('/');
            }
        } catch (err) {
            // Manejo de errores específicos del backend
            if (err.message.includes('usuario') || err.message.includes('username')) {
                setErrors({ username: 'Este usuario ya existe' });
            } else if (err.message.includes('email')) {
                setErrors({ email: 'Este email ya está registrado' });
            } else {
                setErrors({ general: err.message || 'Error en el registro' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 mb-2">
                        AWI
                    </h1>
                    <p className="text-gray-600 text-lg">Crea un hábito sostenible</p>
                </div>

                <div className="flex justify-center">
                    <Card className="max-w-md w-full">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-semibold text-gray-800">Crear Cuenta</h2>
                            <p className="text-gray-600 mt-2">Regístrate para comenzar tu viaje</p>
                        </div>

                        {errors.general && (
                            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                ⚠️ {errors.general}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Nombre *"
                                    name="primer_nombre"
                                    value={form.primer_nombre}
                                    onChange={handleChange}
                                    maxLength={20}
                                    placeholder="Tu nombre"
                                    error={errors.primer_nombre}
                                />
                                <Input
                                    label="Apellido *"
                                    name="segundo_nombre"
                                    value={form.segundo_nombre}
                                    onChange={handleChange}
                                    maxLength={20}
                                    placeholder="Tu apellido"
                                    error={errors.segundo_nombre}
                                />
                            </div>

                            <Input
                                label="Usuario *"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                minLength={3}
                                maxLength={20}
                                placeholder="mín. 3 caracteres"
                                error={errors.username}
                            />

                            <Input
                                label="Email *"
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                maxLength={30}
                                placeholder="ejemplo@email.com"
                                error={errors.email}
                            />

                            <Input
                                label="Contraseña *"
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                minLength={6}
                                maxLength={30}
                                placeholder="mín. 6 caracteres"
                                error={errors.password}
                            />

                            <Input
                                label="Confirmar Contraseña *"
                                type="password"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                maxLength={30}
                                placeholder="repite tu contraseña"
                                error={errors.confirmPassword}
                            />

                            <div className="text-xs text-gray-500">* Campos obligatorios</div>

                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                                isLoading={loading}
                            >
                                Crear Cuenta
                            </Button>
                            
                            <Button
                                type="button"
                                variant="ghost"
                                className="w-full border"
                                onClick={() => navigate('/login')}
                            >
                                Cancelar
                            </Button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                            <p className="text-gray-600">
                                ¿Ya tienes una cuenta?{' '}
                                <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
                                    Inicia sesión
                                </Link>
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}