import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Resultados'>;

export function ResultadosScreen({ route }: Props) {
  const { respuestas } = route.params;
  // Los aciertos se calculan de la lista; no se guardan aparte.
  const aciertos = respuestas.filter((respuesta) => respuesta.acierto).length;

  return (
    <View style={styles.container}>
      <Text style={styles.texto}>
        Acertaste {aciertos} de {respuestas.length}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a2540',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  texto: {
    color: '#cbd5e0',
    fontSize: 20,
  },
});
