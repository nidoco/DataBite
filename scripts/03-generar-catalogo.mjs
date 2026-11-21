// Paso 3: combina Wikidata (lista), la UICN (estado) y FishBase (medidas y nombres),
// aplica la definición de "datos completos" de la spec F07 y genera:
//   - scripts/informe-cobertura.md        (qué entró, qué no y por qué)
//   - scripts/cache/sharks.generado.json  (el catálogo candidato)
//
// No toca data/sharks.json salvo que se pida con --escribir.
//
// Uso:
//   node scripts/03-generar-catalogo.mjs              (solo informe y candidato)
//   node scripts/03-generar-catalogo.mjs --escribir   (además, reemplaza data/sharks.json)
//
// Fuentes: Wikidata (CC0), FishBase v26.06 (CC BY-NC), UICN Lista Roja.

import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { parquetReadObjects } from 'hyparquet';
import { compressors } from 'hyparquet-compressors';
import { estadoDe } from './uicn-estado.mjs';
import * as equivalencias from './equivalencias.ts';

const { formaCuerpo, zonaHabitat } = equivalencias;
// La tabla de presas se agrega a equivalencias.ts; mientras no exista, no se genera alimentación.
const presas = equivalencias.presas ?? {};

// ---------- utilidades ----------

const quitarAcentos = (t) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const normalizar = (t) => quitarAcentos(t).toLowerCase().trim();
const slug = (t) => normalizar(t).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const tieneAcento = (t) => t !== quitarAcentos(t);
const archivoUicn = (sci) => `scripts/cache/uicn/${sci.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.json`;

async function leerTabla(nombre) {
  const ruta = `scripts/cache/fishbase/${nombre}.parquet`;
  if (!existsSync(ruta)) {
    console.error(`Falta ${ruta}. Corre antes: node scripts/00-descargar-fishbase.mjs`);
    process.exit(1);
  }
  const b = readFileSync(ruta);
  return parquetReadObjects({
    file: b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength),
    compressors,
  });
}

// ---------- regla para elegir el nombre en español ----------
// FishBase trae varios nombres por especie y ninguno viene marcado como preferido.
// Regla: gana el nombre que más veces aparece (sin distinguir mayúsculas ni acentos).
// En un empate gana el de mejor fuente: FAO > AFS > popular > FAO antiguo.
// El nombre genérico "Tiburón" a secas se descarta.

const PESO_FUENTE = { FAO: 4, AFS: 3, Vernacular: 2, 'FAO old': 1 };

function capitalizar(texto) {
  const base = texto === texto.toUpperCase() && texto.length > 3 ? texto.toLowerCase() : texto;
  return base.charAt(0).toUpperCase() + base.slice(1);
}

function elegirNombre(filas) {
  const grupos = new Map();
  for (const f of filas ?? []) {
    const texto = String(f.ComName ?? '').trim();
    const clave = normalizar(texto);
    if (!texto || clave === 'tiburon') continue;
    const g = grupos.get(clave) ?? { veces: 0, fuente: 0, variantes: new Map() };
    g.veces++;
    g.fuente = Math.max(g.fuente, PESO_FUENTE[f.NameType] ?? 0);
    g.variantes.set(texto, (g.variantes.get(texto) ?? 0) + 1);
    grupos.set(clave, g);
  }
  if (grupos.size === 0) return null;
  const mejor = [...grupos.values()].sort((a, b) => b.veces - a.veces || b.fuente - a.fuente)[0];
  const variante = [...mejor.variantes.entries()].sort(
    (a, b) => b[1] - a[1] || Number(tieneAcento(b[0])) - Number(tieneAcento(a[0])),
  )[0][0];
  return capitalizar(variante);
}

// ---------- alimentación a partir de las presas registradas en FishBase ----------
// FishBase guarda, por cada estudio de dieta, el grupo de presa (columna FoodII, 21 valores).
// Por especie se cuentan los registros de cada grupo y se usan hasta 3 grupos que
// representen al menos el 15 % de los registros. Basta con un registro: aunque la
// evidencia sea poca, es información real de FishBase y es mejor que dejar el campo vacío.
// Solo las especies sin ningún registro muestran "No disponible".

const MIN_REGISTROS = 1;
const MIN_PARTE = 0.15;
const MAX_GRUPOS = 3;
const presasSinTraducir = new Set();

