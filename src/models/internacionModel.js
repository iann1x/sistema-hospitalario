const pool = require('../config/db');

const createInternacion = async (internacion) => {
  const { id_paciente, id_cama, motivo_internacion } = internacion;
  try {
    const [result] = await pool.query(
      'INSERT INTO test.Internaciones (id_paciente, id_cama, motivo_internacion) VALUES (?, ?, ?)',
      [id_paciente, id_cama, motivo_internacion]
    );
    return result;
  } catch (error) {
    console.error('Error al crear la internación en el modelo:', error);
    throw new Error('Error al crear la internación');
  }
};

const getInternacionesActivas = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        i.id AS internacion_id,
        p.id AS paciente_id,
        p.nombre,
        p.apellido,
        p.dni,
        c.id AS cama_id,
        c.codigo_cama,
        h.numero_habitacion
      FROM test.Internaciones i
      JOIN test.Pacientes p ON i.id_paciente = p.id
      JOIN test.Camas c ON i.id_cama = c.id
      JOIN test.Habitaciones h ON c.id_habitacion = h.id
      WHERE i.estado = 'Activa'
      ORDER BY p.apellido, p.nombre
    `);
    return rows;
  } catch (error) {
    console.error('Error al obtener las internaciones activas desde el modelo:', error);
    throw new Error('Error al obtener datos de las internaciones activas');
  }
};

const getInternacionById = async (id) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        i.id AS internacion_id,
        i.id_cama,
        p.id AS paciente_id,
        p.nombre,
        p.apellido
      FROM test.Internaciones i
      JOIN test.Pacientes p ON i.id_paciente = p.id
      WHERE i.id = ? AND i.estado = 'Activa'
    `, [id]);
    return rows[0];
  } catch (error) {
    console.error(`Error al obtener la internación con ID ${id} desde el modelo:`, error);
    throw new Error('Error al obtener datos de la internación');
  }
};

const findActiveInternacionByPacienteId = async (id_paciente) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM test.Internaciones WHERE id_paciente = ? AND estado = 'Activa' ORDER BY fecha_ingreso DESC LIMIT 1`,
      [id_paciente]
    );
    return rows[0];
  } catch (error) {
    console.error(`Error al buscar la internación activa para el paciente con ID ${id_paciente}:`, error);
    throw new Error('Error al buscar la internación activa del paciente');
  }
};

const darAltaHospitalaria = async (id_internacion, id_cama) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    await connection.query(
      "UPDATE test.Internaciones SET estado = 'Finalizada', fecha_alta = NOW() WHERE id = ?",
      [id_internacion]
    );

    await connection.query(
      "UPDATE test.Camas SET estado = 'Libre', higienizada = FALSE WHERE id = ?",
      [id_cama]
    );
    
    await connection.commit();
    
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Error en la transacción de alta hospitalaria:', error);
    throw new Error('Error al procesar el alta hospitalaria');
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

const cancelarInternacion = async (id_internacion, id_cama) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    await connection.query(
      "UPDATE test.Internaciones SET estado = 'Cancelada' WHERE id = ?",
      [id_internacion]
    );

    await connection.query(
      "UPDATE test.Camas SET estado = 'Libre', higienizada = TRUE WHERE id = ?",
      [id_cama]
    );
    
    await connection.commit();
    
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Error en la transacción de cancelar internación:', error);
    throw new Error('Error al cancelar la internación');
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

module.exports = {
  createInternacion,
  getInternacionesActivas,
  getInternacionById,
  findActiveInternacionByPacienteId,
  darAltaHospitalaria,
  cancelarInternacion
};