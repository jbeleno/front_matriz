import React, { useEffect, useState } from "react";
import "../AdminPanel.css";
import axios from "axios";

const API_URL = "https://backmatriz-production.up.railway.app";

function EmpresasCrud() {
  const [empresas, setEmpresas] = useState([]);
  const [form, setForm] = useState({ nombre: "", telefono: "", correo: "" });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const fetchEmpresas = async () => {
    const res = await axios.get(`${API_URL}/empresas/`);
    setEmpresas(res.data);
  };

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editId) {
        await axios.put(`${API_URL}/empresas/${editId}`, form);
      } else {
        await axios.post(`${API_URL}/empresas/`, form);
      }
      setForm({ nombre: "", telefono: "", correo: "" });
      setEditId(null);
      fetchEmpresas();
    } catch (err) {
      setError("Error al guardar empresa");
    }
  };

  const handleEdit = (empresa) => {
    setForm({ nombre: empresa.nombre, telefono: empresa.telefono || "", correo: empresa.correo || "" });
    setEditId(empresa.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/empresas/${id}`);
    fetchEmpresas();
  };

  return (
    <div style={{marginBottom: 40}}>
      <h3>Empresas</h3>
      <form onSubmit={handleSubmit} style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
        <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
        <input name="correo" placeholder="Correo" value={form.correo} onChange={handleChange} />
        <button type="submit">{editId ? "Actualizar" : "Crear"}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ nombre: "", telefono: "", correo: "" }); }}>Cancelar</button>}
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <div className="admin-table-wrapper">
        <table border="1" cellPadding="6" style={{marginTop: 10, width: '100%'}}>
          <thead>
            <tr>
              <th>ID</th><th>Nombre</th><th>Teléfono</th><th>Correo</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empresas.map(e => (
              <tr key={e.id}>
                <td>{e.id}</td><td>{e.nombre}</td><td>{e.telefono}</td><td>{e.correo}</td>
                <td>
                  <button onClick={() => handleEdit(e)}>Editar</button>
                  <button onClick={() => handleDelete(e.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EmpresasCrud;
