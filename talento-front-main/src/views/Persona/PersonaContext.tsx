import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Calendar, CalendarChangeEvent } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import "../../styles/Persona.css";
import ToastMessage from "../../shared/ToastMessage";
import { IMessage } from "../../interfaces/Secondary/IMessage";
import { useFormik } from "formik";
import { IPersona } from "../../interfaces/Primary/IPersona";
import { VistaPersonaService } from "../../services/VistaPersonaService";
import { PersonaService } from "../../services/PersonaService";
import { FileUpload, FileUploadHandlerEvent } from "primereact/fileupload";
import { fileConverter } from "../../services/functions/fileConverter";
import { InputTextarea } from "primereact/inputtextarea";
import { Fieldset } from "primereact/fieldset";
import cardHeader from "../../shared/CardHeader";
import swal from "sweetalert";
import {string} from "yup";

const apiViewService = new VistaPersonaService();
const apiService = new PersonaService();

const Persona = () => {
  const userData = sessionStorage.getItem("user");
  const userObj = JSON.parse(userData || "{}");
  const idPersona = userObj.id;
  const rol = userObj.rol;
  
  const [items, setItems] = useState<IPersona[]>([]);
  const [message, setMessage] = useState<IMessage | null>(null);
  const [selectedItem, setSelectedItem] = useState<IPersona | null>(null);
  const fileUploadRef = useRef<FileUpload>(null);
  const estadoCivil = [
    "SOLTERO/A",
    "CASADO/A",
    "DIVORCIADO/A",
    "VIUDO/A",
    "UNION LIBRE",
  ];
  const sexos = ["HOMBRE", "MUJER"];
  const generos = ["MASCULINO", "FEMENINO", "OTRO"];
  const sangres = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-", "NO SABE"];
  const etnias = [
    "AFROECUATORIANO",
    "INDÍGENA",
    "MONTUBIO",
    "MESTIZO",
    "BLANCO",
    "MULATO",
    "OTRO",
  ];
  const [edadCalculada, setEdadCalculada] = useState(0);

  const perService = new PersonaService();
  const [per1, setPer1] = useState<IPersona[]>([]);
  const [imageUrl, setImageUrl] = useState<string | undefined>("");

  const calcularEdad = (fechaNacimiento: Date) => {
    const diadeHoy = new Date();
    const fechaNacimientoObj = new Date(fechaNacimiento);
    const edad = diadeHoy.getFullYear() - fechaNacimientoObj.getFullYear();
    if (
      diadeHoy.getMonth() < fechaNacimientoObj.getMonth() ||
      (diadeHoy.getMonth() === fechaNacimientoObj.getMonth() &&
        diadeHoy.getDate() < fechaNacimientoObj.getDate())
    ) {
      return edad - 1;
    }
    return edad;
  };

  const handleDateChange = (e: CalendarChangeEvent) => {
    const selectedDate = e.value as Date;
    formik.setFieldValue("fecha_nacimiento", selectedDate);
    const edad = calcularEdad(selectedDate);
    setEdadCalculada(edad);
    formik.setFieldValue("edad", edad);
  };

  const imageUploader = async (event: FileUploadHandlerEvent) => {
    fileConverter(event.files[0])
      .then((data) => {
        formik.setFieldValue("foto", data);
        setMessage({ severity: "info", detail: "Foto Cargada" });
        // Crear una URL temporal para el archivo
        const objectUrl = URL.createObjectURL(event.files[0]);
        // Actualizar el estado con la nueva URL
        setImageUrl(objectUrl);
      })
      .catch((error) => {
        setMessage({
          severity: "error",
          summary: "Error",
          detail: error.message,
        });
      });

    if (fileUploadRef.current) {
      // clean the file uploaded
      fileUploadRef.current.clear();
    }
  };
  const customBytesUploader = async (event: FileUploadHandlerEvent) => {
    fileConverter(event.files[0])
      .then((data) => {
        formik.setFieldValue("cv_socioempleo", data);
        setMessage({ severity: "info", detail: "Archivo Cargado" });
      })
      .catch((error) => {
        setMessage({
          severity: "error",
          summary: "Error",
          detail: error.message,
        });
      });

    if (fileUploadRef.current) {
      // clean the file uploaded
      fileUploadRef.current.clear();
    }
  };

  const customBytesUploaderMecanizado = async (
    event: FileUploadHandlerEvent
  ) => {
    fileConverter(event.files[0])
      .then((data) => {
        formik.setFieldValue("mecanizado_iess", data);
        setMessage({ severity: "info", detail: "Archivo Cargado" });
      })
      .catch((error) => {
        setMessage({
          severity: "error",
          summary: "Error",
          detail: error.message,
        });
      });

    if (fileUploadRef.current) {
      // clean the file uploaded
      fileUploadRef.current.clear();
    }
  };

  const customBytesUploaderPersona = async (event: FileUploadHandlerEvent) => {
    fileConverter(event.files[0])
      .then((data) => {
        formik.setFieldValue("documentos_personales", data);
        setMessage({ severity: "info", detail: "Archivo Cargado" });
      })
      .catch((error) => {
        setMessage({
          severity: "error",
          summary: "Error",
          detail: error.message,
        });
      });

    if (fileUploadRef.current) {
      // clean the file uploaded
      fileUploadRef.current.clear();
    }
  };


  const decodeBase64 = (base64Data: string, tipo: string, cedula:string) => {
    try {
      const base64WithoutHeader = base64Data.replace(/^data:.*,/, "");
      const decodedData = atob(base64WithoutHeader);
      const byteCharacters = new Uint8Array(decodedData.length);
      for (let i = 0; i < decodedData.length; i++) {
        byteCharacters[i] = decodedData.charCodeAt(i);
      }
      const byteArray = new Blob([byteCharacters], { type: "application/pdf" });
      const fileUrl = URL.createObjectURL(byteArray);
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = cedula+"_"+tipo+".pdf";
      link.click();
      swal({
        title: "Evidencia",
        text: "Descargando pdf....",
        icon: "success",
        timer: 1000,
      });

      URL.revokeObjectURL(fileUrl);
    } catch (error) {
      swal("Eliminado", "El registro ha sido eliminado correctamente", "error");
    }
  };


  const formik = useFormik<IPersona>({
    initialValues: {
      cedula: "",
      apellido_paterno: "",
      apellido_materno: "",
      primer_nombre: "",
      segundo_nombre: "",
      fecha_nacimiento: new Date(),
      pais_natal: "",
      genero: "",
      sexo: "",
      tipo_sangre: "",
      estado_civil: "",
      etnia: "",
      idioma_raiz: "",
      idioma_secundario: "",
      foto: "",
      cv_socioempleo: null,
      descripcion_perfil: "",
      mecanizado_iess: "",
      documentos_personales: "",
      pais_residencia: "",
      provincia_residencia: "",
      canton_residencia: "",
      parroquia_residencia: "",
      calles: "",
      numero_casa: "",
      sector: "",
      referencia: "",
      celular: "",
      telefono: "",
      correo: "",
      correo_institucional: "",
      discapacidad: "",
      tipo_discapacidad: "",
      porcentaje_discapacidad: "",
      carnet_conadis: "",
      foto_carnet: null,
    },
    onSubmit: (values) => {
      handleSubmit(values);
      formik.resetForm();
    },
    validate: (values) => {
      let errors: any = {};
      if (!values.cedula) {
        errors.cedula = "Cedula es requerida";
      }
      if (!values.apellido_paterno) {
        errors.apellido_paterno = "Apellido Paterno es requerido";
      }
      if (!values.apellido_materno) {
        errors.apellido_materno = "Apellido Materno es requerido";
      }
      if (!values.primer_nombre) {
        errors.primer_nombre = "Primer Nombre es requerido";
      }
      if (!values.segundo_nombre) {
        errors.segundo_nombre = "Segundo Nombre es requerido";
      }
      if (!values.fecha_nacimiento) {
        errors.fecha_nacimiento = "Fecha de Nacimiento es requerida";
      }
      if (!values.pais_natal) {
        errors.pais_natal = "Pais Natal es requerido";
      }
      if (!values.estado_civil) {
        errors.estado_civil = "Estado Civil es requerido";
      }
      if (!values.sexo) {
        errors.sexo = "Sexo es requerido";
      }
      if (!values.genero) {
        errors.genero = "Genero es requerido";
      }
      if (!values.tipo_sangre) {
        errors.tipo_sangre = "Tipo de Sangre es requerido";
      }
      if (!values.etnia) {
        errors.etnia = "Etnia es requerido";
      }
      if (!values.idioma_raiz) {
        errors.idioma_raiz = "Idioma Raiz es requerido";
      }
      if (!values.idioma_secundario) {
        errors.idioma_secundario = "Idioma Secundario es requerido";
      }
      if (!values.pais_residencia) {
        errors.pais_residencia = "Pais de Residencia es requerido";
      }
      if (!values.provincia_residencia) {
        errors.provincia_residencia = "Provincia de Residencia es requerido";
      }
      if (!values.canton_residencia) {
        errors.canton_residencia = "Canton de Residencia es requerido";
      }
      if (!values.parroquia_residencia) {
        errors.parroquia_residencia = "Parroquia de Residencia es requerido";
      }
      if (!values.calles) {
        errors.calles = "Calles es requerido";
      }
      if (!values.numero_casa) {
        errors.numero_casa = "Numero de Casa es requerido";
      }
      if (!values.sector) {
        errors.sector = "Sector es requerido";
      }
      if (!values.referencia) {
        errors.referencia = "Referencia es requerido";
      }
      if (!values.celular) {
        errors.celular = "Celular es requerido";
      }
      if (!values.telefono) {
        errors.telefono = "Telefono es requerido";
      }
      if (!values.correo) {
        errors.correo = "Correo es requerido";
      }
      if (!values.correo_institucional) {
        errors.correo_institucional = "Correo Institucional es requerido";
      }
      if (!values.discapacidad) {
        errors.discapacidad = "Discapacidad es requerida";
      }
      if (!values.descripcion_perfil) {
        errors.descripcion_perfil = "La descripcion es requerida";
      }
      if (!values.cv_socioempleo) {
        errors.cv_socioempleo = "El Curriculum Vitae es requerido";
      }
      return errors;
    },
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    if (rol === 1) {
      // Si el rol es 1, traer todos los datos
      apiService.getAll().then((response) => {
        setItems(response);
      }).catch((error) => {
        setMessage({
          severity: "error",
          summary: "Error",
          detail: error.message,
        });
      });
    } else if (rol === 3) {
      // Si el rol es 3, traer datos específicos
      apiService.getAllByPersona(idPersona).then((response) => {
        setItems(response);
      }).catch((error) => {
        setMessage({
          severity: "error",
          summary: "Error",
          detail: error.message,
        });
      });
    } else {
      console.error("Rol no reconocido");
    }
  };


  useEffect(() => {
    if (formik.values.cedula.length === 10) {
      apiViewService
        .getByCedula(formik.values.cedula)
        .then((response) => {
          const persona = response[0] as IPersona;
          formik.setFieldValue("apellido_paterno", persona.apellido_paterno);
          formik.setFieldValue("apellido_materno", persona.apellido_materno);
          formik.setFieldValue("primer_nombre", persona.primer_nombre);
          formik.setFieldValue("segundo_nombre", persona.segundo_nombre);
          formik.setFieldValue("estado_civil", persona.estado_civil);
          const fechaNacimientoString = persona.fecha_nacimiento;

          if (fechaNacimientoString) {
            const fechaNacimientoDate = new Date(fechaNacimientoString);
            if (!isNaN(fechaNacimientoDate.getTime())) {
              fechaNacimientoDate.setDate(fechaNacimientoDate.getDate()+1);
              formik.setFieldValue("fecha_nacimiento", fechaNacimientoDate);
            } else {
              swal("Error", "Fecha de Nacimiento no valida", "error");
            }
          } else {
            swal("Eliminado", "Fecha de Nacimiento nula", "error");
          }
          if (persona.pais_natal === "CUENCA") {
            formik.setFieldValue("pais_natal", "ECUADOR");
          } else {
            formik.setFieldValue("pais_natal", persona.pais_natal);
          }
          if (persona.sexo === "H") {
            formik.setFieldValue("sexo", "HOMBRE");
          } else if (persona.sexo === "M") {
            formik.setFieldValue("sexo", "MUJER");
          }
          formik.setFieldValue("genero", persona.genero);
          formik.setFieldValue("tipo_sangre", persona.tipo_sangre);
          formik.setFieldValue("etnia", persona.etnia);
          formik.setFieldValue("idioma_raiz", persona.idioma_raiz);
          formik.setFieldValue("idioma_secundario", persona.idioma_secundario);

          if (persona.pais_residencia == null) {
            formik.setFieldValue("pais_residencia", "ECUADOR");
            formik.setFieldValue("provincia_residencia", "AZUAY");
            formik.setFieldValue("canton_residencia", "CUENCA");
          } else {
            formik.setFieldValue("pais_residencia", persona.pais_residencia);
            formik.setFieldValue(
              "provincia_residencia",
              persona.provincia_residencia
            );
            formik.setFieldValue(
              "canton_residencia",
              persona.canton_residencia
            );
          }
          formik.setFieldValue("calles", persona.calles);
          if (persona.numero_casa === "0") {
            formik.setFieldValue("numero_casa", "S/N");
          } else {
            formik.setFieldValue("numero_casa", persona.numero_casa);
          }
          formik.setFieldValue("sector", persona.sector);
          formik.setFieldValue("referencia", persona.referencia);

          formik.setFieldValue("celular", persona.celular);
          if (persona.telefono === "") {
            formik.setFieldValue("telefono", "S/N");
          } else {
            formik.setFieldValue("telefono", persona.telefono);
          }
          formik.setFieldValue("correo", persona.correo);
          formik.setFieldValue(
            "correo_institucional",
            persona.correo_institucional
          );
          const discapacidadString = persona.discapacidad;
          if (discapacidadString === "f") {
            formik.setFieldValue("discapacidad", "SIN DISCAPACIDAD");
            formik.setFieldValue("tipo_discapacidad", "NINGUNA");
            formik.setFieldValue("porcentaje_discapacidad", "0%");
            formik.setFieldValue("carnet_conadis", "NO TIENE");
          } else if (discapacidadString === "t") {
            formik.setFieldValue("discapacidad", "CON DISCAPACIDAD");
            formik.setFieldValue(
              "tipo_discapacidad",
              persona.tipo_discapacidad
            );
            formik.setFieldValue(
              "porcentaje_discapacidad",
              persona.porcentaje_discapacidad
            );
            formik.setFieldValue("carnet_conadis", persona.carnet_conadis);
          }
          if (persona.discapacidad === "f") {
            formik.setFieldValue("numero_casa", "S/N");
          }
          setMessage({ severity: "success", detail: "Registro actualizado" });
        })
        .catch((error) => {
          setMessage({
            severity: "error",
            summary: "Error",
            detail: error.message,
          });
        });
    }
  }, [formik.values.cedula]);
  const handleSubmit = async (data: IPersona) => {
    if (selectedItem) {
      await apiService
        .update(selectedItem.id_persona!, data)
        .then((response) => {
          setMessage({ severity: "success", detail: "Registro actualizado" });
        });
      setSelectedItem(null);
    } else {
      await apiService
        .save(data)
        .then((response) => {
          setMessage({ severity: "success", detail: "Registro creado" });
        })
        .catch((error) => {
          setMessage({
            severity: "error",
            summary: "Error",
            detail: error.message,
          });
        });
    }
    fetchItems();
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
          perService
            .delete(id)
            .then(() => {
              setPer1(per1.filter((per) => per.id_persona !== id));
              swal(
                "Eliminado",
                "El registro ha sido eliminado correctamente",
                "error"
              );
            })
            .catch((error) => {
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

  return (
    <Fieldset className="fgrid col-fixed ">
      <Card
        header={cardHeader}
        className="border-solid border-blue-800 border-3 flex-1 w-full h-full flex-wrap"
      >
        <ToastMessage message={message} />
        <table
            style={{ minWidth: "40rem" }}
            className="mt-4  w-full h-full text-3xl font-large"
        >
          <thead>
          <tr style={{ backgroundColor: "#0C3255", color: "white" }}>
            <th>Cedula</th>
            <th>Docente</th>
            <th>Sexo</th>
            <th>Celular</th>
            <th>Correo</th>
            <th>Discapacidad</th>
            <th>Operaciones</th>
            <th>Socio Empleo</th>
            <th>Mecanizado IESS</th>
            <th>Doc. Personales</th>
          </tr>
          </thead>
          <tbody>
          {items.map((per) => (
              <tr className="text-center" key={per.id_persona?.toString()}>
                <td>{per.cedula}</td>
                <td>{per.apellido_paterno + " " + per.primer_nombre}</td>
                <td>{per.sexo}</td>
                <td>{per.celular}</td>
                <td>{per.correo}</td>
                <td>{per.discapacidad}</td>
                <td>
                  <Button
                      type="button"
                      className=""
                      label="✎"
                      style={{
                        background: "#ff9800",
                        borderRadius: "10%",
                        fontSize: "25px",
                        width: "40px",
                        color: "black",
                        justifyContent: "center",
                      }}
                      onClick={() => {

                        formik.setValues(per);
                      }}
                  />
                  <Button
                      type="button"
                      className=""
                      label="✘"
                      style={{
                        background: "#ff0000",
                        borderRadius: "10%",
                        fontSize: "30px",
                        width: "40px",
                        color: "black",
                        justifyContent: "center",
                      }}
                      onClick={() => handleDelete(per.id_persona?.valueOf())}
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
                          onClick={() => apiViewService.getByCedulaSocio(per.id_persona)
                              .then((response) => {
                                if(response && response.trim() !== '') {
                                  console.log("resultado: "+response.toString());
                                  decodeBase64(response,'cv_socioempleado',per.cedula);
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
                          onClick={() => apiViewService.getByMecanizado(per.id_persona)
                              .then((response) => {
                                if(response && response.trim() !== '') {
                                  console.log("resultado: "+response.toString());
                                  decodeBase64(response,'mecanizado',per.cedula);
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
                          onClick={() => apiViewService.getByDocumentosPersonales(per.id_persona)
                              .then((response) => {
                                if(response && response.trim() !== '') {
                                  console.log("resultado: "+response.toString());
                                  decodeBase64(response,'documentos',per.cedula);
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
        <form className="formgrid grid" onSubmit={formik.handleSubmit}>
          <Divider align="center">
            <h1 className="text-7xl font-smibold lg:md-2  w-full h-full max-w-full max-h-full min-w-min">
              Datos Personales
            </h1>
          </Divider>
          <Divider align="left">
            <div className="inline-flex align-items-center">
              <i className="pi pi-book mr-2"></i>
              <b>Formulario </b>
            </div>
          </Divider>

          <div className="field col-4">
            <label className="font-medium" htmlFor="cedula">
              Cedula
            </label>
            <InputText
              id="cedula"
              className="p-inputtext-sm w-full text-2xl"
              name="cedula"
              value={formik.values.cedula}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <small className="p-error">
              {formik.touched.cedula && formik.errors.cedula}
            </small>
          </div>
          <div className="field col-4">
            <label className="font-medium" htmlFor="apellido_paterno">
              Apellido Paterno
            </label>
            <InputText
              id="apellido_paterno"
              className="p-inputtext-sm w-full text-2xl"
              name="apellido_paterno"
              value={formik.values.apellido_paterno}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <small className="p-error">
              {formik.touched.apellido_paterno &&
                formik.errors.apellido_paterno}
            </small>
          </div>
          <div className="field col-4">
            <label className="font-medium" htmlFor="apellido_materno">
              Apellido Materno
            </label>
            <InputText
              id="apellido_materno"
              className="p-inputtext-sm w-full text-2xl"
              name="apellido_materno"
              value={formik.values.apellido_materno}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <small className="p-error">
              {formik.touched.apellido_materno &&
                formik.errors.apellido_materno}
            </small>
          </div>
          <div className="field col-4">
            <label className="font-medium" htmlFor="primer_nombre">
              Primer Nombre
            </label>
            <InputText
              id="primer_nombre"
              className="p-inputtext-sm w-full text-2xl"
              name="primer_nombre"
              value={formik.values.primer_nombre}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <small className="p-error">
              {formik.touched.primer_nombre && formik.errors.primer_nombre}
            </small>
          </div>
          <div className="field col-4">
            <label className="font-medium" htmlFor="segundo_nombre">
              Segundo Nombre
            </label>
            <InputText
              id="segundo_nombre"
              className="p-inputtext-sm w-full text-2xl"
              name="segundo_nombre"
              value={formik.values.segundo_nombre}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <small className="p-error">
              {formik.touched.segundo_nombre && formik.errors.segundo_nombre}
            </small>
          </div>
          <div className="field col-4">
            <label className="font-medium" htmlFor="estado_civil">
              Estado Civil
            </label>
            <Dropdown
              id="estado_civil"
              placeholder="Seleccione"
              className="p-inputtext-lg w-full text-2xl"
              options={estadoCivil}
              name="estado_civil"
              value={formik.values.estado_civil}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <small className="p-error">
              {formik.touched.estado_civil && formik.errors.estado_civil}
            </small>
          </div>
          <div className="field col-4">
            <label className="font-medium" htmlFor="start-date">
              Fecha de Nacimiento
            </label>
            <Calendar
              id="start-date"
              dateFormat="yy-mm-dd"
              name="fecha_inicio"
              className="p-inputtextarea-resizable w-full text-2xl"
              maxDate={new Date()}
              value={formik.values.fecha_nacimiento}
              onChange={handleDateChange}
              onBlur={formik.handleBlur}
            />

            <small className="p-error">
              {formik.touched.fecha_nacimiento &&
                formik.errors.fecha_nacimiento}
            </small>
          </div>
          <div className="field col-4">
            <label className="font-medium" htmlFor="pais_natal">
              Pais Natal
            </label>
            <InputText
              id="pais_natal"
              className="p-inputtext-sm w-full text-2xl"
              name="pais_natal"
              value={formik.values.pais_natal}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <small className="p-error">
              {formik.touched.pais_natal && formik.errors.pais_natal}
            </small>
          </div>
          <div className="field col-4">
            <label className="font-medium" htmlFor="sexo">
              Sexo
            </label>
            <Dropdown
              id="sexo"
              placeholder="Seleccione"
              className="p-inputtext-lg w-full text-2xl"
              options={sexos}
              name="sexo"
              value={formik.values.sexo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <small className="p-error">
              {formik.touched.sexo && formik.errors.sexo}
            </small>
          </div>
          <div className="field col-4">
            <label className="font-medium" htmlFor="genero">
              Genero
            </label>
            <Dropdown
              id="genero"
              placeholder="Seleccione"
              className="p-inputtext-lg w-full text-2xl"
              options={generos}
              name="genero"
              value={formik.values.genero}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <small className="p-error">
              {formik.touched.genero && formik.errors.genero}
            </small>
          </div>
          <div className="field col-4">
            <label className="font-medium" htmlFor="tipo_sangre">
              Tipo de Sangre
            </label>
            <Dropdown
              id="tipo_sangre"
              placeholder="Seleccione"
              className="p-inputtext-lg w-full text-2xl"
              options={sangres}
              name="tipo_sangre"
              value={formik.values.tipo_sangre}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <small className="p-error">
              {formik.touched.tipo_sangre && formik.errors.tipo_sangre}
            </small>
          </div>
          <div className="field col-4">
            <label className="font-medium" htmlFor="etnia">
              Etnia
            </label>
            <Dropdown
              id="etnia"
              placeholder="Seleccione"
              className="p-inputtext-lg w-full text-2xl"
              options={etnias}
              name="etnia"
              value={formik.values.etnia}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <small className="p-error">
              {formik.touched.etnia && formik.errors.etnia}
            </small>
          </div>
          <div className="field col-4">
            <label className="font-medium" htmlFor="idioma_raiz ">
              Idioma Raíz
            </label>
            <InputText
              id="idioma_raiz"
              className="p-inputtext-sm w-full text-2xl"
              name="idioma_raiz"
              value={formik.values.idioma_raiz}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <small className="p-error">
              {formik.touched.idioma_raiz && formik.errors.idioma_raiz}
            </small>
          </div>
          <div className="field col-4">
            <label className="font-medium" htmlFor="idioma_secundario ">
              Idioma Secundario
            </label>
            <InputText
              id="idioma_secundario"
              className="p-inputtext-sm w-full text-2xl"
              name="idioma_secundario"
              value={formik.values.idioma_secundario}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <small className="p-error">
              {formik.touched.idioma_secundario &&
                formik.errors.idioma_secundario}
            </small>
          </div>
          <div className="field col-4">
            <label className="font-medium" htmlFor="descripcion_perfil ">
              Descripcion de Perfil
            </label>
            <InputTextarea
              id="descripcion_perfil"
              className="p-inputtextarea w-full text-2xl"
              name="descripcion_perfil"
              value={formik.values.descripcion_perfil}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <small className="p-error">
              {formik.touched.descripcion_perfil &&
                formik.errors.descripcion_perfil}
            </small>
          </div>

          <div className="field col-1">
            <label className="font-medium"></label>
          </div>

          <div className="field col-4">
            <label className="font-medium"></label>
          </div>

          <Divider align="center">
            <h2 className="text-6xl font-smibold lg:md-2">Dirección</h2>
          </Divider>
          <div className="field col-4">
            <label className="font-medium" htmlFor="pais_residencia">
              Pais
            </label>
            <InputText
              id="pais_residencia"
              className="p-inputtext-sm w-full text-2xl"
              name="pais_residencia"
              value={formik.values.pais_residencia}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <small className="p-error">
              {formik.touched.pais_residencia && formik.errors.pais_residencia}
            </small>
          </div>
          <div className="field col-4">
            <label className="font-medium" htmlFor="provincia_residencia">
              Provincia
            </label>
            <InputText
              id="provincia_residencia"
              className="p-inputtext-sm w-full text-2xl"
              name="provincia_residencia"
              value={formik.values.provincia_residencia}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <small className="p-error">
              {formik.touched.provincia_residencia &&
                formik.errors.provincia_residencia}
            </small>
          </div>
          <div className="field col-4">
            <label className="font-medium" htmlFor="canton_residencia">
              Canton
            </label>
            <InputText
              id="canton_residencia"
              className="p-inputtext-sm w-full text-2xl"
              name="canton_residencia"
              value={formik.values.canton_residencia}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <small className="p-error">
              {formik.touched.canton_residencia &&
                formik.errors.canton_residencia}
            </small>
          </div>
          <div className="field col-4">
            <label className="font-medium" htmlFor="parroquia_residencia">
              Parroquia
            </label>
            <InputText
              id="parroquia_residencia"
              className="p-inputtext-sm w-full text-2xl"
              name="parroquia_residencia"
              value={formik.values.parroquia_residencia}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <small className="p-error">
              {formik.touched.parroquia_residencia &&
                formik.errors.parroquia_residencia}
            </small>
          </div>
          <div className="field col-4">
            <label className="font-medium" htmlFor="calles">
              Calles
            </label>
            <InputText
              id="calles"
              className="p-inputtext-sm w-full text-2xl"
              name="calles"
              value={formik.values.calles}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <small className="p-error">
              {formik.touched.calles && formik.errors.calles}
            </small>
          </div>
          <div className="field col-4">
            <label className="font-medium" htmlFor="numero_casa">
              Numero de Casa
            </label>
            <InputText
              id="numero_casa"
              className="p-inputtext-sm w-full text-2xl"
              name="numero_casa"
              value={formik.values.numero_casa}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <small className="p-error">
              {formik.touched.numero_casa && formik.errors.numero_casa}
            </small>
          </div>
          <div className="field col-4">
            <label className="font-medium" htmlFor="sector">
              Sector
            </label>
            <InputText
              id="sector"
              className="p-inputtext-sm w-full text-2xl"
              name="sector"
              value={formik.values.sector}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <small className="p-error">
              {formik.touched.sector && formik.errors.sector}
            </small>
          </div>
          <div className="field col-4"></div>
          <div className="field col-4">
            <label className="font-medium" htmlFor="referencia">
              Referencia
            </label>
            <InputText
              id="referencia"
              className="p-inputtext-sm w-full text-2xl"
              name="referencia"
              value={formik.values.referencia}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <small className="p-error">
              {formik.touched.referencia && formik.errors.referencia}
            </small>
          </div>
          <div className="field col-4">
            <label className="font-medium"></label>
          </div>

          <Divider align="center">
            <h2 className="text-6xl font-smibold lg:md-2">Contacto</h2>
          </Divider>
          <div className="field col-2"></div>
          <div className="field col-3">
            <label className="font-medium" htmlFor="celular ">
              Numero Celular
            </label>
            <InputText
              id="celular"
              className="p-inputtext-sm w-full text-2xl"
              name="celular"
              value={formik.values.celular}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <small className="p-error">
              {formik.touched.celular && formik.errors.celular}
            </small>
          </div>
          <div className="field col-2"></div>
          <div className="field col-3">
            <label className="font-medium" htmlFor="telefono ">
              Numero Telefónico
            </label>
            <InputText
              id="telefono"
              className="p-inputtext-sm w-full text-2xl"
              name="telefono"
              value={formik.values.telefono}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <small className="p-error">
              {formik.touched.telefono && formik.errors.telefono}
            </small>
          </div>
          <div className="field col-2"></div>
          <div className="field col-2"></div>
          <div className="field col-3">
            <label className="font-medium" htmlFor="correo ">
              Correo Personal
            </label>
            <InputText
              id="correo"
              className="p-inputtext-sm w-full text-2xl"
              name="correo"
              value={formik.values.correo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <small className="p-error">
              {formik.touched.correo && formik.errors.correo}
            </small>
          </div>
          <div className="field col-2"></div>
          <div className="field col-3">
            <label className="font-medium" htmlFor="correo_institucional ">
              Correo Institucional
            </label>
            <InputText
              id="correo_institucional"
              className="p-inputtext-sm w-full text-2xl"
              name="correo_institucional"
              value={formik.values.correo_institucional}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <small className="p-error">
              {formik.touched.correo_institucional &&
                formik.errors.correo_institucional}
            </small>
          </div>
          <div className="field col-2"></div>
          <div className="field col-4">
            <label className="font-medium"></label>
          </div>

          <Divider align="center">
            <h2 className="text-6xl font-smibold lg:md-2">Discapacidad</h2>
          </Divider>
          <div className="field col-2"></div>
          <div className="field col-3">
            <label className="font-medium" htmlFor="discapacidad ">
              Discapacidad
            </label>
            <InputText
              id="discapacidad"
              className="p-inputtext-sm w-full text-2xl"
              name="discapacidad"
              value={formik.values.discapacidad}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <small className="p-error">
              {formik.touched.discapacidad && formik.errors.discapacidad}
            </small>
          </div>
          <div className="field col-2"></div>
          <div className="field col-3">
            <label className="font-medium" htmlFor="tipo_discapacidad ">
              Tipo de Discapacidad
            </label>
            <InputText
              id="tipo_discapacidad"
              className="p-inputtext-sm w-full text-2xl"
              name="tipo_discapacidad"
              value={formik.values.tipo_discapacidad}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <small className="p-error">
              {formik.touched.tipo_discapacidad &&
                formik.errors.tipo_discapacidad}
            </small>
          </div>
          <div className="field col-2"></div>
          <div className="field col-2"></div>
          <div className="field col-3">
            <label className="font-medium" htmlFor="porcentaje_discapacidad ">
              Porcentaje
            </label>
            <InputText
              id="porcentaje_discapacidad"
              className="p-inputtext-sm w-full text-2xl"
              name="porcentaje_discapacidad"
              value={formik.values.porcentaje_discapacidad}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <small className="p-error">
              {formik.touched.porcentaje_discapacidad &&
                formik.errors.porcentaje_discapacidad}
            </small>
          </div>
          <div className="field col-2"></div>
          <div className="field col-3">
            <label className="font-medium" htmlFor="carnet_conadis ">
              Número de Carnet Conadis
            </label>
            <InputText
              id="carnet_conadis"
              className="p-inputtext-sm w-full text-2xl"
              name="carnet_conadis"
              value={formik.values.carnet_conadis}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <small className="p-error">
              {formik.touched.carnet_conadis && formik.errors.carnet_conadis}
            </small>
          </div>

          <Divider align="left">
            <div className="inline-flex align-items-center">
              <i className="pi pi-file-pdf mr-2"></i>
              <b>Anexos</b>
            </div>
          </Divider>
          <div className="field col-4 flex flex-column">
            <label className="font-medium" htmlFor="cv_socioempleo">
              Curriculum Vitae SocioEmpleo
            </label>
            <FileUpload
              id="cv_socioempleo"
              ref={fileUploadRef}
              mode="advanced"
              name="file"
              accept=".pdf"
              customUpload
              uploadHandler={customBytesUploader}
              chooseLabel="Seleccionar"
              uploadLabel="Subir"
              cancelLabel="Cancelar"
              emptyTemplate={
                <p className="m-0">
                  {formik.values.cv_socioempleo
                    ? "Archivo Cargado Correctamente"
                    : "Seleccione un Documento"}
                </p>
              }
            />
            <small className="p-error w-full">
              {formik.touched.cv_socioempleo && formik.errors.cv_socioempleo}
            </small>
          </div>
          <div className="field col-4 flex flex-column">
            <label className="font-medium" htmlFor="mecanizado">
              Mecanizado del IESS
            </label>
            <FileUpload
              id="mecanizado"
              ref={fileUploadRef}
              mode="advanced"
              name="file"
              accept=".pdf"
              customUpload
              uploadHandler={customBytesUploaderMecanizado}
              chooseLabel="Seleccionar"
              uploadLabel="Subir"
              cancelLabel="Cancelar"
              emptyTemplate={
                <p className="m-0">
                  {formik.values.mecanizado_iess
                    ? "Archivo Cargado Correctamente"
                    : "Seleccione un Documento"}
                </p>
              }
            />
            <small className="p-error w-full">
              {formik.touched.mecanizado_iess && formik.errors.mecanizado_iess}
            </small>
          </div>
          <div className="field col-4 flex flex-column">
            <label className="font-medium" htmlFor="documentos">
              Documentos Personales:
            </label>
            <FileUpload
              id="documentos"
              ref={fileUploadRef}
              mode="advanced"
              name="file"
              accept=".pdf"
              customUpload
              uploadHandler={customBytesUploaderPersona}
              chooseLabel="Seleccionar"
              uploadLabel="Subir"
              cancelLabel="Cancelar"
              emptyTemplate={
                <p className="m-0">
                  {formik.values.documentos_personales
                    ? "Archivo Cargado Correctamente"
                    : "Seleccione un Documento que contenga: cédula, certificado de votación, certificado de no tener impedimento y declaración patrimonial jurada."}
                </p>
              }
            />

            <small className="p-error w-full">
              {formik.touched.documentos_personales &&
                formik.errors.documentos_personales}
            </small>
          </div>
          <div
            className="field col- flex flex-column"
            style={{ marginLeft: "43%" }}
          >
            <label className="font-medium" htmlFor="foto"  >
              Foto Personal
            </label>
            <img src={imageUrl} height={200} width={200} />
            <FileUpload
              id="foto"
              ref={fileUploadRef}
              mode="basic"
              name="file"
              accept="image/*"
              auto
              customUpload
              chooseLabel="Seleccionar"
              uploadHandler={imageUploader}
            />
          </div>
          <div className="flex flex-row  w-full h-full justify-content-center  flex-grow-1  row-gap-5 gap-5 flex-wrap mt-5">
            <div className="flex align-items-center justify-content-center w-auto min-w-min">
              <Button
                type="submit"
                label={selectedItem ? "Actualizar" : "Guardar"}
                severity={selectedItem ? "warning" : "success"}
                rounded
              />
            </div>
            <div className="flex align-items-center justify-content-center w-auto min-w-min">
              <Button
                type="button"
                label="Cancelar"
                severity="secondary"
                rounded
                onClick={() => {
                  formik.resetForm();
                  setSelectedItem(null);
                }}
              />
            </div>
          </div>
        </form>

      </Card>
    </Fieldset>
  );
};
export default Persona;
