const express = require('express');
const router = express.Router();
const HabitService = require('../services/habitService');

// Obtener catálogo de hábitos predeterminados
router.get('/habitos', async (req, res) => {
    try {
        const result = await HabitService.getAllDefaults();
        res.json(result);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
});

// Obtener lista de hábitos del usuario
router.get('/lista-habitos', async (req, res) => {
    try {
        const result = await HabitService.getUserHabits();
        res.json(result);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
});

// Agregar hábito (desde catálogo o personalizado)
router.post('/lista-habitos', async (req, res) => {
    try {
        let result;
        if (req.body.habito_id) {
            result = await HabitService.addHabitFromCatalog(req.body.habito_id);
        } else {
            result = await HabitService.createCustomHabit(req.body);
        }
        res.status(201).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
});

// Actualizar hábito (estado o datos)
router.patch('/lista-habitos/:id', async (req, res) => {
    try {
        const result = await HabitService.updateHabit(req.params.id, req.body);
        res.json(result);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
});

// Eliminar hábito
router.delete('/lista-habitos/:id', async (req, res) => {
    try {
        const result = await HabitService.deleteHabit(req.params.id);
        res.json({ message: "Hábito eliminado correctamente", habit: result });
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
});

module.exports = router;