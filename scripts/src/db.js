// Importar la libreria para el conector de mysql
const mysql = require('mysql2');

// Configurar la conexión a MySQL
const connection = mysql.createConnection({
    host: 'localhost', 
    user: 'root',
    password: 'bocchitheGOD18$',
    database: 'ventas'
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL');
});

module.exports = connection;