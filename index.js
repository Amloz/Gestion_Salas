const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware para procesar datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'front')));

// Ruta principal para servir el formulario
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'front', 'index.html'));
});

app.use(cors());
app.use(bodyParser.json());

const salasRoutes = require('./routes/salas.js');
const reservasRoutes = require('./routes/reservas');

app.use('/salas', salasRoutes);
app.use('/reservas', reservasRoutes);

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
