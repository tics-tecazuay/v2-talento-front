import React from "react";
import { View, Text, Image } from "@react-pdf/renderer";

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
    marginBottom: 10,
  },
  data: {
    
    fontSize: 12,
    marginBottom: 10,
  },
  icon: {
    width: 12, // Ajusta el ancho del icono
    height: 12, // Ajusta la altura del icono
    marginRight: 5,
  },
};

function Habilidades({ datos }) {
  return (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>Habilidades</Text>

        <Text style={styles.data}>{datos.descripcionHabilidad}</Text>
        <Text></Text>
    </View>
  );
}

export default Habilidades;