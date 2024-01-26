import React, { useEffect, useState } from "react";
import cardHeader from "../../shared/CardHeader";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { IHabilidadesData } from "../../interfaces/Primary/IHabilidades";
import { PersonaService } from "../../services/PersonaService";
import { IPersona } from "../../interfaces/Primary/IPersona";
import { ICapacitaciones } from "../../interfaces/Primary/ICapacitaciones";
import { ICargaFamiliar } from "../../interfaces/Primary/ICargaFamiliar";
import { IContratoData } from "../../interfaces/Primary/IContrato";
import { IEvaDocente } from "../../interfaces/Primary/IEva_Docente";
import { IHorarioData } from "../../interfaces/Primary/IHorario";
import { IRecomendaciones } from "../../interfaces/Primary/Recomendaciones";
import { IExperiencia } from "../../interfaces/Primary/IExperiencia";
import { InstruccionFormalData } from "../../interfaces/Primary/IInstrucc_Formal";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { IPublicaciones } from "../../interfaces/Primary/IPublicaciones";
import PersonaCombinada from "../Persona/PersonaCombinada";

interface Params {
  codigoDocente: string;
}

function ResumenDocente() {
  const { codigoDocente } = useParams<Params>();

  const [persona, setPersona] = useState<IPersona | null>(null);
  const [capacitaciones, setCapacitaciones] = useState<ICapacitaciones[]>([]);
  const [cargaFamiliar, setCargaFamiliar] = useState<ICargaFamiliar[]>([]);
  const [contratos, setContratos] = useState<IContratoData[]>([]);
  const [evaluaciones, setEvaluaciones] = useState<IEvaDocente[]>([]);
  const [habilidades, setHabilidades] = useState<IHabilidadesData[]>([]);
  const [horarios, setHorarios] = useState<IHorarioData[]>([]);
  const [publicaciones, setPublicaciones] = useState<IPublicaciones[]>([]);
  const [instruccionFormals, setinstruccionFormals] = useState<
    InstruccionFormalData[]
  >([]);
  const [recomendaciones, setRecomendaciones] = useState<IRecomendaciones[]>(
    []
  );
  const [experiencias, setExperiencias] = useState<IExperiencia[]>([]);

  const personaService = new PersonaService();

  const history = useHistory();

  const [selectedCapacitacion, setSelectedCapacitacion] = useState<
    string | null
  >(null);
  const [selectedCarga, setSelectedCarga] = useState<string | null>(null);
  const [selectedContrato, setSelectedContrato] = useState<string | null>(null);
  const [selectedEva, setSelectedEva] = useState<string | null>(null);
  const [selectedExp, setSelectedExp] = useState<string | null>(null);
  const [selectedHabilidad, setSelectedHabilidad] = useState<string | null>(
    null
  );
  const [selectedHorario, setSelectedHorario] = useState<string | null>(null);
  const [selectedInstruc, setSelectedInstruc] = useState<string | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [selectedPublicacion, setSelectedPublicacion] = useState<string | null>(
    null
  );
  const [selectedRecomendacion, setSelectedRecomendacion] = useState<
    string | null
  >(null);

  const handleCapacitacionClick = (codigoCapacitacion: string) => {
    setSelectedCapacitacion(codigoCapacitacion);
    history.push(`/capacitacionDes/${codigoCapacitacion}`);
  };

  const handleCargaClick = (codigoCarga: string) => {
    setSelectedCarga(codigoCarga);
    history.push(`/cargaDes/${codigoCarga}`);
  };

  const handleContratoClick = (codigoContrato: string) => {
    setSelectedContrato(codigoContrato);
    history.push(`/contratoDes/${codigoContrato}`);
  };

  const handleEvaluacionClick = (codigoEvaluacion: string) => {
    setSelectedEva(codigoEvaluacion);
    history.push(`/evaluacionDes/${codigoEvaluacion}`);
  };

  const handleExperienciaClick = (codigoExperiencia: string) => {
    setSelectedExp(codigoExperiencia);
    history.push(`/experienciaDes/${codigoExperiencia}`);
  };

  const handleHabilidadClick = (codigoHabilidad: string) => {
    setSelectedHabilidad(codigoHabilidad);
    history.push(`/habilidadDes/${codigoHabilidad}`);
  };

  const handleHorarioClick = (codigoHorario: string) => {
    setSelectedHorario(codigoHorario);
    history.push(`/horarioDes/${codigoHorario}`);
  };

  const handleInstruccionClick = (codigoInstrucc: string) => {
    setSelectedInstruc(codigoInstrucc);
    history.push(`/instruccionDes/${codigoInstrucc}`);
  };

  const handlePersonaClick = (codigoPersona: string) => {
    setSelectedPersona(codigoPersona);
    history.push(`/personaDes/${codigoPersona}`);
  };

  const handleRecomendacionClick = (codigoRecomendacion: string) => {
    setSelectedRecomendacion(codigoRecomendacion);
    history.push(`/recomendacionDes/${codigoRecomendacion}`);
  };

  const handlePublicacionClick = (codigoPublicacion: string) => {
    setSelectedPublicacion(codigoPublicacion);
    history.push(`/publicacionDes/${codigoPublicacion}`);
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  // SERVICE METHOD
  const fetchSummary = () => {
    if (codigoDocente) {
      // Asegúrate de que haya un valor en codigoDocente
      personaService
        .getSummarySecre(codigoDocente) // Utiliza codigoDocente como parámetro
        .then((response) => {
          const {
            persona,
            capacitaciones,
            cargaFamiliar,
            contratos,
            evaluaciones,
            habilidades,
            horarios,
            publicaciones,
            instruccionFormals,
            recomendaciones,
            experiencias,
          } = response;
          setPersona(persona);
          setCapacitaciones(capacitaciones);
          setCargaFamiliar(cargaFamiliar);
          setContratos(contratos);
          setEvaluaciones(evaluaciones);
          setHabilidades(habilidades);
          setHorarios(horarios);
          setPublicaciones(publicaciones);
          setRecomendaciones(recomendaciones);
          setExperiencias(experiencias);
          setinstruccionFormals(instruccionFormals);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };
  const personaArray: IPersona[] = persona ? [persona] : [];

  const contratoBody = (rowData: IContratoData) => {
    return (
      <div className="flex">
        <div className="mr-4">
          <h2 className="text-3xl">Fecha Inicio: </h2>
          <p className="text-2xl">
            {String(
              rowData.fecha_inicio
                ? new Date(rowData.fecha_inicio).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                : ""
            )}
          </p>
        </div>
        <div className="mr-4">
          <h2 className="text-3xl">Fecha Fin: </h2>
          <p className="text-2xl">
            {String(
              rowData.fecha_fin
                ? new Date(rowData.fecha_fin).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                : ""
            )}
          </p>
        </div>
        <div className="mr-4 ">
          <h2 className="text-3xl">Cargo: </h2>
          <p className="text-2xl">{rowData.cargo}</p>
        </div>
        <div className=" mr-4">
          <h2 className="text-3xl">Salario: </h2>
          <p className="text-2xl">{rowData.salario}</p>
        </div>

        <div className=" ">
          <h2 className="text-3xl">Salario Público: </h2>
          <p className="text-2xl">{rowData.salario_publico}</p>
        </div>
      </div>
    );
  };

  const publicacionBody = (rowData: IPublicaciones) => {
    return (
      <div className="flex">
        <div className="mr-4 ">
          <h2 className="text-3xl">Titulo: </h2>
          <p className="text-2xl">{rowData.titulo_publi}</p>
        </div>
        <div className="mr-4">
          <h2 className="text-3xl">Fecha Publicación: </h2>
          <p className="text-2xl">
            {String(
              rowData.fecha_publi
                ? new Date(rowData.fecha_publi).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                : ""
            )}
          </p>
        </div>
        <div className="mr-4 ">
          <h2 className="text-3xl">Autores: </h2>
          <p className="text-2xl">{rowData.autores_publi}</p>
        </div>
        <div className="mr-4 ">
          <h2 className="text-3xl">Lugar Publicación: </h2>
          <p className="text-2xl">{rowData.lugar_publi}</p>
        </div>
        <div className=" ">
          <h2 className="text-3xl">Editorial: </h2>
          <p className="text-2xl">{rowData.editorial_publi}</p>
        </div>
      </div>
    );
  };

  const horarioBody = (rowData: IHorarioData) => {
    return (
      <div className="flex">
        <div className="mr-4">
          <h2 className="text-3xl">Carrera: </h2>
          <p className="text-2xl">{rowData.carreraHorario}</p>
        </div>
        <div className="mr-4 ">
          <h2 className="text-3xl">Periodo: </h2>
          <p className="text-2xl">{rowData.periodoAcademico}</p>
        </div>
        <div className=" ">
          <h2 className="text-3xl">Horario: </h2>
          <p className="text-2xl">{rowData.jornadaHorario}</p>
        </div>
      </div>
    );
  };

  const capacitacionesBody = (rowData: ICapacitaciones) => {
    return (
      <div className="flex">
        <div className="mr-4">
          <h2 className="text-3xl">Institución: </h2>
          <p className="text-2xl">{rowData.institucion}</p>
        </div>
        <div className="mr-4">
          <h2 className="text-3xl">Tipo Evento: </h2>
          <p className="text-2xl">{rowData.tipo_evento}</p>
        </div>
        <div className="mr-4 ">
          <h2 className="text-3xl">Area de Estudio: </h2>
          <p className="text-2xl">{rowData.area_estudios}</p>
        </div>
        <div className=" ">
          <h2 className="text-3xl">Tipo certificado: </h2>
          <p className="text-2xl">{rowData.tipo_certificado}</p>
        </div>
      </div>
    );
  };
  const personasBody = (rowData: IPersona) => {
    return (
      <div className="flex">
        <div className="mr-4">
          <h2 className="text-3xl">Apellido: </h2>
          <p className="text-2xl">{rowData.apellido_paterno}</p>
        </div>
        <div className="mr-4">
          <h2 className="text-3xl">Nombre: </h2>
          <p className="text-2xl">{rowData.primer_nombre}</p>
        </div>
        <div className="mr-4 ">
          <h2 className="text-3xl">Cédula: </h2>
          <p className="text-2xl">{rowData.cedula}</p>
        </div>
        <div className="mr-4 ">
          <h2 className="text-3xl">Celular: </h2>
          <p className="text-2xl">{rowData.celular}</p>
        </div>
        <div className="mr-4 ">
          <h2 className="text-3xl">Estado Civil: </h2>
          <p className="text-2xl">{rowData.estado_civil}</p>
        </div>
      </div>
    );
  };

  const evaluacionBody = (rowData: IEvaDocente) => {
    return (
      <div className="flex">
        <div className="mr-4">
          <h2 className="text-3xl">Carrera: </h2>
          <p className="text-2xl">{rowData.cod_carrera}</p>
        </div>
        <div className="mr-4">
          <h2 className="text-3xl">Periodo Académico: </h2>
          <p className="text-2xl">{String(rowData.per_nombre)}</p>
        </div>
      </div>
    );
  };

  const recomendacionesBody = (rowData: IRecomendaciones) => {
    return (
      <div className="flex">
        <div className="mr-4">
          <h2 className="text-3xl">Nombres: </h2>
          <p className="text-2xl">
            {rowData.primer_nombre + " " + rowData.segundo_nombre}
          </p>
        </div>
        <div className="mr-4">
          <h2 className="text-3xl">Apellidos: </h2>
          <p className="text-2xl">
            {rowData.primer_apellido + " " + rowData.segundo_apellido}
          </p>
        </div>
        <div className="mr-4">
          <h2 className="text-3xl">Email: </h2>
          <p className="text-2xl">{rowData.correo}</p>
        </div>
      </div>
    );
  };

  const instruccionFBody = (rowData: InstruccionFormalData) => {
    return (
      <div className="flex">
        <div className="mr-4">
          <h2 className="text-3xl">Nivel de Institución: </h2>
          <p className="text-2xl">{rowData.nivelInstruccion}</p>
        </div>
        <div className="mr-4">
          <h2 className="text-3xl">Titulo Obtenido: </h2>
          <p className="text-2xl">{rowData.tituloObtenido}</p>
        </div>
        <div className="mr-4 ">
          <h2 className="text-3xl">Institución Educativa: </h2>
          <p className="text-2xl">{rowData.institucionEducativa}</p>
        </div>
      </div>
    );
  };

  const cargaFBody = (rowData: ICargaFamiliar) => {
    return (
      <div className="flex">
        <div className="mr-4">
          <h2 className="text-3xl">Cédula: </h2>
          <p className="text-2xl">{rowData.cedula}</p>
        </div>
        <div className="mr-4">
          <h2 className="text-3xl">Nombres: </h2>
          <p className="text-2xl">{rowData.nombre_pariente}</p>
        </div>
        <div className="mr-4">
          <h2 className="text-3xl">Apellidos: </h2>
          <p className="text-2xl">{rowData.apellido_pariente}</p>
        </div>
        <div className="mr-4">
          <h2 className="text-3xl">Fecha de nacimiento: </h2>
          <p className="text-2xl">
            {String(
              rowData.fecha_nacimiento
                ? new Date(rowData.fecha_nacimiento).toLocaleDateString(
                    "es-ES",
                    {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    }
                  )
                : ""
            )}
          </p>
        </div>
      </div>
    );
  };

  const experienciaBody = (rowData: IExperiencia) => {
    return (
      <div className="flex">
        <div className="mr-4">
          <h2 className="text-3xl">Institución: </h2>
          <p className="text-2xl">{rowData.institucion}</p>
        </div>
        <div className="mr-4">
          <h2 className="text-3xl">Área de trabajo: </h2>
          <p className="text-2xl">{rowData.area_trabajo}</p>
        </div>
        <div className="mr-4">
          <h2 className="text-3xl">Puesto: </h2>
          <p className="text-2xl">{rowData.puesto}</p>
        </div>

        <div className="mr-4">
          <h2 className="text-3xl">Fecha Inicio: </h2>
          <p className="text-2xl">
            {String(
              rowData.fecha_inicio
                ? new Date(rowData.fecha_inicio).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                : ""
            )}
          </p>
        </div>

        <div className="mr-4">
          <h2 className="text-3xl">Fecha Fin: </h2>
          <p className="text-2xl">
            {String(
              rowData.fecha_fin
                ? new Date(rowData.fecha_fin).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                : ""
            )}
          </p>
        </div>
      </div>
    );
  };

  const habilidadesBody = (rowData: IHabilidadesData) => {
    return (
      <div className="flex">
        <div className="mr-4">
          <h2 className="text-3xl">Nº de Registro: </h2>
          <p className="text-2xl">
            {rowData.id_habilidades !== undefined
              ? rowData.id_habilidades.toString()
              : ""}
          </p>
        </div>
        <div className="mr-4">
          <h2 className="text-3xl">Descripción: </h2>
          <p className="text-2xl">{rowData.descripcion}</p>
        </div>
      </div>
    );
  };

  const btnAccionContrato = (rowData: IContratoData) => {
    return (
      <Button
        type="button"
        className=""
        icon="pi pi-search"
        style={{
          background: "#ff0000",
          borderRadius: "10%",
          fontSize: "25px",
          width: "50px",
          color: "black",
          justifyContent: "center",
        }}
        onClick={() => {
          if (rowData && rowData.id_contrato) {
            handleContratoClick(rowData.id_contrato.toString());
          }
        }}
      />
    );
  };

  const btnAccionCapacitacion = (rowData: ICapacitaciones) => {
    return (
      <Button
        type="button"
        className=""
        icon="pi pi-search"
        style={{
          background: "#ff0000",
          borderRadius: "10%",
          fontSize: "25px",
          width: "50px",
          color: "black",
          justifyContent: "center",
        }}
        onClick={() => {
          if (rowData && rowData.id_capacitaciones) {
            handleCapacitacionClick(rowData.id_capacitaciones.toString());
          }
        }}
      />
    );
  };

  const btnAccionCarga = (rowData: ICargaFamiliar) => {
    return (
      <Button
        type="button"
        className=""
        icon="pi pi-search"
        style={{
          background: "#ff0000",
          borderRadius: "10%",
          fontSize: "25px",
          width: "50px",
          color: "black",
          justifyContent: "center",
        }}
        onClick={() => {
          if (rowData && rowData.id_cargaFamiliar) {
            handleCargaClick(rowData.id_cargaFamiliar.toString());
          }
        }}
      />
    );
  };

  const btnAccionEva = (rowData: IEvaDocente) => {
    return (
      <Button
        type="button"
        className=""
        icon="pi pi-search"
        style={{
          background: "#ff0000",
          borderRadius: "10%",
          fontSize: "25px",
          width: "50px",
          color: "black",
          justifyContent: "center",
        }}
        onClick={() => {
          if (rowData && rowData.id_evaluacion) {
            handleEvaluacionClick(rowData.id_evaluacion.toString());
          }
        }}
      />
    );
  };

  const btnAccionExp = (rowData: IExperiencia) => {
    return (
      <Button
        type="button"
        className=""
        icon="pi pi-search"
        style={{
          background: "#ff0000",
          borderRadius: "10%",
          fontSize: "25px",
          width: "50px",
          color: "black",
          justifyContent: "center",
        }}
        onClick={() => {
          if (rowData && rowData.id_experiencia) {
            handleExperienciaClick(rowData.id_experiencia.toString());
          }
        }}
      />
    );
  };

  const btnAccionHabilidad = (rowData: IHabilidadesData) => {
    return (
      <Button
        type="button"
        className=""
        icon="pi pi-search"
        style={{
          background: "#ff0000",
          borderRadius: "10%",
          fontSize: "25px",
          width: "50px",
          color: "black",
          justifyContent: "center",
        }}
        onClick={() => {
          if (rowData && rowData.id_habilidades) {
            handleHabilidadClick(rowData.id_habilidades.toString());
          }
        }}
      />
    );
  };

  const btnAccionHorario = (rowData: IHorarioData) => {
    return (
      <Button
        type="button"
        className=""
        icon="pi pi-search"
        style={{
          background: "#ff0000",
          borderRadius: "10%",
          fontSize: "25px",
          width: "50px",
          color: "black",
          justifyContent: "center",
        }}
        onClick={() => {
          if (rowData && rowData.id_horario) {
            handleHorarioClick(rowData.id_horario.toString());
          }
        }}
      />
    );
  };

  const btnAccionInstruccion = (rowData: InstruccionFormalData) => {
    return (
      <Button
        type="button"
        className=""
        icon="pi pi-search"
        style={{
          background: "#ff0000",
          borderRadius: "10%",
          fontSize: "25px",
          width: "50px",
          color: "black",
          justifyContent: "center",
        }}
        onClick={() => {
          if (rowData && rowData.id_instruccion) {
            handleInstruccionClick(rowData.id_instruccion.toString());
          }
        }}
      />
    );
  };

  const btnAccionPersona = (rowData: IPersona) => {
    return (
      <Button
        type="button"
        className=""
        icon="pi pi-search"
        style={{
          background: "#ff0000",
          borderRadius: "10%",
          fontSize: "25px",
          width: "50px",
          color: "black",
          justifyContent: "center",
        }}
        onClick={() => {
          if (rowData && rowData.id_persona) {
            handlePersonaClick(rowData.id_persona.toString());
          }
        }}
      />
    );
  };

  const btnAccionPubli = (rowData: IPublicaciones) => {
    return (
      <Button
        type="button"
        className=""
        icon="pi pi-search"
        style={{
          background: "#ff0000",
          borderRadius: "10%",
          fontSize: "25px",
          width: "50px",
          color: "black",
          justifyContent: "center",
        }}
        onClick={() => {
          if (rowData && rowData.id_publi) {
            handlePublicacionClick(rowData.id_publi.toString());
          }
        }}
      />
    );
  };

  const btnAccionRecom = (rowData: IRecomendaciones) => {
    return (
      <Button
        type="button"
        className=""
        icon="pi pi-search"
        style={{
          background: "#ff0000",
          borderRadius: "10%",
          fontSize: "25px",
          width: "50px",
          color: "black",
          justifyContent: "center",
        }}
        onClick={() => {
          if (rowData && rowData.id_recomendaciones) {
            handleRecomendacionClick(rowData.id_recomendaciones.toString());
          }
        }}
      />
    );
  };

  return (
    <Card className="fgrid col-fixed">
      <Card
        header={cardHeader}
        className="border-solid border-blue-250 border-3 align-items-center align-content-center"
      >
        <Divider align="center">
          <h1 className="text-7xl font-smibold lg:md-2">
            Resumen de Perfil Profesional
          </h1>
        </Divider>
        <div
          className="flex align-content-center w-auto max-w-full"
          style={{ marginLeft: "16%" }}
        >
          <p
            style={{ width: "80%", fontStyle: "italic", textAlign: "justify" }}
          >
            {persona?.descripcion_perfil}
          </p>
          {persona?.foto && (
            <img
              src={persona.foto}
              alt="FotoNNA"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "20%", // Borde redondeado
                marginLeft: "5%",
              }}
            />
          )}
        </div>
        <Card className="flex justify-content-center flex-wrap">
          <div className="flex flex-wrap flex-row">
            <div className="flex align-items-center justify-content-center">
              <div className="flex flex-column align-content-center">
                <div
                  className="flex flex-row flex-wrap w-full h-full justify-content-center flex-grow-1 row-gap-8 gap-8 mt-6"
                  style={{ marginLeft: "5%" }}
                >
                  <DataTable
                    value={personaArray}
                    dataKey="id_persona"
                    tableStyle={{ minWidth: "60rem", width: "79rem" }}
                    scrollable
                    scrollHeight="500px"
                    className="mt-5  w-full h-full text-3xl font-medium"
                  >
                    <Column
                      field="Persona"
                      header="Persona "
                      body={personasBody}
                      headerStyle={{
                        backgroundColor: "#0C3255",
                        color: "white",
                      }}
                    ></Column>
                    <Column
                      field="Acciones"
                      header="Acciones"
                      frozen
                      body={btnAccionPersona}
                      style={{ width: "50px" }}
                      headerStyle={{
                        backgroundColor: "#0C3255",
                        color: "white",
                      }}
                    ></Column>
                  </DataTable>
                </div>
                <div
                  className="flex flex-row flex-wrap w-full h-full justify-content-center flex-grow-1 row-gap-8 gap-8 mt-6"
                  style={{ marginLeft: "5%" }}
                >
                  <DataTable
                    value={contratos}
                    dataKey="id_contrato"
                    tableStyle={{ minWidth: "50rem", width: "79rem" }}
                    scrollable
                    scrollHeight="400px"
                    className="mt-5 w-full h-full text-3xl font-medium"
                  >
                    <Column
                      field="Contrato"
                      header="Contrato"
                      headerStyle={{
                        backgroundColor: "#0C3255",
                        color: "white",
                      }}
                      body={contratoBody}
                    ></Column>
                    <Column
                      field="Acciones"
                      header="Acciones"
                      frozen
                      style={{ width: "50px" }}
                      body={btnAccionContrato}
                      headerStyle={{
                        backgroundColor: "#0C3255",
                        color: "white",
                      }}
                    ></Column>
                  </DataTable>
                </div>

                <div
                  className="flex flex-row flex-wrap w-full h-full justify-content-center flex-grow-1 row-gap-8 gap-8 mt-6"
                  style={{ marginLeft: "5%" }}
                >
                  <DataTable
                    value={horarios}
                    dataKey="id_horarios"
                    tableStyle={{ minWidth: "50rem", width: "79rem" }}
                    scrollable
                    scrollHeight="400px"
                    className="mt-5  w-full h-full text-3xl font-medium"
                  >
                    <Column
                      field="Horario"
                      header="Horario"
                      body={horarioBody}
                      headerStyle={{
                        backgroundColor: "#0C3255",
                        color: "white",
                      }}
                    ></Column>
                    <Column
                      field="Acciones"
                      header="Acciones"
                      frozen
                      style={{ width: "50px" }}
                      body={btnAccionHorario}
                      headerStyle={{
                        backgroundColor: "#0C3255",
                        color: "white",
                      }}
                    ></Column>
                  </DataTable>
                </div>

                <div
                  className="flex flex-row flex-wrap w-full h-full justify-content-center flex-grow-1 row-gap-8 gap-8 mt-6"
                  style={{ marginLeft: "5%" }}
                >
                  <DataTable
                    value={capacitaciones}
                    dataKey="id_capacitaciones"
                    tableStyle={{ minWidth: "50rem", width: "79rem" }}
                    scrollable
                    scrollHeight="400px"
                    className="mt-5  w-full h-full text-3xl font-medium"
                  >
                    <Column
                      field="Capacitaciones"
                      header="Capacitaciones"
                      headerStyle={{
                        backgroundColor: "#0C3255",
                        color: "white",
                      }}
                      body={capacitacionesBody}
                    ></Column>
                    <Column
                      field="Acciones"
                      frozen
                      style={{ width: "50px" }}
                      header="Acciones"
                      body={btnAccionCapacitacion}
                      headerStyle={{
                        backgroundColor: "#0C3255",
                        color: "white",
                      }}
                    ></Column>
                  </DataTable>
                </div>
                <div
                  className="flex flex-row flex-wrap w-full h-full justify-content-center flex-grow-1 row-gap-8 gap-8 mt-6"
                  style={{ marginLeft: "5%" }}
                >
                  <DataTable
                    value={evaluaciones}
                    dataKey="id_evaluacion"
                    tableStyle={{ minWidth: "50rem", width: "79rem" }}
                    scrollable
                    scrollHeight="400px"
                    className="mt-5  w-full h-full text-3xl font-medium"
                  >
                    <Column
                      field="Evaluación"
                      header="Evaluación"
                      body={evaluacionBody}
                      headerStyle={{
                        backgroundColor: "#0C3255",
                        color: "white",
                      }}
                    ></Column>
                    <Column
                      field="Acciones"
                      header="Acciones"
                      body={btnAccionEva}
                      frozen
                      style={{ width: "50px" }}
                      headerStyle={{
                        backgroundColor: "#0C3255",
                        color: "white",
                      }}
                    ></Column>
                  </DataTable>
                </div>

                <div
                  className="flex flex-row flex-wrap w-full h-full justify-content-center flex-grow-1 row-gap-8 gap-8 mt-6"
                  style={{ marginLeft: "5%" }}
                >
                  <DataTable
                    value={publicaciones}
                    dataKey="id_publicacion"
                    tableStyle={{ minWidth: "50rem", width: "79rem" }}
                    scrollable
                    scrollHeight="400px"
                    className="mt-5  w-full h-full text-3xl font-medium"
                  >
                    <Column
                      field="Publicación"
                      header="Publicación"
                      body={publicacionBody}
                      headerStyle={{
                        backgroundColor: "#0C3255",
                        color: "white",
                      }}
                    ></Column>
                    <Column
                      field="Acciones"
                      header="Acciones"
                      body={btnAccionPubli}
                      frozen
                      style={{ width: "50px" }}
                      headerStyle={{
                        backgroundColor: "#0C3255",
                        color: "white",
                      }}
                    ></Column>
                  </DataTable>
                </div>
                <div
                  className="flex flex-row flex-wrap w-full h-full justify-content-center flex-grow-1 row-gap-8 gap-8 mt-6"
                  style={{ marginLeft: "5%" }}
                >
                  <DataTable
                    value={recomendaciones}
                    dataKey="id_recomendaciones"
                    tableStyle={{ minWidth: "50rem", width: "79rem" }}
                    scrollable
                    scrollHeight="400px"
                    className="mt-5  w-full h-full text-3xl font-medium"
                  >
                    <Column
                      field="Recomendaciones"
                      header="Recomendaciones"
                      body={recomendacionesBody}
                      headerStyle={{
                        backgroundColor: "#0C3255",
                        color: "white",
                      }}
                    ></Column>
                    <Column
                      field="Acciones"
                      header="Acciones"
                      frozen
                      style={{ width: "50px" }}
                      body={btnAccionRecom}
                      headerStyle={{
                        backgroundColor: "#0C3255",
                        color: "white",
                      }}
                    ></Column>
                  </DataTable>
                </div>
                <div
                  className="flex flex-row flex-wrap w-full h-full  justify-content-center  flex-grow-1  row-gap-8 gap-8  mt-6"
                  style={{ marginLeft: "5%" }}
                >
                  <DataTable
                    value={instruccionFormals}
                    dataKey="id_instruccion"
                    tableStyle={{ minWidth: "50rem", width: "79rem" }}
                    scrollable
                    scrollHeight="400px"
                    className="mt-5  w-full h-full text-3xl font-medium"
                  >
                    <Column
                      field="Instrucción Formal"
                      header="Instrucción Formal"
                      body={instruccionFBody}
                      headerStyle={{
                        backgroundColor: "#0C3255",
                        color: "white",
                      }}
                    ></Column>
                    <Column
                      field="Acciones"
                      header="Acciones"
                      body={btnAccionInstruccion}
                      frozen
                      style={{ width: "50px" }}
                      headerStyle={{
                        backgroundColor: "#0C3255",
                        color: "white",
                      }}
                    ></Column>
                  </DataTable>
                </div>
                <div
                  className="flex flex-row flex-wrap w-full h-full  justify-content-center  flex-grow-1  row-gap-8 gap-8  mt-6"
                  style={{ marginLeft: "5%" }}
                >
                  <DataTable
                    value={cargaFamiliar}
                    dataKey="id_cargaFamiliar"
                    tableStyle={{ minWidth: "50rem" }}
                    scrollable
                    scrollHeight="400px"
                    className="mt-5  w-full h-full text-3xl font-medium"
                  >
                    <Column
                      field="Carga Familiar"
                      header="Carga Familiar"
                      body={cargaFBody}
                      headerStyle={{
                        backgroundColor: "#0C3255",
                        color: "white",
                      }}
                    ></Column>
                    <Column
                      field="Acciones"
                      header="Acciones"
                      body={btnAccionCarga}
                      frozen
                      style={{ width: "50px" }}
                      headerStyle={{
                        backgroundColor: "#0C3255",
                        color: "white",
                      }}
                    ></Column>
                  </DataTable>
                </div>
                <div
                  className="flex flex-row flex-wrap w-full h-full  justify-content-center  flex-grow-1  row-gap-8 gap-8  mt-6"
                  style={{ marginLeft: "5%" }}
                >
                  <DataTable
                    value={experiencias}
                    dataKey="id_experiencia"
                    scrollable
                    scrollHeight="400px"
                    tableStyle={{ minWidth: "50rem" }}
                    className="mt-5  w-full h-full text-3xl font-medium"
                  >
                    <Column
                      field="Experiencia"
                      header="Experiencia"
                      body={experienciaBody}
                      headerStyle={{
                        backgroundColor: "#0C3255",
                        color: "white",
                      }}
                    ></Column>
                    <Column
                      field="Acciones"
                      header="Acciones"
                      body={btnAccionExp}
                      frozen
                      style={{ width: "50px" }}
                      headerStyle={{
                        backgroundColor: "#0C3255",
                        color: "white",
                      }}
                    ></Column>
                  </DataTable>
                </div>
                <div
                  className="flex flex-row flex-wrap w-full h-full  justify-content-center  flex-grow-1  row-gap-8 gap-8  mt-6"
                  style={{ marginLeft: "5%" }}
                >
                  <DataTable
                    value={habilidades}
                    dataKey="id_habilidades"
                    tableStyle={{ minWidth: "50rem" }}
                    scrollable
                    scrollHeight="400px"
                    className="mt-5  w-full h-full text-3xl font-medium"
                  >
                    <Column
                      field="descripcion"
                      header="Habilidades"
                      body={habilidadesBody}
                      headerStyle={{
                        backgroundColor: "#0C3255",
                        color: "white",
                      }}
                    ></Column>
                    <Column
                      field="Acciones"
                      header="Acciones"
                      body={btnAccionHabilidad}
                      frozen
                      style={{ width: "50px" }}
                      headerStyle={{
                        backgroundColor: "#0C3255",
                        color: "white",
                      }}
                    ></Column>
                  </DataTable>
                  <PersonaCombinada personaId={persona?.id_persona || 0} />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Card>
    </Card>
  );
}

export default ResumenDocente;
