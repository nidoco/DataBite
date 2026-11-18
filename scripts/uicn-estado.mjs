// Funciones para interpretar las respuestas de la API de la UICN.
// No hace peticiones: solo decide qué evaluación usar y cómo se llama su categoría.

// Códigos de la Lista Roja traducidos al español.
export const CATEGORIAS = {
  LC: 'Preocupación menor',
  NT: 'Casi amenazado',
  VU: 'Vulnerable',
  EN: 'En peligro',
  CR: 'En peligro crítico',
  DD: 'Datos insuficientes',
  EW: 'Extinta en estado silvestre',
  EX: 'Extinta',
};

// Una especie trae varias evaluaciones (de distintos años y regiones).
// Nos quedamos solo con la global y la más reciente. Si hay varias que cumplan,
// gana la de año de publicación más alto.
export function elegirEvaluacion(evaluaciones) {
  const globales = (evaluaciones ?? []).filter(
    (e) =>
      e.latest === true &&
      (e.scopes ?? []).some((s) => s.code === '1' || s.description?.en === 'Global'),
  );
  if (globales.length === 0) return null;
  globales.sort((a, b) => Number(b.year_published) - Number(a.year_published));
  return globales[0];
}

// Devuelve { codigo, categoria, anio } o null si no hay evaluación global vigente
// o si el código no está en la tabla (así no se inventa una categoría).
export function estadoDe(evaluaciones) {
  const e = elegirEvaluacion(evaluaciones);
  if (!e) return null;
  const categoria = CATEGORIAS[e.red_list_category_code];
  if (!categoria) return null;
  return {
    codigo: e.red_list_category_code,
    categoria,
    anio: Number(e.year_published),
  };
}
