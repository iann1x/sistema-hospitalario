const mysql = require('mysql2/promise');

const connectionOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

if (process.env.DB_SSL) {
  try {
    connectionOptions.ssl = JSON.parse(process.env.DB_SSL);
  } catch (e) {
    console.error('Error al parsear la variable de entorno DB_SSL:', e);
  }
}

const pool = mysql.createPool(connectionOptions);

module.exports = pool;