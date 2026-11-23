import sharks from "./sharks.json";
import { Shark, Morfologia } from "../types/Shark";

function esMorfologia(valor: unknown): valor is Morfologia {
    if (typeof valor !== "object" || valor === null) return false;
    const obj = valor as Record<string, unknown>;

    return (
        (typeof obj.longitudMetros === "number" || obj.longitudMetros === undefined) &&
        (typeof obj.pesoKg === "number" || obj.pesoKg === undefined) &&
        typeof obj.formaCuerpo === "string" &&
        (typeof obj.rasgoDistintivo === "string" || obj.rasgoDistintivo === undefined)
  );
}
function esShark(valor: unknown): valor is Shark{
    if (typeof valor !== "object" || valor === null) return false;
    const obj = valor as Record<string, unknown>;

    return (
        typeof obj.id === "string" &&
        typeof obj.nombre === "string" &&
        typeof obj.nombreCientifico === "string" &&
        typeof obj.estadoConservacion === "string" &&
        typeof obj.habitat === "string" &&
        (typeof obj.alimentacion === "string" || obj.alimentacion === undefined) &&
        (obj.imagenes === undefined || (Array.isArray(obj.imagenes) && obj.imagenes.every((i) => typeof i === "string"))) &&
        esMorfologia(obj.morfologia) &&
        (obj.extinta === undefined || typeof obj.extinta === "boolean")
    )
}

export default function loadSharks(): Shark[] {
  const datos: unknown = sharks;
  if (!Array.isArray(datos)) return [];
  return datos.filter(esShark);
}
export function getSharkById(id: string): Shark | undefined {
  // 1. obtén el array validado con loadSharks()
  const especies = loadSharks();
  // 2. devuelve el tiburón cuyo id coincida con el parámetro, usando .find()
  return especies.find((shark) => shark.id === id);
}
