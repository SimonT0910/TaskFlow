## Prerrequisitos

Antes de comenzar, necesitas tener instalado:

### Software obligatorio
1. **Python 3.10 o superior**
    - Verifica: `python --version` en terminal
    - Descarga: [python.org](https://www.python.org) 

2. **Node.js 16 o superior**
   - Verifica: `node --version`
   - Descarga: [nodejs.org](https://nodejs.org)

3. **SQL Server** (cualquier versión)
   - SQL Server Express es gratuito
   - O usa Docker si prefieres

4. **Git** (opcional pero recomendado)
   - Para clonar el repositorio

### Cuentas y API Keys (Opcionales para desarrollo)
- **OpenAI API Key**: Si quieres usar funciones de IA
- **Gmail API Credentials**: Para notificaciones por email
- **GitHub Token**: Para integración con repositorios

## Pasos de Instalación

### Paso 1: Obtener el Código

**Opción A - Si tienes Git:**

# Clona el repositorio
```bash
https://github.com/SimonT0910/TaskFlow.git
```

**Opción B - Si descargaste ZIP:**

1. Descomprime el archivo ZIP

2. Abre terminal en la carpeta descomprimida

### Paso 2: Configurar el Backend (Python/FastAPI)

# Navegar a la carpeta backend
```bash
cd backend
```

# Crear entorno virtual
```bash
python -m venv venv
```

# Activar entorno virtual

**Windows (CMD/PowerShell)**
```bash
venv\Scripts\activate
```

**Mac/Linux**
```bash
source venv/bin/activate
```

# Instalar dependencias
```bash
pip install -r requirements.txt
```

### Paso 3: Configurar Base de Datos

1. **Crear la base de datos en SQL Server**
    - Abre SQL Server Management Studio
    - Conéctate a tu servidor
    - Ejecuta: CREATE DATABASE taskflow;

2. **Configurar conexión**
    - Copia el archivo .env.example a .env
    - Edita .env con tus credenciales:
    DB_SERVER=localhost
    DB_NAME=taskflow
    DB_USER=tu_usuario
    DB_PASSWORD=tu_contraseña

### Paso 4: Configurar el Frontend (React)

# Volver a la raíz y entrar a frontend
```bash
cd ..  # Vuelves a la carpeta principal
cd frontend
```

# Instalar dependencias de Node.js
```bash
npm install
```

### Paso 5: Ejecutar la Aplicación

Necesitas dos terminales abiertas:

# Terminal 1 - Backend

**Asegúrate de estar en la carpeta backend**
```bash
cd backend
```

**Asegúrate de tener el entorno virtual activado**
```bash
.\venv\Scripts\activate
```

**Iniciar el servidor FastAPI**
```bash
uvicorn app.main:app --reload
```

# Terminal 2 - Frontend

**Asegúrate de estar en la carpeta frontend**
```bash
cd frontend
```

**Iniciar el servidor de desarrollo de React**
```bash
npm start
```

# Acceso a la Aplicación

Una vez ambos servidores estén corriendo:

- Aplicación web: http://localhost:3000

- API Backend: http://localhost:8000

- Documentación API (Swagger): http://localhost:8000/docs

- Documentación API (Redoc): http://localhost:8000/redoc