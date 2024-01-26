import { Route, Redirect, Switch } from "react-router-dom";
import Home from "./home/Home";
import { Toast } from "primereact/toast";
import React, { useRef } from "react";
import { NavBarDoc } from "../../common/NavBarDoc";
import { NavBarUserDisabled } from "../../common/NavBarUserDisabled";
import { NavBar } from "../../common/NavBar";
import PersonaContext from "../Persona/PersonaContext";
import ContratoContext from "../Contrato/ContratoContext";
import InstruccFormalContext from "../Instruc_Formal/Instrucc_FormalContext";
import HorarioContext from "../Horario/HorarioContext";
import CapacitacionesContext from "../Capacitaciones/CapacitacionesContext";
import EvaDocente from "../Eva_Docente/EvaDocente";
import CargaFamiliarContext from "../CargaFamiliar/CargaFamiliarContext";
import Experiencia from "../Experiencia/Experiencia";
import HabilidadesContext from "../Habilidades/HabilidadesContext";
import PublicacionesContext from "../Publicaciones/PublicacionesContext";
import ResumenDocente from "../ResumenDocente2/ResumenDocente";
import Footer from "../../common/Footer";
import Recomendaciones from "../Recomendaciones/RecomendacionesContext";
import VDocentes from "../VDocentes/VDocentes";
import Resumen from "../Resumen/Resumen";
import ContratoDes from "../VistasDesahibilitadas/ContratoDes";
import PublicacionesDes from "../VistasDesahibilitadas/PublicacionesDes";
import CargaContextDes from "../VistasDesahibilitadas/CargaFamiliarDes";
import CapacitacionesContextDes from "../VistasDesahibilitadas/CapacitacionDes";
import EvaluacionDes from "../VistasDesahibilitadas/EvaluacionDes";
import ExperienciaDes from "../VistasDesahibilitadas/ExperienciaDes";
import HabilidadContextDes from "../VistasDesahibilitadas/HabilidadDes";
import HorarioContextDes from "../VistasDesahibilitadas/HorarioDes";
import InstruccionContextDes from "../VistasDesahibilitadas/InstruccionDes";
import RecomendacionContextDes from "../VistasDesahibilitadas/RecomendacionDes";
import PersonaContextDes from "../VistasDesahibilitadas/PersonaDes";
import Filtros from "../Resumen/Filtros";
import { NavBarDocente } from "../../common/NavBarDocente";

