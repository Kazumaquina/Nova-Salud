CREATE DATABASE IF NOT EXISTS ventas;

USE ventas;

DROP TABLE IF EXISTS detalle_venta;
DROP TABLE IF EXISTS ventas;
DROP TABLE IF EXISTS productos_farmacia;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE `productos_farmacia` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(100) NOT NULL,
  `marca` VARCHAR(100) NOT NULL,
  `stock` INT NOT NULL,
  `precio` DECIMAL(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `usuarios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `ventas` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(100) NOT NULL,
  `fecha` DATETIME NOT NULL,
  `total` DECIMAL(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `detalle_venta` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `venta_id` INT NOT NULL,
  `producto_id` INT NOT NULL,
  `cantidad` INT NOT NULL,
  `precio_unitario` DECIMAL(10,2) NOT NULL,
  `subtotal` DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (`venta_id`) REFERENCES `ventas` (`id`),
  FOREIGN KEY (`producto_id`) REFERENCES `productos_farmacia` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `productos_farmacia` (`nombre`, `marca`, `stock`, `precio`) VALUES
('Paracetamol 500mg', 'Genfar', 100, 1.50),
('Ibuprofeno 400mg', 'MK', 80, 2.00),
('Amoxicilina 500mg', 'Sandoz', 60, 5.00),
('Jarabe para la tos', 'Vick', 40, 4.25),
('Vitamina C 1000mg', 'Redoxon', 75, 3.90),
('Antigripal', 'Dolex', 90, 3.30),
('Omeprazol 20mg', 'Genfar', 120, 2.80),
('Suero Oral', 'Pedialyte', 50, 1.80),
('Algodón 100g', 'Familia', 200, 1.00),
('Alcohol 70%', 'Tecnoquímicas', 150, 1.25),
('Aspirina 100mg', 'Bayer', 70, 2.10),
('Loratadina 10mg', 'MK', 65, 1.90),
('Gotas para los ojos', 'Visine', 30, 6.00),
('Crema antibiótica', 'Neosporin', 20, 4.75),
('Termómetro digital', 'Omron', 25, 9.50);

INSERT INTO `usuarios` (`username`, `password`) VALUES
('carlos_fernandez', 'clave123'),
('juan_perez', 'pass456'),
('luis_gomez', 'qwerty789'),
('miguel_rojas', 'admin2024'),
('andres_morales', 'user123'),
('daniel_torres', 'contraseña1'),
('jose_ramirez', 'securepass'),
('david_ortiz', 'abc12345'),
('alejandro_mendez', 'demo2024'),
('sebastian_soto', 'clave456'),
('ana_lopez', 'pass123'),
('maria_garcia', 'farmacia123'),
('paula_martinez', 'temp987'),
('laura_navarro', 'clavefarm'),
('valentina_ruiz', '12345678'),
('camila_castro', 'miclave123'),
('sofia_vargas', 'passfarm'),
('isabella_molina', 'claveomega'),
('juliana_salazar', 'medico321'),
('fernanda_reyes', 'usuario2025');

DROP PROCEDURE IF EXISTS getStock;
delimiter //

CREATE PROCEDURE getStock (IN id_product INT)
BEGIN
	SELECT stock FROM productos_farmacia
    WHERE id = id_product;
END//

delimiter ;