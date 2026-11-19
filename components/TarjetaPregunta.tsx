import { Text, StyleSheet, useWindowDimensions } from 'react-native';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { Respuesta } from '../types/Pregunta';

interface TarjetaPreguntaProps {
  enunciado: string;
  habilitada: boolean;
  reducirMovimiento: boolean;
  onElegir: (eleccion: Respuesta) => void;
}

// Tarjeta con el enunciado que se puede deslizar: a la izquierda = mito, a la derecha = realidad.
// Los botones de la pantalla hacen lo mismo; el gesto es una vía extra, nunca la única.
export function TarjetaPregunta({ enunciado, habilitada, reducirMovimiento, onElegir }: TarjetaPreguntaProps) {
  const { width } = useWindowDimensions();
  // Hay que arrastrar al menos el 30 % del ancho de la pantalla (sin números de un teléfono concreto).
  const umbral = width * 0.3;
  const desplazamiento = useSharedValue(0);

  const gesto = usePanGesture({
    enabled: habilitada,
    // Estos callbacks corren en el hilo de la interfaz, así la tarjeta sigue al dedo sin tirones.
    onUpdate: (evento) => {
      // Con "reducir movimiento" la tarjeta no se mueve; el gesto se reconoce igual al soltar.
      if (!reducirMovimiento) {
        desplazamiento.value = evento.translationX;
      }
    },
    onDeactivate: (evento) => {
      if (!evento.canceled && Math.abs(evento.translationX) > umbral) {
        // Responder cambia el estado de React, que vive en el otro hilo: se avisa con scheduleOnRN.
        scheduleOnRN(onElegir, evento.translationX > 0 ? 'realidad' : 'mito');
      }
      desplazamiento.value = reducirMovimiento ? 0 : withSpring(0);
    },
  });

  // Solo se animan transform (translateX y rotate), que es lo que sí puede ir al hilo nativo.
  const estilo = useAnimatedStyle(() => ({
    transform: [
      { translateX: desplazamiento.value },
      { rotate: `${desplazamiento.value / 25}deg` },
    ],
  }));

  return (
    <GestureDetector gesture={gesto}>
      <Animated.View style={[styles.tarjeta, estilo]}>
        <Text style={styles.enunciado}>{enunciado}</Text>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: '#163a5f',
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
    alignSelf: 'stretch',
  },
  enunciado: {
    color: '#cbd5e0',
    fontSize: 20,
    textAlign: 'center',
  },
});
