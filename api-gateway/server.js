const gateway = require('fast-gateway');
const express = require('express');
const path = require('path');

const gatewayPort = 3000; // Puerto del API Gateway
const staticPort = 3001; // Puerto del servidor de contenido estático

// Crear el servidor API Gateway
const server = gateway({
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

// Iniciar el API Gateway en el puerto 3000
server.start(gatewayPort).then(() => {
    console.log('API Gateway ejecutándose en el puerto: ' + gatewayPort);
});

// Crear el servidor Express para manejar las solicitudes del contenido estático
const app = express();

// Servir el archivo index.html desde la raíz del directorio api-gateway
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar el servidor Express en el puerto 3001
app.listen(staticPort, () => {
    console.log('Servidor de contenido estático ejecutándose en el puerto: ' + staticPort);
});
