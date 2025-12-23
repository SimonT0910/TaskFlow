import React from "react";
import avatar from "../Images/avatar.png";

export default function Header({setActivePanel}) {
    return (
        <header className="dashboard-header">
            <div className="header-left">
                <span className="logo">TaskFlow</span>

                <nav className="header-menu">
                    <button className="header-item"
                    onClick={() => setActivePanel("actividades")}>
                        📊 <span>Actividades</span>
                    </button>

                    <button className="header-item">
                        💬 <span>Chats</span>
                    </button>

                    <button className="header-item">
                        👥 <span>Equipos</span>
                    </button>

                    <button className="header-item">
                        🤖 <span>Ayuda con IA</span>
                    </button>
                </nav>
            </div>

            <div className="header-right">
                <div className="profile-avatar">
                    <img src={avatar} alt="Perfil" />
                </div>
            </div>
        </header >
    );
}