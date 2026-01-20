# Arquitectura de TaskFlow

## Las 3 Partes Principales

### 1. Frontend (React)
- **Qué es:** Lo que el usuario puede ver e interactuar
- **Dónde corre:** `http://localhost:3000`
- **Hace:** Formularios, botones, calendario, modales
- **Tecnologías:** React, JavaScript, CSS

### 2. Backend (FastAPI)
- **Qué es:** El cerebro que procesa todo
- **Dónde corre:** `http://localhost:8000`
- **Hace:** Lógica, seguridad, guarda datos, organiza tareas, conecta con inteligencia artificial
- **Tecnologías:** FastAPI, Python, SQLAlchemy

### 3. Base de Datos (SQL Server)
- **Qué es:** Donde se guardan todos los datos
- **Dónde corre:** En tu computadora
- **Hace:** Almacena usuarios, tareas, historial, sugerencias de ia, estados, recomendaciones
- **Tecnologías:** Microsoft SQL Server

## Cómo se comunican

Usuario → Frontend → Backend → Base de Datos
↓ ↓ ↓ ↓
Interactúa Muestra Procesa Guarda con la app interfaz lógica datos

## Ejemplo: Crear una tarea

1. **Usuario** Le da en el boton de crear nueva tarea y llena los datos completos y le da click en "Guardar"
2. **Frontend** Envía datos al Backend con token de seguridad
3. **Backend** verifica token y guarda en Base de Datos
4. **Base de datos** Guarda los datos en la tabla task
5. **Frontend** Muestra la tarea en la sección de la actividades

## Seguridad (JWT)
- **Token:** Como un pase de entrada temporal
- **Dónde se guarda:** En el navegador (localStorage)
- **Para qué:** Para que Backend sepa quién es el usuario

## Cómo se comunican
Login → Obtener token → Usar token en cada request → Backend verifica

## Flujo completo del sistema

### 1. Autenticación
Usuario hace login → Google/GitHub autentica → Backend crea token → Frontend guarda token


### 2. Operaciones de tareas
Usuario interactúa → Frontend envía request con token → Backend valida → Base de Datos guarda/lee → Respuesta → Frontend muestra cambios