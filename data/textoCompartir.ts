import { Shark } from '../types/Shark';

// Arma el texto para compartir una especie con los datos que tenga disponibles.
export function textoParaCompartir(shark: Shark): string {
  const nombre = shark.nombre.trim();
  const nombreCientifico = shark.nombreCientifico.trim();
  const partes: string[] = ['Mira esta especie:'];

  // Si el nombre común y el científico son iguales, se muestra solo uno.
  if (nombre.toLowerCase() === nombreCientifico.toLowerCase()) {
    partes.push(`${nombreCientifico}.`);
  } else {
    partes.push(`${nombre} (${nombreCientifico}).`);
  }

  // Cada dato se agrega solo si existe.
  if (shark.morfologia.longitudMetros !== undefined) {
    partes.push(`Mide hasta ${shark.morfologia.longitudMetros} m.`);
  }

  if (shark.habitat.trim() !== '') {
    partes.push(`Hábitat: ${shark.habitat.trim()}.`);
  }

  if (shark.alimentacion !== undefined) {
    partes.push(`Alimentación: ${shark.alimentacion.trim()}.`);
  }

  if (shark.estadoConservacion !== 'Datos insuficientes') {
    partes.push(`Estado de conservación: ${shark.estadoConservacion}.`);
  }

  partes.push('Vista en DataBite.');

  return partes.join(' ');
}
