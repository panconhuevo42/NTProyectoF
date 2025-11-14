const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, 'El usuario es requerido'] 
  },
  gameId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Game', 
    required: [true, 'El juego es requerido'] 
  },
  amount: {  // ✅ Cambiado de 'cantidad' a 'amount' para consistencia
    type: Number, 
    required: [true, 'El monto es requerido'], 
    min: [0, 'El monto no puede ser negativo']
  },
  status: {  // ✅ Cambiado de 'estado' a 'status' para consistencia
    type: String, 
    enum: {
      values: ['active', 'cancelled', 'completed'],
      message: 'Estado inválido'
    },
    default: 'active'
  },
  reservationDate: {  // ✅ Cambiado de 'fechaReserva' para consistencia
    type: Date, 
    default: Date.now 
  },
  cancelledAt: {
    type: Date
  },
  completedAt: {
    type: Date
  }
}, { 
  timestamps: true 
});

// Índices para mejor performance
reservationSchema.index({ userId: 1, status: 1 });
reservationSchema.index({ gameId: 1, status: 1 });
reservationSchema.index({ reservationDate: -1 });

// Método virtual para verificar si se puede cancelar
reservationSchema.virtual('canBeCancelled').get(function() {
  const game = this.populated('gameId') || this.gameId;
  if (!game || !game.releaseDate) return false;
  return new Date() < new Date(game.releaseDate);
});

// Middleware para populación automática en find
reservationSchema.pre('find', function() {
  this.populate('gameId', 'title price releaseDate');
  this.populate('userId', 'username email');
});

reservationSchema.pre('findOne', function() {
  this.populate('gameId', 'title price releaseDate');
  this.populate('userId', 'username email');
});

module.exports = mongoose.model('Reservation', reservationSchema);
