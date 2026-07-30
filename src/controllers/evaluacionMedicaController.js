const Internacion = require('../models/internacionModel');
const EvaluacionMedica = require('../models/evaluacionMedicaModel');

const mostrarFormularioEvaluacionMedica = async (req, res) => {
  try {
    const id_internacion = req.params.id;
    const internacion = await Internacion.getInternacionById(id_internacion);

    if (internacion) {
      res.render('evaluaciones-medicas/nueva', {
        title: `Evaluación Médica para ${internacion.nombre} ${internacion.apellido}`,
        internacion: internacion
      });
    } else {
      res.status(404).send('Internación no encontrada o ya finalizada.');
    }
  } catch (error) {
    console.error('Error en el controlador al mostrar el formulario de evaluación médica:', error);
    res.status(500).send('Error interno del servidor');
  }
};

const crearEvaluacionMedica = async (req, res) => {
  try {
    const evaluacionCompleta = {
      ...req.body,
      id_internacion: req.params.id,
      id_usuario_medico: 4 // IMPORTANTE: Asumimos que el usuario 'medico' tiene ID 4.
    };

    await EvaluacionMedica.createEvaluacionMedica(evaluacionCompleta);

    res.redirect('/evaluaciones');
  } catch (error) {
    console.error('Error en el controlador al crear la evaluación médica:', error);
    res.status(500).send('Error interno del servidor al guardar la evaluación médica.');
  }
};

module.exports = {
  mostrarFormularioEvaluacionMedica,
  crearEvaluacionMedica
};