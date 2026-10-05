import { Shark } from '../types/Shark';
import { View, Text, StyleSheet } from 'react-native';

export function SharkCard({ shark }: { shark: Shark }) {
  return (
    <View style={styles.card}>
      {/* Aqui ira la imagen de la especie en F03 (galeria). */}
      <View style={styles.info}>
        <Text style={styles.nombre}>{shark.nombre}</Text>
        <Text style={styles.nombreCientifico}>{shark.nombreCientifico}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    card: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#edaeb9',
        padding: 16,
        marginVertical: 8,
    },
    info: {
    flex: 1,
    },
    nombre: {
        fontSize: 20,
        color: '#55b2c9',
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 10, 
    } ,
    nombreCientifico: {
        fontSize: 16,
        color: '#000000',
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 5,
    },
})