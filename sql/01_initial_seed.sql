-- 01_initial_seed.sql
-- Script de poblado inicial para el Sistema de Pasantías
-- Enfoque: Idempotencia y Calidad de Datos

-- 1. LIMPIEZA DE DATOS (Mantiene el orden inverso de las FK)
TRUNCATE TABLE 
    "bitacora",
    "habilidad",
    "hoja_vida",
    "informe_final",
    "actividad",
    "comentario",
    "inscripcion",
    "pasantia",
    "gerente",
    "estudiante",
    "tutor",
    "super_usuario",
    "jefe_pasantes",
    "usuario",
    "empresa"
CASCADE;

-- 2. REINICIO DE SECUENCIAS
ALTER SEQUENCE usuario_id_usuario_seq RESTART WITH 1;
ALTER SEQUENCE empresa_id_empresa_seq RESTART WITH 1;
ALTER SEQUENCE pasantia_id_pasantia_seq RESTART WITH 1;
ALTER SEQUENCE inscripcion_id_inscripcion_seq RESTART WITH 1;
ALTER SEQUENCE comentario_id_comentario_seq RESTART WITH 1;
ALTER SEQUENCE actividad_id_actividad_seq RESTART WITH 1;
ALTER SEQUENCE informe_final_id_informe_seq RESTART WITH 1;
ALTER SEQUENCE hoja_vida_id_hoja_vida_seq RESTART WITH 1;
ALTER SEQUENCE habilidad_id_habilidad_seq RESTART WITH 1;
ALTER SEQUENCE bitacora_id_bitacora_seq RESTART WITH 1;

-- 3. INSERTAR EMPRESAS (20 registros)
INSERT INTO "empresa" ("nombre", "rubro", "direccion", "telefono") VALUES
('TechNova Solutions', 'Software', 'Av. Bush esq. 2do Anillo', '70010020'),
('Banco Central S.A.', 'Finanzas', 'Calle Libertad #150', '33405060'),
('AgroIndustry Group', 'Agropecuaria', 'Carretera al Norte km 10', '71020304'),
('HealthCare Plus', 'Salud', 'Barrio Equipetrol Calle 8', '3521234'),
('Constructora El Fuerte', 'Construcción', 'Av. Santos Dumont', '70050607'),
('Logística Flash', 'Transporte', 'Parque Industrial PI-24', '75060708'),
('Educate Online', 'Educación', 'Online / Remoto', '80010203'),
('Mining Corp Bolivia', 'Minería', 'Potosí - Calle Central', '26224567'),
('EcoEnergía S.R.L.', 'Energía', 'Av. 6 de Agosto', '3456789'),
('Retail Market', 'Comercio', 'Av. Cristo Redentor', '78945612'),
('Telecom Global', 'Telecomunicaciones', 'La Paz - Zona Sur', '2123456'),
('SoftServe S.A.', 'Consultoría IT', 'Av. San Martín', '72134567'),
('Innova Inversiones', 'Inversiones', 'Edificio Torres Cainco', '3310200'),
('FastFood Nation', 'Gastronomía', 'Av. Monseñor Rivero', '3445566'),
('Automotriz del Sur', 'Automotriz', 'Av. Grigotá', '3556677'),
('Textiles Santa Cruz', 'Industria', 'Calle Pampa de la Isla', '7112233'),
('Seguridad Total', 'Seguridad', 'Av. Irala', '3334455'),
('Gourmet Catering', 'Servicios', 'Calle Pari #210', '7009988'),
('Importadora Oriente', 'Comercio', 'Zona Los Pozos', '3667788'),
('Hotel Royal Plaza', 'Turismo', 'Av. Ejercito', '3112233');

-- 4. INSERTAR USUARIOS (Base para perfiles)
-- Hash para '12345678': $2b$10$cfo/ZcXoNjkh1SptdTFue.ak6lKN9nAQQjkd4MwOxGxaIUZjKmqIy
-- Super Usuarios (ID 1-2)
INSERT INTO "usuario" ("nombre", "apellido", "email", "contrasena", "tipo_usuario", "nivel_acceso") VALUES
('Admin', 'Principal', 'admin@pasantias.com', '$2b$10$cfo/ZcXoNjkh1SptdTFue.ak6lKN9nAQQjkd4MwOxGxaIUZjKmqIy', 'super_usuario', 0),
('Diego', 'Gutierrez', 'diego@super.com', '$2b$10$cfo/ZcXoNjkh1SptdTFue.ak6lKN9nAQQjkd4MwOxGxaIUZjKmqIy', 'super_usuario', 0);

