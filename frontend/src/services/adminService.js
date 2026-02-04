import AuthService from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class AdminService {
    // --- DASHBOARD ---
    static async getDashboardStats() {
        try {
            const response = await fetch(`${API_URL}/admin/dashboard/stats`, {
                headers: { ...AuthService.getAuthHeader() }
            });
            if (!response.ok) throw new Error('Error al obtener estadísticas');
            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    // --- CATEGORÍAS ---
    static async getAllCategories() {
        try {
            const response = await fetch(`${API_URL}/admin/categorias`, {
                headers: { ...AuthService.getAuthHeader() }
            });
            if (!response.ok) throw new Error('Error al obtener categorías');
            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    static async createCategory(data) {
        try {
            const response = await fetch(`${API_URL}/admin/categorias`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...AuthService.getAuthHeader()
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }
            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    static async updateCategory(id, data) {
        try {
            const response = await fetch(`${API_URL}/admin/categorias/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...AuthService.getAuthHeader()
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }
            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    static async deleteCategory(id) {
        try {
            const response = await fetch(`${API_URL}/admin/categorias/${id}`, {
                method: 'DELETE',
                headers: { ...AuthService.getAuthHeader() }
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }
            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    // --- HÁBITOS DEL CATÁLOGO ---
    static async getAllHabits() {
        try {
            const response = await fetch(`${API_URL}/admin/habitos-catalogo`, {
                headers: { ...AuthService.getAuthHeader() }
            });
            if (!response.ok) throw new Error('Error al obtener hábitos');
            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    static async createHabit(data) {
        try {
            const response = await fetch(`${API_URL}/admin/habitos-catalogo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...AuthService.getAuthHeader()
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }
            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    static async updateHabit(id, data) {
        try {
            const response = await fetch(`${API_URL}/admin/habitos-catalogo/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...AuthService.getAuthHeader()
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }
            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    static async deleteHabit(id) {
        try {
            const response = await fetch(`${API_URL}/admin/habitos-catalogo/${id}`, {
                method: 'DELETE',
                headers: { ...AuthService.getAuthHeader() }
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }
            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    // --- USUARIOS ---
    static async getAllUsers() {
        try {
            const response = await fetch(`${API_URL}/admin/usuarios`, {
                headers: { ...AuthService.getAuthHeader() }
            });
            if (!response.ok) throw new Error('Error al obtener usuarios');
            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    static async updateUserRole(userId, es_admin) {
        try {
            const response = await fetch(`${API_URL}/admin/usuarios/${userId}/rol`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...AuthService.getAuthHeader()
                },
                body: JSON.stringify({ es_admin })
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }
            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    static async deleteUser(userId) {
        try {
            const response = await fetch(`${API_URL}/admin/usuarios/${userId}`, {
                method: 'DELETE',
                headers: { ...AuthService.getAuthHeader() }
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error);
            }
            return await response.json();
        } catch (error) {
            throw error;
        }
    }
}

export default AdminService;