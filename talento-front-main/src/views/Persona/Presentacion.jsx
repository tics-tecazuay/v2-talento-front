import React from "react";
import { View, Text, Image } from "@react-pdf/renderer";

const styles = {
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "black",
  },
  sectionContent: {
    fontSize: 12,
    marginBottom: 5,
    flexDirection: "row", // Alineación horizontal de icono y texto
    alignItems: "center", // Centrar verticalmente el contenido
  },
  image: {
    width: 150,
    height: 200,
    border: "2px solid blue",
    padding: 2,
    marginBottom: 7,
  },
  nombre: {
    fontSize: 16,
    fontWeight: "bold",
    color: "blue",
    marginLeft: 10,
    marginBottom: 10,
  },
  icon: {
    width: 12, // Ajusta el ancho del icono
    height: 12, // Ajusta la altura del icono
    marginRight: 5,
  },
 
};

function Presentacion({ datos }) {
  return (
    <View>
      <Image src={datos.foto} style={styles.image} />

      <Text style={styles.nombre}>
        {datos.nombres} {datos.apellidos}
      </Text>
      <View style={styles.sectionContent}>
        <Image src="https://cdn-icons-png.flaticon.com/512/1384/1384095.png" style={styles.icon} />
        <Text>{datos.celular}</Text>
      </View>
      <View style={styles.sectionContent}>
        <Image src="https://cdn.icon-icons.com/icons2/1769/PNG/512/4092561-email-envelope-mail-message-mobile-ui-ui-website_114031.png" style={styles.icon} />
        <Text>{datos.correo}</Text>
      </View>
      <View style={styles.sectionContent}>
        <Image src="https://cdn.icon-icons.com/icons2/936/PNG/512/map-marker_icon-icons.com_73495.png" style={styles.icon} />
        <Text>{datos.paisnacimiento}</Text>
      </View>
    </View>
  );
}

export default Presentacion;