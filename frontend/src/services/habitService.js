const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Servicio para consumir los endpoints de hábitos del backend
 */
class HabitService {
  /**
   * Obtener el catálogo de hábitos predeterminados
   */
  static async getAllDefaults() {
    try {
      const response = await fetch(`${API_URL}/habitos`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching default habits:', error);
      throw error;
    }
  }

  /**
   * Obtener la lista de hábitos del usuario
   */
  static async getUserHabits() {
    try {
      const response = await fetch(`${API_URL}/lista-habitos`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching user habits:', error);
      throw error;
    }
  }

  /**
   * Agregar un hábito desde el catálogo
   * @param {number} habitoId - ID del hábito en el catálogo
   */
  static async addHabitFromCatalog(habitoId) {
    try {
      const response = await fetch(`${API_URL}/lista-habitos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habito_id: habitoId })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `Error: ${response.status}`);
      }
      return data;
    } catch (error) {
      console.error('Error adding habit from catalog:', error);
      throw error;
    }
  }

  /**
   * Crear un hábito personalizado
   * @param {object} habitData - { nombre, descripcion }
   */
  static async createCustomHabit(habitData) {
    try {
      const response = await fetch(`${API_URL}/lista-habitos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(habitData)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `Error: ${response.status}`);
      }
      return data;
    } catch (error) {
      console.error('Error creating custom habit:', error);
      throw error;
    }
  }

  /**
   * Actualizar un hábito (estado, nombre, descripción)
   * @param {number} id - ID del hábito
   * @param {object} data - Datos a actualizar
   */
  static async updateHabit(id, data) {
    try {
      const response = await fetch(`${API_URL}/lista-habitos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.error || `Error: ${response.status}`);
      }
      return responseData;
    } catch (error) {
      console.error('Error updating habit:', error);
      throw error;
    }
  }

  /**
   * Eliminar un hábito
   * @param {number} id - ID del hábito
   */
  static async deleteHabit(id) {
    try {
      const response = await fetch(`${API_URL}/lista-habitos/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || `Error: ${response.status}`);
      }
      return data;
    } catch (error) {
      console.error('Error deleting habit:', error);
      throw error;
    }
  }
}

export default HabitService;
