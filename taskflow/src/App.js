import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/home";
import Login from "./Pages/Login"; //Importa todo lo que se haya hecho en el archivo
import Dashboard from "./Pages/Dashboard";

export default function App(){
  return(
    <BrowserRouter>
    <Routes>
      {/* Landing */}
      <Route path="/" element={<Home />} />

      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* App principal (Dashboard) */}
      <Route path="/app" element={<Dashboard />} />
    </Routes>
    </BrowserRouter>
  );
}