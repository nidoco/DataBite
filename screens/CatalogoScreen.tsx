import {
  FlatList,
  Text,
  StyleSheet,
  Pressable,
  View,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SharkCard } from "../components/SharkCard";
import loadSharks from "../data/loadSharks";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { RootStackParamList, TabsParamList } from "../types/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { useProgreso } from "../data/progresoContext";
import { filtrarEspecies } from "../data/buscarEspecies";

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabsParamList, "Catalogo">,
  NativeStackScreenProps<RootStackParamList>
>;

export function CatalogoScreen({ navigation }: Props) {
  const { desbloqueadas, cargando } = useProgreso();

  const [texto, setTexto] = useState("");
  const [soloConFoto, setSoloConFoto] = useState(false);
  const [soloDesbloqueadas, setSoloDesbloqueadas] = useState(false);

  // 1. Estado para controlar cuántas especies mostrar
  const [cantidad, setCantidad] = useState(20);

  // 3. Volver a 20 al cambiar la búsqueda o los filtros
  useEffect(() => {
    setCantidad(20);
  }, [texto, soloConFoto, soloDesbloqueadas]);

  const especiesDisponibles = loadSharks().filter(
    (shark) =>
      !shark.extinta || (!cargando && desbloqueadas.includes(shark.id)),
  );

  const sharks = filtrarEspecies(
    especiesDisponibles,
    {
      texto,
      soloConFoto,
      soloDesbloqueadas,
    },
    cargando ? [] : desbloqueadas,
  );

  // 2. Cortar la lista
  const visible = sharks.slice(0, cantidad);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.encabezadoDerecha}>
          <Pressable onPress={() => navigation.navigate("Creditos")}>
            <Text style={styles.botonQuiz}>Créditos</Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate("Quiz")}>
            <Text style={styles.botonQuiz}>Quiz</Text>
          </Pressable>
        </View>
      ),
    });
  }, [navigation]);

  const hayBusqueda = texto.trim() !== "";

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <View style={styles.controlesContainer}>
        <TextInput
          style={styles.inputBusqueda}
          value={texto}
          onChangeText={setTexto}
          placeholder="Buscar por nombre común o científico..."
          placeholderTextColor="#94a3b8"
          maxLength={40}
          autoCorrect={false}
        />

        <View style={styles.filtrosRow}>
          <Pressable
            style={[styles.chipFiltro, soloConFoto && styles.chipFiltroActivo]}
            onPress={() => setSoloConFoto((prev) => !prev)}
          >
            <Text
              style={[styles.chipTexto, soloConFoto && styles.chipTextoActivo]}
            >
              Solo con foto
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.chipFiltro,
              soloDesbloqueadas && styles.chipFiltroActivo,
              cargando && styles.chipDeshabilitado,
            ]}
            onPress={() => setSoloDesbloqueadas((prev) => !prev)}
            disabled={cargando}
          >
            <Text
              style={[
                styles.chipTexto,
                soloDesbloqueadas && styles.chipTextoActivo,
              ]}
            >
              Solo desbloqueadas
            </Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SharkCard
            shark={item}
            onPress={() => navigation.navigate("Detalle", { id: item.id })}
          />
        )}
        onEndReached={() => setCantidad((c) => Math.min(c + 20, sharks.length))}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          cantidad < sharks.length ? (
            <Text style={styles.emptyText}>Cargando más...</Text>
          ) : undefined
        }
        ListEmptyComponent={
          hayBusqueda ? (
            <View style={styles.vacio}>
              <Text style={styles.emptyText}>
                Sin resultados para "{texto.trim()}"
              </Text>
              <Pressable style={styles.chipFiltro} onPress={() => setTexto("")}>
                <Text style={styles.chipTexto}>Limpiar búsqueda</Text>
              </Pressable>
            </View>
          ) : (
            <Text style={styles.emptyText}>Sin especies</Text>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a2540",
  },
  controlesContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 10,
  },
  inputBusqueda: {
    backgroundColor: "#13315c",
    color: "#ffffff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#1e4976",
  },
  filtrosRow: {
    flexDirection: "row",
    gap: 10,
  },
  chipFiltro: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#13315c",
    borderWidth: 1,
    borderColor: "#1e4976",
  },
  chipFiltroActivo: {
    backgroundColor: "#4fd1c5",
    borderColor: "#4fd1c5",
  },
  chipDeshabilitado: {
    opacity: 0.5,
  },
  chipTexto: {
    color: "#cbd5e0",
    fontSize: 13,
    fontWeight: "600",
  },
  chipTextoActivo: {
    color: "#0a2540",
    fontWeight: "bold",
  },
  vacio: {
    alignItems: "center",
    gap: 12,
    padding: 16,
  },
  emptyText: {
    textAlign: "center",
    padding: 16,
    marginTop: 20,
    fontSize: 16,
    color: "#cbd5e0",
  },
  encabezadoDerecha: {
    flexDirection: "row",
    gap: 16,
    marginRight: 8,
  },
  botonQuiz: {
    color: "#4fd1c5",
    fontSize: 16,
    fontWeight: "bold",
  },
});
