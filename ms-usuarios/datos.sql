-- =============================================
-- Archivo: insert_examples.sql
-- Descripción: Inserción de 10 registros en las tablas
--              roles y users para la gestión de roles y usuarios.
-- =============================================

-- Ingresar 10 registros de ejemplo en la tabla roles
INSERT INTO roles (roleName) VALUES ('Administrator');
INSERT INTO roles (roleName) VALUES ('Editor');
INSERT INTO roles (roleName) VALUES ('Moderator');
INSERT INTO roles (roleName) VALUES ('Subscriber');
INSERT INTO roles (roleName) VALUES ('Contributor');
INSERT INTO roles (roleName) VALUES ('Manager');
INSERT INTO roles (roleName) VALUES ('Developer');
INSERT INTO roles (roleName) VALUES ('Analyst');
INSERT INTO roles (roleName) VALUES ('Support');
INSERT INTO roles (roleName) VALUES ('Guest');

-- Ingresar 10 registros de ejemplo en la tabla users
-- Se asigna a cada usuario un role que debe existir en la tabla roles (de 1 a 10)
INSERT INTO users (username, role) VALUES ('John Doe', 1);
INSERT INTO users (username, role) VALUES ('Jane Smith', 2);
INSERT INTO users (username, role) VALUES ('Bob Johnson', 3);
INSERT INTO users (username, role) VALUES ('Alice Brown', 4);
INSERT INTO users (username, role) VALUES ('Charlie White', 5);
INSERT INTO users (username, role) VALUES ('David Green', 6);
INSERT INTO users (username, role) VALUES ('Eve Black', 7);
INSERT INTO users (username, role) VALUES ('Frank Blue', 8);
INSERT INTO users (username, role) VALUES ('Grace Yellow', 9);
INSERT INTO users (username, role) VALUES ('Heidi Purple', 10);
