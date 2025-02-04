import React, { useEffect, useState } from 'react';

// Definición de la interfaz para un usuario
interface User {
  id: number;
  username: string;
  role: string;
}

const NodeApiPage: React.FC = () => {
  // Estado para almacenar la lista de usuarios
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Realiza la petición a la API de Node para obtener usuarios
    fetch('http://localhost:3000/users')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data: User[]) => {
        setUsers(data);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setError("No se pudieron cargar los usuarios.");
      });
  }, []);

  return (
    <div>
      <h2>Node API - Usuarios</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {users.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>ID</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Username</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: User) => (
              <tr key={user.id}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{user.id}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{user.username}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !error && <p>Cargando usuarios...</p>
      )}
      <p>
        <em>Nota:</em> Esta API de Node es vulnerable a inyección SQL y otras vulnerabilidades.
      </p>
    </div>
  );
};

export default NodeApiPage;
