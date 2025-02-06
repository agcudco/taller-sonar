// Cargar variables de entorno desde .env
require('dotenv').config(); 
const express = require('express');
const mysql = require('mysql');
const cors = require('cors'); // Middleware CORS
const Joi = require('joi'); // Biblioteca para validación de datos

const app = express();

// Habilitar CORS para todas las peticiones
app.use(cors());

// Configurar middleware para parsear JSON en las peticiones
app.use(express.json());

// Configuración de la conexión a MySQL (utilizando variables de entorno)
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Conectar a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a MySQL:', err);
    process.exit(1);
  }
  console.log('Conectado a MySQL');
});

/* =========================================================
   **ENDPOINTS PARA USUARIOS**
========================================================= */

// Obtener todos los usuarios
app.get('/users', (req, res) => {
  const sql = 'SELECT * FROM users';
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Obtener un usuario por ID (con consulta parametrizada)
app.get('/users/:id', (req, res) => {
  const sql = 'SELECT * FROM users WHERE id = ?';
  connection.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Crear un nuevo usuario (con validación y consulta segura)
app.post('/users', (req, res) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    role: Joi.string().valid('admin', 'user').required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const sql = 'INSERT INTO users (username, role) VALUES (?, ?)';
  connection.query(sql, [req.body.username, req.body.role], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Actualizar un usuario
app.put('/users', (req, res) => {
  const schema = Joi.object({
    id: Joi.number().integer().required(),
    username: Joi.string().min(3).max(30).optional(),
    role: Joi.string().valid('admin', 'user').optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const sql = 'UPDATE users SET username = ?, role = ? WHERE id = ?';
  connection.query(
    sql,
    [req.body.username, req.body.role, req.body.id],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    }
  );
});

// Eliminar un usuario
app.delete('/users', (req, res) => {
  const schema = Joi.object({
    id: Joi.number().integer().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const sql = 'DELETE FROM users WHERE id = ?';
  connection.query(sql, [req.body.id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});