const express = require('express');
const router = express.Router();
const evaluacionMedicaController = require('../controllers/evaluacionMedicaController');

router.get('/nueva/:id', evaluacionMedicaController.mostrarFormularioEvaluacionMedica);
router.post('/nueva/:id', evaluacionMedicaController.crearEvaluacionMedica);

module.exports = router;