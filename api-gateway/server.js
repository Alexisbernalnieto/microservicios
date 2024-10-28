const gateway = require('fast-gateway');
const express = require('express');
const path = require('path');

const port = process.env.PORT || 3000;

// Crear el servidor API Gateway
const gatewayServer = gateway({
    routes: [
        {
            prefix: '/pagos',
            target: 'https://pagos-sowr.onrender.com/api/pagos/',  // URL del microservicio de pagos
            hooks: {}
        },
        {
            prefix: '/pedidos',
            target: 'https://pedidos-xkuu.onrender.com/api/pedidos/',  // URL del microservicio de pedidos
            hooks: {}
        },
        {
            prefix: '/inventario',
            target: 'https://inventario-r2xk.onrender.com/api/inventario/',  // URL del microservicio de inventario
            hooks: {}
        }
    ]
});

// Crear el servidor Express principal para manejar las solicitudes de contenido estático y el API Gateway
const app = express();

// Middleware del API Gateway montado en el servidor Express
app.use('/api', (req, res, next) => {
    gatewayServer.middleware()(req, res, next);
});

// Servir el archivo index.html para la raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar el servidor Express que incluye el API Gateway y el contenido estático
app.listen(port, () => {
    console.log(`Servidor de contenido estático y API Gateway ejecutándose en el puerto: ${port}`);
});
