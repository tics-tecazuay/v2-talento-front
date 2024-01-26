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

function Experiencia({ datos }) {
  return (
    <View style={styles.section}>
    <Text style={styles.sectionTitle}>Experiencias</Text>
    <Text style={styles.sectionContent}>{datos.actividadExperiencia}</Text>
    </View>
  );
}

export default Experiencia;