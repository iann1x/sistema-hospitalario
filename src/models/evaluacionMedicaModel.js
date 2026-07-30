const pool = require('../config/db');

const createEvaluacionMedica = async (evaluacion) => {
  const {
    id_internacion,
    id_usuario_medico,
    diagnostico,
    tratamiento_sugerido,
    notas_medicas
  } = evaluacion;

  try {
    const [result] = await pool.query(
      `INSERT INTO test.EvaluacionesMedicas 
       (id_internacion, id_usuario_medico, diagnostico, tratamiento_sugerido, notas_medicas) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        id_internacion,
        id_usuario_medico,
        diagnostico,
        tratamiento_sugerido,
        notas_medicas
      ]
    );
    return result;
  } catch (error) {
    console.error('Error al crear la evaluación médica en el modelo:', error);
    throw new Error('Error al crear la evaluación médica');
  }
};

const getEvaluacionesMedicasByInternacionId = async (id_internacion) => {
  try {
    const [rows] = await pool.query(
      `SELECT em.*, u.username AS medico_username
       FROM test.EvaluacionesMedicas em
       JOIN test.Usuarios u ON em.id_usuario_medico = u.id
       WHERE em.id_internacion = ? 
       ORDER BY em.fecha_evaluacion DESC`,
      [id_internacion]
    );
    return rows;
  } catch (error) {
    console.error(`Error al obtener las evaluaciones médicas para la internación con ID ${id_internacion}:`, error);
    throw new Error('Error al obtener las evaluaciones médicas de la internación');
  }
};

module.exports = {
  createEvaluacionMedica,
  getEvaluacionesMedicasByInternacionId
};