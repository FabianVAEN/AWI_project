const HabitRepository = require('../repositories/habitRepository');

class HabitService {
    getAllDefaults() {
        return HabitRepository.findAllDefaults();
    }

    getUserHabits() {
        return HabitRepository.findUserHabits();
    }

    addHabitFromCatalog(habito_id) {
        const numericId = parseInt(habito_id);
        if (isNaN(numericId)) {
            throw { status: 400, message: "El ID del hábito debe ser un número" };
        }

        // Verificar si existe en el catálogo
        const defaultHabit = HabitRepository.findDefaultById(numericId);
        if (!defaultHabit) {
            throw { status: 404, message: "Hábito no encontrado en el catálogo" };
        }

        // Verificar si ya está en la lista del usuario
        const existing = HabitRepository.findUserHabitByDefaultId(numericId);
        if (existing) {
            throw { status: 400, message: "Este hábito ya está en tu lista" };
        }

        return HabitRepository.create({
            habito_id: defaultHabit.id,
            nombre: defaultHabit.nombre,
            descripcion: defaultHabit.descripcion
        });
    }

    createCustomHabit(habitData) {
        const { nombre, descripcion } = habitData;
        if (!nombre) {
            throw { status: 400, message: "El nombre del hábito es obligatorio" };
        }

        return HabitRepository.create({
            habito_id: null, // Es un hábito personalizado
            nombre,
            descripcion: descripcion || ""
        });
    }

    updateHabit(id, data) {
        const numericId = parseInt(id);
        if (isNaN(numericId)) {
            throw { status: 400, message: "El ID debe ser un número" };
        }

        const existing = HabitRepository.findUserHabitById(numericId);
        if (!existing) {
            throw { status: 404, message: "Hábito no encontrado en tu lista" };
        }

        // Validar estado si se proporciona
        if (data.estado && data.estado !== 'por hacer' && data.estado !== 'hecho') {
            throw { status: 400, message: "Estado inválido. Use 'por hacer' o 'hecho'" };
        }

        return HabitRepository.update(numericId, data);
    }

    deleteHabit(id) {
        const numericId = parseInt(id);
        if (isNaN(numericId)) {
            throw { status: 400, message: "El ID debe ser un número" };
        }

        const deleted = HabitRepository.delete(numericId);
        if (!deleted) {
            throw { status: 404, message: "Hábito no encontrado" };
        }

        return deleted;
    }
}

module.exports = new HabitService();