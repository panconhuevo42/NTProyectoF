const express = require('express');
const router = express.Router();
const gamesCtrl = require('../controllers/gamesCtrl');
const auth = require('../middlewares/authMiddleware');
const admin = require('../middlewares/adminMiddleware');

// @desc    Obtener todos los juegos
// @route   GET /api/games
// @access  Public
router.get('/', gamesCtrl.list);

// @desc    Obtener juegos próximos para preventa
// @route   GET /api/games/upcoming
// @access  Public
router.get('/upcoming', gamesCtrl.getUpcoming);

// @desc    Obtener un juego por ID
// @route   GET /api/games/:id
// @access  Public
router.get('/:id', gamesCtrl.getById);

// @desc    Crear nuevo juego (Solo admin)
// @route   POST /api/games
// @access  Private/Admin
router.post('/', auth, admin, gamesCtrl.create);

// @desc    Actualizar juego (Solo admin)
// @route   PUT /api/games/:id
// @access  Private/Admin
router.put('/:id', auth, admin, gamesCtrl.update);

// @desc    Eliminar juego (Solo admin)
// @route   DELETE /api/games/:id
// @access  Private/Admin
router.delete('/:id', auth, admin, gamesCtrl.remove);

module.exports = router;
