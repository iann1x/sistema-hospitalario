const Internacion = require('../models/internacionModel');
const Evaluacion = require('../models/evaluacionModel');

const listarPacientesInternados = async (req, res) => {
  try {
    const internaciones = await Internacion.getInternacionesActivas();
    res.render('evaluaciones/lista', {
      title: 'Pacientes Internados (Evaluación de Enfermería)',
      internaciones: internaciones
    });
  } catch (error) {
    console.error('Error en el controlador al listar los pacientes internados:', error);
    res.status(500).send('Error interno del servidor');
  }
};

const mostrarFormularioEvaluacion = async (req, res) => {
  try {
    const id_internacion = req.params.id;
    const internacion = await Internacion.getInternacionById(id_internacion);

    if (internacion) {
      res.render('evaluaciones/nueva', {
        title: `Evaluación para ${internacion.nombre} ${internacion.apellido}`,
        internacion: internacion
      });
    } else {
      res.status(404).send('Internación no encontrada o ya finalizada.');
    }
  } catch (error) {
    console.error('Error en el controlador al mostrar el formulario de evaluación:', error);
    res.status(500).send('Error interno del servidor');
  }
};

const crearEvaluacion = async (req, res) => {
  try {
    const datosFormulario = req.body;

    const evaluacionCompleta = {
      ...datosFormulario,
      id_internacion: req.params.id,
      id_usuario_enfermero: 3 // IMPORTANTE: Por ahora, asumimos que el enfermero que hace la evaluación es el usuario con ID 3. Más adelante esto vendría del login.
    };

    await Evaluacion.createEvaluacion(evaluacionCompleta);

    res.redirect('/evaluaciones');
  } catch (error) {
    console.error('Error en el controlador al crear la evaluación:', error);
    res.status(500).send('Error interno del servidor al guardar la evaluación.');
  }
};

module.exports = {
  listarPacientesInternados,
  mostrarFormularioEvaluacion,
  crearEvaluacion
};