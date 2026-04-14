# 🖥️ Mapa de Vistas Frontend y Endpoints Asociados

Este documento agrupa los endpoints del backend según las vistas y pantallas del frontend (interfaz de usuario) en las que serán consumidos. Esto facilita el trabajo del equipo de UI/UX y Frontend al momento de realizar la integración de la API.

---

## 🔒 1. Área Pública y Autenticación

### Pantalla de Login
- **`POST /api/auth/login`**: Valida credenciales e ingresa al sistema (Retorna Token).

### Pantalla de Registro y Configuración Inicial
- **`POST /api/auth/register`**: Registra un nuevo usuario base.
- **`POST /api/estudiantes`**: Formulario adicional para completar los datos académicos si el usuario registrado es tipo estudiante.

### Directorio de Empresas (Pública u Opcional)
- **`GET /api/empresas`**: Lista las empresas registradas.
- **`GET /api/empresas/:id`**: Muestra la ficha institucional de una empresa.

---

## 👨‍🎓 2. Portal del Estudiante (Pasante)

### Dashboard / Tablero de Oportunidades
- **`GET /api/auth/profile`**: Carga de datos base del usuario autenticado y notificaciones en menú lateral.
- **`GET /api/pasantias`**: Tablero principal que lista vacantes y pasantías activas u ofertadas.

### Detalle de Convocatoria (Pasantía)
- **`GET /api/pasantias/:id`**: Muestra toda la descripción, fechas y perfil de la vacante.
- **`GET /api/pasantias/:id/comentarios`**: Carga reseñas y rating (de ex-pasantes).
- **`POST /api/inscripciones`**: Botón de "Aplicar a Vacante". Envía el perfil a la empresa.

### Mi Perfil Editable / Hoja de Vida
- **`GET /api/auth/profile`**: Renderiza datos de usuario y carrera.
- **`GET /api/hoja-vida/mis-datos`**: Obtiene el resumen bio y habilidades guardadas.
- **`PATCH /api/estudiantes/:id`**: Formulario general para modificar semestre/carrera.
- **`POST /api/hoja-vida`**: Actualizar la biografía o el resumen de la hoja de vida.
- **`POST /api/habilidades`**: Componente *tag-input* para añadir un nuevo skill al CV.
- **`DELETE /api/habilidades/:id`**: Eliminar un skill de su CV.

### Seguimiento de Pasantía en Curso y Tareas
- **`GET /api/actividades/pasantia/:id`**: Calendario/lista de actividades y tareas dispuestas por el jefe.
- **`GET /api/bitacoras/inscripcion/:id`**: Historial de progreso subido a la fecha.
- **`POST /api/bitacoras`**: Formulario modal para reportar avance o registro periódico (bitácora).
- **`POST /api/informes`**: Pantalla para subir su documento/informe final.

### Encuesta de Salida / Reviews
- **`POST /api/comentarios`**: Formulario para calificar por estrellas su estadía en la pasantía luego de finalizada.

---

## 👔 3. Portal de Administración de la Empresa (Jefe Pasantes / Gerente)

### Dashboard y Oportunidades de la Empresa
- **`GET /api/auth/profile`**: Vista de resumen propia del gerente o jefe.
- **`GET /api/pasantias`** (filtrado por `empresa_id`): Vacantes aperturadas por esta compañía.
- **`POST /api/pasantias`**: Formulario creador de vacantes/pasantías nuevas.
- **`PATCH /api/pasantias/:id/estado`**: Control para dar de baja o cerrar una convocatoria.

### Gestión de Postulantes a una Pasantía
- **`GET /api/estudiantes`**: Acceso al banco de todos los candidatos / motor de búsqueda con filtros.
- **`GET /api/inscripciones/pasantia/:id`**: Tablero/Kanban de postulantes que aplicaron a X convocatoria.
- **`GET /api/estudiantes/:id`** y **`GET /api/hoja-vida/mis-datos`** (via admin): Al hacer clic en un postulante específico, para ver su CV.
- **`PATCH /api/inscripciones/:id/evaluacion`**: Botones de "Aprobar", "Rechazar" Candidato.
- **`PATCH /api/inscripciones/:id/tutor`**: Asignar Tutor Universitario a ese candidato aprobado.

### Actividades y Seguimiento (Jefe)
- **`POST /api/actividades`**: Agendar nuevas tareas en el cronograma del pasante o pasantes.
- **`PATCH /api/actividades/:id`**: Marcar actividad como CERRADA.
- **`PATCH /api/bitacoras/:id/evaluacion`**: Evaluar un reporte del estudiante indicando retroalimentación de cumplimiento (porcentaje/nota temporal).

### Cierre y Calificación (Jefe / Tutor)
- **`GET /api/informes/inscripcion/:id`**: Pantalla para descargar/ver Informe Final subido por estudiante.
- **`PATCH /api/informes/:id/calificacion`**: Componente para asentar nota final definitiva de aprobación.

---

## ⚙️ 4. Portal del Administrador o Super Usuario

### Administrar Personal Directivo de Empresa
- **`POST /api/jefes-pasantes`**: Formulario para enlazar un Jefe a una Empresa y darle credenciales.
- **`POST /api/gerentes`**: Formulario de registro de Gerentes atados a su Empresa.

### Gestión y Directorio Institucional de Empresas
- **`GET /api/empresas`**: Master ListView de la red de entidades.
- **`POST /api/empresas`**: Registro formal de Empresa en el sistema matriz Universitario.
- **`PATCH /api/empresas/:id`**: Correcciones institucionales a empresas.
- **`DELETE /api/empresas/:id`**: Remover empresas que violen normativas del convenio de Pasantía.

### Directorio de Docentes / Tutores
- **`GET /api/tutores`**: Base de datos de Tutores Académicos / Institucionales.
- **`POST /api/tutores`**: Ingresar nuevos profesores a la plataforma.
