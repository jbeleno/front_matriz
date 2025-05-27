import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Admin from "./components/Admin";
import AdminRoute from "./components/AdminRoute";
import VerificacionPendiente from "./components/VerificacionPendiente";
import HomeEvaluador from "./components/HomeEvaluador";
import CrearMatriz from "./components/CrearMatriz";
import CrearRiesgos from "./components/CrearRiesgos";
import ObjetivosAfectadosPorMatriz from "./components/ObjetivosAfectadosPorMatriz";
import DetalleMatriz from "./components/DetalleMatriz";
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verificacion" element={<VerificacionPendiente />} />
        <Route path="/evaluador" element={<HomeEvaluador />} />
        <Route path="/crear-matriz" element={<CrearMatriz />} />
        <Route path="/crear-riesgos/:idMatriz" element={<CrearRiesgos />} />
        <Route path="/objetivos-afectados/:idMatriz" element={<ObjetivosAfectadosPorMatriz />} />
        <Route path="/matriz/:idMatriz" element={<DetalleMatriz />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
