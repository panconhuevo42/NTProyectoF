const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
  titulo: { type: String, required: true },
  precio: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  fechaLanzamiento: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Game', gameSchema);
