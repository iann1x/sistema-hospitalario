const express = require('express');
const router = express.Router();
const evaluacionController = require('../controllers/evaluacionController');

router.get('/', evaluacionController.listarPacientesInternados);
router.get('/nueva/:id', evaluacionController.mostrarFormularioEvaluacion);
router.post('/nueva/:id', evaluacionController.crearEvaluacion);

module.exports = router;