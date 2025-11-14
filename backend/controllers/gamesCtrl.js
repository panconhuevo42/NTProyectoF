const Game = require('../models/Game');

// Crear un nuevo juego para preventa
exports.create = async (req, res) => {
  try {
    const { title, price, description, releaseDate, developer, genre } = req.body;

    if (!title || !price || !description || !releaseDate) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    // Verificar que la fecha de lanzamiento sea futura
    if (new Date(releaseDate) <= new Date()) {
      return res.status(400).json({ message: 'La fecha de lanzamiento debe ser futura' });
    }

    const newGame = new Game({ 
      title, 
      price, 
      description, 
      releaseDate,
      developer: developer || 'Desconocido',
      genre: genre || 'No especificado',
      available: true 
    });
    
    await newGame.save();

    res.status(201).json(newGame);
  } catch (error) {
    console.error('❌ Error al crear juego:', error);
    res.status(500).json({ message: 'Error al crear juego', error: error.message });
  }
};

// Listar todos los juegos
exports.list = async (req, res) => {
  try {
    const games = await Game.find().sort({ releaseDate: 1 });
    res.json(games);
  } catch (error) {
    console.error('❌ Error al listar juegos:', error);
    res.status(500).json({ message: 'Error al listar juegos' });
  }
};

// Obtener juegos disponibles para preventa
exports.getUpcoming = async (req, res) => {
  try {
    const games = await Game.find({ 
      releaseDate: { $gt: new Date() },
      available: true 
    }).sort({ releaseDate: 1 });
    
    res.json(games);
  } catch (error) {
    console.error('❌ Error al obtener juegos próximos:', error);
    res.status(500).json({ message: 'Error al obtener juegos próximos' });
  }
};

// Obtener un juego por ID
exports.getById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: 'Juego no encontrado' });
    res.json(game);
  } catch (error) {
    console.error('❌ Error al obtener juego:', error);
    res.status(500).json({ message: 'Error al obtener juego' });
  }
};

// Actualizar un juego
exports.update = async (req, res) => {
  try {
    const updated = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Juego no encontrado' });
    res.json(updated);
  } catch (error) {
    console.error('❌ Error al actualizar juego:', error);
    res.status(500).json({ message: 'Error al actualizar juego' });
  }
};

// Eliminar un juego
exports.remove = async (req, res) => {
  try {
    const deleted = await Game.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Juego no encontrado' });
    res.json({ message: 'Juego eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar juego:', error);
    res.status(500).json({ message: 'Error al eliminar juego' });
  }
};




