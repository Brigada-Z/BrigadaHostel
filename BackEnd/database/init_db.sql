-- ============================================================================
-- SCRIPT DE CREACIÓN Y CARGA DE DATOS INICIALES: BRIGADA HOSTEL
-- Base de Datos Relacional: MySQL / MariaDB (UTF-8)
-- Diseñado a partir del Modelo Relacional (MR) y el DER del Proyecto
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `brigada_hostel_db`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `brigada_hostel_db`;

SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
-- 1. Tabla: usuarios
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `reserva_servicios`;
DROP TABLE IF EXISTS `logs_auditoria`;
DROP TABLE IF EXISTS `notificaciones`;
DROP TABLE IF EXISTS `reservas`;
DROP TABLE IF EXISTS `servicios`;
DROP TABLE IF EXISTS `habitaciones`;
DROP TABLE IF EXISTS `integrantes`;
DROP TABLE IF EXISTS `usuarios`;

CREATE TABLE `usuarios` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(60) NOT NULL,
    `apellido` VARCHAR(60) NOT NULL DEFAULT '',
    `email` VARCHAR(120) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `rol` VARCHAR(20) NOT NULL DEFAULT 'usuario', -- 'admin' o 'usuario'
    `estado_cuenta` VARCHAR(20) NOT NULL DEFAULT 'Activa', -- 'Activa', 'Bloqueada'
    `intentos_fallidos` INT NOT NULL DEFAULT 0,
    `fecha_bloqueo` DATETIME NULL,
    `fecha_creacion` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. Tabla: habitaciones
-- ----------------------------------------------------------------------------
CREATE TABLE `habitaciones` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `numero` VARCHAR(10) NULL UNIQUE,
    `tipo` VARCHAR(50) NOT NULL,
    `precio_noche` DECIMAL(10,2) NOT NULL,
    `capacidad` INT NOT NULL,
    `disponible` TINYINT(1) NOT NULL DEFAULT 1,
    `estado` VARCHAR(20) NOT NULL DEFAULT 'Disponible',
    `descripcion` TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 3. Tabla: servicios (catálogo de servicios adicionales)
