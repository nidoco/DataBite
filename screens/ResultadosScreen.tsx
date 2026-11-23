import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { Pregunta } from "../types/Pregunta";
import { getPreguntaPorId } from "../data/loadQuiz";

type Props = NativeStackScreenProps<RootStackParamList, "Resultados">;

export function ResultadosScreen({ route, navigation }: Props) {
  const { respuestas } = route.params;

  // Todo se calcula a partir de la lista de respuestas: no hay contadores aparte.
  const aciertos = respuestas.filter((r) => r.acierto).length;
  const falladas = respuestas.filter((r) => !r.acierto);

  // Recupera cada pregunta fallada por su id. Si ya no existe en el banco, se omite.
  const repaso = falladas
    .map((r) => getPreguntaPorId(r.id))
    .filter((p): p is Pregunta => p !== undefined);

  if (respuestas.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.texto}>No hay resultados que mostrar.</Text>
        <Pressable style={styles.boton} onPress={() => navigation.replace("Quiz")}>
          <Text style={styles.botonTexto}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.resumen}>
        Acertaste {aciertos} de {respuestas.length}
      </Text>

      {falladas.length === 0 ? (
        <Text style={styles.texto}>¡Respondiste todo bien!</Text>
      ) : (
        <FlatList
          style={styles.lista}
          data={repaso}
          keyExtractor={(pregunta) => pregunta.id}
          renderItem={({ item }) => (
            <View style={styles.tarjeta}>
              <Text style={styles.enunciado}>{item.enunciado}</Text>
              <Text style={styles.correcta}>Respuesta: {item.respuesta}</Text>
              <Text style={styles.texto}>{item.explicacion}</Text>
            </View>
          )}
        />
      )}

      <Pressable style={styles.boton} onPress={() => navigation.replace("Quiz")}>
        <Text style={styles.botonTexto}>Reintentar</Text>
      </Pressable>
      <Pressable style={styles.boton} onPress={() => navigation.popToTop()}>
        <Text style={styles.botonTexto}>Volver al catálogo</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a2540",
    padding: 16,
  },
  resumen: {
    color: "#4fd1c5",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 12,
  },
  texto: {
    color: "#cbd5e0",
    fontSize: 16,
    textAlign: "center",
  },
  lista: {
    flex: 1,
  },
  tarjeta: {
    backgroundColor: "#163a5f",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    gap: 6,
  },
  enunciado: {
    color: "#cbd5e0",
    fontSize: 16,
    fontWeight: "bold",
  },
  correcta: {
    color: "#4fd1c5",
    fontSize: 14,
    fontWeight: "bold",
  },
  boton: {
    backgroundColor: "#163a5f",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
  },
  botonTexto: {
    color: "#4fd1c5",
    fontSize: 16,
    fontWeight: "bold",
  },
});
