
// server.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'awi_db',
  password: process.env.DB_PASSWORD || '1234',
  port: process.env.DB_PORT || 5432,
});

// Inicializar base de datos
const initDB = async () => {
  try {
    // Crear tabla de hábitos predeterminados
    await pool.query(`
      CREATE TABLE IF NOT EXISTS habitos_default (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Crear tabla de lista de hábitos del usuario
    await pool.query(`
      CREATE TABLE IF NOT EXISTS lista_habitos (
        id SERIAL PRIMARY KEY,
        habito_id INTEGER REFERENCES habitos_default(id),
        estado VARCHAR(20) DEFAULT 'por hacer',
        agregado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insertar hábitos predeterminados si no existen
    const { rows } = await pool.query('SELECT COUNT(*) FROM habitos_default');
    if (parseInt(rows[0].count) === 0) {
      const habitosDefault = [
        ['Beber 8 vasos de agua', 'Mantener hidratación adecuada durante el día'],
        ['Hacer ejercicio 30 min', 'Actividad física diaria para mantener la salud'],
        ['Dormir 8 horas', 'Descanso adecuado para recuperación'],
        ['Meditar 10 minutos', 'Práctica de mindfulness y relajación'],
        ['Comer 5 porciones de frutas/verduras', 'Nutrición balanceada'],
        ['Leer 20 páginas', 'Estimulación mental y aprendizaje'],
        ['Caminar 10,000 pasos', 'Actividad física continua'],
        ['Desconectar dispositivos 1 hora antes de dormir', 'Mejor calidad de sueño'],
        ['Practicar gratitud', 'Escribir 3 cosas por las que estás agradecido'],
        ['Estiramientos matutinos', 'Activar el cuerpo al comenzar el día']
      ];

      for (const [nombre, descripcion] of habitosDefault) {
        await pool.query(
          'INSERT INTO habitos_default (nombre, descripcion) VALUES ($1, $2)',
          [nombre, descripcion]
        );
      }
      console.log('Hábitos predeterminados insertados correctamente');
    }

    console.log('Base de datos inicializada correctamente');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
  }
};

// Rutas API

// Obtener todos los hábitos predeterminados
app.get('/api/habitos', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM habitos_default ORDER BY id');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener hábitos:', error);
    res.status(500).json({ error: 'Error al obtener hábitos' });
  }
});

// Obtener la lista de hábitos del usuario
app.get('/api/lista-habitos', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT lh.id, lh.estado, hd.nombre, hd.descripcion, lh.agregado_at
      FROM lista_habitos lh
      JOIN habitos_default hd ON lh.habito_id = hd.id
      ORDER BY lh.agregado_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener lista de hábitos:', error);
    res.status(500).json({ error: 'Error al obtener lista de hábitos' });
  }
});

// Agregar hábito a la lista del usuario
app.post('/api/lista-habitos', async (req, res) => {
  const { habito_id } = req.body;
  
  try {
    // Verificar si el hábito ya está en la lista
    const { rows: existente } = await pool.query(
      'SELECT * FROM lista_habitos WHERE habito_id = $1',
      [habito_id]
    );

    if (existente.length > 0) {
      return res.status(400).json({ error: 'Este hábito ya está en tu lista' });
    }

    const { rows } = await pool.query(
      `INSERT INTO lista_habitos (habito_id) 
       VALUES ($1) 
       RETURNING *`,
      [habito_id]
    );
    
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error al agregar hábito:', error);
    res.status(500).json({ error: 'Error al agregar hábito' });
  }
});

// Actualizar estado de un hábito
app.patch('/api/lista-habitos/:id', async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  if (estado !== 'por hacer' && estado !== 'hecho') {
    return res.status(400).json({ error: 'Estado inválido' });
  }

  try {
    const { rows } = await pool.query(
      'UPDATE lista_habitos SET estado = $1 WHERE id = $2 RETURNING *',
      [estado, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Hábito no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error al actualizar hábito:', error);
    res.status(500).json({ error: 'Error al actualizar hábito' });
  }
});

// Eliminar hábito de la lista
app.delete('/api/lista-habitos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await pool.query(
      'DELETE FROM lista_habitos WHERE id = $1 RETURNING *',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Hábito no encontrado' });
    }

    res.json({ message: 'Hábito eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar hábito:', error);
    res.status(500).json({ error: 'Error al eliminar hábito' });
  }
});

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API AWI funcionando correctamente' });
});

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  await initDB();
});