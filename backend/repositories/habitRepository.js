const { Habito, UsuarioHabito, Seguimiento, Categoria } = require('./models');

class HabitRepository {
    // Obtener catálogo de hábitos predeterminados
    async findAllDefaults() {
        try {
            return await Habito.findAll({
                where: { es_predeterminado: true },
                include: [
                    { 
                        model: Categoria, 
                        as: 'categoria',
                        attributes: ['id', 'nombre', 'descripcion', 'icono']
                    }
                ],
                order: [['categoria_id', 'ASC'], ['nombre', 'ASC']]
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

    // Obtener lista del usuario (Simulando usuario_id = 1 por ahora)
    async findUserHabits() {
        try {
            const suscripciones = await UsuarioHabito.findAll({
                where: { usuario_id: 1 },
                include: [{
                    model: Habito,
                    as: 'detalle_habito'
                }]
            });

            // Mapear para mantener compatibilidad con el frontend anterior
            return suscripciones.map(s => ({
                id: s.id,
                habito_id: s.habito_id,
                nombre: s.detalle_habito.nombre,
                descripcion: s.detalle_habito.descripcion_breve,
                es_predeterminado: s.detalle_habito.es_predeterminado,
                es_predeterminado: s.detalle_habito.es_predeterminado,
                estado: 'por hacer', // Esto debería venir de la tabla Seguimiento en una versión más avanzada
                racha_actual: s.racha_actual
            }));
        } catch (error) {
            console.error('Error en findUserHabits:', error);
            throw error;
        }
    }

    async findUserHabitById(id) {
        try {
            return await UsuarioHabito.findByPk(id);
        } catch (error) {
            console.error('Error en findUserHabitById:', error);
            throw error;
        }
    }

    async findUserHabitByDefaultId(habito_id) {
        try {
            return await UsuarioHabito.findOne({
                where: { usuario_id: 1, habito_id }
            });
        } catch (error) {
            console.error('Error en findUserHabitByDefaultId:', error);
            throw error;
        }
    }

    // Agregar a la lista (Suscripción)
    async create(habitData) {
        try {
            // Si es un hábito personalizado (no viene del catálogo)
            if (!habitData.habito_id) {
                const nuevoHabito = await Habito.create({
                    nombre: habitData.nombre,
                    descripcion_breve: habitData.descripcion,
                    es_predeterminado: false,
                    usuario_id: 1
                });
                habitData.habito_id = nuevoHabito.id;
            }

            const suscripcion = await UsuarioHabito.create({
                usuario_id: 1,
                habito_id: habitData.habito_id
            });

            return {
                ...suscripcion.toJSON(),
                nombre: habitData.nombre,
                descripcion: habitData.descripcion,
                estado: 'por hacer'
            };
        } catch (error) {
            console.error('Error en create:', error);
            throw error;
        }
    }

    // Actualizar hábito (Estado o Rachas)
    async update(id, data) {
        try {
            const suscripcion = await UsuarioHabito.findByPk(id);
            if (!suscripcion) return null;

            await suscripcion.update(data);
            return suscripcion;
        } catch (error) {
            console.error('Error en update:', error);
            throw error;
        }
    }

    // Eliminar hábito de la lista
    async delete(id) {
        try {
            const suscripcion = await UsuarioHabito.findByPk(id);
            if (!suscripcion) return null;

            const deletedData = suscripcion.toJSON();
            await suscripcion.destroy();
            return deletedData;
        } catch (error) {
            console.error('Error en delete:', error);
            throw error;
        }
    }
}
module.exports = new HabitRepository();
