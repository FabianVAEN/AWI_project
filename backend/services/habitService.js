const HabitRepository = require('../repositories/habitRepository');
const { Seguimiento, UsuarioHabito, Habito, Categoria } = require('../repositories/models');

class HabitService {
    async getAllDefaults() {
        return await HabitRepository.findAllDefaults();
    }

    async getUserHabits(usuario_id) {
        return await HabitRepository.findUserHabits(usuario_id);
    }

    async addHabitFromCatalog(habito_id, usuario_id) {
        const numericId = parseInt(habito_id);
        if (isNaN(numericId)) {
            throw { status: 400, message: "El ID del hábito debe ser un número" };
        }

        const defaultHabit = await HabitRepository.findDefaultById(numericId);
        if (!defaultHabit) {
            throw { status: 404, message: "Hábito no encontrado en el catálogo" };
        }

        const existing = await HabitRepository.findUserHabitByDefaultId(numericId, usuario_id);
        if (existing) {
            throw { status: 400, message: "Este hábito ya está en tu lista" };
        }

        return await HabitRepository.create({
            habito_id: defaultHabit.id,
            nombre: defaultHabit.nombre,
            descripcion: defaultHabit.descripcion_breve
        }, usuario_id);
    }

    async createCustomHabit(habitData, usuario_id) {
        const { nombre, descripcion } = habitData;
        if (!nombre) {
            throw { status: 400, message: "El nombre del hábito es obligatorio" };
        }

        return await HabitRepository.create({
            habito_id: null,
            nombre,
            descripcion: descripcion || ""
        }, usuario_id);
    }

    async updateHabit(id, data, usuario_id) {
        return await HabitRepository.update(id, data, usuario_id);
    }

    async toggleHabitStatus(id, estado, usuario_id) {
        // Usamos la nueva lógica de racha real
        return await HabitRepository.toggleComplete(usuario_id, id);
    }

    async deleteHabit(id, usuario_id) {
        return await HabitRepository.delete(id, usuario_id);
    }

    // --- NUEVOS MÉTODOS DE ESTADÍSTICAS ---
    async getUserStats(usuario_id) {
        return await HabitRepository.getUserStats(usuario_id);
    }

    async getAdminStats() {
        return await HabitRepository.adminGetGlobalStats();
    }
}

module.exports = new HabitService();
