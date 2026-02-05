const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database'); // ← DOS niveles arriba

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 20]
    }
  },
  primer_nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 20]
    }
  },
  segundo_nombre: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [0, 20]
    }
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
      len: [5, 30]
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  es_admin: { 
    type: DataTypes.BOOLEAN,
    defaultValue: false
}
}, { 
  tableName: 'usuarios',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Usuario;