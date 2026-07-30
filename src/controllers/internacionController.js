const Paciente = require('../models/pacienteModel');
const Cama = require('../models/camaModel');
const Internacion = require('../models/internacionModel');

const mostrarFormularioNuevaInternacion = async (req, res) => {
  try {
    const pacientes = await Paciente.getAllPacientes();
    const camas = await Cama.getCamasDisponibles();

    res.render('internaciones/nueva', {
      title: 'Registrar Nueva Internación',
      pacientes,
      camas
    });
  } catch (error) {
    console.error('Error en el controlador al mostrar el formulario de nueva internación:', error);
    res.status(500).send('Error interno del servidor');
  }
};

const crearInternacion = async (req, res) => {
  try {
    const { id_paciente, id_cama, motivo_internacion } = req.body;

    const pacienteAInternar = await Paciente.getPacienteById(id_paciente);
    const camaSeleccionada = await Cama.getCamaById(id_cama);

    if (camaSeleccionada.capacidad > 1) {
      const otraCamaOcupada = await Cama.findOtraCamaEnHabitacionOcupada(camaSeleccionada.id_habitacion, camaSeleccionada.id);

      if (otraCamaOcupada) {
        const otroPaciente = await Cama.findPacienteEnCama(otraCamaOcupada.id);

        if (pacienteAInternar.sexo !== otroPaciente.sexo) {
          const pacientes = await Paciente.getAllPacientes();
          const camas = await Cama.getCamasDisponibles();
          return res.render('internaciones/nueva', {
            title: 'Registrar Nueva Internación',
            pacientes,
            camas,
            error: 'No se puede asignar la cama. La habitación está ocupada por un paciente de otro sexo.'
          });
        }
      }
    }

    await Internacion.createInternacion({ id_paciente, id_cama, motivo_internacion });
    await Cama.updateEstadoCama(id_cama, 'Ocupada');

    res.redirect('/evaluaciones');

  } catch (error) {
    console.error('Error en el controlador al crear la internación:', error);
    res.status(500).send('Error interno del servidor al procesar la internación.');
  }
};

const procesarAlta = async (req, res) => {
  try {
    const { id_internacion, id_cama } = req.body;
    await Internacion.darAltaHospitalaria(id_internacion, id_cama);
    res.redirect('/evaluaciones');
  } catch (error) {
    console.error('Error en el controlador al procesar el alta:', error);
    res.status(500).send('Error interno del servidor al procesar el alta.');
  }
};

const cancelarInternacion = async (req, res) => {
  try {
    const { id_internacion, id_cama } = req.body;
    await Internacion.cancelarInternacion(id_internacion, id_cama);
    res.redirect('/evaluaciones');
  } catch (error) {
    console.error('Error en el controlador al cancelar internacion:', error);
    res.status(500).send('Error interno del servidor al cancelar la internación.');
  }
};

module.exports = {
  mostrarFormularioNuevaInternacion,
  crearInternacion,
  procesarAlta,
  cancelarInternacion
};