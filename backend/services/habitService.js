const HabitRepository = require('../repositories/habitRepository');
const { Seguimiento } = require('../repositories/models');

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
        const numericId = parseInt(id);
        if (isNaN(numericId)) {
            throw { status: 400, message: "El ID debe ser un número" };
        }

        const existing = await HabitRepository.findUserHabitById(numericId, usuario_id);
        if (!existing) {
            throw { status: 404, message: "Hábito no encontrado en tu lista" };
        }

        return await HabitRepository.update(numericId, data, usuario_id);
    }

    async toggleHabitStatus(id, estado, usuario_id) {
        const numericId = parseInt(id);
        if (isNaN(numericId)) {
            throw { status: 400, message: "El ID debe ser un número" };
        }

        const suscripcion = await HabitRepository.findUserHabitById(numericId, usuario_id);
        if (!suscripcion) {
            throw { status: 404, message: "Hábito no encontrado en tu lista" };
        }

        if (!['pendiente', 'completado'].includes(estado)) {
            throw { status: 400, message: "Estado inválido. Use 'pendiente' o 'completado'" };
        }

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

        if (estado === 'completado') {
            const nuevaRacha = (suscripcion.racha_actual || 0) + 1;
            const rachaMaxima = Math.max(suscripcion.racha_maxima || 0, nuevaRacha);

            await suscripcion.update({
                racha_actual: nuevaRacha,
                racha_maxima: rachaMaxima
            });
        } else if (estado === 'pendiente') {
            // Si se desmarca, restamos 1 a la racha (o la reseteamos según lógica de negocio)
            const nuevaRacha = Math.max(0, (suscripcion.racha_actual || 0) - 1);
            await suscripcion.update({ racha_actual: nuevaRacha });
        }

        return {
            id: suscripcion.id,
            estado: estado,
            racha_actual: suscripcion.racha_actual
        };
    }

    async deleteHabit(id, usuario_id) {
        const numericId = parseInt(id);
        if (isNaN(numericId)) {
            throw { status: 400, message: "El ID debe ser un número" };
        }

        const deleted = await HabitRepository.delete(numericId, usuario_id);
        if (!deleted) {
            throw { status: 404, message: "Hábito no encontrado" };
        }

        return deleted;
    }
}

module.exports = new HabitService();
