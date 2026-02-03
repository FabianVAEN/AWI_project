# AWI – Construye Hábitos Saludables

AWI es una aplicación web diseñada para ayudar a los usuarios a gestionar y realizar un seguimiento de sus hábitos diarios de forma sencilla, intuitiva y visual.

---

## Características

- **Catálogo de Hábitos**  
  Selección de hábitos predefinidos como beber agua, ejercicio, meditación, entre otros.

- **Gestión Personal**  
  Permite agregar y eliminar hábitos de una lista personal.

- **Seguimiento de Hábitos**  
  Los hábitos pueden marcarse como:
  - Por hacer  
  - En progreso  
  - Completado  

- **Persistencia de Datos**  
  La información se guarda en una base de datos **PostgreSQL**.

---

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

1. **Node.js** (versión 16 o superior)  
2. **PostgreSQL** (configurado y en ejecución)  
3. **Git**

---

## Instalación y Configuración

### 1️ Clonar el repositorio

```bash
git clone [nombre-del-repositorio]
cd awi-project
```

---

### 2️ Configurar el Backend

```bash
cd backend
npm install
```

#### Configuración de la Base de Datos

Crea una base de datos en PostgreSQL llamada:

```text
awi_db
```

Ejemplo de variables de entorno:

```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=awi_db
DB_PORT=5432
```

Inicia el backend:

```bash
npm run dev
```

---

### 3️ Configurar el Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Instrucciones de Uso

### Agregar un hábito

1. Ve a **Hábitos Disponibles**.
2. Selecciona un hábito.
3. Se agregará a **Mi Lista de Hábitos**.

### Completar un hábito

1. Haz clic en **Completar**.
2. El hábito cambia a **En Progreso**.
3. Usa **Quitar** si deseas eliminarlo.

---

## Tecnologías Utilizadas

- React + Tailwind CSS  
- Node.js + Express  
- PostgreSQL  

---








