import React from "react";
import "../styles/NavbarHome.css";
import { Link } from "react-router-dom";

export const NavBar: React.FC = () => {
  const eliminarUser = () => {
    sessionStorage.removeItem("user");
  };
  return (
    <>
      <div>
        <body className="body2">
          <nav>
            <div className="icon_digital"></div>
            <label htmlFor="drop" className="toggle">
              Menu
            </label>
            <input type="checkbox" id="drop" />
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link
                  className="nav-link text-white ls-1 text-uppercase fw-6 fs-22"
                  to="/home"
                  style={{
                    borderTopLeftRadius: "10px",
                    borderBottomLeftRadius: "10px",
                  }}
                >
                  HOME
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link text-white ls-1 text-uppercase fw-6 fs-22"
                  to="/ficha"
                >
                  FICHA PERSONAL
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link text-white ls-1 text-uppercase fw-6 fs-22"
                  to="/contrato"
                >
                  CONTRATO
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link text-white ls-1 text-uppercase fw-6 fs-22"
                  to="/instruccion"
                >
                  INSTRUCCION FORMAL
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link text-white ls-1 text-uppercase fw-6 fs-22"
                  to="/horario"
                >
                  DISTRIBUTIVO Y HORARIO
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link text-white ls-1 text-uppercase fw-6 fs-22"
                  to="/carga"
                >
                  CARGA FAMILIAR
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link text-white ls-1 text-uppercase fw-6 fs-22"
                  to="/capacitaciones"
                >
                  CAPACITACIONES
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link text-white ls-1 text-uppercase fw-6 fs-22"
                  to="/experiencia"
                >
                  EXPERIENCIA
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link text-white ls-1 text-uppercase fw-6 fs-22"
                  to="/evaluacion"
                >
                  EVALUACION DOCENTE
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link text-white ls-1 text-uppercase fw-6 fs-22"
                  to="/habilidad"
                >
                  HABILIDADES
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link text-white ls-1 text-uppercase fw-6 fs-22"
                  to="/recomendacion"
                >
                  RECOMENDACIONES
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link text-white ls-1 text-uppercase fw-6 fs-22"
                  to="/publicacion"
                >
                  PUBLICACIONES
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link text-white ls-1 text-uppercase fw-6 fs-22"
                  to="/docentes"
                >
                  Listado de Docentes
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link text-white ls-1 text-uppercase fw-6 fs-22"
                  to="/filtros"
                >
                  Filtros
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link text-white ls-1 text-uppercase fw-6 fs-22"
                  to="/inicio"
                  style={{
                    borderTopRightRadius: "10px",
                    borderBottomRightRadius: "10px",
                    marginRight: "5px",
                  }}
                  onClick={eliminarUser}
                >
                  LOG OUT
                </Link>
              </li>
            </ul>
          </nav>
        </body>
      </div>
    </>
  );
};
