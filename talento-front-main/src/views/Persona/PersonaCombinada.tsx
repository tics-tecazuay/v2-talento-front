import React, { useEffect, useState } from "react";
import { FichaCombinada } from "../../interfaces/Primary/IFichaCombinada";
import { PersonaService } from "../../services/PersonaService";
import {
  PDFDownloadLink,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { FaPhone } from "react-icons/fa";
import banner from "../ResumenDocente2/recursos/LOGO RECTANGULAR_SIN FONDO.png";
import { Font } from "@react-pdf/renderer";
import { Button } from "primereact/button";

// Registra la fuente cursiva desde la ubicación local
Font.registerHyphenationCallback((word) => [word]);

Font.register({
  family: "CursiveFont", // Nombre de la familia de fuentes
  src: require("../ResumenDocente2/recursos/Satisfy-Regular.ttf"), // Ruta absoluta o relativa al archivo de fuente
});

Font.register({
  family: "RobotoFont", // Nombre de la familia de fuentes
  src: require("../ResumenDocente2/recursos/Roboto-Bold.ttf"), // Ruta absoluta o relativa al archivo de fuente
});
Font.register({
  family: "RobotoFontRegular", // Nombre de la familia de fuentes
  src: require("../ResumenDocente2/recursos/Roboto-Regular.ttf"), // Ruta absoluta o relativa al archivo de fuente
});

function formatDate(date: Date | undefined): string | null {
  if (!date) return null; // Manejar el caso en que no haya fecha
  const formattedDate = date.toISOString().slice(0, 10); // Formatear la fecha como "YYYY-MM-DD"
  return formattedDate;
}

function PersonaCombinada({ personaId }: { personaId: number }) {
  const [pers1, setpers1] = useState<FichaCombinada>();
  const personaService = new PersonaService();
  const [pdfContent, setPdfContent] = useState<React.ReactNode | null>(null);

  type PdfData = {
    cedula: string;
    nombre: string;
    ubicacion: string;
    correo: string;
    parroquia: string;
    sector: string;
    genero: string;
    celular: string;
    telefono: string;
    paisnacimiento: string;
    paisresidencia: string;
    estadocivil: string;
    idiomaraiz: string;
    idiomasecundario: string;
    descripcionHabilidad: string;
    areaestudio: string;
    capacitacion: CapacitacionData[];
    experiencias: ExperienciaData[];
    referencias: RecomendacionesData[];
    habilidad: HabilidadesData[];
    foto: string;
    descripcionperfil: string;
  };

  type ExperienciaData = {
    areaExperiencia: string;
    instiExperiencia: string;
    fechaiExperiencia: string | null;
    fehcafExperiencia: string | null;
    actividadExperiencia: string;
  };
  type RecomendacionesData = {
    primer_nombre: string;
    primer_apellido: string;
    correo: string;
  };
  type CapacitacionData = {
    area_estudioCapacitacion: string;
    intitucionCapacitacion: string;
    eventoCapacitacion: string;
    fechaiCapacitacion: string | null;
    fechafCapacitacion: string | null;
  };

  type HabilidadesData = {
    descripcion: string;
  };

  useEffect(() => {
    personaService
      .getById(personaId)

      .then((data) => {
        setpers1(data);
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
      });
  }, [personaId]);

  if (!pers1) {
    return <div>Cargando...</div>;
  }

  const generatePdfContent = (): PdfData => {
    const data = pers1; // Obtén el primer objeto de la matriz

    const descriHabi = data.habilidades
      ? data.habilidades.map((habilidad) => habilidad.descripcion).join("\n")
      : "";

    const capacitaciones: CapacitacionData[] = data.capacitaciones
      ? data.capacitaciones.map((capa) => ({
          area_estudioCapacitacion: capa.area_estudios,
          intitucionCapacitacion: capa.institucion,
          eventoCapacitacion: capa.tipo_evento,
          fechaiCapacitacion: capa.fecha_inicio instanceof Date ? formatDate(new Date(capa.fecha_inicio)) : '',
          fechafCapacitacion: capa.fecha_fin instanceof Date ? formatDate(new Date(capa.fecha_fin)) : '',
        
        }))
      : [];

    const experiencias: ExperienciaData[] = data.experiencias
      ? data.experiencias.map((experiencia) => ({
          areaExperiencia: experiencia.area_trabajo,
          instiExperiencia: experiencia.institucion,
          fechaiExperiencia: experiencia.fecha_inicio instanceof Date ? formatDate(new Date(experiencia.fecha_inicio)) : '',
          fehcafExperiencia: experiencia.fecha_fin instanceof Date ? formatDate(new Date(experiencia.fecha_fin)) : '',
          actividadExperiencia: experiencia.actividades,
        }))
      : [];
    const recomendaciones: RecomendacionesData[] = data.recomendaciones
      ? data.recomendaciones.map((recomendacion) => ({
          primer_nombre: recomendacion.primer_nombre,
          primer_apellido: recomendacion.primer_apellido,
          correo: recomendacion.correo,
        }))
      : [];

    const habilidades: HabilidadesData[] = data.habilidades
      ? data.habilidades.map((habilidad) => ({
          descripcion: habilidad.descripcion,
        }))
      : [];

    const area = data.instruccion
      ? data.instruccion
          .map((instruccion) => instruccion.institucionEducativa)
          .join("\n")
      : "";

    return {
      cedula: data.persona.cedula,
      nombre:
        data.persona.primer_nombre +
        " " +
        data.persona.segundo_nombre +
        " " +
        data.persona.apellido_paterno +
        " " +
        data.persona.apellido_materno,
      ubicacion:
        data.persona.sector +
        ", " +
        data.persona.canton_residencia +
        ", " +
        data.persona.provincia_residencia,

      correo: data.persona.correo,
      parroquia: data.persona.parroquia_residencia,
      sector: data.persona.sector,
      genero: data.persona.genero,
      celular: data.persona.celular,
      telefono: data.persona.telefono,
      paisnacimiento: data.persona.pais_natal,
      paisresidencia: data.persona.pais_residencia,
      estadocivil: data.persona.estado_civil,
      idiomaraiz: data.persona.idioma_raiz,
      idiomasecundario: data.persona.idioma_secundario,
      descripcionHabilidad: descriHabi,
      areaestudio: area,
      experiencias: experiencias,
      capacitacion: capacitaciones,
      referencias: recomendaciones,
      habilidad: habilidades,
      foto: data.persona.foto,
      descripcionperfil: data.persona.descripcion_perfil,
    };
  };

  const handleGeneratePDF = () => {
    const pdfData = generatePdfContent();

    const styles = StyleSheet.create({
      page: {
        padding: 15,
      },
      margin: {
        padding: 15,
      },
      title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center",
        color: "black",
      },
      subtitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 10,
        color: "blue",
      },
      description: {
        fontSize: 12,
        marginBottom: 5,
      },
      tableContainer: {
        marginTop: 10,
        display: "flex",
      },
      tableRow: {
        flexDirection: "row",

        alignItems: "center",
      },
      tableCell: {
        fontSize: 15,
        padding: 5,
        flex: 1,
        textAlign: "center",
        color: "blue",
      },
      tableCont: {
        fontSize: 12,
        padding: 5,
        flex: 1,
        textAlign: "center",
      },
      section: {
        marginTop: 20,
        marginBottom: 20,
      },

      sectionSubTitle: {
        fontSize: 15,
        fontWeight: "bold",
        marginBottom: 10,
        fontFamily: "RobotoFont",
        color: "black",
      },
      sectionContent: {
        fontSize: 12,
        marginBottom: 5,
        fontFamily: "RobotoFontRegular",
      },
      sectionContentinfo: {
        fontSize: 11,
        marginBottom: 10,
        fontFamily: "RobotoFontRegular",
      },

      column: {
        flex: 1,
        marginLeft: 10, // Ajusta este valor para controlar el espacio entre las columnas
      },

      listContainer: {
        marginTop: 10,
      },
      listItem: {
        fontSize: 12,
        marginBottom: 5,
      },
      nameContainer: {
        textAlign: "center",
        padding: 10,
        marginBottom: 10,
        alignContent: "space-between",
      },
      nameText: {
        verticalAlign: "sub",
        fontSize: 24,
        fontFamily: "CursiveFont", // Usa el nombre registrado de la fuente cursiva
        fontWeight: "bold",
        color: "black",
        flex: -1,
      },
      horizontalLine: {
        borderBottomWidth: 1,
        borderBottomColor: "black",
        marginVertical: 1,
        marginTop: -10,
      },
      leftColumn: {
        flex: 1,
      },
      rightColumn: {
        flex: 1,
      },
      image: {
        width: 50,
        height: 50,
        borderRadius: 50,
        margin: 0,
        borderRight: 50,
        marginHorizontal: 450,
      },
      banner: {
        width: 125,
        height: 38,

        marginHorizontal: 190,
        marginBottom: 10,
      },
      sectionTitle: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        color: "#004F9F",
        fontFamily: "RobotoFont", // Cambiado a color hexadecimal
      },

      icon: {
        width: 15,
        height: 15,
        marginRight: 5,
        marginBottom: 10, // Ajusta el espacio entre la imagen y el texto
      },

      sectionTitleText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#004F9F",
        marginBottom: 10,
        fontFamily: "RobotoFont",
      },
      sectiontitledescri: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 22,
        textAlign: "center",
        color: "#004F9F",
        fontFamily: "RobotoFont",
      },
      sectiondescri: {
        fontSize: 12,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        fontFamily: "RobotoFont",
      },
    });

    const MyDocument = ({ data }: { data: PdfData }) => (
      <Document>
        <Page style={styles.page}>
          <View style={styles.margin}>
            <View style={styles.banner}>
              <Image src={banner} style={styles.banner} />
            </View>
            <View style={styles.nameContainer}>
              <Text style={styles.nameText}>{data.nombre}</Text>
              <Image src={data.foto} style={styles.image} />
            </View>
            <Text style={styles.sectiontitledescri}>
              Resumen perfil profesional
            </Text>
            <View style={styles.sectiondescri}>
              <Text>{data.descripcionperfil} </Text>
              <View style={styles.sectionTitle}>
                <Image
                  src="https://cdn.icon-icons.com/icons2/1369/PNG/512/-person_90382.png"
                  style={styles.icon}
                />
                <Text style={styles.sectionTitleText}>Datos</Text>
              </View>

              <View style={styles.horizontalLine}></View>
              <View style={{ marginTop: 20 }}></View>
              <View style={styles.tableRow}>
                <View style={styles.leftColumn}>
                  <Text style={styles.sectionContentinfo}>
                    Teléfono: <FaPhone size={12} />
                    {data.celular} - {data.telefono}
                  </Text>
                  <Text style={styles.sectionContentinfo}>
                    Correo: {data.correo}
                  </Text>
                  <Text style={styles.sectionContentinfo}>
                    Dirección: {data.ubicacion}
                  </Text>
                </View>
                <View style={styles.rightColumn}>
                  <Text style={styles.sectionContentinfo}>
                    Información: {data.estadocivil},{" "}
                    {data.genero}, {data.paisresidencia}
                  </Text>
                  <Text style={styles.sectionContentinfo}>
                    Cédula: {data.cedula}
                  </Text>
                </View>
              </View>

              <View style={styles.sectionTitle}>
                <Image
                  src="https://cdn-icons-png.flaticon.com/512/41/41956.png"
                  style={styles.icon}
                />
                <Text style={styles.sectionTitleText}>Experiencia Laboral</Text>
              </View>
              <View style={styles.horizontalLine}></View>
              <View style={{ marginTop: 20 }}></View>
              {data.experiencias.map((experiencias, index) => (
                <View key={index} style={styles.sectionContent}>
                  <Text style={styles.sectionSubTitle}>
                    Área: {experiencias.areaExperiencia}
                  </Text>
                  <Text>
                    Instituto/Empresa: {experiencias.instiExperiencia}
                  </Text>
                  <Text>
                    Periodo: {experiencias.fechaiExperiencia} -{" "}
                    {experiencias.fehcafExperiencia}
                  </Text>
                  <Text>Actividad: {experiencias.actividadExperiencia}</Text>
                  {index !== data.experiencias.length - 1}
                </View>
              ))}

              <View style={styles.sectionTitle}>
                <Image
                  src="https://cdn-icons-png.flaticon.com/512/21/21079.png"
                  style={styles.icon}
                />
                <Text style={styles.sectionTitleText}>Estudios</Text>
              </View>
              <View style={styles.horizontalLine}></View>
              <View style={{ marginTop: 20 }}></View>
              {data.capacitacion.map((capacitacion, index) => (
                <View key={index} style={styles.sectionContent}>
                  <Text style={styles.sectionSubTitle}>
                    Área: {capacitacion.area_estudioCapacitacion}
                  </Text>
                  <Text style={styles.sectionContent}>
                    Institución: {capacitacion.intitucionCapacitacion}
                  </Text>
                  <Text style={styles.sectionContent}>
                    Contenido: {capacitacion.eventoCapacitacion}
                  </Text>
                  <Text style={styles.sectionContent}>
                    Periodo: {capacitacion.fechaiCapacitacion} -{" "}
                    {capacitacion.fechafCapacitacion}
                  </Text>
                  {index !== data.capacitacion.length - 1}
                </View>
              ))}

              <View style={styles.sectionTitle}>
                <Image
                  src="https://cdn-icons-png.flaticon.com/512/839/839986.png"
                  style={styles.icon}
                />
                <Text style={styles.sectionTitleText}>Referencias</Text>
              </View>
              <View style={styles.horizontalLine}></View>
              <View style={{ marginTop: 20 }}></View>
              {data.referencias.map((referencias, index) => (
                <View key={index} style={styles.sectionContent}>
                  <Text style={styles.sectionContent}>
                    Nombre: {referencias.primer_nombre}
                  </Text>
                  <Text style={styles.sectionContent}>
                    Apellido: {referencias.primer_apellido}
                  </Text>
                  <Text style={styles.sectionContent}>
                    Correo: {referencias.correo}
                  </Text>

                  {index !== data.referencias.length - 1}
                </View>
              ))}

              <View style={styles.sectionTitle}>
                <Image
                  src="https://cdn.icon-icons.com/icons2/2098/PNG/512/monitor_icon_128804.png"
                  style={styles.icon}
                />
                <Text style={styles.sectionTitleText}>Habilidades</Text>
              </View>
              <View style={styles.horizontalLine}></View>
              <View style={{ marginTop: 20 }}></View>
              {data.habilidad.map((habilidad, index) => (
                <View key={index} style={styles.sectionContent}>
                  <Text style={styles.sectionContent}>
                    Descripción: {habilidad.descripcion}
                  </Text>
                  {index !== data.referencias.length - 1}
                </View>
              ))}

              <View style={styles.sectionTitle}>
                <Image
                  src="https://cdn.icon-icons.com/icons2/2456/PNG/512/language_network_globe_icon_149018.png"
                  style={styles.icon}
                />
                <Text style={styles.sectionTitleText}>Idiomas</Text>
              </View>
              <View style={styles.horizontalLine}></View>
              <View style={{ marginTop: 20 }}></View>
              <View style={styles.tableRow}> </View>
              <View style={styles.sectionContent}>
                <Text style={styles.sectionContent}>
                  {data.idiomaraiz} , {data.idiomasecundario}
                </Text>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    );

    // Generar el blob del PDF y descargarlo
    const pdfBlob = (
      <PDFDownloadLink
        document={<MyDocument data={pdfData} />}
        fileName="HojaVida.pdf"
      >
        {({ blob, url, loading, error }) =>
          loading ? "Generando PDF..." : "  Descargar PDF"
        }
      </PDFDownloadLink>
    );
    setPdfContent(pdfBlob);
  };

  return (
    <div className="flex align-items-center justify-content-center w-auto min-w-min">
      <Button
        type="button"
        className="" // Agrega la clase "button"
        onClick={handleGeneratePDF}
        style={{
          background: "#ff0000",
          fontSize: "15px",
          width: "120px",
          height: "50px",
          color: "black",
          justifyContent: "center",
          fontWeight: "bold",
        }}
      >
        <span className="hoverEffect"></span>
        Hoja De Vida
      </Button>
      {pdfContent}
    </div>
  );
}
export default PersonaCombinada;
