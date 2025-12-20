import React from "react";
import avatar from "../Images/avatar.png";

export default function TopBar() {
    return (
        <header className="topbar">
            <h1 className="topbar-title">TaskFlow</h1>

            <img
                src={avatar}
                alt="Perfil"
                className="profile-avatar"
            />
        </header>
    );
}