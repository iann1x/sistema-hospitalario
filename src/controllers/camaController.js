const Cama = require('../models/camaModel');

const listarTodas = async (req, res) => {
  try {
    const camas = await Cama.getAllCamas();
    res.render('camas/lista', {
      title: 'Gestión de Camas',
      camas: camas
    });
  } catch (error) {
    console.error('Error en el controlador al listar todas las camas:', error);
    res.status(500).send('Error interno del servidor');
  }
};

const higienizar = async (req, res) => {
  try {
    const id = req.params.id;
    await Cama.marcarComoHigienizada(id);
    res.redirect('/camas');
  } catch (error) {
    console.error('Error en el controlador al higienizar la cama:', error);
    res.status(500).send('Error interno del servidor');
  }
};

module.exports = {
  listarTodas,
  higienizar
};