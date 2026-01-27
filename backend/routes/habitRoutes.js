const express = require('express');
const router = express.Router();
const HabitService = require('../services/habitService');

// Obtener catálogo de hábitos predeterminados
router.get('/habitos', (req, res) => {
    const result = HabitService.getAllDefaults();
    res.json(result);
});

// Obtener lista de hábitos del usuario
router.get('/lista-habitos', (req, res) => {
    const result = HabitService.getUserHabits();
    res.json(result);
});

// Agregar hábito (desde catálogo o personalizado)
router.post('/lista-habitos', (req, res) => {
    try {
        let result;
        if (req.body.habito_id) {
            // Desde catálogo
            result = HabitService.addHabitFromCatalog(req.body.habito_id);
        } else {
            // Personalizado
            result = HabitService.createCustomHabit(req.body);
        }
        res.status(201).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
});

// Actualizar hábito (estado o datos)
router.patch('/lista-habitos/:id', (req, res) => {
    try {
        const result = HabitService.updateHabit(req.params.id, req.body);
        res.json(result);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
});

// Eliminar hábito
router.delete('/lista-habitos/:id', (req, res) => {
    try {
        const result = HabitService.deleteHabit(req.params.id);
        res.json({ message: "Hábito eliminado correctamente", habit: result });
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
});

module.exports = router;