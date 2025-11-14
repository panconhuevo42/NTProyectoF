const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Registrar usuario (alternativa al authCtrl)
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body; // ✅ Corregido

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'El usuario ya existe' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ 
      username, 
      email, 
      password: hashedPassword,
      wallet: 0 
    });
    
    await user.save();
    
    res.status(201).json({ 
      message: 'Usuario registrado correctamente',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        wallet: user.wallet
      }
    });
  } catch (error) {
    res.status(400).json({ message: 'Error al registrar usuario', error });
  }
};

// Obtener todos los usuarios (admin)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error });
  }
};

// Obtener usuario por ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario', error });
  }
};

// Recargar wallet
exports.addToWallet = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (amount <= 0) {
      return res.status(400).json({ message: 'El monto debe ser mayor a 0' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    user.wallet += amount;
    await user.save();

    res.json({
      message: 'Wallet recargado exitosamente',
      newBalance: user.wallet
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al recargar wallet', error });
  }
};

// Actualizar usuario
exports.updateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    ).select('-password');
    
    if (!updated) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar usuario', error });
  }
};