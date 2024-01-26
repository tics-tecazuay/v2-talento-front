
import React from 'react';
import { View, Text } from '@react-pdf/renderer';

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
  bloques: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 10,

    color: "black",
   
  },
  data: {
    marginLeft: 10,
    fontSize: 12,
    marginBottom: 10,
   
  }
};
function DatosPersonales({ datos }) {
  return (
    <View>
      <Text style={styles.sectionTitle}>Datos Personales</Text>
      <Text style={styles.bloques}>Cédula de identidad</Text>
      <Text style={styles.data}>{datos.cedula}</Text>
      <Text style={styles.bloques}>Edad:</Text>
      <Text style={styles.data}>{datos.edad} Años</Text>
      <Text style={styles.bloques}>Nacionalidad: </Text>
      <Text style={styles.data}>{datos.paisnacimiento}</Text>
      <Text style={styles.bloques}>Estado Civil:</Text>
      <Text style={styles.data}>{datos.estadocivil}</Text>
      <Text style={styles.bloques}>Género: </Text>
      <Text style={styles.data}>{datos.genero}</Text>
    </View>
  );
}

export default DatosPersonales;