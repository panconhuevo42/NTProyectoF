const express = require('express');
const router = express.Router();
const reservationsCtrl = require('../controllers/reservationsCtrl');
const auth = require('../middlewares/authMiddleware');
const admin = require('../middlewares/adminMiddleware');

// @desc    Obtener todas las reservas (Solo admin)
// @route   GET /api/reservations
// @access  Private/Admin
router.get('/', auth, admin, reservationsCtrl.getReservations);

// @desc    Obtener reservas del usuario actual
// @route   GET /api/reservations/my-reservations
// @access  Private
router.get('/my-reservations', auth, reservationsCtrl.getUserReservations);

// @desc    Obtener reservas de un usuario específico (Solo admin)
// @route   GET /api/reservations/user/:userId
// @access  Private/Admin
router.get('/user/:userId', auth, admin, reservationsCtrl.getUserReservations);

// @desc    Crear nueva reserva
// @route   POST /api/reservations
// @access  Private
router.post('/', auth, reservationsCtrl.createReservation);

// @desc    Cancelar reserva (con reembolso)
// @route   POST /api/reservations/:id/cancel
// @access  Private
router.post('/:id/cancel', auth, reservationsCtrl.cancelReservation);

// @desc    Actualizar reserva (Solo admin)
// @route   PUT /api/reservations/:id
// @access  Private/Admin
router.put('/:id', auth, admin, reservationsCtrl.updateReservation);

// @desc    Eliminar reserva (Solo admin)
// @route   DELETE /api/reservations/:id
// @access  Private/Admin
router.delete('/:id', auth, admin, reservationsCtrl.deleteReservation);

module.exports = router;
