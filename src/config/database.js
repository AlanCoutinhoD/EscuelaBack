const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// Verificar la conexión a la base de datos
pool.query('SELECT 1')
    .then(() => {
        console.log('✅ Conexión exitosa a la base de datos MySQL');
        console.log(`   Host: ${process.env.DB_HOST}`);
        console.log(`   Base de datos: ${process.env.DB_DATABASE}`);
    })
    .catch(err => {
        console.error('❌ Error al conectar a la base de datos:', err);
    });

module.exports = pool;