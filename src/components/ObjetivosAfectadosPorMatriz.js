import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../HomeEvaluador.css";

const API_URL = "https://backmatriz-production.up.railway.app";

function ObjetivosAfectadosPorMatriz() {
  const { idMatriz } = useParams();
  const navigate = useNavigate();
  const [riesgos, setRiesgos] = useState([]);
  const [objetivos, setObjetivos] = useState([]);
  const [impactos, setImpactos] = useState([]);
  const [tiposObjetivo, setTiposObjetivo] = useState([]);
  const [form, setForm] = useState({
    id_riesgo: "",
    nombre: "",
    estimacion_impacto: "",
    probabilidad_impacto: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario || usuario.rol !== "evaluador") {
      navigate("/login");
    }
    fetchRiesgos();
    fetchObjetivos();
    fetchImpactos();
    fetchTiposObjetivo();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // Solo calcula si ambos están seleccionados
    if (form.id_riesgo && form.estimacion_impacto) {
      const riesgoSel = riesgos.find(r => r.id === parseInt(form.id_riesgo, 10));
      const impactoSel = impactos.find(i => i.valor_nivel === parseInt(form.estimacion_impacto, 10));
      if (riesgoSel && impactoSel) {
        const probabilidad = riesgoSel.estimacion_probabilidad || 0;
        setForm(f => ({
          ...f,
          probabilidad_impacto: impactoSel.valor_nivel * probabilidad
        }));
      }
    } else {
      setForm(f => ({ ...f, probabilidad_impacto: "" }));
    }
    // eslint-disable-next-line
  }, [form.id_riesgo, form.estimacion_impacto, riesgos, impactos]);

  const fetchRiesgos = async () => {
    try {
      const res = await axios.get(`${API_URL}/riesgos/?skip=0&limit=100`);
      setRiesgos(res.data.filter(r => r.id_matriz === parseInt(idMatriz, 10)));
    } catch {
      setRiesgos([]);
    }
  };

  const fetchObjetivos = async () => {
    try {
      const res = await axios.get(`${API_URL}/objetivos_afectados/?skip=0&limit=100`);
      setObjetivos(res.data);
    } catch {
      setObjetivos([]);
    }
  };

  const fetchImpactos = async () => {
    try {
      const res = await axios.get(`${API_URL}/impactos/`);
      setImpactos(res.data);
    } catch {
      setImpactos([]);
    }
  };

  const fetchTiposObjetivo = async () => {
    try {
      const res = await axios.get(`${API_URL}/tipos_objetivo/`);
      setTiposObjetivo(res.data);
    } catch {
      setTiposObjetivo([]);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!form.id_riesgo || !form.nombre) {
      setError("Debes seleccionar un riesgo y un objetivo.");
      return;
    }

    // Validar que el objetivo no se repita para el mismo riesgo (excepto si es el mismo que se está editando)
    if (
      objetivos.some(
        o =>
          o.id_riesgo === parseInt(form.id_riesgo, 10) &&
          o.nombre === form.nombre &&
          o.id !== editId
      )
    ) {
      setError("Este objetivo ya está registrado para el riesgo seleccionado.");
      return;
    }

    try {
      if (editId) {
        await axios.put(`${API_URL}/objetivos_afectados/${editId}`, {
          ...form,
          id_riesgo: parseInt(form.id_riesgo, 10),
          estimacion_impacto: form.estimacion_impacto ? parseInt(form.estimacion_impacto, 10) : null,
          probabilidad_impacto: form.probabilidad_impacto ? parseInt(form.probabilidad_impacto, 10) : null
        });
      } else {
        await axios.post(`${API_URL}/objetivos_afectados/`, {
          ...form,
          id_riesgo: parseInt(form.id_riesgo, 10),
          estimacion_impacto: form.estimacion_impacto ? parseInt(form.estimacion_impacto, 10) : null,
          probabilidad_impacto: form.probabilidad_impacto ? parseInt(form.probabilidad_impacto, 10) : null
        });
      }
      setSuccess(true);
      setForm({
        id_riesgo: "",
        nombre: "",
        estimacion_impacto: "",
        probabilidad_impacto: ""
      });
      setEditId(null);
      fetchObjetivos();
    } catch {
      setError("Error al guardar el objetivo afectado.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/objetivos_afectados/${id}`);
      fetchObjetivos();
      setSuccess(false);
      setError("");
    } catch {
      setError("Error al eliminar el objetivo.");
    }
  };

  // Filtra los objetivos por riesgo
  const objetivosPorRiesgo = (idRiesgo) =>
    objetivos.filter(o => o.id_riesgo === idRiesgo);

  const tiposDisponiblesParaRiesgo = (idRiesgo) => {
    if (!idRiesgo) return tiposObjetivo;
    const usados = objetivosPorRiesgo(parseInt(idRiesgo, 10)).map(o => o.nombre);
    // Si está editando, permite también el tipo actual
    if (editId) {
      const objetivoEdit = objetivos.find(o => o.id === editId);
      return tiposObjetivo.filter(
        t => !usados.includes(t.nombre) || (objetivoEdit && t.nombre === objetivoEdit.nombre)
      );
    }
    return tiposObjetivo.filter(t => !usados.includes(t.nombre));
  };

  const sumaProbabilidadImpacto = (idRiesgo) => {
    return objetivosPorRiesgo(idRiesgo)
      .reduce((acc, obj) => acc + (obj.probabilidad_impacto ? Number(obj.probabilidad_impacto) : 0), 0);
  };

  const nivelRiesgo = (valor) => {
    if (valor > 80) return { texto: "Muy Alto", color: "#ff0000", fondo: "#ffcccc" };
    if (valor >= 51) return { texto: "Alto", color: "#a94442", fondo: "#f2bcbc" };
    if (valor >= 31) return { texto: "Medio", color: "#b8860b", fondo: "#ffe066" };
    if (valor >= 11) return { texto: "Bajo", color: "#008000", fondo: "#b6fcb6" };
    return { texto: "Muy Bajo", color: "#38761d", fondo: "#d9fcd9" };
  };

  return (
    <div className="evaluador-container">
      <h2>Objetivos afectados para la matriz #{idMatriz}</h2>
      <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", gap: 16, marginTop: 20}}>
        <select
          name="id_riesgo"
          value={form.id_riesgo}
          onChange={handleChange}
          className="evaluador-input"
          required
        >
          <option value="">Selecciona un riesgo</option>
          {riesgos.map(r => (
            <option key={r.id} value={r.id}>
              RF-{r.id_interno} - {r.descripcion}
            </option>
          ))}
        </select>
        <select
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          className="evaluador-input"
          required
          disabled={!form.id_riesgo}
        >
          <option value="">Selecciona un objetivo</option>
          {tiposDisponiblesParaRiesgo(form.id_riesgo).map(obj => (
            <option key={obj.id} value={obj.nombre}>
              {obj.nombre}
            </option>
          ))}
        </select>
        <select
          name="estimacion_impacto"
          value={form.estimacion_impacto}
          onChange={handleChange}
          className="evaluador-input"
          required
        >
          <option value="">Selecciona un impacto</option>
          {impactos.map(i => (
            <option key={i.id} value={i.valor_nivel}>
              {i.valor_nivel} - {i.nombre_descriptor}
            </option>
          ))}
        </select>
        <input
          name="probabilidad_impacto"
          placeholder="Probabilidad de impacto"
          value={form.probabilidad_impacto}
          className="evaluador-input"
          type="number"
          readOnly
        />
        {error && <div style={{color: "red"}}>{error}</div>}
        {success && <div style={{color: "green"}}>¡Objetivo afectado creado!</div>}
        <div>
          <button type="submit" className="evaluador-btn">
            {editId ? "Actualizar" : "Agregar objetivo"}
          </button>
          {editId && (
            <button
              type="button"
              className="evaluador-btn"
              style={{ background: "#64748b" }}
              onClick={() => {
                setEditId(null);
                setForm({
                  id_riesgo: "",
                  nombre: "",
                  estimacion_impacto: "",
                  probabilidad_impacto: ""
                });
                setError("");
                setSuccess(false);
              }}
            >
              Cancelar
            </button>
          )}
          <button
            type="button"
            className="evaluador-btn"
            style={{background: "#64748b"}}
            onClick={() => navigate("/evaluador")}
          >
            Terminar
          </button>
        </div>
      </form>
      <h3>Objetivos afectados por riesgo</h3>
      {riesgos.map(r => (
        <div key={r.id} style={{marginBottom: 20}}>
          <b>Riesgo RF-{r.id_interno}:</b> {r.descripcion}
          <div className="evaluador-table-wrapper">
            <table className="evaluador-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Estimación impacto</th>
                  <th>Probabilidad impacto</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {objetivosPorRiesgo(r.id).map(o => (
                  <tr key={o.id}>
                    <td>{o.nombre}</td>
                    <td>{o.estimacion_impacto ?? "-"}</td>
                    <td>{o.probabilidad_impacto ?? "-"}</td>
                    <td>
                      <button
                        className="evaluador-btn"
                        style={{ background: "#f59e42", marginRight: 4 }}
                        onClick={() => {
                          setEditId(o.id);
                          setForm({
                            id_riesgo: o.id_riesgo.toString(),
                            nombre: o.nombre,
                            estimacion_impacto: o.estimacion_impacto ? o.estimacion_impacto.toString() : "",
                            probabilidad_impacto: o.probabilidad_impacto ? o.probabilidad_impacto.toString() : ""
                          });
                          setError("");
                          setSuccess(false);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="evaluador-btn"
                        style={{ background: "#dc2626" }}
                        onClick={() => handleDelete(o.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {objetivosPorRiesgo(r.id).length === 0 && (
                  <tr>
                    <td colSpan={3}>No hay objetivos para este riesgo.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div style={{marginTop: 6, fontWeight: "bold", display: "flex", alignItems: "center", gap: 10}}>
            Suma de probabilidad de impacto: {sumaProbabilidadImpacto(r.id)}
            <span
              style={{
                background: nivelRiesgo(sumaProbabilidadImpacto(r.id)).fondo,
                color: nivelRiesgo(sumaProbabilidadImpacto(r.id)).color,
                padding: "2px 10px",
                borderRadius: 6,
                fontWeight: "bold",
                border: "1px solid #ccc"
              }}
            >
              {nivelRiesgo(sumaProbabilidadImpacto(r.id)).texto}
            </span>
          </div>
          {tiposDisponiblesParaRiesgo(r.id).length > 0 && (
            <div style={{color: "#dc2626", fontSize: "0.95em", marginTop: 4}}>
              Faltan: {tiposDisponiblesParaRiesgo(r.id).map(t => t.nombre).join(", ")}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ObjetivosAfectadosPorMatriz;
