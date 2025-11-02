// controllers/usersCtrl.js
const User = require('../models/User');

// 🔹 Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // sin mostrar contraseñas
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener usuarios' });
  }
};

// 🔹 Obtener información del usuario actual (por ahora simulado)
exports.getUserInfo = async (req, res) => {
  try {
    // si luego implementas JWT, aquí usarías req.user.id
    const user = await User.findOne(); // ejemplo: retorna el primero
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });
    res.json({ username: user.username, email: user.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener info del usuario' });
  }
};

// 🔹 Recargar saldo del usuario
exports.depositBalance = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || !amount) return res.status(400).json({ msg: 'Datos incompletos' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

    // Si no tiene campo "balance", lo creamos
    user.balance = (user.balance || 0) + Number(amount);
    await user.save();

    res.json({ msg: 'Saldo recargado correctamente', balance: user.balance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al recargar saldo' });
  }
};

