const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'El título es requerido'],
    trim: true
  },
  price: { 
    type: Number, 
    required: [true, 'El precio es requerido'],
    min: [0, 'El precio no puede ser negativo']
  },
  description: { 
    type: String, 
    required: [true, 'La descripción es requerida'],
    trim: true
  },
  releaseDate: {
    type: Date,
    required: [true, 'La fecha de lanzamiento es requerida para preventas'],
    validate: {
      validator: function(date) {
        return date > new Date();
      },
      message: 'La fecha de lanzamiento debe ser futura'
    }
  },
  developer: {
    type: String,
    default: 'Desconocido',
    trim: true
  },
  genre: {
    type: String,
    default: 'No especificado',
    trim: true
  },
  available: {
    type: Boolean,
    default: true
  },
  image: {
    type: String,
    default: ''
  }
}, { 
  timestamps: true 
});

// Índice para búsquedas eficientes
gameSchema.index({ title: 'text', description: 'text' });
gameSchema.index({ releaseDate: 1 });
gameSchema.index({ available: 1 });

module.exports = mongoose.model('Game', gameSchema);