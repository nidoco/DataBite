import { Shark } from '../types/Shark';
import { View, Text, StyleSheet, Pressable} from 'react-native';

interface SharkCardProps {
  shark: Shark;
  onPress: () => void;
}

export function SharkCard({ shark, onPress }: SharkCardProps) {
  return (
    <Pressable style={styles.pressable} onPress={onPress}>
      <View style={styles.card}>
        {/* Aqui ira la imagen de la especie en F03 (galeria). */}
        <View style={styles.info}>
          <Text style={styles.nombre}>{shark.nombre}</Text>
          <Text style={styles.nombreCientifico}>{shark.nombreCientifico}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
      marginVertical: 8,
      marginHorizontal: 16,
      borderRadius: 16,
      overflow: 'hidden',
    },
  card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: '#163a5f',
      padding: 16,
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
