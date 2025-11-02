const express = require('express');
const router = express.Router();
const gamesCtrl = require('../controllers/gamesCtrl');

// GET /api/games
router.get('/', gamesCtrl.list);

// POST /api/games (admin)
router.post('/', gamesCtrl.create);

module.exports = router;
