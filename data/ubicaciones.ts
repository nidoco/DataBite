import AsyncStorage from "@react-native-async-storage/async-storage";

const CLAVE_UBICACIONES = "ubicaciones";

export interface Ubicacion {
  latitud: number;
  longitud: number;
  fecha: string;
}

export type Ubicaciones = Record<string, Ubicacion>;

function esUbicacionValida(valor: unknown): valor is Ubicacion {
  if (typeof valor !== "object" || valor === null || Array.isArray(valor)) {
    return false;
  }

  const { latitud, longitud, fecha } = valor as Record<string, unknown>;

  return (
    typeof latitud === "number" &&
    Number.isFinite(latitud) &&
    latitud >= -90 &&
    latitud <= 90 &&
    typeof longitud === "number" &&
    Number.isFinite(longitud) &&
    longitud >= -180 &&
    longitud <= 180 &&
    typeof fecha === "string"
  );
}

// 1. Validador: debe ser un objeto (no null, no array) y cada valor una Ubicacion válida
function esUbicaciones(valor: unknown): valor is Ubicaciones {
  if (typeof valor !== "object" || valor === null || Array.isArray(valor)) {
    return false;
  }

  return Object.values(valor).every((item) => esUbicacionValida(item));
}

// 2. Lee las ubicaciones desde AsyncStorage; devuelve {} si no existen, fallan o no son válidas
export async function leerUbicaciones(): Promise<Ubicaciones> {
  try {
    const dato = await AsyncStorage.getItem(CLAVE_UBICACIONES);
    if (dato === null) {
      return {};
    }

    const parsed: unknown = JSON.parse(dato);
    if (!esUbicaciones(parsed)) {
      return {};
    }

    return parsed;
  } catch {
    return {};
  }
}

// 3. Guarda el objeto de ubicaciones en AsyncStorage; devuelve true si tuvo éxito, false si falló
export async function guardarUbicaciones(
  ubicaciones: Ubicaciones,
): Promise<boolean> {
  try {
    await AsyncStorage.setItem(CLAVE_UBICACIONES, JSON.stringify(ubicaciones));
    return true;
  } catch {
    return false;
  }
}

// Convierte la fecha guardada (formato ISO) a un formato legible: dd/mm/aaaa.
export function formatearFecha(fechaIso: string): string {
  const fecha = new Date(fechaIso);
  if (Number.isNaN(fecha.getTime())) {
    return 'Fecha desconocida';
  }

  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  return `${dia}/${mes}/${fecha.getFullYear()}`;
}
