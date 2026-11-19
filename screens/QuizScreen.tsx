import { View, Text, StyleSheet, Pressable, Alert, AccessibilityInfo } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import loadQuiz, { elegirRonda } from '../data/loadQuiz';
import { useState, useRef, useEffect } from 'react';
import { Respuesta } from '../types/Pregunta';
import { usePreventRemove } from '@react-navigation/native';
import { TarjetaPregunta } from '../components/TarjetaPregunta';


type Props = NativeStackScreenProps<RootStackParamList, 'Quiz'>;

export function QuizScreen({ navigation }: Props) {
  const [quiz] = useState(() => elegirRonda(loadQuiz()));
  const [indice, setIndice] = useState(0);
  const [respuestas, setRespuestas] = useState<{ id: string; acierto: boolean }[]>([]);
  const [reducirMovimiento, setReducirMovimiento] = useState(false);

  // Se respeta la preferencia del sistema de reducir el movimiento (y sus cambios en vivo).
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReducirMovimiento);
    const suscripcion = AccessibilityInfo.addEventListener('reduceMotionChanged', setReducirMovimiento);
    return () => suscripcion.remove();
  }, []);

  const pregunta = quiz[indice];
  const respondida = respuestas.length > indice;
  const esUltima = indice === quiz.length - 1;
  const avanzar = () => {
    if (esUltima) {
      terminada.current = true;
      navigation.replace('Resultados', { respuestas });
    } else {
      setIndice(indice + 1);
    }
  };
  const terminada = useRef(false);

usePreventRemove(respuestas.length > 0, ({ data }) => {
  // La ronda terminó y se va a Resultados: no hay nada que confirmar.
  if (terminada.current) {
    navigation.dispatch(data.action);
    return;
  }

  Alert.alert(
    '¿Salir del quiz?',
    'Si sales ahora, perderás el progreso de esta ronda.',
    [
      { text: 'Seguir jugando', style: 'cancel' },
      {
        text: 'Salir',
        style: 'destructive',
        onPress: () => navigation.dispatch(data.action),
      },
    ],
  );
});

  if (!pregunta) {
    return (
      <View style={styles.container}>
        <Text style={styles.texto}>No hay preguntas disponibles.</Text>
        <Pressable
          style={({ pressed }) => [styles.boton, pressed && styles.botonPresionado]}
          onPress={() => navigation.goBack()}>
          <Text style={styles.botonTexto}>Volver</Text>
        </Pressable>
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
      <TarjetaPregunta
        key={pregunta.id}
        enunciado={pregunta.enunciado}
        habilitada={!respondida}
        reducirMovimiento={reducirMovimiento}
        onElegir={responder}
      />
      {!respondida && (
      <>
      <Text style={styles.pista}>Desliza la tarjeta: ← Mito · Realidad →</Text>
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
  pista: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  botonTexto: {
    color: '#4fd1c5',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
