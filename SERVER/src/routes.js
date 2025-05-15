const db = require('./db');
const url = require('url');
const { generateInvoicePdf } = require('./pdf');

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
        const { id, username, password } = data;
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
          res.end(JSON.stringify({message: 'Login exitoso',
            user: { id: user.ID, username: user.username },
            
        }));
          return;
        }
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
                res.end(JSON.stringify({
                  message: 'Login exitoso',
                  user: { id: user.ID, username: user.username},
                }));
              } else {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Usuario o contraseña incorrectos' }));
              }
          } else {
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
  } else if (req.url === '/register-sale' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const { clientName, products } = data;

                if (!clientName || clientName.trim() === '' || !products || !Array.isArray(products) || products.length === 0) {
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end('Datos de venta incompletos o inválidos (falta nombre de cliente o productos).');
                    return;
                }
                let calculatedTotal = 0;
                let itemErrors = [];

                products.forEach(item => {
                    const producto_id = parseInt(item.id);
                    const cantidad = parseInt(item.cantidad);
                    const precio_unitario = parseFloat(item.precio);
                    const subtotal_item = parseFloat(item.subtotal);

                    if (isNaN(producto_id) || isNaN(cantidad) || cantidad <= 0 || isNaN(precio_unitario) || precio_unitario < 0 || isNaN(subtotal_item) || subtotal_item < 0) {
                        console.error('Datos de item de venta inválidos durante cálculo:', item);
                        itemErrors.push(`Item inválido para cálculo: ID ${item.id || 'desconocido'}`);
                    } else {
                        calculatedTotal += subtotal_item;
                    }
                });

                if (calculatedTotal <= 0 && itemErrors.length === products.length) {
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end('La venta no contiene productos válidos para calcular el total.');
                    return;
                }

                const saleDate = new Date();

                db.query('INSERT INTO ventas (nombre, fecha, total) VALUES (?, ?, ?)', [clientName, saleDate, calculatedTotal], (err, result) => { 
                    if (err) {
                        console.error('Error al insertar venta principal:', err);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Error al guardar la venta principal.');
                        return;
                    }

                    const ventaId = result.insertId;
                    let itemsProcessed = 0;
                    const totalItems = products.length;
                    itemErrors = [];

                    products.forEach(item => {
                        const producto_id = parseInt(item.id);
                        const cantidad = parseInt(item.cantidad);
                        const precio_unitario = parseFloat(item.precio);
                        const subtotal_item = parseFloat(item.subtotal);


                        if (isNaN(producto_id) || isNaN(cantidad) || cantidad <= 0 || isNaN(precio_unitario) || precio_unitario < 0 || isNaN(subtotal_item) || subtotal_item < 0) {
                            console.error('Datos de item de venta inválidos para inserción:', item);
                            itemErrors.push(`Item inválido para inserción: ID ${item.id || 'desconocido'}`);
                            itemsProcessed++;
                            if (itemsProcessed === totalItems) {
                                const finalMessage = itemErrors.length > 0 ? `Venta principal registrada. Errores en ${itemErrors.length} productos.` : 'Venta registrada con éxito.';
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({
                                  message: finalMessage,
                                  ventaId: ventaId,
                                  itemErrors: itemErrors.length > 0 ? itemErrors : undefined
                                }));
                                console.log(`Venta ${ventaId} procesada. Items con error: ${itemErrors.length}`);
                            }
                            return;
                        }

                        db.query('INSERT INTO detalle_venta (venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)', [ventaId, producto_id, cantidad, precio_unitario, subtotal_item], (err) => {
                            if (err) {
                                console.error('Error al insertar detalle de venta:', err);
                                itemErrors.push(`Error DB insertando detalle para producto ID ${producto_id}: ${err.message}`);
                            }
                            db.query('UPDATE productos_farmacia SET stock = stock - ? WHERE id = ?', [cantidad, producto_id], (err) => {
                                if (err) {
                                    console.error('Error al actualizar stock:', err);
                                    itemErrors.push(`Error DB actualizando stock para producto ID ${producto_id}: ${err.message}`);
                                }
                                itemsProcessed++;
                                if (itemsProcessed === totalItems) {
                                    const finalMessage = itemErrors.length > 0 ? `Venta principal registrada. Errores en ${itemErrors.length} productos.` : 'Venta registrada con éxito.';
                                    res.writeHead(200, { 'Content-Type': 'application/json' });
                                    res.end(JSON.stringify({
                                      message: finalMessage,
                                      ventaId: ventaId,
                                      itemErrors: itemErrors.length > 0 ? itemErrors : undefined
                                    }));
                                    console.log(`Venta ${ventaId} procesada. Items con error: ${itemErrors.length}`);
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
    } else if (req.url === '/products-api' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
          body += chunk;
      });
      req.on('end', () => {
          try {
              const data = JSON.parse(body);
              const nombre = data.nombre;
              const marca = data.marca;
              const precio = parseFloat(data.precio);
              const stock = parseInt(data.stock);
              if (!nombre || typeof nombre !== 'string' || nombre.trim() === '' ||
                  !marca || typeof marca !== 'string' || marca.trim() === '' ||
                  isNaN(precio) || precio <= 0 ||
                  isNaN(stock) || stock < 0) {
                  res.writeHead(400, { 'Content-Type': 'text/plain' });
                  res.end('Datos de producto inválidos o incompletos para añadir.');
                  return;
              }
              db.query('INSERT INTO productos_farmacia (nombre, marca, precio, stock) VALUES (?, ?, ?, ?)', [nombre, marca, precio, stock], (err, result) => {
                  if (err) {
                      console.error('Error al insertar nuevo producto en DB:', err);
                      res.writeHead(500, { 'Content-Type': 'text/plain' });
                      res.end('Error al añadir el producto a la base de datos.');
                  } else {
                      const newProductId = result.insertId;
                      console.log(`Nuevo producto añadido con éxito. ID: ${newProductId}`);
                      res.writeHead(201, { 'Content-Type': 'text/plain' });
                      res.end('Producto añadido con éxito.');
                  }
              });
          } catch (err) {
              console.error('Error al parsear JSON de nuevo producto:', err);
              res.writeHead(400, { 'Content-Type': 'text/plain' });
              res.end('Datos de nuevo producto recibidos inválidos.');
          }
      });
      }else if (req.url === '/products-api' && req.method === 'DELETE') {
          let body = '';
          req.on('data', chunk => {
              body += chunk;
          });
          req.on('end', () => {
              try {
                  const data = JSON.parse(body);
                  const productIdsToDelete = data.ids;
                  if (!Array.isArray(productIdsToDelete) || productIdsToDelete.length === 0) {
                      res.writeHead(400, { 'Content-Type': 'text/plain' });
                      res.end('Datos de eliminación inválidos: se espera una lista de IDs.');
                      return;
                  }
                  const validIds = productIdsToDelete
                                  .map(id => parseInt(id))
                                  .filter(id => !isNaN(id) && id > 0);
                  if (validIds.length === 0) {
                      res.writeHead(400, { 'Content-Type': 'text/plain' });
                      res.end('Ningún ID válido proporcionado para eliminar.');
                      return;
                  }
                  db.query('DELETE FROM productos_farmacia WHERE id IN (?)', [validIds], (err, result) => {
                      if (err) {
                          console.error('Error al eliminar productos en DB:', err);
                          if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.errno === 1451) {
                              res.writeHead(409, { 'Content-Type': 'text/plain' });
                              res.end('No se pueden eliminar algunos productos porque están asociados a ventas existentes.');
                          } else {
                              res.writeHead(500, { 'Content-Type': 'text/plain' });
                              res.end('Error al eliminar los productos de la base de datos.');
                          }
                      } else {
                          const deletedCount = result.affectedRows;
                          console.log(`Productos eliminados con éxito. Cantidad: ${deletedCount}`);
                          res.writeHead(200, { 'Content-Type': 'text/plain' });
                          res.end(`${deletedCount} producto(s) eliminado(s) con éxito.`);
                      }
                  });
              } catch (err) {
                  console.error('Error al parsear JSON de IDs para eliminar:', err);
                  res.writeHead(400, { 'Content-Type': 'text/plain' });
                  res.end('Datos de eliminación recibidos inválidos.');
          }
        });
    } else if (req.url.match(/^\/generate-invoice\/([^\/]+)$/) && req.method === 'GET') {
      const parsedUrl = url.parse(req.url, true);
      const pathSegments = parsedUrl.pathname.split('/');

      if (pathSegments[1] === 'generate-invoice' && pathSegments.length === 3) {
          const ventaId = parseInt(pathSegments[2]);

          if (isNaN(ventaId) || ventaId <= 0) {
              res.writeHead(400, { 'Content-Type': 'text/plain' });
              res.end('ID de venta inválido.');
              return;
          }
          const query = `
              SELECT
                  v.id as venta_id,
                  v.fecha as venta_fecha,
                  v.nombre as cliente_nombre,
                  v.total as venta_total,
                  dv.cantidad,
                  dv.precio_unitario,
                  dv.subtotal as detalle_subtotal,
                  p.nombre as producto_nombre,
                  p.marca as producto_marca,
                  p.id as producto_id
              FROM ventas v
              JOIN detalle_venta dv ON v.id = dv.venta_id
              JOIN productos_farmacia p ON dv.producto_id = p.id
              WHERE v.id = ?;
          `;

          db.query(query, [ventaId], (err, results) => {
              if (err) {
                  console.error('Error al obtener detalles de venta para PDF:', err);
                  res.writeHead(500, { 'Content-Type': 'text/plain' });
                  res.end('Error al obtener los detalles de la venta.');
                  return;
              }

              if (results.length === 0) {
                  res.writeHead(404, { 'Content-Type': 'text/plain' });
                  res.end('Venta no encontrada.');
                  return;
              }
              const saleDetails = {
                  id: results[0].venta_id,
                  fecha: results[0].venta_fecha,
                  clienteNombre: results[0].cliente_nombre,
                  total: results[0].venta_total,
                  productos: results.map(row => ({
                      id: row.producto_id,
                      nombre: row.producto_nombre,
                      marca: row.producto_marca,
                      cantidad: row.cantidad,
                      precio_unitario: row.precio_unitario,
                      subtotal: row.detalle_subtotal
                  }))
              };

              try {
                  const pdfDoc = generateInvoicePdf(saleDetails);

                  res.writeHead(200, {
                      'Content-Type': 'application/pdf',
                      'Content-Disposition': `inline; filename="factura_venta_${ventaId}.pdf"`
                  });

                  pdfDoc.pipe(res);
                  pdfDoc.end();

                  console.log(`PDF de venta ${ventaId} generado y enviado.`);
              } catch (pdfError) {
                  console.error('Error al generar el PDF:', pdfError);
                  if (!res.headersSent) {
                      res.writeHead(500, { 'Content-Type': 'text/plain' });
                      res.end('Error interno al generar el PDF.');
                  } else {
                      res.end();
                  }
              }
          });
      }
  } else if (req.url === '/ventas' && req.method === 'GET') { //Mi
    db.query('SELECT id, nombre, fecha, total FROM ventas', (err, results) => {
        if (err) {
            console.error('Error al obtener las ventas:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error interno al obtener ventas' }));
            return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(results));
    });
  } else if ( req.url === '/sale_details' && req.method === 'POST' ) {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      const { id } = JSON.parse(body);
      db.query('SELECT dv.id, pf.nombre, pf.marca, dv.precio_unitario, dv.cantidad, dv.subtotal FROM detalle_venta dv, productos_farmacia pf WHERE dv.producto_id = pf.id AND dv.venta_id = ?;', [id], (err, results) => {
        if (err) {
          console.error('Error al obtener el detalle de ventas:', err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Error interno al obtener el detalle de ventas' }));
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(results));
      });
    });
  } else {
    res.writeHead(404);
    res.end('Ruta no encontrada');
  }
}
module.exports = { handle };