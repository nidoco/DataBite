// Paso 0: descarga las tablas de FishBase (formato Parquet) a scripts/cache/fishbase/.
// Datos de FishBase (v26.06), licencia CC BY-NC: uso no comercial con atribución.
// Uso: node scripts/00-descargar-fishbase.mjs

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';

const BASE = 'https://s3.us-west-2.amazonaws.com/us-west-2.opendata.source.coop/cboettig/fishbase/fb/v26.06/parquet/';
const TABLAS = ['species', 'comnames', 'ecology', 'fooditems'];
const CARPETA = 'scripts/cache/fishbase';

mkdirSync(CARPETA, { recursive: true });

for (const tabla of TABLAS) {
  const destino = `${CARPETA}/${tabla}.parquet`;
  if (existsSync(destino)) {
    console.log(`${tabla}: ya estaba descargada`);
    continue;
  }
  const respuesta = await fetch(`${BASE}${tabla}.parquet`);
  if (!respuesta.ok) {
    console.error(`${tabla}: FishBase respondió ${respuesta.status}. No se guardó nada.`);
    process.exit(1);
  }
  const bytes = Buffer.from(await respuesta.arrayBuffer());
  writeFileSync(destino, bytes);
  console.log(`${tabla}: descargada (${(bytes.length / 1048576).toFixed(1)} MB)`);
}
