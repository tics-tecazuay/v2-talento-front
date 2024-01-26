import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import "../../styles/Contrato.css";
import { Fieldset } from "primereact/fieldset";
import { Card } from "primereact/card";
import cardHeader from "../../shared/CardHeader";
import { Divider } from "primereact/divider";
import { IContratoData } from "../../interfaces/Primary/IContrato";
import { ContratoService } from "../../services/ContratoService";
import swal from "sweetalert";
import { Dropdown } from "primereact/dropdown";
import { useParams } from "react-router-dom";
import { ReportBar } from "../../shared/ReportBar";
import {
  IExcelReportParams,
  IHeaderItem,
} from "../../interfaces/Secondary/IExcelReportParams";

interface Params {
  codigoContrato: string;
}

function ContratoContextDes() {
  const userData = sessionStorage.getItem("user");
  const userObj = JSON.parse(userData || "{}");
  const idPersona = userObj.id;

  const [excelReportData, setExcelReportData] =
    useState<IExcelReportParams | null>(null);

  const [contra1, setcontra1] = useState<IContratoData[]>([]);
  const { codigoContrato } = useParams<Params>();
  const codigoContratoNumber = Number(codigoContrato);

  const [formDisabled, setFormDisabled] = useState(false);

  const [formData, setFormData] = useState<IContratoData>({
    id_contrato: 0,
    fecha_inicio: new Date(),
    fecha_fin: new Date(),
    anio_duracion: "",
    horas_diarias: "",
    cargo: "",
    salario: "",
    evidencia: "",
    tiempo_dedicacion: "",
    salario_publico: "",
    contrato_vigente: false,
    persona: { id_persona: idPersona },
  });

  const contratService = new ContratoService();

  const tiempoDedicacionOptions = [
    { label: "Tiempo completo", value: "Tiempo Completo" },
    { label: "Medio tiempo", value: "Medio Tiempo" },
    { label: "Por horas", value: "Por Horas" },
  ];
  const salariopublicoOptions = [
    { label: "SP 1", value: "SP1" },
    { label: "SP 2", value: "SP2" },
    { label: "SP 3", value: "SP3" },
    { label: "SP 4", value: "SP4" },
    { label: "SP 5", value: "SP5" },
    { label: "SP 6", value: "SP6" },
    { label: "NJS 1", value: "NJS1" },
    { label: "NJS 2", value: "NJS2" },
  ];

  const [contratoVigente, setContratoVigente] = useState<boolean>(false);

  const handleContratoVigenteToggle = () => {
    setContratoVigente((prevValue) => !prevValue);
    setFormData({ ...formData, contrato_vigente: !contratoVigente });
  };

  const getContratoVigenteText = (contrato_vigente: boolean) => {
    return contrato_vigente ? "Por terminar" : "Finalizado";
  };

  useEffect(() => {
    contratService
      .getAllByContrato(codigoContratoNumber)
      .then((data) => {
        if (data.length > 0) {
          const contratoData = data[0];
          setFormDisabled(true);
          loadExcelReportData(data);
          // Actualiza el estado local aquí
          setFormData({
            ...formData,
            fecha_inicio: contratoData.fecha_inicio,
            fecha_fin: contratoData.fecha_fin,
            anio_duracion: contratoData.anio_duracion.toString(),
            horas_diarias: contratoData.horas_diarias.toString(),
            cargo: contratoData.cargo,
            salario: contratoData.salario.toString(),
            tiempo_dedicacion: contratoData.tiempo_dedicacion,
            salario_publico: contratoData.salario_publico,
            contrato_vigente: contratoData.contrato_vigente,
          });
          setcontra1(data);
        }
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
      });
  }, []);

  function loadExcelReportData(data: IContratoData[]) {
    const reportName = "Contrato";
    const rowData = data.map((item) => ({
      cargo: item.cargo,
      salario: item.salario,
      salario_publico: item.salario_publico,
      tiempo_dedicacion: item.tiempo_dedicacion,
      fecha_inicio: new Date(item.fecha_inicio!).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      fecha_fin: new Date(item.fecha_fin!).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
    }));
    const headerItems: IHeaderItem[] = [
      { header: "CARGO" },
      { header: "SALARIO" },
      { header: "SALARIO PUBLICO" },
      { header: "TIEMPO DE DEDICACIÓN" },
      { header: "FECHA DE INICIO" },
      { header: "FECHA DE FIN" },
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
              Contrato
            </h1>
          </Divider>
        </div>

        <div className="flex justify-content-center flex-wrap">
          <form encType="multipart/form-data">
            <div className="flex flex-wrap flex-row">
              <div className="flex align-items-center justify-content-center">
                <div
                  className="flex flex-column flex-wrap gap-4"
                  style={{ marginLeft: "20px" }}
                >
                  <div className="flex flex-wrap w-full h-full justify-content-between">
                    <label
                      htmlFor="inicio"
                      className="text-3xl font-medium w-auto min-w-min"
                    >
                      Fecha Inicio:
                    </label>
                    <Calendar
                      className="text-2xl"
                      id="inicio"
                      name="inicio"
                      required
                      placeholder="Ingresa la Fecha de Inicio"
                      dateFormat="yy-mm-dd"
                      showIcon
                      maxDate={new Date()}
                      onChange={(e) => {
                        const selectedDate =
                          e.value instanceof Date ? e.value : null;
                        setFormData({
                          ...formData,
                          fecha_inicio: selectedDate || null, // asigna undefined si selectedDate es null
                        });
                      }}
                      value={
                        formData.fecha_inicio
                          ? new Date(formData.fecha_inicio)
                          : null
                      }
                    />
                  </div>

                  <div className="flex flex-wrap w-full h-full justify-content-between">
                    <label
                      htmlFor="fin"
                      className="text-3xl font-medium w-auto min-w-min"
                    >
                      Fecha Fin:
                    </label>
                    <Calendar
                      className="text-2xl"
                      id="inicio"
                      name="inicio"
                      required
                      placeholder="Ingresa la Fecha de Fin"
                      dateFormat="yy-mm-dd"
                      showIcon
                      maxDate={new Date()}
                      onChange={(e) => {
                        const selectedDate =
                          e.value instanceof Date ? e.value : null;
                        setFormData({
                          ...formData,
                          fecha_fin: selectedDate || null, // asigna undefined si selectedDate es null
                        });
                      }}
                      value={
                        formData.fecha_fin ? new Date(formData.fecha_fin) : null
                      }
                    />
                  </div>

                  <div className="flex flex-wrap w-full h-full  justify-content-between  ">
                    <label
                      htmlFor="anios"
                      className="text-3xl font-medium w-auto min-w-min"
                    >
                      Años de duracion:
                    </label>
                    <InputText
                      className="text-2xl"
                      id="anios"
                      required
                      placeholder="Ingresa los años de duracion"
                      name="anios"
                      disabled={formDisabled}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          anio_duracion: e.currentTarget.value,
                        })
                      }
                      value={formData.anio_duracion}
                    />
                  </div>
                </div>
                <div
                  className="flex flex-column flex-wrap gap-4"
                  style={{ marginLeft: "20px" }}
                >
                  <div className="flex flex-wrap w-full h-full  justify-content-between  ">
                    <label
                      htmlFor="horas"
                      className="text-3xl font-medium w-auto min-w-min"
                    >
                      Horas:
                    </label>
                    <InputText
                      className="text-2xl"
                      id="horas"
                      disabled={formDisabled}
                      name="horas"
                      placeholder="Ingresa las Horas"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          horas_diarias: e.currentTarget.value,
                        })
                      }
                      value={formData.horas_diarias}
                    />
                  </div>
                  <div className="flex flex-wrap w-full h-full  justify-content-between  ">
                    <label
                      htmlFor="cargo"
                      className="text-3xl font-medium w-auto min-w-min"
                    >
                      Cargo:
                    </label>
                    <InputText
                      className="text-2xl"
                      id="cargo"
                      disabled={formDisabled}
                      placeholder="Ingresa el Cargo"
                      name="cargo"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cargo: e.currentTarget.value,
                        })
                      }
                      value={formData.cargo}
                    />
                  </div>
                  <div className="flex flex-wrap w-full h-full  justify-content-between  ">
                    <label
                      htmlFor="salario"
                      className="text-3xl font-medium w-auto min-w-min"
                    >
                      Salario:
                    </label>
                    <InputText
                      className="text-2xl"
                      id="salario"
                      name="salario"
                      disabled={formDisabled}
                      placeholder="Ingresa el Salario"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          salario: e.currentTarget.value,
                        })
                      }
                      value={formData.salario}
                    />
                  </div>
                </div>
                <div
                  className="flex flex-column flex-wrap gap-4"
                  style={{ marginLeft: "20px" }}
                >
                  <div className="flex flex-wrap w-full h-full justify-content-between">
                    <label
                      htmlFor="tiempo_dedicacion"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "5px" }}
                    >
                      Tiempo Dedicación:
                    </label>
                    <Dropdown
                      className="text-2xl"
                      id="tiempo_dedicacion"
                      name="tiempo_dedicacion"
                      disabled={formDisabled}
                      style={{ width: "200px" }} // Ajusta el ancho del Dropdown
                      options={tiempoDedicacionOptions}
                      onChange={(e) =>
                        setFormData({ ...formData, tiempo_dedicacion: e.value })
                      }
                      value={formData.tiempo_dedicacion}
                      optionLabel="label"
                      optionValue="value"
                      placeholder="Seleccionar....."
                    />
                  </div>
                  <div className="flex flex-wrap w-full h-full justify-content-between">
                    <label
                      htmlFor="salario_publico"
                      className="text-3xl font-medium w-auto min-w-min"
                    >
                      Salario Público:
                    </label>
                    <Dropdown
                      className="text-2xl"
                      id="salario_publico"
                      disabled={formDisabled}
                      name="salario_publico"
                      options={salariopublicoOptions}
                      onChange={(e) =>
                        setFormData({ ...formData, salario_publico: e.value })
                      }
                      value={formData.salario_publico}
                      optionLabel="label"
                      optionValue="value"
                      style={{ width: "200px" }} // Ajusta el ancho del Dropdown
                      placeholder="Seleccionar....."
                    />
                  </div>
                  <div className="flex flex-wrap w-full h-full justify-content-between">
                    <label
                      htmlFor="contratoVigente"
                      className="text-3xl font-medium w-auto min-w-min"
                    >
                      Contrato Vigente:
                    </label>
                    <label className="switch">
                      <input
                        type="checkbox"
                        id="contratoVigente"
                        checked={formData.contrato_vigente}
                        onChange={handleContratoVigenteToggle}
                      />
                      <span className="slider"></span>
                    </label>
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
          style={{ minWidth: "50rem" }}
          className="mt-5  w-full h-full text-3xl font-medium"
        >
          <thead>
            <tr style={{ backgroundColor: "#0C3255", color: "white" }}>
              <th>Fecha Inicio</th>
              <th>Fecha Fin </th>
              <th>Años de Duración</th>
              <th>Horas</th>
              <th>Cargo</th>
              <th>Salario</th>
              <th>Tiempo de Dedicación</th>
              <th>Salario Público</th>
              <th>Contrato Vigente</th>
              <th>Evidencia</th>
            </tr>
          </thead>
          <tbody>
            {contra1.map((contrato) => (
              <tr
                className="text-center"
                key={contrato.id_contrato?.toString()}
              >
                <td>
                  {contrato.fecha_inicio
                    ? new Date(contrato.fecha_inicio).toLocaleDateString(
                        "es-ES",
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        }
                      )
                    : ""}
                </td>
                <td>
                  {contrato.fecha_fin
                    ? new Date(contrato.fecha_fin).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                    : ""}
                </td>
                <td>{contrato.anio_duracion + " años"}</td>
                <td>{contrato.horas_diarias}</td>
                <td>{contrato.cargo}</td>
                <td>{contrato.salario}</td>
                <td>{contrato.tiempo_dedicacion}</td>
                <td>{contrato.salario_publico}</td>
                <td>{getContratoVigenteText(contrato.contrato_vigente)}</td>

                <td>
                  {contrato.evidencia ? (
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
                      onClick={() => decodeBase64(contrato.evidencia!)}
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

export default ContratoContextDes;
