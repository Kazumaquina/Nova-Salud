const mysql2 = require('mysql2');
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'bocchitheGOD18$', // Aquí lees la variable vacía, o usas una cadena vacía como default
    database: process.env.DB_NAME || 'ventas',
    port: parseInt(process.env.DB_PORT, 10) || 3306 // Asegúrate de que el puerto sea un número
};

function connectToDatabase(mysql2) {
    const connection = mysql2.createConnection(dbConfig);
    console.log('Conectado a la base de datos');
    return connection;
};