-- Gerentes (ID 3-7)
INSERT INTO "usuario" ("nombre", "apellido", "email", "contrasena", "tipo_usuario", "nivel_acceso") VALUES
('Andres', 'Flores', 'andres@technova.com', '$2b$10$cfo/ZcXoNjkh1SptdTFue.ak6lKN9nAQQjkd4MwOxGxaIUZjKmqIy', 'gerente', 0),
('Maria', 'Lopez', 'maria@banco.com', '$2b$10$cfo/ZcXoNjkh1SptdTFue.ak6lKN9nAQQjkd4MwOxGxaIUZjKmqIy', 'gerente', 0),
('Carlos', 'Sosa', 'carlos@agro.com', '$2b$10$cfo/ZcXoNjkh1SptdTFue.ak6lKN9nAQQjkd4MwOxGxaIUZjKmqIy', 'gerente', 0),
('Ana', 'Martinez', 'ana@healthcare.com', '$2b$10$cfo/ZcXoNjkh1SptdTFue.ak6lKN9nAQQjkd4MwOxGxaIUZjKmqIy', 'gerente', 0),
('Luis', 'Vargas', 'luis@fastfood.com', '$2b$10$cfo/ZcXoNjkh1SptdTFue.ak6lKN9nAQQjkd4MwOxGxaIUZjKmqIy', 'gerente', 0);

-- Jefes de Pasantes (ID 8-12)
INSERT INTO "usuario" ("nombre", "apellido", "email", "contrasena", "tipo_usuario", "nivel_acceso") VALUES
('Roberto', 'Perez', 'roberto.jefe@technova.com', '$2b$10$cfo/ZcXoNjkh1SptdTFue.ak6lKN9nAQQjkd4MwOxGxaIUZjKmqIy', 'jefe_pasantes', 1),
('Claudia', 'Rios', 'claudia.jefe@banco.com', '$2b$10$cfo/ZcXoNjkh1SptdTFue.ak6lKN9nAQQjkd4MwOxGxaIUZjKmqIy', 'jefe_pasantes', 1),
('Marco', 'Daza', 'marco.jefe@telecom.com', '$2b$10$cfo/ZcXoNjkh1SptdTFue.ak6lKN9nAQQjkd4MwOxGxaIUZjKmqIy', 'jefe_pasantes', 1),
('Elena', 'Torres', 'elena.jefe@retail.com', '$2b$10$cfo/ZcXoNjkh1SptdTFue.ak6lKN9nAQQjkd4MwOxGxaIUZjKmqIy', 'jefe_pasantes', 1),
('Jorge', 'Suarez', 'jorge.jefe@agro.com', '$2b$10$cfo/ZcXoNjkh1SptdTFue.ak6lKN9nAQQjkd4MwOxGxaIUZjKmqIy', 'jefe_pasantes', 1);

-- Tutores (ID 13-17)
INSERT INTO "usuario" ("nombre", "apellido", "email", "contrasena", "tipo_usuario", "nivel_acceso") VALUES
('Ing. Mario', 'Campos', 'mario.tutor@uagrm.edu', '$2b$10$cfo/ZcXoNjkh1SptdTFue.ak6lKN9nAQQjkd4MwOxGxaIUZjKmqIy', 'tutor', 1),
('Dra. Cecilia', 'Luz', 'cecilia.tutor@uagrm.edu', '$2b$10$cfo/ZcXoNjkh1SptdTFue.ak6lKN9nAQQjkd4MwOxGxaIUZjKmqIy', 'tutor', 1),
('Msc. Pablo', 'Mendez', 'pablo.tutor@uagrm.edu', '$2b$10$cfo/ZcXoNjkh1SptdTFue.ak6lKN9nAQQjkd4MwOxGxaIUZjKmqIy', 'tutor', 1),
('Ing. Sergio', 'Rojas', 'sergio.tutor@upds.edu', '$2b$10$cfo/ZcXoNjkh1SptdTFue.ak6lKN9nAQQjkd4MwOxGxaIUZjKmqIy', 'tutor', 1),
('Lic. Karen', 'Vaca', 'karen.tutor@uagrm.edu', '$2b$10$cfo/ZcXoNjkh1SptdTFue.ak6lKN9nAQQjkd4MwOxGxaIUZjKmqIy', 'tutor', 1);

