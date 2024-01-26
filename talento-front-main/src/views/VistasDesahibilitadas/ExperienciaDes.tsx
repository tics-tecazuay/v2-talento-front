import React, { useEffect, useState, useRef } from "react";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Fieldset } from "primereact/fieldset";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Calendar } from "primereact/calendar";
import cardHeader from "../../shared/CardHeader";
import { Divider } from "primereact/divider";
import { IExperiencia } from "../../interfaces/Primary/IExperiencia";
import { ExperienciaService } from "../../services/ExperienciaService";
import swal from "sweetalert";

import { useParams } from "react-router-dom";

interface Params {
  codigoExperiencia: string;
}

function CargaContextDes() {
  const userData = sessionStorage.getItem("user");
  const userObj = JSON.parse(userData || "{}");
  const idPersona = userObj.id;

  const [exp1, setexp1] = useState<IExperiencia[]>([]);
  const { codigoExperiencia } = useParams<Params>();
  const codigoExperienciaNumber = Number(codigoExperiencia);

  const [formDisabled, setFormDisabled] = useState(false);

  const [formData, setFormData] = useState<IExperiencia>({
    id_experiencia: 0,
    institucion: "",
    puesto: "",
    area_trabajo: "",
    fecha_inicio: new Date(),
    fecha_fin: new Date(),
    actividades: "",
    estado: false,
    certificado_trabajo: "",
    persona: { id_persona: idPersona },
  });

  const expService = new ExperienciaService();

  const areaTrabajoOptions = [
    { label: "Administrativo", value: "Administrativo" },
    { label: "Docencia", value: "Docencia" },
    { label: "Recursos Humanos", value: "Recursos Humanos" },
    { label: "Otros", value: "Otros" },
  ];

  useEffect(() => {
    expService
      .getAllByExperiencia(codigoExperienciaNumber)
      .then((data) => {
        if (data.length > 0) {
          const contratoData = data[0];
          setFormDisabled(true);
          // Actualiza el estado local aquí
          setFormData({
            ...formData,
            institucion: contratoData.institucion,
            puesto: contratoData.puesto,
            area_trabajo: contratoData.area_trabajo,
            fecha_inicio: contratoData.fecha_inicio,
            fecha_fin: contratoData.fecha_fin,
            actividades: contratoData.actividades,
            estado: contratoData.estado,
          });
          setexp1(data);
        }
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
      });
  }, []);

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
              Experiencia
            </h1>
          </Divider>
        </div>

        <div
          className="flex justify-content-center flex-wrap"
          style={{ marginLeft: "60px" }}
        >
          <form
            encType="multipart/form-data"
          >
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
                      disabled={formDisabled}
                      name="institucion"
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
                      htmlFor="puesto"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "20px" }}
                    >
                      Puesto:
                    </label>
                    <InputText
                      className="text-2xl"
                      placeholder="Ingrese su Puesto Anterior"
                      id="puesto"
                      disabled={formDisabled}
                      name="puesto"
                      style={{ width: "250px" }}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          puesto: e.currentTarget.value,
                        })
                      }
                      value={formData.puesto}
                    />
                  </div>
                </div>
                <div
                  className="flex flex-column flex-wrap gap-4"
                  style={{ marginTop: "-2px", marginLeft: "25px" }}
                >
                  <div className="flex flex-wrap w-full h-full justify-content-between">
                    <label
                      htmlFor="area_trabajo"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "20px" }}
                    >
                      Área de Trabajo:
                    </label>
                    <Dropdown
                      id="area_trabajo"
                      name="area_trabajo"
                      disabled={formDisabled}
                      options={areaTrabajoOptions}
                      onChange={(e) =>
                        setFormData({ ...formData, area_trabajo: e.value })
                      }
                      value={formData.area_trabajo}
                      optionLabel="label"
                      optionValue="value"
                      placeholder="Seleccione el Área de Trabajo"
                      style={{ width: "250px" }} // Ajusta el ancho del Dropdown
                    />
                  </div>
                  <div className="flex flex-wrap w-full h-full justify-content-between">
                    <label
                      htmlFor="actividades"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "20px" }}
                    >
                      Actividades:
                    </label>
                    <InputText
                      className="text-2xl"
                      placeholder="Ingrese sus Actividades"
                      id="actividades"
                      name="actividades"
                      disabled={formDisabled}
                      style={{ width: "250px" }}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          actividades: e.currentTarget.value,
                        })
                      }
                      value={formData.actividades}
                    />
                  </div>
                </div>
                <div
                  className="flex flex-column flex-wrap gap-4"
                  style={{ marginTop: "-2px", marginLeft: "25px" }}
                >
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
                      placeholder="Ingresa la Fecha de Inicio"
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
                </div>
              </div>
            </div>
          </form>
        </div>
        <table
          style={{ minWidth: "40rem" }}
          className="mt-4  w-full h-full text-3xl font-large"
        >
          <thead>
            <tr style={{ backgroundColor: "#0C3255", color: "white" }}>
              <th>Institución</th>
              <th>Puesto</th>
              <th>Área de Trabajo</th>
              <th>Actividades</th>
              <th>Fecha de Inicio</th>
              <th>Fecha de Fin</th>
              <th>Evidencia</th>
            </tr>
          </thead>
          <tbody>
            {exp1.map((exp) => (
              <tr className="text-center" key={exp.id_experiencia?.toString()}>
                <td>{exp.institucion}</td>
                <td>{exp.puesto}</td>
                <td>{exp.area_trabajo}</td>
                <td>{exp.actividades}</td>
                <td>
                  {exp.fecha_inicio
                    ? new Date(exp.fecha_inicio).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                    : ""}
                </td>

                <td>
                  {exp.fecha_fin
                    ? new Date(exp.fecha_fin).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                    : ""}
                </td>

                <td>
                  {exp.certificado_trabajo ? (
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
                      onClick={() => decodeBase64(exp.certificado_trabajo!)}
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
