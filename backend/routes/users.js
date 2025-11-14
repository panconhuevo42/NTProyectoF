const express = require('express');
const router = express.Router();
const usersCtrl = require('../controllers/usersCtrl');
const auth = require('../middlewares/authMiddleware');
const admin = require('../middlewares/adminMiddleware');

// @desc    Obtener todos los usuarios (Solo admin)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', auth, admin, usersCtrl.getUsers);

// @desc    Obtener usuario por ID
// @route   GET /api/users/:id
// @access  Private
router.get('/:id', auth, usersCtrl.getUserById);

// @desc    Actualizar usuario
// @route   PUT /api/users/:id
// @access  Private
router.put('/:id', auth, usersCtrl.updateUser);

// @desc    Recargar wallet
// @route   POST /api/users/wallet/add
// @access  Private
router.post('/wallet/add', auth, usersCtrl.addToWallet);

// NOTA: Eliminé register y login porque ya están en auth.js
// para evitar duplicación de endpoints

module.exports = router;