-- Estudiantes (ID 18-37, 20 registros)
INSERT INTO "usuario" ("nombre", "apellido", "email", "contrasena", "tipo_usuario", "nivel_acceso") VALUES
('Juan', 'Quispe', 'juan.q@uagrm.edu', '$2b$10$cfo/ZcXoNjkh1SptdTFue.ak6lKN9nAQQjkd4MwOxGxaIUZjKmqIy', 'estudiante', 1),
('Sonia', 'Gomez', 'sonia.g@uagrm.edu', '$2b$10$cfo/ZcXoNjkh1SptdTFue.ak6lKN9nAQQjkd4MwOxGxaIUZjKmqIy', 'estudiante', 1),
('Pedro', 'Alvaro', 'pedro.a@uagrm.edu', '$2b$10$cfo/ZcXoNjkh1SptdTFue.ak6lKN9nAQQjkd4MwOxGxaIUZjKmqIy', 'estudiante', 1),
('Monica', 'Valda', 'monica.v@uagrm.edu', '$2b$10$cfo/ZcXoNjkh1SptdTFue.ak6lKN9nAQQjkd4MwOxGxaIUZjKmqIy', 'estudiante', 1),
('Felix', 'Mejia', 'felix.m@uagrm.edu', '$2b$10$cfo/ZcXoNjkh1SptdTFue.ak6lKN9nAQQjkd4MwOxGxaIUZjKmqIy', 'estudiante', 1),
('Rosa', 'Mamani', 'rosa.m@uagrm.edu', '$2b$10$cfo/ZcXoNjkh1SptdTFue.ak6lKN9nAQQjkd4MwOxGxaIUZjKmqIy', 'estudiante', 1),
('Victor', 'Hugo', 'victor.h@uagrm.edu', '$2b$10$cfo/ZcXoNjkh1SptdTFue.ak6lKN9nAQQjkd4MwOxGxaIUZjKmqIy', 'estudiante', 1),
('Alicia', 'Paz', 'alicia.p@uagrm.edu', '$2b$10$cfo/ZcXoNjkh1SptdTFue.ak6lKN9nAQQjkd4MwOxGxaIUZjKmqIy', 'estudiante', 1),
('Daniel', 'Soto', 'daniel.s@uagrm.edu', '$2b$10$cfo/ZcXoNjkh1SptdTFue.ak6lKN9nAQQjkd4MwOxGxaIUZjKmqIy', 'estudiante', 1),
('Lorena', 'Cruz', 'lorena.c@uagrm.edu', '$2b$10$cfo/ZcXoNjkh1SptdTFue.ak6lKN9nAQQjkd4MwOxGxaIUZjKmqIy', 'estudiante', 1),
('Raul', 'Vega', 'raul.v@uagrm.edu', '$2b$10$cfo/ZcXoNjkh1SptdTFue.ak6lKN9nAQQjkd4MwOxGxaIUZjKmqIy', 'estudiante', 1),
('Beatriz', 'Luna', 'beatriz.l@uagrm.edu', '$2b$10$cfo/ZcXoNjkh1SptdTFue.ak6lKN9nAQQjkd4MwOxGxaIUZjKmqIy', 'estudiante', 1),
('Hugo', 'Chavez', 'hugo.ch@uagrm.edu', '$2b$10$cfo/ZcXoNjkh1SptdTFue.ak6lKN9nAQQjkd4MwOxGxaIUZjKmqIy', 'estudiante', 1),
('Tania', 'Cisneros', 'tania.c@uagrm.edu', '$2b$10$cfo/ZcXoNjkh1SptdTFue.ak6lKN9nAQQjkd4MwOxGxaIUZjKmqIy', 'estudiante', 1),
('Oscar', 'Ramos', 'oscar.r@uagrm.edu', '$2b$10$cfo/ZcXoNjkh1SptdTFue.ak6lKN9nAQQjkd4MwOxGxaIUZjKmqIy', 'estudiante', 1),
('Jimena', 'Rojas', 'jimena.r@uagrm.edu', '$2b$10$cfo/ZcXoNjkh1SptdTFue.ak6lKN9nAQQjkd4MwOxGxaIUZjKmqIy', 'estudiante', 1),
('Samuel', 'Zarza', 'samuel.z@uagrm.edu', '$2b$10$cfo/ZcXoNjkh1SptdTFue.ak6lKN9nAQQjkd4MwOxGxaIUZjKmqIy', 'estudiante', 1),
('Patricia', 'Prada', 'patricia.p@uagrm.edu', '$2b$10$cfo/ZcXoNjkh1SptdTFue.ak6lKN9nAQQjkd4MwOxGxaIUZjKmqIy', 'estudiante', 1),
('Edgar', 'Lopez', 'edgar.l@uagrm.edu', '$2b$10$cfo/ZcXoNjkh1SptdTFue.ak6lKN9nAQQjkd4MwOxGxaIUZjKmqIy', 'estudiante', 1),
('Sara', 'Suarez', 'sara.s@uagrm.edu', '$2b$10$cfo/ZcXoNjkh1SptdTFue.ak6lKN9nAQQjkd4MwOxGxaIUZjKmqIy', 'estudiante', 1);

