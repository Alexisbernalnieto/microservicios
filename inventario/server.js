const express = require('express');
const admin = require('firebase-admin');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

// Inicializar Firebase
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "firebase-adminsdk-nvjo0@microservicios-f821e.iam.gserviceaccount.com"
});

const db = admin.firestore(); // Conexión a Firestore
const port = 8083;

// Servir archivos estáticos
app.use(express.static(path.join(__dirname)));

// RUTAS

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para agregar un nuevo producto al inventario
app.post('/agregar-producto', async (req, res) => {
    const { nombre, cantidad, precio } = req.body;

    if (!nombre || !cantidad || !precio) {
        return res.status(400).send('Debe proporcionar nombre, cantidad y precio del producto');
    }

    try {
        const nuevoProducto = {
            nombre: nombre,
            cantidad: cantidad,
            precio: precio
        };

        const response = await db.collection('inventario').add(nuevoProducto);
        res.status(200).send(`Producto agregado con ID: ${response.id}`);
    } catch (error) {
        console.error('Error al agregar producto:', error);
        res.status(500).send('Error al agregar producto');
    }
});

// Ruta para obtener lista de productos del inventario
app.get('/lista-productos', async (req, res) => {
    try {
        const productosSnapshot = await db.collection('inventario').get();
        const productos = [];
        productosSnapshot.forEach(doc => {
            productos.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json({
            data: {
                item: productos
            }
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error al obtener lista de productos');
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log('Microservicio inventario escuchando en http://localhost:' + port);
});
