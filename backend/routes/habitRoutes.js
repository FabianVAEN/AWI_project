const express = require('express');
const router = express.Router();
const HabitService = require('../services/habitService');
const { authMiddleware } = require('../middleware/auth');

// Obtener catálogo de hábitos predeterminados (Público o Autenticado)
router.get('/habitos', async (req, res) => {
    try {
        const result = await HabitService.getAllDefaults();
        res.json(result);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
});

// Obtener lista de hábitos del usuario
router.get('/lista-habitos', authMiddleware, async (req, res) => {
    try {
        const result = await HabitService.getUserHabits(req.userId);
        res.json(result);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
});

// Agregar hábito (desde catálogo o personalizado)
router.post('/lista-habitos', authMiddleware, async (req, res) => {
    try {
        let result;
        if (req.body.habito_id) {
            result = await HabitService.addHabitFromCatalog(req.body.habito_id, req.userId);
        } else {
            result = await HabitService.createCustomHabit(req.body, req.userId);
        }
        res.status(201).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
});

// Actualizar hábito (estado o datos)
router.patch('/lista-habitos/:id', authMiddleware, async (req, res) => {
    try {
        const result = await HabitService.updateHabit(req.params.id, req.body, req.userId);
        res.json(result);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
});

// Cambiar estado de hábito (completado/pendiente)
router.post('/lista-habitos/:id/toggle-status', authMiddleware, async (req, res) => {
    try {
        const { estado } = req.body;
        if (!estado || !['pendiente', 'completado'].includes(estado)) {
            return res.status(400).json({ error: "Estado inválido. Use 'pendiente' o 'completado'" });
        }

        const result = await HabitService.toggleHabitStatus(req.params.id, estado, req.userId);
        res.json(result);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
});

// Eliminar hábito
router.delete('/lista-habitos/:id', authMiddleware, async (req, res) => {
    try {
        const result = await HabitService.deleteHabit(req.params.id, req.userId);
        res.json({ message: "Hábito eliminado correctamente", habit: result });
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
});

module.exports = router;
