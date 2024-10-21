const express = require('express');
const app = express();

const port = 8082;

//RUTAS

app.get('/', (req, res) => {
    res.send('Mircroservicio Pagos ')
});

app.get('/lista-pagos', (req,res) =>{
    let resp ={
        data: {
            item: [
                {
                    id: 1,
                    nombre: 'pago 1'
                },
                {
                    id: 2,
                    nombre: 'pago 2'
                },
            ]
        }
    };
    res.status(200).json(resp);
});

app.listen(port, () => {
    console.log('Microservicio de pagos escuchando en localhost:' +port);
    
})