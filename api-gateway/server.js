const express = require('express');
const path = require('path');
const gateway = require('fast-gateway');

// Utiliza el puerto proporcionado por Render o el puerto 3000 si no está definido
const port = process.env.PORT || 3000;

// Crear el servidor Express principal
const app = express();

// Configurar Fast-Gateway como middleware en el servidor Express principal
const gatewayServer = gateway({
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

// Montar el gateway como middleware en Express
app.use('/api', gatewayServer.middleware());

// Servir el archivo index.html para la raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar el servidor Express que incluye el API Gateway y el contenido estático
app.listen(port, () => {
    console.log(`Servidor de contenido estático y API Gateway ejecutándose en el puerto: ${port}`);
});
