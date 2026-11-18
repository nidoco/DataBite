// Paso 1: obtiene de Wikidata la lista de tiburones vivos (los que tienen estado de
// conservación e ID de FishBase) y la guarda en scripts/cache/lista.json.
// Uso: node scripts/01-lista-wikidata.mjs

import { mkdirSync, writeFileSync } from 'node:fs';

const CONSULTA = `
SELECT ?t ?sci ?fb ?status WHERE {
  ?t wdt:P171* wd:Q7372;
     wdt:P105 wd:Q7432;
     wdt:P225 ?sci;
     wdt:P938 ?fb;
     wdt:P141 ?s.
  ?s rdfs:label ?status FILTER(LANG(?status) = "en")
}`;

const url = 'https://query.wikidata.org/sparql?query=' + encodeURIComponent(CONSULTA);
const respuesta = await fetch(url, {
  headers: {
    Accept: 'application/sparql-results+json',
    'User-Agent': 'DataBite-student-project/1.0 (personal, non-commercial)',
  },
});

if (!respuesta.ok) {
  console.error(`Wikidata respondió ${respuesta.status}. No se guardó nada.`);
  process.exit(1);
}

const filas = (await respuesta.json()).results.bindings;

// Una especie puede salir en varias filas; dejamos una sola por nombre científico.
const porNombre = new Map();
for (const f of filas) {
  const sci = f.sci.value.trim();
  if (porNombre.has(sci)) continue;
  porNombre.set(sci, {
    sci,
    wikidata: f.t.value.split('/').pop(),
    fishbase: Number(f.fb.value),
    estadoWikidata: f.status.value,
  });
}

const lista = [...porNombre.values()].sort((a, b) => a.sci.localeCompare(b.sci));
const raros = lista.filter((e) => e.sci.split(/\s+/).length !== 2);

mkdirSync('scripts/cache', { recursive: true });
writeFileSync('scripts/cache/lista.json', JSON.stringify(lista, null, 2), 'utf8');

console.log(`Especies guardadas: ${lista.length}`);
if (raros.length > 0) {
  console.log(`Nombres que no son "Género especie" (revisar a mano): ${raros.length}`);
  for (const r of raros.slice(0, 10)) console.log('  -', r.sci);
}
