import React, { useEffect, useState } from "react";
import "../AdminPanel.css";
import axios from "axios";

const API_URL = "https://backmatriz-production.up.railway.app";

function ObjetivosAfectadosCrud() {
  const [objetivos, setObjetivos] = useState([]);
  const [form, setForm] = useState({ id_riesgo: "", nombre: "", estimacion_impacto: "", probabilidad_impacto: "" });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const fetchObjetivos = async () => {
    const res = await axios.get(`${API_URL}/objetivos_afectados/`);
    setObjetivos(res.data);
  };

  useEffect(() => {
    fetchObjetivos();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editId) {
        await axios.put(`${API_URL}/objetivos_afectados/${editId}`, form);
      } else {
        await axios.post(`${API_URL}/objetivos_afectados/`, form);
      }
      setForm({ id_riesgo: "", nombre: "", estimacion_impacto: "", probabilidad_impacto: "" });
      setEditId(null);
      fetchObjetivos();
    } catch (err) {
      setError("Error al guardar objetivo afectado");
    }
  };

  const handleEdit = (objetivo) => {
    setForm({
      id_riesgo: objetivo.id_riesgo,
      nombre: objetivo.nombre,
      estimacion_impacto: objetivo.estimacion_impacto || "",
      probabilidad_impacto: objetivo.probabilidad_impacto || ""
    });
    setEditId(objetivo.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/objetivos_afectados/${id}`);
    fetchObjetivos();
  };

  return (
    <div style={{marginBottom: 40}}>
      <h3>Objetivos Afectados</h3>
      <form onSubmit={handleSubmit} style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
        <input name="id_riesgo" placeholder="ID Riesgo" value={form.id_riesgo} onChange={handleChange} required />
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
        <input name="estimacion_impacto" placeholder="Estimación Impacto" value={form.estimacion_impacto} onChange={handleChange} />
        <input name="probabilidad_impacto" placeholder="Probabilidad Impacto" value={form.probabilidad_impacto} onChange={handleChange} />
        <button type="submit">{editId ? "Actualizar" : "Crear"}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ id_riesgo: "", nombre: "", estimacion_impacto: "", probabilidad_impacto: "" }); }}>Cancelar</button>}
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <div className="admin-table-wrapper">
        <table border="1" cellPadding="6">
          <thead>
          <tr>
            <th>ID</th><th>ID Riesgo</th><th>Nombre</th><th>Estimación Impacto</th><th>Probabilidad Impacto</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {objetivos.map(o => (
            <tr key={o.id}>
              <td>{o.id}</td><td>{o.id_riesgo}</td><td>{o.nombre}</td><td>{o.estimacion_impacto}</td><td>{o.probabilidad_impacto}</td>
              <td>
                <button onClick={() => handleEdit(o)}>Editar</button>
                <button onClick={() => handleDelete(o.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  );
}

export default ObjetivosAfectadosCrud;
