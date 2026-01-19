# TaskFlow - Gestor Inteligente de Actividades para Desarrolladores

TaskFlow es una plataforma web inteligente diseñada específicamente para desarrolladores de software que necesitan organizar su tiempo semanalmente y recibir asistencia en tareas complejas mediante inteligencia artificial.

## ¿Por qué TaskFlow?

Los desarrolladores frecuentemente enfrentan:

- Dificultad para priorizar tareas en proyectos complejos
- Necesidad de colaboración en tiempo real con equipos
- Desafíos técnicos que requieren asistencia inteligente
- Organización ineficiente del tiempo semanal

TaskFlow soluciona estos problemas integrando gestión de tareas, colaboración en equipo y asistencia IA en una sola plataforma.

## Características Principales

### Gestión de Tareas
- Creación y edición dinámica de actividades con indicadores visuales de prioridad
- Calendario interactivo semanal para visualizar y reorganizar tareas mediante drag-and-drop
- Sistema de prioridades con colores y etiquetas intuitivas

### Asistencia con Inteligencia Artificial
- Organización automática de tareas semanales basada en complejidad y urgencia
- Asistencia técnica para problemas de desarrollo específicos
- Sugerencias inteligentes para optimizar flujos de trabajo

### Colaboración en Equipo
- Chat integrado para comunicación en tiempo real durante tareas colaborativas
- Espacio de equipos con perfiles de compañeros y seguimiento de progreso
- Videollamadas integradas para revisiones y coordinación

## Arquitectura Técnica

### Backend
- **Python 3.10+** - Lenguaje principal
- **FastAPI** - Framework moderno para APIs rápidas y documentadas automáticamente
- **Uvicorn** - Servidor ASGI de alto rendimiento
- **SQLAlchemy** - ORM para conexión con base de datos
- **Pydantic v2** - Validación de datos y esquemas type-safe
- **python-jose** - Manejo de autenticación JWT (JSON Web Tokens)
- **OpenAI API** - Integración para asistencia con inteligencia artificial
- **python-dotenv** - Gestión de variables de entorno

### Base de Datos
- **Microsoft SQL Server** - Motor de base de datos relacional robusto y escalable
- **PyODBC** - Driver para conexión Python - SQL Server

### Frontend
- **React 18** - Biblioteca moderna para interfaces de usuario
- **React Router DOM** - Navegación y enrutamiento cliente-side
- **CSS3** - Estilos y diseño responsivo
- **Axios** - Cliente HTTP para comunicación con la API

### Integraciones Externas
- **Gmail API** - Notificaciones y comunicación por email
- **GitHub API** - Sincronización con repositorios y issues
- **OpenAI API** - Modelos de lenguaje para asistencia inteligente