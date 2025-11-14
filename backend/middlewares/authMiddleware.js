//middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'secretdev';

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      return res.status(401).json({ 
        success: false,
        message: 'Token de autorización requerido' 
      });
    }

    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ 
        success: false,
        message: 'Formato de token inválido. Use: Bearer [token]' 
      });
    }

    const token = parts[1];

    // Verificar token
    const payload = jwt.verify(token, JWT_SECRET);
    
    // Verificar que el usuario aún existe en la base de datos
    const user = await User.findById(payload.id).select('-password');
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Usuario no encontrado' 
      });
    }

    // Agregar información del usuario al request
    req.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      wallet: user.wallet
    };
    
    req.userId = payload.id; // Mantener compatibilidad
    
    next();
    
  } catch (err) {
    console.error('❌ Error en authMiddleware:', err.message);
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token inválido' 
      });
    }
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token expirado' 
      });
    }

    return res.status(500).json({ 
      success: false,
      message: 'Error en la autenticación' 
    });
  }
};