function unir(partes) {
  if (partes.length <= 1) return partes.join('');
  return `${partes.slice(0, -1).join(', ')} y ${partes[partes.length - 1]}`;
}

function textoAlimentacion(filas) {
  const validas = (filas ?? []).filter((f) => f.FoodII && normalizar(String(f.FoodII)) !== 'others');
  if (validas.length < MIN_REGISTROS) return undefined;

  const cuenta = new Map();
  for (const f of validas) {
    const grupo = normalizar(String(f.FoodII));
    cuenta.set(grupo, (cuenta.get(grupo) ?? 0) + 1);
  }

  const frases = [];
  for (const [grupo, n] of [...cuenta].sort((a, b) => b[1] - a[1])) {
    if (n / validas.length < MIN_PARTE || frases.length >= MAX_GRUPOS) break;
    const traduccion = presas[grupo];
    if (traduccion === undefined) {
      presasSinTraducir.add(grupo);
      continue;
    }
    frases.push(traduccion);
  }
  return frases.length > 0 ? capitalizar(unir(frases)) : undefined;
}

// ---------- la misma comprobación que hace loadSharks en la app ----------
// (Está duplicada aquí porque la app la escribe en TypeScript. Si cambias una, cambia la otra.)

const esTexto = (v) => typeof v === 'string';
const opcionalTexto = (v) => esTexto(v) || v === undefined;
const opcionalNumero = (v) => typeof v === 'number' || v === undefined;

function esMorfologia(m) {
  return (
    typeof m === 'object' && m !== null &&
    opcionalNumero(m.longitudMetros) &&
    opcionalNumero(m.pesoKg) &&
    esTexto(m.formaCuerpo) &&
    opcionalTexto(m.rasgoDistintivo)
  );
}

function esShark(s) {
  return (
    typeof s === 'object' && s !== null &&
    esTexto(s.id) && esTexto(s.nombre) && esTexto(s.nombreCientifico) &&
    esTexto(s.estadoConservacion) && esTexto(s.habitat) &&
    opcionalTexto(s.alimentacion) &&
    (s.imagenes === undefined || (Array.isArray(s.imagenes) && s.imagenes.every(esTexto))) &&
    esMorfologia(s.morfologia)
  );
}

// ---------- datos de entrada ----------

if (!existsSync('scripts/cache/lista.json')) {
  console.error('Falta scripts/cache/lista.json. Corre antes: node scripts/01-lista-wikidata.mjs');
  process.exit(1);
}
const lista = JSON.parse(readFileSync('scripts/cache/lista.json', 'utf8'));
// Fotos descargadas por scripts/04-descargar-imagenes.mjs (id de especie -> identificadores).
const indiceImagenes = existsSync('scripts/imagenes-indice.json')
  ? JSON.parse(readFileSync('scripts/imagenes-indice.json', 'utf8'))
  : {};

const manuales = existsSync('scripts/manual-especies.json')
  ? JSON.parse(readFileSync('scripts/manual-especies.json', 'utf8'))
  : [];
const manualPorSci = new Map(manuales.map((m) => [m.nombreCientifico, m]));

const especiesFb = new Map((await leerTabla('species')).map((s) => [Number(s.SpecCode), s]));

const idsLista = new Set(lista.map((e) => e.fishbase));
const nombresPorEspecie = new Map();
for (const c of await leerTabla('comnames')) {
  const k = Number(c.SpecCode);
  if (c.Language !== 'Spanish' || !idsLista.has(k)) continue;
  if (!nombresPorEspecie.has(k)) nombresPorEspecie.set(k, []);
  nombresPorEspecie.get(k).push(c);
}

const presasPorEspecie = new Map();
for (const r of await leerTabla('fooditems')) {
  const k = Number(r.SpecCode);
  if (!idsLista.has(k)) continue;
  if (!presasPorEspecie.has(k)) presasPorEspecie.set(k, []);
  presasPorEspecie.get(k).push(r);
}

// ---------- construcción del catálogo ----------

const incluidas = [];
const excluidas = []; // { sci, motivo }
const idsUsados = new Set();
const stats = {
  nombreEspanol: 0, nombreCientifico: 0, conPeso: 0, estadoAntiguo: 0,
  porIdUicn: 0, nombreDistinto: [], manuales: 0, conAlimentacion: 0, sinLongitud: 0,
};
const muestraNombres = [];

