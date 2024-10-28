const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const path = require('path'); // Necesario para trabajar con rutas de archivos
const app = express();
app.use(express.json());
app.use(cors());

// Inicializar Firebase
const serviceAccount = require('../serviceAccountKey.json'); // Ajusta la ruta si es necesario
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "firebase-adminsdk-nvjo0@microservicios-f821e.iam.gserviceaccount.com"
});

const db = admin.firestore(); // Conexión a Firestore
const port = process.env.PORT || 8082; // Cambiar a process.env.PORT

// Servir el archivo HTML de pagos cuando se visita la raíz del servidor
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Ajusta la ruta si es necesario para encontrar index.html
});

// Ruta para obtener lista de pedidos pendientes de pago
app.get('/lista-pedidos-pendientes', async (req, res) => {
    try {
        const pedidosSnapshot = await db.collection('pedidos').where('estado', '==', 'Pendiente de Pago').get();
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
        console.error('Error al obtener pedidos pendientes:', error);
        res.status(500).send('Error al obtener lista de pedidos pendientes');
    }
});


app.post('/pagar-pedido/:id', async (req, res) => {
    const pedidoId = req.params.id;

    try {
        const pedidoRef = db.collection('pedidos').doc(pedidoId);
        const pedidoDoc = await pedidoRef.get();

        if (!pedidoDoc.exists) {
            return res.status(404).send('Pedido no encontrado');
        }

        await pedidoRef.update({
            estado: 'Pagado'
        });

        res.status(200).send('Pedido pagado con éxito');
    } catch (error) {
        console.error('Error al actualizar estado del pedido:', error);
        res.status(500).send('Error al pagar el pedido');
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log('Microservicio pagos escuchando en http://localhost:' + port);
});
