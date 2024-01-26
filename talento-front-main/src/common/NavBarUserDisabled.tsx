import React from "react";
import "../styles/NavbarDesh.css";

export const NavBarUserDisabled: React.FC = () => {
  const eliminarUser = () => {
    sessionStorage.removeItem("user");
  };

  return (
    <>
      <div>
        <body className="body2">
          <nav id="navDisabled">
            <div className="icon_digital"></div>
            <div id="logo">TECAZUAY</div>
            <label htmlFor="drop" className="toggle">
              Menu
            </label>
            <input type="checkbox" id="drop" />
            <ul className="menu">
              <li className="liExit">
                <label htmlFor="drop" className="toggle">
                  Cerrar Sesión
                </label>
                <a href="/inicio" onClick={eliminarUser}>
                  <div className="ExitM"></div>
                </a>
              </li>
            </ul>
          </nav>
        </body>
        <div className="FondoDeshabilitado"></div>
      </div>
    </>
  );
};
