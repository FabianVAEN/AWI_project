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
        try {
            console.log('🔄 [updateHabit] INICIANDO...');
            console.log('📥 Parámetros recibidos:', { id, data, usuario_id });
            
            // 1. Buscar la SUSCRIPCIÓN del usuario (UsuarioHabito)
            console.log('🔍 Buscando suscripción con ID:', id, 'y usuario_id:', usuario_id);
            const suscripcion = await UsuarioHabito.findOne({
                where: { id, usuario_id }
            });
            
            if (!suscripcion) {
                console.log('❌ Suscripción NO encontrada');
                throw { status: 404, message: "Hábito no encontrado en tu lista" };
            }

            console.log('✅ Suscripción encontrada:', suscripcion.toJSON());

            // 2. Buscar el HÁBITO asociado
            console.log('🔍 Buscando hábito con ID:', suscripcion.habito_id);
            const habito = await Habito.findByPk(suscripcion.habito_id);
            
            if (!habito) {
                console.log('❌ Hábito NO encontrado');
                throw { status: 404, message: "Hábito no encontrado" };
            }

            console.log('✅ Hábito encontrado:', habito.toJSON());

            // 3. Verificar que sea personalizado (no predeterminado)
            console.log('🔍 Verificando si es personalizado. es_predeterminado:', habito.es_predeterminado);
            if (habito.es_predeterminado) {
                console.log('❌ Intento de editar hábito predeterminado');
                throw { status: 403, message: "No puedes editar hábitos predeterminados" };
            }

            // 4. Verificar que el usuario sea el creador del hábito personalizado
            console.log('🔍 Verificando propiedad. Habito.usuario_id:', habito.usuario_id, 'Usuario actual:', usuario_id);
            if (habito.usuario_id !== usuario_id) {
                console.log('❌ Usuario no es el creador');
                throw { status: 403, message: "No tienes permisos para editar este hábito" };
            }

            // 5. Actualizar el hábito
            const updateData = {};
            if (data.nombre && data.nombre.trim()) {
                updateData.nombre = data.nombre.trim();
                console.log('📝 Nuevo nombre:', updateData.nombre);
            }
            if (data.descripcion !== undefined) {
                updateData.descripcion_breve = data.descripcion.trim();
                console.log('📝 Nueva descripción:', updateData.descripcion_breve);
            }
            
            if (Object.keys(updateData).length === 0) {
                console.log('⚠️ No hay datos para actualizar');
                throw { status: 400, message: "No hay datos para actualizar" };
            }

            console.log('💾 Actualizando hábito en la base de datos...');
            await habito.update(updateData);

            // 6. Retornar datos actualizados
            const respuesta = {
                id: suscripcion.id,
                habito_id: habito.id,
                nombre: habito.nombre,
                descripcion_breve: habito.descripcion_breve,
                estado: 'pendiente',
                racha_actual: suscripcion.racha_actual || 0
            };

            console.log('✅ [updateHabit] COMPLETADO con éxito:', respuesta);
            return respuesta;
        } catch (error) {
            console.error('💥 [updateHabit] ERROR COMPLETO:', error);
            // Si ya tiene status, re-lanzar
            if (error.status) {
                console.error(`📊 Error con status ${error.status}: ${error.message}`);
                throw error;
            }
            // Si no, error genérico
            console.error('📊 Error interno del servidor');
            throw { status: 500, message: error.message || "Error interno al actualizar hábito" };
        }
    }

    async toggleHabitStatus(id, estado, usuario_id) {
        const numericId = parseInt(id);
        if (isNaN(numericId)) {
            throw { status: 400, message: "El ID debe ser un número" };
        }

        const suscripcion = await UsuarioHabito.findOne({
            where: { id: numericId, usuario_id }
        });
        
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

        const suscripcion = await UsuarioHabito.findOne({
            where: { id: numericId, usuario_id }
        });
        
        if (!suscripcion) {
            throw { status: 404, message: "Hábito no encontrado" };
        }

        // Si es hábito personalizado, también eliminar el hábito
        const habito = await Habito.findByPk(suscripcion.habito_id);
        if (habito && !habito.es_predeterminado && habito.usuario_id === usuario_id) {
            await habito.destroy();
        } else {
            // Solo eliminar la suscripción
            await suscripcion.destroy();
        }

        return { message: "Hábito eliminado correctamente" };
    }
}

module.exports = new HabitService();