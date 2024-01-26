import React from "react";
import { View, Text,  } from "@react-pdf/renderer";

const styles = {
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "blue",
    marginLeft: 10,
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 12,
    marginBottom: 5,
  },
};

function Recomendacion({ datos }) {
  return (
    <View style={styles.section}>
    <Text style={styles.sectionTitle}>Recomendaciones</Text>
    <Text style={styles.sectionContent}>Nombre:</Text>
    <Text style={styles.sectionContent}>{datos.primer_nombre_apellido_reco}</Text>
    <Text style={styles.sectionContent}>Correo:</Text>
    <Text style={styles.sectionContent}>{datos.correo_reco}</Text>
    </View>
  );
}

export default Recomendacion;