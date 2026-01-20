# API Reference - TaskFlow

Documentación completa de los endpoints disponibles en la API de TaskFlow.

## Información General

### Base URL
http://localhost:8000

### Autenticación
La mayoría de endpoints requieren autenticación mediante **JWT (JSON Web Token)**.

**Formato del header:**
Authorization: Bearer {tu_token_jwt}

### Códigos de Estado HTTP
- `200 OK` - Solicitud exitosa
- `201 Created` - Recurso creado exitosamente
- `400 Bad Request` - Error en los datos enviados
- `401 Unauthorized` - Token inválido o ausente
- `404 Not Found` - Recurso no encontrado
- `422 Unprocessable Entity` - Error de validación de datos
- `500 Internal Server Error` - Error del servidor

### Formato de Respuesta
Todas las respuestas siguen este formato:
```json
{
  "status": "success",
  "data": { ... },      // Datos específicos del endpoint
}
```

## Autenticación

### Login de Usuario

Inicia sesión y obtén un token JWT.

**Endpoint**
POST /login
Content-Type: application/json

**Body**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña_segura"
}
```
**Respuesta Exitosa (200)**
```json
{
  "status": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "user": {
      "usuario_id": 1,
      "nombre": "Nombre del usuario",
      "email": "Correo del usuario"
    }
  }
}
```

###  Obtener Todas las Tareas

Obtiene la lista de todas las tareas del usuario autenticado.

**Endpoint**
GET /tasks/
Authorization: Bearer {token}

**Respuesta Exitosa (200)**
```json
{
  "status": "success",
  "data": [
    {
      "task_id": 1,
      "usuario_id": 1,
      "titulo": "Ejemplo #1",
      "descripcion": "Descripción del ejemplo #1",
      "estado_id": 1,
      "prioridad": 1,
      "fecha_estimada": "2026-01-20",
      "tiempo": 5,
      "creado": "2026-01-15",
      "actualizado": "2026-01-15"
    },
    {
      "task_id": 2,
      "usuario_id": 1,
      "titulo": "Ejemplo #2",
      "descripcion": "Descripción del ejemplo #2",
      "estado_id": 2,
      "prioridad": 2,
      "fecha_estimada": "2026-01-25",
      "tiempo": 3,
      "creado": "2026-01-15",
      "actualizado": "2026-01-15"
    }
  ]
}
```
### Crear Nueva Tarea

Crea una nueva tarea.

**Endpoint**
POST /tasks/
Authorization: Bearer {token}
Content-Type: application/json

**Body**
```json
{
  "titulo": "Ejemplo creación",
  "descripcion": "Descripción del ejemplo",
  "prioridad": 2,
  "fecha_estimada": "2026-01-22",
  "tiempo": 2
}
```

**Respuesta Exitosa (201)**
```json
{
  "status": "success",
  "data": {
    "task_id": 3,
    "usuario_id": 1,
    "titulo": "Ejemplo creación",
    "descripcion": "Descripción del ejemplo",
    "estado_id": 1,
    "prioridad": 2,
    "fecha_estimada": "2026-01-22",
    "tiempo": 2,
    "creado": "2026-01-15",
    "actualizado": "2026-01-15"
  },
  "message": "Tarea creada exitosamente"
}
```

### Actualizar Tarea

Actualiza una tarea existente.

**Endpoint**
PUT /tasks/{id}
Authorization: Bearer {token}
Content-Type: application/json

**Body**
```json
{
  "titulo": "Tarea actualizada",
  "descripcion": "Cambio de descripcion",
  "fecha_estimada": "2026-01-28",
  "tiempo": 3
}
```

**Respuesta Exitosa (200)**
```json
{
  "status": "success",
  "data": {
    "task_id": 1,
    "usuario_id": 1,
    "titulo": "Tarea actualizada",
    "descripcion": "Cambio de descripcion",
    "estado_id": 1,
    "prioridad": 1,
    "fecha_estimada": "2024-01-20",
    "tiempo": 3,
    "creado": "2026-01-16",
    "actualizado": "2026-01-20"
  },
  "message": "Tarea actualizada exitosamente"
}
```

### Eliminar Tarea

Elimina una tarea.

**Endpoint**
DELETE /tasks/{id}
Authorization: `Bearer ${token}`

**Respuesta Exitosa (200)**
```json
{
  "status": "success",
  "message": "Tarea eliminada exitosamente"
}
```

### Eliminación masiva 

Eliminación masiva de las tareas con el estado "Finalizado".

**Endpoint**
DELETE/delete-completed
Authorization: `Bearer ${token}`

**Respuesta Exitosa (200)**
```json
{
  "status": "success",
  "message": "Tareas eliminadas exitosamente"
}
```

### Cambiar estado

Cambio de estado de las tareas.

**Endpoint**
PATCH/tasks/task_id/estado
Authorization: `Bearer ${token}`

**Respuesta Exitosa (200)**
```json
{
  "status": "success",
  "data": {
    "task_id": 1,
    "titulo": "Ejemplo de cambio",
    "descripcion": "Descripción del ejemplo",
    "estado_id": 2,
    "estado_nombre": "En curso",
    "prioridad": 1,
    "fecha_estimada": "2026-01-20",
    "tiempo": 5,
    "actualizado": "2026-01-20T15:30:00"
  },
  "message": "Estado cambiado de 'Pendiente' a 'En curso'"
}
```