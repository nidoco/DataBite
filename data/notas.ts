import AsyncStorage from '@react-native-async-storage/async-storage';

const CLAVE_NOTAS = 'notas';

export type Notas = Record<string, string>;

// 1. Validador: debe ser un objeto (no null, no array) y todos sus valores string
function esNotas(valor: unknown): valor is Notas {
  if (typeof valor !== 'object' || valor === null || Array.isArray(valor)) {
    return false;
  }

  return Object.values(valor).every((item) => typeof item === 'string');
}

// 2. Lee las notas desde AsyncStorage; devuelve {} si no existen, fallan o no son válidas
export async function leerNotas(): Promise<Notas> {
  try {
    const dato = await AsyncStorage.getItem(CLAVE_NOTAS);
    if (dato === null) {
      return {};
    }

    const parsed: unknown = JSON.parse(dato);
    if (!esNotas(parsed)) {
      return {};
    }

    return parsed;
  } catch {
    return {};
  }
}

// 3. Guarda el objeto de notas en AsyncStorage; devuelve true si tuvo éxito, false si falló
export async function guardarNotas(notas: Notas): Promise<boolean> {
  try {
    await AsyncStorage.setItem(CLAVE_NOTAS, JSON.stringify(notas));
    return true;
  } catch {
    return false;
  }
}