CREATE TABLE Pacientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dni VARCHAR(10) NOT NULL UNIQUE,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    sexo ENUM('Masculino', 'Femenino') NOT NULL,
    telefono VARCHAR(25),
    email VARCHAR(100) UNIQUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_apellido (apellido)
);

CREATE TABLE Habitaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_habitacion VARCHAR(10) NOT NULL UNIQUE,
    ala VARCHAR(20) NOT NULL,
    capacidad INT NOT NULL CHECK (capacidad IN (1, 2))
);

CREATE TABLE Camas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_habitacion INT NOT NULL,
    codigo_cama VARCHAR(10) NOT NULL UNIQUE,
    estado ENUM('Libre', 'Ocupada', 'Mantenimiento') NOT NULL DEFAULT 'Libre',
    higienizada BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (id_habitacion) REFERENCES Habitaciones(id)
);

CREATE TABLE Usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('Admin', 'Admision', 'Enfermeria', 'Medico') NOT NULL,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE Internaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente INT NOT NULL,
    id_cama INT NOT NULL,
    fecha_ingreso DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_alta DATETIME NULL,
    motivo_internacion TEXT,
    diagnostico_principal VARCHAR(255),
    estado ENUM('Activa', 'Finalizada', 'Cancelada') NOT NULL DEFAULT 'Activa',
    FOREIGN KEY (id_paciente) REFERENCES Pacientes(id),
    FOREIGN KEY (id_cama) REFERENCES Camas(id)
);

CREATE TABLE EvaluacionesEnfermeria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_internacion INT NOT NULL,
    id_usuario_enfermero INT NOT NULL,
    fecha_evaluacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    presion_arterial VARCHAR(15),
    frecuencia_cardiaca INT,
    frecuencia_respiratoria INT,
    temperatura DECIMAL(4, 2),
    antecedentes_medicos TEXT,
    alergias TEXT,
    medicamentos_actuales TEXT,
    observaciones_generales TEXT,
    plan_cuidados TEXT,
    FOREIGN KEY (id_internacion) REFERENCES Internaciones(id),
    FOREIGN KEY (id_usuario_enfermero) REFERENCES Usuarios(id)
);

CREATE TABLE EvaluacionesMedicas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_internacion INT NOT NULL,
    id_usuario_medico INT NOT NULL,
    fecha_evaluacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    diagnostico TEXT,
    tratamiento_sugerido TEXT,
    notas_medicas TEXT,
    FOREIGN KEY (id_internacion) REFERENCES Internaciones(id),
    FOREIGN KEY (id_usuario_medico) REFERENCES Usuarios(id)
);

INSERT INTO Usuarios (username, password_hash, rol) VALUES
('admin', '$2b$10$44V3/lQ9vcLHn7ZJ0IFHber/ZcrjZLg/hMQYvWR4UUZp41zQoANJu', 'Admin'),
('admision', '$2b$10$44V3/lQ9vcLHn7ZJ0IFHber/ZcrjZLg/hMQYvWR4UUZp41zQoANJu', 'Admision'),
('enfermera', '$2b$10$44V3/lQ9vcLHn7ZJ0IFHber/ZcrjZLg/hMQYvWR4UUZp41zQoANJu', 'Enfermeria'),
('medico', '$2b$10$44V3/lQ9vcLHn7ZJ0IFHber/ZcrjZLg/hMQYvWR4UUZp41zQoANJu', 'Medico');

INSERT INTO Habitaciones (numero_habitacion, ala, capacidad) VALUES
('101', 'Norte', 2), ('102', 'Norte', 1), ('201', 'Sur', 2);

INSERT INTO Camas (id_habitacion, codigo_cama) VALUES
(1, '101-A'), (1, '101-B'), (2, '102-A'), (3, '201-A'), (3, '201-B');

INSERT INTO Pacientes (dni, nombre, apellido, fecha_nacimiento, sexo) VALUES
('30123456', 'Carlos', 'Gomez', '1982-05-10', 'Masculino'),
('35789012', 'Laura', 'Fernandez', '1990-11-22', 'Femenino'),
('28456789', 'Pedro', 'Rodriguez', '1980-01-30', 'Masculino');