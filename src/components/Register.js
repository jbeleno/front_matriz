import React, { useState } from "react";
import { register } from "../api";
import { useNavigate } from "react-router-dom";

import "../AuthForm.css";

function Register() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(nombre, correo, contraseña);
      navigate("/login");
    } catch (err) {
      setError("No se pudo registrar. ¿Correo ya registrado?");
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          required
        />
        <button type="submit">Registrarse</button>
      </form>
      {error && <p style={{color: "red"}}>{error}</p>}
      <button onClick={handleBackToLogin} style={{marginTop: "10px"}}>
        Volver al login
      </button>
    </div>
  );
}

export default Register;
