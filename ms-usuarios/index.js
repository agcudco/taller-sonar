require('dotenv').config(); // Cargar variables de entorno desde .env
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// Configuración segura de CORS (permitir solo el dominio específico)
const corsOptions = {
  origin: 'http://localhost:5173', // Cambia esto según el dominio de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Configurar Express para manejar JSON
app.use(express.json());

// Deshabilitar encabezado "X-Powered-By" para ocultar información del framework
app.disable('x-powered-by');

// Configuración segura de conexión a MySQL
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '', // Usa una variable de entorno en .env
  database: process.env.DB_NAME || 'bd-taller'
});

// Conectar a la base de datos y manejar errores
connection.connect(err => {
  if (err) {
    console.error('Error al conectar a MySQL:', err.message);
    process.exit(1);
  }
  console.log('Conectado a MySQL');
});

/* ==============================================
   ENDPOINTS SEGUROS PARA MANEJO DE USUARIOS
   ============================================== */

// Obtener todos los usuarios
app.get('/users', (req, res) => {
  console.log("📡 Endpoint /users llamado");
  connection.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.error("Error al obtener usuarios:", err);
      return res.status(500).json({ error: "Error al obtener usuarios" });
    }
    console.log("Usuarios obtenidos:", results);
    res.json(results);
  });
});

// Obtener un usuario por ID (Usando consultas preparadas)
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  connection.execute("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("Error al obtener usuario:", err);
      return res.status(500).json({ error: "Error al obtener usuario" });
    }
    res.json(results);
  });
});

// Crear un nuevo usuario
app.post('/users', (req, res) => {
  const { username, role } = req.body;
  if (!username || !role) {
    return res.status(400).json({ error: "Faltan datos requeridos" });
  }
  connection.execute(
    "INSERT INTO users (username, role) VALUES (?, ?)",
    [username, role],
    (err, results) => {
      if (err) {
        console.error("Error al crear usuario:", err);
        return res.status(500).json({ error: "Error al crear usuario" });
      }
      res.status(201).json({ message: "Usuario creado correctamente", id: results.insertId });
    }
  );
});

// Actualizar un usuario
app.put('/users', (req, res) => {
  const { id, username, role } = req.body;
  if (!id || !username || !role) {
    return res.status(400).json({ error: "Faltan datos requeridos" });
  }
  connection.execute(
    "UPDATE users SET username = ?, role = ? WHERE id = ?",
    [username, role, id],
    (err, results) => {
      if (err) {
        console.error("Error al actualizar usuario:", err);
        return res.status(500).json({ error: "Error al actualizar usuario" });
      }
      res.json({ message: "Usuario actualizado correctamente" });
    }
  );
});

// Eliminar un usuario
app.delete('/users', (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: "ID de usuario requerido" });
  }
  connection.execute(
    "DELETE FROM users WHERE id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Error al eliminar usuario:", err);
        return res.status(500).json({ error: "Error al eliminar usuario" });
      }
      res.json({ message: "Usuario eliminado correctamente" });
    }
  );
});

/* ==============================================
   INICIAR SERVIDOR
   ============================================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
