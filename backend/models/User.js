const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: [true, 'El nombre de usuario es requerido'],
    trim: true,
    minlength: [3, 'El nombre de usuario debe tener al menos 3 caracteres'],
    maxlength: [30, 'El nombre de usuario no puede exceder 30 caracteres']
  },
  email: { 
    type: String, 
    required: [true, 'El email es requerido'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingresa un email válido']
  },
  password: { 
    type: String, 
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  },
  wallet: {  // ✅ Cambiado de 'saldo' a 'wallet' para consistencia
    type: Number, 
    default: 0,
    min: [0, 'El saldo no puede ser negativo']
  },
  role: {  // ✅ Cambiado de 'rol' a 'role' para consistencia
    type: String, 
    enum: {
      values: ['client', 'admin'],
      message: 'Rol inválido'
    },
    default: 'client'
  }
}, { 
  timestamps: true 
});

// Encriptar la contraseña antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Comparar contraseñas al hacer login
userSchema.methods.comparePassword = async function (passwordInput) {
  return bcrypt.compare(passwordInput, this.password);
};

// Método para verificar si tiene saldo suficiente
userSchema.methods.hasSufficientBalance = function (amount) {
  return this.wallet >= amount;
};

// Método para agregar saldo
userSchema.methods.addToWallet = function (amount) {
  if (amount <= 0) throw new Error('El monto debe ser positivo');
  this.wallet += amount;
  return this.save();
};

// Método para descontar saldo
userSchema.methods.deductFromWallet = function (amount) {
  if (amount <= 0) throw new Error('El monto debe ser positivo');
  if (!this.hasSufficientBalance(amount)) {
    throw new Error('Saldo insuficiente');
  }
  this.wallet -= amount;
  return this.save();
};

// Índices para mejor performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

// Para no enviar la contraseña en las respuestas
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
