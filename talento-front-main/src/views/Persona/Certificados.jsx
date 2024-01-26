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
  },
};

function Certificados({ datos }) {
  return (
    <View style={styles.section}>
    <Image
        src={datos.certificado} // Aquí concateno 'data:image/jpeg;base64,' para formatear el src como una URL base64
        style={{  marginBottom: 10, alignSelf: "center" }}
      />
    </View>
  );
}

export default Certificados;