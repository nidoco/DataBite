import AsyncStorage from "@react-native-async-storage/async-storage";

function esListaDeTextos(valor: unknown): valor is string[] {
  return (
    Array.isArray(valor) && valor.every((item) => typeof item === "string")
  );
}
type Clave = "desbloqueadas" | "favoritas";

export async function leerLista(clave: Clave): Promise<string[]> {
  try {
    const valor = await AsyncStorage.getItem(clave);
    if (valor === null) return [];

    const parsed = JSON.parse(valor);

    if (esListaDeTextos(parsed)) {
      return parsed;
    }
  } catch {
    return [];
  }
  return [];
}

export async function guardarLista(
  clave: Clave,
  lista: string[],
): Promise<boolean> {
  try {
    const valor = JSON.stringify(lista);
    await AsyncStorage.setItem(clave, valor);
    return true;
  } catch {
    return false;
  }
}
