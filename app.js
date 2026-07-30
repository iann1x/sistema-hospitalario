require('dotenv').config();
const express = require('express');
const path = require('path');
const pacienteRoutes = require('./src/routes/pacienteRoutes');
const internacionRoutes = require('./src/routes/internacionRoutes');
const evaluacionRoutes = require('./src/routes/evaluacionRoutes');
const evaluacionMedicaRoutes = require('./src/routes/evaluacionMedicaRoutes');
const camaRoutes = require('./src/routes/camaRoutes');
const authRoutes = require('./src/routes/authRoutes');
const session = require('express-session');
const { isAuthenticated, hasRole } = require('./src/middlewares/authMiddleware');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'src/views'));

app.use(express.static(path.join(__dirname, 'src/public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'secreto_super_seguro_his',
  resave: false,
  saveUninitialized: false
}));

// Pasar variables de sesión a las vistas de Pug
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.get('/', (req, res) => {
  res.render('inicio', {
    title: 'Bienvenido al Sistema de Gestión Hospitalaria'
  });
});

app.use('/auth', authRoutes);
app.use('/pacientes', isAuthenticated, hasRole(['Admision']), pacienteRoutes);
app.use('/internaciones', isAuthenticated, hasRole(['Admision']), internacionRoutes);
app.use('/evaluaciones', isAuthenticated, hasRole(['Enfermeria', 'Medico', 'Admin']), evaluacionRoutes);
app.use('/evaluaciones-medicas', isAuthenticated, hasRole(['Medico', 'Admin']), evaluacionMedicaRoutes);
app.use('/camas', isAuthenticated, hasRole(['Admision', 'Enfermeria', 'Medico', 'Admin']), camaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});