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
  }else if (req.url === '/register-sale' && req.method === 'POST') { 
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const { clientName, products } = data; 

                if (!clientName || !products || !Array.isArray(products) || products.length === 0) {
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end('Datos de venta incompletos o inválidos.');
                    return;
                }

              
                const saleDate = new Date();
                db.query('INSERT INTO ventas (fecha, nombre_cliente) VALUES (?, ?)', [saleDate, clientName], (err, result) => {
                    if (err) {
                        console.error('Error al insertar venta principal:', err);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Error al guardar la venta principal.');
                        return; 
                    }

                    const ventaId = result.insertId; 

                    let itemsProcessed = 0;
                    const totalItems = products.length;

                    products.forEach(item => {
                        const producto_id = parseInt(item.id);
                        const cantidad = parseInt(item.cantidad);
                        const precio_unitario = parseFloat(item.precio); 

                        if (isNaN(producto_id) || isNaN(cantidad) || cantidad <= 0 || isNaN(precio_unitario) || precio_unitario < 0) {
                            console.error('Datos de item de venta inválidos:', item);
                            itemsProcessed++;
                            if (itemsProcessed === totalItems) { 
                                res.writeHead(400, { 'Content-Type': 'text/plain' }); 
                                res.end('Algunos productos en la venta tenían datos inválidos.');
                            }
                            return; 
                        }

                        db.query('INSERT INTO detalle_venta (venta_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)', [ventaId, producto_id, cantidad, precio_unitario], (err) => {
                            if (err) {
                                console.error('Error al insertar detalle de venta:', err);
                            }

                            db.query('UPDATE productos_farmacia SET stock = stock - ? WHERE id = ?', [cantidad, producto_id], (err) => {
                                if (err) {
                                    console.error('Error al actualizar stock:', err);
                                }

                                itemsProcessed++;
                                if (itemsProcessed === totalItems) {
                                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                                    res.end('Intento de registrar venta procesado. Verifique errores.'); 
                                }
                            });
                        });
                    });
                });

            } catch (err) { 
                console.error('Error al parsear JSON de venta:', err);
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Datos de venta recibidos inválidos.');
            }
        });
    } else {
    res.writeHead(404);
    res.end('Ruta no encontrada');
  }
}

module.exports = { handle };