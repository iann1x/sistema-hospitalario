const express = require('express');
const router = express.Router();
const camaController = require('../controllers/camaController');

router.get('/', camaController.listarTodas);
router.post('/higienizar/:id', camaController.higienizar);

module.exports = router;