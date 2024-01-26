import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Fieldset } from "primereact/fieldset";
import { Card } from "primereact/card";
import cardHeader from "../../shared/CardHeader";
import { Divider } from "primereact/divider";
import { ICapacitaciones } from "../../interfaces/Primary/ICapacitaciones";
import { CapacitacionesService } from "../../services/CapacitacionesService";
import swal from "sweetalert";
import { useParams } from "react-router-dom";
import {
  IExcelReportParams,
  IHeaderItem,
} from "../../interfaces/Secondary/IExcelReportParams";
import { ReportBar } from "../../shared/ReportBar";

interface Params {
  codigoCapacitacion: string;
}

function CapacitacionesContextDes() {
  const userData = sessionStorage.getItem("user");
  const userObj = JSON.parse(userData || "{}");
  const idPersona = userObj.id;

  const [excelReportData, setExcelReportData] =
    useState<IExcelReportParams | null>(null);

  const [capacitacion1, setcapacitacion1] = useState<ICapacitaciones[]>([]);
  const { codigoCapacitacion } = useParams<Params>();
  const codigoCapacitacionNumber = Number(codigoCapacitacion);

  const tipoCertificadoOptions = [
    { label: "Aprobación", value: "Aprobación" },
    { label: "Asistencia", value: "Asistencia" },
  ];
  const areaEstudioOptions = [
    { label: "Administración/oficina", value: "Administración/oficina" },
    {
      label: "Agricultura/Pesca/Ganadería",
      value: "Agricultura/Pesca/Ganadería",
    },
    { label: "Arte/Diseño/Medios", value: "Arte/Diseño/Medios" },
    { label: "Científico/Investigación", value: "Científico/Investigación" },
    { label: "Dirección/ Gerencia", value: "Dirección/ Gerencia" },
    { label: "Economía/Contabilidad", value: "Economía/Contabilidad" },
    { label: "Educación Básica/Cursos", value: "Educación Básica/Cursos" },
    { label: "Educación/Universidad", value: "Educación/Universidad" },
    { label: "Entretenimiento/Deportes", value: "Entretenimiento/Deportes" },
    { label: "Fabricación", value: "Fabricación" },
    { label: "Finanzas/ Banca", value: "Finanzas/ Banca" },
    { label: "Gobierno", value: "Gobierno" },
    { label: "Hotelería/Turismo", value: "Hotelería/Turismo" },
    { label: "Informática hardware", value: "Informática hardware" },
    { label: "Informática software", value: "Informática software" },
    {
      label: "Informática/Telecomunicaciones",
      value: "Informática/Telecomunicaciones",
    },
    { label: "Ingeniería/Técnico", value: "Ingeniería/Técnico" },
    { label: "Internet", value: "Internet" },
    { label: "Legal/ Asesoría", value: "Legal/ Asesoría" },
    { label: "Marketing/Ventas", value: "Marketing/Ventas" },
    { label: "Materia prima", value: "Materia prima" },
    { label: "Medicina/Salud", value: "Medicina/Salud" },
    { label: "Recursos Humanos/Personal", value: "Recursos Humanos/Personal" },
    { label: "Sin Área de Estudio", value: "Sin Área de Estudio" },
    { label: "Ventas al consumidor", value: "Ventas al consumidor" },
  ];

  const tipoEventoOptions = [
    { label: "CONFERENCIA", value: "CONFERENCIA" },
    { label: "CONGRESO", value: "CONGRESO" },
    { label: "CURSO", value: "CURSO" },
    { label: "DIPLOMADO", value: "DIPLOMADO" },
    { label: "JORNADA", value: "JORNADA" },
    { label: "PANEL", value: "PANEL" },
    { label: "PASANTIA", value: "PASANTIA" },
    { label: "SEMINARIO", value: "SEMINARIO" },
    { label: "TALLER", value: "TALLER" },
    { label: "VISITA DE OBSERVACION", value: "VISITA DE OBSERVACION" },
  ];

  const [formDisabled, setFormDisabled] = useState(false);

  const [formData, setFormData] = useState<ICapacitaciones>({
    id_capacitaciones: 0,
    institucion: "",
    tipo_evento: "",
    nombre_evento: "",
    area_estudios: "",
    tipo_certificado: "",
    fecha_inicio: new Date(),
    fecha_fin: new Date(),
    numero_dias: 0,
    cantidad_horas: 0,
    evidencia: "",
    persona: {
      id_persona: idPersona,
    },
  });

  const capacitacionService = new CapacitacionesService();

  useEffect(() => {
    capacitacionService
      .getAllByCapacitaciones(codigoCapacitacionNumber)
      .then((data) => {
        if (data.length > 0) {
          const capacitacionData = data[0];
          setFormDisabled(true);
          loadExcelReportData(data);
          setFormData({
            ...formData,
            institucion: capacitacionData.institucion,
            tipo_evento: capacitacionData.tipo_evento,
            nombre_evento: capacitacionData.nombre_evento,
            area_estudios: capacitacionData.area_estudios,
            tipo_certificado: capacitacionData.tipo_certificado,
            fecha_inicio: capacitacionData.fecha_inicio.toString(),
            fecha_fin: capacitacionData.fecha_fin.toString(),
            numero_dias: capacitacionData.numero_dias.toString(),
            cantidad_horas: capacitacionData.cantidad_horas.toString(),
          });
          setcapacitacion1(data);
        }
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
      });
  }, []);

  function loadExcelReportData(data: ICapacitaciones[]) {
    const reportName = "Capacitaciones";
    const rowData = data.map((item) => ({
      institucion: item.institucion,
      tipo_evento: item.tipo_evento,
      nombre_evento: item.nombre_evento,
      area_estudios: item.area_estudios,
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
      { header: "INSTITUCION" },
      { header: "TIPO DE EVENTO" },
      { header: "NOMBRE DEL EVENTO" },
      { header: "AREA DE ESTUDIOS" },
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
        title: "capacitacion",
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
              Capacitaciones
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
                  <div className="flex flex-wrap w-full h-full  justify-content-between">
                    <label
                      htmlFor="institucion"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "20px" }}
                    >
                      Institución:
                    </label>
                    <InputText
                      className="text-2xl"
                      placeholder="Ingrese la Institución"
                      id="institucion"
                      name="institucion"
                      disabled={formDisabled}
                      style={{ width: "250px" }}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          institucion: e.currentTarget.value,
                        })
                      }
                      value={formData.institucion}
                    />
                  </div>
                  <div className="flex flex-wrap w-full h-full  justify-content-between">
                    <label
                      htmlFor="tipo_evento"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "20px" }}
                    >
                      Tipo de Evento:
                    </label>
                    <Dropdown
                      id="tipo_evento"
                      name="tipo_evento"
                      disabled={formDisabled}
                      options={tipoEventoOptions}
                      onChange={(e) =>
                        setFormData({ ...formData, tipo_evento: e.value })
                      }
                      value={formData.tipo_evento}
                      optionLabel="label"
                      optionValue="value"
                      placeholder="Seleccione el Tipo de Evento"
                      style={{ width: "250px" }} // Ajusta el ancho del Dropdown
                    />
                  </div>
                  <div className="flex flex-wrap w-full h-full  justify-content-between">
                    <label
                      htmlFor="nombre_evento"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "20px" }}
                    >
                      Nombre del Evento:
                    </label>
                    <InputText
                      className="text-2xl"
                      placeholder="Ingrese el Nombre del Evento"
                      id="nombre_evento"
                      name="nombre_evento"
                      disabled={formDisabled}
                      style={{ width: "250px" }}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nombre_evento: e.currentTarget.value,
                        })
                      }
                      value={formData.nombre_evento}
                    />
                  </div>
                </div>
                <div
                  className="flex flex-column flex-wrap gap-4"
                  style={{ marginTop: "-2px", marginLeft: "25px" }}
                >
                  <div className="flex flex-wrap w-full h-full justify-content-between">
                    <label
                      htmlFor="area_estudios"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "20px" }}
                    >
                      Área de Estudios:
                    </label>
                    <Dropdown
                      id="area_estudios"
                      name="area_estudios"
                      disabled={formDisabled}
                      options={areaEstudioOptions}
                      onChange={(e) =>
                        setFormData({ ...formData, area_estudios: e.value })
                      }
                      value={formData.area_estudios}
                      optionLabel="label"
                      optionValue="value"
                      placeholder="Seleccione el Área de Estudio"
                      style={{ width: "250px" }} // Ajusta el ancho del Dropdown
                    />
                  </div>
                  <div className="flex flex-wrap w-full h-full justify-content-between">
                    <label
                      htmlFor="tiempo_dedicacion"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "20px" }}
                    >
                      Tipo de Certificado:
                    </label>
                    <Dropdown
                      id="tiempo_dedicacion"
                      name="tiempo_dedicacion"
                      disabled={formDisabled}
                      options={tipoCertificadoOptions}
                      onChange={(e) =>
                        setFormData({ ...formData, tipo_certificado: e.value })
                      }
                      value={formData.tipo_certificado}
                      optionLabel="label"
                      optionValue="value"
                      placeholder="Seleccione el Tipo de Certificado"
                      style={{ width: "250px" }} // Ajusta el ancho del Dropdown
                    />
                  </div>
                  <div className="flex flex-wrap w-full h-full justify-content-between">
                    <label
                      htmlFor="fecha_inicio"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "20px" }}
                    >
                      Fecha de Inicio:
                    </label>
                    <Calendar
                      className="text-2xl"
                      id="fin"
                      name="fin"
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
                        formData.fecha_inicio ? new Date(formData.fecha_inicio) : null
                      }
                    />
                  </div>
                </div>
                <div
                  className="flex flex-column flex-wrap gap-4"
                  style={{ marginTop: "-2px", marginLeft: "25px" }}
                >
                  <div className="flex flex-wrap w-full h-full justify-content-between">
                    <label
                      htmlFor="fecha_fin"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "20px" }}
                    >
                      Fecha de Fin:
                    </label>
                    <Calendar
                      className="text-2xl"
                      id="fin"
                      name="fin"
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
                          fecha_inicio: selectedDate || null, // asigna undefined si selectedDate es null
                        });
                      }}
                      value={
                        formData.fecha_inicio ? new Date(formData.fecha_inicio) : null
                      }
                    />
                  </div>
                  <div className="flex flex-wrap w-full h-full justify-content-between">
                    <label
                      htmlFor="numero_dias"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "20px" }}
                    >
                      Número de Días:
                    </label>
                    <InputText
                      className="text-2xl"
                      placeholder="Ingrese el Número de Días"
                      id="numero_dias"
                      name="numero_dias"
                      disabled={formDisabled}
                      style={{ width: "250px" }}
                      onChange={(e) => {
                        const numero_dias = parseFloat(e.currentTarget.value); // Convertir a número
                        setFormData({
                          ...formData,
                          numero_dias: isNaN(numero_dias) ? null : numero_dias,
                        });
                      }}
                      value={
                        formData.numero_dias !== null
                          ? formData.numero_dias.toString()
                          : ""
                      }
                    />
                  </div>
                  <div className="flex flex-wrap w-full h-full justify-content-between">
                    <label
                      htmlFor="cantidad_horas"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "20px" }}
                    >
                      Cantidad de Horas:
                    </label>
                    <InputText
                      className="text-2xl"
                      placeholder="Ingrese la Cantidad de Horas"
                      id="cantidad_horas"
                      name="cantidad_horas"
                      disabled={formDisabled}
                      style={{ width: "250px" }}
                      onChange={(e) => {
                        const cantidad_horas = parseFloat(
                          e.currentTarget.value
                        ); // Convertir a número
                        setFormData({
                          ...formData,
                          cantidad_horas: isNaN(cantidad_horas)
                            ? null
                            : cantidad_horas,
                        });
                      }}
                      value={
                        formData.cantidad_horas !== null
                          ? formData.cantidad_horas.toString()
                          : ""
                      }
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
              <th>Institución</th>
              <th>Tipo de Evento</th>
              <th>Nombre del Evento </th>
              <th>Área de Estudios</th>
              <th>Tipo de Certificado</th>
              <th>Fecha de Inicio</th>
              <th>Fecha de Fin</th>
              <th>Número de Días</th>
              <th>Cantidad de Horas</th>
              <th>Evidencia</th>
            </tr>
          </thead>
          <tbody>
            {capacitacion1.map((capacitacion) => (
              <tr
                className="text-center"
                key={capacitacion.id_capacitaciones?.toString()}
              >
                <td>{capacitacion.institucion}</td>
                <td>{capacitacion.tipo_evento}</td>
                <td>{capacitacion.nombre_evento}</td>
                <td>{capacitacion.area_estudios}</td>
                <td>{capacitacion.tipo_certificado}</td>
                <td>
                  {capacitacion.fecha_inicio
                    ? new Date(capacitacion.fecha_inicio).toLocaleDateString(
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
                  {capacitacion.fecha_fin
                    ? new Date(capacitacion.fecha_fin).toLocaleDateString(
                        "es-ES",
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        }
                      )
                    : ""}
                </td>
                <td>{capacitacion.numero_dias + " días"}</td>
                <td>{capacitacion.cantidad_horas + " horas"}</td>
                <td>
                  {capacitacion.evidencia ? (
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
                      onClick={() => decodeBase64(capacitacion.evidencia!)}
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

export default CapacitacionesContextDes;
