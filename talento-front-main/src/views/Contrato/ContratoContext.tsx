import React, { useEffect, useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { FileUpload, FileUploadSelectEvent } from "primereact/fileupload";
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
import { ReportBar } from "../../shared/ReportBar";
import {
  IExcelReportParams,
  IHeaderItem,
} from "../../interfaces/Secondary/IExcelReportParams";
import app from "../../App";

function ContratoContext() {
  const userData = sessionStorage.getItem("user");
  const userObj = JSON.parse(userData || "{}");
  const idPersona = userObj.id;
  const rol = userObj.rol;

  const [excelReportData, setExcelReportData] =
    useState<IExcelReportParams | null>(null);

  const [contra1, setcontra1] = useState<IContratoData[]>([]);
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

  const fileUploadRef = useRef<FileUpload>(null);

  const [editMode, setEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState<number | undefined>(undefined);
  const contratService = new ContratoService();
  const tiempoDedicacionOptions = [
    { label: "Tiempo Completo", value: "Tiempo Completo" },
    { label: "Medio Tiempo", value: "Medio Tiempo" },
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
    if (rol === 1) {
      // Si el rol es 1, traer todos los datos
      contratService
        .getAll()
        .then((data) => {
          setcontra1(data);
          loadExcelReportData(data);
        })
        .catch((error) => {
          console.error("Error al obtener los datos:", error);
        });
    } else if (rol === 3) {
      // Si el rol es 3, traer datos específicos según el contrato vigente
      contratService
        .getAllByPersona(idPersona)
        .then((data) => {
          setcontra1(data);
          loadExcelReportData(data);
        })
        .catch((error) => {
          console.error("Error al obtener los datos:", error);
        });

      // Lógica para ajustar el formulario si no hay contrato vigente
      if (!formData.contrato_vigente) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          fecha_fin: new Date(),
        }));
      }
    } else {
      console.error("Rol no reconocido");
    }
  }, [formData.contrato_vigente]);

  const customBytesUploader = (event: FileUploadSelectEvent) => {
    if (event.files && event.files.length > 0) {
      const file = event.files[0];
      const reader = new FileReader();

      reader.onloadend = function () {
        const base64data = reader.result as string;
        setFormData({ ...formData, evidencia: base64data });

        console.log("pdf guardado....");
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
      link.download = "archivoCon.pdf";
      link.click();
      swal({
        title: "Contrato",
        text: "Descargando pdf....",
        icon: "success",
        timer: 1000,
      });
      console.log("pdf descargado...");

      URL.revokeObjectURL(fileUrl);
    } catch (error) {
      console.error("Error al decodificar la cadena base64:", error);
    }
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.fecha_inicio ||
      !formData.anio_duracion ||
      !formData.tiempo_dedicacion ||
      !formData.cargo ||
      !formData.horas_diarias ||
      !formData.salario ||
      !formData.salario_publico
    ) {
      swal("Advertencia", "Por favor, complete todos los campos", "warning");
      return;
    }

    // Validar solo números en anio_duracion
    const anioDuracionRegex = /^\d+$/;
    if (!anioDuracionRegex.test(formData.anio_duracion)) {
      swal(
        "Advertencia",
        "Por favor, ingrese solo números en el campo Años de Duracion",
        "warning"
      );
      return;
    }

    const salarioRegex = /^\d+$/;
    if (!salarioRegex.test(formData.salario)) {
      swal(
        "Advertencia",
        "Por favor, ingrese solo números en el campo Salario",
        "warning"
      );
      return;
    }

    const horasRegex = /^\d+$/;
    if (!horasRegex.test(formData.horas_diarias)) {
      swal(
        "Advertencia",
        "Por favor, ingrese solo números en el campo Horas Diarias",
        "warning"
      );
      return;
    }

    contratService
      .save(formData)
      .then((response) => {
        resetForm();
        swal("Contrato", "Datos Guardados Correctamente", "success");

        contratService
          .getAllByPersona(idPersona)
          .then((data) => {
            setcontra1(data);
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
          contratService
            .delete(id)
            .then(() => {
              setcontra1(contra1.filter((contra) => contra.id_contrato !== id));
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
      const editItem = contra1.find((contra) => contra.id_contrato === id);
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
      contratService
        .update(Number(editItemId), formData as IContratoData)
        .then((response) => {
          swal({
            title: "Contrato",
            text: "Datos actualizados correctamente",
            icon: "success",
          });
          setFormData({
            fecha_inicio: new Date(),
            fecha_fin: new Date(),
            anio_duracion: "",
            horas_diarias: "",
            salario: "",
            cargo: "",
            evidencia: "",
            tiempo_dedicacion: "",
            salario_publico: "",
            contrato_vigente: false,
            persona: null,
          });
          setcontra1(
            contra1.map((contra) =>
              contra.id_contrato === editItemId ? response : contra
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
      id_contrato: 0,
      fecha_inicio: new Date(),
      fecha_fin: new Date(),
      anio_duracion: "",
      horas_diarias: "",
      salario: "",
      cargo: "",
      evidencia: "",
      tiempo_dedicacion: "",
      salario_publico: "",
      contrato_vigente: false,
      persona: null,
    });
    setEditMode(false);
    setEditItemId(undefined);
    if (fileUploadRef.current) {
      fileUploadRef.current.clear(); // Limpiar el campo FileUpload
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
          <Divider align="left">
            <div className="inline-flex align-items-center">
              <i className="pi pi-book mr-2"></i>
              <b>Formulario </b>
            </div>
          </Divider>
        </div>

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
                      htmlFor="inicio"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "20px", marginLeft: "100px" }}
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
                      style={{ marginRight: "20px", marginLeft: "100px" }}
                    >
                      Fecha Fin:
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
                      style={{ marginRight: "20px", marginLeft: "100px" }}
                    >
                      Años de duracion:
                    </label>
                    <InputText
                      className="text-2xl"
                      id="anios"
                      required
                      placeholder="Ingresa los años de duracion"
                      name="anios"
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
                <div className="flex flex-column flex-wrap gap-4">
                  <div className="flex flex-wrap w-full h-full  justify-content-between  ">
                    <label
                      htmlFor="horas"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "20px", marginLeft: "100px" }}
                    >
                      Horas:
                    </label>
                    <InputText
                      className="text-2xl"
                      id="horas"
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
                      style={{ marginRight: "20px", marginLeft: "100px" }}
                    >
                      Cargo:
                    </label>
                    <InputText
                      className="text-2xl"
                      id="cargo"
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
                      style={{ marginRight: "20px", marginLeft: "100px" }}
                    >
                      Salario:
                    </label>
                    <InputText
                      className="text-2xl"
                      id="salario"
                      name="salario"
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
                <div className="flex flex-column flex-wrap gap-4">
                  <div className="flex flex-wrap w-full h-full justify-content-between">
                    <label
                      htmlFor="tiempo_dedicacion"
                      className="text-3xl font-medium w-auto min-w-min"
                      style={{ marginRight: "20px", marginLeft: "100px" }}
                    >
                      Tiempo Dedicación:
                    </label>
                    <Dropdown
                      className="text-2xl"
                      id="tiempo_dedicacion"
                      name="tiempo_dedicacion"
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
                      style={{ marginRight: "20px", marginLeft: "100px" }}
                    >
                      Salario Público:
                    </label>
                    <Dropdown
                      className="text-2xl"
                      id="salario_publico"
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
                      style={{ marginRight: "20px", marginLeft: "100px" }}
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
              <Divider align="left">
                <div className="inline-flex align-items-center">
                  <i className="pi pi-file-pdf mr-2"></i>
                  <b>Anexos</b>
                </div>
              </Divider>
              <div className="column">
                <div className="input-box" style={{ marginLeft: "20px" }}>
                  <label htmlFor="pdf" className="font-medium w-auto min-w-min">
                    Subir Certificado:
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
          </form>
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
              <th>Operaciones</th>
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
                      marginRight: "8px", // Espacio entre los botones
                    }}
                    onClick={() => handleEdit(contrato.id_contrato?.valueOf())}
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
                    onClick={() =>
                      handleDelete(contrato.id_contrato?.valueOf())
                    }
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
                      onClick={() =>contratService.getByEvidencia(contrato.id_contrato)
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

export default ContratoContext;
