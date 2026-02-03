const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Habito = sequelize.define('Habito', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion_breve: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion_larga: {
    type: DataTypes.TEXT
  },
  es_predeterminado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  categoria_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'categorias',
      key: 'id'
    }
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  }
}, { 
  tableName: 'habitos',
  timestamps: false 
});

module.exports = Habito;