import React, { useEffect, useState } from "react";
import "../AdminPanel.css";
import axios from "axios";

const API_URL = "https://backmatriz-production.up.railway.app";

function MatricesCrud() {
  const [matrices, setMatrices] = useState([]);
  const [form, setForm] = useState({ nombre_proyecto: "", id_empresa: "" });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const fetchMatrices = async () => {
    const res = await axios.get(`${API_URL}/matrices/`);
    setMatrices(res.data);
  };

  useEffect(() => {
    fetchMatrices();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editId) {
        await axios.put(`${API_URL}/matrices/${editId}`, form);
      } else {
        await axios.post(`${API_URL}/matrices/`, form);
      }
      setForm({ nombre_proyecto: "", id_empresa: "" });
      setEditId(null);
      fetchMatrices();
    } catch (err) {
      setError("Error al guardar matriz");
    }
  };

  const handleEdit = (matriz) => {
    setForm({ nombre_proyecto: matriz.nombre_proyecto, id_empresa: matriz.id_empresa });
    setEditId(matriz.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/matrices/${id}`);
    fetchMatrices();
  };

  return (
    <div style={{marginBottom: 40}}>
      <h3>Matrices</h3>
      <form onSubmit={handleSubmit} style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
        <input name="nombre_proyecto" placeholder="Nombre Proyecto" value={form.nombre_proyecto} onChange={handleChange} required />
        <input name="id_empresa" placeholder="ID Empresa" value={form.id_empresa} onChange={handleChange} required />
        <button type="submit">{editId ? "Actualizar" : "Crear"}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ nombre_proyecto: "", id_empresa: "" }); }}>Cancelar</button>}
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <div className="admin-table-wrapper">
        <table border="1" cellPadding="6">
          <thead>
          <tr>
            <th>ID</th><th>Nombre Proyecto</th><th>ID Empresa</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {matrices.map(m => (
            <tr key={m.id}>
              <td>{m.id}</td><td>{m.nombre_proyecto}</td><td>{m.id_empresa}</td>
              <td>
                <button onClick={() => handleEdit(m)}>Editar</button>
                <button onClick={() => handleDelete(m.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  );
}

export default MatricesCrud;
