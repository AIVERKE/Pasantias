# Sistema de Pasantías - Backend

Este proyecto es la implementación de la capa de acceso a datos y base de datos relacional para el Sistema de Pasantías, usando **NestJS**, **TypeORM** y **PostgreSQL**.

## 📋 Requisitos Previos

- [Node.js](https://nodejs.org/en/) (v16 o superior)
- PostgreSQL Server instalado de manera nativa y corriendo localmente.

## ⚙️ Configuración del Entorno (.env)

El proyecto requiere que configures tus credenciales de PostgreSQL en el archivo `.env` ubicado en esta misma carpeta:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=pasantias_user
DB_PASSWORD=pasantias_password
DB_DATABASE=pasantias_db
```
*(Asegúrate de haber creado manualmente una base de datos llamada `pasantias_db` en tu Postgres local o PgAdmin con esas credenciales)*

## 🚀 Instalación y Despliegue

1. **Instalar Dependencias**
   Abre una terminal en esta carpeta (`pasantias-backend`) y ejecuta:
   ```bash
   npm install
   ```

2. **Ejecutar las Migraciones a la Base de Datos**
   El esquema inicial de la base de datos ya ha sido generado. Teniendo tu servidor PostgreSQL nativo corriendo y el archivo `.env` configurado, simplemente sincroniza las tablas aplicando las migraciones existentes con:
   ```bash
   npm run migration:run
   ```

3. **Levantar el Servidor (Desarrollo)**
   Arranca la aplicación escuchando por los cambios en vivo:
   ```bash
   npm run start:dev
   ```

## 🛠️ Comandos configurados de TypeORM

Se han añadido los siguientes *scripts* en el `package.json` para facilitar la gestión de la base de datos usando TypeORM.

* **Aplicar migraciones pendientes** (sincroniza las entidades y cambios a la BD):
  ```bash
  npm run migration:run
  ```
* **Generar una nueva migración** (luego de editar/crear una entidad). Sustituye `NombreMigracion` por un término descriptivo:
  ```bash
  npm run migration:generate -- src/migrations/NombreMigracion
  ```
* **Revertir la última migración aplicada** en caso de que sea necesario deshacerla de la BD:
  ```bash
  npm run migration:revert
  ```
* **Uso libre de la CLI de TypeORM** (con la conexión `data-source` inyectada):
  ```bash
  npm run typeorm -- [comando]
  ```

## 🏗️ Estructura de Entidades Creada
- **Módulo Usuarios:** Implementada relación de herencia Uno-a-Uno (la PK e.g. `id_estudiante` es la misma que la del Parent `id_usuario`). Entidades: `Usuario`, `Estudiante`, `Tutor`, `Gerente`, `JefePasantes`, `SuperUsuario`.
- **Módulo Empresas:** `Empresa`
- **Módulo Pasantias:** `Pasantia`, `Actividad`, `Inscripcion`, `Comentario`.
- **Módulo Documentos:** `Bitacora`, `InformeFinal`, `HojaVida`, `Habilidad`.