export const DashboardRouter = () => {
  //Datos del sessionStorage
  const userData = sessionStorage.getItem("user");
  const userObj = JSON.parse(userData || "{}");
  const rol = userObj.rol;
  const toast = useRef<Toast>(null);

  return (
    <>
      <Toast ref={toast} />
      <main>
        <div>
          <div>
            <Switch>
              <Route path="/dashboard/home">
                {rol === 1 ? (
                  <>
                    <NavBar />
                    <Home />
                  </>
                ) : rol === 2 ? (
                  <>
                    <NavBarDoc />
                    <Home />
                  </>
                ) : rol === 3 ? (
                  <>
                    <NavBarDocente />
                    <Home />
                  </>
                ) : (
                  <>
                    <NavBar />
                  </>
                )}
              </Route>
              <Route path="/login">
                {rol === 1 ? (
                  <NavBar />
                ) : rol === 2 ? (
                  <NavBarDoc />
                ) : rol === 3 ? (
                  <NavBarDocente />
                ) : (
                  <NavBarUserDisabled />
                )}
              </Route>
              <Route path="/ficha">
                {rol === 1 ? (
                  <>
                    <NavBar />
                    <PersonaContext />
                  </>
                ) : rol === 2 ? (
                  <>
                    <NavBarDoc />
                  </>
                ) : rol === 3 ? (
                  <>
                    <NavBarDocente />
                    <PersonaContext />
                  </>
                ) : (
                  <NavBarUserDisabled />
                )}
              </Route>
              <Route path="/contrato">
                {rol === 1 ? (
                  <>
                    <NavBar />
                    <ContratoContext />
                  </>
                ) : rol === 2 ? (
                  <>
                    <NavBarDoc />
                    <ContratoContext />
                  </>
                ) : rol === 3 ? (
                  <>
                    <NavBarDocente />
                    <ContratoContext />
                  </>
                ) : (
                  <NavBarUserDisabled />
                )}
              </Route>
              <Route path="/instruccion">
                {rol === 1 ? (
                  <>
                    <NavBar />
                    <InstruccFormalContext />
                  </>
                ) : rol === 2 ? (
                  <>
                    <NavBarDoc />
                  </>
                ) : rol === 3 ? (
                  <>
                    <NavBarDocente />
                    <InstruccFormalContext />
                  </>
                ) : (
                  <NavBarUserDisabled />
                )}
              </Route>
              <Route path="/horario">
                {rol === 1 ? (
                  <>
                    <NavBar />
                    <HorarioContext />
                  </>
                ) : rol === 2 ? (
                  <>
                    <NavBarDoc />
                    <HorarioContext />
                  </>
                ) : rol === 3 ? (
                  <>
                    <NavBarDocente />
                    <HorarioContext />
                  </>
                ) : (
                  <NavBarUserDisabled />
                )}
              </Route>
              <Route path="/carga">
                {rol === 1 ? (
                  <>
                    <NavBar />
                    <CargaFamiliarContext />
                  </>
                ) : rol === 2 ? (
                  <>
                    <NavBarDoc />
                  </>
                ) : rol === 3 ? (
                  <>
                    <NavBarDocente />
                    <CargaFamiliarContext />
                  </>
                ) : (
                  <NavBarUserDisabled />
                )}
              </Route>
              <Route path="/capacitaciones">
                {rol === 1 ? (
                  <>
                    <NavBar />
                    <CapacitacionesContext />
                  </>
                ) : rol === 2 ? (
                  <>
                    <NavBarDoc />
                  </>
                ) : rol === 3 ? (
                  <>
                    <NavBarDocente />
                    <CapacitacionesContext />
                  </>
                ) : (
                  <NavBarUserDisabled />
                )}
              </Route>
              <Route path="/experiencia">
                {rol === 1 ? (
                  <>
                    <NavBar />
                    <Experiencia />
                  </>
                ) : rol === 2 ? (
                  <>
                    <NavBarDoc />
                  </>
                ) : rol === 3 ? (
                  <>
                    <NavBarDocente />
                    <Experiencia />
                  </>
                ) : (
                  <NavBarUserDisabled />
                )}
              </Route>
              <Route path="/evaluacion">
                {rol === 1 ? (
                  <>
                    <NavBar />
                    <EvaDocente />
                  </>
                ) : rol === 2 ? (
                  <>
                    <NavBarDoc />
                  </>
                ) : rol === 3 ? (
                  <>
                    <NavBarDocente />
                    <EvaDocente />
                  </>
                ) : (
                  <NavBarUserDisabled />
                )}
              </Route>
              <Route path="/habilidad">
                {rol === 1 ? (
                  <>
                    <NavBar />
                    <HabilidadesContext />
                  </>
                ) : rol === 2 ? (
                  <>
                    <NavBarDoc />
                  </>
                ) : rol === 3 ? (
                  <>
                    <NavBarDocente />
                    <HabilidadesContext />
                  </>
                ) : (
                  <NavBarUserDisabled />
                )}
              </Route>
              <Route path="/recomendacion">
                {rol === 1 ? (
                  <>
                    <NavBar />
                    <Recomendaciones />
                    <Footer />
                  </>
                ) : rol === 2 ? (
                  <>
                    <NavBarDoc />
                    <Footer />
                  </>
                ) : rol === 3 ? (
                  <>
                    <NavBarDocente />
                    <Recomendaciones />
                  </>
                ) : (
                  <NavBarUserDisabled />
                )}
              </Route>
              <Route path="/publicacion">
                {rol === 1 ? (
                  <>
                    <NavBar />
                    <PublicacionesContext />
                    <Footer />
                  </>
                ) : rol === 2 ? (
                  <>
                    <NavBarDoc />
                    <Footer />
                  </>
                ) : rol === 3 ? (
                  <>
                    <NavBarDocente />
                    <PublicacionesContext />
                  </>
                ) : (
                  <NavBarUserDisabled />
                )}
              </Route>
              <Route path="/resumen">
                {rol === 1 ? (
                  <>
                    <NavBar />
                  </>
                ) : rol === 2 ? (
                  <>
                    <NavBarDoc />
                    <Resumen />
                  </>
                ) : rol === 3 ? (
                  <>
                    <NavBarDocente />
                    <Resumen />
                  </>
                ) : (
                  <NavBarUserDisabled />
                )}
              </Route>
              <Route path="/docentes">
                {rol === 1 ? (
                  <>
                    <NavBar />
                    <VDocentes />
                  </>
                ) : rol === 2 ? (
                  <>
                    <NavBarDoc />
                    <VDocentes />
                  </>
                ) : (
                  <NavBarUserDisabled />
                )}
              </Route>
              <Route path="/resumendoc/:codigoDocente">
                {rol === 1 ? (
                  <>
                    <NavBar />
                    <ResumenDocente />
                  </>
                ) : rol === 2 ? (
                  <>
                    <NavBarDoc />
                    <ResumenDocente />
                  </>
                ) : (
                  <NavBarUserDisabled />
                )}
              </Route>
              <Route path="/capacitacionDes/:codigoCapacitacion">
                {rol === 1 ? (
                  <>
                    <NavBar />
                    <CapacitacionesContextDes />
                  </>
                ) : rol === 2 ? (
                  <>
                    <NavBarDoc />
                    <CapacitacionesContextDes />
                  </>
                ) : (
                  <NavBarUserDisabled />
                )}
              </Route>
              <Route path="/cargaDes/:codigoCarga">
                {rol === 1 ? (
                  <>
                    <NavBar />
                    <CargaContextDes />
                  </>
                ) : rol === 2 ? (
                  <>
                    <NavBarDoc />
                    <CargaContextDes />
                  </>
                ) : (
                  <NavBarUserDisabled />
                )}
              </Route>
              <Route path="/contratoDes/:codigoContrato">
                {rol === 1 ? (
                  <>
                    <NavBar />
                    <ContratoDes />
                  </>
                ) : rol === 2 ? (
                  <>
                    <NavBarDoc />
                    <ContratoDes />
                  </>
                ) : (
                  <NavBarUserDisabled />
                )}
              </Route>
              <Route path="/evaluacionDes/:codigoEvaluacion">
                {rol === 1 ? (
                  <>
                    <NavBar />
                    <EvaluacionDes />
                  </>
                ) : rol === 2 ? (
                  <>
                    <NavBarDoc />
                    <EvaluacionDes />
                  </>
                ) : (
                  <NavBarUserDisabled />
                )}
              </Route>
              <Route path="/experienciaDes/:codigoExperiencia">
                {rol === 1 ? (
                  <>
                    <NavBar />
                    <ExperienciaDes />
                  </>
                ) : rol === 2 ? (
                  <>
                    <NavBarDoc />
                    <ExperienciaDes />
                  </>
                ) : (
                  <NavBarUserDisabled />
                )}
              </Route>
              <Route path="/habilidadDes/:codigoHabilidad">
                {rol === 1 ? (
                  <>
                    <NavBar />
                    <HabilidadContextDes />
                  </>
                ) : rol === 2 ? (
                  <>
                    <NavBarDoc />
                    <HabilidadContextDes />
                  </>
                ) : (
                  <NavBarUserDisabled />
                )}
              </Route>
              <Route path="/horarioDes/:codigoHorario">
                {rol === 1 ? (
                  <>
                    <NavBar />
                    <HorarioContextDes />
                  </>
                ) : rol === 2 ? (
                  <>
                    <NavBarDoc />
                    <HorarioContextDes />
                  </>
                ) : (
                  <NavBarUserDisabled />
                )}
              </Route>
              <Route path="/instruccionDes/:codigoInstrucc">
                {rol === 1 ? (
                  <>
                    <NavBar />
                    <InstruccionContextDes />
                  </>
                ) : rol === 2 ? (
                  <>
                    <NavBarDoc />
                    <InstruccionContextDes />
                  </>
                ) : (
                  <NavBarUserDisabled />
                )}
              </Route>
              <Route path="/personaDes/:codigoPersona">
                {rol === 1 ? (
                  <>
                    <NavBar />
                    <PersonaContextDes />
                  </>
                ) : rol === 2 ? (
                  <>
                    <NavBarDoc />
                    <PersonaContextDes />
                  </>
                ) : (
                  <NavBarUserDisabled />
                )}
              </Route>
              <Route path="/publicacionDes/:codigoPublicacion">
                {rol === 1 ? (
                  <>
                    <NavBar />
                    <PublicacionesDes />
                  </>
                ) : rol === 2 ? (
                  <>
                    <NavBarDoc />
                    <PublicacionesDes />
                  </>
                ) : (
                  <NavBarUserDisabled />
                )}
              </Route>
              <Route path="/recomendacionDes/:codigoRecomendacion">
                {rol === 1 ? (
                  <>
                    <NavBar />
                    <RecomendacionContextDes />
                  </>
                ) : rol === 2 ? (
                  <>
                    <NavBarDoc />
                    <RecomendacionContextDes />
                  </>
                ) : (
                  <NavBarUserDisabled />
                )}
              </Route>

              <Route path="/filtros">
                {rol === 1 ? (
                  <>
                    <NavBar />
                    <Filtros />
                  </>
                ) : rol === 2 ? (
                  <>
                    <NavBarDoc />
                    <Filtros />
                  </>
                ) : (
                  <NavBarUserDisabled />
                )}
              </Route>

              <Route path="*">
                {rol === 1 ? (
                  <NavBar />
                ) : rol === 2 ? (
                  <NavBarDoc />
                ) : (
                  <NavBarUserDisabled />
                )}
                <Redirect to="/dashboard/home" />
              </Route>
            </Switch>
          </div>
        </div>
      </main>
    </>
  );
};
