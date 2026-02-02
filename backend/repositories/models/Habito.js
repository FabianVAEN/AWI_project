const Habito = sequelize.define('Habito', {
  id_habito: { // PK 
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: { // 
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion_breve: { // Descripción breve para la Card 
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion_larga: { // Descripción larga para el modal 
    type: DataTypes.TEXT
  }
  // FKs como Id_categoria se crean automáticamente con las asociaciones
}, { tableName: 'habitos' });