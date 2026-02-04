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
    unique: true
  },
  primer_nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  segundo_nombre: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
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