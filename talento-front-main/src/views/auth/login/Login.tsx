import { AuthCard } from "../login/components/AuthCard";
import React, { useContext, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../../reducers/AuthContext";
import { AuthService } from "../../../services/Auth/AuthService";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import "../../../styles/Login.css";
import { ApiResponse } from "../../../interfaces/Auth/ApiResponse";

export function Login() {
  const toast = useRef<Toast>(null);
  const { dispatchUser }: any = useContext(AuthContext);
  const [auth, setAuth] = useState({ username: "", password: "" });
  const history = useHistory();

  const showError = (errorPrincipal: string, detalleError: string) => {
    toast.current?.show({
      severity: "error",
      summary: errorPrincipal,
      detail: detalleError,
      life: 3000,
    });
  };
  const handleSignIn = async () => {
    try {
      const resp = await AuthService.signin(auth);
  
      const rol = resp.rol.idRol;
      const id = resp.persona.id_persona;
  
      // Obtiene el objeto actual del sessionStorage
      const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");
  
      // Actualiza las propiedades necesarias en el objeto existente
      const updatedUser = { ...currentUser, id, rol, loggedIn: true };
  
      // Guarda el objeto actualizado en el sessionStorage
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
  
      dispatchUser({ type: "login", payload: resp.data });
      history.replace("/dashboard/home");
    } catch (error) {
      showError("ERROR", "Credenciales incorrectas");
    }
  };

  const handleGenerateToken = async () => {
    try {
      const resp: ApiResponse = await AuthService.login(auth);
  
      const rol = resp.rol.idRol;
      const id = resp.persona.id_persona;
  
      // Accede al token desde la propiedad jwtResponse
      const token = resp.jwtResponse.token;
  
      if (token) {
        // Obtiene el objeto actual del sessionStorage
        const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");
  
        // Actualiza la propiedad del token en el objeto existente
        const updatedUser = { ...currentUser, id, rol, token, loggedIn: true };
  
        // Guarda el objeto actualizado en el sessionStorage
        sessionStorage.setItem("user", JSON.stringify(updatedUser));
  
        dispatchUser({ type: "login", payload: resp.data });
        history.replace("/dashboard/home");
      } else {
        showError("ERROR", "Token no encontrado en la respuesta del servidor");
      }
    } catch (error) {
   //   showError("ERROR", "Error al generar el token.");
    }
  };
  

  const handleLogin = async (e: React.ChangeEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      // Ejecutar ambos métodos
      await Promise.all([ handleSignIn(),handleGenerateToken(),]);
      console.log(
        "Contenido de sessionStorage:",
        sessionStorage.getItem("user")
      );
    } catch (error) {
      showError("ERROR", "Error al procesar la solicitud");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLFormElement | HTMLInputElement>
  ) => {
    setAuth({
      ...auth,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <div className="header flex flex-col" id="header">
        <Toast ref={toast} />
        <AuthCard>
          <form onSubmit={handleLogin} autoComplete="off">
            <br />
            <div className="mb-2 p-1 d-flex border rounded">
              <InputText
                name="username"
                id="inputLogin"
                placeholder="Usuario"
                onChange={(e) => handleChange(e)}
              />
            </div>

            <div className="mb-2 p-1 d-flex border rounded">
              <InputText
                name="password"
                type="password"
                placeholder="Contraseña"
                id="inputLogin"
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="d-grid gap-2">
              <Button type="submit" className="btn btn-primary" id="btnLogin">
                Sign In
              </Button>
            </div>
          </form>
        </AuthCard>
      </div>
    </>
  );
}
