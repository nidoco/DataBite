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
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#163a5f',
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 16,
    },
    info: {
        flex: 1,
    },
    nombre: {
        fontSize: 20,
        color: '#4fd1c5',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    nombreCientifico: {
        fontSize: 16,
        color: '#cbd5e0',
        fontStyle: 'italic',
    },
});
