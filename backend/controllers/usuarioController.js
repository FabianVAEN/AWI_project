const { Usuario } = require('../repositories/models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'awi_secreto_desarrollo';

const usuarioController = {
    async registrar(req, res) {
        try {
            const { username, primer_nombre, segundo_nombre, email, password } = req.body;

            // Validaciones básicas
            if (!email || !password || !username) {
                return res.status(400).json({ 
                    error: "Email, usuario y contraseña son requeridos" 
                });
            }

            // Verificar si usuario ya existe
            const [existeEmail, existeUsername] = await Promise.all([
                Usuario.findOne({ where: { email } }),
                Usuario.findOne({ where: { username } })
            ]);

            if (existeEmail) {
                return res.status(400).json({
                    error: "El email ya esta registrado"
                });
            }

            if (existeUsername) {
                return res.status(400).json({
                    error: "El usuario ya esta registrado"
                });
            }

            // Encriptar contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Crear usuario
            const nuevoUsuario = await Usuario.create({
                username,
                primer_nombre,
                segundo_nombre: segundo_nombre || null,
                email,
                password: hashedPassword
            });

            // Generar token
            const token = jwt.sign(
                { 
                    id: nuevoUsuario.id, 
                    email: nuevoUsuario.email 
                },
                JWT_SECRET,
                { expiresIn: '7d' }
            );

            // Eliminar password de la respuesta
            const usuarioRespuesta = {
                id: nuevoUsuario.id,
                username: nuevoUsuario.username,
                email: nuevoUsuario.email,
                primer_nombre: nuevoUsuario.primer_nombre,
                created_at: nuevoUsuario.created_at
            };

            res.status(201).json({ 
                mensaje: "Usuario creado exitosamente",
                token,
                usuario: usuarioRespuesta
            });
        } catch (error) {
            console.error('Error en registro:', error);

            // Errores de validacion de Sequelize
            if (error.name === 'SequelizeValidationError') {
                const messages = (error.errors || []).map(e => e.message);
                return res.status(400).json({
                    error: messages[0] || "Datos invalidos"
                });
            }

            // Errores de unicidad (email/username)
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(400).json({
                    error: "Email o usuario ya registrado"
                });
            }

            res.status(500).json({
                error: "Error en el servidor al registrar usuario"
            });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Validar
            if (!email || !password) {
                return res.status(400).json({ 
                    error: "Email y contraseña requeridos" 
                });
            }

            // Buscar usuario
            const usuario = await Usuario.findOne({ 
                where: { email },
                attributes: ['id', 'username', 'email', 'password', 'primer_nombre']
            });

            if (!usuario) {
                return res.status(401).json({ 
                    error: "Credenciales incorrectas" 
                });
            }

            // Verificar contraseña
            const esValida = await bcrypt.compare(password, usuario.password);
            if (!esValida) {
                return res.status(401).json({ 
                    error: "Credenciales incorrectas" 
                });
            }

            // Generar token
            const token = jwt.sign(
                { 
                    id: usuario.id, 
                    email: usuario.email 
                },
                JWT_SECRET,
                { expiresIn: '7d' }
            );

            // Respuesta sin password
            const usuarioRespuesta = {
                id: usuario.id,
                username: usuario.username,
                email: usuario.email,
                primer_nombre: usuario.primer_nombre
            };

            res.json({ 
                mensaje: "Inicio de sesión exitoso",
                token,
                usuario: usuarioRespuesta
            });
        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({ 
                error: "Error en el servidor al iniciar sesión" 
            });
        }
    },

    async perfil(req, res) {
        try {
            // Este endpoint necesitará middleware de autenticación
            const usuario = await Usuario.findByPk(req.userId, {
                attributes: { exclude: ['password'] }
            });
            
            if (!usuario) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }
            
            res.json({ usuario });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = usuarioController;