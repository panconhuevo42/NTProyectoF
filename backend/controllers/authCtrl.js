// controllers/authCtrl.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// Registrar usuario
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Verificar si el usuario ya existe
    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).json({ msg: 'El usuario ya existe' });

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario nuevo con wallet inicial 0
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      wallet: 0
    });

    await newUser.save();

    res.status(201).json({ 
      msg: 'Usuario registrado correctamente',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        wallet: newUser.wallet
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};

// Login de usuario
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar el usuario
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Usuario no encontrado' });

    // Comparar contraseñas
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ msg: 'Contraseña incorrecta' });

    // Crear token JWT
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ 
      msg: 'Login exitoso', 
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        wallet: user.wallet
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};

