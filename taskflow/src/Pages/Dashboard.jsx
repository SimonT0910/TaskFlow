import React, { useState } from "react";
import "../styles/dashboard.css";
import Sidebar from "../Components/Sidebar";
import TopBar from "../Components/TopBar";

export default function Dashboard(){
    //Control del mes y año en el calendario
    const [currentDate, setCurrentDate] = useState(new Date());
    
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
        <div className="dashboard-layoult">
            <Sidebar/>

            <div className="dashboard-main">
                <TopBar />

                <div className="calendar-container">
                    {/* Header del calendario */}
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

                    {/* Calendario */}
                    <div className="calendar-grid">
                        {/* Dias */}
                        <div className="calendar-days">
                            <div></div>
                            <div>Lunes</div>
                            <div>Martes</div>
                            <div>Miercoles</div>
                            <div>Jueves</div>
                            <div>Viernes</div>
                        </div>

                        {/* Horas + Celdas */}
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
            </div>
        </div>
    );
}   