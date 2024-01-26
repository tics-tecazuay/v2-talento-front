import { ReactElement } from "react";
import { Card } from "primereact/card";
import "../../../../styles/Login.css";

interface Props {
  children: ReactElement;
}

export function AuthCard(props: Props) {
  return (
    <div className="containerL mt-4rem mycontainer">
      <div
        id="prueba"
        className="d-flex justify-content-center align-items-center"
      >
        <Card id="cardLogin">
          <p id="pIniciar">INICIAR SESIÓN</p>
          <div
            className="col-md-4 col-10"
            style={{ backgroundColor: "white", borderRadius: "16px" }}
          >
            <div className="shadow-sm rounded p-3" style={{ width: "50px" }}>
              <div className="row">
                <div className="col-xl-12 col-md-12">
                  <img
                    src="https://eduv.tecazuay.edu.ec/pluginfile.php/1/theme_academi/logo/1671035251/LOGO%20CUADRADO_SIN%20FONDO.png"
                    alt="Imagen de inicio de sesión"
                    className="login-image"
                  />
                  {props.children}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
