const Categoria = sequelize.define('Categoria', {
  id_categoria: { // PK 
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: { // 
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: { // 
    type: DataTypes.TEXT
  },
  icono: { // Para FontAwesome o URLs 
    type: DataTypes.STRING
  }
}, { tableName: 'categorias' });