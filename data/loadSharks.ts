import sharks from './sharks.json';
import { Shark, Morfologia } from '../types/shark';

function esMorfologia(x: unknown): x is Morfologia {
    if (typeof x !== "object" || x === null) return false;
    const obj = x as Record<string, unknown>;

    return (
        typeof obj.longitudMetros === "number" &&
        typeof obj.pesoKg === "number" &&
        typeof obj.formaCuerpo === "string" &&
        typeof obj.rasgoDistintivo === "string"
  );
}
function esShark(x: unknown): x is Shark{
    if (typeof x !== "object" || x === null) return false;
    const obj = x as Record<string, unknown>;

    return (
        typeof obj.id === "string" &&
        typeof obj.nombre === "string" &&
        typeof obj.nombreCientifico === "string" &&
        typeof obj.estadoConservacion === "string" &&
        typeof obj.habitat === "string" &&
        typeof obj.alimentacion === "string" &&
        esMorfologia(obj.morfologia)
    )
}

export default function loadSharks(): Shark[] {
  const datos: unknown = sharks;
  if (!Array.isArray(datos)) return [];
  return datos.filter(esShark);
}
