import { View, Text, StyleSheet, Pressable, Alert, AccessibilityInfo, KeyboardAvoidingView, Platform, Image, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import loadQuiz, { elegirRonda } from "../data/loadQuiz";
import loadAcertijos from "../data/loadAcertijos";
import { useProgreso } from "../data/progresoContext";
import { useState, useRef, useEffect } from "react";
import { Respuesta } from "../types/Pregunta";
import { Acertijo } from "../types/Acertijo";
import { usePreventRemove } from "@react-navigation/native";
import { TarjetaPregunta } from "../components/TarjetaPregunta";
import { AcertijoCard } from "../components/AcertijoCard";
import { getSharkById } from "../data/loadSharks";
import { imagenPorIdentificador } from "../data/imagenes";

// Probabilidad de que aparezca un acertijo al avanzar de pregunta. Para probar, súbela a 1.
const PROBABILIDAD_ACERTIJO = 0.1;

const nombreEspecie = (id: string) => getSharkById(id)?.nombre ?? id;

type Props = NativeStackScreenProps<RootStackParamList, "Quiz">;

export function QuizScreen({ navigation }: Props) {
  // La ronda se elige una sola vez al entrar. Con una función dentro de useState,
  // no se vuelve a mezclar en cada redibujado de la pantalla.
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
    const suscripcion = AccessibilityInfo.addEventListener("reduceMotionChanged", setReducirMovimiento);
    return () => suscripcion.remove();
  }, []);

  const pregunta = quiz[indice];
  // Una pregunta está respondida si ya existe una respuesta en su posición de la lista.
  const respondida = respuestas.length > indice;
  const esUltima = indice === quiz.length - 1;
  const avanzar = () => {
    if (esUltima) {
      terminada.current = true;
      navigation.replace("Resultados", { respuestas });
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

// Pide confirmación al salir a mitad de la ronda. Si la ronda ya terminó, deja salir sin preguntar.
usePreventRemove(respuestas.length > 0, ({ data }) => {
  // La ronda terminó y se va a Resultados: no hay nada que confirmar.
  if (terminada.current) {
    navigation.dispatch(data.action);
    return;
  }

  Alert.alert(
    "¿Salir del quiz?",
    "Si sales ahora, perderás el progreso de esta ronda.",
    [
      { text: "Seguir jugando", style: "cancel" },
      {
        text: "Salir",
        style: "destructive",
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
    if (resultadoAcertijo && !resultadoAcertijo.acierto) {
      const especie = getSharkById(acertijo.sharkId);
      const foto = especie?.imagenes?.[0];

      return (
        <ScrollView contentContainerStyle={styles.scrollFallo}>
          <View style={styles.bloqueFallo}>
            <Text style={styles.etiquetaAcertijo}>Acertijo</Text>
            <Text style={styles.tituloFallo}>No acertaste en esta ocasión</Text>
            {foto ? (
              <Image
                source={imagenPorIdentificador(foto)}
                style={styles.fotoFallo}
                resizeMode="cover"
              />
            ) : null}
            <Text style={styles.nombreEspecie}>{resultadoAcertijo.nombre}</Text>
            <Text style={styles.textoFallo}>
              Esta era la especie. Puedes volver a intentarlo cuando aparezca de nuevo el acertijo.
            </Text>
            <Pressable
              style={({ pressed }) => [
                styles.botonSiguiente,
                pressed && styles.botonPresionado,
              ]}
              onPress={cerrarAcertijo}
            >
              <Text style={styles.textoBotonSiguiente}>Continuar</Text>
            </Pressable>
          </View>
        </ScrollView>
      );
    }

    if (resultadoAcertijo) {
      return (
        <View style={styles.container}>
          <Text style={styles.tituloAcertijo}>¡Correcto!</Text>
          <Text style={styles.texto}>
            {`Desbloqueaste a ${resultadoAcertijo.nombre} en el catálogo.`}
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
        behavior={Platform.OS === "ios" ? "padding" : "height"}
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
      <Text style={styles.progreso}>
        Pregunta {indice + 1} de {quiz.length}
      </Text>

      <TarjetaPregunta
        key={pregunta.id}
        enunciado={pregunta.enunciado}
        habilitada={!respondida}
        reducirMovimiento={reducirMovimiento}
        onElegir={responder}
      />

      {!respondida && (
        <View style={styles.bloqueRespuestas}>
          <Text style={styles.pista}>Desliza la tarjeta o elige una opción</Text>
          <View style={styles.filaRespuestas}>
            <Pressable
              style={({ pressed }) => [
                styles.botonMito,
                pressed && styles.botonPresionado,
              ]}
              onPress={() => responder("mito")}
            >
              <Text style={styles.textoBotonRespuesta}>Mito</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.botonRealidad,
                pressed && styles.botonPresionado,
              ]}
              onPress={() => responder("realidad")}
            >
              <Text style={styles.textoBotonRespuesta}>Realidad</Text>
            </Pressable>
          </View>
        </View>
      )}

      {respondida && (
        <View style={styles.bloqueRespuestas}>
          <Text
            style={[
              styles.resultado,
              respuestas[indice].acierto ? styles.resultadoCorrecto : styles.resultadoIncorrecto,
            ]}
          >
            {respuestas[indice].acierto ? "¡Correcto!" : "Incorrecto"}
          </Text>
          <View style={styles.tarjetaExplicacion}>
            <Text style={styles.explicacion}>{pregunta.explicacion}</Text>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.botonSiguiente,
              pressed && styles.botonPresionado,
            ]}
            onPress={avanzar}
          >
            <Text style={styles.textoBotonSiguiente}>
              {esUltima ? "Ver resultados" : "Siguiente"}
            </Text>
          </Pressable>
        </View>
      )}

      <Pressable
        style={({ pressed }) => [styles.botonVolver, pressed && styles.botonPresionado]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.textoVolver}>Volver al catálogo</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a2540",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  scrollFallo: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#0a2540',
    padding: 16,
  },
  bloqueFallo: {
    width: "100%",
    alignItems: "center",
    gap: 14,
  },
  etiquetaAcertijo: {
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 1,
  },
  tituloFallo: {
    color: "#fc8181",
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
  },
  fotoFallo: {
    width: "100%",
    height: 200,
    borderRadius: 16,
  },
  nombreEspecie: {
    color: "#4fd1c5",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  textoFallo: {
    color: "#cbd5e0",
    fontSize: 16,
    lineHeight: 22,
    textAlign: "center",
  },
  progreso: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "600",
  },
  bloqueRespuestas: {
    width: "100%",
    gap: 12,
    alignItems: "center",
  },
  filaRespuestas: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  botonMito: {
    flex: 1,
    backgroundColor: "#f6ad55",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  botonRealidad: {
    flex: 1,
    backgroundColor: "#4fd1c5",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  textoBotonRespuesta: {
    color: "#0a2540",
    fontSize: 18,
    fontWeight: "bold",
  },
  resultado: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
  },
  resultadoCorrecto: {
    color: "#68d391",
  },
  resultadoIncorrecto: {
    color: "#fc8181",
  },
  tarjetaExplicacion: {
    backgroundColor: "#163a5f",
    borderRadius: 14,
    padding: 16,
    width: "100%",
  },
  explicacion: {
    color: "#cbd5e0",
    fontSize: 16,
    lineHeight: 22,
  },
  botonSiguiente: {
    backgroundColor: "#4fd1c5",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    width: "100%",
  },
  textoBotonSiguiente: {
    color: "#0a2540",
    fontSize: 17,
    fontWeight: "bold",
  },
  botonVolver: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  textoVolver: {
    color: "#94a3b8",
    fontSize: 15,
    textDecorationLine: "underline",
  },
  texto: {
    color: "#cbd5e0",
    fontSize: 18,
     textAlign: "center",
  },
  tituloAcertijo: {
    color: "#4fd1c5",
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  boton: {
    backgroundColor: "#163a5f",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 16,
  },
  botonPresionado: {
    opacity: 0.7,
  },
  pista: {
    color: "#94a3b8",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
  },
  botonTexto: {
    color: "#4fd1c5",
    fontSize: 16,
    fontWeight: "bold",
  },
});
