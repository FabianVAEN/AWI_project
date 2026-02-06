const sequelize = require('../../config/database');
const Usuario = require('./Usuario');
const Categoria = require('./Categoria');
const Habito = require('./Habito');
const UsuarioHabito = require('./UsuarioHabito');
const Seguimiento = require('./Seguimiento');

// --- DEFINICIÓN DE RELACIONES ---

// 1. Categorías y Hábitos (1:N)
Categoria.hasMany(Habito, { foreignKey: 'categoria_id', as: 'habitos' });
Habito.belongsTo(Categoria, { foreignKey: 'categoria_id', as: 'categoria' });

// 2. Usuarios y Hábitos (N:M) a través de UsuarioHabito
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

// 3. Relaciones Directas con la Tabla Intermedia
Usuario.hasMany(UsuarioHabito, { foreignKey: 'usuario_id', as: 'suscripciones' });
UsuarioHabito.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Habito.hasMany(UsuarioHabito, { foreignKey: 'habito_id', as: 'seguidores' });
UsuarioHabito.belongsTo(Habito, { foreignKey: 'habito_id', as: 'detalle_habito' });

// 4. UsuarioHabito y Seguimiento (1:N) - CORREGIDO
UsuarioHabito.hasMany(Seguimiento, { 
    foreignKey: 'usuario_habito_id', 
    as: 'registros' 
});
Seguimiento.belongsTo(UsuarioHabito, { 
    foreignKey: 'usuario_habito_id', 
    as: 'usuario_habito'  // ¡ALIAS AGREGADO!
});

// 5. Hábitos Personalizados (1:N)
Usuario.hasMany(Habito, { 
    foreignKey: 'usuario_id', 
    as: 'habitos_creados',
    onDelete: 'CASCADE'
});
Habito.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'creador' });

module.exports = {
    sequelize,
    Usuario,
    Categoria,
    Habito,
    UsuarioHabito,
    Seguimiento
};