const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');

router.get('/', pacienteController.listarPacientes);
router.get('/nuevo', pacienteController.mostrarFormularioNuevo);
router.post('/anonimo', pacienteController.crearPacienteAnonimo);
router.post('/', pacienteController.crearPaciente);
router.get('/editar/:id', pacienteController.mostrarFormularioEditar);
router.post('/editar/:id', pacienteController.actualizarPaciente);
router.post('/eliminar/:id', pacienteController.eliminarPaciente);
router.get('/:id', pacienteController.verDetallePaciente);

module.exports = router;