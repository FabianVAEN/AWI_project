import AuthService from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class HabitService {
  static async _fetchWithAuth(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...AuthService.getAuthHeader(),
      ...options.headers
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (response.status === 401) {
      // Token expirado o inválido
      AuthService.logout();
      window.location.href = '/login';
      throw new Error('Sesión expirada');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Error: ${response.status}`);
    }

    return data;
  }

  static async getAllDefaults() {
    return this._fetchWithAuth('/habitos');
  }

  static async getUserHabits() {
    return this._fetchWithAuth('/lista-habitos');
  }

  static async addHabitFromCatalog(habitoId) {
    return this._fetchWithAuth('/lista-habitos', {
      method: 'POST',
      body: JSON.stringify({ habito_id: habitoId })
    });
  }

  static async createCustomHabit(habitData) {
    return this._fetchWithAuth('/lista-habitos', {
      method: 'POST',
      body: JSON.stringify(habitData)
    });
  }

  static async updateHabit(id, data) {
    return this._fetchWithAuth(`/lista-habitos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  static async toggleHabitStatus(id, estado) {
    return this._fetchWithAuth(`/lista-habitos/${id}/toggle-status`, {
      method: 'POST',
      body: JSON.stringify({ estado })
    });
  }

  static async deleteHabit(id) {
    return this._fetchWithAuth(`/lista-habitos/${id}`, {
      method: 'DELETE'
    });
  }

  static async getUserStats() {
    return this._fetchWithAuth('/estadisticas');
  }

}

export default HabitService;