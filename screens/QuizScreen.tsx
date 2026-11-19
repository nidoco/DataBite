import { View, Text, StyleSheet, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import loadQuiz, { elegirRonda } from '../data/loadQuiz';
import { useState } from 'react';
import { Respuesta } from '../types/Pregunta';

type Props = NativeStackScreenProps<RootStackParamList, 'Quiz'>;

export function QuizScreen({ navigation }: Props) {
  const [quiz] = useState(() => elegirRonda(loadQuiz()));
  const [indice, setIndice] = useState(0);
  const [respuestas, setRespuestas] = useState<{ id: string; acierto: boolean }[]>([]);

  const pregunta = quiz[indice];
  const respondida = respuestas.length > indice;
  const esUltima = indice === quiz.length - 1;
  const avanzar = () => {
    if (esUltima) {
      navigation.replace('Resultados', { respuestas });
    } else {
      setIndice(indice + 1);
    }
  };

  if (!pregunta) {
    return (
      <View style={styles.container}>
        <Text style={styles.texto}>No hay preguntas disponibles.</Text>
      </View>
    );
  }
  const responder = (eleccion: Respuesta) => {
    // salir si ya respondio
    if (respondida) return;
    // calcular si acerto
    const acierto = eleccion === pregunta.respuesta;
    // guardar respuesta en una lista nueva 
    setRespuestas([...respuestas, { id: pregunta.id, acierto }]);
  }
   

  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Pregunta {indice + 1} de {quiz.length}</Text>
      <Text style={styles.texto}>{pregunta.enunciado}</Text>
      {!respondida && (
      <>
      <Pressable style={styles.boton} onPress={() => responder('mito')}>
          <Text style={styles.texto}>Mito</Text>
        </Pressable><Pressable style={styles.boton} onPress={() => responder('realidad')}>
            <Text style={styles.texto}>Realidad</Text>
          </Pressable>
          </>
      )}
      {respondida && (
        <>
          <Text style={styles.texto}>
            {respuestas[indice].acierto ? 'Correcto' : 'Incorrecto'}
          </Text>
          <Text style={styles.texto}>{pregunta.explicacion}</Text>
          <Pressable style={styles.boton} onPress={avanzar}>
            <Text style={styles.texto}>{esUltima ? 'Ver resultados' : 'Siguiente'}</Text>
          </Pressable>
        </>
      )}

      <Pressable
        style={({ pressed }) => [styles.boton, pressed && styles.botonPresionado]}
        onPress={() => navigation.goBack()}>
        <Text style={styles.botonTexto}>Volver</Text>
      </Pressable>
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
    fontSize: 18,
     textAlign: 'center',
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
