import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Divider } from 'primereact/divider';
import '../../styles/Login.css'



function Login() {
  return (
    <body id="bodyLogin">
      <div>
      <Card id="cardLogin">
        <p id="pRecursos">Recursos Humanos</p>
        <p id="pIniciar">INICIAR SESIÓN</p>
        <Divider/>
        <p id="pLabel">
          Bienvenidos a la plataforma de "Recursos Humanos" del Instituto
          Superior Tecnológico Del Azuay. Para ingresar debe ser miembro de la
          comunidad educativa @tecazuay.edu.ec
        </p>
        <Divider/>
        <Button className="google p-0" aria-label="Google">
                        <i className="pi pi-google px-2"></i>
                        <span className="px-3">Google</span>
                    </Button>
      </Card>
    </div>
    </body>
    
  );
}

export default Login;
