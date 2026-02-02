const { Usuario } = require('../models'); // Importa tus modelos
const bcrypt = require('bcryptjs');

const usuarioController = {
    // REGISTRO
    async registrar(req, res) {
        try {
            const { username, primer_nombre, segundo_nombre, email, password } = req.body;

            // Encriptar contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const nuevoUsuario = await Usuario.create({
                username,
                primer_nombre,
                segundo_nombre,
                email,
                password: hashedPassword
            });

            res.status(201).json({ mensaje: "Usuario creado", id: nuevoUsuario.id });
        } catch (error) {
            res.status(400).json({ error: "Error al registrar: " + error.message });
        }
    },

    // LOGIN (Básico)
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const usuario = await Usuario.findOne({ where: { email } });

            if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

            const esValida = await bcrypt.compare(password, usuario.password);
            if (!esValida) return res.status(401).json({ error: "Contraseña incorrecta" });

            res.json({ mensaje: "Bienvenido", usuario: { id: usuario.id, username: usuario.username } });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = usuarioController;