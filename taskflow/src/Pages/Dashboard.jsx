import React, { useEffect, useState } from "react";
import "../styles/dashboard.css";
import Header from "../Components/Header";

export default function Dashboard(){
    //Token
    const token = localStorage.getItem("token");
    //Lista de tareas
    const [tasks, setTasks] = useState([]);
    //Tarea seleccionada
    const [selectedTask, setSelectedTask] = useState(null);

    // Para animaciones de entrada y salida de actividades
    const [taskEnteringId, setTaskEnteringId] = useState(null); //identifica la tarea que acaba de entrar
    const [taskLeavingId, setTaskLeavingId] = useState(null); //Identifica la tarea que se va a eliminar
    
    //Controla el desplazamiento de las tareas para cambios de estados
    const [completedTask, setCompletedTask] = useState(null);
    const [draggingTask, setDraggingTask] = useState(null);
    const [dragStartX, setDragStartX] = useState(0);
    const [dragX, setDragX] = useState({});

    //Control del mes y año en el calendario
    const [currentDate, setCurrentDate] = useState(new Date());
    const [activePanel, setActivePanel] = useState(null);

    //Componentes para la actualizacion de las tareas
    const [showEditModal, setShowEditModal] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [editTaskData, setEditTaskData] = useState({
        titulo: "",
        descripcion: "",
        fecha_estimada: "",
        tiempo: ""
    });

    //Traer las actividades para que se vean en el frontend
    useEffect(() => {
        if (!token) return;

        fetch("http://localhost:8000/tasks/", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => setTasks(data))
        .catch(err => console.error(err));
    }, [token]);

    //Cuando se abre el modal de la actualizacion caraga los datos
    useEffect(() => {
        if (taskToEdit) {
            setEditTaskData({
                titulo: taskToEdit.titulo,
                descripcion: taskToEdit.descripcion,
                fecha_estimada: taskToEdit.fecha_estimada?.split("T")[0] || "",
                tiempo: taskToEdit.tiempo || ""
            });
        }
    }, [taskToEdit]);

    //Conexion con el boton de nueva tarea
    const [showTaskModal, setShowTaskModal] = useState(false);

    //Componente para el boton de guardar la tarea
    const [taskData, setTaskData] = useState({
        titulo: "",
        descripcion: "",
        prioridad: "2",
        fecha_estimada: "",
        tiempo: ""
    });

    //Funcion para poder escribir en los inputs
    const handleChange = (e) => {
        setTaskData({
            ...taskData,
            [e.target.name]: e.target.value
        });
    };
    
    //Nombres de los meses
    const months = [
        "Enero", "Febrero", "Marzo", "Abril", 
        "Mayo", "Junio", "Julio", "Agosto", 
        "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    //Cambiar de mes
    const changeMonth = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + direction);
        setCurrentDate(newDate);
    };

    //Se utiliza para que el boton de guardado envie el token
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

            //Agrega la tarea al estado
            setTasks(prev => [...prev, nuevaTarea]);

            //Marca esta tarea como entrante
            setTaskEnteringId(nuevaTarea.task_id);

            //Limpiar el formulario
            setTaskData({
                titulo: "",
                descripcion: "",
                prioridad: "2",
                fecha_estimada: "",
                tiempo: ""
            });

            //Cerrar modal
            setShowTaskModal(false);
        } catch (error) {
            console.error(error);
            alert("No se pudo guardar la tarea")
        }
    };

    //Función para actualizar la tarea
    const handleUpdateTask = async () => {
        try{
            const response = await fetch(
                `http://localhost:8000/tasks/${taskToEdit.task_id}`,
                {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(editTaskData)
                }
            );

            const updatedTask = await response.json();

            setTasks(prev =>
                prev.map(t =>
                    t.task_id === updatedTask.task_id ? updatedTask : t
                )
            );

            setShowEditModal(false);
            setTaskToEdit(null);
        } catch (error) {
            console.error(error);
            alert("No se pudo actualizar la tarea");
        }
    };

    //Función para eliminar tareas
    const eliminarTarea = async (taskId) => {
        //Marca la tarea como saliendo
        setTaskLeavingId(taskId);

        setTimeout(async () => {
            await fetch(`http://localhost:8000/tasks/${taskId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            //Quita el estado
            setTasks(prev => prev.filter(t => t.task_id !== taskId));
            setSelectedTask(null);
            setTaskLeavingId(null);
        }, 400);
    };

    //Guarda el Token desde el frontend
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            localStorage.setItem("token", token);
            window.history.replaceState({}, document.title, "/app");
        }
    }, []);

    //Cambio de numero a texto para la prioridad
    const texto = (prioridad) => {
        switch (prioridad) {
            case 1:
                return "Alta";
            case 2:
                return "Media";
            case 3:
                return "Baja";
            default:
                return "No definida";
        }
    };

    //Cambio de fecha
    const fechaCambio = (fecha) => {
        if (!fecha) return "-";
        return fecha.split("T")[0]
    };

    //Función para cambiar de estado
    const avanzar = async (task) => {
  try {
    console.log("➡️ Avanzando tarea:", task.task_id, task.estado?.nombre);

    const response = await fetch(
      `http://localhost:8000/tasks/${task.task_id}/estado`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const updatedTask = await response.json();

    console.log("⬅️ Respuesta backend:", updatedTask.estado?.nombre);

    setTasks(prev =>
      prev.map(t =>
        t.task_id === updatedTask.task_id ? updatedTask : t
      )
    );

    if (updatedTask.estado.nombre === "Finalizado") {
      setCompletedTask(updatedTask);
    }
  } catch (error) {
    console.error(error);
  }
};


    return (
        <div className="dashboard-layout">
            <Header setActivePanel={setActivePanel}/>

            <div className="dashboard-main">
                <div className="content-grid">

                    <section className="left-panel">
                        {activePanel === "actividades" && (
                            <div className="activities-panel slide-in">
                                <div className="activities-header">
                                    <h2>📊 Actividades</h2>
                                </div>

                                <div className="activities-content">
                                    {tasks.length === 0 ? (
                                        <>
                                            <p>No tienes tareas pendientes</p>
                                            <span>Estás libre</span>
                                        </>
                                    ): (
                                        tasks.map(task => (
                                            <div
                                                key={task.task_id}
                                                className={`activities-card
                                                    ${taskEnteringId === task.task_id ? "enter-left" : ""}
                                                    ${taskLeavingId === task.task_id ? "exit-right" : ""}
                                                `}

                                                onMouseDown={(e) => {
                                                    setDraggingTask(task.task_id);
                                                    setDragStartX(e.clientX);
                                                }}

                                                onMouseMove={(e) => {
                                                    if (draggingTask !== task.task_id) return;

                                                    const diff = e.clientX -dragStartX;

                                                    //Solo permite arrastrar a la derecha
                                                    if (diff > 0) {
                                                        setDragX(prev => ({
                                                            ...prev,
                                                            [task.task_id]: diff
                                                        }));
                                                    }
                                                }}

                                                onMouseUp={() => {
                                                    if (draggingTask !== task.task_id) return;

                                                    const desplazamiento = dragX[task.task_id] || 0;

                                                    //Si pasa el umbral cambia de estado
                                                    if (desplazamiento > 100) {
                                                        avanzar(task);
                                                    }

                                                    //Reset visual
                                                    setDragX(prev => ({
                                                        ...prev,
                                                        [task.task_id]: 0
                                                    }));

                                                    setDraggingTask(null);
                                                }}

                                                onMouseLeave={() => {
                                                    //Seguridad si suelta fuera
                                                    setDraggingTask(null);
                                                    setDragX(prev => ({
                                                        ...prev,
                                                        [task.task_id]: 0
                                                    }));
                                                }}

                                                style = {{
                                                    transform: `translateX(${dragX[task.task_id] || 0}px)`,
                                                    transition: draggingTask === task.task_id
                                                        ? "none"
                                                        : "transform 0.3s ease"
                                                }}

                                                onClick={() => {
                                                    if (task.estado?.nombre !== "Finalizado") {
                                                        setSelectedTask(task);
                                                    }
                                                }}
                                            >
                                                <span>
                                                    {task.titulo}
                                                </span>

                                                <div className="semaforo">
                                                    <div className={`luz verde ${task.prioridad === 3 ? "activa" : ""}`} />
                                                    <div className={`luz amarilla ${task.prioridad === 2 ? "activa" : ""}`} />
                                                    <div className={`luz roja ${task.prioridad === 1 ? "activa" : ""}`} />

                                                </div>

                                                {task.estado?.nombre === "En curso" && (
                                                    <span className="estado-icon reloj">⏳</span>
                                                )}

                                                {task.estado?.nombre === "Finalizado" && (
                                                    <span className="estado-icon check">✅</span>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="activities-footer">
                                    <button className="manage-tasks-btn">
                                        Administrar tareas
                                    </button>
                                </div>
                            </div>
                        )}
                    </section>

                    <section className="right-panel">

                        <div className="calendar-container">

                            <div className="calendar-header">
                                <div className="calendar-title">
                                    <button onClick={() => changeMonth(-1)}>◀</button>
                                    <h2>
                                        {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                                    </h2>
                                    <button onClick={() => changeMonth(1)}>▶</button>
                                </div>

                                <button className="add-task-btn"
                                onClick={() => setShowTaskModal(true)}>
                                    + Nueva tarea
                                </button>
                            </div>

                            <div className="calendar-grid">
                                <div className="calendar-days">
                                    <div></div>
                                    <div>Lunes</div>
                                    <div>Martes</div>
                                    <div>Miércoles</div>
                                    <div>Jueves</div>
                                    <div>Viernes</div>
                                </div>

                                <div className="calendar-body">
                                    {[...Array(10)].map((_, hour) => (
                                        <div className="calendar-row" key={hour}>
                                            <div className="hour">{8 + hour}:00</div>

                                            {[...Array(5)].map((_, day) => (
                                                <div className="cell" key={day}></div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                    </section>
                </div>
            </div>
            {showTaskModal && (
            <div className="modal-overlay">
                <div className="modal">
                    <h2>Nueva tarea</h2>

                    <input type="text" 
                    name="titulo" 
                    placeholder="Título" 
                    value={taskData.titulo}
                    onChange={handleChange}
                    />

                    <textarea name="descripcion"                    
                    placeholder="Descripción"
                    value={taskData.descripcion}
                    onChange={handleChange}></textarea>

                    <select name="prioridad"
                    value={taskData.prioridad}
                    onChange={handleChange}>
                        <option value="">Prioridad</option>
                        <option value="1">Alta</option>
                        <option value="2">Media</option>
                        <option value="3">Baja</option>
                    </select>

                    <input type="date" 
                    name="fecha_estimada"
                    value={taskData.fecha_estimada}
                    onChange={handleChange}/>

                    <input type="number" 
                    name="tiempo"
                    placeholder="Tiempo estimado (horas)" 
                    value={taskData.tiempo}
                    onChange={handleChange}/>

                    <div className="modal-actions">
                        <button className="cancel-btn"
                        onClick={() => setShowTaskModal(false)}>
                            Cancelar
                        </button>

                        <button className="add-task-btn" onClick={handleSaveTask}>
                            Guardar
                        </button>
                    </div>
                </div>
            </div>
        )}

        {showEditModal && (
            <div className="modal-overlay">
                <div className="modal">
                    <h2>Actualizar tarea</h2>

                    <input
                        type="text"
                        name="titulo"
                        value={editTaskData.titulo}
                        onChange={(e) =>
                            setEditTaskData ({ ...editTaskData, titulo: e.target.value })
                        }
                    />

                    <textarea
                        name="descripcion"  
                        value={editTaskData.descripcion}
                        onChange={(e) =>
                            setEditTaskData({ ...editTaskData, descripcion: e.target.value })
                        }
                    />

                    <input
                        type="date"
                        value={editTaskData.fecha_estimada}
                        onChange={(e) =>
                            setEditTaskData({ ...editTaskData, fecha_estimada: e.target.value })
                        }
                    />

                    <input
                        type="number"
                        value={editTaskData.tiempo}
                        onChange={(e) => 
                            setEditTaskData({ ...editTaskData, tiempo: e.target.value })
                        }
                    />

                    <div className="modal-actions">
                        <button
                            className="cancel-btn"
                            onClick={() => setShowEditModal(false)}
                        >
                            Cancelar
                        </button>

                        <button
                            className="add-task-btn"
                            onClick={handleUpdateTask}
                        >
                            Guardar cambios
                        </button>
                    </div>    
                </div>
            </div>
        )}

        {selectedTask && (
            <div className="task-modal-overlay">
                <div className="task-modal">
                    <button className="close-btn" onClick={() => setSelectedTask(null)}>✕</button>

                    <h3>{selectedTask.titulo}</h3>

                    <div className="task-info">
                        <p><b>Descripción:</b> {selectedTask.descripcion}</p>
                        <p><b>Estado:</b> {selectedTask.estado?.nombre}</p>
                        <p><b>Prioridad:</b> {texto(selectedTask.prioridad)}</p>
                        <p><b>Fecha estimada:</b> {selectedTask.fecha_estimada}</p>
                        <p><b>Tiempo:</b> {selectedTask.tiempo}</p>
                        <p><b>Creado:</b> {fechaCambio(selectedTask.creado)}</p>
                        <p><b>Actualizado:</b> {fechaCambio(selectedTask.actualizado)}</p>
                    </div>

                    <div className="task-actions">
                        <button className="btn-ia" disabled>Ayuda con IA</button>
                        <button className="btn-update"
                            onClick={() => {
                                setTaskToEdit(selectedTask);
                                setSelectedTask(null);
                                setShowEditModal(true);
                            }}
                        >
                            Actualizar
                        </button>
                    </div>
                </div>
            </div>
        )}

        {completedTask && (
            <div className="task-modal-overlay">
                <div className="task-modal completed">
                    <h2>✅ Tarea finalizada</h2>

                    <p>
                        Has finalizado esta tarea.
                        Si deseas, puedes eliminarla de tu lista.
                    </p>

                    <div className="big-check">✔</div>

                    <button
                        className="btn-delete"
                        onClick={() => eliminarTarea(completedTask.task_id)}
                    >
                        Eliminar tarea
                    </button>

                    <button
                        className="cancel-btn"
                        onClick={() => setCompletedTask(null)}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        )}
        </div>
    ); 
};