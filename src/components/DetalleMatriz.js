import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../HomeEvaluador.css";

const API_URL = "https://backmatriz-production.up.railway.app";

function DetalleMatriz() {
  const { idMatriz } = useParams();
  const [matriz, setMatriz] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [riesgos, setRiesgos] = useState([]);
  const [objetivos, setObjetivos] = useState([]);
  const [mostrarObjetivos, setMostrarObjetivos] = useState(null);
  const [mitigaciones, setMitigaciones] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [riesgoMitigar, setRiesgoMitigar] = useState(null);
  const [formMitigacion, setFormMitigacion] = useState({
    tipo: "",
    nivel_riesgo: "",
    responsable: "",
    plan: "",
    tipo_respuesta: "sin respuesta"
  });
  const [mitigacionMostrar, setMitigacionMostrar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario || usuario.rol !== "evaluador") {
      navigate("/login");
    }
    fetchMatriz();
    fetchRiesgos();
    fetchObjetivos();
    fetchMitigaciones();
    // eslint-disable-next-line
  }, [idMatriz]);

  const fetchMatriz = async () => {
    try {
      const res = await axios.get(`${API_URL}/matrices/${idMatriz}`);
      setMatriz(res.data);
      // Traer empresa
      const empresaRes = await axios.get(`${API_URL}/empresas/${res.data.id_empresa}`);
      setEmpresa(empresaRes.data);
    } catch {
      setMatriz(null);
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

  const fetchObjetivos = async () => {
    try {
      const res = await axios.get(`${API_URL}/objetivos_afectados/?skip=0&limit=100`);
      setObjetivos(res.data);
    } catch {
      setObjetivos([]);
    }
  };

  const fetchMitigaciones = async () => {
    try {
      const res = await axios.get(`${API_URL}/mitigaciones/?skip=0&limit=100`);
      setMitigaciones(res.data);
    } catch {
      setMitigaciones([]);
    }
  };

  const objetivosPorRiesgo = (idRiesgo) =>
    objetivos.filter(o => o.id_riesgo === idRiesgo);

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

  const estadoRiesgo = (idRiesgo) => {
    return mitigaciones.some(m => m.id_riesgo === idRiesgo) ? "Mitigado" : "Pendiente";
  };

  const mitigarRiesgo = (riesgo) => {
    setRiesgoMitigar(riesgo);
    setModalAbierto(true);
    setFormMitigacion({
      tipo: "",
      nivel_riesgo: "",
      responsable: "",
      plan: "",
      tipo_respuesta: "sin respuesta"
    });
  };

  const enviarMitigacion = async () => {
    try {
      await axios.post(`${API_URL}/mitigaciones/`, {
        id_riesgo: riesgoMitigar.id,
        ...formMitigacion,
        nivel_riesgo: sumaProbabilidadImpacto(riesgoMitigar.id)
      });
      setModalAbierto(false);
      fetchMitigaciones(); // Refresca la lista de mitigaciones
    } catch (error) {
      alert("Error al mitigar el riesgo");
    }
  };

  const obtenerMitigacionPorRiesgo = (idRiesgo) => {
    return mitigaciones.find(m => m.id_riesgo === idRiesgo) || null;
  };

  return (
    <div className="evaluador-container">
      <button
        className="evaluador-btn"
        style={{ marginBottom: 16 }}
        onClick={() => navigate(-1)}
      >
        Volver
      </button>
      <h2>Detalle de la Matriz #{idMatriz}</h2>
      {matriz && empresa ? (
        <div style={{marginBottom: 24}}>
          <b>Nombre del proyecto:</b> {matriz.nombre_proyecto}<br />
          <b>Empresa:</b> {empresa.nombre}<br />
          <b>Descripción:</b> {matriz.descripcion}
        </div>
      ) : (
        <div>Cargando información de la matriz...</div>
      )}

      <h3>Riesgos</h3>
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
              <th>Estado</th>
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
                <td>{estadoRiesgo(r.id)}</td>
                <td>
                  <button
                    className="evaluador-btn"
                    onClick={() => setMostrarObjetivos(mostrarObjetivos === r.id ? null : r.id)}
                  >
                    {mostrarObjetivos === r.id ? "Ocultar objetivos" : "Ver objetivos"}
                  </button>
                  {estadoRiesgo(r.id) === "Pendiente" && (
                    <button
                      className="evaluador-btn"
                      style={{ marginLeft: 8, background: "#f2bcbc", color: "#a94442" }}
                      onClick={() => mitigarRiesgo(r)}
                    >
                      Mitigar
                    </button>
                  )}
                  {estadoRiesgo(r.id) === "Mitigado" && (
                    <button
                      className="evaluador-btn"
                      style={{ marginLeft: 8, background: "#b6fcb6", color: "#008000" }}
                      onClick={() => setMitigacionMostrar(obtenerMitigacionPorRiesgo(r.id))}
                    >
                      Ver mitigación
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {riesgos.length === 0 && (
              <tr>
                <td colSpan={7}>No hay riesgos registrados para esta matriz.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {mostrarObjetivos && (
        <div style={{marginTop: 16}}>
          <h4>Objetivos afectados para el riesgo seleccionado</h4>
          <div className="evaluador-table-wrapper">
            <table className="evaluador-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Estimación impacto</th>
                  <th>Probabilidad impacto</th>
                </tr>
              </thead>
              <tbody>
                {objetivosPorRiesgo(mostrarObjetivos).map(o => (
                  <tr key={o.id}>
                    <td>{o.nombre}</td>
                    <td>{o.estimacion_impacto ?? "-"}</td>
                    <td>{o.probabilidad_impacto ?? "-"}</td>
                  </tr>
                ))}
                {objetivosPorRiesgo(mostrarObjetivos).length === 0 && (
                  <tr>
                    <td colSpan={3}>No hay objetivos para este riesgo.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div style={{marginTop: 6, fontWeight: "bold", display: "flex", alignItems: "center", gap: 10}}>
            Suma de probabilidad de impacto: {sumaProbabilidadImpacto(mostrarObjetivos)}
            <span
              style={{
                background: nivelRiesgo(sumaProbabilidadImpacto(mostrarObjetivos)).fondo,
                color: nivelRiesgo(sumaProbabilidadImpacto(mostrarObjetivos)).color,
                padding: "2px 10px",
                borderRadius: 6,
                fontWeight: "bold",
                border: "1px solid #ccc"
              }}
            >
              {nivelRiesgo(sumaProbabilidadImpacto(mostrarObjetivos)).texto}
            </span>
          </div>
        </div>
      )}

      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Mitigar riesgo</h3>
            <p><b>Riesgo:</b> {riesgoMitigar?.descripcion}</p>
            <form
              onSubmit={e => {
                e.preventDefault();
                enviarMitigacion();
              }}
            >
              <div>
                <label>Tipo:</label>
                <select
                  value={formMitigacion.tipo}
                  onChange={e => setFormMitigacion({ ...formMitigacion, tipo: e.target.value })}
                  required
                  className="evaluador-input"
                >
                  <option value="">Selecciona tipo</option>
                  <option value="amenaza">Amenaza</option>
                  <option value="respuesta">Respuesta</option>
                </select>
              </div>
              <div>
                <label>Nivel de riesgo:</label>
                <span style={{ fontWeight: "bold", marginLeft: 8 }}>
                  {riesgoMitigar ? sumaProbabilidadImpacto(riesgoMitigar.id) : 0}
                </span>
                {riesgoMitigar && (
                  <span
                    style={{
                      marginLeft: 12,
                      background: nivelRiesgo(sumaProbabilidadImpacto(riesgoMitigar.id)).fondo,
                      color: nivelRiesgo(sumaProbabilidadImpacto(riesgoMitigar.id)).color,
                      padding: "2px 10px",
                      borderRadius: 6,
                      fontWeight: "bold",
                      border: "1px solid #ccc"
                    }}
                  >
                    {nivelRiesgo(sumaProbabilidadImpacto(riesgoMitigar.id)).texto}
                  </span>
                )}
              </div>
              <div>
                <label>Tipo de respuesta:</label>
                <select
                  value={formMitigacion.tipo_respuesta}
                  onChange={e => setFormMitigacion({ ...formMitigacion, tipo_respuesta: e.target.value })}
                  required
                  className="evaluador-input"
                >
                  <option value="">Selecciona tipo de respuesta</option>
                  <option value="evitar">Evitar</option>
                  <option value="mitigar">Mitigar</option>
                  <option value="trasnferir">Trasnferir</option>
                  <option value="aceptar">Aceptar</option>
                </select>
              </div>
              <div>
                <label>Responsable:</label>
                <input
                  type="text"
                  value={formMitigacion.responsable}
                  onChange={e => setFormMitigacion({ ...formMitigacion, responsable: e.target.value })}
                  className="evaluador-input"
                />
              </div>
              <div>
                <label>Plan:</label>
                <input
                  type="text"
                  value={formMitigacion.plan}
                  onChange={e => setFormMitigacion({ ...formMitigacion, plan: e.target.value })}
                  className="evaluador-input"
                />
              </div>
              <div style={{ marginTop: 16 }}>
                <button className="evaluador-btn" type="submit">Guardar</button>
                <button
                  className="evaluador-btn"
                  type="button"
                  style={{ marginLeft: 8, background: "#ccc", color: "#333" }}
                  onClick={() => setModalAbierto(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {mitigacionMostrar && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Mitigación registrada</h3>
            <p><b>Tipo:</b> {mitigacionMostrar.tipo}</p>
            <p><b>Nivel de riesgo:</b> {mitigacionMostrar.nivel_riesgo}</p>
            <p><b>Tipo de respuesta:</b> {mitigacionMostrar.tipo_respuesta}</p>
            <p><b>Responsable:</b> {mitigacionMostrar.responsable}</p>
            <p><b>Plan:</b> {mitigacionMostrar.plan}</p>
            <div style={{ marginTop: 16 }}>
              <button
                className="evaluador-btn"
                type="button"
                onClick={() => setMitigacionMostrar(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetalleMatriz;
