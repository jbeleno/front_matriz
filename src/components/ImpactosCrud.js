import React, { useEffect, useState } from "react";
import "../AdminPanel.css";
import axios from "axios";

const API_URL = "https://backmatriz-production.up.railway.app";

function ImpactosCrud() {
  const [impactos, setImpactos] = useState([]);
  const [form, setForm] = useState({ valor_nivel: "", nombre_descriptor: "", descripcion: "" });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const fetchImpactos = async () => {
    const res = await axios.get(`${API_URL}/impactos/`);
    setImpactos(res.data);
  };

  useEffect(() => {
    fetchImpactos();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editId) {
        await axios.put(`${API_URL}/impactos/${editId}`, form);
      } else {
        await axios.post(`${API_URL}/impactos/`, form);
      }
      setForm({ valor_nivel: "", nombre_descriptor: "", descripcion: "" });
      setEditId(null);
      fetchImpactos();
    } catch (err) {
      setError("Error al guardar impacto");
    }
  };

  const handleEdit = (impacto) => {
    setForm({
      valor_nivel: impacto.valor_nivel,
      nombre_descriptor: impacto.nombre_descriptor,
      descripcion: impacto.descripcion || ""
    });
    setEditId(impacto.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/impactos/${id}`);
    fetchImpactos();
  };

  return (
    <div style={{marginBottom: 40}}>
      <h3>Impactos</h3>
      <form onSubmit={handleSubmit} style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
        <input name="valor_nivel" placeholder="Valor Nivel" value={form.valor_nivel} onChange={handleChange} required />
        <input name="nombre_descriptor" placeholder="Nombre Descriptor" value={form.nombre_descriptor} onChange={handleChange} required />
        <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} />
        <button type="submit">{editId ? "Actualizar" : "Crear"}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ valor_nivel: "", nombre_descriptor: "", descripcion: "" }); }}>Cancelar</button>}
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <div className="admin-table-wrapper">
        <table border="1" cellPadding="6">
          <thead>
          <tr>
            <th>ID</th><th>Valor Nivel</th><th>Nombre Descriptor</th><th>Descripción</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {impactos.map(i => (
            <tr key={i.id}>
              <td>{i.id}</td><td>{i.valor_nivel}</td><td>{i.nombre_descriptor}</td><td>{i.descripcion}</td>
              <td>
                <button onClick={() => handleEdit(i)}>Editar</button>
                <button onClick={() => handleDelete(i.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  );
}

export default ImpactosCrud;
