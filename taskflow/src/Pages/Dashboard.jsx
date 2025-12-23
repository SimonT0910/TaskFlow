import React, { useState } from "react";
import "../styles/dashboard.css";
import Header from "../Components/Header";

export default function Dashboard(){
    //Control del mes y año en el calendario
    const [currentDate, setCurrentDate] = useState(new Date());
    const [activePanel, setActivePanel] = useState(null);
    
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

                                <button className="add-task-btn">
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
        </div>
    );
}   