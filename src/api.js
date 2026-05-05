import axios from "axios";

// Configurable via .env (REACT_APP_API_URL). Falls back to local dev.
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export const login = (correo, contraseña) =>
  axios.post(`${API_URL}/login`, { correo, contraseña });

export const register = (nombre, correo, contraseña) =>
  axios.post(`${API_URL}/usuarios/`, { nombre, correo, contrasena: contraseña });
