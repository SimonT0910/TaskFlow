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

    // Para identidicar entrada de actividades
    const [taskEnteringId, setTaskEnteringId] = useState(null); 
    const [bulkModal, setBulkModal] = useState(false); //Muestra modal para eliminación masiva
    const [completeCount, setCompleteCount] = useState(0);
    const [bulkDelete, setBulkDelete] = useState(null);
    
    //Controla el desplazamiento de las tareas para cambios de estados
    const [completedTask, setCompletedTask] = useState(null);
    const [animatingTaskId, setAnimatingTaskId] = useState(null);

    //Control del mes y año en el calendario
    const [currentDate, setCurrentDate] = useState(new Date());
    const [activePanel, setActivePanel] = useState(null);

    //Mensajes de error para fechas pasadas
    const [dateError, setDateError] = useState("");

    //Estados para el modal de ingreso de administrador
    const [showAdmin, setShowAdmin] = useState(false);
    const [password, setPassword] = useState("");

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

            if (past(taskData.fecha_estimada)){
                setDateError(`No es posible colocar actividades en una fecha anterior al día de hoy.
                    Fecha actual: ${getToday().toLocaleDateString()}`
                );
                return;
            };

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

            setTimeout(() => {
                setTaskEnteringId(null);
            }, 400);

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
            
            if (past(editTaskData.fecha_estimada)){
                setDateError(`No es posible colocar actividades en una fecha anterior al día de hoy.
                    Fecha actual: ${getToday().toLocaleDateString()}`
                );
                return;
            };

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
        try {
            const response = await fetch(
                `http://localhost:8000/tasks/delete/${taskId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Error al eliminar la tarea");
            }

            // Elimina la tarea del estado
            setTasks(prev => prev.filter(t => t.task_id !== taskId));
            setCompletedTask(null);

        } catch (error) {
            console.error("DELETE ERROR:", error);
            alert("No se pudo eliminar la tarea. Revisa el backend.");
        }
    };

    //Eliminar las tareas acumuladas como finalizadas
    const eliminarTodo = async () => {
        try {
            const response = await fetch(
                `http://localhost:8000/tasks/delete-completed`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Error al eliminar");
            }

            //Quitar del estado todas las finalizadas
            setTasks(prev =>
                prev.filter(t => t.estado?.nombre !== "Finalizado")
            );

            setBulkDelete(data.message);
            setBulkModal(false);
        } catch (error) {
            console.error(error);
            alert("Error eliminando tareas finalizadas")
        }
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
            setAnimatingTaskId(task.task_id);

            setTimeout(async () => {
                const response = await fetch(
                    `http://localhost:8000/tasks/${task.task_id}/estado`,
                    {
                        method: "PATCH",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error("Error al cambiar estado");
                }

                const updatedTask = await response.json();

                setTasks(prev =>
                    prev.map(t =>
                        t.task_id === updatedTask.task_id ? updatedTask : t
                    )
                );

                if (updatedTask.estado.nombre === "Finalizado") {
                    setCompletedTask(updatedTask);
                }

                setAnimatingTaskId(null);
            }, 400);

        } catch (error) {
            console.error(error);
            setAnimatingTaskId(null);
        }
    };

    //Filtrar las tareas por el día
    const formatLocalDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const getTasksForDay = (date) => {
        if (!Array.isArray(tasks)) return [];

        const dayString = formatLocalDate(date);
        const todayString = formatLocalDate(new Date());

        return tasks.filter(task => {
            if (!task.fecha_estimada) {
                return dayString === todayString;
            }
            return task.fecha_estimada.slice(0, 10) === dayString;
        });
    };

    //Calendario mensual
    const getMonthGrid = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const weeks = [];
        let week = [];

        //Convertimos domingo (0) a 7
        let startDay = firstDay.getDay();
        if (startDay === 0) startDay = 7;
        
        //Espacios vacios antes del primer dia real
        for (let i = 1; i < startDay; i++) {
            if(i<=5) week.push(null);
        }

        //Dias del mes
        for (let d = 1; d <= lastDay.getDate(); d++) {
            const current = new Date(year, month, d);
            const day = current.getDay();

            //Solo lunes a viernes
            if (day >= 1 && day <= 5) {
                week.push(current);
            }

            if (week.length === 5) {
                weeks.push(week);
                week=[];
            }
        }

        if (week.length > 0) {
            weeks.push(week);
        }

        return weeks;
    };

    const monthWeeks = getMonthGrid(currentDate);

    //Para el funcionamiento del drag-and-drop de las actividades del calendario
    const handleTaskDrop = async (taskId, date) => {
        try {
            const task = tasks.find(t => t.task_id === taskId);
            if (task?.admin_in) {
                alert("Esta tarea fue asignada por el administrador y no puede ser modificada");
                return;
            }

            if (!date) return;

            if (past(formatLocalDate(date))){
                setDateError(`No es posible colocar actividades en una fecha anterior al día de hoy.
                    Fecha actual: ${getToday().toLocaleDateString()}`
                );
                return;
            };

            const fromattedDate = formatLocalDate(date);

            const response = await fetch(
                `http://localhost:8000/tasks/${taskId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        fecha_estimada: fromattedDate
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Error actualizado fecha");
            }

            const updatedTask = await response.json();

            setTasks(prev => 
                prev.map(task =>
                    task.task_id === updatedTask.task_id
                    ? updatedTask
                    : task
                )
            );

        } catch (error) {
            console.error("Error al mover la tarea", error);
        }
    };

    //Devuelve la fecha de hoy sin hora
    const getToday = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
    };

    //Valida la fecha estimada para que no se escoja la fecha anterior al dia de hoy
    const past = (date) => {
        if (!date) return false;

        const selectedDate = new Date(date);
        selectedDate.setHours(0, 0, 0, 0);
        
        return selectedDate < getToday();
    }

    //Función para poder ingresar al dashboard administrativo con la contraseña
    const handleAdmin = async () => {
        try{
            const token = localStorage.getItem("token");

            const response = await fetch("http://localhost:8000/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    contraena: adminPassword
                })
            });

            if (!response.ok) {
                alert("Contraseña incorrecta");
                return;
            }

            localStorage.setItem("is_admin", "true");
            window.local.href = "/app";
        } catch (error) {
            console.error(error);
            alert("Error validando administrador")
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

                                    <button
                                        className="bulk-delete-btn"
                                        onClick={() => {
                                            const count = tasks.filter(
                                                t => t.estado?.nombre === "Finalizado"
                                            ).length;

                                            setCompleteCount(count);
                                            setBulkModal(true);
                                        }}
                                    >
                                        🗑️
                                    </button>
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
                                                    ${animatingTaskId === task.task_id ? "exit-right" : ""}
                                                `}
                                                onClick={() => {
                                                    if (task.estado?.nombre !== "Finalizado") {
                                                        setSelectedTask(task);
                                                    } else {
                                                        setCompletedTask(task);
                                                    }
                                                }}
                                            >
                                                <span className="task-title">
                                                    {task.titulo}
                                                    {task.admin_in && <span className="admin-icon">👤</span>}
                                                    </span>

                                                <div className="task-actions-right">
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

                                                    {task.estado?.nombre !== "Finalizado" && (
                                                        <button
                                                            className="advance-btn"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                avanzar(task);
                                                            }}
                                                        >
                                                            ➜
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="activities-footer">
                                    <button
                                        className="manage-tasks-btn"
                                        onClick={() => {
                                            setShowAdmin(true);
                                        }}
                                    >
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

                                <div className="month-calendar">
                                    <div className="calendar-header">
                                        {["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"].map(day => (
                                            <div key={day} className="header-cell">{day}</div>
                                        ))}
                                    </div>

                                    {monthWeeks.map((week, i) => (
                                        <div className="calendar-week" key={i}>
                                            {week.map((date, idx) => {

                                                const isToday = date && date.toDateString() === new Date().toDateString();

                                                return (
                                                    <div className="calendar-day" 
                                                    key={idx}
                                                    onDragOver={(e) => e.preventDefault()}
                                                    onDrop={(e) => {
                                                        const taskId = e.dataTransfer.getData("taskId");

                                                        if (!taskId) return;

                                                        handleTaskDrop(taskId, date);
                                                    }}
                                                    >
                                                        {date && (
                                                            <>
                                                                <div className={`day-number ${isToday ? "today" : ""}`}>
                                                                    {date.getDate()}
                                                                </div>

                                                                {getTasksForDay(date).map(task => (
                                                                    <div
                                                                        key={task.task_id}
                                                                        className={`calendar-task ${
                                                                            task.estado?.nombre === "Pendiente"
                                                                                ? "pending"
                                                                                : task.estado?.nombre === "En curso"
                                                                                ? "in-progress"
                                                                                : "done"
                                                                        }`}
                                                                        draggable={
                                                                            task.estado?.nombre !== "Finalizado" &&
                                                                            !task.admin_in
                                                                        }
                                                                        onDragStart={(e) => {
                                                                            e.dataTransfer.setData("taskId", task.task_id.toString());
                                                                        }}
                                                                        onClick={() => setSelectedTask(task)}
                                                                    >
                                                                        {task.titulo}
                                                                    </div>
                                                                ))}
                                                            </>
                                                        )}
                                                    </div>
                                                );
                                            })}
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
                    {dateError && (
                        <p className="date-error">
                            {dateError}
                        </p>
                    )}

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

                        {!selectedTask.admin_in && (
                            <button
                                className="btn-update"
                                onClick={() => {
                                    setTaskToEdit(selectedTask);
                                    setSelectedTask(null);
                                    setShowEditModal(true);
                                }}
                            >
                                Actualizar
                            </button>
                        )}
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

        {bulkModal && (
            <div className="task-modal-overlay">
                <div className="task-modal completed">
                    <h2>Eliminar tareas finalizadas</h2>

                    {completeCount === 0 ? (
                        <p>No hay tareas finalizadas para eliminar.</p>
                    ) : (
                        <p>
                            Se elimarán <b>{completeCount}</b> tareas finalizadas.
                            <br />
                            ¿Deseas continuar?
                        </p>
                    )}

                    <div className="task-actions">
                        {completeCount > 0 && (
                            <button
                                className="btn-delete"
                                onClick={eliminarTodo}
                            >
                                Eliminar todas
                            </button>
                        )}

                        <button
                            className="cancel-btn"
                            onClick={() => setBulkModal(false)}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )}

        {bulkDelete && (
            <div className="toast">
                {bulkDelete}
            </div>
        )}

        {showAdmin && (
            <div className="modal-overlay">
                <div className="modal">
                    <h2>Acceso administrador</h2>

                    <input
                        type="password"
                        placeholder="Contraseña del proyecto"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className="modal-actions">
                        <button
                            className="cancel-btn"
                            onClick={() => setShowAdmin(false)}
                        >
                            Cancelar
                        </button>

                        <button
                            className="add-task-btn"
                            onClick={handleAdmin}
                        >
                            Ingresar
                        </button>
                    </div>
                </div>
            </div>
        )}
        </div>
    ); 
};