import { mysql2 } from "./mysql_conection.js";

document.getElementById('button-test2').addEventListener('click', () => {
    const connection = connectToDatabase(mysql2);
    alert('Conexion exitosa a la base de datos');
});

function selectUsers(con) {
    const query = 'SELECT * FROM usuarios';
    con.query(query, (err, results) => {
        if (err) throw err;
        return results;
    });
};

function insertUser(con, username, password) {
    const query = 'INSERT INTO usuarios (username, password) VALUES (?, ?)';
    con.query(query, [username, password], (err) => {
        if (err) throw err;
        alert('Usuario Agregado exitosamente');
    });
};

function deleteUser(con, id) {
    const query = 'DELETE FROM usuarios WHERE id = ?';
    con.query(query, [id], (err) => {
        if (err) throw err;
        alert('Usuario Eliminado exitosamente');
    });
};

function selectProducts(con) {
    const query = 'SELECT * FROM productos_farmacia';
    con.query(query, (err, results) => {
        if (err) throw err;
        return results;
    });
};

function insertProduct(con, nombre, marca, stock, precio) {
    const query = 'INSERT INTO productos_farmacia (nombre, marca, stock, precio) VALUES (?, ?, ?, ?)';
    con.query(query, [nombre, marca, stock, precio], (err) => {
        if (err) throw err;
        alert('Producto Agregado exitosamente');
    });
};

function deleteDelete(con, id) {
    const query = 'DELETE FROM productos_farmacia WHERE id = ?';
    con.query(query, [id], (err) => {
        if (err) throw err;
        alert('Usuario Eliminado exitosamente');
    });
};

function selectVentas(con) {
    const query = 'SELECT * FROM ventas';
    con.query(query, (err, results) => {
        if (err) throw err;
        return results;
    });
};

/*
function insertVenta(con, name, total) {
    const query = 'INSERT INTO ventas (name, fecha, total) VALUES (?, ?, ?)';
    con.query(query, [name, fecha, total], (err, results) => {
        if (err) throw err;
        return results;
    });
};

function deleteUser(con) {
    const query = 'DELETE FROM usuarios WHERE id = ?';
    con.query(query, [id], (err, results) => {
        if (err) throw err;
        alert('Usuario Eliminado exitosamente');
    });
};


*/