for (const e of lista) {
  const s = especiesFb.get(e.fishbase);
  if (!s) { excluidas.push({ sci: e.sci, motivo: 'No aparece en FishBase con su ID' }); continue; }

  const nombreCientifico = `${s.Genus} ${s.Species}`;
  if (nombreCientifico !== e.sci) stats.nombreDistinto.push(`${e.sci} → ${nombreCientifico}`);

  const archivo = archivoUicn(e.sci);
  const uicn = existsSync(archivo) ? JSON.parse(readFileSync(archivo, 'utf8')) : null;
  const estado = uicn ? estadoDe(uicn.evaluaciones) : null;
  if (!estado) { excluidas.push({ sci: nombreCientifico, motivo: 'Sin categoría de la UICN' }); continue; }

  // La longitud es opcional: si FishBase no la tiene, la ficha muestra "No disponible".
  const largoCm = Number(s.Length);
  const tieneLongitud = largoCm > 0;
  if (!tieneLongitud) stats.sinLongitud++;

  const forma = formaCuerpo[s.BodyShapeI];
  if (forma === undefined) { excluidas.push({ sci: nombreCientifico, motivo: `Forma del cuerpo sin traducción (${s.BodyShapeI ?? 'vacía'})` }); continue; }

  const habitat = zonaHabitat[s.DemersPelag];
  if (habitat === undefined) { excluidas.push({ sci: nombreCientifico, motivo: `Zona de hábitat sin traducción (${s.DemersPelag ?? 'vacía'})` }); continue; }

  let registro;
  if (manualPorSci.has(nombreCientifico)) {
    registro = manualPorSci.get(nombreCientifico); // tu versión escrita a mano manda
    stats.manuales++;
  } else {
    const elegido = elegirNombre(nombresPorEspecie.get(e.fishbase));
    const pesoG = Number(s.Weight);
    registro = {
      id: slug(nombreCientifico),
      nombre: elegido ?? nombreCientifico,
      nombreCientifico,
      estadoConservacion: estado.categoria,
      morfologia: {
        longitudMetros: tieneLongitud ? Math.round(largoCm) / 100 : undefined,
        pesoKg: pesoG > 0 ? Math.round(pesoG / 100) / 10 : undefined,
        formaCuerpo: forma,
      },
      habitat,
      alimentacion: textoAlimentacion(presasPorEspecie.get(e.fishbase)),
    };
    if (elegido) {
      stats.nombreEspanol++;
      if ((nombresPorEspecie.get(e.fishbase) ?? []).length >= 3 && muestraNombres.length < 14) {
        muestraNombres.push(`${nombreCientifico} → ${elegido}`);
      }
    } else {
      stats.nombreCientifico++;
    }
    if (registro.morfologia.pesoKg !== undefined) stats.conPeso++;
    if (registro.alimentacion !== undefined) stats.conAlimentacion++;
  }

  if (estado.desactualizada) stats.estadoAntiguo++;
  if (uicn?.porId) stats.porIdUicn++;

  const fotos = indiceImagenes[registro.id];
  if (fotos?.length) registro = { ...registro, imagenes: fotos };

  if (!esShark(registro)) { excluidas.push({ sci: nombreCientifico, motivo: 'No pasa la validación de la app' }); continue; }
  if (idsUsados.has(registro.id)) { excluidas.push({ sci: nombreCientifico, motivo: `Id repetido (${registro.id})` }); continue; }
  idsUsados.add(registro.id);
  incluidas.push(registro);
}

// Especies escritas a mano que no están en la lista de vivas (por ejemplo, las extintas).
const sciEnLista = new Set(lista.map((e) => e.sci));
for (const m of manuales) {
  if (sciEnLista.has(m.nombreCientifico)) continue;
  let registro = { ...m };
  const fotos = indiceImagenes[registro.id];
  if (fotos?.length) registro = { ...registro, imagenes: fotos };
  if (!esShark(registro)) { excluidas.push({ sci: m.nombreCientifico, motivo: 'Manual: no pasa la validación de la app' }); continue; }
  if (idsUsados.has(registro.id)) { excluidas.push({ sci: m.nombreCientifico, motivo: `Manual: id repetido (${registro.id})` }); continue; }
  idsUsados.add(registro.id);
  incluidas.push(registro);
}

