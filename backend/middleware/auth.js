const jwt = require('jsonwebtoken');
const { Usuario } = require('../repositories/models');

const JWT_SECRET = process.env.JWT_SECRET || 'awi_secreto_desarrollo';

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            error: "Acceso denegado. Token no proporcionado." 
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id;
        req.userEmail = decoded.email;
        
        // Opcional: Cargar usuario completo para tener el rol disponible
        const usuario = await Usuario.findByPk(req.userId);
        if (!usuario) {
            return res.status(401).json({ error: "Usuario no encontrado" });
        }
        req.user = usuario;
        
        next();
    } catch (error) {
        return res.status(401).json({ 
            error: "Token inválido o expirado" 
        });
    }
};

const adminMiddleware = (req, res, next) => {
    if (!req.user || !req.user.es_admin) {
        return res.status(403).json({ 
            error: "Acceso denegado. Se requieren permisos de administrador." 
        });
    }
    next();
};

module.exports = { authMiddleware, adminMiddleware };
