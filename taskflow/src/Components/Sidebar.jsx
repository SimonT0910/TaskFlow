import React from "react";

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-logo">TF</div>

            <nav className="sidebar-menu">
                <span className="active">
                    <span className="icon">📅</span>
                    <span className="label">Calendario</span>
                </span>

                <span>
                    <span className="icon">📊</span>
                    <span className="label">Actividades</span>
                </span>

                <span>
                    <span className="icon">💬</span>
                    <span className="label">Chats</span>
                </span>

                <span>
                    <span className="icon">👥</span>
                    <span className="label">Equipos</span>
                </span>

                <span>
                    <span className="icon">🤖</span>
                    <span className="label">Ayuda IA</span>
                </span>
            </nav>
        </aside>
    );
}