-- 5. INSERTAR PERFILES ESPECÍFICOS
-- Super Usuarios
INSERT INTO "super_usuario" ("id_superusuario") VALUES (1), (2);

-- Gerentes
INSERT INTO "gerente" ("id_gerente", "cargo", "carrera", "id_empresa") VALUES
(3, 'Director de Tecnología', 'Ingeniería de Sistemas', 1),
(4, 'Gerente Regional', 'Administración de Empresas', 2),
(5, 'Sub-Gerente de Operaciones', 'Ingeniería Industrial', 3),
(6, 'Directora Médica', 'Medicina / Gestión Hospitalaria', 4),
(7, 'Gerente Comercial', 'Marketing', 14);

-- Jefes de Pasantes
INSERT INTO "jefe_pasantes" ("id_jefe", "departamento", "id_empresa") VALUES
(8, 'Desarrollo de Software', 1),
(9, 'Auditoría Interna', 2),
(10, 'Infraestructura y Redes', 11),
(11, 'Ventas Corporativas', 10),
(12, 'Control de Calidad', 3);

-- Tutores
INSERT INTO "tutor" ("id_tutor", "especialidad", "institucion") VALUES
(13, 'Arquitectura de Software', 'UAGRM'),
(14, 'Inteligencia de Negocios', 'UAGRM'),
(15, 'Gestión de Proyectos IT', 'UAGRM'),
(16, 'Redes y Telecomunicaciones', 'UPDS'),
(17, 'Seguridad de la Información', 'UAGRM');

-- Estudiantes
INSERT INTO "estudiante" ("id_estudiante", "carrera", "semestre", "registro_universitario") VALUES
(18, 'Ing. Informática', 8, '218001'), (19, 'Ing. en Sistemas', 9, '218002'),
(20, 'Ing. Informática', 7, '218003'), (21, 'Ing. en Sistemas', 8, '218004'),
(22, 'Ing. Informática', 9, '218005'), (23, 'Ing. Redes', 8, '218006'),
(24, 'Ing. Informática', 7, '218007'), (25, 'Ing. en Sistemas', 9, '218008'),
(26, 'Ing. en Sistemas', 8, '218009'), (27, 'Ing. Informática', 7, '218010'),
(28, 'Ing. Redes', 9, '218011'), (29, 'Ing. Informática', 8, '218012'),
(30, 'Ing. en Sistemas', 7, '218013'), (31, 'Ing. Informática', 9, '218014'),
(32, 'Ing. Redes', 8, '218015'), (33, 'Ing. Informática', 7, '218016'),
(34, 'Ing. en Sistemas', 9, '218017'), (35, 'Ing. Informática', 8, '218018'),
(36, 'Ing. en Sistemas', 7, '218019'), (37, 'Ing. Informática', 9, '218020');

