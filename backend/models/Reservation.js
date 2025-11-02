const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  gameId: { type: Schema.Types.ObjectId, ref: 'Game', required: true },
  cantidad: { type: Number, required: true, min: 1 },
  estado: { 
    type: String, 
    enum: ['pendiente','cancelada','completada'], 
    default: 'pendiente' 
  },
  fechaReserva: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);


