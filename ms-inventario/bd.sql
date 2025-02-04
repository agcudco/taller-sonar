-- Crear la tabla inventory
CREATE TABLE IF NOT EXISTS inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto VARCHAR(100) NOT NULL,
    cantidad INT NOT NULL,
    fecha_ingreso DATETIME NOT NULL,
    fecha_descargo DATETIME DEFAULT NULL,
    usuario_responsable VARCHAR(100) NOT NULL
);


-- Registro 1: Ingreso sin descargo
INSERT INTO inventory (producto, cantidad, fecha_ingreso, fecha_descargo, usuario_responsable)
VALUES ('Laptop HP', 5, '2023-05-01 09:00:00', NULL, 'admin');

-- Registro 2: Ingreso con descargo
INSERT INTO inventory (producto, cantidad, fecha_ingreso, fecha_descargo, usuario_responsable)
VALUES ('Monitor Dell', 10, '2023-05-02 10:30:00', '2023-05-10 15:00:00', 'jdoe');

-- Registro 3
INSERT INTO inventory (producto, cantidad, fecha_ingreso, fecha_descargo, usuario_responsable)
VALUES ('Teclado Mecánico', 15, '2023-05-03 08:45:00', NULL, 'alice');

-- Registro 4
INSERT INTO inventory (producto, cantidad, fecha_ingreso, fecha_descargo, usuario_responsable)
VALUES ('Mouse Inalámbrico', 20, '2023-05-04 11:15:00', '2023-05-12 14:30:00', 'bob');

-- Registro 5
INSERT INTO inventory (producto, cantidad, fecha_ingreso, fecha_descargo, usuario_responsable)
VALUES ('Impresora Multifunción', 3, '2023-05-05 13:20:00', NULL, 'carol');

-- Registro 6
INSERT INTO inventory (producto, cantidad, fecha_ingreso, fecha_descargo, usuario_responsable)
VALUES ('Router WiFi', 7, '2023-05-06 09:50:00', '2023-05-14 16:00:00', 'david');

-- Registro 7
INSERT INTO inventory (producto, cantidad, fecha_ingreso, fecha_descargo, usuario_responsable)
VALUES ('Disco Duro Externo', 12, '2023-05-07 10:05:00', NULL, 'eve');

-- Registro 8
INSERT INTO inventory (producto, cantidad, fecha_ingreso, fecha_descargo, usuario_responsable)
VALUES ('Memoria RAM 8GB', 25, '2023-05-08 14:10:00', '2023-05-15 17:30:00', 'frank');

-- Registro 9
INSERT INTO inventory (producto, cantidad, fecha_ingreso, fecha_descargo, usuario_responsable)
VALUES ('Tarjeta Gráfica', 4, '2023-05-09 12:00:00', NULL, 'grace');

-- Registro 10
INSERT INTO inventory (producto, cantidad, fecha_ingreso, fecha_descargo, usuario_responsable)
VALUES ('Sistema de Sonido', 6, '2023-05-10 11:30:00', '2023-05-18 13:45:00', 'heidi');
