const { Habito, UsuarioHabito, sequelize } = require('../repositories/models');

const adminController = {
    // 1. Obtener estadísticas de hábitos más seguidos
    async getStats(req, res) {
        try {
            const stats = await UsuarioHabito.findAll({
                attributes: [
                    'habito_id',
                    [sequelize.fn('COUNT', sequelize.col('habito_id')), 'total_seguidores']
                ],
                include: [{ model: Habito, as: 'detalle_habito', attributes: ['nombre'] }],
                group: ['habito_id', 'detalle_habito.id', 'detalle_habito.nombre'],
                order: [[sequelize.literal('total_seguidores'), 'DESC']]
            });
            res.json(stats);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // 2. Crear un hábito predeterminado (Global)
    async createDefaultHabit(req, res) {
        try {
            const { nombre, descripcion_breve, descripcion_larga, categoria_id } = req.body;
            const nuevoHabito = await Habito.create({
                nombre,
                descripcion_breve,
                descripcion_larga,
                categoria_id,
                es_predeterminado: true, // Siempre true para el admin
                usuario_id: null         // Sin dueño específico para que sea global
            });
            res.status(201).json(nuevoHabito);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};

module.exports = adminController;