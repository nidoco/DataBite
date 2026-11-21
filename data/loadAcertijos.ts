import acertijos from "./acertijos.json";
import { Acertijo } from "../types/Acertijo";
import loadSharks from "./loadSharks";

function esAcertijo(valor: unknown): valor is Acertijo {
  if (typeof valor !== "object" || valor === null) return false;
  const obj = valor as Record<string, unknown>;

  return (
    typeof obj.id === "string" &&
    typeof obj.enunciado === "string" &&
    typeof obj.sharkId === "string" &&
    Array.isArray(obj.respuestasAceptadas) &&
    obj.respuestasAceptadas.length > 0 &&
    obj.respuestasAceptadas.every((respuesta) => typeof respuesta === "string")
  );
}

export default function loadAcertijos(): Acertijo[] {
  const datos: unknown = acertijos;
  if (!Array.isArray(datos)) return [];

  // Solo sirven los acertijos cuyo sharkId es una especie extinta existente.
  const extintas = new Set(
    loadSharks()
      .filter((especie) => especie.extinta)
      .map((especie) => especie.id),
  );

  return datos
    .filter(esAcertijo)
    .filter((acertijo) => extintas.has(acertijo.sharkId));
}
