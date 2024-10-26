const gateway = require('fast-gateway');
const express = require('express');
const path = require('path');

// Utiliza el puerto proporcionado por Render o el puerto 3000 si no está definido
const port = process.env.PORT || 3000;

// Crear el servidor API Gateway
const server = gateway({
    routes: [
        {
            prefix: '/pagos',
            target: 'https://pagos-service.onrender.com',
            hooks: {}
        },
        {
            prefix: '/pedidos',
            target: 'https://pedidos-service.onrender.com',
            hooks: {}
        },
        {
            prefix: '/inventario',
            target: 'https://inventario-service.onrender.com',
            hooks: {}
        }
    ]
});

// Iniciar el API Gateway en el puerto proporcionado por Render o el puerto por defecto
server.start(port).then(() => {
    console.log('API Gateway ejecutándose en el puerto: ' + port);
});

// Crear el servidor Express para manejar las solicitudes del contenido estático
const app = express();

// Servir el archivo index.html desde la raíz del directorio api-gateway
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar el servidor Express en el mismo puerto proporcionado por Render
app.listen(port, () => {
    console.log('Servidor de contenido estático ejecutándose en el puerto: ' + port);
});
