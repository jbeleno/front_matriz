import React from "react";
import "../AdminPanel.css";
import { useNavigate } from "react-router-dom";
import UsuariosCrud from "./UsuariosCrud";
import EmpresasCrud from "./EmpresasCrud";
import MatricesCrud from "./MatricesCrud";
import RiesgosCrud from "./RiesgosCrud";
import ObjetivosAfectadosCrud from "./ObjetivosAfectadosCrud";
import ImpactosCrud from "./ImpactosCrud";
import ProbabilidadesCrud from "./ProbabilidadesCrud";
import FasesAfectadasCrud from "./FasesAfectadasCrud";

function Admin() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  return (
    <div className="admin-panel-container">
      <h2>Panel de Administración</h2>
      <p>Bienvenido, {usuario.nombre} (rol: {usuario.rol})</p>
      <button onClick={handleLogout} style={{marginBottom: 20}}>Cerrar sesión</button>
      <UsuariosCrud />
      <EmpresasCrud />
      <MatricesCrud />
      <RiesgosCrud />
      <ObjetivosAfectadosCrud />
      <ImpactosCrud />
      <ProbabilidadesCrud />
      <FasesAfectadasCrud />
    </div>
  );
}

export default Admin;
