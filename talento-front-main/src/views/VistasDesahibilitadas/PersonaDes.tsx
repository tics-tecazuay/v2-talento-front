import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import "../../styles/Contrato.css";
import { Dropdown } from "primereact/dropdown";
import { Fieldset } from "primereact/fieldset";
import { Card } from "primereact/card";
import cardHeader from "../../shared/CardHeader";
import { Divider } from "primereact/divider";
import { IPersona } from "../../interfaces/Primary/IPersona";
import { PersonaService } from "../../services/PersonaService";
import swal from "sweetalert";
import { useParams } from "react-router-dom";
import { ReportBar } from "../../shared/ReportBar";
import {
  IExcelReportParams,
  IHeaderItem,
} from "../../interfaces/Secondary/IExcelReportParams";

interface Params {
  codigoPersona: string;
}

function PersonaContextDes() {
  const [items, setItems] = useState<IPersona[]>([]);
  const { codigoPersona } = useParams<Params>();
  const codigoPersonaNumber = Number(codigoPersona);
  const [excelReportData, setExcelReportData] =
    useState<IExcelReportParams | null>(null);

  const [formDisabled, setFormDisabled] = useState(false);

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

  const [formData, setFormData] = useState<IPersona>({
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
    mecanizado_iess: null,
    documentos_personales: null,
    descripcion_perfil: "",
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
  });

  const apiService = new PersonaService();

  useEffect(() => {
    apiService
      .getAllByPersona(codigoPersonaNumber)
      .then((data) => {
        if (data.length > 0) {
          const contratoData = data[0];
          setFormDisabled(true);
          loadExcelReportData(data);
          setFormData({
            ...formData,
            cedula: contratoData.cedula,
            apellido_paterno: contratoData.apellido_paterno,
            apellido_materno: contratoData.apellido_materno,
            primer_nombre: contratoData.primer_nombre,
            segundo_nombre: contratoData.segundo_nombre,
            fecha_nacimiento: contratoData.fecha_nacimiento,
            pais_natal: contratoData.pais_natal,
            genero: contratoData.genero,
            sexo: contratoData.sexo,
            tipo_sangre: contratoData.tipo_sangre,
            estado_civil: contratoData.estado_civil,
            etnia: contratoData.etnia,
            idioma_raiz: contratoData.idioma_raiz,
            idioma_secundario: contratoData.idioma_secundario,
            foto: contratoData.foto,
            cv_socioempleo: contratoData.cv_socioempleo,
            descripcion_perfil: contratoData.descripcion_perfil,
            pais_residencia: contratoData.pais_residencia,
            provincia_residencia: contratoData.provincia_residencia,
            canton_residencia: contratoData.canton_residencia,
            parroquia_residencia: contratoData.parroquia_residencia,
            calles: contratoData.calles,
            numero_casa: contratoData.numero_casa,
            sector: contratoData.sector,
            referencia: contratoData.referencia,
            celular: contratoData.celular,
            telefono: contratoData.telefono,
            correo: contratoData.correo,
            correo_institucional: contratoData.correo_institucional,
            discapacidad: contratoData.discapacidad,
            tipo_discapacidad: contratoData.tipo_discapacidad,
            porcentaje_discapacidad: contratoData.porcentaje_discapacidad,
            carnet_conadis: contratoData.carnet_conadis,
          });
          setItems(data);
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
      link.download = "CurriculumVitae.pdf";
      link.click();
      swal({
        title: "Curriculum Vitae",
        text: "Descargando pdf....",
        icon: "success",
        timer: 1000,
      });
      link.remove();
    } catch (error) {
      console.error("Error al decodificar la cadena base64:", error);
    }
  };

  const decodeBase64Mecanizado = (base64Data: string) => {
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
      link.download = "MecanizadoIESS.pdf";
      link.click();
      swal({
        title: "Mecanizado IESS",
        text: "Descargando pdf....",
        icon: "success",
        timer: 1000,
      });
      link.remove();
    } catch (error) {
      console.error("Error al decodificar la cadena base64:", error);
    }
  };

  function loadExcelReportData(data: IPersona[]) {
    const reportName = "Persona";
    const rowData = data.map((item) => ({
      cedula: item.cedula,
      nombres: item.primer_nombre + " " + item.segundo_nombre,
      apellidos: item.apellido_paterno + " " + item.apellido_materno,
      correo_institucional: item.correo_institucional,
      correo: item.correo,
      celular: item.celular,
      telefono: item.telefono,
      fecha_nacimiento: new Date(item.fecha_nacimiento!).toLocaleDateString(
        "es-ES",
        {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }
      ),
      pais_natal: item.pais_natal,
      genero: item.genero,
      sexo: item.sexo,
      tipo_sangre: item.tipo_sangre,
      estado_civil: item.estado_civil,
      etnia: item.etnia,
      idioma_raiz: item.idioma_raiz,
      idioma_secundario: item.idioma_secundario,
      pais_residencia: item.pais_residencia,
      provincia_residencia: item.provincia_residencia,
      canton_residencia: item.canton_residencia,
      parroquia_residencia: item.parroquia_residencia,
      calles: item.calles,
      numero_casa: item.numero_casa,
      sector: item.sector,
      referencia: item.referencia,
    }));
    const headerItems: IHeaderItem[] = [
      { header: "CEDULA" },
      { header: "NOMBRES" },
      { header: "APELLIDOS" },
      { header: "CORREO INSTITUCIONAL" },
      { header: "CORREO PERSONAL" },
      { header: "CELULAR" },
      { header: "TELEFONO" },
      { header: "FECHA DE NACIMIENTO" },
      { header: "EDAD" },
      { header: "PAIS NATAL" },
      { header: "GENERO" },
      { header: "SEXO" },
      { header: "TIPO DE SANGRE" },
      { header: "ESTADO CIVIL" },
      { header: "ETNIA" },
      { header: "IDIOMA RAIZ" },
      { header: "IDIOMA SECUNDARIO" },
      { header: "PAIS DE RESIDENCIA" },
      { header: "PROVINCIA DE RESIDENCIA" },
      { header: "CANTON DE RESIDENCIA" },
      { header: "PARROQUIA DE RESIDENCIA" },
      { header: "CALLES" },
      { header: "Nº DE CASA" },
      { header: "SECTOR" },
      { header: "REFERENCIA" },
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
        <form className="formgrid grid">
          <Divider align="center">
            <h1 className="text-7xl font-smibold lg:md-2  w-full h-full max-w-full max-h-full min-w-min">
              Datos Personales
            </h1>
          </Divider>

          <div className="field col-4">
            <label className="font-medium" htmlFor="cedula">
              Cedula
            </label>
            <InputText
              id="cedula"
              className="p-inputtext-sm w-full text-2xl"
              name="cedula"
              disabled={formDisabled}
              value={formData.cedula}
            />
          </div>
          <div className="field col-4">
            <label className="font-medium" htmlFor="apellido_paterno">
              Apellido Paterno
            </label>
            <InputText
              id="apellido_paterno"
              className="p-inputtext-sm w-full text-2xl"
              name="apellido_paterno"
              disabled={formDisabled}
              value={formData.apellido_paterno}
            />
          </div>
          <div className="field col-4">
            <label className="font-medium" htmlFor="apellido_materno">
              Apellido Materno
            </label>
            <InputText
              id="apellido_materno"
              className="p-inputtext-sm w-full text-2xl"
              name="apellido_materno"
              value={formData.apellido_materno}
              disabled={formDisabled}
            />
          </div>
          <div className="field col-4">
            <label className="font-medium" htmlFor="primer_nombre">
              Primer Nombre
            </label>
            <InputText
              id="primer_nombre"
              className="p-inputtext-sm w-full text-2xl"
              name="primer_nombre"
              disabled={formDisabled}
              value={formData.primer_nombre}
            />
          </div>
          <div className="field col-4">
            <label className="font-medium" htmlFor="segundo_nombre">
              Segundo Nombre
            </label>
            <InputText
              id="segundo_nombre"
              className="p-inputtext-sm w-full text-2xl"
              name="segundo_nombre"
              disabled={formDisabled}
              value={formData.segundo_nombre}
            />
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
              disabled={formDisabled}
              name="estado_civil"
              value={formData.estado_civil}
            />
          </div>
          <div className="field col-4">
            <label className="font-medium" htmlFor="fecha_nacimiento">
              Fecha de Nacimiento
            </label>
            <Calendar
              id="fecha_nacimiento"
              dateFormat="yy-mm-dd"
              name="fecha_nacimiento"
              disabled={formDisabled}
              className="p-inputtextarea-resizable w-full text-2xl"
              value={
                formData.fecha_nacimiento
                  ? new Date(formData.fecha_nacimiento)
                  : null
              }
            />
          </div>

          <div className="field col-4">
            <label className="font-medium" htmlFor="pais_natal">
              Pais Natal
            </label>
            <InputText
              id="pais_natal"
              className="p-inputtext-sm w-full text-2xl"
              name="pais_natal"
              disabled={formDisabled}
              value={formData.pais_natal}
            />
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
              disabled={formDisabled}
              name="sexo"
              value={formData.sexo}
            />
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
              disabled={formDisabled}
              name="genero"
              value={formData.genero}
            />
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
              disabled={formDisabled}
              name="tipo_sangre"
              value={formData.tipo_sangre}
            />
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
              disabled={formDisabled}
              value={formData.etnia}
            />
          </div>
          <div className="field col-4">
            <label className="font-medium" htmlFor="idioma_raiz ">
              Idioma Raíz
            </label>
            <InputText
              id="idioma_raiz"
              className="p-inputtext-sm w-full text-2xl"
              name="idioma_raiz"
              disabled={formDisabled}
              value={formData.idioma_raiz}
            />
          </div>
          <div className="field col-4">
            <label className="font-medium" htmlFor="idioma_secundario ">
              Idioma Secundario
            </label>
            <InputText
              id="idioma_secundario"
              disabled={formDisabled}
              className="p-inputtext-sm w-full text-2xl"
              name="idioma_secundario"
              value={formData.idioma_secundario}
            />
          </div>
          <div className="field col-4">
            <label className="font-medium" htmlFor="descripcion_perfil ">
              Descripcion de Perfil
            </label>
            <InputTextarea
              id="descripcion_perfil"
              disabled={formDisabled}
              className="p-inputtextarea w-full text-2xl"
              name="descripcion_perfil"
              value={formData.descripcion_perfil}
            />
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
              disabled={formDisabled}
              className="p-inputtext-sm w-full text-2xl"
              name="pais_residencia"
              value={formData.pais_residencia}
            />
          </div>
          <div className="field col-4">
            <label className="font-medium" htmlFor="provincia_residencia">
              Provincia
            </label>
            <InputText
              id="provincia_residencia"
              className="p-inputtext-sm w-full text-2xl"
              name="provincia_residencia"
              disabled={formDisabled}
              value={formData.provincia_residencia}
            />
          </div>
          <div className="field col-4">
            <label className="font-medium" htmlFor="canton_residencia">
              Canton
            </label>
            <InputText
              id="canton_residencia"
              className="p-inputtext-sm w-full text-2xl"
              name="canton_residencia"
              disabled={formDisabled}
              value={formData.canton_residencia}
            />
          </div>
          <div className="field col-4">
            <label className="font-medium" htmlFor="parroquia_residencia">
              Parroquia
            </label>
            <InputText
              id="parroquia_residencia"
              className="p-inputtext-sm w-full text-2xl"
              disabled={formDisabled}
              name="parroquia_residencia"
              value={formData.parroquia_residencia}
            />
          </div>
          <div className="field col-4">
            <label className="font-medium" htmlFor="calles">
              Calles
            </label>
            <InputText
              id="calles"
              className="p-inputtext-sm w-full text-2xl"
              name="calles"
              disabled={formDisabled}
              value={formData.calles}
            />
          </div>
          <div className="field col-4">
            <label className="font-medium" htmlFor="numero_casa">
              Numero de Casa
            </label>
            <InputText
              id="numero_casa"
              className="p-inputtext-sm w-full text-2xl"
              name="numero_casa"
              disabled={formDisabled}
              value={formData.numero_casa}
            />
          </div>
          <div className="field col-4">
            <label className="font-medium" htmlFor="sector">
              Sector
            </label>
            <InputText
              id="sector"
              className="p-inputtext-sm w-full text-2xl"
              name="sector"
              disabled={formDisabled}
              value={formData.sector}
            />
          </div>
          <div className="field col-4"></div>
          <div className="field col-4">
            <label className="font-medium" htmlFor="referencia">
              Referencia
            </label>
            <InputText
              id="referencia"
              disabled={formDisabled}
              className="p-inputtext-sm w-full text-2xl"
              name="referencia"
              value={formData.referencia}
            />
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
              disabled={formDisabled}
              value={formData.celular}
            />
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
              value={formData.telefono}
              disabled={formDisabled}
            />
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
              value={formData.correo}
              disabled={formDisabled}
            />
          </div>
          <div className="field col-2"></div>
          <div className="field col-3">
            <label className="font-medium" htmlFor="correo_institucional ">
              Correo Institucional
            </label>
            <InputText
              id="correo_institucional"
              disabled={formDisabled}
              className="p-inputtext-sm w-full text-2xl"
              name="correo_institucional"
              value={formData.correo_institucional}
            />
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
              disabled={formDisabled}
              value={formData.discapacidad}
            />
          </div>
          <div className="field col-2"></div>
          <div className="field col-3">
            <label className="font-medium" htmlFor="tipo_discapacidad ">
              Tipo de Discapacidad
            </label>
            <InputText
              id="tipo_discapacidad"
              disabled={formDisabled}
              className="p-inputtext-sm w-full text-2xl"
              name="tipo_discapacidad"
              value={formData.tipo_discapacidad}
            />
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
              disabled={formDisabled}
              value={formData.porcentaje_discapacidad}
            />
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
              disabled={formDisabled}
              value={formData.carnet_conadis}
            />
          </div>
          <div className="field col-2"></div>
          <div className="field col-4">
            <label className="font-medium"></label>
          </div>
        </form>
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
              <th>Cedula</th>
              <th>Docente</th>
              <th>Sexo</th>
              <th>Celular</th>
              <th>Correo</th>
              <th>Discapacidad</th>
              <th>Curriculum Vitae</th>
              <th>Mecanizado IESS</th>
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
                  {per.cv_socioempleo ? (
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
                      onClick={() => decodeBase64(per.cv_socioempleo!)}
                    />
                  ) : (
                    <span>Sin evidencia</span>
                  )}
                </td>
                <td>
                  {per.mecanizado_iess ? (
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
                      onClick={() =>
                        decodeBase64Mecanizado(per.mecanizado_iess!)
                      }
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
export default PersonaContextDes;
