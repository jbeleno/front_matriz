import React, { useEffect, useState } from "react";
import "../AdminPanel.css";
import axios from "axios";

const API_URL = "https://backmatriz-production.up.railway.app";

function ProbabilidadesCrud() {
  const [probabilidades, setProbabilidades] = useState([]);
  const [form, setForm] = useState({ valor_nivel: "", nombre_descriptor: "", descripcion: "" });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const fetchProbabilidades = async () => {
    const res = await axios.get(`${API_URL}/probabilidades/`);
    setProbabilidades(res.data);
  };

  useEffect(() => {
    fetchProbabilidades();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editId) {
        await axios.put(`${API_URL}/probabilidades/${editId}`, form);
      } else {
        await axios.post(`${API_URL}/probabilidades/`, form);
      }
      setForm({ valor_nivel: "", nombre_descriptor: "", descripcion: "" });
      setEditId(null);
      fetchProbabilidades();
    } catch (err) {
      setError("Error al guardar probabilidad");
    }
  };

  const handleEdit = (probabilidad) => {
    setForm({
      valor_nivel: probabilidad.valor_nivel,
      nombre_descriptor: probabilidad.nombre_descriptor,
      descripcion: probabilidad.descripcion || ""
    });
    setEditId(probabilidad.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/probabilidades/${id}`);
    fetchProbabilidades();
  };

  return (
    <div style={{marginBottom: 40}}>
      <h3>Probabilidades</h3>
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
          {probabilidades.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td><td>{p.valor_nivel}</td><td>{p.nombre_descriptor}</td><td>{p.descripcion}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Editar</button>
                <button onClick={() => handleDelete(p.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProbabilidadesCrud;
