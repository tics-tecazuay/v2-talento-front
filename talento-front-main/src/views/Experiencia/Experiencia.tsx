import React, { useEffect, useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { FileUpload, FileUploadSelectEvent } from "primereact/fileupload";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Fieldset } from "primereact/fieldset";
import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";
import cardHeader from "../../shared/CardHeader";
import { Divider } from "primereact/divider";
import { IExperiencia } from "../../interfaces/Primary/IExperiencia";
import { ExperienciaService } from "../../services/ExperienciaService";
import swal from "sweetalert";
import { ReportBar } from "../../shared/ReportBar";
import {
  IExcelReportParams,
  IHeaderItem,
} from "../../interfaces/Secondary/IExcelReportParams";

function Experiencia() {
  //Session Storage
  const userData = sessionStorage.getItem("user");
  const userObj = JSON.parse(userData || "{}");
  const idPersona = userObj.id;
  const rol = userObj.rol;

  const [exp1, setexp1] = useState<IExperiencia[]>([]);
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

  const [excelReportData, setExcelReportData] =
    useState<IExcelReportParams | null>(null);

  const areaTrabajoOptions = [
    { label: "Administrativo", value: "Administrativo" },
    { label: "Docencia", value: "Docencia" },
    { label: "Vinculación", value: "Vinculación" },
    { label: "Investigación", value: "Investigación" },
    { label: "Recursos Humanos", value: "Recursos Humanos" },
    { label: "Otros", value: "Otros" },
  ];

  const fileUploadRef = useRef<FileUpload>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState<number | undefined>(undefined);
  const expService = new ExperienciaService();

  const loadData = () => {
    if (rol === 1) {
      // Si el rol es 1, traer todos los datos
      expService.getAllItems().then((data) => {
        setexp1(data);
        setDataLoaded(true); // Marcar los datos como cargados
        loadExcelReportData(data);
      }).catch((error) => {
        console.error("Error al obtener los datos:", error);
      });
    } else if (rol === 3) {
      // Si el rol es 3, traer datos específicos
      expService.getAllByPersona(idPersona).then((data) => {
        setexp1(data);
        setDataLoaded(true); // Marcar los datos como cargados
        loadExcelReportData(data);
      }).catch((error) => {
        console.error("Error al obtener los datos:", error);
      });
    } else {
      console.error("Rol no reconocido");
    }
  };
  
  useEffect(() => {
    loadData();
  }, []);
  

  const customBytesUploader = (event: FileUploadSelectEvent) => {
    if (event.files && event.files.length > 0) {
      const file = event.files[0];
      const reader = new FileReader();

      reader.onloadend = function () {
        const base64data = reader.result as string;
        setFormData({ ...formData, certificado_trabajo: base64data });
      };

      reader.onerror = (error) => {
        console.error("Error al leer el archivo:", error);
      };

      reader.readAsDataURL(file);

      if (fileUploadRef.current) {
        fileUploadRef.current.clear();
      }
    }
  };

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
      link.download = "Evidencias Capacitaciones.pdf";
      link.click();
      swal({
        title: "Experiencia",
        text: "Descargando pdf....",
        icon: "success",
        timer: 1000,
      });

      URL.revokeObjectURL(fileUrl);
    } catch (error) {
      console.error("Error al decodificar la cadena base64:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.institucion ||
      !formData.puesto ||
      !formData.area_trabajo ||
      !formData.fecha_inicio ||
      !formData.fecha_fin ||
      !formData.actividades ||
      !formData.certificado_trabajo
    ) {
      swal("Advertencia", "Por favor, complete todos los campos", "warning");
      return;
    }

    expService
      .createItem(formData)
      .then((response) => {
        resetForm();
        swal("Experiencia", "Datos Guardados Correctamente", "success");

        expService
          .getAllItems()
          .then((data) => {
            setexp1(data);
            resetForm();
            if (fileUploadRef.current) {
              fileUploadRef.current.clear();
            }
          })
          .catch((error) => {
            console.error("Error al obtener los datos:", error);
          });
      })
      .catch((error) => {
        console.error("Error al enviar el formulario:", error);
      });
  };

  const handleDelete = (id: number | undefined) => {
    if (id !== undefined) {
      swal({
        title: "Confirmar Eliminación",
        text: "¿Estás seguro de eliminar este registro?",
        icon: "warning",
        buttons: {
          cancel: {
            text: "Cancelar",
            visible: true,
            className: "cancel-button",
          },
          confirm: {
            text: "Sí, eliminar",
            className: "confirm-button",
          },
        },
      }).then((confirmed) => {
        if (confirmed) {
          expService
            .deleteItem(id)
            .then(() => {
              setexp1(exp1.filter((exp) => exp.id_experiencia !== id));
              swal(
                "Eliminado",
                "El registro ha sido eliminado correctamente",
                "error"
              );
            })
            .catch((error) => {
              console.error("Error al eliminar el registro:", error);
              swal(
                "Error",
                "Ha ocurrido un error al eliminar el registro",
                "error"
              );
            });
        }
      });
    }
  };

  const handleEdit = (id: number | undefined) => {
    if (id !== undefined) {
      const editItem = exp1.find((exp) => exp.id_experiencia === id);
      if (editItem) {
        setFormData(editItem);

        setEditMode(true);
        setEditItemId(id);
      }
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editItemId !== undefined) {
      expService
        .updateItem(Number(editItemId), formData as IExperiencia)
        .then((response) => {
          swal({
            title: "Experiencia",
            text: "Datos actualizados correctamente",
            icon: "success",
          });
          setFormData({
            institucion: "",
            puesto: "",
            area_trabajo: "",
            fecha_inicio: new Date(),
            fecha_fin: new Date(),
            actividades: "",
            estado: false,
            certificado_trabajo: "",
            persona: null,
          });
          setexp1(
            exp1.map((exp) =>
              exp.id_experiencia === editItemId ? response : exp
            )
          );
          setEditMode(false);
          setEditItemId(undefined);
        })
        .catch((error) => {
          console.error("Error al actualizar el formulario:", error);
        });
    }
  };

  const resetForm = () => {
    setFormData({
      institucion: "",
      puesto: "",
      area_trabajo: "",
      fecha_inicio: new Date(),
      fecha_fin: new Date(),
      actividades: "",
      estado: false,
      certificado_trabajo: "",
      persona: null,
    });
    setEditMode(false);
    setEditItemId(undefined);
    if (fileUploadRef.current) {
      fileUploadRef.current.clear(); // Limpiar el campo FileUpload
    }
  };
  if (!dataLoaded) {
    return <div>Cargando datos...</div>;
  }

  function loadExcelReportData(data: IExperiencia[]) {
    const reportName = "Experiencia";
    const rowData = data.map((item) => ({
      institucion: item.institucion,
      puesto: item.puesto,
      area_trabajo: item.area_trabajo,
      actividades: item.actividades,
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
      { header: "PUESTO" },
      { header: "AREA DE TRABAJO" },
      { header: "ACTIVIDADES" },
      { header: "FECHA DE INICIO" },
      { header: "FECHA DE FIN" },
    ];
    setExcelReportData({
      reportName,
      headerItems,
      rowData,
    });
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
              Experiencia
            </h1>
          </Divider>
        </div>
        <Divider align="left">
          <div className="inline-flex align-items-center">
            <i className="pi pi-book mr-2"></i>
            <b>Formulario </b>
          </div>
        </Divider>

        <div className="flex justify-content-center flex-wrap">
          <form
            onSubmit={editMode ? handleUpdate : handleSubmit}
            encType="multipart/form-data"
          >
            <div className="flex flex-wrap flex-row">
              <div className="flex align-items-center justify-content-center">
                <div className="flex flex-column flex-wrap gap-4">
                  <div className="flex flex-wrap w-full h-full  justify-content-between">
                    <label
                      htmlFor="institucion"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "20px", marginLeft: "60px" }}
                    >
                      Institución:
                    </label>
                    <InputText
                      className="text-2xl"
                      placeholder="Ingrese la Institución"
                      id="institucion"
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
                      style={{ marginRight: "20px", marginLeft: "60px" }}
                    >
                      Puesto:
                    </label>
                    <InputText
                      className="text-2xl"
                      placeholder="Ingrese su Puesto Anterior"
                      id="puesto"
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
                <div className="flex flex-column flex-wrap gap-4">
                  <div className="flex flex-wrap w-full h-full justify-content-between">
                    <label
                      htmlFor="area_trabajo"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "20px", marginLeft: "60px" }}
                    >
                      Área de Trabajo:
                    </label>
                    <Dropdown
                      id="area_trabajo"
                      name="area_trabajo"
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
                      style={{ marginRight: "20px", marginLeft: "60px" }}
                    >
                      Actividades:
                    </label>
                    <InputText
                      className="text-2xl"
                      placeholder="Ingrese sus Actividades"
                      id="actividades"
                      name="actividades"
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
                <div className="flex flex-column flex-wrap gap-4">
                  <div className="flex flex-wrap w-full h-full justify-content-between">
                    <label
                      htmlFor="fecha_inicio"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "20px", marginLeft: "60px" }}
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
                      style={{ marginRight: "20px", marginLeft: "60px" }}
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

              <Divider align="left">
                <div className="inline-flex align-items-center">
                  <i className="pi pi-file-pdf mr-2"></i>
                  <b>Anexos</b>
                </div>
              </Divider>
              <div className="column">
                <div className="input-box" style={{ marginLeft: "20px" }}>
                  <label htmlFor="pdf" className="font-medium w-auto min-w-min">
                    Subir Certificado de Experiencia:
                  </label>
                  <FileUpload
                    name="pdf"
                    chooseLabel="Escoger"
                    uploadLabel="Cargar"
                    cancelLabel="Cancelar"
                    emptyTemplate={
                      <p className="m-0 p-button-rounded">
                        Arrastre y suelte los archivos aquí para cargarlos.
                      </p>
                    }
                    customUpload
                    onSelect={customBytesUploader}
                    accept="application/pdf"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-row  w-full h-full justify-content-center  flex-grow-1  row-gap-8 gap-8 flex-wrap mt-6">
              <div className="flex align-items-center justify-content-center w-auto min-w-min">
                <Button
                  type="submit"
                  label={editMode ? "Actualizar" : "Guardar"}
                  className="w-full text-3xl min-w-min "
                  rounded
                  onClick={editMode ? handleUpdate : handleSubmit}
                />
              </div>
              <div className="flex align-items-center justify-content-center w-auto min-w-min">
                <Button
                  type="button"
                  label="Cancelar"
                  className="w-full text-3xl min-w-min"
                  rounded
                  onClick={resetForm}
                />
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
              <th>Puesto</th>
              <th>Área de Trabajo</th>
              <th>Actividades</th>
              <th>Fecha de Inicio</th>
              <th>Fecha de Fin</th>
              <th>Operaciones</th>
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
                  <Button
                    type="button"
                    className=""
                    label="✎"
                    style={{
                      background: "#ff9800",
                      borderRadius: "5%",
                      fontSize: "25px",
                      width: "50px",
                      color: "black",
                      justifyContent: "center",
                    }}
                    onClick={() => handleEdit(exp.id_experiencia?.valueOf())}
                    // Agrega el evento onClick para la operación de editar
                  />
                  <Button
                    type="button"
                    className=""
                    label="✘"
                    style={{
                      background: "#ff0000",
                      borderRadius: "10%",
                      fontSize: "25px",
                      width: "50px",
                      color: "black",
                      justifyContent: "center",
                    }}
                    onClick={() => handleDelete(exp.id_experiencia?.valueOf())}
                    // Agrega el evento onClick para la operación de eliminar
                  />
                </td>
                <td>
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
                      onClick={() => expService.getByEvidencia(exp.id_experiencia)
                          .then((response) => {
                            if(response && response.trim() !== '') {
                              console.log("resultado: "+response.toString());
                              decodeBase64(response);
                            } else {
                              swal({
                                title: "Evidencia",
                                text: "SIN EVIDENCIA",
                                icon: "warning",
                                timer: 1000,
                              });
                              console.error("Error: response está indefinido o vacío");
                            }
                          })
                          .catch((error) => {
                            console.error("Error al obtener datos:", error);
                          })

                      }
                    />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Fieldset>
  );
}

export default Experiencia;
