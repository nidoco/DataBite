// Paso 5: genera data/imagenes.ts, el mapa que enlaza cada identificador de foto con su
// archivo. Metro necesita rutas literales en require(), así que el mapa se escribe completo
// a partir de los archivos que existen en assets/tiburones/.
//
// Uso: node scripts/05-generar-mapa-imagenes.mjs   (después de descargar las fotos)

import fs from 'node:fs';
import path from 'node:path';

const carpeta = 'assets/tiburones';
const archivos = fs
  .readdirSync(carpeta)
  .filter((f) => /\.(jpe?g|png|gif)$/i.test(f) && f !== 'placeholder.png')
  .sort();

const lineas = archivos.map((f) => `  '${path.parse(f).name}': require('../assets/tiburones/${f}'),`);

const contenido = `// Generado por scripts/05-generar-mapa-imagenes.mjs. No editar a mano.
import { ImageSourcePropType } from 'react-native';

const placeholder: ImageSourcePropType = require('../assets/tiburones/placeholder.png');

const fotos: Record<string, ImageSourcePropType> = {
${lineas.join('\n')}
};

// Devuelve la foto de un identificador, o el placeholder si no existe o no hay ninguno.
export function imagenPorIdentificador(identificador?: string): ImageSourcePropType {
  return (identificador && fotos[identificador]) || placeholder;
}
`;

fs.writeFileSync('data/imagenes.ts', contenido, 'utf8');
console.log(`Fotos en el mapa: ${archivos.length}`);
