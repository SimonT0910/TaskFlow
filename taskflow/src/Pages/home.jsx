//Pagina principal para probar el inicio de sesion (sera cambiada con el tiempo)
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home(){
    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/Login"); 
    };

    return(
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #00121a, #000000)",
            color: "#e6f7fb",
            fontFamily: "Poppins, Arial, sans-serif",
            padding: 24
        }}>
            <div style={{
                textAlign: "center",
                borderRadius: 16,
                padding: "48px 36px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
                background: "rgba(10,10,12,0.6)",
                width: "min(900px, 90%)"
            }}>
                <h1 style={{fontSize: 56, margin: 0, color: "#00f0ff", letterSpacing: ".6px"}}>TaskFlow</h1>
                <p style={{color: "#9aa0a6", marginTop: 8, fontSize: 16}}>
                    Bienvenido 
                </p>
                <button
                onClick={handleBack}
                style={{
                    marginTop: 30,
                    padding: "12px 24px",
                    borderRadius: 10,
                    border: "none",
                    fontSize: 16,
                    cursor: "pointer",
                    backgroundColor: "#00f0ff",
                    color: "black",
                    transition: "0.2s ease",
                    fontWeight: "bold",
                }}
                onMouseOver={(e) => (e.target.style.opacity = 0.8)}
                onMouseOut={(e) => (e.target.style.opacity = 1)}
                >
                </button>
            </div>
        </div>
    );
}