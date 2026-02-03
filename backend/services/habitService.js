const HabitRepository = require('../repositories/habitRepository');
const { Seguimiento } = require('../repositories/models');

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

    async toggleHabitStatus(id, estado) {
        const numericId = parseInt(id);
        if (isNaN(numericId)) {
            throw { status: 400, message: "El ID debe ser un número" };
        }

        const suscripcion = await HabitRepository.findUserHabitById(numericId);
        if (!suscripcion) {
            throw { status: 404, message: "Hábito no encontrado en tu lista" };
        }

        if (!['pendiente', 'completado'].includes(estado)) {
            throw { status: 400, message: "Estado inválido. Use 'pendiente' o 'completado'" };
        }

        // Crear o actualizar seguimiento para hoy
        const hoy = new Date().toISOString().split('T')[0];
        const [seguimiento, created] = await Seguimiento.findOrCreate({
            where: {
                usuario_habito_id: numericId,
                fecha: hoy
            },
            defaults: { estado }
        });

        if (!created) {
            await seguimiento.update({ estado });
        }

        // Recalcular racha si se completó o se desmarcó
        if (estado === 'completado') {
            // Aumentar racha
            const nuevaRacha = (suscripcion.racha_actual || 0) + 1;
            const rachaMaxima = Math.max(suscripcion.racha_maxima || 0, nuevaRacha);

            await suscripcion.update({
                racha_actual: nuevaRacha,
                racha_maxima: rachaMaxima
            });
        } else if (estado === 'pendiente' && seguimiento.estado === 'completado') {
            // Si antes estaba completado y ahora pendiente, resetear racha
            await suscripcion.update({ racha_actual: 0 });
        }

        return {
            id: suscripcion.id,
            estado: estado,
            racha_actual: suscripcion.racha_actual
        };
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