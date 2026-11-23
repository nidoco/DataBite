# Feature: F13 - Guardar dónde se vio una especie (geolocalización)

## Objetivo

Permitir que la usuaria guarde el lugar donde vio una especie, junto a su nota
personal (F11). Así la nota funciona como un registro de observaciones. Es la segunda
feature nativa que pide el curso, después de compartir (F12).

## Actor

La usuaria de la app (proyecto personal).

## Precondiciones

- F11 (notas personales) está terminada: solo se puede guardar una ubicación si la
  especie ya tiene una nota.
- Se instala `expo-location` con `npx expo install expo-location`.
- Antes de programar, se revisa la documentación de Location en Expo SDK 58, como pide
  `AGENTS.md`.

## Datos de entrada

- Latitud y longitud del teléfono en el momento en que la usuaria lo pide.
- Fecha y hora de la captura.

## Flujo principal

1. En la ficha de una especie con nota, la sección "Mis notas" muestra el botón
   "Guardar dónde la viste".
2. La primera vez, el teléfono pide permiso de ubicación.
3. Si la usuaria acepta, la app toma la ubicación actual y la guarda junto a la nota de
   esa especie.
4. La sección muestra: "Vista en 19.4326, -99.1332 · 27/09/2026".
5. La usuaria puede quitar la ubicación con el botón "Quitar ubicación".
6. Si la usuaria edita o borra la nota, la ubicación se conserva; solo se borra si se
   quita a mano o si se borra la nota.

## Almacenamiento

- Las ubicaciones se guardan en una clave propia de AsyncStorage, `ubicaciones`, separada
  de las notas. Así las notas (F11) no cambian de formato.
- Formato: un objeto con el `id` de la especie como clave y, como valor, `latitud`,
  `longitud` y `fecha` (texto).
- Las coordenadas se guardan solo en el teléfono. La app no las envía a ningún servidor.

## Validaciones

- La latitud debe estar entre -90 y 90, y la longitud entre -180 y 180. Si no, no se guarda.
- Al leer del almacenamiento, cada ubicación se valida en la frontera. Lo que no cumpla
  se descarta.
- Solo se puede guardar una ubicación si la especie tiene una nota guardada.

## Casos de error / degradación

- Si la usuaria niega el permiso, se muestra "Necesitamos permiso de ubicación para
  guardar dónde la viste". La app sigue funcionando.
- Si el teléfono no puede obtener la ubicación (por ejemplo, el GPS está apagado), se
  muestra "No se pudo obtener la ubicación. Intenta de nuevo".
- Si la lectura del almacenamiento falla, se asume que no hay ubicaciones.

## Resultado esperado

La usuaria guarda, en la ficha de una especie, el lugar donde la vio. La ubicación sigue
ahí al cerrar y volver a abrir la app.

## Estados de la pantalla

- Sin nota: no aparece el botón de ubicación.
- Con nota y sin ubicación: botón "Guardar dónde la viste".
- Con nota y ubicación: texto con coordenadas y fecha, y botón "Quitar ubicación".
- Obteniendo la ubicación: botón deshabilitado con el texto "Buscando ubicación...".

## Criterios de aceptación

- [X] Con una nota guardada, aparece el botón "Guardar dónde la viste".
- [X] La primera vez, el teléfono pide permiso de ubicación.
- [X] Al aceptar, la ubicación se guarda y se muestra con su fecha.
- [X] Si se niega el permiso, la app muestra el mensaje y no se cierra.
- [X] La ubicación sigue guardada después de cerrar y volver a abrir la app.
- [X] "Quitar ubicación" borra solo la ubicación, no la nota.
- [X] Una ubicación inválida no se guarda ni se muestra.

## Tasks

- [X] Instalar `expo-location` con `npx expo install expo-location`.
- [X] Revisar la documentación de Location en Expo SDK 58.
- [X] Crear el módulo de lectura y guardado de ubicaciones, con validación en la frontera.
- [X] Agregar la lógica de permiso y de obtención de la ubicación.
- [X] Agregar el botón y el texto de la ubicación en la sección "Mis notas" de la ficha.
- [X] Agregar el botón "Quitar ubicación".
- [X] Verificar los criterios de aceptación de F13.
