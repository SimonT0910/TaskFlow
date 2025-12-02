//Importaciones importantes.
import React from "react"; //Trae la biblioteca principal de React necesaria para trabajar.
import "../styles/login.css"; //Importa lo que este en la carpeta Styles.
import ButtonGoogle from "../Components/ButtonGoogle.jsx"; //Importa lod dos botones y sus respectivos componentes.
import ButtonGithub from "../Components/ButtonGithub";

/*Lo que se ve en pantalla con cada una de las propiedades que va a tener la pagina
estas son diferentes variables que se van a ver en la parte dellogin principal*/

function Login(){
    return(
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">TaskFlow</h1>
                    <p className="login-subtitle">Tu prodcutividad, impulsada por IA</p>

                    <ButtonGoogle />
                    <ButtonGithub />

                    <div className="login-footer">
                        <small>¿Necesitas ayuda? <a href="/register">Soporte</a></small>
                    </div>
                </div>
            </div>
    );
}

//Exportacion final para poder utilizar esto en diferentes archivos
export default Login;