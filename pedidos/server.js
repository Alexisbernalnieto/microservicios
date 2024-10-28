const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Configuración para análisis del cuerpo de las solicitudes
app.use(bodyParser.json());

// Inicializar Firebase
const serviceAccountPath = path.join('/etc/secrets', 'serviceAccountKey.json'); // Ruta del archivo de credenciales que se cargará como secreto

admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath)),
  databaseURL: "firebase-adminsdk-nvjo0@microservicios-f821e.iam.gserviceaccount.com" // Cambia <your-project-id> por el ID de tu proyecto Firebase
});

const db = admin.firestore(); // Conexión a Firestore

const port = process.env.PORT || 8081; // Cambiar a process.env.PORT

// Ruta para servir el archivo HTML principal (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para obtener lista de pedidos desde Firebase
app.get('/lista-pedidos', async (req, res) => {
    try {
        const pedidosSnapshot = await db.collection('pedidos').get();
        const pedidos = [];
        pedidosSnapshot.forEach(doc => {
            pedidos.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json({
            data: {
                item: pedidos
            }
        });
    } catch (error) {
        console.error('Error al obtener pedidos:', error);
        res.status(500).send('Error al obtener lista de pedidos');
    }
});

// Ruta para agregar un nuevo pedido
app.post('/add-pedido', async (req, res) => {
    const { productoId, nombreProducto, precioProducto, cantidad, nombrePedido } = req.body;

    if (!productoId || !nombreProducto || !precioProducto || !cantidad || !nombrePedido) {
        return res.status(400).send('Debe proporcionar todos los datos del pedido');
    }

    try {
        // Calcular el total del pedido
        const total = precioProducto * cantidad;

        const nuevoPedido = {
            productoId,
            nombreProducto,
            precioProducto,
            cantidad,
            nombrePedido,
            total,
            estado: 'Pendiente de Pago',
            fechaCreacion: new Date().toISOString()
        };

        // Guardar el pedido en Firestore
        const response = await db.collection('pedidos').add(nuevoPedido);

        // Actualizar la cantidad en el inventario
        const productoRef = db.collection('inventario').doc(productoId);
        const productoDoc = await productoRef.get();

        if (!productoDoc.exists) {
            return res.status(404).send('Producto no encontrado en el inventario');
        }

        const nuevaCantidad = productoDoc.data().cantidad - cantidad;
        if (nuevaCantidad < 0) {
            return res.status(400).send('No hay suficiente cantidad del producto en el inventario');
        }

        await productoRef.update({ cantidad: nuevaCantidad });

        res.status(200).send(`Pedido agregado con ID: ${response.id}`);
    } catch (error) {
        console.error('Error al agregar pedido:', error);
        res.status(500).send('Error al agregar pedido');
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
    console.log('Microservicio pedidos escuchando en http://localhost:' + port);
});
