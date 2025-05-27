import React, { useEffect, useState } from "react";
import axios from "axios";
import "../AdminPanel.css";

const API_URL = "https://backmatriz-production.up.railway.app";

function FasesAfectadasCrud() {
  const [fases, setFases] = useState([]);
  const [form, setForm] = useState({ nombre: "", descripcion: "" });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const fetchFases = async () => {
    try {
      const res = await axios.get(`${API_URL}/fases_afectadas/`);
      setFases(res.data);
    } catch {
      setFases([]);
    }
  };

  useEffect(() => {
    fetchFases();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.nombre) {
      setError("El nombre es obligatorio.");
      return;
    }
    try {
      if (editId) {
        await axios.put(`${API_URL}/fases_afectadas/${editId}`, form);
      } else {
        await axios.post(`${API_URL}/fases_afectadas/`, form);
      }
      setForm({ nombre: "", descripcion: "" });
      setEditId(null);
      fetchFases();
    } catch {
      setError("Error al guardar la fase afectada.");
    }
  };

  const handleEdit = (fase) => {
    setForm({ nombre: fase.nombre, descripcion: fase.descripcion });
    setEditId(fase.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/fases_afectadas/${id}`);
    fetchFases();
  };

  return (
    <div style={{marginBottom: 40}}>
      <h3>Fases Afectadas</h3>
      <form onSubmit={handleSubmit} style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
        <input
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <input
          name="descripcion"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleChange}
        />
        <button type="submit">{editId ? "Actualizar" : "Crear"}</button>
        {editId && (
          <button type="button" onClick={() => { setEditId(null); setForm({ nombre: "", descripcion: "" }); }}>
            Cancelar
          </button>
        )}
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <div className="admin-table-wrapper">
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {fases.map(f => (
              <tr key={f.id}>
                <td>{f.id}</td>
                <td>{f.nombre}</td>
                <td>{f.descripcion}</td>
                <td>
                  <button onClick={() => handleEdit(f)}>Editar</button>
                  <button onClick={() => handleDelete(f.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {fases.length === 0 && (
              <tr>
                <td colSpan={4}>No hay fases afectadas registradas.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FasesAfectadasCrud;
