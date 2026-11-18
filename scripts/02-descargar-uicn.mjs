// Paso 2: consulta a la API de la UICN el estado de cada especie.
//
// Reglas para respetar los términos de la API (lo que se prometió en la solicitud):
//  - una sola tanda, con una pausa entre peticiones;
//  - cada respuesta se guarda en scripts/cache/uicn/, así no se repite ninguna;
//  - si la API responde 429 (demasiadas peticiones) o cualquier error, se detiene.
//
// Uso:
//   node scripts/02-descargar-uicn.mjs --solo "Carcharodon carcharias,Rhincodon typus"
//   node scripts/02-descargar-uicn.mjs            (toda la lista de scripts/cache/lista.json)
//
// El token se lee de .env (IUCN_TOKEN) y nunca se imprime.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { estadoDe } from './uicn-estado.mjs';

const PAUSA_MS = 2000;
const CARPETA = 'scripts/cache/uicn';
const API = 'https://api.iucnredlist.org/api/v4/taxa/scientific_name';

function leerToken() {
  if (!existsSync('.env')) {
    console.error('No existe el archivo .env');
    process.exit(1);
  }
  const m = readFileSync('.env', 'utf8').match(/^\s*IUCN_TOKEN\s*=\s*(.+?)\s*$/m);
  if (!m) {
    console.error('El .env no tiene la variable IUCN_TOKEN');
    process.exit(1);
  }
  return m[1].replace(/^['"]|['"]$/g, '');
}

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));
const archivoDe = (sci) => `${CARPETA}/${sci.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.json`;

function especiesAConsultar() {
  const i = process.argv.indexOf('--solo');
  if (i !== -1 && process.argv[i + 1]) {
    return process.argv[i + 1].split(',').map((s) => s.trim()).filter(Boolean);
  }
  if (!existsSync('scripts/cache/lista.json')) {
    console.error('Falta scripts/cache/lista.json. Corre antes: node scripts/01-lista-wikidata.mjs');
    process.exit(1);
  }
  return JSON.parse(readFileSync('scripts/cache/lista.json', 'utf8')).map((e) => e.sci);
}

const token = leerToken();
const especies = especiesAConsultar();
mkdirSync(CARPETA, { recursive: true });

let descargadas = 0;
let enCache = 0;

for (let n = 0; n < especies.length; n++) {
  const sci = especies[n];
  const etiqueta = `[${n + 1}/${especies.length}] ${sci}`;
  const archivo = archivoDe(sci);

  if (existsSync(archivo)) {
    enCache++;
    const e = estadoDe(JSON.parse(readFileSync(archivo, 'utf8')).evaluaciones);
    console.log(`${etiqueta} -> (en caché) ${e ? `${e.codigo} ${e.anio}` : 'sin evaluación global'}`);
    continue;
  }

  const [genero, especie] = sci.split(/\s+/);
  if (!genero || !especie) {
    console.log(`${etiqueta} -> se omite: el nombre no es "Género especie"`);
    continue;
  }

  const url = `${API}?genus_name=${encodeURIComponent(genero)}&species_name=${encodeURIComponent(especie)}`;
  let respuesta;
  try {
    respuesta = await fetch(url, {
      headers: { Authorization: token, 'User-Agent': 'DataBite-student-project/1.0 (personal, non-commercial)' },
    });
  } catch (error) {
    console.error(`${etiqueta} -> error de red (${error.cause?.code ?? error.message}). Me detengo.`);
    process.exit(1);
  }

  if (respuesta.status === 429) {
    console.error(`${etiqueta} -> la API pide bajar el ritmo (429). Me detengo. Vuelve a correrlo más tarde: lo ya guardado no se repite.`);
    process.exit(1);
  }
  if (respuesta.status !== 200 && respuesta.status !== 404) {
    console.error(`${etiqueta} -> la API respondió ${respuesta.status}. Me detengo para no insistir.`);
    process.exit(1);
  }

  const cuerpo = respuesta.status === 200 ? await respuesta.json() : {};
  const evaluaciones = (cuerpo.assessments ?? []).map((e) => ({
    assessment_id: e.assessment_id,
    year_published: e.year_published,
    latest: e.latest,
    red_list_category_code: e.red_list_category_code,
    scopes: e.scopes,
    url: e.url,
  }));

  writeFileSync(
    archivo,
    JSON.stringify({ sci, estadoHttp: respuesta.status, consultadoEn: new Date().toISOString(), evaluaciones }, null, 2),
    'utf8',
  );
  descargadas++;

  const e = estadoDe(evaluaciones);
  console.log(`${etiqueta} -> ${respuesta.status === 404 ? 'no encontrada' : e ? `${e.codigo} ${e.anio}` : 'sin evaluación global'}`);

  if (n < especies.length - 1) await dormir(PAUSA_MS);
}

console.log(`\nListo. Descargadas: ${descargadas} | ya estaban en caché: ${enCache}`);
