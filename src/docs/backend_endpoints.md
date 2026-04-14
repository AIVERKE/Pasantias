# 🗺️ Planificación de Endpoints del Backend - Sistema de Pasantías

Este documento establece la hoja de ruta técnica para la construcción de la API RESTful. Define todos los endpoints requeridos agrupados por módulos funcionales, conectando el modelo de base de datos con las necesidades del frontend.

---

## 🛡️ 1. Módulo de Autenticación y Perfil (Usuarios Global)

| Endpoint | Método | Vista Frontend | Lógica y Reglas de Negocio (Service) | Datos de Entrada (DTO) |
| :--- | :--- | :--- | :--- | :--- |
| `/api/auth/login` | `POST` | Pantalla de Login | Autentica al usuario por `email` y `contrasena`, retorna token JWT y rol según `tipo_usuario`. | `LoginDto` (email, contrasena) |
| `/api/auth/register` | `POST` | Pantalla de Registro | Registra un nuevo usuario base asignando `tipo_usuario` y `nivel_acceso`. Encripta la contraseña de forma segura. | `RegisterUserDto` |
| `/api/auth/profile` | `GET` | Dashboard / Perfil App | Devuelve los datos generales del perfil actual extraídos del Token (con las sub-entidades asociadas). | *Token Bearer* |

---

## 👥 2. Módulo de Perfiles de Roles

### Perfil: Estudiante
| Endpoint | Método | Vista Frontend | Lógica y Reglas de Negocio (Service) | Datos de Entrada (DTO) |
| :--- | :--- | :--- | :--- | :--- |
| `/api/estudiantes` | `GET` | Panel Jefe / Admin | Lista todos los estudiantes activos (permite filtros). Útil para búsqueda de candidatos. | Parámetros de Query (`carrera`, `semestre`) |
| `/api/estudiantes` | `POST` | Completar Perfil Registro | Crea/conecta un perfil de `Estudiante` a un `Usuario` existente. Asigna `carrera`, `semestre` y `registro_universitario`. | `CreateEstudianteDto` |
| `/api/estudiantes/:id` | `GET` | Detalle Candidato | Obtiene la información académica y perfil de un estudiante en específico. | - |
| `/api/estudiantes/:id` | `PATCH` | Editar Perfil | Actualiza la información (semestre o carrera) del estudiante. | `UpdateEstudianteDto` |

### Perfil: Responsables de la Empresa (Jefes y Gerentes)
| Endpoint | Método | Vista Frontend | Lógica y Reglas de Negocio (Service) | Datos de Entrada (DTO) |
| :--- | :--- | :--- | :--- | :--- |
| `/api/jefes-pasantes` | `POST` | Alta Personal | Crea un `JefePasantes` (departamento) y lo asocia directamente a una entidad de `Empresa`. | `CreateJefeDto` |
| `/api/gerentes` | `POST` | Alta Personal Directivo | Crea un `Gerente` (cargo, carrera) y lo asocia a una `Empresa`. | `CreateGerenteDto` |

### Perfil: Tutores Académicos
| Endpoint | Método | Vista Frontend | Lógica y Reglas de Negocio (Service) | Datos de Entrada (DTO) |
| :--- | :--- | :--- | :--- | :--- |
| `/api/tutores` | `GET` | Directorio Tutores | Lista tutores desde el rol de administrador, jefe de pasantes o gerente. | - |
| `/api/tutores` | `POST` | Registro de Docentes | Crea el perfil de `Tutor` asignando `institucion` y `especialidad`. | `CreateTutorDto` |

---

## 🏢 3. Módulo de Empresas

| Endpoint | Método | Vista Frontend | Lógica y Reglas de Negocio (Service) | Datos de Entrada (DTO) |
| :--- | :--- | :--- | :--- | :--- |
| `/api/empresas` | `GET` | Empresas Vinculadas | Obtiene lista de empresas registradas (`nombre`, `rubro`), útil para buscar oportunidades. | - |
| `/api/empresas/:id` | `GET` | Ficha Institucional | Detalle de la empresa, su rubro y dirección. | - |
| `/api/empresas` | `POST` | Registro de Empresa | Registra una nueva entidad `Empresa`. Guardando detalles como `telefono`, `rubro`, `direccion`. | `CreateEmpresaDto` |
| `/api/empresas/:id` | `PATCH` | Ajustes de Empresa | Actualiza datos institucionales. | `UpdateEmpresaDto` |
| `/api/empresas/:id` | `DELETE` | Administrar Empresas | Ejecuta el Soft Delete (`deleted_at`) sobre una empresa para inhabilitarla lógicamente del sistema. | - |

---

## 💼 4. Módulo de Pasantías (Ofertas y Desarrollo)

### Ofertas de Pasantía
| Endpoint | Método | Vista Frontend | Lógica y Reglas de Negocio (Service) | Datos de Entrada (DTO) |
| :--- | :--- | :--- | :--- | :--- |
| `/api/pasantias` | `GET` | Tablero Oportunidades | Lista `Pasantias` disponibles (Ej: Estado `PENDIENTE` o `EN_CURSO`), ordenadas por creación. | Parámetros de Query (`estado`, `empresa_id`) |
| `/api/pasantias/:id` | `GET` | Detalle Convocatoria | Retorna información completa (fechas, descripción) para que el estudiante evalúe la oferta. | - |
| `/api/pasantias` | `POST` | Crear Pasantía | Empresa/Jefe crea la vacante. Asigna `titulo`, `descripcion` y `fecha_inicio` en estado inicial por defecto (`PENDIENTE`). | `CreatePasantiaDto` |
| `/api/pasantias/:id/estado` | `PATCH` | Gestión Vacante | Permite transiciones de estado de la pasantía (`FINALIZADA`, `CANCELADA`, etc). Actualizando la `fecha_fin` en el proceso. | `UpdateEstadoPasantiaDto` |

