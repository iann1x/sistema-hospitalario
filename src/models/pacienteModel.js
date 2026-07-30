const pool = require('../config/db');

const getAllPacientes = async () => {
  try {
    const [rows] = await pool.query('SELECT id, dni, nombre, apellido, sexo FROM test.Pacientes ORDER BY apellido, nombre');
    return rows;
  } catch (error) {
    console.error('Error al obtener los pacientes desde el modelo:', error);
    throw new Error('Error al obtener datos de los pacientes');
  }
};

const createPaciente = async (paciente) => {
  const { nombre, apellido, dni, fecha_nacimiento, sexo, telefono, email } = paciente;
  try {
    const [result] = await pool.query(
      'INSERT INTO test.Pacientes (nombre, apellido, dni, fecha_nacimiento, sexo, telefono, email) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nombre, apellido, dni, fecha_nacimiento, sexo, telefono, email]
    );
    return result;
  } catch (error) {
    console.error('Error al crear el paciente en el modelo:', error);
    throw new Error('Error al crear el paciente');
  }
};

const getPacienteById = async (id) => {
  try {
    const [rows] = await pool.query('SELECT * FROM test.Pacientes WHERE id = ?', [id]);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (error) {
    console.error(`Error al obtener el paciente con ID ${id} desde el modelo:`, error);
    throw new Error(`Error al obtener datos del paciente con ID ${id}`);
  }
};

const updatePacienteById = async (id, paciente) => {
  const { nombre, apellido, dni, fecha_nacimiento, sexo, telefono, email } = paciente;
  try {
    const [result] = await pool.query(
      'UPDATE test.Pacientes SET nombre = ?, apellido = ?, dni = ?, fecha_nacimiento = ?, sexo = ?, telefono = ?, email = ? WHERE id = ?',
      [nombre, apellido, dni, fecha_nacimiento, sexo, telefono, email, id]
    );
    return result;
  } catch (error) {
    console.error(`Error al actualizar el paciente con ID ${id} en el modelo:`, error);
    throw new Error(`Error al actualizar los datos del paciente con ID ${id}`);
  }
};

const deletePacienteById = async (id) => {
  try {
    const [result] = await pool.query('DELETE FROM test.Pacientes WHERE id = ?', [id]);
    return result;
  } catch (error) {
    console.error(`Error al eliminar el paciente con ID ${id} en el modelo:`, error);
    throw new Error(`Error al eliminar el paciente con ID ${id}`);
  }
};

module.exports = {
  getAllPacientes,
  createPaciente,
  getPacienteById,
  updatePacienteById,
  deletePacienteById
};