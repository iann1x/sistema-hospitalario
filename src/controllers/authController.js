const bcrypt = require('bcrypt');
const pool = require('../config/db');

const renderLogin = (req, res) => {
    if (req.session.userId) {
        return res.redirect('/'); // Ya está logueado
    }
    res.render('login', { title: 'Iniciar Sesión' });
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const [rows] = await pool.execute('SELECT * FROM Usuarios WHERE username = ? AND activo = TRUE', [username]);
        
        if (rows.length === 0) {
            return res.render('login', { title: 'Iniciar Sesión', error: 'Usuario no encontrado o inactivo.' });
        }
        
        const user = rows[0];
        
        const isMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!isMatch) {
            return res.render('login', { title: 'Iniciar Sesión', error: 'Contraseña incorrecta.' });
        }
        
        // Guardar sesión
        req.session.userId = user.id;
        req.session.rol = user.rol;
        req.session.username = user.username;
        
        res.redirect('/');
        
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).render('login', { title: 'Iniciar Sesión', error: 'Error interno del servidor.' });
    }
};

const logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/auth/login');
    });
};

module.exports = {
    renderLogin,
    login,
    logout
};
