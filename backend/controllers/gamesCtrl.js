const Game = require('../models/Game');

// Crear un nuevo juego
exports.create = async (req, res) => {
  try {
    console.log('📥 Datos recibidos:', req.body);
    const { title, price, description } = req.body;

    if (!title || !price || !description) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const newGame = new Game({ title, price, description });
    await newGame.save();

    console.log('✅ Juego creado correctamente:', newGame);
    res.status(201).json(newGame);
  } catch (error) {
  console.error('❌ Error al crear juego:', error.message);
  console.error(error.stack);
  res.status(500).json({ message: 'Error al crear juego', error: error.message });
}
};

// Listar todos los juegos
exports.list = async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (error) {
    console.error('❌ Error al listar juegos:', error);
    res.status(500).json({ message: 'Error al listar juegos' });
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




