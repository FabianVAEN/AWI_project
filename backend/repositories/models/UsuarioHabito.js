const Usuario_Habito = sequelize.define('UsuarioHabito', {
  Id_usuarios_habitos: { // Tu PK personalizada para la intermedia 
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Racha_actual: { // 
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  Racha_maxima: { // 
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
  // Usuario_id y Habito_id se inyectarán como FKs 
}, { tableName: 'usuario_habitos' });