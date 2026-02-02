const express = require('express');
const cors = require('cors');
const { sequelize } = require('./repositories/models');
const habitRoutes = require('./routes/habitRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Rutas
app.use('/api', habitRoutes);

// Ruta de salud
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'API AWI (PostgreSQL + Sequelize) funcionando correctamente',
        architecture: 'Layered (Routes -> Services -> Repositories)'
    });
});

// Sincronizar DB e Iniciar servidor
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');
        
        // sync({ alter: true }) ajusta las tablas si hay cambios menores
        await sequelize.sync();
        console.log('Modelos sincronizados con la base de datos.');

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en puerto ${PORT}`);
            console.log('Almacenamiento: PostgreSQL (Persistente)');
        });
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
    }
};

app.use('/api/usuarios', require('./routes/usuarioRoutes'));

startServer();