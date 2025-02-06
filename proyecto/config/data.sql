-- Crear la tabla de categorías
CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL
);

-- Crear la tabla de productos (relacionada con categorias)
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    categoria_id INT NOT NULL,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE
);

-- Insertar 10 registros de ejemplo en la tabla categorias
INSERT INTO categorias (nombre, descripcion) VALUES 
('Electrónica', 'Dispositivos electrónicos modernos y gadgets.'),
('Ropa', 'Vestimenta casual, formal y deportiva.'),
('Hogar', 'Artículos para el hogar y decoración.'),
('Deportes', 'Equipamiento y accesorios para actividades deportivas.'),
('Libros', 'Variedad de libros de ficción, no ficción y educativos.'),
('Juguetes', 'Juguetes para niños de todas las edades.'),
('Alimentos', 'Productos alimenticios y gourmet.'),
('Automóviles', 'Vehículos y accesorios automotrices.'),
('Música', 'Instrumentos musicales y accesorios.'),
('Salud y Belleza', 'Productos para el cuidado personal y la belleza.');

-- Insertar 10 registros de ejemplo en la tabla productos
-- Se asume que cada producto se relaciona con una de las categorías anteriores (categoria_id de 1 a 10)
INSERT INTO productos (nombre, descripcion, precio, categoria_id) VALUES 
('Smartphone XYZ', 'Teléfono inteligente con pantalla de 6.5 pulgadas.', 299.99, 1),
('Camiseta Deportiva', 'Camiseta de algodón para actividades deportivas.', 19.99, 2),
('Sofá Moderno', 'Sofá cómodo y elegante para sala de estar.', 499.99, 3),
('Bicicleta de Montaña', 'Bicicleta resistente para senderismo y montaña.', 349.50, 4),
('Novela Best Seller', 'Una novela que ha encabezado las listas de ventas.', 14.95, 5),
('Set de Construcción', 'Juguete educativo de construcción para niños.', 29.99, 6),
('Aceite de Oliva Extra Virgen', 'Aceite de oliva de alta calidad.', 9.99, 7),
('Llave de Rueda', 'Herramienta imprescindible para mantenimiento automotriz.', 24.50, 8),
('Guitarra Acústica', 'Instrumento musical para principiantes y profesionales.', 199.99, 9),
('Crema Facial', 'Producto para el cuidado e hidratación de la piel.', 15.75, 10);
