const express = require('express');
const router = express.Router();
const internacionController = require('../controllers/internacionController');

router.get('/nueva', internacionController.mostrarFormularioNuevaInternacion);
router.post('/', internacionController.crearInternacion);
router.post('/alta', internacionController.procesarAlta);
router.post('/cancelar', internacionController.cancelarInternacion);

module.exports = router;