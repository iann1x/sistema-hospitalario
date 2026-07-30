require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('./src/config/db');

async function setup() {
    try {
        const password = '123';
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);

        const usuarios = ['admin', 'admision', 'enfermera', 'medico'];
        
        for (let user of usuarios) {
            await pool.execute('UPDATE Usuarios SET password_hash = ? WHERE username = ?', [hash, user]);
            console.log(`Contraseña de ${user} actualizada a '123'`);
        }

        console.log('Todas las contraseñas han sido actualizadas.');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

setup();
