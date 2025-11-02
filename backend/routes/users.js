const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/usersCtrl');

// ejemplo de endpoints
router.get('/', ctrl.getAllUsers);
router.get('/me', ctrl.getUserInfo);
router.post('/deposit', ctrl.depositBalance);

module.exports = router;



