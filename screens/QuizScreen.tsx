import { View, Text, StyleSheet, Pressable, Alert, AccessibilityInfo, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import loadQuiz, { elegirRonda } from '../data/loadQuiz';
import loadAcertijos from '../data/loadAcertijos';
import { useProgreso } from '../data/progresoContext';
import { useState, useRef, useEffect } from 'react';
import { Respuesta } from '../types/Pregunta';
import { Acertijo } from '../types/Acertijo';
import { usePreventRemove } from '@react-navigation/native';
import { TarjetaPregunta } from '../components/TarjetaPregunta';
import { AcertijoCard } from '../components/AcertijoCard';
import { getSharkById } from '../data/loadSharks';

// Probabilidad de que aparezca un acertijo al avanzar de pregunta. Para probar, súbela a 1.
const PROBABILIDAD_ACERTIJO = 0.1;

const nombreEspecie = (id: string) => getSharkById(id)?.nombre ?? id;

type Props = NativeStackScreenProps<RootStackParamList, 'Quiz'>;

export function QuizScreen({ navigation }: Props) {
  const [quiz] = useState(() => elegirRonda(loadQuiz()));
  const [indice, setIndice] = useState(0);
  const [respuestas, setRespuestas] = useState<{ id: string; acierto: boolean }[]>([]);
  const [reducirMovimiento, setReducirMovimiento] = useState(false);
  const [acertijo, setAcertijo] = useState<Acertijo | null>(null);
  const [resultadoAcertijo, setResultadoAcertijo] = useState<{ acierto: boolean; nombre: string } | null>(null);
  const { desbloqueadas, desbloquearEspecie } = useProgreso();

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
      return;
    }
    // Con poca probabilidad sale un acertijo de una especie que todavía está bloqueada.
    if (Math.random() < PROBABILIDAD_ACERTIJO) {
      const candidatos = loadAcertijos().filter((a) => !desbloqueadas.includes(a.sharkId));
      if (candidatos.length > 0) {
        setAcertijo(candidatos[Math.floor(Math.random() * candidatos.length)]);
        return;
      }
    }
    setIndice(indice + 1);
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

  // Mientras hay un acertijo activo, se muestra en lugar de la pregunta.
  // Al acertar o agotar intentos, se cierra y el quiz sigue con la siguiente pregunta.
  if (acertijo) {
    const cerrarAcertijo = () => {
      setAcertijo(null);
      setResultadoAcertijo(null);
      setIndice(indice + 1);
    };

    // Al terminar el acertijo, se muestra el resultado hasta que la usuaria pulse "Continuar".
    if (resultadoAcertijo) {
      return (
        <View style={styles.container}>
          <Text style={styles.tituloAcertijo}>
            {resultadoAcertijo.acierto ? '¡Correcto!' : 'Se acabaron los intentos'}
          </Text>
          <Text style={styles.texto}>
            {resultadoAcertijo.acierto
              ? `Desbloqueaste a ${resultadoAcertijo.nombre} en el catálogo.`
              : `La especie era ${resultadoAcertijo.nombre}. ¡Suerte para la próxima!`}
          </Text>
          <Pressable style={styles.boton} onPress={cerrarAcertijo}>
            <Text style={styles.botonTexto}>Continuar</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <AcertijoCard
          key={acertijo.id}
          acertijo={acertijo}
          onAcierto={(sharkId) => {
            desbloquearEspecie(sharkId);
            setResultadoAcertijo({ acierto: true, nombre: nombreEspecie(sharkId) });
          }}
          onAgotado={() =>
            setResultadoAcertijo({ acierto: false, nombre: nombreEspecie(acertijo.sharkId) })
          }
        />
      </KeyboardAvoidingView>
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
  tituloAcertijo: {
    color: '#4fd1c5',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
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
