// controllers/gamesCtrl.js
const Game = require('../models/Game');

exports.list = async (req, res) => {
  try {
    const juegos = await Game.find();
    res.json(juegos);
  } catch (err) {
    res.status(500).json({ message: 'Error al listar juegos' });
  }
};

exports.create = async (req, res) => {
  try {
    const nuevoJuego = new Game(req.body);
    await nuevoJuego.save();
    res.status(201).json(nuevoJuego);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear juego' });
  }
};

