import { Card } from "primereact/card";
import { Fieldset } from "primereact/fieldset";
import { Button } from "primereact/button";
import cardHeader from "../../shared/CardHeader";
import { InputTextarea } from "primereact/inputtextarea";
import React, { useEffect, useState } from "react";
import { Divider } from "primereact/divider";
import { IHabilidadesData } from "../../interfaces/Primary/IHabilidades";
import { HabilidadesService } from "../../services/HabilidadesService";
import swal from "sweetalert";
import { ReportBar } from "../../shared/ReportBar";
import {
  IExcelReportParams,
  IHeaderItem,
} from "../../interfaces/Secondary/IExcelReportParams";

function HabilidadesContext() {
  //Session Storage
  const userData = sessionStorage.getItem("user");
  const userObj = JSON.parse(userData || "{}");
  const idPersona = userObj.id;
  const rol = userObj.rol;

  const [excelReportData, setExcelReportData] = useState<IExcelReportParams | null>(null);

  const [habi1, sethabi1] = useState<IHabilidadesData[]>([]);
  const [formData, setFormData] = useState<IHabilidadesData>({
    id_habilidades: 0,
    descripcion: "",
    persona: { id_persona: idPersona },
  });

  const [editMode, setEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState<number | undefined>(undefined);
  const habilidadService = new HabilidadesService();

  const loadData = () => {
    if (rol === 1) {
      // Si el rol es 1, traer todos los datos
      habilidadService.getAll().then((data) => {
        sethabi1(data);
        loadExcelReportData(data);
      }).catch((error) => {
        console.error("Error al obtener los datos:", error);
      });
    } else if (rol === 3) {
      // Si el rol es 3, traer datos específicos
      habilidadService.getAllByPersona(idPersona).then((data) => {
        sethabi1(data);
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
  

  function loadExcelReportData(data: IHabilidadesData[]) {
    const reportName = "Habilidades";
    const rowData = data.map((item) => ({
      descripcion: item.descripcion,
    }));
    const headerItems: IHeaderItem[] = [{ header: "DESCRIPCION" }];
    setExcelReportData({
      reportName,
      headerItems,
      rowData,
    });
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.descripcion) {
      swal("Advertencia", "Por favor, complete todos los campos", "warning");
      return;
    }

    habilidadService
      .save(formData)
      .then((response) => {
        resetForm();
        swal("Habilidad", "Datos Guardados Correctamente", "success");
        habilidadService
          .getAllByPersona(idPersona)
          .then((data) => {
            sethabi1(data);
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
          habilidadService
            .delete(id)
            .then(() => {
              sethabi1(habi1.filter((habi) => habi.id_habilidades !== id));
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
      const editItem = habi1.find((habi) => habi.id_habilidades === id);
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
      habilidadService
        .update(Number(editItemId), formData as IHabilidadesData)
        .then((response) => {
          swal({
            title: "Habilidad",
            text: "Datos actualizados correctamente",
            icon: "success",
          });
          setFormData({ ...formData });
          sethabi1(
            habi1.map((habi) =>
              habi.id_habilidades === editItemId ? response : habi
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
      descripcion: "",
      persona: null,
    });
    setEditMode(false);
    setEditItemId(undefined);
  };

  return (
    <Fieldset className="fgrid col-fixed">
      <Card
        header={cardHeader}
        className="border-solid border-blue-800 border-3"
      >
        <div className="h1-rem">
          <Divider align="center">
            <h1 className="text-7xl font-smibold lg:md-2">Habilidades</h1>
          </Divider>
        </div>
        <div className="flex justify-content-center ">
          <form onSubmit={editMode ? handleUpdate : handleSubmit}>
            <div className="flex align-content-center w-auto max-w-full">
              <InputTextarea
                autoResize
                rows={5}
                cols={30}
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
                placeholder="Describa su habilidad"
                className="w-max text-2xl "
              />
            </div>

            <div className="flex flex-row  w-full h-full justify-content-center  flex-grow-1  row-gap-8 gap-8 flex-wrap mt-6">
              <div className="flex align-items-center justify-content-center w-auto min-w-min">
                <Button
                  type="submit"
                  label={editMode ? "Actualizar" : "Guardar"}
                  onClick={editMode ? handleUpdate : handleSubmit}
                  className="w-full text-3xl min-w-min "
                  rounded
                />
              </div>
              <div className="flex align-items-center justify-content-center w-auto min-w-min">
                <Button
                  type="button"
                  label="Cancel"
                  onClick={resetForm}
                  className="w-full text-3xl min-w-min"
                  rounded
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
          style={{ minWidth: "70rem" }}
          className="mt-5  w-full h-full text-3xl font-medium"
        >
          <thead>
            <tr style={{ backgroundColor: "#0C3255", color: "white" }}>
              <th>Descripciones Agregadas</th>
              <th>Operaciones</th>
            </tr>
          </thead>
          <tbody>
            {habi1.map((habilidad) => (
              <tr
                className="text-center"
                key={habilidad.id_habilidades?.toString()}
              >
                <td>{habilidad.descripcion}</td>
                <td>
                  <Button
                    type="button"
                    className="w-30 text-3xl min-w-min"
                    label="✎"
                    style={{
                      background: "#ff9800",
                      borderRadius: "10%",
                      fontSize: "30px",
                      width: "70px",
                      height: "50px",
                      color: "black",
                      justifyContent: "center",
                      marginRight: "5px", // Espacio entre los botones
                    }}
                    onClick={() =>
                      handleEdit(habilidad.id_habilidades?.valueOf())
                    }
                    // Agrega el evento onClick para la operación de editar
                  />
                  <Button
                    type="button"
                    className="w-30 text-3xl min-w-min"
                    label="✘"
                    style={{
                      background: "#ff0000",
                      borderRadius: "10%",
                      fontSize: "30px",
                      width: "70px",
                      height: "50px",
                      color: "black",
                      justifyContent: "center",
                    }}
                    onClick={() =>
                      handleDelete(habilidad.id_habilidades?.valueOf())
                    }
                    // Agrega el evento onClick para la operación de eliminar
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

export default HabilidadesContext;
