import React, { useEffect, useState, } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import "../../styles/Contrato.css";
import { Fieldset } from "primereact/fieldset";
import { Card } from "primereact/card";
import cardHeader from "../../shared/CardHeader";
import { Divider } from "primereact/divider";
import { IHorarioData } from "../../interfaces/Primary/IHorario";
import { VCarreras } from "../../interfaces/Secondary/VCarreras";
import { VPeriodos } from "../../interfaces/Secondary/VPeriodos";
import { HorarioService } from "../../services/HorarioService";
import { VcarreraService } from "../../services/VCarreraService";
import { VPeridosService } from "../../services/VPeridosService";
import swal from "sweetalert";
import { useParams } from "react-router-dom";
import { ReportBar } from "../../shared/ReportBar";
import {
  IExcelReportParams,
  IHeaderItem,
} from "../../interfaces/Secondary/IExcelReportParams";

interface Params {
  codigoHorario: string;
}

function HorarioContextDes() {
  const userData = sessionStorage.getItem("user");
  const userObj = JSON.parse(userData || "{}");
  const idPersona = userObj.id;

  const [excelReportData, setExcelReportData] =
  useState<IExcelReportParams | null>(null);

  const [horario1, sethorario1] = useState<IHorarioData[]>([]);
  const [carreras, setCarreras] = useState<VCarreras[]>([]);
  const [periodos, setPeridos] = useState<VPeriodos[]>([]);

  const { codigoHorario } = useParams<Params>();
  const codigoHorarioNumber = Number(codigoHorario);

  const carreraService = new VcarreraService();
  const periodoService = new VPeridosService();
  const horarioService = new HorarioService();

  const [formDisabled, setFormDisabled] = useState(false);

  const [selectedCarrera, setSelectedCarrera] = useState<string | null>(null);
  const [selectedPeriodo, setSelectedPeriodo] = useState<string | null>(null);

  const [dataLoaded, setDataLoaded] = useState(false);


  const tipoJornadaOptions = [
    { label: "Seleccione Una", value: "N/A" },
    { label: "MATUTINA", value: "MATUTINA" },
    { label: "VESPERTINA", value: "VESPERTINA" },
    { label: "NOCTURNA", value: "NOCTURNA" },
    { label: "MATUTINA/NOCTURNA", value: "MATUTINA/NOCTURNA" },
    { label: "MATUTINA/VESPERTINA", value: "MATUTINA/VESPERTINA" },
    { label: "VESPERTINA/NOCTURNA", value: "VESPERTINA/NOCTURNA" },
  ];

  const [formData, setFormData] = useState<IHorarioData>({
    id_horario: 0,
    periodoAcademico: "",
    jornadaHorario: "",
    horasSemanalesHorario: "",
    carreraHorario: "",
    distributivo: "",
    persona: {
      id_persona: idPersona,
    },
  });

  useEffect(() => {
    const loadCarrera = () => {
      carreraService
        .getAll()
        .then((data) => {
          setCarreras(data);
          setDataLoaded(true);
          setSelectedCarrera(null);
        })
        .catch((error) => {
          console.error("Error al obtener los datos:", error);
        });
    };
    loadCarrera();
  }, []);

  useEffect(() => {
    const loadPeriodo = () => {
      periodoService
        .getAll()
        .then((data) => {
          setPeridos(data);
          setDataLoaded(true);
          setSelectedPeriodo(null);
        })
        .catch((error) => {
          console.error("Error al obtener los datos:", error);
        });
    };
    loadPeriodo();
  }, []);

  useEffect(() => {
    horarioService
      .getAllByHorario(codigoHorarioNumber)
      .then((data) => {
        if (data.length > 0) {
          const contratoData = data[0];
          setFormDisabled(true);
          loadExcelReportData(data);
          // Actualiza el estado local aquí
          setFormData({
            ...formData,
            periodoAcademico: contratoData.periodoAcademico,
            jornadaHorario: contratoData.jornadaHorario,
            horasSemanalesHorario: contratoData.horasSemanalesHorario,
            carreraHorario: contratoData.carreraHorario,
          });
          sethorario1(data);
        }
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
      });
  }, []);

  function loadExcelReportData(data: IHorarioData[]) {
    const reportName = "DISTRIBUTIVO Y HORARIO";
    const rowData = data.map((item) => ({
      periodoAcademico: item.periodoAcademico,
      jornadaHorario: item.jornadaHorario,
      horasSemanalesHorario: item.horasSemanalesHorario,
      carreraHorario: item.carreraHorario,
    }));
    const headerItems: IHeaderItem[] = [
      { header: "PERIODO ACADEMICO" },
      { header: "JORNADA" },
      { header: "TOTAL HORAS" },
      { header: "CARRERA" },
    ];
    setExcelReportData({
      reportName,
      headerItems,
      rowData,
    });
  }

  const decodeBase64 = (base64Data: string) => {
    try {
      // Eliminar encabezados o metadatos de la cadena base64
      const base64WithoutHeader = base64Data.replace(/^data:.*,/, "");

      const decodedData = atob(base64WithoutHeader); // Decodificar la cadena base64
      const byteCharacters = new Uint8Array(decodedData.length);

      for (let i = 0; i < decodedData.length; i++) {
        byteCharacters[i] = decodedData.charCodeAt(i);
      }

      const byteArray = new Blob([byteCharacters], { type: "application/pdf" });
      const fileUrl = URL.createObjectURL(byteArray);

      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = "archivoCon.pdf";
      link.click();
      swal({
        title: "Contrato",
        text: "Descargando pdf....",
        icon: "success",
        timer: 1000,
      });
      link.remove();
    } catch (error) {
      console.error("Error al decodificar la cadena base64:", error);
    }
  };

  if (!dataLoaded) {
    return <div>Cargando datos...</div>;
  }

  return (
    <Fieldset className="fgrid col-fixed ">
      <Card
        header={cardHeader}
        className="border-solid border-blue-800 border-3 flex-1 w-full h-full flex-wrap"
      >
        <div className="h1-rem">
          <Divider align="center">
            <h1 className="text-7xl font-smibold lg:md-2  w-full h-full max-w-full max-h-full min-w-min">
              Distributivo
            </h1>
          </Divider>
        </div>

        <div className="flex justify-content-center flex-wrap">
          <form
            encType="multipart/form-data"
          >
            <div className="flex flex-wrap flex-row">
              <div className="flex align-items-center justify-content-center">
                <div
                  className="flex flex-column flex-wrap gap-4"
                  style={{ marginLeft: "20px" }}
                >
                  <div className="flex flex-wrap w-full h-full justify-content-between">
                    <label
                      htmlFor="per_nombre"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "20px" }}
                    >
                      Periodo Académico:
                    </label>
                    <Dropdown
                      id="per_nombre"
                      name="per_nombre"
                      disabled={formDisabled}
                      options={periodos}
                      onChange={(e) =>
                        setFormData({ ...formData, periodoAcademico: e.value })
                      }
                      value={formData.periodoAcademico} // Make sure this is correctly bound
                      optionLabel="per_nombre"
                      optionValue="per_nombre"
                      placeholder="Seleccione el Periodo Academico"
                      style={{ width: "250px" }}
                    />
                  </div>
                  <div className="flex flex-wrap w-full h-full  justify-content-between">
                    <label
                      htmlFor="jornadaHorario"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "20px" }}
                    >
                      Jornada:
                    </label>
                    <Dropdown
                      id="jornadaHorario"
                      disabled={formDisabled}
                      name="jornadaHorario"
                      options={tipoJornadaOptions}
                      onChange={(e) =>
                        setFormData({ ...formData, jornadaHorario: e.value })
                      }
                      value={formData.jornadaHorario}
                      optionLabel="label"
                      optionValue="value"
                      placeholder="Seleccione la Jornada"
                      style={{ width: "250px" }} // Ajusta el ancho del Dropdown
                    />
                  </div>
                </div>
                <div
                  className="flex flex-column flex-wrap gap-4"
                  style={{ marginTop: "-2px", marginLeft: "25px" }}
                >
                  <div className="flex flex-wrap w-full h-full  justify-content-between">
                    <label
                      htmlFor="horas_semanales"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "20px" }}
                    >
                      Horas de Clases Semanales:
                    </label>
                    <InputText
                      className="text-2xl"
                      placeholder="Ingrese las Horas Semanales"
                      disabled={formDisabled}
                      id="horas_semanales"
                      name="horas_semanales"
                      style={{ width: "250px" }}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          horasSemanalesHorario: e.currentTarget.value,
                        })
                      }
                      value={formData.horasSemanalesHorario}
                    />
                  </div>
                  <div className="flex flex-wrap w-full h-full justify-content-between">
                    <label
                      htmlFor="cod_carrera"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "20px" }}
                    >
                      Carrera con Mayor Carga Horaria:
                    </label>
                    <Dropdown
                      id="cod_carrera"
                      name="cod_carrera"
                      disabled={formDisabled}
                      options={carreras}
                      onChange={(e) =>
                        setFormData({ ...formData, carreraHorario: e.value })
                      }
                      value={formData.carreraHorario}
                      optionLabel="carrera_nombre"
                      optionValue="carrera_nombre"
                      placeholder="Seleccione la Carrera"
                      style={{ width: "250px" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <ReportBar
          reportName={excelReportData?.reportName!}
          headerItems={excelReportData?.headerItems!}
          rowData={excelReportData?.rowData!}
        />
        <table
          style={{ minWidth: "40rem" }}
          className="mt-4  w-full h-full text-3xl font-large"
        >
          <thead>
            <tr style={{ backgroundColor: "#0C3255", color: "white" }}>
              <th>Periodo</th>
              <th>Carrera</th>
              <th>Jornada</th>
              <th>Horas</th>
              <th>Evidencia</th>
            </tr>
          </thead>
          <tbody>
            {horario1.map((contrato) => (
              <tr className="text-center" key={contrato.id_horario?.toString()}>
                <td>{contrato.periodoAcademico}</td>
                <td>{contrato.carreraHorario}</td>
                <td>{contrato.jornadaHorario}</td>
                <td>{contrato.horasSemanalesHorario}</td>
                <td>
                  {contrato.distributivo ? (
                    <Button
                      type="button"
                      className=""
                      label="Descargar PDF"
                      style={{
                        background: "#009688",
                        borderRadius: "10%",
                        fontSize: "12px",
                        color: "black",
                        justifyContent: "center",
                      }}
                      onClick={() => decodeBase64(contrato.distributivo!)}
                    />
                  ) : (
                    <span>Sin evidencia</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Fieldset>
  );
}

export default HorarioContextDes;
