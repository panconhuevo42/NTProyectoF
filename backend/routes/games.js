const express = require('express');
const router = express.Router();

// Importar el controlador de juegos
const gamesCtrl = require('../controllers/gamesCtrl');

// Rutas CRUD
router.post('/', gamesCtrl.create);
router.get('/', gamesCtrl.list);
router.get('/:id', gamesCtrl.getById);
router.put('/:id', gamesCtrl.update);
router.delete('/:id', gamesCtrl.remove);

module.exports = router;

