const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { authMiddleware } = require('../middleware/auth');

// Estas rutas se conectaran con React
router.post('/register', usuarioController.registrar);
router.post('/login', usuarioController.login);
router.patch('/perfil', authMiddleware, usuarioController.actualizarPerfil);

module.exports = router;
