const express = require('express');
const cors = require('cors');
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

// Ruta de salud / prueba
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'API AWI (In-Memory) funcionando correctamente',
        architecture: 'Layered (Routes -> Services -> Repositories)'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    console.log('Almacenamiento: En memoria (Volátil)');
});