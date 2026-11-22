import { Shark } from '../types/Shark';
import { normalizar } from './normalizar';

export interface FiltrosBusqueda {
  texto: string;
  soloConFoto: boolean;
  soloDesbloqueadas: boolean;
}

// Recibe la lista completa de especies, los filtros que eligió la usuaria
// y la lista de ids desbloqueados. Devuelve solo las especies que cumplen todo.
export function filtrarEspecies(
  especies: Shark[],
  filtros: FiltrosBusqueda,
  desbloqueadas: string[],
): Shark[] {
  // Paso 1: recortar el texto de búsqueda y normalizarlo (usa normalizar).
  // Si queda vacío, no filtra por texto.
  const textoBusqueda = normalizar(filtros.texto.trim());

  let resultado = especies;

  // Paso 2: quedarse con las especies cuyo nombre común o científico
  // contenga el texto normalizado.
  if (textoBusqueda !== '') {
    resultado = resultado.filter((shark) => {
      const nombreComun = normalizar(shark.nombre);
      const nombreCientifico = normalizar(shark.nombreCientifico);
      return (
        nombreComun.includes(textoBusqueda) ||
        nombreCientifico.includes(textoBusqueda)
      );
    });
  }

  // Paso 3: si soloConFoto está prendido, quedarse solo con las que tienen
  // al menos una foto (campo imagenes con elementos).
  if (filtros.soloConFoto) {
    resultado = resultado.filter((shark) => (shark.imagenes?.length ?? 0) > 0);
  }

  // Paso 4: si soloDesbloqueadas está prendido, quedarse solo con las especies
  // extintas cuyo id esté en desbloqueadas (ocultando las especies vivas).
  if (filtros.soloDesbloqueadas) {
    resultado = resultado.filter(
      (shark) => shark.extinta === true && desbloqueadas.includes(shark.id),
    );
  }

  // Paso 5: devolver la lista resultante.
  return resultado;
}