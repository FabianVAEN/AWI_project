const { Habito, Categoria, Usuario, UsuarioHabito } = require('../repositories/models');

class AdminService {
    // --- GESTIÓN DE CATEGORÍAS ---
    async getAllCategories() {
        try {
            return await Categoria.findAll({
                include: [
                    {
                        model: Habito,
                        as: 'habitos',
                        attributes: ['id', 'nombre']
                    }
                ]
            });
        } catch (error) {
            throw { status: 500, message: error.message };
        }
    }

    async createCategory(data) {
        const { nombre, descripcion, icono } = data;
        
        if (!nombre) {
            throw { status: 400, message: "El nombre de la categoría es obligatorio" };
        }

        try {
            const existente = await Categoria.findOne({ where: { nombre } });
            if (existente) {
                throw { status: 400, message: "La categoría ya existe" };
            }

            return await Categoria.create({
                nombre,
                descripcion: descripcion || null,
                icono: icono || null
            });
        } catch (error) {
            throw { status: error.status || 500, message: error.message };
        }
    }

    async updateCategory(id, data) {
        try {
            const categoria = await Categoria.findByPk(id);
            if (!categoria) {
                throw { status: 404, message: "Categoría no encontrada" };
            }

            return await categoria.update(data);
        } catch (error) {
            throw { status: error.status || 500, message: error.message };
        }
    }

    async deleteCategory(id) {
        try {
            const categoria = await Categoria.findByPk(id);
            if (!categoria) {
                throw { status: 404, message: "Categoría no encontrada" };
            }

            // Verificar si tiene hábitos asociados
            const habitosCount = await Habito.count({ where: { categoria_id: id } });
            if (habitosCount > 0) {
                throw { status: 400, message: `No se puede eliminar. Hay ${habitosCount} hábito(s) asociado(s)` };
            }

            await categoria.destroy();
            return { message: "Categoría eliminada correctamente" };
        } catch (error) {
            throw { status: error.status || 500, message: error.message };
        }
    }

    // --- GESTIÓN DEL CATÁLOGO DE HÁBITOS ---
    async getAllHabits() {
        try {
            return await Habito.findAll({
                include: [
                    { model: Categoria, as: 'categoria' },
                    { model: Usuario, as: 'creador', attributes: ['id', 'username'] }
                ],
                order: [['es_predeterminado', 'DESC'], ['nombre', 'ASC']]
            });
        } catch (error) {
            throw { status: 500, message: error.message };
        }
    }

    async createHabit(data) {
        const { nombre, descripcion_breve, descripcion_larga, categoria_id } = data;

        if (!nombre || !descripcion_breve) {
            throw { status: 400, message: "Nombre y descripción breve son obligatorios" };
        }

        try {
            // Verificar que la categoría existe
            if (categoria_id) {
                const categoria = await Categoria.findByPk(categoria_id);
                if (!categoria) {
                    throw { status: 404, message: "Categoría no encontrada" };
                }
            }

            return await Habito.create({
                nombre,
                descripcion_breve,
                descripcion_larga: descripcion_larga || null,
                categoria_id: categoria_id || null,
                es_predeterminado: true
            });
        } catch (error) {
            throw { status: error.status || 500, message: error.message };
        }
    }

    async updateHabit(id, data) {
        try {
            const habito = await Habito.findByPk(id);
            if (!habito) {
                throw { status: 404, message: "Hábito no encontrado" };
            }

            // Verificar que la categoría existe si se intenta cambiar
            if (data.categoria_id && data.categoria_id !== habito.categoria_id) {
                const categoria = await Categoria.findByPk(data.categoria_id);
                if (!categoria) {
                    throw { status: 404, message: "Categoría no encontrada" };
                }
            }

            return await habito.update(data);
        } catch (error) {
            throw { status: error.status || 500, message: error.message };
        }
    }

    async deleteHabit(id) {
        try {
            const habito = await Habito.findByPk(id);
            if (!habito) {
                throw { status: 404, message: "Hábito no encontrado" };
            }

            // Verificar si es predeterminado
            if (habito.es_predeterminado) {
                // Contar cuántos usuarios lo tienen suscrito
                const usuariosCount = await UsuarioHabito.count({ where: { habito_id: id } });
                if (usuariosCount > 0) {
                    throw { status: 400, message: `No se puede eliminar. ${usuariosCount} usuario(s) lo tienen suscrito` };
                }
            }

            await habito.destroy();
            return { message: "Hábito eliminado correctamente" };
        } catch (error) {
            throw { status: error.status || 500, message: error.message };
        }
    }

    // --- ESTADÍSTICAS GENERALES ---
    async getDashboardStats() {
        try {
            const totalUsuarios = await Usuario.count();
            const totalHabitos = await Habito.count();
            const habitosPredeterminados = await Habito.count({ where: { es_predeterminado: true } });
            const habitosPersonalizados = await Habito.count({ where: { es_predeterminado: false } });
            const totalCategorias = await Categoria.count();
            const totalSuscripciones = await UsuarioHabito.count();

            // Ranking de rachas
            const rankingRachas = await UsuarioHabito.findAll({
                attributes: ['racha_actual'],
                include: [
                    { model: Habito, as: 'detalle_habito', attributes: ['nombre'] },
                    { model: Usuario, as: 'usuario', attributes: ['username'] }
                ],
                order: [['racha_actual', 'DESC']],
                limit: 5
            });

            // Hábitos más populares (por suscripciones)
            const habitosPopulares = await Habito.findAll({
                attributes: [
                    'nombre',
                    [Habito.sequelize.fn('COUNT', Habito.sequelize.col('suscripciones.id')), 'total_suscripciones']
                ],
                include: [{
                    model: UsuarioHabito,
                    as: 'suscripciones',
                    attributes: []
                }],
                group: ['Habito.id', 'Habito.nombre'],
                order: [[Habito.sequelize.fn('COUNT', Habito.sequelize.col('suscripciones.id')), 'DESC']],
                limit: 5,
                subQuery: false
            });

            return {
                totalUsuarios,
                totalHabitos,
                habitosPredeterminados,
                habitosPersonalizados,
                totalCategorias,
                totalSuscripciones,
                rankingRachas,
                habitosPopulares
            };
        } catch (error) {
            throw { status: 500, message: error.message };
        }
    }

    // --- GESTIÓN DE USUARIOS ---
    async getAllUsers() {
        try {
            return await Usuario.findAll({
                attributes: { exclude: ['password'] },
                include: [
                    {
                        model: UsuarioHabito,
                        as: 'suscripciones',
                        attributes: ['id']
                    }
                ]
            });
        } catch (error) {
            throw { status: 500, message: error.message };
        }
    }

    async updateUserRole(userId, es_admin) {
        try {
            const usuario = await Usuario.findByPk(userId);
            if (!usuario) {
                throw { status: 404, message: "Usuario no encontrado" };
            }

            return await usuario.update({ es_admin });
        } catch (error) {
            throw { status: error.status || 500, message: error.message };
        }
    }

    async deleteUser(userId) {
        try {
            const usuario = await Usuario.findByPk(userId);
            if (!usuario) {
                throw { status: 404, message: "Usuario no encontrado" };
            }

            // No permitir eliminar el último admin
            if (usuario.es_admin) {
                const adminsCount = await Usuario.count({ where: { es_admin: true } });
                if (adminsCount <= 1) {
                    throw { status: 400, message: "No se puede eliminar el único administrador" };
                }
            }

            await usuario.destroy();
            return { message: "Usuario eliminado correctamente" };
        } catch (error) {
            throw { status: error.status || 500, message: error.message };
        }
    }
}

module.exports = new AdminService();