const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Estas rutas se conectarán con React
router.post('/register', usuarioController.registrar);
router.post('/login', usuarioController.login);

module.exports = router;