### Inscripciones y Postulaciones
| Endpoint | Método | Vista Frontend | Lógica y Reglas de Negocio (Service) | Datos de Entrada (DTO) |
| :--- | :--- | :--- | :--- | :--- |
| `/api/inscripciones/pasantia/:id` | `GET` | Postulantes (Jefe) | Lista todos los estudiantes asociados a una pasantía gestionando su iteración. | - |
| `/api/inscripciones` | `POST` | Aplicar a Vacante | Estudiante aplica a vacante creándose la inscripción en estado `PENDIENTE`. | `CreateInscripcionDto` |
| `/api/inscripciones/:id/evaluacion` | `PATCH` | Respuesta Selección | El Jefe de la Empresa cambia el estado de inscripción. Al cambiar a `APROBADA` se setean `fecha_inicio_periodo` y `fecha_fin_periodo`. | `UpdateEvaluacionInscripcionDto` |
| `/api/inscripciones/:id/tutor` | `PATCH` | Asignar Tutor/Jefe | Actualiza los FKs asociando qué `Tutor` y qué `JefePasantes` son responsables de esta inscripción de pasantía. | `AsignarSupervisoresDto` |

### Actividades
| Endpoint | Método | Vista Frontend | Lógica y Reglas de Negocio (Service) | Datos de Entrada (DTO) |
| :--- | :--- | :--- | :--- | :--- |
| `/api/actividades/pasantia/:id` | `GET` | Cronograma Actividades | Retorna las actividades asignadas globalmente a la pasantía. | - |
| `/api/actividades` | `POST` | FormNueva Actividad | Crea una agenda o registro de tarea para la Pasantía asignando su `fecha`, `descripcion` y el default `CON_CUPOS`. | `CreateActividadDto` |
| `/api/actividades/:id` | `PATCH` | Editar Actividad | Actualiza detalles de la actividad o el `EstadoActividad` (a `EN_DESARROLLO` o `CERRADA`). | `UpdateActividadDto` |

### Valoraciones Finales (Comentarios)
| Endpoint | Método | Vista Frontend | Lógica y Reglas de Negocio (Service) | Datos de Entrada (DTO) |
| :--- | :--- | :--- | :--- | :--- |
| `/api/pasantias/:id/comentarios` | `GET` | Feedback Externo | Renderiza el timeline de testimonios y promedios logrados para la oferta. | - |
| `/api/comentarios` | `POST` | Formulario Satisfacción | El usuario publica su feedback sobre una pasantía ya en estado `FINALIZADA` guardando valoración de 1-5 y texto. | `CreateComentarioDto` |

---

## 📄 5. Módulo de Documentos y Evaluaciones

### Hoja de Vida y Habilidades
| Endpoint | Método | Vista Frontend | Lógica y Reglas de Negocio (Service) | Datos de Entrada (DTO) |
| :--- | :--- | :--- | :--- | :--- |
| `/api/hoja-vida/mis-datos` | `GET` | View CV Editable | Obtiene los detalles de la `HojaVida` asociada al `Estudiante` y su stack anidado de `Habilidades`. | - |
| `/api/hoja-vida` | `POST` | Editor Resumen Bio | Crea o actualiza el registro principal de la hoja de vida marcando su `fecha_actualizacion`. | `HojaVidaDto` |
| `/api/habilidades` | `POST` | Selector de Skills | Añade una `Habilidad` al CV (con un `NivelHabilidad` ej: Básico, Avanzado). | `CreateHabilidadDto` |
| `/api/habilidades/:id` | `DELETE` | Gestor de Skills | Quita una habilidad que ya no posea relevancia en el CV actualizado. | - |

### Control de Bitácoras
| Endpoint | Método | Vista Frontend | Lógica y Reglas de Negocio (Service) | Datos de Entrada (DTO) |
| :--- | :--- | :--- | :--- | :--- |
| `/api/bitacoras/inscripcion/:id` | `GET` | Historial Avance | Renderiza toda las entregas que ha realizado el estudiante asociadas a una pre-inscripción concreta o a la `actividad` filtrada. | - |
| `/api/bitacoras` | `POST` | Redactar Avance Log | El Pasante envía su resumen del trabajo (log) con sus adjuntos validando que la inscripción exista. | `CreateBitacoraDto` |
| `/api/bitacoras/:id/evaluacion` | `PATCH` | Rating del Jefe | El `JefePasantes` valora el avance estableciendo métrica de porcentaje de cumplimiento (0-100) y `observaciones` formativas. | `EvaluarBitacoraDto` |

### Informes Finales de Aprobación
| Endpoint | Método | Vista Frontend | Lógica y Reglas de Negocio (Service) | Datos de Entrada (DTO) |
| :--- | :--- | :--- | :--- | :--- |
| `/api/informes/inscripcion/:id` | `GET` | Sala de Decisión | Permite al Jefe/Docente consultar el informe final asociado a la pasantía para su lectura. | - |
| `/api/informes` | `POST` | Subida de Informe | El estudiante registra y envía el contenido final. Almacena la `fecha_entrega` del mismo validándolo con las normas académicas. | `CreateInformeFinalDto` |
| `/api/informes/:id/calificacion` | `PATCH` | Calificador Cierre | JefePasantes impone nota definitiva en atributo `nota_final` (precisión 5,2) terminando el ciclo si la inscripción es satisfactoria. | `CalificarInformeDto` |
