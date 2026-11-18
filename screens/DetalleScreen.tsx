import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { getSharkById } from '../data/loadSharks';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DatoFicha } from '../components/DatoFicha';

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
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
    <ScrollView contentContainerStyle={styles.contenido}>
      <View style={styles.encabezado}>
        <Text style={styles.nombre}>{shark.nombre}</Text>
        <Text style={styles.nombreCientifico}>{shark.nombreCientifico}</Text>
        <View style={styles.estado}>
          <Text style={styles.estadoTexto}>{shark.estadoConservacion}</Text>
        </View>
      </View>

      <View style={styles.tarjeta}>
        <Text style={styles.seccion}>Morfología</Text>
        <DatoFicha etiqueta="Longitud" valor={`${shark.morfologia.longitudMetros} m`} />
        <DatoFicha etiqueta="Peso" valor={shark.morfologia.pesoKg !== undefined ? `${shark.morfologia.pesoKg} kg` : "No disponible"} />
        <DatoFicha etiqueta="Forma del cuerpo" valor={shark.morfologia.formaCuerpo} />
        <DatoFicha etiqueta="Rasgo distintivo" valor={shark.morfologia.rasgoDistintivo} />
      </View>

      <View style={styles.tarjeta}>
        <Text style={styles.seccion}>Hábitat y alimentación</Text>
        <DatoFicha etiqueta="Hábitat" valor={shark.habitat} />
        <DatoFicha etiqueta="Alimentación" valor={shark.alimentacion} />
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a2540',
  },
  contenido: {
    padding: 16,
    gap: 16,
  },
  encabezado: {
    gap: 4,
    paddingVertical: 8,
  },
  nombre: {
    color: '#4fd1c5',
    fontSize: 28,
    fontWeight: 'bold',
  },
  nombreCientifico: {
    color: '#cbd5e0',
    fontSize: 18,
    fontStyle: 'italic',
  },
  estado: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#4fd1c5',
  },
  estadoTexto: {
    color: '#4fd1c5',
    fontSize: 14,
  },
  tarjeta: {
    backgroundColor: '#163a5f',
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  seccion: {
    color: '#4fd1c5',
    fontSize: 18,
    fontWeight: 'bold',
  },
  texto: {
    color: '#cbd5e0',
    fontSize: 18,
  },
  centrado: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    padding: 16,
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
