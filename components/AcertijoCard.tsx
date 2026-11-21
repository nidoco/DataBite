import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { Acertijo } from "../types/Acertijo";

export function AcertijoCard({
  acertijo,
  onAcierto,
  onAgotado,
}: {
  acertijo: Acertijo;
  onAcierto: (sharkId: string) => void;
  onAgotado: () => void;
}) {
  const normalizar = (texto: string) => {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  };
  const [respuesta, setRespuesta] = useState("");
  const [intentosFallidos, setIntentosFallidos] = useState(0);
  const [mensajeError, setMensajeError] = useState("");

  const handleEnviar = () => {
    const textoNormalizado = normalizar(respuesta);
    if (!textoNormalizado) return;

    const esCorrecta = acertijo.respuestasAceptadas.some(
      (opcion) => normalizar(opcion) === textoNormalizado,
    );

    if (esCorrecta) {
      setMensajeError("");
      onAcierto(acertijo.sharkId);
    } else {
      const nuevosIntentos = intentosFallidos + 1;
      setIntentosFallidos(nuevosIntentos);

      if (nuevosIntentos >= 3) {
        onAgotado();
      } else {
        setRespuesta("");
        setMensajeError("No es esa");
      }
    }
  };

  return (
    <View>
      <Text style={styles.titulo}>Acertijo de una especie oculta</Text>
      <Text style={styles.ayuda}>Adivina de qué especie se trata para desbloquearla. Tienes 3 intentos.</Text>
      <Text style={styles.intentos}>Intento {intentosFallidos + 1} de 3</Text>

      <Text style={styles.enunciado}>{acertijo.enunciado}</Text>

      <TextInput
        style={styles.input}
        value={respuesta}
        onChangeText={setRespuesta}
        placeholder="Escribe el nombre del tiburón..."
        placeholderTextColor="#94a3b8"
        onSubmitEditing={handleEnviar}
      />

      {mensajeError ? <Text style={styles.error}>{mensajeError}</Text> : null}

      <Pressable
        style={[
          styles.boton,
          respuesta.trim() === "" && styles.botonDeshabilitado,
        ]}
        onPress={handleEnviar}
        disabled={respuesta.trim() === ""}
      >
        <Text style={styles.textoBoton}>Responder</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4fd1c5",
    textAlign: "center",
  },
  ayuda: {
    fontSize: 15,
    color: "#cbd5e0",
    textAlign: "center",
    marginTop: 6,
  },
  intentos: {
    fontSize: 14,
    fontWeight: "600",
    color: "#94a3b8",
  },
  enunciado: {
    fontSize: 18,
    lineHeight: 26,
    color: "#cbd5e0",
    marginTop: 8,
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#163a5f",
    borderWidth: 1,
    borderColor: "#4fd1c5",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#fff",
  },
  error: {
    color: "#f87171",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 8,
  },
  boton: {
    backgroundColor: "#4fd1c5",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  botonDeshabilitado: {
    backgroundColor: "#334155",
  },
  textoBoton: {
    color: "#0a2540",
    fontWeight: "bold",
    fontSize: 16,
  },
});
