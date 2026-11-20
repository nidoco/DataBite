// Paso 4: descarga las fotos de las especies desde Wikimedia Commons, en tamaño reducido
// (800 px de ancho), solo si su licencia permite usarlas en la app.
//
// Guarda:
//   - assets/tiburones/<especie>-<n>.jpg          (las fotos)
//   - scripts/imagenes-indice.json                (qué fotos tiene cada especie)
//   - data/creditos.json                          (autor y licencia de cada foto)
//
// Uso: node scripts/04-descargar-imagenes.mjs
// Antes: node scripts/01-lista-wikidata.mjs, la descarga de la UICN y las imágenes de
// Wikidata (scripts/cache/imagenes-wikidata.json) y las licencias (scripts/cache/licencias-commons.json).

import fs from 'node:fs';
import path from 'node:path';

const UA = 'DataBite-student-project/1.0 (personal, non-commercial)';
const ANCHO = 800;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const PERMITIDAS = /^(Public domain|CC0|No restrictions|CC BY|CC BY-SA)/;

for (const f of ['scripts/cache/imagenes-wikidata.json', 'scripts/cache/licencias-commons.json']) {
  if (!fs.existsSync(f)) {
    console.error(`Falta ${f}. Corre antes el paso de imágenes de Wikidata y de licencias.`);
    process.exit(1);
  }
}

const imagenesWd = JSON.parse(fs.readFileSync('scripts/cache/imagenes-wikidata.json', 'utf8'));
const licencias = new Map(JSON.parse(fs.readFileSync('scripts/cache/licencias-commons.json', 'utf8')).map((x) => [x.archivo, x]));
const lista = JSON.parse(fs.readFileSync('scripts/cache/lista.json', 'utf8'));
const catalogo = JSON.parse(fs.readFileSync('data/sharks.json', 'utf8'));

const sciPorWikidata = new Map(lista.map((e) => [e.wikidata, e.sci]));
const idPorSci = new Map(catalogo.map((x) => [x.nombreCientifico, x.id]));

// 1. Elegir las fotos permitidas de cada especie del catálogo, sin repetir archivos.
const elegidas = [];
const vistos = new Set();
for (const x of imagenesWd) {
  const archivo = decodeURIComponent(x.img.split('Special:FilePath/')[1] ?? '');
  const lic = licencias.get(archivo);
  if (!lic || !PERMITIDAS.test(lic.lic)) continue;
  const id = idPorSci.get(sciPorWikidata.get(x.t));
  if (!id || vistos.has(`${id}|${archivo}`)) continue;
  vistos.add(`${id}|${archivo}`);
  elegidas.push({ id, archivo, licencia: lic.lic, autor: lic.autor, url: lic.url });
}

// 2. Pedir a Commons la URL de la versión reducida de cada foto, en lotes.
const urlsReducidas = new Map();
for (let i = 0; i < elegidas.length; i += 20) {
  const titulos = [...new Set(elegidas.slice(i, i + 20).map((e) => e.archivo))].map((a) => `File:${a}`).join('|');
  const url = `https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url&iiurlwidth=${ANCHO}&format=json&maxlag=5&titles=${encodeURIComponent(titulos)}`;
  let json = null;
  for (let intento = 0; intento < 5 && !json; intento++) {
    const r = await fetch(url, { headers: { 'User-Agent': UA } });
    try {
      json = JSON.parse(await r.text());
    } catch {
      await sleep(5000 * (intento + 1)); // Commons pide bajar el ritmo: esperar más cada vez
    }
  }
  if (!json) {
    console.error(`Lote ${i / 20 + 1}: Commons no respondió. Me detengo; vuelve a correrlo, lo ya descargado se respeta.`);
    process.exit(1);
  }
  for (const p of Object.values(json.query?.pages ?? {})) {
    const info = p.imageinfo?.[0];
    if (info?.thumburl) urlsReducidas.set(p.title.replace(/^File:/, ''), info.thumburl);
  }
  await sleep(1500);
}

// 3. Descargar y nombrar: <id>-<n>.<ext>, y armar el índice y los créditos.
const carpeta = 'assets/tiburones';
fs.mkdirSync(carpeta, { recursive: true });
const indice = {};
const creditos = [];
let descargadas = 0;
let sinUrl = 0;

for (const e of elegidas) {
  const thumb = urlsReducidas.get(e.archivo);
  if (!thumb) { sinUrl++; continue; }
  indice[e.id] = indice[e.id] ?? [];
  const n = indice[e.id].length + 1;
  const ext = (path.extname(new URL(thumb).pathname) || '.jpg').toLowerCase();
  const nombre = `${e.id}-${n}`;
  const destino = path.join(carpeta, `${nombre}${ext}`);
  if (!fs.existsSync(destino)) {
    let r = null;
    // Commons responde 429 si se pide muy seguido: se espera más en cada intento.
    for (let intento = 0; intento < 5; intento++) {
      r = await fetch(thumb, { headers: { 'User-Agent': UA } });
      if (r.status !== 429) break;
      await sleep(8000 * (intento + 1));
    }
    if (!r.ok) { console.error(`No se pudo bajar ${e.archivo} (${r.status})`); continue; }
    fs.writeFileSync(destino, Buffer.from(await r.arrayBuffer()));
    descargadas++;
    await sleep(1200);
  }
  indice[e.id].push(nombre);
  creditos.push({ identificador: nombre, archivo: `${nombre}${ext}`, autor: e.autor, licencia: e.licencia, fuente: e.url });
}

fs.writeFileSync('scripts/imagenes-indice.json', JSON.stringify(indice, null, 2) + '\n', 'utf8');
fs.writeFileSync('data/creditos.json', JSON.stringify(creditos, null, 2) + '\n', 'utf8');

console.log(`Especies con fotos: ${Object.keys(indice).length} de ${catalogo.length}`);
console.log(`Fotos en el índice: ${creditos.length} | descargadas ahora: ${descargadas} | sin URL de Commons: ${sinUrl}`);
