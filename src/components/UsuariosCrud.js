import React, { useEffect, useState } from "react";
import "../AdminPanel.css";
import axios from "axios";

const API_URL = "https://backmatriz-production.up.railway.app";

function UsuariosCrud() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ nombre: "", correo: "", contrasena: "", rol: "usuario" });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const fetchUsuarios = async () => {
    const res = await axios.get(`${API_URL}/usuarios/`);
    setUsuarios(res.data);
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      let data = { ...form };
      if (editId && !form.contrasena) {
        delete data.contrasena;
      }
      if (editId) {
        await axios.put(`${API_URL}/usuarios/${editId}`, data);
      } else {
        await axios.post(`${API_URL}/usuarios/`, data);
      }
      setForm({ nombre: "", correo: "", contrasena: "", rol: "usuario" });
      setEditId(null);
      fetchUsuarios();
    } catch (err) {
      setError("Error al guardar usuario");
    }
  };

  const handleEdit = (usuario) => {
    setForm({ nombre: usuario.nombre, correo: usuario.correo, contrasena: "", rol: usuario.rol });
    setEditId(usuario.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/usuarios/${id}`);
    fetchUsuarios();
  };

  return (
    <div style={{marginBottom: 40}}>
      <h3>Usuarios</h3>
      <form onSubmit={handleSubmit} style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
        <input name="correo" placeholder="Correo" value={form.correo} onChange={handleChange} required />
        <input name="contrasena" placeholder="Contraseña" value={form.contrasena} onChange={handleChange} required={!editId} type="password" />
        <select name="rol" value={form.rol} onChange={handleChange}>
          <option value="usuario">usuario</option>
          <option value="admin">admin</option>
          <option value="evaluador">evaluador</option>
        </select>
        <button type="submit">{editId ? "Actualizar" : "Crear"}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ nombre: "", correo: "", contrasena: "", rol: "usuario" }); }}>Cancelar</button>}
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <div className="admin-table-wrapper">
        <table border="1" cellPadding="6">
          <thead>
          <tr>
            <th>ID</th><th>Nombre</th><th>Correo</th><th>Rol</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td><td>{u.nombre}</td><td>{u.correo}</td><td>{u.rol}</td>
              <td>
                <button
                  onClick={() => handleEdit(u)}
                  disabled={u.rol === "admin"}
                  style={u.rol === "admin" ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(u.id)}
                  disabled={u.rol === "admin"}
                  style={u.rol === "admin" ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsuariosCrud;
