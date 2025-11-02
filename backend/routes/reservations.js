const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const ctrl = require('../controllers/reservationsCtrl');
const { 
  getReservations, 
  createReservation, 
  updateReservation, 
  deleteReservation 
} = require('../controllers/reservationsCtrl');

router.get('/', getReservations);
router.post('/', createReservation);
router.put('/:id', updateReservation);
router.delete('/:id', deleteReservation);

module.exports = router;
