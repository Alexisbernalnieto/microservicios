const gateway = require('fast-gateway');
const express = require('express');
const path = require('path');

// Utiliza el puerto proporcionado por Render o el puerto 3002 si no está definido
const port = process.env.PORT || 3000;

const app = express();

// Crear el servidor API Gateway con la configuración y conectarlo con Express
gateway({
    server: app, // Reutiliza la misma instancia de Express
    routes: [
        {
            prefix: '/pagos',
            target: 'http://localhost:8082/',
            hooks: {}
        },
        {
            prefix: '/pedidos',
            target: 'http://localhost:8081/',
            hooks: {}
        },
        {
            prefix: '/inventario',
            target: 'http://localhost:8083/',
            hooks: {}
        }
    ]
});

// Servir el archivo index.html desde la raíz del directorio api-gateway
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar el servidor Express en el puerto proporcionado
app.listen(port, () => {
    console.log('API Gateway y servidor de contenido estático ejecutándose en el puerto: ' + port);
});
