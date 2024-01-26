import React, { useEffect, useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import "../../styles/Contrato.css";
import { Fieldset } from "primereact/fieldset";
import { Card } from "primereact/card";
import cardHeader from "../../shared/CardHeader";
import { Divider } from "primereact/divider";
import { ICargaFamiliar } from "../../interfaces/Primary/ICargaFamiliar";
import { CargaFamiliarService } from "../../services/CargaFamiliarService";
import swal from "sweetalert";
import { useParams } from "react-router-dom";

interface Params {
  codigoCarga: string;
}

function CargaContextDes() {
  const userData = sessionStorage.getItem("user");
  const userObj = JSON.parse(userData || "{}");
  const idPersona = userObj.id;

  const [carga1, setcarga1] = useState<ICargaFamiliar[]>([]);
  const { codigoCarga } = useParams<Params>();
  const codigoCargaNumber = Number(codigoCarga);

  const [formDisabled, setFormDisabled] = useState(false);

  const [formData, setFormData] = useState<ICargaFamiliar>({
    id_cargaFamiliar: 0,
    cedula: "",
    nombre_pariente: "",
    apellido_pariente: "",
    fecha_nacimiento: new Date(),
    evidencia: "",
    persona: { id_persona: idPersona },
  });

  const cargaService = new CargaFamiliarService();

  useEffect(() => {
    cargaService
      .getAllByCarga(codigoCargaNumber)
      .then((data) => {
        if (data.length > 0) {
          const contratoData = data[0];
          setFormDisabled(true);
          // Actualiza el estado local aquí
          setFormData({
            ...formData,
            cedula: contratoData.cedula,
            nombre_pariente: contratoData.nombre_pariente,
            apellido_pariente: contratoData.apellido_pariente,
            fecha_nacimiento: contratoData.fecha_nacimiento.toString(),
          });
          setcarga1(data);
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
              Carga Familiar
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
                      htmlFor="cargo"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "20px" }}
                    >
                      Cédula:
                    </label>
                    <InputText
                      className="text-2xl"
                      placeholder="Ingrese la Cédula"
                      id="cargo"
                      disabled={formDisabled}
                      name="cargo"
                      style={{ width: "221px" }}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cedula: e.currentTarget.value,
                        })
                      }
                      value={formData.cedula}
                    />
                  </div>
                  <div className="flex flex-wrap w-full h-full  justify-content-between">
                    <label
                      htmlFor="nombresP"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "20px" }}
                    >
                      Nombre Completo:
                    </label>
                    <InputText
                      className="text-2xl"
                      placeholder="Ingrese los Nombres"
                      id="nombresP"
                      disabled={formDisabled}
                      name="nombresP"
                      style={{ width: "221px" }}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nombre_pariente: e.currentTarget.value,
                        })
                      }
                      value={formData.nombre_pariente}
                    />
                  </div>
                  <div className="flex flex-wrap w-full h-full  justify-content-between">
                    <label
                      htmlFor="apellidoP"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "20px" }}
                    >
                      Apellido Completo:
                    </label>
                    <InputText
                      className="text-2xl"
                      placeholder="Ingrese los Apellidos"
                      id="apellidoP"
                      name="apellidoP"
                      disabled={formDisabled}
                      style={{ width: "221px" }}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          apellido_pariente: e.currentTarget.value,
                        })
                      }
                      value={formData.apellido_pariente}
                    />
                  </div>
                </div>
                <div
                  className="flex flex-column flex-wrap gap-4"
                  style={{ marginTop: "-105px", marginLeft: "25px" }}
                >
                  <div className="flex flex-wrap w-full h-full justify-content-between">
                    <label
                      htmlFor="nacimiento"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "20px" }}
                    >
                      Fecha de Nacimiento:
                    </label>
                    <Calendar
                      className="text-2xl"
                      id="inicio"
                      name="inicio"
                      required
                      placeholder="Ingresa la Fecha de Nacimiento"
                      dateFormat="yy-mm-dd"
                      showIcon
                      maxDate={new Date()}
                      onChange={(e) => {
                        const selectedDate =
                          e.value instanceof Date ? e.value : null;
                        setFormData({
                          ...formData,
                          fecha_nacimiento: selectedDate || null, // asigna undefined si selectedDate es null
                        });
                      }}
                      value={
                        formData.fecha_nacimiento
                          ? new Date(formData.fecha_nacimiento)
                          : null
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
              <th>Cédula </th>
              <th>Nombre</th>
              <th>Fecha de Nacimiento</th>
              <th>Evidencia</th>
            </tr>
          </thead>
          <tbody>
            {carga1.map((cargaF) => (
              <tr
                className="text-center"
                key={cargaF.id_cargaFamiliar?.toString()}
              >
                <td>{cargaF.cedula}</td>
                <td>
                  {cargaF.nombre_pariente + " " + cargaF.apellido_pariente}
                </td>
                <td>
                  {cargaF.fecha_nacimiento
                    ? new Date(cargaF.fecha_nacimiento).toLocaleDateString(
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
                  {cargaF.evidencia ? (
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
                      onClick={() => decodeBase64(cargaF.evidencia!)}
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
