const express = require('express');
const admin = require('firebase-admin');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Middleware para analizar el cuerpo de las solicitudes y habilitar CORS
app.use(bodyParser.json());
app.use(cors());

// Inicializar Firebase con la credencial y URL de la base de datos
const serviceAccountPath = path.join('/etc/secrets', 'serviceAccountKey.json'); // Ruta del archivo de credenciales que se cargará como secreto en Render

admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath)),
  databaseURL: "firebase-adminsdk-dwsf9@microservicios-16180.iam.gserviceaccount.com" // Cambiar a la URL válida de tu proyecto Firebase
});

const db = admin.firestore(); // Conexión a Firestore
const port = process.env.PORT || 8083; // Usar process.env.PORT para que Render determine el puerto

// Servir archivos estáticos (incluye index.html)
app.use(express.static(path.join(__dirname)));

// Ruta principal para servir el archivo HTML
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
        // Validar si la cantidad y el precio son números válidos
        if (isNaN(cantidad) || isNaN(precio) || cantidad < 0 || precio < 0) {
            return res.status(400).send('La cantidad y el precio deben ser números positivos válidos');
        }

        const nuevoProducto = {
            nombre: nombre,
            cantidad: parseInt(cantidad), // Asegurarse de que la cantidad sea un número entero
            precio: parseFloat(precio) // Asegurarse de que el precio sea un número flotante
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
