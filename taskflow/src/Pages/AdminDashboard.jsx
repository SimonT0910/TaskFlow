//Nuevo dashboard para el administrador y sus respectivos procesos
import React, { useEffect, useState } from "react";
import "../styles/dashboard.css";
import Header from "../Components/Header";

const DashboardAdmin = () => {
    const token = localStorage.getItem("token");

    const [activePanel, setActivePanel] = useState("actividades");
    const [taskEnteringId, setTaskEnteringId] = useState(null);
    const [animatingTaskId, setAnimatingTaskId] = useState(null);
    const [completedTask, setCompletedTask] = useState(null);
    const [dateError, setDateError] = useState("");

    const [currentDate, setCurrentDate] = useState(new Date());

    const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const changeMonth = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + direction);
        setCurrentDate(newDate);
    };

    const getTasksForDay = (date) => {
        return tasks.filter(t =>
            t.fecha_estimada &&
            new Date(t.fecha_estimada).toDateString() === date.toDateString()
        );
    };

    const handleTaskDrop = (taskId, date) => {
        console.log("Tarea", taskId, "movida a", date);
    };

    const [taskData, setTaskData] = useState({
        titulo: "",
        descripcion: "",
        prioridad: "2",
        fecha_estimada: "",
        tiempo: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setTaskData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveTask = () => {
        if (!taskData.titulo || !taskData.fecha_estimada) {
            setDateError("Título y fecha son obligatorios");
            return;
        }

        setDateError("");
        setShowTaskModal(false);
    };

    const texto = (p) => {
        if (p === 1) return "Alta";
        if (p === 2) return "Media";
        return "Baja";
    };

    const fechaCambio = (fecha) => {
        return new Date(fecha).toLocaleDateString();
    };

    const [tasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [usuarios, setUsuarios] = useState([]);

    const [usuariosSeleccionados, setUsuariosSeleccionados] = useState([]);
    const [showTaskModal, setShowTaskModal] = useState(false);

    //Función para traer la lista de usuarios que hay en la pagina web
    useEffect(() => {
        fetch("http://localhost:8000/users", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => setUsuarios(data));
    }, []);

    //Función para cuando el administrador asigne las tareas a los usuarios
    const handleAdminTask = async () => {
        try {
            await fetch("http://localhost:8000/adminTask/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...taskData,
                    usuarios_asignados: usuariosSeleccionados
                })
            });

            setShowTaskModal(false);
        } catch (error) {
            console.error(error);
            alert("No se pudo crear la tarea");
        }
    };

    return (
        <div className="dashboard-container">
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
                                                            <span className="task-title">{task.titulo}</span>
            
                                                            <div className="task-actions-right">
                                                                <div className="semaforo">
                                                                    <div className={`luz verde ${task.prioridad === 3 ? "activa" : ""}`} />
                                                                    <div className={`luz amarilla ${task.prioridad === 2 ? "activa" : ""}`} />
                                                                    <div className={`luz roja ${task.prioridad === 1 ? "activa" : ""}`} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
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
                                                                                    draggable={task.estado?.nombre !== "Finalizado"}
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
                                        Siguiente
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
                            </div>

                                <select
                                    multiple
                                    onChange={(e) =>
                                        setUsuariosSeleccionados(
                                            [...e.target.selectedOptions].map(o => Number(o.value))
                                        )
                                    }
                                >
                                    {usuarios.map(u => (
                                        <option key={u.usuario_id} value={u.usuario_id}>
                                            {u.nombre}
                                        </option>
                                    ))}
                                </select>

                                <button className="add-task-btn" onClick={handleAdminTask}>
                                    Asignar
                                </button>
                        </div>
                    )}
            </div>
        </div>
    );
};

export default DashboardAdmin;