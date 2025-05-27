import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../HomeEvaluador.css";

const API_URL = "https://backmatriz-production.up.railway.app";

function HomeEvaluador() {
  const navigate = useNavigate();
  const [matrices, setMatrices] = useState([]);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario || usuario.rol !== "evaluador") {
      navigate("/login");
    } else {
      fetchMatrices();
    }
    // eslint-disable-next-line
  }, [navigate]);

  const fetchMatrices = async () => {
    try {
      const res = await axios.get(`${API_URL}/matrices/`);
      setMatrices(res.data);
    } catch (err) {
      setMatrices([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  const handleCrearMatriz = () => {
    navigate("/crear-matriz");
  };

  return (
    <div className="evaluador-container">
      <h2>Bienvenido Evaluador</h2>
      <p>Esta es la vista exclusiva para usuarios con el rol <b>evaluador</b>.</p>
      <button onClick={handleLogout} className="evaluador-btn" style={{marginTop: 20}}>
        Cerrar sesión
      </button>
      <hr />
      <h3>Matrices existentes</h3>
      <button onClick={handleCrearMatriz} className="evaluador-btn" style={{marginBottom: 10}}>
        Crear nueva matriz
      </button>
      <div className="evaluador-table-wrapper">
        <table className="evaluador-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre Proyecto</th>
              <th>Empresa</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {matrices.map(m => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>{m.nombre_proyecto}</td>
                <td>{m.id_empresa}</td>
                <td>{m.descripcion}</td>
                <td>
                  <button
                    className="evaluador-btn"
                    onClick={() => navigate(`/matriz/${m.id}`)}
                  >
                    Ver más
                  </button>
                </td>
              </tr>
            ))}
            {matrices.length === 0 && (
              <tr>
                <td colSpan={5}>No hay matrices registradas.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HomeEvaluador;
