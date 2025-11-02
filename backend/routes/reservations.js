const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const ctrl = require('../controllers/reservationsCtrl');

router.post('/', auth, ctrl.createReservation);
router.post('/:id/cancel', auth, ctrl.cancelReservation);
router.get('/', auth, ctrl.listUserReservations);

module.exports = router;