-- ----------------------------------------------------------------------------
CREATE TABLE `servicios` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(255) NULL,
    `costo` DECIMAL(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 4. Tabla: reservas
-- ----------------------------------------------------------------------------
CREATE TABLE `reservas` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `numero_reserva` VARCHAR(30) NOT NULL UNIQUE,
    `usuario_id` INT NULL,
    `habitacion_id` INT NULL,
    `nombre` VARCHAR(120) NOT NULL,
    `email` VARCHAR(120) NOT NULL,
    `dni` VARCHAR(20) NOT NULL DEFAULT '',
    `telefono` VARCHAR(30) NOT NULL DEFAULT '',
    `tipo_habitacion` VARCHAR(50) NOT NULL,
    `fecha_ingreso` DATE NOT NULL,
    `fecha_salida` DATE NOT NULL,
    `huespedes` INT NOT NULL DEFAULT 1,
    `precio_total` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    `servicios_extra` JSON NULL,
    `estado` VARCHAR(20) NOT NULL DEFAULT 'pendiente', -- 'pendiente', 'confirmada', 'cancelada'
    `notas` TEXT NULL,
    `fecha_creacion` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_reservas_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_reservas_habitacion` FOREIGN KEY (`habitacion_id`) REFERENCES `habitaciones` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 5. Tabla intermedia: reserva_servicios
-- ----------------------------------------------------------------------------
CREATE TABLE `reserva_servicios` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `reserva_id` INT NOT NULL,
    `servicio_id` INT NOT NULL,
    `cantidad` INT NOT NULL DEFAULT 1,
    `subtotal` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    CONSTRAINT `fk_res_serv_reserva` FOREIGN KEY (`reserva_id`) REFERENCES `reservas` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_res_serv_servicio` FOREIGN KEY (`servicio_id`) REFERENCES `servicios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 6. Tabla: logs_auditoria
-- ----------------------------------------------------------------------------
CREATE TABLE `logs_auditoria` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `usuario_id` INT NULL,
    `reserva_id` INT NULL,
    `accion` VARCHAR(60) NOT NULL,
    `fecha_hora` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `detalle` TEXT NULL,
    CONSTRAINT `fk_logs_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_logs_reserva` FOREIGN KEY (`reserva_id`) REFERENCES `reservas` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 7. Tabla: notificaciones
-- ----------------------------------------------------------------------------
CREATE TABLE `notificaciones` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `usuario_id` INT NULL,
    `reserva_id` INT NULL,
    `tipo` VARCHAR(50) NOT NULL,
    `fecha_envio` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `estado_envio` VARCHAR(20) NOT NULL DEFAULT 'Enviado',
    CONSTRAINT `fk_notif_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_notif_reserva` FOREIGN KEY (`reserva_id`) REFERENCES `reservas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 8. Tabla: integrantes (Información del equipo docente/cátedra)
-- ----------------------------------------------------------------------------
CREATE TABLE `integrantes` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nombre` VARCHAR(60) NOT NULL,
    `apellido` VARCHAR(60) NOT NULL,
    `responsabilidad` VARCHAR(120) NOT NULL DEFAULT '',
    `dni` VARCHAR(20) NOT NULL DEFAULT '',
    `github` VARCHAR(150) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- CARGA DE DATOS INICIALES (SEED DATA)
-- ============================================================================

-- Usuarios iniciales
INSERT INTO `usuarios` (`id`, `nombre`, `apellido`, `email`, `password`, `rol`, `estado_cuenta`, `intentos_fallidos`) VALUES
(1, 'Administrador Brigada', 'Hostel', 'admin@brigadahostel.com', 'admin123', 'admin', 'Activa', 0),
(2, 'Usuario Demo', 'Huésped', 'huesped@brigada.com', 'user123', 'usuario', 'Activa', 0),
(3, 'María', 'García', 'maria.garcia@email.com', 'maria123', 'usuario', 'Activa', 0),
(4, 'Carlos', 'Ruiz', 'carlos.ruiz@email.com', 'carlos123', 'usuario', 'Activa', 0);

-- Catálogo de Habitaciones
INSERT INTO `habitaciones` (`id`, `numero`, `tipo`, `precio_noche`, `capacidad`, `disponible`, `estado`, `descripcion`) VALUES
(1, '101', 'Individual', 30000.00, 1, 1, 'Disponible', 'Habitación individual privada con escritorio, WiFi de alta velocidad y baño compartido.'),
(2, '102', 'Doble', 45000.00, 2, 1, 'Disponible', 'Espacio confortable para 2 personas con cama matrimonial, aire acondicionado y baño privado.'),
(3, '201', 'Suite', 85000.00, 4, 1, 'Disponible', 'Suite superior con vista panorámica, cama king size, sala de estar y minibar.'),
(4, '301', 'Compartida (Dorm)', 18000.00, 6, 1, 'Disponible', 'Cama en dormitorio compartido con cortina de privacidad, luz de lectura y locker individual.');

-- Catálogo de Servicios
INSERT INTO `servicios` (`id`, `nombre`, `descripcion`, `costo`) VALUES
(1, 'Desayuno Buffet Diario', 'Desayuno continental completo con frutas, panes y café de especialidad.', 4500.00),
(2, 'Traslado Aeropuerto / Terminal', 'Servicio de transfer privado coordinado según horarios de vuelo o micro.', 15000.00),
(3, 'Circuito Spa & Relax', 'Acceso al sauna seco y sesión de masajes relajantes de 45 minutos.', 22000.00),
(4, 'Lavandería Express', 'Lavado, secado y doblado de indumentaria en el mismo día.', 6000.00);

-- Reservas registradas
INSERT INTO `reservas` (`id`, `numero_reserva`, `usuario_id`, `habitacion_id`, `nombre`, `email`, `dni`, `telefono`, `tipo_habitacion`, `fecha_ingreso`, `fecha_salida`, `huespedes`, `precio_total`, `servicios_extra`, `estado`, `notas`, `fecha_creacion`) VALUES
(1, 'BH-1', 2, 2, 'Juan Pérez', 'juan.perez@email.com', '38.999.111', '+54 9 11 555-1234', 'Doble', '2026-10-10', '2026-10-14', 2, 180000.00, '["Desayuno Buffet Diario"]', 'confirmada', 'Llega después de las 20hs.', '2026-10-01 10:00:00'),
(2, 'BH-2', 3, 1, 'María García', 'maria.garcia@email.com', '35.123.456', '+54 9 11 876-5432', 'Individual', '2026-09-22', '2026-09-25', 1, 90000.00, '["Desayuno Buffet Diario", "Traslado Aeropuerto / Terminal"]', 'confirmada', 'Requiere factura A.', '2026-09-12 14:30:00'),
(3, 'BH-3', 4, 3, 'Carlos Ruiz', 'carlos.ruiz@email.com', '12.888.444', '+54 9 261 456-7890', 'Suite', '2026-09-15', '2026-09-18', 3, 255000.00, '[]', 'cancelada', 'Canceló por motivos de viaje imprevistos.', '2026-09-08 09:15:00'),
(4, 'BH-4', 2, 4, 'Ana Laura Gómez', 'ana.gomez@email.com', '40.222.333', '+54 9 351 987-6543', 'Compartida (Dorm)', '2026-10-12', '2026-10-15', 1, 54000.00, '["Desayuno Buffet Diario"]', 'pendiente', 'Cama baja preferente.', '2026-10-05 18:20:00');

-- Integrantes de la Brigada Z (Equipo del Proyecto)
INSERT INTO `integrantes` (`id`, `nombre`, `apellido`, `responsabilidad`, `dni`, `github`) VALUES
(1, 'Giuliano', 'BATISTELA', 'Modelado DER y Backend', '42561123', 'https://github.com/gbatistela'),
(2, 'Alejo Nicolas', 'CAMOLOTTO', 'Arquitectura y Documentación', '44606044', 'https://github.com/Camolotto'),
(3, 'Mauricio Emiliano', 'FERREYRA', 'Frontend Angular y Vistas', '38158836', 'https://github.com/EmiTeck'),
(4, 'Agustin Nicolas', 'GALLARDO', 'Backend Django y Base de Datos', '41600077', 'https://github.com/agstudio98'),
(5, 'Jorge Francisco', 'QUEVEDO', 'Control de Calidad y Tests', '31218408', 'https://github.com/JQuevedoJorge'),
(6, 'Oscar Alberto', 'QUEVEDO', 'Diseño UX/UI y Maquetado', '34839723', 'https://github.com/Oscar-Quevedo');

-- Log de auditoría inicial
INSERT INTO `logs_auditoria` (`usuario_id`, `reserva_id`, `accion`, `detalle`) VALUES
(1, 2, 'Confirmar Reserva', 'La reserva BH-2 fue confirmada por el administrador.'),
(1, 3, 'Cancelar Reserva', 'La reserva BH-3 fue cancelada por pedido del cliente.');
