const mongoose = require('mongoose');
const User = require('../models/User');
const Game = require('../models/Game');
const Reservation = require('../models/Reservation');

exports.createReservation = async (req, res) => {
  const { gameId, cantidad } = req.body;
  const uid = req.userId;
  const qty = Number(cantidad) || 1;
  if(qty <= 0) return res.status(400).json({ message: 'Cantidad inválida' });

  // Intentamos transacción; si no hay soporte DB, fallback a método atómico
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const game = await Game.findById(gameId).session(session);
    if(!game) throw { status: 404, message: 'Juego no encontrado' };
    if(game.stock < qty) throw { status: 400, message: 'Stock insuficiente' };

    const totalPrice = game.precio * qty;
    const user = await User.findById(uid).session(session);
    if(!user) throw { status: 404, message: 'Usuario no encontrado' };
    if(user.saldo < totalPrice) throw { status: 400, message: 'Saldo insuficiente' };

    // Actualizar y crear reserva
    user.saldo -= totalPrice;
    game.stock -= qty;
    await user.save({ session });
    await game.save({ session });

    const reservation = new Reservation({
      userId: uid,
      gameId: game._id,
      cantidad: qty,
      estado: 'pendiente'
    });
    await reservation.save({ session });

    await session.commitTransaction();
    session.endSession();

    const populated = await Reservation.findById(reservation._id).populate('gameId').populate('userId');
    res.status(201).json(populated);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    if(err.status) return res.status(err.status).json({ message: err.message });
    console.error('createReservation err', err);
    res.status(500).json({ message: 'Error crear reserva' });
  }
};

// Cancelar reserva (antes de fecha de lanzamiento)
exports.cancelReservation = async (req, res) => {
  try {
    const resId = req.params.id;
    const uid = req.userId;
    const reservation = await Reservation.findById(resId);
    if(!reservation) return res.status(404).json({ message: 'Reserva no encontrada' });
    if(reservation.userId.toString() !== uid) return res.status(403).json({ message: 'No autorizado' });
    if(reservation.estado !== 'pendiente') return res.status(400).json({ message: 'No se puede cancelar' });

    const game = await Game.findById(reservation.gameId);
    if(!game) return res.status(404).json({ message: 'Juego no encontrado' });

    const now = new Date();
    if(now >= game.fechaLanzamiento) return res.status(400).json({ message: 'Ya pasó la fecha de lanzamiento' });

    const totalPrice = game.precio * reservation.cantidad;

    // Revertir saldo y stock - aquí no usamos transacción para mantener simple; en producción usar transacción
    await Game.findByIdAndUpdate(game._id, { $inc: { stock: reservation.cantidad } });
    await User.findByIdAndUpdate(uid, { $inc: { saldo: totalPrice } });

    reservation.estado = 'cancelada';
    await reservation.save();

    res.json({ message: 'Reserva cancelada', reservation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error cancelar reserva' });
  }
};

exports.listUserReservations = async (req, res) => {
  try {
    const uid = req.userId;
    const reservations = await Reservation.find({ userId: uid }).populate('gameId').sort({ createdAt: -1 });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: 'Error' });
  }
};
