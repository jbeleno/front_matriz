import axios from "axios";

const API_URL = "https://backmatriz-production.up.railway.app"; // Cambia si tu backend está en otro puerto

export const login = (correo, contraseña) =>
  axios.post(`${API_URL}/login`, { correo, contraseña });

export const register = (nombre, correo, contraseña) =>
  axios.post(`${API_URL}/usuarios/`, { nombre, correo, contrasena: contraseña });
