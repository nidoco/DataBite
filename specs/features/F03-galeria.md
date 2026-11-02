# Feature: F03 - Galería e ilustraciones

## Objetivo

Enriquecer el catálogo y el detalle con imágenes de cada especie de tiburón:
una imagen de portada en la tarjeta del catálogo y una galería deslizable con
todas las imágenes de la especie en la ficha de detalle, para ayudar a
identificar visualmente a cada tiburón.

## Actor

La usuaria de la app (proyecto personal).

## Precondiciones

- Las imágenes son archivos locales empaquetados con la app (carpeta `assets/`).
- Cada especie puede declarar una lista de identificadores de imagen en sus datos.
- Un mapa en código asocia cada identificador con su archivo local (`require`).

## Datos de entrada

Ninguno capturado por la usuaria. Cada especie (`Shark`) incluye un campo nuevo:

- `imagenes`: lista de identificadores de imagen (strings), por ejemplo
  `["tiburon-blanco-1", "tiburon-blanco-2"]`. Puede estar vacía.

El archivo de imagen real NO se guarda en el JSON: el JSON solo guarda
identificadores. Un mapa en código (`identificador -> require(archivo)`) resuelve
el archivo local, porque `require` necesita una ruta literal en el código y no
admite rutas dinámicas desde un string.

## Flujo principal

### En el catálogo (tarjeta)
1. La tarjeta de una especie muestra su imagen de portada (la primera de la lista).
2. La imagen se acompaña del texto resumen (nombre y nombre científico).

### En el detalle (galería)
1. La usuaria abre la ficha de detalle de una especie (F02).
2. La ficha muestra una galería horizontal deslizable con todas las imágenes
   de esa especie.
3. La usuaria desliza horizontalmente para recorrer las imágenes.

## Validaciones

- El campo `imagenes` debe ser una lista de strings; se valida en la frontera
  junto con el resto de la especie (en `loadSharks`).
- Cada imagen se muestra con dimensiones definidas (nunca un `Image` sin tamaño).
- La galería del detalle se renderiza con `FlatList` horizontal.

## Casos de error (degradación)

- Si una especie no tiene imágenes (lista vacía), se muestra un placeholder
  (imagen de relleno) tanto en la tarjeta como en el detalle, no un hueco vacío.
- Si un identificador no existe en el mapa de `require` (typo o archivo faltante),
  esa imagen se sustituye por el placeholder en lugar de romper la pantalla.
- El mismo placeholder cubre los dos casos: "sin imágenes" e "imagen que no
  resuelve".

## Resultado esperado

La usuaria ve a cada especie acompañada de su imagen de portada en el catálogo y
puede explorar todas sus ilustraciones en una galería deslizable dentro del
detalle. Las especies sin imagen válida se ven igual de ordenadas gracias al
placeholder.

## Estados de la pantalla

- Con imágenes: se muestran las ilustraciones reales.
- Sin imágenes / imagen no resuelve: se muestra el placeholder.
- (Carga y error de red no aplican: las imágenes son locales y empaquetadas.)

## Criterios de aceptación

- [ ] La interface `Shark` incluye el campo `imagenes` (lista de strings).
- [ ] `loadSharks` valida que `imagenes` sea una lista de strings; una especie
      con `imagenes` inválido se descarta como cualquier otro dato corrupto.
- [ ] Existe un mapa en código que traduce cada identificador a su archivo local.
- [ ] La tarjeta del catálogo muestra la imagen de portada (primera de la lista).
- [ ] El detalle muestra una galería horizontal deslizable con todas las imágenes.
- [ ] Toda `Image` se renderiza con dimensiones definidas.
- [ ] Una especie sin imágenes muestra el placeholder en tarjeta y detalle.
- [ ] Un identificador que no resuelve en el mapa muestra el placeholder, sin
      romper la pantalla.

## Tasks

- [ ] Agregar el campo `imagenes: string[]` a la interface `Shark`.
- [ ] Actualizar `data/sharks.json` con la lista de imágenes de cada especie.
- [ ] Extender el type guard de `loadSharks` para validar `imagenes` (lista de
      strings).
- [ ] Agregar los archivos de imagen a `assets/` y el archivo placeholder.
- [ ] Crear el mapa `identificador -> require(archivo)` en un módulo propio.
- [ ] Crear una función/helper que devuelva el `require` de un identificador, o
      el placeholder si no resuelve.
- [ ] Mostrar la imagen de portada en `SharkCard` (en el hueco ya reservado).
- [ ] Crear un componente de galería horizontal (`FlatList`) para el detalle.
- [ ] Integrar la galería en `DetalleScreen`.
- [ ] Verificar los criterios de aceptación de F03.
