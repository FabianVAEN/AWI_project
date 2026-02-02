const Usuario = sequelize.define('Usuario', {
  id_usuario: { // PK proporcionada 
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: { // Nickname del usuario 
    type: DataTypes.STRING,
    allowNull: false
  },
  nombre: { // 
    type: DataTypes.STRING,
    allowNull: false
  },
  apellido: { // 
    type: DataTypes.STRING,
    allowNull: true // Puede no tener segundo nombre
  },
  email: { // 
    type: DataTypes.STRING,
    unique: true, // No queremos correos duplicados
    allowNull: false
  },
  Password: { // Agregado para seguridad (indispensable)
    type: DataTypes.STRING,
    allowNull: false
  }
}, { tableName: 'usuarios' });