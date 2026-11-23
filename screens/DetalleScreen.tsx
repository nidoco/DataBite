import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  FlatList,
  Image,
  useWindowDimensions,
  TextInput,
  type ScrollViewInstance,
  Keyboard,
  Alert,
  Share,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { getSharkById } from "../data/loadSharks";
import { imagenPorIdentificador } from "../data/imagenes";
import creditos from "../data/creditos.json";
import { SafeAreaView } from "react-native-safe-area-context";
import { DatoFicha } from "../components/DatoFicha";
import { useProgreso } from "../data/progresoContext";
import { textoParaCompartir } from "../data/textoCompartir";
import {
  formatearFecha,
  guardarUbicaciones,
  leerUbicaciones,
  Ubicaciones,
} from "../data/ubicaciones";
import { obtenerUbicacionActual } from "../data/obtenerUbicacion";


type Props = NativeStackScreenProps<RootStackParamList, "Detalle">;

export function DetalleScreen({ route, navigation }: Props) {
  const { id } = route.params;
  const shark = getSharkById(id);

  // Va antes del if: los hooks deben llamarse siempre en el mismo orden.
  const { width } = useWindowDimensions();
  const {
    favoritas,
    alternarFavorita,
    notas,
    cargando,
    guardarNota,
    borrarNota,
  } = useProgreso();
  const scrollRef = useRef<ScrollViewInstance>(null);

  // Altura del teclado: se usa como espacio extra al final de la ficha, para poder bajar
  // hasta el campo de la nota aunque el teclado lo cubra.
  const [alturaTeclado, setAlturaTeclado] = useState(0);

  useEffect(() => {
    const alMostrar = Keyboard.addListener("keyboardDidShow", (evento) => {
      setAlturaTeclado(evento.endCoordinates.height);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    });
    const alOcultar = Keyboard.addListener("keyboardDidHide", () => {
      setAlturaTeclado(0);
    });
    return () => {
      alMostrar.remove();
      alOcultar.remove();
    };
  }, []);
  const [editando, setEditando] = useState(false);
  const [borrador, setBorrador] = useState("");
  const [errorNota, setErrorNota] = useState("");

  const anchoFoto = width * 0.8;
  const notaGuardada = notas[id];

  // Ubicaciones donde se vio cada especie. Se leen al abrir la ficha y se guardan en el teléfono.
  const [ubicaciones, setUbicaciones] = useState<Ubicaciones>({});
  const [buscandoUbicacion, setBuscandoUbicacion] = useState(false);
  const [errorUbicacion, setErrorUbicacion] = useState("");
  const ubicacion = ubicaciones[id];

  useEffect(() => {
    leerUbicaciones().then(setUbicaciones);
  }, []);

  // Pide el permiso, toma la posición actual y la guarda junto a la especie.
  // Si algo falla, muestra el mensaje y no guarda nada.
  const guardarUbicacionNota = async () => {
    setBuscandoUbicacion(true);
    setErrorUbicacion("");

    const resultado = await obtenerUbicacionActual();
    if (resultado.ok) {
      const nuevas = { ...ubicaciones, [id]: resultado.ubicacion };
      setUbicaciones(nuevas);
      await guardarUbicaciones(nuevas);
    } else {
      setErrorUbicacion(resultado.error);
    }

    setBuscandoUbicacion(false);
  };

  // Quita solo la ubicación de esta especie. La nota se queda como está.
  const quitarUbicacion = async () => {
    const { [id]: _quitada, ...resto } = ubicaciones;
    setUbicaciones(resto);
    await guardarUbicaciones(resto);
  };

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

  // Al editar, el campo empieza con la nota actual, para que la usuaria solo cambie lo que quiera.
  const abrirFormulario = () => {
    setBorrador(notaGuardada ?? "");
    setErrorNota("");
    setEditando(true);
  };

  // Una nota vacía no se guarda: se muestra el mensaje y el texto escrito se conserva para corregirlo.
  const manejarGuardar = () => {
    if (borrador.trim() === "") {
      setErrorNota("La nota no puede estar vacía");
      return;
    }
    setErrorNota("");
    guardarNota(id, borrador);
    setEditando(false);
  };

  const manejarCancelar = () => {
    setBorrador(notaGuardada ?? "");
    setErrorNota("");
    setEditando(false);
  };
  // Pide confirmación antes de borrar la nota, porque no se puede deshacer.
  const confirmarBorrado = () => {
    Alert.alert(
      "Borrar nota",
      "¿Estás segura de que quieres eliminar esta nota?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Borrar",
          style: "destructive",
          onPress: () => borrarNota(id),
        },
      ],
    );
  };
  const manejarCompartir = async () => {
    try {
      await Share.share({
        message: textoParaCompartir(shark),
      });
    } catch (error) {
      console.error("Error al compartir:", error);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container} edges={["left", "right"]}>
        <ScrollView
          ref={scrollRef}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.contenido,
            { paddingBottom: 16 + alturaTeclado },
          ]}
        >
          <View style={styles.encabezado}>
            <Text style={styles.nombre}>{shark.nombre}</Text>
            <Text style={styles.nombreCientifico}>
              {shark.nombreCientifico}
            </Text>

            <View style={styles.filaChips}>
              <View style={styles.estado}>
                <Text style={styles.estadoTexto}>
                  {shark.estadoConservacion}
                </Text>
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

              <Pressable
                style={({ pressed }) => [
                  styles.botonFavorito,
                  pressed && styles.botonPresionado,
                ]}
                onPress={manejarCompartir}
              >
                <Text style={styles.estadoTexto}>Compartir</Text>
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
                  {item ? (
                    <Image
                      source={imagenPorIdentificador(item)}
                      style={[
                        styles.foto,
                        { width: anchoFoto, height: anchoFoto * 0.66 },
                      ]}
                      resizeMode="cover"
                    />
                  ) : (
                    <View
                      style={[
                        styles.foto,
                        styles.sinFoto,
                        { width: anchoFoto, height: anchoFoto * 0.66 },
                      ]}
                    >
                      <Text style={styles.textoSinFoto}>Sin foto</Text>
                    </View>
                  )}
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

          <View style={styles.tarjeta}>
            <Text style={styles.seccion}>Mis notas</Text>

            {editando ? (
              <View style={styles.formularioNota}>
                <TextInput
                  style={styles.inputNota}
                  value={borrador}
                  onChangeText={(texto) => {
                    setBorrador(texto);
                    if (errorNota) setErrorNota("");
                  }}
                  placeholder="Escribe tus observaciones sobre esta especie..."
                  placeholderTextColor="#94a3b8"
                  maxLength={280}
                  multiline
                  autoFocus
                />
                {errorNota ? (
                  <Text style={styles.errorNota}>{errorNota}</Text>
                ) : null}
                <Text style={styles.contadorCaracteres}>
                  {borrador.length}/280
                </Text>
                <View style={styles.filaBotonesNota}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.botonAgregarNota,
                      pressed && styles.botonPresionado,
                    ]}
                    onPress={manejarGuardar}
                  >
                    <Text style={styles.textoBotonNota}>Guardar</Text>
                  </Pressable>

                  <Pressable
                    style={({ pressed }) => [
                      styles.botonCancelarNota,
                      pressed && styles.botonPresionado,
                    ]}
                    onPress={manejarCancelar}
                  >
                    <Text style={styles.textoBotonCancelar}>Cancelar</Text>
                  </Pressable>
                </View>
              </View>
            ) : notaGuardada ? (
              <View style={styles.formularioNota}>
                <Text style={styles.textoNota}>{notaGuardada}</Text>
                <View style={styles.filaBotonesNota}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.botonCancelarNota,
                      pressed && styles.botonPresionado,
                    ]}
                    onPress={abrirFormulario}
                  >
                    <Text style={styles.textoBotonCancelar}>Editar</Text>
                  </Pressable>

                  <Pressable
                    style={({ pressed }) => [
                      styles.botonBorrarNota,
                      pressed && styles.botonPresionado,
                    ]}
                    onPress={confirmarBorrado}
                  >
                    <Text style={styles.textoBotonBorrar}>Borrar</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <Pressable
                style={({ pressed }) => [
                  styles.botonAgregarNota,
                  cargando && styles.botonDeshabilitado,
                  pressed && styles.botonPresionado,
                ]}
                onPress={abrirFormulario}
                disabled={cargando}
              >
                <Text style={styles.textoBotonNota}>Agregar nota</Text>
              </Pressable>
            )}

            {notaGuardada && (
              <View style={styles.bloqueUbicacion}>
                {ubicacion ? (
                  <>
                    <Text style={styles.textoUbicacion}>
                      Vista en {ubicacion.latitud.toFixed(4)},{" "}
                      {ubicacion.longitud.toFixed(4)} ·{" "}
                      {formatearFecha(ubicacion.fecha)}
                    </Text>
                    <Pressable
                      style={({ pressed }) => [
                        styles.botonCancelarNota,
                        pressed && styles.botonPresionado,
                      ]}
                      onPress={quitarUbicacion}
                    >
                      <Text style={styles.textoBotonCancelar}>
                        Quitar ubicación
                      </Text>
                    </Pressable>
                  </>
                ) : (
                  <Pressable
                    style={({ pressed }) => [
                      styles.botonAgregarNota,
                      buscandoUbicacion && styles.botonDeshabilitado,
                      pressed && styles.botonPresionado,
                    ]}
                    onPress={guardarUbicacionNota}
                    disabled={buscandoUbicacion}
                  >
                    <Text style={styles.textoBotonNota}>
                      {buscandoUbicacion
                        ? "Buscando ubicación..."
                        : "Guardar dónde la viste"}
                    </Text>
                  </Pressable>
                )}
                {errorUbicacion ? (
                  <Text style={styles.errorNota}>{errorUbicacion}</Text>
                ) : null}
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
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
  sinFoto: {
    backgroundColor: "#163a5f",
    alignItems: "center",
    justifyContent: "center",
  },
  textoSinFoto: {
    color: "#94a3b8",
    fontSize: 16,
    fontWeight: "600",
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
  bloqueUbicacion: {
    gap: 8,
    marginTop: 8,
  },
  textoUbicacion: {
    color: "#cbd5e0",
    fontSize: 14,
  },
  textoNota: {
    color: "#cbd5e0",
    fontSize: 16,
    lineHeight: 22,
  },
  formularioNota: {
    gap: 10,
  },
  inputNota: {
    backgroundColor: "#0a2540",
    color: "#ffffff",
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    minHeight: 90,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#1e4976",
  },
  contadorCaracteres: {
    color: "#94a3b8",
    fontSize: 12,
    textAlign: "right",
  },
  filaBotonesNota: {
    flexDirection: "row",
    gap: 10,
  },
  botonAgregarNota: {
    backgroundColor: "#4fd1c5",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    alignSelf: "flex-start",
  },
  botonCancelarNota: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#4fd1c5",
    alignItems: "center",
  },
  botonDeshabilitado: {
    opacity: 0.5,
  },
  textoBotonNota: {
    color: "#0a2540",
    fontSize: 15,
    fontWeight: "bold",
  },
  botonBorrarNota: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fc8181",
    alignItems: "center",
  },
  textoBotonBorrar: {
    color: "#fc8181",
    fontSize: 15,
    fontWeight: "bold",
  },
  textoBotonCancelar: {
    color: "#4fd1c5",
    fontSize: 15,
    fontWeight: "bold",
  },
  texto: {
    color: "#cbd5e0",
    fontSize: 18,
  },
  errorNota: {
    color: "#fc8181",
    fontSize: 13,
    fontWeight: "600",
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
