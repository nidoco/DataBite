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

const esGlobal = (e) => (e.scopes ?? []).some((s) => s.code === '1' || s.description?.en === 'Global');
const masRecientePrimero = (a, b) => Number(b.year_published) - Number(a.year_published);

// Una especie trae varias evaluaciones (de distintos años y regiones).
// Se usa la evaluación GLOBAL vigente (latest). Si la especie solo tiene evaluaciones
// globales antiguas (la UICN las marca como no vigentes), se usa la global más
// reciente, y estadoDe() avisa de que está desactualizada.
export function elegirEvaluacion(evaluaciones) {
  const globales = (evaluaciones ?? []).filter(esGlobal).sort(masRecientePrimero);
  return globales.find((e) => e.latest === true) ?? globales[0] ?? null;
}

// Devuelve { codigo, categoria, anio, desactualizada } o null si no hay ninguna
// evaluación global o si el código no está en la tabla (así no se inventa una categoría).
export function estadoDe(evaluaciones) {
  const e = elegirEvaluacion(evaluaciones);
  if (!e) return null;
  const categoria = CATEGORIAS[e.red_list_category_code];
  if (!categoria) return null;
  return {
    codigo: e.red_list_category_code,
    categoria,
    anio: Number(e.year_published),
    desactualizada: e.latest !== true,
  };
}
