// frontend/src/services/authService.js - VERSIÓN MEJORADA
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Evento personalizado para notificar cambios de autenticación
const AUTH_CHANGE_EVENT = 'auth-change';

class AuthService {
    static async register(userData) {
        const response = await fetch(`${API_URL}/usuarios/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Error en el registro');
        }

        // Guardar y notificar
        this._saveAuthData(data);
        this._notifyAuthChange();
        return data;
    }

    static async login(credentials) {
        const response = await fetch(`${API_URL}/usuarios/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Error en el login');
        }

        // Guardar y notificar
        this._saveAuthData(data);
        this._notifyAuthChange();
        return data;
    }

    static logout() {
        // Limpiar todo el estado de autenticación
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.clear();
        
        // Limpiar cookies relacionadas
        document.cookie.split(";").forEach(c => {
            document.cookie = c.replace(/^ +/, "")
                .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        
        // Notificar cambio
        this._notifyAuthChange();
        
        // Redirigir después de un breve delay
        setTimeout(() => {
            window.dispatchEvent(new Event('beforeunload'));
            window.location.href = '/login';
        }, 100);
    }

    static _saveAuthData(data) {
        if (data.token) {
            localStorage.setItem('token', data.token);
        }
        if (data.usuario) {
            localStorage.setItem('user', JSON.stringify(data.usuario));
        }
    }

    static _notifyAuthChange() {
        window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, {
            detail: { isAuthenticated: this.isAuthenticated() }
        }));
    }

    // Obtener datos de autenticación
    static getToken() {
        return localStorage.getItem('token');
    }

    static getUser() {
        const userStr = localStorage.getItem('user');
        try {
            return userStr ? JSON.parse(userStr) : null;
        } catch {
            return null;
        }
    }

    static isAuthenticated() {
        const token = this.getToken();
        if (!token) return false;
        
        // Verificar expiración básica (opcional)
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 > Date.now();
        } catch {
            return true; // Si no podemos verificar, asumimos válido
        }
    }

    static getAuthHeader() {
        const token = this.getToken();
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }

    // Suscribirse a cambios de autenticación
    static onAuthChange(callback) {
        const handler = (event) => callback(event.detail);
        window.addEventListener(AUTH_CHANGE_EVENT, handler);
        return () => window.removeEventListener(AUTH_CHANGE_EVENT, handler);
    }

    // Actualizar datos del usuario
    static updateUserData(updates) {
        const user = this.getUser();
        if (user) {
            const updatedUser = { ...user, ...updates };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            this._notifyAuthChange();
        }
    }
}

export default AuthService;