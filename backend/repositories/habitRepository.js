const { Habito, UsuarioHabito, Seguimiento, Categoria } = require('./models');
const { Op } = require('sequelize');

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
    // Obtener catálogo de hábitos predeterminados con su categoría
    async findUserHabitByDefaultId(habito_id, usuario_id) {
        try {
            return await UsuarioHabito.findOne({
                where: {
                    usuario_id,
                    habito_id
                }
            });
        } catch (error) {
            console.error('Error en findUserHabitByDefaultId:', error);
            throw error;
        }
    }

    // Obtener lista del usuario autenticado con racha y estado de hoy
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
                            fecha: new Date().toISOString().split('T')[0]
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
                    es_predeterminado: s.detalle_habito.es_predeterminado,
                    estado: estadoHoy,
                    racha_actual: s.racha_actual,
                    racha_maxima: s.racha_maxima
                };
            });
        } catch (error) {
            console.error('Error en findUserHabits:', error);
            throw error;
        }
    }

    // Registrar cumplimiento y actualizar racha
    async toggleComplete(usuario_id, usuario_habito_id) {
        const today = new Date().toISOString().split('T')[0];

        const suscripcion = await UsuarioHabito.findOne({
            where: { id: usuario_habito_id, usuario_id }
        });

        if (!suscripcion) throw new Error('Suscripción no encontrada');

        let seguimiento = await Seguimiento.findOne({
            where: { usuario_habito_id, fecha: today }
        });

        if (seguimiento) {
            const nuevoEstado = seguimiento.estado === 'completado' ? 'pendiente' : 'completado';
            await seguimiento.update({ estado: nuevoEstado });
        } else {
            seguimiento = await Seguimiento.create({
                usuario_habito_id,
                fecha: today,
                estado: 'completado'
            });
        }

        // RECALCULAR RACHA
        await this.updateStreak(usuario_habito_id);

        return seguimiento;
    }

    // Lógica para calcular y actualizar la racha
    async updateStreak(usuario_habito_id) {
        const suscripcion = await UsuarioHabito.findByPk(usuario_habito_id);
        if (!suscripcion) return;

        const seguimientos = await Seguimiento.findAll({
            where: {
                usuario_habito_id,
                estado: 'completado'
            },
            order: [['fecha', 'DESC']]
        });

        let racha = 0;
        if (seguimientos.length > 0) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const lastDate = new Date(seguimientos[0].fecha);
            lastDate.setHours(0, 0, 0, 0);

            const diffTime = Math.abs(today - lastDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // Si el último completado es hoy o ayer, la racha sigue
            if (diffDays <= 1) {
                racha = 1;
                for (let i = 0; i < seguimientos.length - 1; i++) {
                    const current = new Date(seguimientos[i].fecha);
                    const next = new Date(seguimientos[i + 1].fecha);
                    current.setHours(0, 0, 0, 0);
                    next.setHours(0, 0, 0, 0);

                    const diff = Math.abs(current - next);
                    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

                    if (days === 1) {
                        racha++;
                    } else {
                        break;
                    }
                }
            }
        }

        const nuevaRachaMax = Math.max(suscripcion.racha_maxima, racha);
        await suscripcion.update({
            racha_actual: racha,
            racha_maxima: nuevaRachaMax
        });
    }

    // Obtener estadísticas del usuario
    async getUserStats(usuario_id, range = 'week') {
        try {
            console.log(`Calculando estadísticas para usuario: ${usuario_id}, rango: ${range}`);

            // 1. Obtener hábitos del usuario
            const suscripciones = await UsuarioHabito.findAll({
                where: { usuario_id },
                include: [
                    {
                        model: Habito,
                        as: 'detalle_habito',
                        include: [{ model: Categoria, as: 'categoria' }]
                    }
                ]
            });

            const totalHabitos = suscripciones.length;

            // 2. Calcular rachas
            let sumaRachas = 0;
            let mejorRacha = 0;

            suscripciones.forEach(s => {
                sumaRachas += s.racha_actual || 0;
                if (s.racha_maxima > mejorRacha) {
                    mejorRacha = s.racha_maxima;
                }
            });

            const rachaPromedio = totalHabitos > 0 ? Math.round(sumaRachas / totalHabitos) : 0;

            // 3. Determinar días según el rango
            let dias = 7; // Por defecto semana
            switch (range) {
                case 'month': dias = 30; break;
                case 'year': dias = 365; break;
                case 'all': dias = 365 * 2; break; // Últimos 2 años
                default: dias = 7;
            }

            // 4. Obtener historial
            const historial = [];
            const hoy = new Date();
            const usuarioHabitoIds = suscripciones.map(s => s.id);

            // Si no hay hábitos, devolver historial vacío
            if (usuarioHabitoIds.length === 0) {
                for (let i = dias - 1; i >= 0; i--) {
                    const fecha = new Date(hoy);
                    fecha.setDate(hoy.getDate() - i);
                    historial.push({
                        fecha: fecha.toISOString().split('T')[0],
                        completados: 0
                    });
                }
            } else {
                // Contar completados por fecha
                for (let i = dias - 1; i >= 0; i--) {
                    const fecha = new Date();  // ✅ NUEVA FECHA EN CADA ITERACIÓN
                    fecha.setDate(fecha.getDate() - i);  // ✅ USAR 'fecha.getDate()' no 'hoy.getDate()'
                    const fechaStr = fecha.toISOString().split('T')[0];

                    const count = await Seguimiento.count({
                        where: {
                            fecha: fechaStr,
                            estado: 'completado'
                        },
                        include: [{
                            model: UsuarioHabito,
                            as: 'usuario_habito', //modificado uduarioHabito checar
                            where: {
                                id: usuarioHabitoIds
                            }
                        }]
                    });

                    historial.push({
                        fecha: fechaStr,
                        completados: count
                    });
                }
            }

            return {
                totalHabitos,
                rachaPromedio,
                mejorRacha,
                historial,
                rango: range // Para debug
            };
        } catch (error) {
            console.error('Error en getUserStats:', error);
            throw error;
        }
    }
    // --- MÉTODOS EXISTENTES ---
    async findUserHabitById(id, usuario_id) {
        return await UsuarioHabito.findOne({ where: { id, usuario_id } });
    }

    async create(habitData, usuario_id) {
        if (!habitData.habito_id) {
            const categoriaPersonalizada = await Categoria.findOne({ where: { nombre: 'Personalizado' } });
            const nuevoHabito = await Habito.create({
                nombre: habitData.nombre,
                descripcion_breve: habitData.descripcion,
                es_predeterminado: false,
                categoria_id: categoriaPersonalizada ? categoriaPersonalizada.id : null,
                usuario_id: usuario_id
            });
            habitData.habito_id = nuevoHabito.id;
        }
        return await UsuarioHabito.create({ usuario_id, habito_id: habitData.habito_id });
    }

    async delete(id, usuario_id) {
        const suscripcion = await UsuarioHabito.findOne({ where: { id, usuario_id } });
        if (!suscripcion) return null;
        await suscripcion.destroy();
        return true;
    }

    // --- MÉTODOS DE ADMINISTRACIÓN ---
    async adminFindAllHabits() {
        return await Habito.findAll({ include: [{ model: Categoria, as: 'categoria' }] });
    }

    async adminGetGlobalStats() {
        const habitosMasCompletados = await Seguimiento.findAll({
            attributes: [
                [Habito.sequelize.col('usuario_habito.detalle_habito.nombre'), 'nombre'],
                [Habito.sequelize.fn('COUNT', Habito.sequelize.col('Seguimiento.id')), 'total_completados']
            ],
            include: [{
                model: UsuarioHabito,
                as: 'usuario_habito',
                attributes: [],
                include: [{
                    model: Habito,
                    as: 'detalle_habito',
                    attributes: []
                }]
            }],
            where: { estado: 'completado' },
            group: ['usuario_habito.detalle_habito.nombre'],
            order: [[Habito.sequelize.fn('COUNT', Habito.sequelize.col('Seguimiento.id')), 'DESC']],
            limit: 5,
            raw: true
        });

        const rankingRachas = await UsuarioHabito.findAll({
            attributes: ['racha_actual'],
            include: [
                { model: Habito, as: 'detalle_habito', attributes: ['nombre'] },
                { model: require('./models/Usuario'), as: 'usuario', attributes: ['username'] }
            ],
            order: [['racha_actual', 'DESC']],
            limit: 5
        });

        return { habitosMasCompletados, rankingRachas };
    }
}

module.exports = new HabitRepository();
