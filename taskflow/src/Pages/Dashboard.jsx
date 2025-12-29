import React, { useEffect, useState } from "react";
import "../styles/dashboard.css";
import Header from "../Components/Header";

export default function Dashboard(){
    //Control del mes y año en el calendario
    const [currentDate, setCurrentDate] = useState(new Date());
    const [activePanel, setActivePanel] = useState(null);

    //Conexion con el boton de nueva tarea
    const [showTaskModal, setShowTaskModal] = useState(false);

    //Componente para el boton de guardar la tarea
    const [taskData, setTaskData] = useState({
        titulo: "",
        descripcion: "",
        prioridad: "Media",
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

    //Función para guardar las tareas
    const handleSaveTask = async () => {
        try {
            const token = localStorage.getItem("token");

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

    //Guarda el Token desde el frontend
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            localStorage.setItem("token", token);
            window.history.replaceState({}, document.title, "/app");
        }
    }, []);

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

                                <div className="activities-content empty">
                                    <p>No tienes tareas pendientes</p>
                                    <span>Estás libre</span>
                                </div>

                                <div className="activities-footer">
                                    <button className="manage-tasks-btn">
                                        Adminitrar tareas
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
        </div>
    );
}   