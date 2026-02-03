// middleware/auth.js - Nuevo archivo
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'awi_secreto_desarrollo';

const authMiddleware = (req, res, next) => {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            error: "Acceso denegado. Token no proporcionado." 
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verificar token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id;
        req.userEmail = decoded.email;
        next();
    } catch (error) {
        return res.status(401).json({ 
            error: "Token inválido o expirado" 
        });
    }
};

module.exports = authMiddleware;