-- =============================================
-- Archivo: create_tables.sql
-- Descripción: Creación de tablas para la gestión
--              de roles y usuarios.
-- =============================================

-- Crear la tabla de roles
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    roleName VARCHAR(100) NOT NULL
);

-- Crear la tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    -- La columna 'role' almacena el ID del rol asignado al usuario.
    role INT NOT NULL,
    -- Se establece la relación: cada usuario debe tener un rol válido.
    FOREIGN KEY (role) REFERENCES roles(id) ON DELETE CASCADE
);
