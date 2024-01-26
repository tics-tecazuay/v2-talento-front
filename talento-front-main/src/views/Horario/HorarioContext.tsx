import React, { useEffect, useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { FileUpload, FileUploadSelectEvent } from "primereact/fileupload";
import { Button } from "primereact/button";
import "../../styles/Contrato.css";
import { Fieldset } from "primereact/fieldset";
import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";
import cardHeader from "../../shared/CardHeader";
import { Divider } from "primereact/divider";
import { IHorarioData } from "../../interfaces/Primary/IHorario";
import { VCarreras } from "../../interfaces/Secondary/VCarreras";
import { HorarioService } from "../../services/HorarioService";
import { VPeriodos } from "../../interfaces/Secondary/VPeriodos";
import { VcarreraService } from "../../services/VCarreraService";
import { VPeridosService } from "../../services/VPeridosService";
import swal from "sweetalert";
import { ReportBar } from "../../shared/ReportBar";
import {
  IExcelReportParams,
  IHeaderItem,
} from "../../interfaces/Secondary/IExcelReportParams";

function HorarioContext() {
  //Session Storage
  const userData = sessionStorage.getItem("user");
  const userObj = JSON.parse(userData || "{}");
  const idPersona = userObj.id;
  const rol = userObj.rol;

  const [horario1, sethorario1] = useState<IHorarioData[]>([]);
  const [excelReportData, setExcelReportData] =
    useState<IExcelReportParams | null>(null);

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

  const tipoJornadaOptions = [
    { label: "Seleccione Una", value: "N/A" },
    { label: "MATUTINA", value: "MATUTINA" },
    { label: "VESPERTINA", value: "VESPERTINA" },
    { label: "NOCTURNA", value: "NOCTURNA" },
    { label: "MATUTINA/NOCTURNA", value: "MATUTINA/NOCTURNA" },
    { label: "MATUTINA/VESPERTINA", value: "MATUTINA/VESPERTINA" },
    { label: "VESPERTINA/NOCTURNA", value: "VESPERTINA/NOCTURNA" },
  ];
  const fileUploadRef = useRef<FileUpload>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState<number | undefined>(undefined);
  const horarioService = new HorarioService();

  const loadData = () => {
    if (rol === 1) {
      // Si el rol es 1, traer todos los datos
      horarioService.getAll().then((data) => {
        sethorario1(data);
        setDataLoaded(true); // Marcar los datos como cargados
        loadExcelReportData(data);
      }).catch((error) => {
        console.error("Error al obtener los datos:", error);
      });
    } else if (rol === 3) {
      // Si el rol es 3, traer datos específicos
      horarioService.getAllByPersona(idPersona).then((data) => {
        sethorario1(data);
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

  const customBytesUploader = (event: FileUploadSelectEvent) => {
    if (event.files && event.files.length > 0) {
      const file = event.files[0];
      const reader = new FileReader();

      reader.onloadend = function () {
        const base64data = reader.result as string;
        setFormData({ ...formData, distributivo: base64data });
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
        title: "Horario",
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
      !formData.periodoAcademico ||
      !formData.horasSemanalesHorario ||
      !formData.carreraHorario ||
      !formData.jornadaHorario ||
      !formData.distributivo
    ) {
      swal("Advertencia", "Por favor, complete todos los campos", "warning");
      return;
    }

    horarioService
      .save(formData)
      .then((response) => {
        resetForm();
        swal("Horario", "Datos Guardados Correctamente", "success");

        horarioService
          .getAllByPersona(idPersona)
          .then((data) => {
            sethorario1(data);
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
          horarioService
            .delete(id)
            .then(() => {
              sethorario1(
                horario1.filter((contra) => contra.id_horario !== id)
              );
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
      const editItem = horario1.find((contra) => contra.id_horario === id);
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
      horarioService
        .update(Number(editItemId), formData as IHorarioData)
        .then((response) => {
          swal({
            title: "Horario",
            text: "Datos actualizados correctamente",
            icon: "success",
          });
          setFormData({
            periodoAcademico: "",
            jornadaHorario: "",
            horasSemanalesHorario: "",
            carreraHorario: "",
            distributivo: "",
            persona: null,
          });
          sethorario1(
            horario1.map((contra) =>
              contra.id_horario === editItemId ? response : contra
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
      periodoAcademico: "",
      jornadaHorario: "",
      horasSemanalesHorario: "",
      carreraHorario: "",
      distributivo: "",
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

  return (
    <Fieldset className="fgrid col-fixed ">
      <Card
        header={cardHeader}
        className="border-solid border-blue-800 border-3 flex-1 w-full h-full flex-wrap"
      >
        <div className="h1-rem">
          <Divider align="center">
            <h1 className="text-7xl font-smibold lg:md-2  w-full h-full max-w-full max-h-full min-w-min">
              Distributivo y Horarios
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
                  <div className="flex flex-wrap w-full h-full justify-content-between">
                    <label
                      htmlFor="per_nombre"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "20px", marginLeft: "150px" }}
                    >
                      Periodo Académico:
                    </label>
                    <Dropdown
                      id="per_nombre"
                      name="per_nombre"
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
                      style={{ marginRight: "20px", marginLeft: "150px" }}
                    >
                      Jornada:
                    </label>
                    <Dropdown
                      id="jornadaHorario"
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
                <div className="flex flex-column flex-wrap gap-4">
                  <div className="flex flex-wrap w-full h-full  justify-content-between">
                    <label
                      htmlFor="horas_semanales"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "20px", marginLeft: "150px" }}
                    >
                      Horas de Clases Semanales:
                    </label>
                    <InputText
                      className="text-2xl"
                      placeholder="Ingrese las Horas Semanales"
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
                      style={{ marginRight: "20px", marginLeft: "150px" }}
                    >
                      Carrera con Mayor Carga Horaria:
                    </label>
                    <Dropdown
                      id="cod_carrera"
                      name="cod_carrera"
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
              <Divider align="left">
                <div className="inline-flex align-items-center">
                  <i className="pi pi-file-pdf mr-2"></i>
                  <b>Anexos</b>
                </div>
              </Divider>
              <div className="column">
                <div className="input-box" style={{ marginLeft: "20px" }}>
                  <label htmlFor="pdf" className="font-medium w-auto min-w-min">
                    Subir Horario:
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
              <div
                className="flex flex-row  w-full h-full justify-content-center  flex-grow-1  row-gap-8 gap-8 flex-wrap mt-6"
                style={{ marginLeft: "-45px" }}
              >
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
              <th>Operaciones</th>
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
                    onClick={() => handleEdit(contrato.id_horario?.valueOf())}
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
                    onClick={() => handleDelete(contrato.id_horario?.valueOf())}
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
                      onClick={() => horarioService.getByDistributivo(contrato.id_horario)
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

export default HorarioContext;
