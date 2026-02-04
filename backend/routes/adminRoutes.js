const express = require('express');
const router = express.Router();
const AdminService = require('../services/adminService');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Todas las rutas de admin requieren autenticación y rol de admin
router.use(authMiddleware);
router.use(adminMiddleware);

// --- DASHBOARD ---
router.get('/dashboard/stats', async (req, res) => {
    try {
        const stats = await AdminService.getDashboardStats();
        res.json(stats);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
});

// --- GESTIÓN DE CATEGORÍAS ---
router.get('/categorias', async (req, res) => {
    try {
        const categorias = await AdminService.getAllCategories();
        res.json(categorias);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
});

router.post('/categorias', async (req, res) => {
    try {
        const categoria = await AdminService.createCategory(req.body);
        res.status(201).json(categoria);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
});

router.patch('/categorias/:id', async (req, res) => {
    try {
        const categoria = await AdminService.updateCategory(req.params.id, req.body);
        res.json(categoria);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
});

router.delete('/categorias/:id', async (req, res) => {
    try {
        const result = await AdminService.deleteCategory(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
});

// --- GESTIÓN DEL CATÁLOGO DE HÁBITOS ---
router.get('/habitos-catalogo', async (req, res) => {
    try {
        const habitos = await AdminService.getAllHabits();
        res.json(habitos);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
});

router.post('/habitos-catalogo', async (req, res) => {
    try {
        const habito = await AdminService.createHabit(req.body);
        res.status(201).json(habito);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
});

router.patch('/habitos-catalogo/:id', async (req, res) => {
    try {
        const habito = await AdminService.updateHabit(req.params.id, req.body);
        res.json(habito);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
});

router.delete('/habitos-catalogo/:id', async (req, res) => {
    try {
        const result = await AdminService.deleteHabit(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
});

// --- GESTIÓN DE USUARIOS ---
router.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await AdminService.getAllUsers();
        res.json(usuarios);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
});

router.patch('/usuarios/:id/rol', async (req, res) => {
    try {
        const { es_admin } = req.body;
        if (typeof es_admin !== 'boolean') {
            return res.status(400).json({ error: "es_admin debe ser un booleano" });
        }
        const usuario = await AdminService.updateUserRole(req.params.id, es_admin);
        res.json(usuario);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
});

router.delete('/usuarios/:id', async (req, res) => {
    try {
        const result = await AdminService.deleteUser(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
});

module.exports = router;