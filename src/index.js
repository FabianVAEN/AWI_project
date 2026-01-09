const app = require('./app');
const pool = require('./db');

const PORT = 3001;

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      message: 'Backend Awi activo',
      time: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: 'Error de conexión a la base de datos' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
