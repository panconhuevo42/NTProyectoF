const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authCtrl');

// @desc    Registrar nuevo usuario
// @route   POST /api/auth/register
// @access  Public
router.post('/register', authCtrl.register);

// @desc    Iniciar sesión
// @route   POST /api/auth/login
// @access  Public
router.post('/login', authCtrl.login);

module.exports = router;