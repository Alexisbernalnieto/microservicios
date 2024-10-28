const gateway = require('fast-gateway');
const express = require('express');
const path = require('path');

const port = process.env.PORT || 3000; // Puerto para el API Gateway y servidor Express

// Crear el servidor Express principal
const app = express();

// Servir el archivo index.html para la raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Crear el servidor API Gateway
const gatewayServer = gateway({
    server: app, // Usar el servidor Express existente
    routes: [
        {
            prefix: '/pagos',
            target: 'https://pagos-sowr.onrender.com',  // URL de Render del microservicio de pagos
            hooks: {}
        },
        {
            prefix: '/pedidos',
            target: 'https://pedidos-xkuu.onrender.com',  // URL de Render del microservicio de pedidos
            hooks: {}
        },
        {
            prefix: '/inventario',
            target: 'https://inventario-r2xk.onrender.com',  // URL de Render del microservicio de inventario
            hooks: {}
        }
    ]
});

// Iniciar el API Gateway en el puerto especificado
gatewayServer.start(port)
    .then(server => {
        console.log(`Servidor de contenido estático y API Gateway ejecutándose en el puerto: ${port}`);
    })
    .catch(err => {
        console.error('Error al iniciar el servidor API Gateway:', err);
        process.exit(1); // Termina el proceso con un error
    });
