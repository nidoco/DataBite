import { View, Text, StyleSheet, Pressable, ScrollView, FlatList, Image, useWindowDimensions,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { getSharkById } from "../data/loadSharks";
import { imagenPorIdentificador } from "../data/imagenes";
import creditos from "../data/creditos.json";
import { SafeAreaView } from "react-native-safe-area-context";
import { DatoFicha } from "../components/DatoFicha";
import { useProgreso } from "../data/progresoContext";

type Props = NativeStackScreenProps<RootStackParamList, "Detalle">;
export function DetalleScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const shark = getSharkById(id);
  // Va antes del if: los hooks deben llamarse siempre en el mismo orden.
  const { width } = useWindowDimensions();
  const { favoritas, alternarFavorita } = useProgreso();
  const anchoFoto = width * 0.8;

  if (!shark) {
    return (
      <View style={[styles.container, styles.centrado]}>
        <Text style={styles.texto}>Especie no encontrada</Text>
        <Pressable
          style={({ pressed }) => [
            styles.boton,
            pressed && styles.botonPresionado,
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.botonTexto}>Volver</Text>
        </Pressable>
      </View>
    );
  }
  const esFavorita = favoritas.includes(id);

  // Sin fotos, la galería muestra un solo placeholder en vez de quedar vacía.
  const fotos = shark.imagenes?.length ? shark.imagenes : [undefined];

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <ScrollView contentContainerStyle={styles.contenido}>
        <View style={styles.encabezado}>
          <Text style={styles.nombre}>{shark.nombre}</Text>
          <Text style={styles.nombreCientifico}>{shark.nombreCientifico}</Text>

          <View style={styles.filaChips}>
            <View style={styles.estado}>
              <Text style={styles.estadoTexto}>{shark.estadoConservacion}</Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.botonFavorito,
                esFavorita && styles.botonFavoritoActivo,
                pressed && styles.botonPresionado,
              ]}
              onPress={() => alternarFavorita(id)}
            >
              <Text
                style={[
                  styles.estadoTexto,
                  esFavorita && styles.textoFavoritoActivo,
                ]}
              >
                {esFavorita ? "★ Favorita" : "☆ Agregar a favoritas"}
              </Text>
            </Pressable>
          </View>
        </View>

        <FlatList
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          data={fotos}
          keyExtractor={(item, indice) => item ?? `sin-foto-${indice}`}
          ItemSeparatorComponent={() => <View style={styles.separador} />}
          renderItem={({ item }) => {
            const credito = creditos.find((c) => c.identificador === item);
            return (
              <View style={{ width: anchoFoto }}>
                <Image
                  source={imagenPorIdentificador(item)}
                  style={[
                    styles.foto,
                    { width: anchoFoto, height: anchoFoto * 0.66 },
                  ]}
                  resizeMode="cover"
                />
                {credito && (
                  <Text style={styles.credito}>
                    Foto: {credito.autor} · {credito.licencia}
                  </Text>
                )}
              </View>
            );
          }}
        />

        <View style={styles.tarjeta}>
          <Text style={styles.seccion}>Morfología</Text>
          <DatoFicha
            etiqueta="Longitud"
            valor={
              shark.morfologia.longitudMetros !== undefined
                ? `${shark.morfologia.longitudMetros} m`
                : "No disponible"
            }
          />
          <DatoFicha
            etiqueta="Peso"
            valor={
              shark.morfologia.pesoKg !== undefined
                ? `${shark.morfologia.pesoKg} kg`
                : "No disponible"
            }
          />
          <DatoFicha
            etiqueta="Forma del cuerpo"
            valor={shark.morfologia.formaCuerpo}
          />
          <DatoFicha
            etiqueta="Rasgo distintivo"
            valor={
              shark.morfologia.rasgoDistintivo !== undefined
                ? shark.morfologia.rasgoDistintivo
                : "No disponible"
            }
          />
        </View>

        <View style={styles.tarjeta}>
          <Text style={styles.seccion}>Hábitat y alimentación</Text>
          <DatoFicha etiqueta="Hábitat" valor={shark.habitat} />
          <DatoFicha
            etiqueta="Alimentación"
            valor={
              shark.alimentacion !== undefined
                ? shark.alimentacion
                : "No disponible"
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a2540",
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
    color: "#4fd1c5",
    fontSize: 28,
    fontWeight: "bold",
  },
  nombreCientifico: {
    color: "#cbd5e0",
    fontSize: 18,
    fontStyle: "italic",
  },
  filaChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  estado: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#4fd1c5",
  },
  estadoTexto: {
    color: "#4fd1c5",
    fontSize: 14,
  },
  botonFavorito: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#4fd1c5",
  },
  botonFavoritoActivo: {
    backgroundColor: "#4fd1c5",
  },
  textoFavoritoActivo: {
    color: "#0a2540",
    fontWeight: "bold",
  },
  separador: {
    width: 12,
  },
  foto: {
    borderRadius: 16,
  },
  credito: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 6,
  },
  tarjeta: {
    backgroundColor: "#163a5f",
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  seccion: {
    color: "#4fd1c5",
    fontSize: 18,
    fontWeight: "bold",
  },
  texto: {
    color: "#cbd5e0",
    fontSize: 18,
  },
  centrado: {
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    padding: 16,
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
  botonTexto: {
    color: "#4fd1c5",
    fontSize: 16,
    fontWeight: "bold",
  },
});