incluidas.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

// ---------- salida ----------

writeFileSync('scripts/cache/sharks.generado.json', JSON.stringify(incluidas, null, 2) + '\n', 'utf8');

const motivos = new Map();
for (const x of excluidas) motivos.set(x.motivo, (motivos.get(x.motivo) ?? 0) + 1);

const informe = `# Informe de cobertura del catálogo

Generado por \`scripts/03-generar-catalogo.mjs\`.

Fuentes: Wikidata (CC0), FishBase v26.06 (CC BY-NC) y UICN Lista Roja.
Cita de la UICN: IUCN 2026. IUCN Red List of Threatened Species. Version 2026-1 <www.iucnredlist.org>.

## Resumen

| | Especies |
|---|---|
| Partimos de (Wikidata: vivas con estado e ID de FishBase) | ${lista.length} |
| **Incluidas en el catálogo** | **${incluidas.length}** |
| Excluidas | ${excluidas.length} |

## Por qué se excluyeron

${[...motivos].sort((a, b) => b[1] - a[1]).map(([m, n]) => `- ${m}: ${n}`).join('\n') || '- (ninguna)'}

## Cómo quedaron los datos de las incluidas

- Con nombre en español de FishBase: ${stats.nombreEspanol}
- Con el nombre científico como nombre (no hay nombre en español): ${stats.nombreCientifico}
- Escritas a mano (tienen prioridad): ${stats.manuales}
- Con peso máximo documentado: ${stats.conPeso}
- Sin longitud máxima en FishBase (se incluyen y la ficha muestra "No disponible"): ${stats.sinLongitud}
- Con estado de la UICN desactualizado (evaluación global antigua): ${stats.estadoAntiguo}
- Encontradas en la UICN por su ID y no por su nombre: ${stats.porIdUicn}
- Con alimentación (generada de las presas de FishBase, mínimo ${MIN_REGISTROS} registros): ${stats.conAlimentacion}
- Sin alimentación o sin rasgo distintivo: se muestran como "No disponible" (campos opcionales)
- Grupos de presa de FishBase sin traducción en equivalencias.ts: ${presasSinTraducir.size === 0 ? 'ninguno' : [...presasSinTraducir].join('; ')}

## Nombre científico distinto entre Wikidata y FishBase

Se usa el de FishBase. Son ${stats.nombreDistinto.length} especies:

${stats.nombreDistinto.map((x) => `- ${x}`).join('\n') || '- (ninguna)'}

## Muestra de nombres elegidos (especies con 3 o más nombres en español)

${muestraNombres.map((x) => `- ${x}`).join('\n') || '- (ninguna)'}

## Especies excluidas

${excluidas.map((x) => `- ${x.sci}: ${x.motivo}`).join('\n') || '- (ninguna)'}
`;
writeFileSync('scripts/informe-cobertura.md', informe, 'utf8');

console.log(`Incluidas: ${incluidas.length} de ${lista.length} | excluidas: ${excluidas.length}`);
for (const [m, n] of [...motivos].sort((a, b) => b[1] - a[1])) console.log(`  - ${m}: ${n}`);
console.log(`Nombre en español: ${stats.nombreEspanol} | nombre científico como nombre: ${stats.nombreCientifico} | manuales: ${stats.manuales}`);
console.log(`Con peso: ${stats.conPeso} | con alimentación: ${stats.conAlimentacion} | estado desactualizado: ${stats.estadoAntiguo}`);
if (presasSinTraducir.size > 0) console.log(`Grupos de presa sin traducir (${presasSinTraducir.size}): ${[...presasSinTraducir].join(' | ')}`);
console.log('Informe: scripts/informe-cobertura.md');
console.log('Candidato: scripts/cache/sharks.generado.json');

if (process.argv.includes('--escribir')) {
  if (incluidas.length === 0) {
    console.error('El catálogo quedó vacío: no se reemplaza data/sharks.json.');
    process.exit(1);
  }
  copyFileSync('scripts/cache/sharks.generado.json', 'data/sharks.json');
  console.log(`data/sharks.json reemplazado con ${incluidas.length} especies.`);
}
