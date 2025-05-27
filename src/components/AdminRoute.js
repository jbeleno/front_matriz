import React from "react";
import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario) {
    // No logueado
    return <Navigate to="/login" />;
  }

  if (usuario.rol !== "admin") {
    // Logueado pero no es admin
    return <Navigate to="/" />;
  }

  return children;
}

export default AdminRoute;
