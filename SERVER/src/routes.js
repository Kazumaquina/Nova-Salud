const db = require('./db');

function handle(req, res) {
  if ( req.url === '/products' && req.method === 'GET' ) {
        try{
            db.query('SELECT * FROM productos_farmacia', (err, result) => {
            if (err) {
                console.error(err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error al obtener los datos.');
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            }
            });
        } catch (error) {
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error al obtener los datos.');
        }
  } else if ( req.url === '/stock' && req.method === 'POST' ) {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
        try{
            let data;
            const contentType = req.headers['content-type'];

            if (contentType === 'application/json') {
            data = JSON.parse(body);
            } else if (contentType === 'application/x-www-form-urlencoded') {
            data = Object.fromEntries(new URLSearchParams(body));
            } else {
            throw new Error('Formato no soportado');
            }

            const { id } = data;

            db.query('CALL getStock(?);', [id], (err, result) => {
            if (err) {
                console.error(err);
                res.writeHead(500);
                res.end('Error al obtener los datos.');
            } else {
                res.writeHead(200);
                res.end(JSON.stringify(result[0][0].stock));
            }
            });
        } catch (error) {
            console.error(error);
            res.writeHead(500);
            res.end('Error al obtener los datos.');
        }
    });
  } else if ( req.url === '/products_names' && req.method === 'GET' ) {
    try{
        const products = [];
        db.query('SELECT id, nombre FROM productos_farmacia', (err, result) => {
        if (err) {
          console.error(err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Error al obtener los datos.');
        } else {
          result.forEach(product => {
              products.push({ id: product.id, nombre: product.nombre});
          })
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(products));
        }
        });
      } catch (error) {
          console.error(error);
          res.writeHead(500, {  'Content-Type': 'text/plain' });
          res.end('Error al obtener los datos.');
      }
  } else if (req.url === '/enviar' && req.method === 'POST') {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        let data;
        const contentType = req.headers['content-type'];

        if (contentType === 'application/json') {
          data = JSON.parse(body);
        } else if (contentType === 'application/x-www-form-urlencoded') {
          data = Object.fromEntries(new URLSearchParams(body));
        } else {
          throw new Error('Formato no soportado');
        }

        const {id, username, password} = data;

        db.query('INSERT INTO usuarios (id, username, password) VALUES (?, ?, ?)', [id, username, password], (err, result) => {
          if (err) {
            console.error(err);
            res.writeHead(500);
            res.end('Error al guardar en la base de datos.');
          } else {
            res.writeHead(200);
            res.end('Datos guardados correctamente.');
          }
        });

      } catch (err) {
        console.error('Error de parseo:', err.message);
        res.writeHead(400);
        res.end('Datos inválidos.');
      }
    });
  } else if (req.url === '/enviar' && req.method === 'PUT') {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        let data;
        const contentType = req.headers['content-type'];

        if (contentType === 'application/json') {
          data = JSON.parse(body);
        } else if (contentType === 'application/x-www-form-urlencoded') {
          data = Object.fromEntries(new URLSearchParams(body));
        } else {
          throw new Error('Formato no soportado');
        }

        const { id, nombre, correo, mensaje } = data;

        db.query('UPDATE usuarios SET username = ?, password = ? WHERE id = ?', [username, password, id], (err, result) => {
          if (err) {
            console.error(err);
            res.writeHead(500);
            res.end('Error al actualizar en la base de datos.');
          } else {
            res.writeHead(200);
            res.end('Datos actualizados correctamente.');
          }
        });

      } catch (err) {
        console.error('Error de parseo:', err.message);
        res.writeHead(400);
        res.end('Datos inválidos.');
      }
    });
  } else if ( req.url === '/enviar' && req.method === 'DELETE') {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        let data;
        const contentType = req.headers['content-type'];

        if (contentType === 'application/json') {
          data = JSON.parse(body);
        } else if (contentType === 'application/x-www-form-urlencoded') {
          data = Object.fromEntries(new URLSearchParams(body));
        } else {
          throw new Error('Formato no soportado');
        }

        const { id } = data;

        db.query('DELETE FROM usuarios WHERE id = ?', [id], (err, result) => {
          if (err) {
            console.error(err);
            res.writeHead(500);
            res.end('Error al eliminar en la base de datos.');
          } else {
            res.writeHead(200);
            res.end('Datos eliminados correctamente.');
          }
        });

      } catch (err) {
        console.error('Error de parseo:', err.message);
        res.writeHead(400);
        res.end('Datos inválidos.');
      }
    });
  } else {
    res.writeHead(404);
    res.end('Ruta no encontrada');
  }
}

module.exports = { handle };