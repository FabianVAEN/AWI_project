const express = require('express');
const cors = require('cors');
const { sequelize } = require('./repositories/models');
const habitRoutes = require('./routes/habitRoutes');
const adminRoutes = require('./routes/adminRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());


// Middleware de logging para depuración
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Rutas
app.use('/api', habitRoutes);     
app.use('/api/usuarios', usuarioRoutes); 
app.use('/api/admin', adminRoutes);       

// Ruta de salud
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'API AWI (PostgreSQL + Sequelize) funcionando correctamente',
        architecture: 'Layered (Routes -> Services -> Repositories)',
        features: ['Autenticación JWT', 'Gestión de Hábitos', 'Panel de Administración']
    });
});

// Sincronizar DB e Iniciar servidor
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');
        
        await sequelize.sync();
        console.log('Modelos sincronizados con la base de datos.');

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en puerto ${PORT}`);
            console.log('Almacenamiento: PostgreSQL (Persistente)');
            console.log('Endpoints disponibles:');
            console.log('  - GET  /api/habitos (Catálogo público)');
            console.log('  - GET  /api/lista-habitos (Hábitos del usuario)');
            console.log('  - POST /api/usuarios/login (Iniciar sesión)');
            console.log('  - POST /api/usuarios/register (Registrarse)');
            console.log('  - GET  /api/admin/dashboard/stats (Dashboard Admin)');
            console.log('  - GET  /api/admin/categorias (Gestión de categorías)');
            console.log('  - GET  /api/admin/habitos-catalogo (Gestión del catálogo)');
        });
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
        process.exit(1);
    }
};

startServer();
