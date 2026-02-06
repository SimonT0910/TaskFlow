import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/home";
import Login from "./Pages/Login"; //Importa todo lo que se haya hecho en el archivo
import Dashboard from "./Pages/Dashboard";
import DashboardAdmin from "./Pages/AdminDashboard";

export default function App(){
  const isAdmin = localStorage.getItem("is_admin") === "true";
  return(
    <BrowserRouter>
    <Routes>
      {/* Landing */}
      <Route path="/" element={<Home />} />

      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* App principal (Dashboard) */}
      <Route path="/app" element={isAdmin ? <DashboardAdmin /> : <Dashboard />} />
    </Routes>
    </BrowserRouter>
  );
}