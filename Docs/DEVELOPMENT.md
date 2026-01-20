# Guía de Desarrollo - TaskFlow

Esta guía está dirigida a desarrolladores que quieran contribuir, modificar o entender la estructura interna de TaskFlow.

## Estructura del Proyecto

taskflow/
├── BackEnd/
│ ├── app/
│ │ ├── __init__.py
│ │ ├── database.py
│ │ ├── main.py
│ │ ├── models.py
│ │ ├── test_connection.py
│ │ └── auth/
│ │ │ ├── __init__.py
│ │ │ ├── dependencies.py
│ │ │ ├── github.py
│ │ │ ├── google.py
│ │ │ └── jwt.py
│ │ ├── routers/
│ │ │ ├── auth.py
│ │ │ └── tasks.py
│ │ ├── schemas/
│ │ │ ├── __init__.py
│ │ │ └── task.py
│
├── taskflow/
│ ├── App.css
│ ├── App.js
│ ├── App.test.js
│ ├── index.css
│ ├── index.js
│ ├── logo.svg
│ ├── reportWebVitals.js
│ └── setupTests.js
│ ├── public/
│ │ └── index.html
│ ├── src/
│ │ ├── Components/
│ │ │ ├── ButtonGithub.jsx
│ │ │ ├── ButtonGoogle.jsx
│ │ │ └── Header.jsx
│ │ ├── Images/
│ │ │ ├── avatar.png
│ │ │ ├──beneficio1.png
│ │ │ ├──beneficio2.png
│ │ │ ├── beneficio3.png
│ │ │ ├── GithubLogo.svg.webp
│ │ │ ├── Gmail.svg.webp
│ │ │ ├── HomeHero.png
│ │ │ └── Preview.png
│ │ ├── Pages/
│ │ │ ├── Dashboard.jsx
│ │ │ ├── home.jsx
│ │ │ └── Login.jsx
│ │ ├── styles/
│ │ │ ├── dashboard.css
│ │ │ ├──home.css
│ │ │ └── login.css
│
└── .gitignore

## Convenciones de Código

### Backend 

**Ejemplo 1: Función de creación de tarea**
```python
@router.post("/", status_code=status.HTTP_201_CREATED, response_model=TaskResponse)
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
) -> TaskResponse: 
    """
    Crea una nueva tarea para el usuario autenticado.

    Args:
        task (TaskCreate): Datos de la tarea a crear
        db (Session): Conexión a la base de datos
        current_user (Usuario): Usuario que está creando la tarea

    Returns:
        TaskResponse: La tarea que se acaba de crear
    """
    # Buscar estado "Pendiente"
    estado_pendiente = db.query(Estado).filter(
        Estado.nombre == "Pendiente"
    ).first()
    
    # Crear la nueva tarea
    nueva_tarea = Task(
        usuario_id=current_user.usuario_id,
        titulo=task.titulo,
        descripcion=task.descripcion,
        prioridad=task.prioridad,
        fecha_estimada=task.fecha_estimada,
        tiempo=task.tiempo,
        estado_id=estado_pendiente.estado_id,
        creado=datetime.now(),
        actualizado=datetime.now()
    )
    
    # Guardar en base de datos
    db.add(nueva_tarea)
    db.commit()
    db.refresh(nueva_tarea)
    
    return nueva_tarea
```

**Ejemplo 2: Función para obtener usuario**
```python
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    """
    Obtiene el usuario desde el token JWT.

    Args:
        token (str): Token de autenticación
        db (Session): Conexión a base de datos

    Returns:
        Usuario: El usuario autenticado

    Raises:
        HTTPException: Si el token es inválido o el usuario no existe
    """
    # Decodificar el token
    payload = decode_access_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido"
        )
    
    # Obtener ID del usuario desde el token
    user_id = int(payload.get("sub"))
    
    # Buscar usuario en la base de datos
    usuario = db.query(Usuario).filter(
        Usuario.usuario_id == user_id
    ).first()
    
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    return usuario
```

### Frontend

**Ejemplo 1: Agregar tareas nuevas al boton de guardar**
```jsx
const handleSaveTask = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                alert("No estás autenticado");
                return;
            }

            console.log("token enviado: ", token);

            const response = await fetch("http://localhost:8000/tasks/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    titulo: taskData.titulo,
                    descripcion: taskData.descripcion,
                    prioridad: Number(taskData.prioridad),
                    fecha_estimada: taskData.fecha_estimada,
                    tiempo: Number(taskData.tiempo)
                })
            });

            if(!response.ok) {
                throw new Error("Error al crear la tarea");
            }

            const nuevaTarea = await response.json();
```

**Ejemplo 2: Panel de actividades**
```css
.activities-panel {
    height: 100%;
    width: 100%;
    background: rgba(15, 15, 20, 0.85);
    border-radius: 20px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--border-soft);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
    position: relative;
}

.activities-header h2{
    color: var(--accent);
    font-size: 24px;
    margin-bottom: 16px;
}

.activities-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 14px;
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 4px;
}

.activities-content p{
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
}

.activities-content span{
    font-size: 14px;
    opacity: 0.8;
}

.activities-footer {
    margin-top: auto;
}

.manage-tasks-btn {
    width: 100%;
    padding: 14px;
    border-radius: 14px;
    background: var(--accent);
    color: #000;
    font-weight: 700;
    border: none;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.manage-tasks-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0, 255, 255, 0.3);
}
```