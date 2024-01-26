import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import "../../styles/Contrato.css";
import { Fieldset } from "primereact/fieldset";
import { Card } from "primereact/card";
import cardHeader from "../../shared/CardHeader";
import { Divider } from "primereact/divider";
import { IRecomendaciones } from "../../interfaces/Primary/IRecomendaciones";
import { RecomendacionesService } from "../../services/RecomendacionesService";
import { useParams } from "react-router-dom";

interface Params {
  codigoRecomendacion: string;
}

function RecomendacionContextDes() {
  const userData = sessionStorage.getItem("user");
  const userObj = JSON.parse(userData || "{}");
  const idPersona = userObj.id;

  const [recom1, setrecom1] = useState<IRecomendaciones[]>([]);
  const { codigoRecomendacion } = useParams<Params>();
  const codigoRecomendacionNumber = Number(codigoRecomendacion);

  const [formDisabled, setFormDisabled] = useState(false);

  const [formData, setFormData] = useState<IRecomendaciones>({
    id_recomendaciones: 0,
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    correo: "",
    numeroContacto: "",
    persona: {
      id_persona: idPersona,
    },
  });

  const recomService = new RecomendacionesService();

  useEffect(() => {
    recomService
      .getAllByRecomendacion(codigoRecomendacionNumber)
      .then((data) => {
        if (data.length > 0) {
          const contratoData = data[0];
          setFormDisabled(true);
          // Actualiza el estado local aquí
          setFormData({
            ...formData,
            primer_nombre: contratoData.primer_nombre,
            segundo_nombre: contratoData.segundo_nombre,
            primer_apellido: contratoData.primer_apellido,
            segundo_apellido: contratoData.segundo_apellido,
            correo: contratoData.correo,
            numeroContacto: contratoData.numeroContacto,
          });
          setrecom1(data);
        }
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
      });
  }, []);

  return (
    <Fieldset className="fgrid col-fixed ">
      <Card
        header={cardHeader}
        className="border-solid border-blue-800 border-3 flex-1 w-full h-full flex-wrap"
      >
        <div className="h1-rem">
          <Divider align="center">
            <h1 className="text-7xl font-smibold lg:md-2  w-full h-full max-w-full max-h-full min-w-min">
              Recomendaciones
            </h1>
          </Divider>
        </div>

        <div className="flex justify-content-center flex-wrap">
          <form encType="multipart/form-data">
            <div className="flex flex-wrap flex-row">
              <div className="flex align-items-center justify-content-center">
                <div className="flex flex-column flex-wrap gap-4">
                  <div className="flex flex-wrap w-full h-full  justify-content-between">
                    <label
                      htmlFor="primer_nombre"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "30px" }}
                    >
                      Primer Nombre:
                    </label>
                    <InputText
                      className="text-2xl"
                      placeholder="Ingrese el 1er Nombre"
                      id="primer_nombre"
                      disabled={formDisabled}
                      name="primer_nombre"
                      style={{ width: "221px" }}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          primer_nombre: e.currentTarget.value,
                        })
                      }
                      value={formData.primer_nombre}
                    />
                  </div>
                  <div className="flex flex-wrap w-full h-full  justify-content-between">
                    <label
                      htmlFor="segundo_nombre"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "20px" }}
                    >
                      Segundo Nombre:
                    </label>
                    <InputText
                      className="text-2xl"
                      placeholder="Ingrese el 2do Nombre"
                      id="segundo_nombre"
                      disabled={formDisabled}
                      name="segundo_nombre"
                      style={{ width: "221px" }}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          segundo_nombre: e.currentTarget.value,
                        })
                      }
                      value={formData.segundo_nombre}
                    />
                  </div>
                  <div className="flex flex-wrap w-full h-full  justify-content-between">
                    <label
                      htmlFor="primer_apellido"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "20px" }}
                    >
                      Primer Apellido:
                    </label>
                    <InputText
                      className="text-2xl"
                      placeholder="Ingrese el 1er Apellido"
                      id="primer_apellido"
                      disabled={formDisabled}
                      name="primer_apellido"
                      style={{ width: "221px" }}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          primer_apellido: e.currentTarget.value,
                        })
                      }
                      value={formData.primer_apellido}
                    />
                  </div>
                </div>
                <div
                  className="flex flex-column flex-wrap gap-4"
                  style={{ marginLeft: "25px" }}
                >
                  <div className="flex flex-wrap w-full h-full  justify-content-between">
                    <label
                      htmlFor="segundo_apellido"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "20px" }}
                    >
                      Segundo Apellido:
                    </label>
                    <InputText
                      className="text-2xl"
                      placeholder="Ingrese el 2do. Apellido"
                      id="segundo_apellido"
                      disabled={formDisabled}
                      name="segundo_apellido"
                      style={{ width: "221px" }}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          segundo_apellido: e.currentTarget.value,
                        })
                      }
                      value={formData.segundo_apellido}
                    />
                  </div>
                  <div className="flex flex-wrap w-full h-full  justify-content-between">
                    <label
                      htmlFor="correo"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "20px" }}
                    >
                      Filiación de la Publicacion:
                    </label>
                    <InputText
                      className="text-2xl"
                      placeholder="Ingrese el Correo"
                      id="correo"
                      disabled={formDisabled}
                      name="correo"
                      style={{ width: "221px" }}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          correo: e.currentTarget.value,
                        })
                      }
                      value={formData.correo}
                    />
                  </div>
                  <div className="flex flex-wrap w-full h-full  justify-content-between">
                    <label
                      htmlFor="numeroContacto"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "20px" }}
                    >
                      Número de Contacto:
                    </label>
                    <InputText
                      className="text-2xl"
                      placeholder="Ingrese el Número"
                      id="numeroContacto"
                      disabled={formDisabled}
                      name="numeroContacto"
                      style={{ width: "221px" }}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          numeroContacto: e.currentTarget.value,
                        })
                      }
                      value={formData.numeroContacto}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div style={{ marginTop: "50px" }}>
          <table
            style={{ minWidth: "40rem" }}
            className="mt-4  w-full h-full text-3xl font-large"
          >
            <thead>
              <tr style={{ backgroundColor: "#0C3255", color: "white" }}>
                <th>Nº</th>
                <th>Nombres</th>
                <th>Apellidos</th>
                <th>Correo</th>
                <th>Número </th>
              </tr>
            </thead>
            <tbody>
              {recom1.map((recomendaciones) => (
                <tr
                  className="text-center"
                  key={recomendaciones.id_recomendaciones?.toString()}
                >
                  <td>{recomendaciones.id_recomendaciones}</td>
                  <td>
                    {recomendaciones.primer_nombre +
                      " " +
                      recomendaciones.segundo_nombre}
                  </td>
                  <td>
                    {recomendaciones.primer_apellido +
                      " " +
                      recomendaciones.segundo_apellido}
                  </td>

                  <td>{recomendaciones.correo}</td>
                  <td>{recomendaciones.numeroContacto}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Fieldset>
  );
}
export default RecomendacionContextDes;