-- 6. INSERTAR PASANTÍAS (Ofertas)
INSERT INTO "pasantia" ("titulo", "descripcion", "fecha_inicio", "fecha_fin", "estado", "id_empresa") VALUES
('Desarrollador Fullstack Junior', 'Apoyo en el desarrollo de módulos ERP con NestJS y React.', '2024-05-01', '2024-08-01', 'en_curso', 1),
('Analista de Datos Bancarios', 'Limpieza y análisis de datos financieros en SQL Server.', '2024-06-01', '2024-09-01', 'pendiente', 2),
('Soporte de Redes Industriales', 'Configuración de switches y routers en planta.', '2024-05-15', '2024-08-15', 'en_curso', 11),
('Asistente de Marketing Digital', 'Gestión de redes sociales e informes de métricas.', '2024-07-01', '2024-10-01', 'pendiente', 14),
('Control de Inventarios Agro', 'Manejo de stock y kardex de insumos.', '2024-05-01', '2024-08-01', 'en_curso', 3);

-- 7. INSERTAR INSCRIPCIONES
INSERT INTO "inscripcion" ("fecha_inscripcion", "fecha_inicio_periodo", "fecha_fin_periodo", "estado", "id_estudiante", "id_pasantia", "id_tutor", "id_jefe") VALUES
('2024-04-10', '2024-05-01', '2024-08-01', 'aprobada', 18, 1, 13, 8),
('2024-04-15', '2024-06-01', '2024-09-01', 'pendiente', 19, 2, NULL, 9),
('2024-04-12', '2024-05-15', '2024-08-15', 'aprobada', 20, 3, 16, 10),
('2024-04-20', '2024-05-01', '2024-08-01', 'aprobada', 21, 5, 14, 12);

-- 8. INSERTAR SEGUIMIENTO
-- Hoja de Vida
INSERT INTO "hoja_vida" ("resumen", "fecha_actualizacion", "id_estudiante") VALUES
('Estudiante de 8vo semestre con interés en desarrollo web.', '2024-04-01', 18),
('Interesada en minería de datos y estadística.', '2024-04-05', 19),
('Experiencia previa en soporte técnico y redes.', '2024-04-02', 20);

-- Actividades
INSERT INTO "actividad" ("descripcion", "fecha", "estado", "id_pasantia") VALUES
('Taller de Git Avanzado', '2024-05-10', 'cerrada', 1),
('Configuración de Entorno Dev', '2024-05-02', 'cerrada', 1),
('Revisión de Seguridad Red', '2024-05-20', 'en_desarrollo', 3);

-- Bitácoras
INSERT INTO "bitacora" ("fecha", "contenido", "porcentaje", "observaciones", "id_jefe", "id_inscripcion", "id_actividad") VALUES
('2024-05-05', 'Implementación de pantallas de login.', 15, 'Sigue avanzando según cronograma.', 8, 1, 2),
('2024-05-12', 'Asistencia a taller de Git.', 5, 'Participación activa.', 8, 1, 1);

-- Informe Final (Ejemplo finalizado)
INSERT INTO "informe_final" ("fecha_entrega", "contenido", "nota_final", "observaciones", "id_inscripcion", "id_jefe") VALUES
('2024-08-05', 'Contenido completo de la pasantía en TechNova.', 95.50, 'Excelente desempeño técnico.', 1, 8);

-- Comentarios
INSERT INTO "comentario" ("texto", "fecha", "valoracion", "id_pasantia", "id_usuario") VALUES
('Empresa muy organizada y con buen ambiente.', '2024-05-15', 5, 1, 18),
('El proyecto es desafiante y estimulante.', '2024-05-20', 4, 3, 20);

-- Habilidades
INSERT INTO "habilidad" ("nombre", "nivel", "id_hoja_vida") VALUES
('JavaScript', 'avanzado', 1),
('NodeJS', 'intermedio', 1),
('SQL Server', 'basico', 2),
('Cisco Packet Tracer', 'avanzado', 3);
