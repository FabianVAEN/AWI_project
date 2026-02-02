const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Categoria = require('./Categoria');
const Habito = require('./Habito');
const UsuarioHabito = require('./UsuarioHabito');
const Seguimiento = require('./Seguimiento');

// --- DEFINICIÓN DE RELACIONES (ASOCIACIONES) ---

// 1. Categorías y Hábitos (1:N)
// Una categoría agrupa muchos hábitos predeterminados.
Categoria.hasMany(Habito, { foreignKey: 'categoria_id', as: 'habitos' });
Habito.belongsTo(Categoria, { foreignKey: 'categoria_id', as: 'categoria' });

// 2. Usuarios y Hábitos (N:M) a través de UsuarioHabito
// Esta es la relación que permite que muchos usuarios sigan el mismo hábito.
Usuario.belongsToMany(Habito, { 
    through: UsuarioHabito, 
    foreignKey: 'usuario_id',
    otherKey: 'habito_id',
    as: 'mis_habitos' 
});
Habito.belongsToMany(Usuario, { 
    through: UsuarioHabito, 
    foreignKey: 'habito_id',
    otherKey: 'usuario_id',
    as: 'usuarios' 
});

// 3. Relaciones Directas con la Tabla Intermedia (Para facilitar consultas)
// Necesitamos estas para poder acceder a las rachas directamente.
Usuario.hasMany(UsuarioHabito, { foreignKey: 'usuario_id' });
UsuarioHabito.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Habito.hasMany(UsuarioHabito, { foreignKey: 'habito_id' });
UsuarioHabito.belongsTo(Habito, { foreignKey: 'habito_id' });

// 4. UsuarioHabito y Seguimiento (1:N)
// Una "suscripción" a un hábito tiene muchos registros de cumplimiento diarios.
UsuarioHabito.hasMany(Seguimiento, { foreignKey: 'usuario_habito_id', as: 'registros' });
Seguimiento.belongsTo(UsuarioHabito, { foreignKey: 'usuario_habito_id' });

// 5. Hábitos Personalizados (1:N)
// Un usuario puede ser "dueño" de hábitos que él mismo creó.
Usuario.hasMany(Habito, { foreignKey: 'usuario_id', as: 'habitos_creados' });
Habito.belongsTo(Usuario, { foreignKey: 'usuario_id' });

module.exports = {
    sequelize,
    Usuario,
    Categoria,
    Habito,
    UsuarioHabito,
    Seguimiento
};