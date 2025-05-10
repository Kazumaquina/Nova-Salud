// Importar las dependencias necesarias
const http = require('http');
const fs = require('fs');
const path = require('path');
const routes = require('./routes');

// Crear el servidor HTTP
const server = http.createServer((req, res) => {

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  if (req.url === '/' && req.method === 'GET') {
    const filePath = path.join(__dirname, '../../index.html');
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error cargando index.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      }
    });
  } else if (req.method === 'GET' && req.url.startsWith('/static/')) {
    const filePath = path.join(__dirname, '../..', req.url.replace('/static/', ''));
    const ext = path.extname(filePath);
    const mimeTypes = {
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.ico': 'image/x-icon',
      '.html': 'text/html'
    };
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404);
        res.end('Recurso no encontrado');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  } else {
    routes.handle(req, res);
  }
});

// Iniciar el servidor
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});