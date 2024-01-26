import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import { Ivficahapersona } from '../../interfaces/Primary/Ivfichapersona';
import { VfichapersonaService } from '../../services/VfichapersonaService'
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet,  } from '@react-pdf/renderer';

function VfichaPDF() {
    const [habi1, sethabi1] = useState<Ivficahapersona[]>([]);
    const vfichapersonaService = new VfichapersonaService();
    const [pdfContent, setPdfContent] = useState<React.ReactNode | null>(null);

    type PdfData = {
        cedula: String[]
        cargo: String[]
        periodo: String[]
        nombres: String[]
        apellidos: String[]
        correo: String[]
        area_estudios: String[]
        celular: String[]
        telefono: String[]
        paisnacimiento: String[]
        paisresidencia: String[]
        edad: String[]
        estadocivil: String[]
    };

    useEffect(() => {
        vfichapersonaService.getAll()
            .then((data) => {
                sethabi1(data);
            })
            .catch((error) => {
                console.error("Error al obtener los datos:", error);
            });

    }, []);



    const generatePdfContent = () => {
        const ficedula = habi1.map((ficha) => ficha.persona_cedula);
        const ficargo = habi1.map((ficha) => ficha.con_cargo);
        const fiperidodo = habi1.map((ficha) => ficha.ho_periodo);
        const nombres = habi1.map((ficha) => ficha.persona_nombres);
        const apellidos = habi1.map((ficha) => ficha.persona_apellidos);
        const correo = habi1.map((ficha) => ficha.persona_correo);
        const area_estudios = habi1.map((ficha) => ficha.capa_area_estudios);
        const pcelular = habi1.map((ficha) => ficha.persona_celular);
        const ptelefono = habi1.map((ficha) => ficha.persona_telefono);
        const ppaisnaciomiento = habi1.map((ficha) => ficha.persona_paisnacimiento);
        const ppaisresidencia = habi1.map((ficha) => ficha.persona_paisresidencia);
        const pedad = habi1.map((ficha) => ficha.persona_edad);
        const pestadocivil = habi1.map((ficha) => ficha.persona_estadocivil);

        return { cedula: ficedula, cargo: ficargo, periodo: fiperidodo, nombres: nombres, apellidos: apellidos, correo: correo, area_estudios: area_estudios, celular:pcelular, telefono: ptelefono, paisnacimiento: ppaisnaciomiento , paisresidencia: ppaisresidencia, edad: pedad, estadocivil: pestadocivil };

    }

    const handleGeneratePDF = () => {
        const pdfData = generatePdfContent();
        const styles = StyleSheet.create({
            page: {
                padding: 20,
            },
            margin: {
                borderWidth: 1,
                borderColor: 'black',
                padding: 20,
            },
            title: {
                fontSize: 24,
                fontWeight: 'bold',
                marginBottom: 20,
                textAlign: 'center',
                color: 'black',
            },
            subtitle: {
                fontSize: 16,
                fontWeight: 'bold',
                marginTop: 10,
                color: 'blue',
            },
            description: {
                fontSize: 12,
                marginBottom: 5,
            },
            tableContainer: {
                marginTop: 10,
                display: 'flex',
            },
            tableRow: {
                flexDirection: 'row',
                borderBottomWidth: 1,
                borderBottomColor: '#000',
                alignItems: 'center',
            },
            tableCell: {
                fontSize: 15,
                padding: 5,
                flex: 1,
                textAlign: 'center',
                color: 'blue',
            },
            tableCont: {
                fontSize: 12,
                padding: 5,
                flex: 1,
                textAlign: 'center',
            },
            section: {
                marginTop: 20,
                marginBottom: 20,
            },
            sectionTitle: {
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 10,
                color: 'black',
            },
            sectionContent: {
                fontSize: 12,
                marginBottom: 5,
            },
            profileImage: {
                width: 100,
                height: 100,
                marginBottom: 10,
                alignSelf: 'center',
            },
            column: {
                flex: 1,
                marginLeft: 10,  // Ajusta este valor para controlar el espacio entre las columnas
            },
            verticalLine: {
                borderLeftWidth: 1,
                borderLeftColor: 'black',
                marginHorizontal: 10,  // Ajusta este valor para controlar el espacio a ambos lados de la línea
            },
        });

        const MyDocument = ({ data }: { data: PdfData }) => (
            <Document>
                <Page style={styles.page}>
                    <View style={styles.margin}>
                        <Text style={styles.title}>Hoja de Vida</Text>
                        <View style={styles.tableRow}>
                            <View style={styles.column}>

                                <View>
                                    <Text style={styles.title}>FOTO</Text>
                                    <Text style={styles.description}>{data.nombres[0]} {data.apellidos[0]}</Text>
                                    <Text style={styles.description}>{data.correo[0]}</Text>
                                    <Text style={styles.description}>{data.celular[0]},{data.telefono[0]}</Text>
                                    <Text style={styles.description}>{data.paisresidencia[0]}</Text>
                                </View>

                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Datos Personales</Text>
                                    <Text style={styles.sectionContent}>Cédula: {data.cedula[0]}</Text>
                                    <Text style={styles.sectionContent}>Fecha de Nacimiento: {data.edad[0]}</Text>
                                    <Text style={styles.sectionContent}>Nacionalidad: {data.paisnacimiento[0]}</Text>
                                    <Text style={styles.sectionContent}>Estado Civil: {data.estadocivil[0]}</Text>
                                    <Text style={styles.sectionContent}>Nivel de Inglés: *****</Text>
                                </View>
                            </View>
                            <View style={styles.verticalLine}></View>
                            <View style={styles.column}>
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Perfil</Text>
                                    {data.area_estudios.map((areas, index) => (
                                        <Text key={index} style={styles.sectionContent}>
                                            {areas}
                                        </Text>
                                    ))}
                                </View>

                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Educación</Text>
                                    {/* Map through education data and display here */}
                                </View>

                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Habilidades</Text>
                                    {/* Map through skills data and display here */}
                                </View>

                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Experiencias</Text>
                                    {/* Map through experiences data and display here */}
                                </View>
                            </View>


                        </View>




                    </View>
                </Page>
            </Document>
        );

        // Generar el blob del PDF y descargarlo
        const pdfBlob = (
            <PDFDownloadLink document={<MyDocument data={pdfData} />} fileName="habilidades.pdf">
                {({ blob, url, loading, error }) =>
                    loading ? 'Generando PDF...' : 'Descargar PDF'
                }
            </PDFDownloadLink>
        );


        // Mostrar el enlace para descargar el PDF
        setPdfContent(pdfBlob);
    };

    return (
        <div
            className="flex align-items-center justify-content-center w-auto min-w-min">
            <Button
                type="button"
                className="w-30 text-3xl min-w-min"
                label="Generar pdf"
                style={{
                    background: '#ff0000',
                    borderRadius: '20%',
                    fontSize: '30px',
                    width: '70px',
                    height: '50px',
                    color: "black",
                    justifyContent: 'center'
                }}
                onClick={handleGeneratePDF}
            />
            {pdfContent}

        </div>

    )


}
export default VfichaPDF;