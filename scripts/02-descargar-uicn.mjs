// Paso 2: consulta a la API de la UICN el estado de cada especie.
//
// Reglas para respetar los términos de la API (lo que se prometió en la solicitud):
//  - una sola tanda, con una pausa entre peticiones;
//  - cada respuesta se guarda en scripts/cache/uicn/, así no se repite ninguna;
//  - si la API responde 429 (demasiadas peticiones) o cualquier error, se detiene.
//
// Primero se busca por nombre científico. Si la UICN no lo encuentra (por ejemplo,
// porque escribe distinto el nombre: "hasselti" y no "hasseltii") y Wikidata conoce
// el ID de la UICN de esa especie, se vuelve a consultar por ese ID.
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
const API = 'https://api.iucnredlist.org/api/v4/taxa';

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

// Devuelve [{ sci, uicn }]; uicn es el ID de la UICN o null si no se conoce.
function especiesAConsultar() {
  const i = process.argv.indexOf('--solo');
  if (i !== -1 && process.argv[i + 1]) {
    return process.argv[i + 1]
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((sci) => ({ sci, uicn: null }));
  }
  if (!existsSync('scripts/cache/lista.json')) {
    console.error('Falta scripts/cache/lista.json. Corre antes: node scripts/01-lista-wikidata.mjs');
    process.exit(1);
  }
  return JSON.parse(readFileSync('scripts/cache/lista.json', 'utf8')).map((e) => ({
    sci: e.sci,
    uicn: e.uicn ?? null,
  }));
}

const token = leerToken();
const especies = especiesAConsultar();
mkdirSync(CARPETA, { recursive: true });

// Hace una petición. Si la API pide bajar el ritmo o falla, el script se detiene.
async function pedir(url, etiqueta) {
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
  return { estadoHttp: respuesta.status, cuerpo };
}

let descargadas = 0;
let enCache = 0;
let rescatadas = 0;

for (let n = 0; n < especies.length; n++) {
  const { sci, uicn } = especies[n];
  const etiqueta = `[${n + 1}/${especies.length}] ${sci}`;
  const archivo = archivoDe(sci);

  // ¿Ya está guardada? Solo se reintenta una que dio 404 si ahora tenemos su ID.
  let reintentoPorId = false;
  if (existsSync(archivo)) {
    const previo = JSON.parse(readFileSync(archivo, 'utf8'));
    reintentoPorId = previo.estadoHttp === 404 && uicn !== null && !previo.porId;
    if (!reintentoPorId) {
      enCache++;
      const e = estadoDe(previo.evaluaciones);
      console.log(`${etiqueta} -> (en caché) ${e ? `${e.codigo} ${e.anio}` : previo.estadoHttp === 404 ? 'no encontrada' : 'sin evaluación global'}`);
      continue;
    }
  }

  const [genero, especie] = sci.split(/\s+/);
  if (!reintentoPorId && (!genero || !especie)) {
    console.log(`${etiqueta} -> se omite: el nombre no es "Género especie"`);
    continue;
  }

  const urlNombre = `${API}/scientific_name?genus_name=${encodeURIComponent(genero)}&species_name=${encodeURIComponent(especie)}`;
  const urlId = `${API}/sis/${uicn}`;

  let porId = reintentoPorId;
  let { estadoHttp, cuerpo } = await pedir(reintentoPorId ? urlId : urlNombre, etiqueta);

  if (!reintentoPorId && estadoHttp === 404 && uicn !== null) {
    await dormir(PAUSA_MS);
    ({ estadoHttp, cuerpo } = await pedir(urlId, etiqueta));
    porId = true;
  }

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
    JSON.stringify(
      {
        sci,
        nombreUicn: cuerpo.taxon?.scientific_name ?? null,
        porId,
        estadoHttp,
        consultadoEn: new Date().toISOString(),
        evaluaciones,
      },
      null,
      2,
    ),
    'utf8',
  );
  descargadas++;

  const e = estadoDe(evaluaciones);
  if (porId && e) rescatadas++;
  const nota = porId ? ` (por ID; la UICN la llama "${cuerpo.taxon?.scientific_name ?? '?'}")` : '';
  console.log(`${etiqueta} -> ${estadoHttp === 404 ? 'no encontrada' : e ? `${e.codigo} ${e.anio}` : 'sin evaluación global'}${nota}`);

  if (n < especies.length - 1) await dormir(PAUSA_MS);
}

console.log(`\nListo. Descargadas: ${descargadas} | ya estaban en caché: ${enCache} | rescatadas por ID: ${rescatadas}`);
