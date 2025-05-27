import React, { useState } from "react";
import { login } from "../api";
import { useNavigate } from "react-router-dom";

import "../AuthForm.css";

function Login() {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await login(correo, contraseña);
      localStorage.setItem("usuario", JSON.stringify(res.data));
      if (res.data.rol === "admin") {
        navigate("/admin");
      } else if (res.data.rol === "evaluador") {
        navigate("/evaluador");
      } else {
        navigate("/verificacion");
      }
    } catch (err) {
      setError("Correo o contraseña incorrectos");
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="auth-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Entrar</button>
      </form>
      {error && <p style={{color: "red"}}>{error}</p>}
      <button onClick={handleRegister} style={{marginTop: "10px"}}>
        ¿No tienes cuenta? Regístrate
      </button>
    </div>
  );
}

export default Login;
