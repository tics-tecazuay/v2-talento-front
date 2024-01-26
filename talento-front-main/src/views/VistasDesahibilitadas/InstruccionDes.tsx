import React, { useEffect, useState,  } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import "../../styles/Contrato.css";
import { Fieldset } from "primereact/fieldset";
import { Card } from "primereact/card";
import cardHeader from "../../shared/CardHeader";
import { Divider } from "primereact/divider";
import { InstruccionFormalData } from "../../interfaces/Primary/IInstrucc_Formal";
import { Instruc_FormalService } from "../../services/Instru_FormalService";
import swal from "sweetalert";
import { useParams } from "react-router-dom";
interface Params {
  codigoInstrucc: string;
}

function InstruccionContextDes() {
  const userData = sessionStorage.getItem("user");
  const userObj = JSON.parse(userData || "{}");
  const idPersona = userObj.id;

  const [instruc1, setinstruc1] = useState<InstruccionFormalData[]>([]);
  const { codigoInstrucc } = useParams<Params>();
  const codigoInstruccNumber = Number(codigoInstrucc);

  const [formDisabled, setFormDisabled] = useState(false);

  const [formData, setFormData] = useState<InstruccionFormalData>({
    id_instruccion: 0,
    nivelInstruccion: "",
    institucionEducativa: "",
    tituloObtenido: "",
    num_SenecytRegistro: "",
    tiempoEstudio: 0,
    anioGraduacion: 0,
    areaEstudios: "",
    titulo: "",
    persona: { id_persona: idPersona },
  });

  const instrucFormalService = new Instruc_FormalService();

  useEffect(() => {
    instrucFormalService
      .getAllByInstruccion(codigoInstruccNumber)
      .then((data) => {
        if (data.length > 0) {
          const contratoData = data[0];
          setFormDisabled(true);
          setFormData({
            ...formData,
            nivelInstruccion: contratoData.nivelInstruccion,
            institucionEducativa: contratoData.institucionEducativa,
            tituloObtenido: contratoData.tituloObtenido,
            num_SenecytRegistro: contratoData.num_SenecytRegistro,
            tiempoEstudio: contratoData.tiempoEstudio,
            anioGraduacion: contratoData.anioGraduacion,
            areaEstudios: contratoData.areaEstudios,
          });
          setinstruc1(data);
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
              Instrucción Formal
            </h1>
          </Divider>
        </div>

        <div className="flex justify-content-center flex-wrap">
          <form
            encType="multipart/form-data"
          >
            <div className="flex flex-wrap flex-row">
              <div className="flex align-items-center justify-content-center">
                <div className="flex flex-column flex-wrap gap-4">
                  <div className="flex flex-wrap w-full h-full  justify-content-between">
                    <label
                      htmlFor="cargo"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "20px" }}
                    >
                      Nivel de Instrucción:
                    </label>
                    <InputText
                      className="text-2xl"
                      placeholder="Ingrese el Nivel de Instrucción"
                      id="cargo"
                      name="cargo"
                      disabled={formDisabled}
                      style={{ width: "221px" }}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nivelInstruccion: e.currentTarget.value,
                        })
                      }
                      value={formData.nivelInstruccion}
                    />
                  </div>
                  <div className="flex flex-wrap w-full h-full  justify-content-between">
                    <label
                      htmlFor="cargo"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "20px" }}
                    >
                      Institución Educativa:
                    </label>
                    <InputText
                      className="text-2xl"
                      placeholder="Ingrese la Institución"
                      id="cargo"
                      name="cargo"
                      disabled={formDisabled}
                      style={{ width: "221px" }}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          institucionEducativa: e.currentTarget.value,
                        })
                      }
                      value={formData.institucionEducativa}
                    />
                  </div>
                  <div className="flex flex-wrap w-full h-full  justify-content-between">
                    <label
                      htmlFor="cargo"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "20px" }}
                    >
                      Titulo Obtenido:
                    </label>
                    <InputText
                      className="text-2xl"
                      placeholder="Ingrese el Titulo"
                      id="cargo"
                      name="cargo"
                      disabled={formDisabled}
                      style={{ width: "221px" }}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tituloObtenido: e.currentTarget.value,
                        })
                      }
                      value={formData.tituloObtenido}
                    />
                  </div>
                </div>
                <div
                  className="flex flex-column flex-wrap gap-4"
                  style={{ marginTop: "-3px", marginLeft: "25px" }}
                >
                  <div className="flex flex-wrap w-full h-full  justify-content-between">
                    <label
                      htmlFor="filiacion"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "20px" }}
                    >
                      Nº de Registro de Senecyt:
                    </label>
                    <InputText
                      className="text-2xl"
                      placeholder="Ingrese el Registro de Senecyt"
                      id="filiacion"
                      disabled={formDisabled}
                      name="filiacion"
                      style={{ width: "221px" }}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          num_SenecytRegistro: e.currentTarget.value,
                        })
                      }
                      value={formData.num_SenecytRegistro}
                    />
                  </div>
                  <div className="flex flex-wrap w-full h-full justify-content-between">
                    <label
                      htmlFor="tiempoEstudio"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "20px" }}
                    >
                      Tiempo de Estudio:
                    </label>
                    <InputText
                      className="text-2xl"
                      placeholder="Ingrese el Tiempo de Estudio"
                      id="tiempoEstudio"
                      disabled={formDisabled}
                      name="tiempoEstudio"
                      style={{ width: "221px" }}
                      onChange={(e) => {
                        const tiempoEstudio = parseFloat(e.currentTarget.value);
                        setFormData({
                          ...formData,
                          tiempoEstudio: isNaN(tiempoEstudio)
                            ? null
                            : tiempoEstudio,
                        });
                      }}
                      value={
                        formData.tiempoEstudio !== null
                          ? formData.tiempoEstudio.toString()
                          : ""
                      }
                    />
                  </div>

                  <div className="flex flex-wrap w-full h-full justify-content-between">
                    <label
                      htmlFor="anioGraduacion"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "20px" }}
                    >
                      Año de Graduación:
                    </label>
                    <InputText
                      className="text-2xl"
                      placeholder="Ingrese el Año de Graduación"
                      id="anioGraduacion"
                      name="anioGraduacion"
                      disabled={formDisabled}
                      style={{ width: "221px" }}
                      onChange={(e) => {
                        const anioGraduacion = parseFloat(
                          e.currentTarget.value
                        ); // Convertir a número
                        setFormData({
                          ...formData,
                          anioGraduacion: isNaN(anioGraduacion)
                            ? null
                            : anioGraduacion, // Establecer como null si no es un número válido
                        });
                      }}
                      value={
                        formData.anioGraduacion !== null
                          ? formData.anioGraduacion.toString()
                          : ""
                      }
                    />
                  </div>
                </div>
                <div
                  className="flex flex-column flex-wrap gap-4"
                  style={{ marginTop: "-107px", marginLeft: "25px" }}
                >
                  <div className="flex flex-wrap w-full h-full  justify-content-between">
                    <label
                      htmlFor="area"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "20px" }}
                    >
                      Area de Estudios
                    </label>
                    <InputText
                      className="text-2xl"
                      placeholder="Ingrese el Area de Estudios"
                      id="area"
                      disabled={formDisabled}
                      name="area"
                      style={{ width: "221px" }}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          areaEstudios: e.currentTarget.value,
                        })
                      }
                      value={formData.areaEstudios}
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
              <th>Nivel de Instrucción</th>
              <th>Institución Educativa </th>
              <th>Titulo Obtenido </th>
              <th>Nº de Registro de Senecyt</th>
              <th>Tiempo de estudio</th>
              <th>Año de Graduación</th>
              <th>Area de Estudio </th>
              <th>Evidencia</th>
            </tr>
          </thead>
          <tbody>
            {instruc1.map((instruc) => (
              <tr
                className="text-center"
                key={instruc.id_instruccion?.toString()}
              >
                <td>{instruc.nivelInstruccion}</td>
                <td>{instruc.institucionEducativa}</td>
                <td>{instruc.tituloObtenido}</td>
                <td>{instruc.num_SenecytRegistro}</td>
                <td>{instruc.tiempoEstudio + " años"}</td>
                <td>{instruc.anioGraduacion}</td>
                <td>{instruc.areaEstudios}</td>
                <td>
                  {instruc.titulo ? (
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
                      onClick={() => decodeBase64(instruc.titulo!)}
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

export default InstruccionContextDes;
