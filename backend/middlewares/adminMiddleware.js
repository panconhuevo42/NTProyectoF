const User = require('../models/User');

// Middleware para verificar si el usuario es administrador
module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Acceso denegado. Se requieren privilegios de administrador' 
      });
    }
    
    next();
  } catch (error) {
    console.error('❌ Error en adminMiddleware:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error al verificar permisos' 
    });
  }
};