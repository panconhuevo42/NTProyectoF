const Reservation = require('../models/Reservation');
const User = require('../models/User');
const Game = require('../models/Game');

// Obtener todas las reservas
exports.getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('userId', 'username email wallet')
      .populate('gameId', 'title price releaseDate');
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener reservas', error });
  }
};

// Obtener reservas por usuario
exports.getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.params.userId })
      .populate('gameId', 'title price releaseDate developer')
      .sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener reservas del usuario', error });
  }
};

// Crear una nueva reserva con descuento automático
exports.createReservation = async (req, res) => {
  try {
    const { userId, gameId } = req.body;

    const user = await User.findById(userId);
    const game = await Game.findById(gameId);

    if (!user || !game) {
      return res.status(404).json({ message: 'Usuario o juego no encontrado' });
    }

    // Verificar si el juego ya fue lanzado
    if (new Date() >= new Date(game.releaseDate)) {
      return res.status(400).json({ message: 'El juego ya fue lanzado, no se puede reservar' });
    }

    // Verificar si ya existe una reserva activa para este juego
    const existingReservation = await Reservation.findOne({
      userId,
      gameId,
      status: 'active'
    });

    if (existingReservation) {
      return res.status(400).json({ message: 'Ya tienes una reserva activa para este juego' });
    }

    // Verificar saldo suficiente
    if (user.wallet < game.price) {
      return res.status(400).json({ message: 'Saldo insuficiente para realizar la reserva' });
    }

    // Descontar del wallet
    user.wallet -= game.price;
    await user.save();

    // Crear reserva
    const reservation = new Reservation({
      userId,
      gameId,
      amount: game.price,
      status: 'active'
    });

    await reservation.save();

    // Poblar la reserva para la respuesta
    const populatedReservation = await Reservation.findById(reservation._id)
      .populate('userId', 'username email wallet')
      .populate('gameId', 'title price releaseDate');

    res.status(201).json({
      message: 'Reserva creada correctamente',
      reservation: populatedReservation
    });

  } catch (error) {
    console.error('❌ Error al crear reserva:', error);
    res.status(500).json({ message: 'Error al crear la reserva', error: error.message });
  }
};

// Cancelar reserva con reembolso
exports.cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('userId')
      .populate('gameId');

    if (!reservation) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    // Verificar que la reserva esté activa
    if (reservation.status !== 'active') {
      return res.status(400).json({ message: 'La reserva no está activa' });
    }

    // Verificar que el juego no haya salido aún
    if (new Date() >= new Date(reservation.gameId.releaseDate)) {
      return res.status(400).json({ message: 'No se puede cancelar, el juego ya fue lanzado' });
    }

    // Reembolsar el dinero
    const user = await User.findById(reservation.userId._id);
    user.wallet += reservation.amount;
    await user.save();

    // Actualizar estado de la reserva
    reservation.status = 'cancelled';
    reservation.cancelledAt = new Date();
    await reservation.save();

    res.json({
      message: 'Reserva cancelada y dinero reembolsado',
      refundAmount: reservation.amount,
      newBalance: user.wallet
    });

  } catch (error) {
    console.error('❌ Error al cancelar reserva:', error);
    res.status(500).json({ message: 'Error al cancelar la reserva', error: error.message });
  }
};

// Actualizar una reserva (solo admin)
exports.updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    ).populate('userId', 'username email')
     .populate('gameId', 'title price');

    if (!reservation) return res.status(404).json({ message: 'Reserva no encontrada' });
    
    res.json({ message: 'Reserva actualizada', reservation });
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar la reserva', error });
  }
};

// Eliminar una reserva (solo admin)
exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) return res.status(404).json({ message: 'Reserva no encontrada' });
    res.json({ message: 'Reserva eliminada' });
  } catch (error) {
    res.status(400).json({ message: 'Error al eliminar la reserva', error });
  }
};
