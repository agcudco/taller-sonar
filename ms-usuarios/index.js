// Importar módulos necesarios
const express = require('express');
const mysql = require('mysql');
const cors = require('cors'); // Importar el middleware CORS

const app = express();

// Habilitar CORS para todas las peticiones
app.use(cors());

// Configurar middleware para parsear JSON en las peticiones
app.use(express.json());

// Configuración de la conexión a MySQL (ajusta según tu entorno)
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',      // Asegúrate de usar la contraseña correcta para tu base de datos
  database: 'bd-taller'   // Cambia 'bd-taller' por el nombre de tu base de datos
});

// Conectar a la base de datos
connection.connect(err => {
  if (err) {
    console.error('Error al conectar a MySQL:', err);
    process.exit(1);
  }
  console.log('Conectado a MySQL');
});

/* =========================================================
   **IMPORTANTE**: Este ejemplo contiene vulnerabilidades
   intencionales, como el uso de concatenación de strings para 
   formar consultas SQL, lo que lo hace susceptible a SQL Injection.
   ========================================================= */

/* ---------------------------
   Endpoints para USUARIOS
------------------------------*/

// Obtener todos los usuarios (vulnerable: sin validación ni parámetros)
app.get('/users', (req, res) => {
  const sql = "SELECT * FROM users";
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Obtener un usuario por ID (vulnerable a SQL Injection)
app.get('/users/:id', (req, res) => {
  const id = req.params.id;
  // Concatenación directa sin sanitización
  const sql = "SELECT * FROM users WHERE id = " + id;
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Crear un nuevo usuario (vulnerable: sin escapar los datos)
app.post('/users', (req, res) => {
  const username = req.body.username;
  const role = req.body.role; // Suponiendo que 'role' es una cadena que representa el rol
  // Consulta vulnerable: concatenación de strings
  const sql = "INSERT INTO users (username, role) VALUES ('" + username + "', '" + role + "')";
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Actualizar un usuario (vulnerable a inyección SQL)
app.put('/users', (req, res) => {
  const id = req.body.id;
  const username = req.body.username;
  const role = req.body.role;
  const sql = "UPDATE users SET username = '" + username + "', role = '" + role + "' WHERE id = " + id;
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Eliminar un usuario (vulnerable a SQL Injection)
app.delete('/users', (req, res) => {
  const id = req.body.id;
  const sql = "DELETE FROM users WHERE id = " + id;
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

/* ---------------------------
   Endpoints para ROLES
------------------------------*/

// Obtener todos los roles
app.get('/roles', (req, res) => {
  const sql = "SELECT * FROM roles";
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Obtener un rol por ID (vulnerable)
app.get('/roles/:id', (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM roles WHERE id = " + id;
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Crear un nuevo rol (vulnerable)
app.post('/roles', (req, res) => {
  const roleName = req.body.roleName;
  const sql = "INSERT INTO roles (roleName) VALUES ('" + roleName + "')";
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Actualizar un rol (vulnerable)
app.put('/roles', (req, res) => {
  const id = req.body.id;
  const roleName = req.body.roleName;
  const sql = "UPDATE roles SET roleName = '" + roleName + "' WHERE id = " + id;
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Eliminar un rol (vulnerable)
app.delete('/roles', (req, res) => {
  const id = req.body.id;
  const sql = "DELETE FROM roles WHERE id = " + id;
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Iniciar el servidor en el puerto 3000 (o el especificado en PORT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
