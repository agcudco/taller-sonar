require('dotenv').config(); // Cargar variables de entorno desde .env
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// Configuración segura de CORS (permitir solo dominios específicos)
const corsOptions = {
  origin: ['http://localhost:3000'], // Cambia esto por el dominio permitido
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());

// Deshabilitar encabezado "X-Powered-By" para ocultar información del framework
app.disable('x-powered-by');

// Configuración segura de conexión a MySQL
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '', // La contraseña ya no está hardcodeada
  database: process.env.DB_NAME || 'bd-taller'
});

connection.connect(err => {
  if (err) {
    console.error('Error al conectar a MySQL:', err);
    process.exit(1);
  }
  console.log('Conectado a MySQL');
});

// Endpoints seguros usando consultas preparadas
app.get('/users', (req, res) => {
  console.log("Endpoint /users llamado"); // <-- Agrega este log
  connection.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.error("Error al obtener usuarios:", err);
      return res.status(500).json({ error: "Error al obtener usuarios", details: err.message });
    }
    console.log("Usuarios obtenidos:", results); // <-- Muestra los datos en la consola
    res.json(results);
  });
});

app.post('/users', (req, res) => {
  connection.execute(
    "INSERT INTO users (username, role) VALUES (?, ?)",
    [req.body.username, req.body.role],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    }
  );
});

app.put('/users', (req, res) => {
  connection.execute(
    "UPDATE users SET username = ?, role = ? WHERE id = ?",
    [req.body.username, req.body.role, req.body.id],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    }
  );
});

app.delete('/users', (req, res) => {
  connection.execute(
    "DELETE FROM users WHERE id = ?",
    [req.body.id],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    }
  );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});