//Landing page
import React from "react";
import { useNavigate } from "react-router-dom";

export default function home() {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/Login");
    };

    return (
        <div className="home">
            <section className="home-hero">
                <h1>TaskFlow</h1>
                <p>
                    Organiza tus tareas, optimiza tu tiempo y deja que la IA
                    te ayude a ser más productivo.
                </p>

                <button onClick={handleLogin}>
                    Iniciar sesión
                </button>
            </section>

            <section className="home-benefits">
                <div className="benefit">
                    <h3>Organización inteligente</h3>
                    <p>
                        Administra tareas, prioridadesy fechas sin perder el control.
                    </p>
                </div>

                <div className="benefit">
                    <h3>IA que te ayuda</h3>
                    <p>
                        Recibe sugerencias y recomendaciones automáticas para mejorar tu flujo de trabajo.
                    </p>
                </div>

                <div className="benefit">
                    <h3>Calendario integrado</h3>
                    <p>
                        Visualiza tus tareas y eventos en un solo lugar.
                    </p>
                </div>
            </section>

            <section className="home-preview">
                <h2>¿Por qué usar TaskFlow?</h2>
                <p>
                    TaskFlow combina gestión de tareas, calendario e inteligencia artificial
                    para ayudarte a cumplir tus objetivos diarios sin estrés.
                </p>

                <div className="preview-images">
                    <div className="image-placeholder">Imagen 1</div>
                    <div className="image-placeholder">Imagen 2</div>
                    <div className="image-placeholder">Imagen 3</div>
                </div>
            </section>

            <section className="home-cta">
                <h2>Empieza a mejorar tu productividad hoy</h2>
                <button onClick={handleLogin}>
                    Comenzar ahora
                </button>
            </section>
        </div>
    );
}