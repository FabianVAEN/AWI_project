const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const UsuarioHabito = sequelize.define('UsuarioHabito', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  habito_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'habitos',
      key: 'id'
    }
  },
  racha_actual: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  racha_maxima: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, { 
  tableName: 'usuario_habitos',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['usuario_id', 'habito_id']
    }
  ]
});

module.exports = UsuarioHabito;