const { Habito, UsuarioHabito, Seguimiento, Categoria } = require('./models');

class HabitRepository {
    // Obtener catálogo de hábitos predeterminados con su categoría
    async findAllDefaults() {
        try {
            return await Habito.findAll({
                where: { es_predeterminado: true },
                include: [{ model: Categoria, as: 'categoria' }]
            });
        } catch (error) {
            console.error('Error en findAllDefaults:', error);
            throw error;
        }
    }

    async findDefaultById(id) {
        try {
            return await Habito.findOne({
                where: { id, es_predeterminado: true }
            });
        } catch (error) {
            console.error('Error en findDefaultById:', error);
            throw error;
        }
    }

    // Obtener lista del usuario autenticado
    async findUserHabits(usuario_id) {
        try {
            const suscripciones = await UsuarioHabito.findAll({
                where: { usuario_id },
                include: [
                    {
                        model: Habito,
                        as: 'detalle_habito',
                        include: [{ model: Categoria, as: 'categoria' }]
                    },
                    {
                        model: Seguimiento,
                        as: 'registros',
                        required: false,
                        where: {
                            fecha: new Date().toISOString().split('T')[0] // Solo hoy
                        }
                    }
                ]
            });

            return suscripciones.map(s => {
                const seguimientoHoy = s.registros && s.registros.length > 0
                    ? s.registros[0]
                    : null;

                const estadoHoy = seguimientoHoy ? seguimientoHoy.estado : 'pendiente';

                return {
                    id: s.id,
                    habito_id: s.habito_id,
                    nombre: s.detalle_habito.nombre,
                    descripcion_breve: s.detalle_habito.descripcion_breve,
                    descripcion_larga: s.detalle_habito.descripcion_larga,
                    categoria: s.detalle_habito.categoria ? s.detalle_habito.categoria.nombre : 'Sin categoría',
                    estado: estadoHoy,
                    racha_actual: s.racha_actual
                };
            });
        } catch (error) {
            console.error('Error en findUserHabits:', error);
            throw error;
        }
    }

    async findUserHabitById(id, usuario_id) {
        try {
            return await UsuarioHabito.findOne({
                where: { id, usuario_id }
            });
        } catch (error) {
            console.error('Error en findUserHabitById:', error);
            throw error;
        }
    }

    async findUserHabitByDefaultId(habito_id, usuario_id) {
        try {
            return await UsuarioHabito.findOne({
                where: { usuario_id, habito_id }
            });
        } catch (error) {
            console.error('Error en findUserHabitByDefaultId:', error);
            throw error;
        }
    }

    // Agregar a la lista (Suscripción)
    async create(habitData, usuario_id) {
        try {
            // Si es un hábito personalizado
            if (!habitData.habito_id) {
                const categoriaPersonalizada = await Categoria.findOne({
                    where: { nombre: 'Personalizado' }
                });

                if (!categoriaPersonalizada) {
                    throw new Error("Categoría 'Personalizado' no encontrada");
                }

                const nuevoHabito = await Habito.create({
                    nombre: habitData.nombre,
                    descripcion_breve: habitData.descripcion,
                    es_predeterminado: false,
                    categoria_id: categoriaPersonalizada.id,
                    usuario_id: usuario_id
                });
                habitData.habito_id = nuevoHabito.id;
            }

            const suscripcion = await UsuarioHabito.create({
                usuario_id: usuario_id,
                habito_id: habitData.habito_id
            });

            return {
                ...suscripcion.toJSON(),
                nombre: habitData.nombre,
                descripcion: habitData.descripcion,
                estado: 'pendiente'
            };
        } catch (error) {
            console.error('Error en create:', error);
            throw error;
        }
    }

    async update(id, data, usuario_id) {
        try {
            const suscripcion = await UsuarioHabito.findOne({
                where: { id, usuario_id }
            });
            if (!suscripcion) return null;

            await suscripcion.update(data);
            return suscripcion;
        } catch (error) {
            console.error('Error en update:', error);
            throw error;
        }
    }

    async delete(id, usuario_id) {
        try {
            const suscripcion = await UsuarioHabito.findOne({
                where: { id, usuario_id }
            });
            if (!suscripcion) return null;

            const deletedData = suscripcion.toJSON();
            await suscripcion.destroy();
            return deletedData;
        } catch (error) {
            console.error('Error en delete:', error);
            throw error;
        }
    }

    // --- MÉTODOS DE ADMINISTRACIÓN ---
    async adminFindAllHabits() {
        return await Habito.findAll({
            include: [{ model: Categoria, as: 'categoria' }]
        });
    }

    async adminCreateHabit(data) {
        return await Habito.create({
            ...data,
            es_predeterminado: true
        });
    }

    async adminUpdateHabit(id, data) {
        const habito = await Habito.findByPk(id);
        if (!habito) return null;
        return await habito.update(data);
    }

    async adminDeleteHabit(id) {
        const habito = await Habito.findByPk(id);
        if (!habito) return null;
        await habito.destroy();
        return true;
    }
}

module.exports = new HabitRepository();
