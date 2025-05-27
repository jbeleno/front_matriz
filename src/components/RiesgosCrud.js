import React, { useEffect, useState } from "react";
import "../AdminPanel.css";
import axios from "axios";

const API_URL = "https://backmatriz-production.up.railway.app";

function RiesgosCrud() {
  const [riesgos, setRiesgos] = useState([]);
  const [form, setForm] = useState({ id_matriz: "", id_interno: "", descripcion: "", fase: "", causa: "", entregable: "", estimacion_probabilidad: "" });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const fetchRiesgos = async () => {
    const res = await axios.get(`${API_URL}/riesgos/`);
    setRiesgos(res.data);
  };

  useEffect(() => {
    fetchRiesgos();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editId) {
        await axios.put(`${API_URL}/riesgos/${editId}`, form);
      } else {
        await axios.post(`${API_URL}/riesgos/`, form);
      }
      setForm({ id_matriz: "", id_interno: "", descripcion: "", fase: "", causa: "", entregable: "", estimacion_probabilidad: "" });
      setEditId(null);
      fetchRiesgos();
    } catch (err) {
      setError("Error al guardar riesgo");
    }
  };

  const handleEdit = (riesgo) => {
    setForm({
      id_matriz: riesgo.id_matriz,
      id_interno: riesgo.id_interno,
      descripcion: riesgo.descripcion,
      fase: riesgo.fase || "",
      causa: riesgo.causa || "",
      entregable: riesgo.entregable || "",
      estimacion_probabilidad: riesgo.estimacion_probabilidad || ""
    });
    setEditId(riesgo.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/riesgos/${id}`);
    fetchRiesgos();
  };

  return (
    <div style={{marginBottom: 40}}>
      <h3>Riesgos</h3>
      <form onSubmit={handleSubmit} style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
        <input name="id_matriz" placeholder="ID Matriz" value={form.id_matriz} onChange={handleChange} required />
        <input name="id_interno" placeholder="ID Interno" value={form.id_interno} onChange={handleChange} required />
        <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} required />
        <input name="fase" placeholder="Fase" value={form.fase} onChange={handleChange} />
        <input name="causa" placeholder="Causa" value={form.causa} onChange={handleChange} />
        <input name="entregable" placeholder="Entregable" value={form.entregable} onChange={handleChange} />
        <input name="estimacion_probabilidad" placeholder="Estimación Probabilidad" value={form.estimacion_probabilidad} onChange={handleChange} />
        <button type="submit">{editId ? "Actualizar" : "Crear"}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ id_matriz: "", id_interno: "", descripcion: "", fase: "", causa: "", entregable: "", estimacion_probabilidad: "" }); }}>Cancelar</button>}
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <div className="admin-table-wrapper">
        <table border="1" cellPadding="6">
          <thead>
          <tr>
            <th>ID</th><th>ID Matriz</th><th>ID Interno</th><th>Descripción</th><th>Fase</th><th>Causa</th><th>Entregable</th><th>Estimación Probabilidad</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {riesgos.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td><td>{r.id_matriz}</td><td>{r.id_interno}</td><td>{r.descripcion}</td><td>{r.fase}</td><td>{r.causa}</td><td>{r.entregable}</td><td>{r.estimacion_probabilidad}</td>
              <td>
                <button onClick={() => handleEdit(r)}>Editar</button>
                <button onClick={() => handleDelete(r.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  );
}

export default RiesgosCrud;
