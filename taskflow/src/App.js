import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/home";
import Login from "./Pages/Login"; //Importa todo lo que se haya hecho en el archivo

export default function App(){
  return(
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/app" element={<div>App principal</div>} />
    </Routes>
    </BrowserRouter>
  );
}