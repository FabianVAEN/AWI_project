# README AWI

## AWI - Construye Hábitos Saludables

AWI es una aplicación web diseñada para ayudar a los usuarios a gestionar y realizar un seguimiento de sus hábitos diarios de forma sencilla y visual.

## Características

- Catálogo de Hábitos
- Gestión Personal: Agregar y eliminar hábitos de tu lista personal
- Seguimiento de 3 estados: Por hacer, En curso, Hecho
- Persistencia: Los datos se guardan en una base de datos PostgreSQL
- Interfaz responsive con Tailwind CSS

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

1. Node.js (Versión 16 o superior)
2. PostgreSQL (Versión 12 o superior)
3. Git

## Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone [URL_DEL_REPOSITORIO]
cd awi-project
```

### 2. Configurar el Backend

```bash
cd backend
npm install
```

**Configuración de la Base de Datos:**

Crea una base de datos en PostgreSQL:

```sql
CREATE DATABASE awi_db;
```

Crea un archivo `.env` en la carpeta `backend/` con el siguiente contenido:

```env
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=awi_db
DB_PASSWORD=tu_contraseña
DB_PORT=5432
```

Inicia el servidor backend:

```bash
npm run dev
```

El servidor debería estar corriendo en `http://localhost:5000`

### 3. Configurar el Frontend

En una nueva terminal:

```bash
cd frontend
npm install
npm start
```

La aplicación debería abrirse automáticamente en `http://localhost:3000`


## Instrucciones de Uso

### Cómo agregar un hábito

1. En la sección "Hábitos Disponibles", desplázate horizontalmente para ver las opciones
2. Haz clic en un hábito (ej. "Beber 8 vasos de agua")
3. El hábito aparecerá en "Mi Lista de Hábitos" con estado "Por hacer"

### Cómo completar un hábito

1. En tu lista personal, haz clic en "Empezar" para cambiar el estado a "En curso"
2. Haz clic en "Completar" para marcar el hábito como "Hecho"
3. Haz clic en "Quitar" para eliminar el hábito de tu lista (volverá a estar disponible arriba)

## Tecnologías Utilizadas

**Backend:**
- Node.js
- Express.js
- PostgreSQL
- pg (node-postgres)

**Frontend:**
- React.js
- Tailwind CSS
- Fetch API


## Solución de Problemas

**Error de conexión a la base de datos:**
- Verifica que PostgreSQL esté corriendo
- Confirma que las credenciales en `.env` sean correctas
- Asegúrate de que la base de datos `awi_db` exista

**Error "Port 5000 already in use":**
- Cambia el puerto en el archivo `.env` del backend
- O detén el proceso que está usando el puerto 5000

**El frontend no carga los hábitos:**
- Verifica que el backend esté corriendo en `http://localhost:5000`
- Revisa la consola del navegador para ver errores específicos



## Contacto

Para consultas o sugerencias, contacta al equipo de desarrollo.



src/
  components/
    common/
      Button.jsx
      Input.jsx
      Card.jsx
      index.js
  pages/
    Home.jsx
  services/
    habitService.js
  App.jsx