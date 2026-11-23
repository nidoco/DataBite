import * as Location from "expo-location";
import { Ubicacion } from "./ubicaciones";

export type ResultadoUbicacion =
  | { ok: true; ubicacion: Ubicacion }
  | { ok: false; error: string };

// Pide el permiso y toma la ubicación actual. No lanza errores: devuelve ok: false con un
// mensaje que la pantalla puede mostrar.
export async function obtenerUbicacionActual(): Promise<ResultadoUbicacion> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      return {
        ok: false,
        error: "Permiso de ubicación denegado.",
      };
    }

    const posicion = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      ok: true,
      ubicacion: {
        latitud: posicion.coords.latitude,
        longitud: posicion.coords.longitude,
        fecha: new Date().toISOString(),
      },
    };
  } catch {
    return {
      ok: false,
      error: "No se pudo obtener la ubicación actual.",
    };
  }
}