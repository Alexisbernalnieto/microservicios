const express = require('express');
const app = express();

const port = 8081;

//RUTAS

app.get('/', (req, res) => {
    res.send('Mircroservicio Pedidos')
});

app.get('/lista-pedidos', (req,res) =>{
    let resp ={
        data: {
            item: [
                {
                    id: 1,
                    nombre: 'pedido 1'
                },
                {
                    id: 2,
                    nombre: 'pedido 2'
                },
            ]
        }
    };
    res.status(200).json(resp);
});

app.listen(port, () => {
    console.log('Microservicio pedidos escuchando en localhost:' +port);
    
})