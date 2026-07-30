const pool = require('../config/db');

const getCamasDisponibles = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT c.id, c.codigo_cama, h.numero_habitacion, h.ala 
       FROM test.Camas c 
       JOIN test.Habitaciones h ON c.id_habitacion = h.id 
       WHERE c.estado = 'Libre' AND c.higienizada = TRUE`
    );
    return rows;
  } catch (error) {
    console.error('Error al obtener las camas disponibles desde el modelo:', error);
    throw new Error('Error al obtener datos de las camas');
  }
};

const getCamaById = async (id) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.*, h.capacidad 
       FROM test.Camas c
       JOIN test.Habitaciones h ON c.id_habitacion = h.id
       WHERE c.id = ?`,
      [id]
    );
    return rows[0];
  } catch (error) {
    console.error(`Error al obtener la cama con ID ${id} desde el modelo:`, error);
    throw new Error(`Error al obtener datos de la cama con ID ${id}`);
  }
};

const updateEstadoCama = async (id, estado) => {
  try {
    const [result] = await pool.query('UPDATE test.Camas SET estado = ? WHERE id = ?', [estado, id]);
    return result;
  } catch (error) {
    console.error(`Error al actualizar el estado de la cama con ID ${id} en el modelo:`, error);
    throw new Error(`Error al actualizar el estado de la cama con ID ${id}`);
  }
};

const findOtraCamaEnHabitacionOcupada = async (id_habitacion, id_cama_actual) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM test.Camas WHERE id_habitacion = ? AND id != ? AND estado = 'Ocupada'`,
      [id_habitacion, id_cama_actual]
    );
    return rows[0];
  } catch (error) {
    console.error('Error al buscar otra cama en la habitación:', error);
    throw new Error('Error al buscar otra cama en la habitación');
  }
};

const findPacienteEnCama = async (id_cama) => {
    try {
        const [rows] = await pool.query(
          `SELECT p.sexo FROM test.Pacientes p
           JOIN test.Internaciones i ON p.id = i.id_paciente
           WHERE i.id_cama = ? AND i.estado = 'Activa'`,
          [id_cama]
        );
        return rows[0];
    } catch (error) {
      console.error('Error al buscar el paciente en la cama:', error);
      throw new Error('Error al buscar el paciente en la cama');
    }
};

const getAllCamas = async () => {
  try {
    const [rows] = await pool.query(
      `SELECT c.*, h.numero_habitacion, h.ala 
       FROM test.Camas c
       JOIN test.Habitaciones h ON c.id_habitacion = h.id
       ORDER BY h.ala, h.numero_habitacion, c.codigo_cama`
    );
    return rows;
  } catch (error) {
    console.error('Error al obtener todas las camas:', error);
    throw new Error('Error al obtener los datos de las camas');
  }
};

const marcarComoHigienizada = async (id) => {
  try {
    const [result] = await pool.query('UPDATE test.Camas SET higienizada = TRUE WHERE id = ?', [id]);
    return result;
  } catch (error) {
    console.error(`Error al marcar la cama con ID ${id} como higienizada:`, error);
    throw new Error('Error al actualizar el estado de higienización de la cama');
  }
};

module.exports = {
  getCamasDisponibles,
  getCamaById,
  updateEstadoCama,
  findOtraCamaEnHabitacionOcupada,
  findPacienteEnCama,
  getAllCamas,
  marcarComoHigienizada
};