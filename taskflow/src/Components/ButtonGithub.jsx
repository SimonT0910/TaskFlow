import React from "react";
import githubLogo from "../Images/GithubLogo.svg.webp";

function ButtonGithub(){
    const handleGithubSignIn = () => {
        window.location.href = "http://localhost:8000/auth/github";
    };

    return (
            <button className="login-btn github" onClick={handleGithubSignIn}>
                <img
                src={githubLogo}
                alt="GitHub"
                className="icon"
                />
                Continuar con GitHub
            </button>
        );
}

export default ButtonGithub;