//Landing page
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import HomeHero from "../Images/HomeHero.png";
import benefit1 from "../Images/beneficio1.png";
import benefit2 from "../Images/beneficio2.png";
import benefit3 from "../Images/beneficio3.png";
import preview from "../Images/Preview.png";

export default function Home() {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/Login");
    };

    /*Home hero que hace referencia a la explicacion de que hace la pagina web*/
    return (
        <div className="home">
            <section className="home-hero">
                <h1>TaskFlow</h1>
                <p>
                    Organiza tus tareas, optimiza tu tiempo y deja que la IA
                    te ayude a ser más productivo.
                </p>

                <img
                    src={HomeHero}
                    alt="Una idea clara de lo que se desea con la pagina web"
                />

                <button onClick={handleLogin}>
                    Iniciar sesión
                </button>
            </section>

            {/*Beneficios de utilizar la pagina web para diferentes tareas*/}
            <section className="home-benefits">
                <div className="benefit">
                    <h3>Organización inteligente</h3>
                    <p>
                        Administra tareas, prioridades y fechas sin perder el control.
                    </p>

                    <img
                        src={benefit1}
                        alt="Muestra del primer beneficio que presenta la pagina web"
                    />

                </div>

                <div className="benefit">
                    <h3>IA que te ayuda</h3>
                    <p>
                        Recibe sugerencias y recomendaciones automáticas para mejorar tu flujo de trabajo.
                    </p>

                    <img
                        src={benefit2}
                        alt="Muestra del segundo beneficio que presenta la pagina web"
                    />

                </div>

                <div className="benefit">
                    <h3>Calendario integrado</h3>
                    <p>
                        Visualiza tus tareas y eventos en un solo lugar.
                    </p>

                    <img
                        src={benefit3}
                        alt="Muestra del tercer beneficio que presenta la pagina web"
                    />

                </div>
            </section>

            {/*Una muestra de como se define la pagina web en diferentes ambitos*/}
            <section className="home-preview">
                <h2>¿Por qué usar TaskFlow?</h2>
                <p>
                    TaskFlow combina gestión de tareas, calendario e inteligencia artificial
                    para ayudarte a cumplir tus objetivos diarios sin estrés.
                </p>

                <img    
                    src={preview}
                    alt="Visualización del uso y la ayuda que proporciona usar la pagina web"
                />

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