const pool = require('../config/db');

const createEvaluacion = async (evaluacion) => {
  const {
    id_internacion,
    id_usuario_enfermero,
    presion_arterial,
    frecuencia_cardiaca,
    frecuencia_respiratoria,
    temperatura,
    antecedentes_medicos,
    alergias,
    medicamentos_actuales,
    observaciones_generales,
    plan_cuidados
  } = evaluacion;

  try {
    const [result] = await pool.query(
      `INSERT INTO test.EvaluacionesEnfermeria 
       (id_internacion, id_usuario_enfermero, presion_arterial, frecuencia_cardiaca, frecuencia_respiratoria, temperatura, antecedentes_medicos, alergias, medicamentos_actuales, observaciones_generales, plan_cuidados) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_internacion,
        id_usuario_enfermero,
        presion_arterial,
        frecuencia_cardiaca,
        frecuencia_respiratoria,
        temperatura,
        antecedentes_medicos,
        alergias,
        medicamentos_actuales,
        observaciones_generales,
        plan_cuidados
      ]
    );
    return result;
  } catch (error) {
    console.error('Error al crear la evaluación en el modelo:', error);
    throw new Error('Error al crear la evaluación de enfermería');
  }
};

const getEvaluacionesByInternacionId = async (id_internacion) => {
  try {
    const [rows] = await pool.query(
      `SELECT ev.*, u.username AS enfermero_username 
       FROM test.EvaluacionesEnfermeria ev
       JOIN test.Usuarios u ON ev.id_usuario_enfermero = u.id
       WHERE ev.id_internacion = ? 
       ORDER BY ev.fecha_evaluacion DESC`,
      [id_internacion]
    );
    return rows;
  } catch (error) {
    console.error(`Error al obtener las evaluaciones para la internación con ID ${id_internacion}:`, error);
    throw new Error('Error al obtener las evaluaciones de la internación');
  }
};

module.exports = {
  createEvaluacion,
  getEvaluacionesByInternacionId
};