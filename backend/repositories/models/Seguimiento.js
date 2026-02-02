const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Seguimiento = sequelize.define('Seguimiento', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuario_habito_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuario_habitos',
      key: 'id'
    }
  },
  fecha: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'completado'),
    defaultValue: 'pendiente'
  }
}, { 
  tableName: 'seguimiento',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['usuario_habito_id', 'fecha']
    }
  ]
});

module.exports = Seguimiento;