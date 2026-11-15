import { View, Text, StyleSheet, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { getSharkById } from '../data/loadSharks';

type Props = NativeStackScreenProps<RootStackParamList, 'Detalle'>;
export function DetalleScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const shark = getSharkById(id);

  if (!shark) {
    return (
      <View style={[styles.container, styles.centrado]}>
        <Text style={styles.texto}>Especie no encontrada</Text>
        <Pressable
          style={({ pressed }) => [styles.boton, pressed && styles.botonPresionado]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.botonTexto}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Detalle de: {id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a2540',
    padding: 16
    },
  texto: {
    color: '#cbd5e0',
    fontSize: 18
    },
  centrado: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    },
  boton: {
    backgroundColor: '#163a5f',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 16,
    },
  botonPresionado: {
    opacity: 0.7,
    },
  botonTexto: {
    color: '#4fd1c5',
    fontSize: 16,
    fontWeight: 'bold',
    },
});


