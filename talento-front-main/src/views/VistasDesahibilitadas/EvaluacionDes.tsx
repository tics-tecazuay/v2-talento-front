import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Fieldset } from "primereact/fieldset";
import { Card } from "primereact/card";
import cardHeader from "../../shared/CardHeader";
import { Divider } from "primereact/divider";
import { IEvaDocente } from "../../interfaces/Primary/IEva_Docente";
import { VCarreras } from "../../interfaces/Secondary/VCarreras";
import { VPeriodos } from "../../interfaces/Secondary/VPeriodos";
import { EvaluacionService } from "../../services/EvaluacionService";
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
  codigoEvaluacion: string;
}

function CargaContextDes() {
  const userData = sessionStorage.getItem("user");
  const userObj = JSON.parse(userData || "{}");
  const idPersona = userObj.id;

  const [excelReportData, setExcelReportData] =
    useState<IExcelReportParams | null>(null);

  const [eva1, seteva1] = useState<IEvaDocente[]>([]);
  const { codigoEvaluacion } = useParams<Params>();
  const codigoEvaluacionNumber = Number(codigoEvaluacion);

  const [formDisabled, setFormDisabled] = useState(false);

  const [formData, setFormData] = useState<IEvaDocente>({
    id_evaluacion: 0,
    evidencia_evaluacion: "",
    cod_carrera: "",
    per_nombre: "",
    persona: { id_persona: idPersona },
  });

  const [dataLoaded, setDataLoaded] = useState(false);

  const evaService = new EvaluacionService();
  const carreraService = new VcarreraService();
  const periodoService = new VPeridosService();

  const [carreras, setCarreras] = useState<VCarreras[]>([]);
  const [periodos, setPeridos] = useState<VPeriodos[]>([]);

  const [selectedCarrera, setSelectedCarrera] = useState<string | null>(null);
  const [selectedPeriodo, setSelectedPeriodo] = useState<string | null>(null);

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
    evaService
      .getAllByEvaluacion(codigoEvaluacionNumber)
      .then((data) => {
        if (data.length > 0) {
          const contratoData = data[0];
          setFormDisabled(true);
          loadExcelReportData(data);
          // Actualiza el estado local aquí
          setFormData({
            ...formData,
            cod_carrera: contratoData.cod_carrera,
            per_nombre: contratoData.per_nombre,
          });
          seteva1(data);
        }
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
      });
  }, []);

  function loadExcelReportData(data: IEvaDocente[]) {
    const reportName = "Evaluacion Docente";
    const rowData = data.map((item) => ({
      cod_carrera: item.cod_carrera,
      per_nombre: item.per_nombre,
    }));
    const headerItems: IHeaderItem[] = [
      { header: "CODIGO DE CARRERA" },
      { header: "PERIODO" },
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

  return (
    <Fieldset className="fgrid col-fixed ">
      <Card
        header={cardHeader}
        className="border-solid border-blue-800 border-3 flex-1 w-full h-full flex-wrap"
      >
        <div className="h1-rem">
          <Divider align="center">
            <h1 className="text-7xl font-smibold lg:md-2  w-full h-full max-w-full max-h-full min-w-min">
              Evaluacion Docente
            </h1>
          </Divider>
        </div>

        <div className="flex justify-content-center flex-wrap">
          <form encType="multipart/form-data">
            <div className="flex flex-wrap flex-row">
              <div className="flex align-items-center justify-content-center">
                <div
                  className="flex flex-column flex-wrap gap-4"
                  style={{ marginLeft: "100px" }}
                >
                  <div className="flex flex-wrap w-full h-full justify-content-between">
                    <label
                      htmlFor="cod_carrera"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "20px" }}
                    >
                      Carrera:
                    </label>
                    <Dropdown
                      id="cod_carrera"
                      name="cod_carrera"
                      options={carreras}
                      disabled={formDisabled}
                      onChange={(e) =>
                        setFormData({ ...formData, cod_carrera: e.value })
                      }
                      value={formData.cod_carrera} // Make sure this is correctly bound
                      optionLabel="carrera_nombre"
                      optionValue="carrera_nombre"
                      placeholder="Seleccione la Carrera"
                      style={{ width: "250px" }}
                    />
                  </div>

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
                      options={periodos}
                      disabled={formDisabled}
                      onChange={(e) =>
                        setFormData({ ...formData, per_nombre: e.value })
                      }
                      value={formData.per_nombre} // Make sure this is correctly bound
                      optionLabel="per_nombre"
                      optionValue="per_nombre"
                      placeholder="Seleccione el Periodo Academico"
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
              <th>Carrera</th>
              <th>Periodo Académico</th>
              <th>Evidencia</th>
            </tr>
          </thead>
          <tbody>
            {eva1.map((eva) => (
              <tr className="text-center" key={eva.id_evaluacion?.toString()}>
                <td>{eva.cod_carrera}</td>
                <td>{eva.per_nombre}</td>

                <td>
                  {eva.evidencia_evaluacion ? (
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
                      onClick={() => decodeBase64(eva.evidencia_evaluacion!)}
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

export default CargaContextDes;
