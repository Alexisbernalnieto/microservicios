const gateway = require ('fast-gateway');

const port = 3000;

const server = gateway({
    routes: [
        {
            prefix: '/pedidos',
            target: 'http://localhost:8081/',
            hooks: {}
        },
        {
            prefix: '/pagos',
            target: 'http://localhost:8082/',
            hooks: {}
        }
    ]
});

server.start(port).then(server =>{
    console.log('Gateway ejecutandose en el puerto: '+port);
});