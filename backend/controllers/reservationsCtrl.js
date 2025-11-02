const mongoose = require('mongoose');
const User = require('../models/User');
const Game = require('../models/Game');
const Reservation = require('../models/Reservation');

// Obtener todas las reservas (poblando usuario y juego)
exports.getReservations = async (req, res) => {
  try {
    const reservas = await Reservation.find()
      .populate('userId', 'nombre email')
      .populate('gameId', 'titulo precio');
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener reservas', error });
  }
};

// Crear una nueva reserva
exports.createReservation = async (req, res) => {
  try {
    const reserva = new Reservation(req.body);
    await reserva.save();
    res.status(201).json({ message: 'Reserva creada correctamente', reserva });
  } catch (error) {
    res.status(400).json({ message: 'Error al crear la reserva', error });
  }
};

// Actualizar una reserva
exports.updateReservation = async (req, res) => {
  try {
    const reserva = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!reserva) return res.status(404).json({ message: 'Reserva no encontrada' });
    res.json({ message: 'Reserva actualizada', reserva });
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar la reserva', error });
  }
};

// Eliminar una reserva
exports.deleteReservation = async (req, res) => {
  try {
    const reserva = await Reservation.findByIdAndDelete(req.params.id);
    if (!reserva) return res.status(404).json({ message: 'Reserva no encontrada' });
    res.json({ message: 'Reserva eliminada' });
  } catch (error) {
    res.status(400).json({ message: 'Error al eliminar la reserva', error });
  }
};
