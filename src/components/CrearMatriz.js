import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../HomeEvaluador.css";

const API_URL = "https://backmatriz-production.up.railway.app";

function CrearMatriz() {
  const navigate = useNavigate();
  const [empresas, setEmpresas] = useState([]);
  const [form, setForm] = useState({
    nombre_proyecto: "",
    id_empresa: "",
    descripcion: ""
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario || usuario.rol !== "evaluador") {
      navigate("/login");
    }
    fetchEmpresas();
    // eslint-disable-next-line
  }, []);

  const fetchEmpresas = async () => {
    try {
      const res = await axios.get(`${API_URL}/empresas/`);
      setEmpresas(res.data);
    } catch (err) {
      setEmpresas([]);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.nombre_proyecto || !form.id_empresa) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    try {
      const res = await axios.post(`${API_URL}/matrices/`, {
        ...form,
        id_empresa: parseInt(form.id_empresa, 10)
      });
      navigate(`/crear-riesgos/${res.data.id}`);
    } catch (err) {
      setError("Error al crear la matriz.");
    }
  };

  return (
    <div className="evaluador-container">
      <h2>Crear nueva matriz</h2>
      <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", gap: 16, marginTop: 20}}>
        <input
          name="nombre_proyecto"
          placeholder="Nombre del proyecto"
          value={form.nombre_proyecto}
          onChange={handleChange}
          className="evaluador-input"
          required
        />
        <select
          name="id_empresa"
          value={form.id_empresa}
          onChange={handleChange}
          className="evaluador-input"
          required
        >
          <option value="">Selecciona una empresa</option>
          {empresas.map(e => (
            <option key={e.id} value={e.id}>{e.nombre}</option>
          ))}
        </select>
        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleChange}
          className="evaluador-input"
          rows={3}
        />
        {error && <div style={{color: "red"}}>{error}</div>}
        <div>
          <button type="submit" className="evaluador-btn">Siguiente</button>
          <button type="button" className="evaluador-btn" style={{background: "#64748b"}} onClick={() => navigate("/evaluador")}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default CrearMatriz;
