
const http = require('http');
const fs = require('fs');
const path = require('path');
const routes = require('./routes');


const server = http.createServer((req, res) => {
  console.log(`Petición recibida: ${req.method} ${req.url}`);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        });
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


const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});