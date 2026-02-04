const { Sequelize } = require('sequelize');

// Configuración dinámica para desarrollo local y Docker
const sequelize = new Sequelize(
    process.env.DB_NAME || 'awi_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'postgres',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        port: process.env.DB_PORT || 5435,
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        define: {
            timestamps: false // Evita que Sequelize intente buscar las columnas 'createdAt' y 'updatedAt'
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// Función para probar la conexión
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos exitosa');
        console.log(`📊 Conectado a: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5435}/${process.env.DB_NAME || 'awi_db'}`);
    } catch (err) {
        console.error('❌ Error de conexión a la base de datos:', err.message);
        process.exit(1);
    }
};

testConnection();

module.exports = sequelize;