import { Shark } from '../types/Shark';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { imagenPorIdentificador } from '../data/imagenes';

interface SharkCardProps {
  shark: Shark;
  onPress: () => void;
}

export function SharkCard({ shark, onPress }: SharkCardProps) {
  return (
    <Pressable style={styles.pressable} onPress={onPress}>
      <View style={styles.card}>
        {/* La portada es la primera foto de la especie; sin foto, sale el placeholder. */}
        {shark.imagenes?.[0] ? (
          <Image source={imagenPorIdentificador(shark.imagenes[0])} style={styles.portada} />
        ) : (
          <View style={[styles.portada, styles.sinFoto]}>
            <Text style={styles.textoSinFoto}>Sin foto</Text>
          </View>
        )}
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
    borderRadius: 16,
    overflow: 'hidden',
  },
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
  portada: {
    width: 72,
    height: 72,
    borderRadius: 12,
  },
  sinFoto: {
    backgroundColor: '#0a2540',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoSinFoto: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
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
