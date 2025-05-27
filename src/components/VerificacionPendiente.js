import React from "react";
import { useNavigate } from "react-router-dom";

function VerificacionPendiente() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <h2>Verificación pendiente</h2>
      <p>
        Tu cuenta está pendiente de verificación por un administrador.<br />
        Por favor, espera a que tu cuenta sea aprobada.
      </p>
      <button onClick={handleLogout} style={{marginTop: 20}}>
        Cerrar sesión
      </button>
    </div>
  );
}

export default VerificacionPendiente;
