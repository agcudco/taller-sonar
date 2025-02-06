// Importar módulos necesarios
const express = require('express');
const mysql = require('mysql2/promise'); // Usamos mysql2/promise para soporte de promesas
const cors = require('cors'); // Middleware para manejar CORS

const app = express();

// Habilitar CORS para todas las peticiones
app.use(cors());

// Configurar middleware para parsear JSON en las peticiones
app.use(express.json());

// Configuración de la conexión a la base de datos
const dbConfig = {
  host: 'localhost', // Host de la base de datos (localhost si está en tu máquina local)
  user: 'root123',    // Usuario de MySQL
  password: 'abcd',   // Contraseña de MySQL
  database: 'ms_usuarios', // Nombre correcto de la base de datos
};

// Middleware para manejar la conexión a la base de datos
app.use(async (req, res, next) => {
  try {
    req.db = await mysql.createConnection(dbConfig);
    await req.db.connect();
    next();
  } catch (err) {
    console.error('Error al conectar a MySQL:', err);
    res.status(500).send({ error: 'Error al conectar a la base de datos' });
  }
});

// Endpoint para obtener todos los usuarios
app.get('/users', async (req, res) => {
  try {
    const [rows] = await req.db.execute('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener usuarios:', err);
    res.status(500).send({ error: 'Error al obtener usuarios' });
  } finally {
    req.db.end();
  }
});

// Endpoint para obtener un usuario por ID
app.get('/users/:id', async (req, res) => {
  try {
    const [rows] = await req.db.execute('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).send({ message: 'Usuario no encontrado' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error al obtener usuario:', err);
    res.status(500).send({ error: 'Error al obtener usuario' });
  } finally {
    req.db.end();
  }
});

// Endpoint para crear un nuevo usuario
app.post('/users', async (req, res) => {
  const { username, role } = req.body;
  if (!username || !role) {
    return res.status(400).send({ message: 'Datos incompletos' });
  }

  try {
    const [result] = await req.db.execute(
      'INSERT INTO users (username, role) VALUES (?, ?)',
      [username, role]
    );
    res.status(201).send({ message: 'Usuario creado', id: result.insertId });
  } catch (err) {
    console.error('Error al crear usuario:', err);
    res.status(500).send({ error: 'Error al crear usuario' });
  } finally {
    req.db.end();
  }
});

// Endpoint para actualizar un usuario
app.put('/users/:id', async (req, res) => {
  const { username, role } = req.body;
  if (!username || !role) {
    return res.status(400).send({ message: 'Datos incompletos' });
  }

  try {
    const [result] = await req.db.execute(
      'UPDATE users SET username = ?, role = ? WHERE id = ?',
      [username, role, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Usuario no encontrado' });
    }
    res.send({ message: 'Usuario actualizado' });
  } catch (err) {
    console.error('Error al actualizar usuario:', err);
    res.status(500).send({ error: 'Error al actualizar usuario' });
  } finally {
    req.db.end();
  }
});

// Endpoint para eliminar un usuario
app.delete('/users/:id', async (req, res) => {
  try {
    const [result] = await req.db.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Usuario no encontrado' });
    }
    res.send({ message: 'Usuario eliminado' });
  } catch (err) {
    console.error('Error al eliminar usuario:', err);
    res.status(500).send({ error: 'Error al eliminar usuario' });
  } finally {
    req.db.end();
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
