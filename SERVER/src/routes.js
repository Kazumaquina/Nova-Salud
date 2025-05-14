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
  }else if (req.url === '/api/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const userData = JSON.parse(body);
        const { username, password } = userData;

        if (!username || !password) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Usuario y contraseña son requeridos' }));
          return;
        }

        // Consulta a la base de datos para encontrar al usuario
        db.query('SELECT * FROM usuarios WHERE username = ?', [username], (err, results) => {
          if (err) {
            console.error('Error en la consulta de login:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Error interno del servidor' }));
            return;
          }

          if (results.length > 0) {
            const user = results[0];
            if (password === user.password) {            
                res.writeHead(200, { 'Content-Type': 'application/json' });
                // Devuelve solo la información necesaria del usuario, no la contraseña.
                // Y un token si lo usas.
                res.end(JSON.stringify({
                  message: 'Login exitoso',
                  user: { id: user.ID, username: user.username},
                  // token: 'tu_jwt_token_aqui' // Si generas un token
                }));
              } else {
                // Contraseña incorrecta
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Usuario o contraseña incorrectos' }));
              }
          } else {
            // Usuario no encontrado
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Usuario o contraseña incorrectos' })); // Mensaje genérico por seguridad
          }
        });

      } catch (parseError) {
        console.error('Error al parsear JSON de login:', parseError);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Datos de login inválidos' }));
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

  } else if ( req.url === "/search" && req.method === "POST") {
      let body = "";

      req.on("data", (chunk) => {
          body += chunk;
      });

      req.on("end", () => {
          try {
              const data = JSON.parse(body);
              const { search } = data;

              if (!search) {
                  res.writeHead(400, { "Content-Type": "text/plain" });
                  res.end("Datos de venta incompletos o inválidos.");
                  return;
              }

              db.query("SELECT * FROM productos_farmacia WHERE nombre LIKE ?", [`%${search}%`], (err, result) => {
                  if (err) {
                      console.error("Error al buscar productos:", err);
                      res.writeHead(500, { "Content-Type": "text/plain" });
                      res.end("Error al buscar productos.");
                      return;
                  }

                  res.writeHead(200, { "Content-Type": "application/json" });
                  res.end(JSON.stringify(result));
              });
          } catch (err) {
              console.error("Error al parsear JSON de venta:", err);
              res.writeHead(400, { "Content-Type": "text/plain" });
              res.end("Datos de venta recibidos inválidos.");
          }
      });

    } else if (req.url === '/products-api' && req.method === 'POST') { // <-- La ruta que espera la petición POST de api.js
      let body = '';

      req.on('data', chunk => {
          body += chunk;
      });

      req.on('end', () => {
          try {
              const data = JSON.parse(body); // Espera el JSON con los datos del nuevo producto (nombre, marca, precio, stock)

              // Validar los datos recibidos del nuevo producto
              // Usamos parseInt/parseFloat aquí para asegurar que son números, aunque ya se hizo en frontend, es buena práctica validar en backend.
              const nombre = data.nombre;
              const marca = data.marca;
              const precio = parseFloat(data.precio);
              const stock = parseInt(data.stock);

              if (!nombre || typeof nombre !== 'string' || nombre.trim() === '' ||
                  !marca || typeof marca !== 'string' || marca.trim() === '' ||
                  isNaN(precio) || precio <= 0 || // Precio debe ser mayor que 0 para añadir
                  isNaN(stock) || stock < 0) { // Stock puede ser 0
                  res.writeHead(400, { 'Content-Type': 'text/plain' });
                  res.end('Datos de producto inválidos o incompletos para añadir.');
                  return;
              }

              // Ejecutar la consulta SQL para insertar el nuevo producto
              // Usamos las columnas exactas de tu tabla 'productos_farmacia': 'nombre', 'marca', 'precio', 'stock'. El 'id' es AUTO_INCREMENT.
              db.query('INSERT INTO productos_farmacia (nombre, marca, precio, stock) VALUES (?, ?, ?, ?)', [nombre, marca, precio, stock], (err, result) => {
                  if (err) {
                      console.error('Error al insertar nuevo producto en DB:', err);
                      res.writeHead(500, { 'Content-Type': 'text/plain' });
                      res.end('Error al añadir el producto a la base de datos.');
                  } else {
                      // result.insertId contiene el ID del nuevo producto insertado
                      const newProductId = result.insertId;
                      console.log(`Nuevo producto añadido con éxito. ID: ${newProductId}`);
                      res.writeHead(201, { 'Content-Type': 'text/plain' }); // Código 201 Created es apropiado para creación
                      res.end('Producto añadido con éxito.'); // Mensaje de éxito
                      // Opcional: Podrías enviar el ID del nuevo producto en la respuesta JSON:
                      // res.writeHead(201, { 'Content-Type': 'application/json' });
                      // res.end(JSON.stringify({ message: 'Producto añadido con éxito', id: newProductId }));
                  }
              });

          } catch (err) { // Error al parsear el JSON inicial
              console.error('Error al parsear JSON de nuevo producto:', err);
              res.writeHead(400, { 'Content-Type': 'text/plain' });
              res.end('Datos de nuevo producto recibidos inválidos.');
          }
      });
      }else if (req.url === '/products-api' && req.method === 'DELETE') { // <-- La ruta que espera la petición DELETE
          let body = '';

          req.on('data', chunk => {
              body += chunk;
          });

          req.on('end', () => {
              try {
                  const data = JSON.parse(body); // Espera un JSON con un array de IDs: { ids: [...] }
                  const productIdsToDelete = data.ids;

                  // Validar los datos recibidos - Asegúrate de que sea un array y contenga números
                  if (!Array.isArray(productIdsToDelete) || productIdsToDelete.length === 0) {
                      res.writeHead(400, { 'Content-Type': 'text/plain' });
                      res.end('Datos de eliminación inválidos: se espera una lista de IDs.');
                      return;
                  }

                  // Filtrar IDs no válidos (no números o <= 0)
                  const validIds = productIdsToDelete
                                  .map(id => parseInt(id))
                                  .filter(id => !isNaN(id) && id > 0);

                  if (validIds.length === 0) {
                      res.writeHead(400, { 'Content-Type': 'text/plain' });
                      res.end('Ningún ID válido proporcionado para eliminar.');
                      return;
                  }


                  // Crear la consulta SQL DELETE. Usamos 'IN (?)' para eliminar múltiples IDs.
                  // El paquete mysql2 manejará automáticamente el array para generar '(id1, id2, id3)'.
                  db.query('DELETE FROM productos_farmacia WHERE id IN (?)', [validIds], (err, result) => {
                      if (err) {
                          console.error('Error al eliminar productos en DB:', err);
                          // --- Manejo específico para errores de clave foránea ---
                          if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.errno === 1451) {
                              res.writeHead(409, { 'Content-Type': 'text/plain' }); // 409 Conflict
                              res.end('No se pueden eliminar algunos productos porque están asociados a ventas existentes.');
                          } else {
                              // Otros errores de base de datos
                              res.writeHead(500, { 'Content-Type': 'text/plain' });
                              res.end('Error al eliminar los productos de la base de datos.');
                          }
                      } else {
                          // result.affectedRows te dice cuántas filas fueron eliminadas
                          const deletedCount = result.affectedRows;
                          console.log(`Productos eliminados con éxito. Cantidad: ${deletedCount}`);
                          res.writeHead(200, { 'Content-Type': 'text/plain' });
                          res.end(`${deletedCount} producto(s) eliminado(s) con éxito.`); // Mensaje de éxito
                      }
                  });

              } catch (err) { // Error al parsear el JSON inicial
                  console.error('Error al parsear JSON de IDs para eliminar:', err);
                  res.writeHead(400, { 'Content-Type': 'text/plain' });
                  res.end('Datos de eliminación recibidos inválidos.');
              }
          });

    } else {
    res.writeHead(404);
    res.end('Ruta no encontrada');
  }
}

module.exports = { handle };