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
        try {
            console.log('📈 Calculando estadísticas para usuario:', usuario_id);

            // 1. Obtener todos los hábitos del usuario
            const userHabits = await UsuarioHabito.findAll({
                where: { usuario_id },
                include: [
                    {
                        model: Habito,
                        as: 'detalle_habito'
                    },
                    {
                        model: Seguimiento,
                        as: 'registros',
                        required: false
                    }
                ]
            });

            // 2. Calcular métricas básicas
            const totalHabitos = userHabits.length;

            // Rachas
            let rachaPromedio = 0;
            let mejorRacha = 0;
            let sumaRachas = 0;
            let habitosConRacha = 0;

            userHabits.forEach(habit => {
                if (habit.racha_actual > 0) {
                    sumaRachas += habit.racha_actual;
                    habitosConRacha++;
                }
                if (habit.racha_maxima > mejorRacha) {
                    mejorRacha = habit.racha_maxima;
                }
            });

            rachaPromedio = habitosConRacha > 0 ? Math.round(sumaRachas / habitosConRacha) : 0;

            // 3. Historial de últimos 7 días
            const historial = [];
            const hoy = new Date();

            for (let i = 6; i >= 0; i--) {
                const fecha = new Date(hoy);
                fecha.setDate(hoy.getDate() - i);
                const fechaStr = fecha.toISOString().split('T')[0];

                let completados = 0;

                // Para cada hábito, verificar si fue completado en esta fecha
                for (const habit of userHabits) {
                    const registro = habit.registros?.find(r => {
                        const registroFecha = new Date(r.fecha).toISOString().split('T')[0];
                        return registroFecha === fechaStr && r.estado === 'completado';
                    });

                    if (registro) {
                        completados++;
                    }
                }

                historial.push({
                    fecha: fechaStr,
                    completados
                });
            }

            // 4. Retornar estadísticas
            return {
                totalHabitos,
                rachaPromedio,
                mejorRacha,
                historial,
                resumen: {
                    habitosActivos: totalHabitos,
                    consistencia: rachaPromedio > 7 ? 'Alta' : rachaPromedio > 3 ? 'Media' : 'Baja'
                }
            };
        } catch (error) {
            console.error('Error en getUserStats:', error);
            throw { status: 500, message: "Error al calcular estadísticas: " + error.message };
        }
    }

    async getAdminStats() {
        return await HabitRepository.adminGetGlobalStats();
    }
}

module.exports = new HabitService();
