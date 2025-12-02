//Importaciones importantes
import React from "react";
import gmailLogo from "../Images/Gmail.svg.webp"; //Se importa la imagen guardada de manera local.

//Crea una funcion la cual funcionara siempre que se de click sobre ella.
function ButtonGoogle(){
    const handleGoogleSignIn = () => {
        console.log("Iniciar flujo de Google"); 
        alert("Simulacion: iniciar sesión con Google"); //Muestra ventana emergente.
    };

//Aqui retorna el boton completo con la interaccion del usuario y ademas se le agrega la imagen guardada.
    return (
        <button className="login-btn gmail" onClick={handleGoogleSignIn}>
            <img
            src={gmailLogo}
            alt="Gmail/Google"
            className="icon"
            />
            Continuar con Google
        </button>
    );
}

export default ButtonGoogle;