const Paciente = require('../models/pacienteModel');
const Internacion = require('../models/internacionModel');
const EvaluacionEnfermeria = require('../models/evaluacionModel');
const EvaluacionMedica = require('../models/evaluacionMedicaModel');

const listarPacientes = async (req, res) => {
  try {
    const pacientes = await Paciente.getAllPacientes();
    res.render('pacientes/lista', {
      title: 'Listado de Pacientes',
      pacientes: pacientes
    });
  } catch (error) {
    console.error('Error en el controlador al listar pacientes:', error);
    res.status(500).send('Error interno del servidor');
  }
};

const mostrarFormularioNuevo = (req, res) => {
  res.render('pacientes/nuevo', {
    title: 'Registrar Nuevo Paciente'
  });
};

const crearPaciente = async (req, res) => {
  try {
    const nuevoPaciente = req.body;
    await Paciente.createPaciente(nuevoPaciente);
    res.redirect('/pacientes');
  } catch (error) {
    console.error('Error en el controlador al crear el paciente:', error);
    res.status(500).send('Error interno del servidor al crear el paciente.');
  }
};

const crearPacienteAnonimo = async (req, res) => {
  try {
    const timestamp = Date.now().toString().slice(-6);
    const nuevoPaciente = {
      dni: `NN-${timestamp}`,
      nombre: 'NN',
      apellido: 'Anónimo',
      fecha_nacimiento: '1900-01-01',
      sexo: 'Masculino'
    };
    await Paciente.createPaciente(nuevoPaciente);
    res.redirect('/pacientes');
  } catch (error) {
    console.error('Error en el controlador al crear el paciente anónimo:', error);
    res.status(500).send('Error interno del servidor.');
  }
};

const mostrarFormularioEditar = async (req, res) => {
  try {
    const id = req.params.id;
    const paciente = await Paciente.getPacienteById(id);
    if (paciente) {
      res.render('pacientes/editar', {
        title: `Editar Paciente`,
        paciente: paciente
      });
    } else {
      res.status(404).send('Paciente no encontrado');
    }
  } catch (error) {
    res.status(500).send('Error interno del servidor');
  }
};

const actualizarPaciente = async (req, res) => {
  try {
    const id = req.params.id;
    const datosActualizados = req.body;
    await Paciente.updatePacienteById(id, datosActualizados);
    res.redirect(`/pacientes/${id}`);
  } catch (error) {
    console.error('Error en el controlador al actualizar el paciente:', error);
    res.status(500).send('Error interno del servidor al actualizar el paciente.');
  }
};

const eliminarPaciente = async (req, res) => {
  try {
    const id = req.params.id;
    await Paciente.deletePacienteById(id);
    res.redirect('/pacientes');
  } catch (error) {
    console.error('Error en el controlador al eliminar el paciente:', error);
    res.status(500).send('Error interno del servidor al eliminar el paciente.');
  }
};

const verDetallePaciente = async (req, res) => {
  try {
    const paciente = await Paciente.getPacienteById(req.params.id);
    if (!paciente) {
      return res.status(404).send('Paciente no encontrado');
    }

    const internacionActiva = await Internacion.findActiveInternacionByPacienteId(paciente.id);

    let evaluacionesEnfermeria = [];
    let evaluacionesMedicas = [];

    if (internacionActiva) {
      evaluacionesEnfermeria = await EvaluacionEnfermeria.getEvaluacionesByInternacionId(internacionActiva.id);
      evaluacionesMedicas = await EvaluacionMedica.getEvaluacionesMedicasByInternacionId(internacionActiva.id);
    }

    res.render('pacientes/detalle', {
      title: `Detalle de ${paciente.nombre} ${paciente.apellido}`,
      paciente: paciente,
      evaluacionesEnfermeria: evaluacionesEnfermeria,
      evaluacionesMedicas: evaluacionesMedicas
    });

  } catch (error) {
    console.error('Error en el controlador al ver el detalle del paciente:', error);
    res.status(500).send('Error interno del servidor');
  }
};

module.exports = {
  listarPacientes,
  mostrarFormularioNuevo,
  crearPaciente,
  crearPacienteAnonimo,
  verDetallePaciente,
  mostrarFormularioEditar,
  actualizarPaciente,
  eliminarPaciente
};