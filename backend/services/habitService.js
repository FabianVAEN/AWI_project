const HabitRepository = require('../repositories/habitRepository');

class HabitService {
    async getAllDefaults() {
        return await HabitRepository.findAllDefaults();
    }

    async getUserHabits() {
        return await HabitRepository.findUserHabits();
    }

    async addHabitFromCatalog(habito_id) {
        const numericId = parseInt(habito_id);
        if (isNaN(numericId)) {
            throw { status: 400, message: "El ID del hábito debe ser un número" };
        }

        const defaultHabit = await HabitRepository.findDefaultById(numericId);
        if (!defaultHabit) {
            throw { status: 404, message: "Hábito no encontrado en el catálogo" };
        }

        const existing = await HabitRepository.findUserHabitByDefaultId(numericId);
        if (existing) {
            throw { status: 400, message: "Este hábito ya está en tu lista" };
        }

        return await HabitRepository.create({
            habito_id: defaultHabit.id,
            nombre: defaultHabit.nombre,
            descripcion: defaultHabit.descripcion_breve
        });
    }

    async createCustomHabit(habitData) {
        const { nombre, descripcion } = habitData;
        if (!nombre) {
            throw { status: 400, message: "El nombre del hábito es obligatorio" };
        }

        return await HabitRepository.create({
            habito_id: null,
            nombre,
            descripcion: descripcion || ""
        });
    }

    async updateHabit(id, data) {
        const numericId = parseInt(id);
        if (isNaN(numericId)) {
            throw { status: 400, message: "El ID debe ser un número" };
        }

        const existing = await HabitRepository.findUserHabitById(numericId);
        if (!existing) {
            throw { status: 404, message: "Hábito no encontrado en tu lista" };
        }

        if (data.estado && data.estado !== 'por hacer' && data.estado !== 'hecho') {
            throw { status: 400, message: "Estado inválido. Use 'por hacer' o 'hecho'" };
        }

        return await HabitRepository.update(numericId, data);
    }

    async deleteHabit(id) {
        const numericId = parseInt(id);
        if (isNaN(numericId)) {
            throw { status: 400, message: "El ID debe ser un número" };
        }

        const deleted = await HabitRepository.delete(numericId);
        if (!deleted) {
            throw { status: 404, message: "Hábito no encontrado" };
        }

        return deleted;
    }
}

module.exports = new HabitService();