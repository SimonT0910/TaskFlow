import React from "react";
import githubLogo from "../Images/GithubLogo.svg.webp";

function ButtonGithub(){
    const handleGithubSignIn = () => {
        console.log("Iniciar flujo de Github");
        alert("Simulacion: iniciar sesion con Github");
    };

    return (
        <button className="login-btn github" onClick={handleGithubSignIn}>
            <img
            src={githubLogo}
            alt="Github"
            className="icon"
            />
            Continuar con Github
        </button>
    );
}

export default ButtonGithub;