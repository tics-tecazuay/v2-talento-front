import "../../styles/Bienvenida.css";
import React, { useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { useHistory } from "react-router-dom";

const Bienvenida = () => {
  const history = useHistory();
  const [seleccion, setSeleccion] = useState();
  const [isVisible, setIsVisible] = useState(false);
  const toast = useRef(null);

  const newUser = (e: any) => {
    setSeleccion(e.target.id.slice(0, -1));
    setIsVisible(true);
  };

  function handleClick() {
    history.push({
      pathname: "/auth/login",
    });
  }

  return (
    <>
      <div>
        <Toast ref={toast} />
      </div>
      <div className="header flex flex-col">
        <div className="container flex">
          <div className="header-content">
            <h1 className="text-white fw-6 header-title" id="design">
              INSTITUTO UNIVERSITARIO TECNOLÓGICO DEL AZUAY
            </h1>
            <h1 className="text-white fw-6 header-title" id="dg">
              TALENTO HUMANO
            </h1>
            <h1 className="text-white fw-6 header-title" id="innovacion">
              Bienvenidos a la plataforma de "Recursos Humanos" Del Instituto
              Universitario Tecnológico del Azuay Para ingresar debera ser
              miembro de la comunidad educativa @tecazuay.edu.ec
            </h1>
            <div className="btn-groups flex">
              <button
                type="button"
                className="btn-item bg-brown fw-4 ls-2"
                style={{
                  backgroundColor: "#004E9D",
                  border: "none",
                  color: "white",
                }}
                onClick={handleClick}
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                className="btn-item bg-dark fw-4 ls-2"
                style={{
                  backgroundColor: "#E5BB2A",
                  border: "none",
                  color: "white",
                }}
                onClick={newUser}
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Bienvenida;
