# 🌱 AWI - Aplicación de Gestión de Hábitos Saludables

![Estado](https://img.shields.io/badge/Estado-En%20Desarrollo-yellow)
![React](https://img.shields.io/badge/React-18.x-blue)
![Node.js](https://img.shields.io/badge/Node.js-16%2B-green)
![Tailwind](https://img.shields.io/badge/Tailwind-3.x-38bdf8)

## Descripción

**AWI** es una aplicación web moderna para la gestión de hábitos saludables y sostenibles. Permite a los usuarios seleccionar hábitos predeterminados de un catálogo, crear hábitos personalizados, y realizar seguimiento de su progreso diario.

Este proyecto fue desarrollado como proyecto integrador de final de semestre, demostrando competencias en:
- Construcción de interfaces modernas con React
- Organización de código mediante componentes reutilizables
- Diseño responsive con Tailwind CSS
- Arquitectura de backend en capas

---

## ✨ Características Principales

### Para Usuarios
-  **Catálogo de hábitos predeterminados**: 10 hábitos saludables listos para agregar
-  **Hábitos personalizados**: Crea tus propios hábitos adaptados a tus necesidades
-  **Gestión de estados**: Marca hábitos como "por hacer" o "hecho"
-  **Eliminación flexible**: Quita hábitos de tu lista cuando lo desees
-  **Interfaz moderna**: Diseño atractivo con gradientes y animaciones suaves


### Técnicas
-  **Estados de UI**: Loading, vacío, error, éxito
-  **Componentización**: Button, Input, Card reutilizables
-  **Arquitectura limpia**: Separación frontend/backend
-  **Validaciones**: En formularios y API
-  **Fast Refresh**: Desarrollo ágil con hot reload

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React** 18.x - Biblioteca de UI
- **Vite** - Build tool y dev server
- **Tailwind CSS** 3.x - Framework de utilidades CSS
- **JavaScript ES6+** - Lenguaje de programación

### Backend
- **Node.js** 16+ - Entorno de ejecución
- **Express** 4.x - Framework web
- **CORS** - Manejo de peticiones cross-origin

## 📁 Estructura del Proyecto

```
AWI-PROJECT/
├── backend/                    # Servidor Node.js + Express
│   ├── repositories/          # Capa de datos
│   │   └── habitRepository.js
│   ├── routes/                # Endpoints de API
│   │   └── habitRoutes.js
│   ├── services/              # Lógica de negocio
│   │   └── habitService.js
│   ├── .env                   # Variables de entorno
│   ├── package.json
│   └── server.js              # Punto de entrada
│
└── frontend/                   # Aplicación React
    ├── src/
    │   ├── components/        # Componentes reutilizables
    │   │   └── common/
    │   │       ├── Button.jsx
    │   │       ├── Card.jsx
    │   │       ├── Input.jsx
    │   │       └── index.js
    │   ├── pages/             # Vistas/Pantallas
    │   │   └── Home.jsx
    │   ├── services/          # Clientes HTTP
    │   │   └── habitService.js
    │   ├── App.jsx            # Componente raíz
    │   ├── main.jsx           # Punto de entrada
    │   └── index.css          # Estilos globales
    ├── .env                   # Variables de entorno
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

##  Instalación y Ejecución

### Prerequisitos
- Node.js 16+ instalado
- npm o yarn
- Navegador moderno (Chrome, Firefox, Edge, Safari)

### Paso 1: Clonar o descargar el proyecto
```bash
git clone <tu-repositorio>
cd AWI-PROJECT
```

### Paso 2: Configurar el Backend
```bash
cd backend
npm install
npm install express cors
npm install nodemon --save-dev
```

Crear archivo `.env`:
```env
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

Iniciar servidor:
```bash
npm run dev
```

El servidor estará disponible en: http://localhost:5000

### Paso 3: Configurar el Frontend
```bash
cd frontend
npm install
```

Crear archivo `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Iniciar aplicación:
```bash
npm run dev
```

La aplicación estará disponible en: http://localhost:5173

---

## 🖥️ Pantallas

### 1. Splash Screen (Carga)
Pantalla de bienvenida con logo animado "AWI" que se muestra durante 2-3 segundos al iniciar la aplicación.

### 2. Pantalla Principal (Home/Dashboard)
Vista principal que incluye:
- **Header**: Título "Bienvenido a AWI" con gradiente
- **Sección de Hábitos Disponibles**: Carousel horizontal con tarjetas de hábitos del catálogo
- **Botón de Crear Hábito**: Abre formulario para hábitos personalizados
- **Mi Lista de Hábitos**: Listado de hábitos agregados por el usuario

### 3. Formulario de Creación
Modal/Sección para crear hábitos personalizados con:
- Campo de nombre (obligatorio)
- Campo de descripción (opcional)
- Botones de Cancelar y Crear

### Estados Visuales:
- **Estado vacío**: Mensaje cuando no hay hábitos en la lista
- **Estado de carga**: Spinner en botones durante peticiones
- **Estado de error**: Banner rojo con mensaje de error
- **Estado de éxito**: Cambios inmediatos en la UI

---

## 🧩 Componentes Reutilizables

### Button
Botón versátil con múltiples configuraciones.

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `disabled`: boolean
- `isLoading`: boolean
- `onClick`: function

**Ejemplo de uso:**
```jsx
<Button variant="primary" size="md" onClick={handleClick}>
  Guardar
</Button>

<Button variant="danger" size="sm" isLoading={true}>
  Eliminando...
</Button>
```

### Input
Campo de entrada con validación y estilos consistentes.

**Props:**
- `label`: string
- `placeholder`: string
- `type`: 'text' | 'email' | 'password' | 'number' | 'textarea'
- `value`: string | number
- `onChange`: function
- `error`: string
- `required`: boolean

**Ejemplo de uso:**
```jsx
<Input
  label="Nombre del Hábito"
  placeholder="Ej: Meditar 20 minutos"
  value={nombre}
  onChange={(e) => setNombre(e.target.value)}
  error={errorMsg}
  required
/>
```

### Card
Contenedor con estilos predefinidos para mostrar información.

**Props:**
- `title`: string
- `description`: string
- `variant`: 'default' | 'success' | 'error' | 'warning'
- `children`: ReactNode

**Ejemplo de uso:**
```jsx
<Card title="Bienvenido" description="Comienza a crear hábitos">
  <p>Contenido de la tarjeta</p>
</Card>
```

---

## 🔌 API Endpoints

### Hábitos del Catálogo

**GET** `/api/habitos`
- Descripción: Obtiene el catálogo de hábitos predeterminados
- Respuesta: Array de objetos hábito

```json
[
  {
    "id": 1,
    "nombre": "Beber 8 vasos de agua",
    "descripcion": "Mantener hidratación adecuada durante el día"
  }
]
```

### Lista de Hábitos del Usuario

**GET** `/api/lista-habitos`
- Descripción: Obtiene todos los hábitos del usuario
- Respuesta: Array de hábitos con estado

```json
[
  {
    "id": 1,
    "habito_id": 1,
    "nombre": "Beber 8 vasos de agua",
    "descripcion": "Mantener hidratación adecuada",
    "estado": "por hacer",
    "agregado_at": "2026-01-26T10:30:00.000Z"
  }
]
```

**POST** `/api/lista-habitos`
- Descripción: Agrega un hábito (del catálogo o personalizado)
- Body:
  - Desde catálogo: `{ "habito_id": 1 }`
  - Personalizado: `{ "nombre": "Mi hábito", "descripcion": "..." }`

**PATCH** `/api/lista-habitos/:id`
- Descripción: Actualiza un hábito (estado, nombre, descripción)
- Body: `{ "estado": "hecho" }`

**DELETE** `/api/lista-habitos/:id`
- Descripción: Elimina un hábito de la lista

---

## 📊 Almacenamiento de Datos

**Importante**: Esta versión utiliza almacenamiento en memoria.

**Características:**
- Los datos se almacenan en memoria RAM
- Se pierden al reiniciar el servidor
- No requiere base de datos



---

##  Contribuciones

Este es un proyecto académico, pero las sugerencias son bienvenidas:

---

## 👤 Autores

**Fabián Vega y Mauricio Lema**
- GitHub: [@FabianVAEN](https://github.com/tuusuario)

---

**¡Gracias por revisar AWI! 🌱**

*Desarrollado con ❤️ *

---

**Última actualización**: 26 de enero de 2026
