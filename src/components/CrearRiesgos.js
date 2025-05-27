import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../HomeEvaluador.css";

const API_URL = "https://backmatriz-production.up.railway.app";

function CrearRiesgos() {
  const { idMatriz } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    id_matriz: idMatriz,
    id_interno: "",
    descripcion: "",
    fase: "",
    causa: "",
    entregable: "",
    estimacion_probabilidad: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [fases, setFases] = useState([]);
  const [riesgos, setRiesgos] = useState([]);
  const [probabilidades, setProbabilidades] = useState([]);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario || usuario.rol !== "evaluador") {
      navigate("/login");
    }
    fetchFases();
    fetchRiesgos();
    fetchProbabilidades();
    // eslint-disable-next-line
  }, []);

  const fetchFases = async () => {
    try {
      const res = await axios.get(`${API_URL}/fases_afectadas/`);
      setFases(res.data);
    } catch {
      setFases([]);
    }
  };

  const fetchRiesgos = async () => {
    try {
      const res = await axios.get(`${API_URL}/riesgos/?skip=0&limit=100`);
      setRiesgos(res.data.filter(r => r.id_matriz === parseInt(idMatriz, 10)));
    } catch {
      setRiesgos([]);
    }
  };

  const fetchProbabilidades = async () => {
    try {
      const res = await axios.get(`${API_URL}/probabilidades/`);
      setProbabilidades(res.data);
    } catch {
      setProbabilidades([]);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validar que el id_interno no se repita para la matriz actual
    if (riesgos.some(r => r.id_interno === parseInt(form.id_interno, 10))) {
      setError("El ID interno ya existe para esta matriz. Debe ser único.");
      return;
    }

    if (!form.id_interno || !form.descripcion) {
      setError("ID interno y descripción son obligatorios.");
      return;
    }
    try {
      await axios.post(`${API_URL}/riesgos/`, {
        ...form,
        id_matriz: parseInt(idMatriz, 10),
        id_interno: parseInt(form.id_interno, 10),
        estimacion_probabilidad: form.estimacion_probabilidad ? parseInt(form.estimacion_probabilidad, 10) : null
      });
      setSuccess(true);
      setForm({
        ...form,
        id_interno: "",
        descripcion: "",
        fase: "",
        causa: "",
        entregable: "",
        estimacion_probabilidad: ""
      });
      fetchRiesgos();
    } catch (err) {
      setError("Error al crear el riesgo.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/riesgos/${id}`);
      fetchRiesgos();
    } catch {
      setError("Error al eliminar el riesgo.");
    }
  };

  return (
    <div className="evaluador-container">
      <h2>Crear riesgos para la matriz #{idMatriz}</h2>
      <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", gap: 16, marginTop: 20}}>
        <input
          name="id_interno"
          placeholder="ID interno"
          value={form.id_interno}
          onChange={handleChange}
          className="evaluador-input"
          required
        />
        <input
          name="descripcion"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleChange}
          className="evaluador-input"
          required
        />
        <select
          name="fase"
          value={form.fase}
          onChange={handleChange}
          className="evaluador-input"
        >
          <option value="">Selecciona una fase</option>
          {fases.map(f => (
            <option key={f.id} value={f.nombre}>{f.nombre}</option>
          ))}
        </select>
        <input
          name="causa"
          placeholder="Causa"
          value={form.causa}
          onChange={handleChange}
          className="evaluador-input"
        />
        <input
          name="entregable"
          placeholder="Entregable"
          value={form.entregable}
          onChange={handleChange}
          className="evaluador-input"
        />
        <select
          name="estimacion_probabilidad"
          value={form.estimacion_probabilidad}
          onChange={handleChange}
          className="evaluador-input"
          required
        >
          <option value="">Selecciona una probabilidad</option>
          {probabilidades.map(p => (
            <option key={p.id} value={p.valor_nivel}>
              {p.valor_nivel} - {p.nombre_descriptor}
            </option>
          ))}
        </select>
        {error && <div style={{color: "red"}}>{error}</div>}
        {success && <div style={{color: "green"}}>¡Riesgo creado!</div>}
        <div>
          <button type="submit" className="evaluador-btn">Agregar riesgo</button>
          <button
            type="button"
            className="evaluador-btn"
            style={{background: "#64748b"}}
            onClick={() => navigate(`/objetivos-afectados/${idMatriz}`)}
          >
            Siguiente
          </button>
        </div>
      </form>
      <h3>Riesgos agregados</h3>
      <div className="evaluador-table-wrapper">
        <table className="evaluador-table">
          <thead>
            <tr>
              <th>ID interno</th>
              <th>Descripción</th>
              <th>Fase</th>
              <th>Causa</th>
              <th>Entregable</th>
              <th>Probabilidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {riesgos.map(r => (
              <tr key={r.id}>
                <td>RF-{r.id_interno}</td>
                <td>{r.descripcion}</td>
                <td>{r.fase}</td>
                <td>{r.causa}</td>
                <td>{r.entregable}</td>
                <td>{r.estimacion_probabilidad}</td>
                <td>
                  <button
                    className="evaluador-btn"
                    style={{background: "#dc2626"}}
                    onClick={() => handleDelete(r.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {riesgos.length === 0 && (
              <tr>
                <td colSpan={7}>No hay riesgos agregados aún.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CrearRiesgos;
