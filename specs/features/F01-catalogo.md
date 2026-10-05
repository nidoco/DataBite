# Feature: F01 - Catálogo de especies

## Objetivo

Permitir que la usuaria vea la lista de especies de tiburones disponibles en la
app, cada una presentada en una tarjeta con su información básica, para poder
explorar el catálogo y elegir una especie que le interese.

## Actor

La usuaria de la app (proyecto personal).

## Precondiciones

- Debe existir el archivo de datos de especies (`data/sharks.json`).
- Los datos deben pasar la validación de carga (`loadSharks`) antes de mostrarse.

## Datos de entrada

Ninguno capturado por la usuaria. La pantalla consume los datos ya validados que
devuelve `loadSharks()`: una lista de especies (`Shark[]`), cada una con:

- nombre,
- nombre científico,
- estado de conservación,
- morfología (longitud, peso, forma, rasgo distintivo),
- hábitat,
- alimentación.

## Flujo principal

1. La usuaria abre la app y llega a la pantalla de Catálogo.
2. La pantalla carga las especies mediante `loadSharks()`.
3. La pantalla muestra una tarjeta por cada especie válida.
4. Cada tarjeta presenta al menos el nombre y la información básica de la especie.
5. La usuaria puede desplazarse por la lista para ver todas las especies.

## Validaciones

- Solo se muestran las especies que pasan la validación de `loadSharks`
  (las que no cumplen el tipo `Shark` se descartan y no aparecen).
- Cada tarjeta debe renderizar todo su texto dentro de componentes `Text`.

## Casos de error

- Si no hay especies válidas (lista vacía), la pantalla muestra un mensaje de
  "no hay especies para mostrar" en lugar de una pantalla en blanco.
- Si un dato individual viene mal, no rompe la pantalla: simplemente esa especie
  no aparece (ya filtrada por `loadSharks`).

## Resultado esperado

La usuaria ve el listado completo de especies válidas en forma de tarjetas,
puede recorrerlo, y en caso de no haber datos ve un mensaje claro.

## Estados de la pantalla

- Con datos: se muestra la lista de tarjetas.
- Lista vacía: se muestra el mensaje de "sin especies".
- (Carga y error de red no aplican: los datos son locales y síncronos.)

## Criterios de aceptación

- [ ] Al abrir el Catálogo, se muestra una tarjeta por cada especie válida del JSON.
- [ ] Cada tarjeta muestra al menos el nombre de la especie.
- [ ] La lista se puede desplazar cuando hay más tarjetas de las que caben en pantalla.
- [ ] Si la lista de especies está vacía, se muestra un mensaje de "sin especies"
      y no una pantalla en blanco.
- [ ] Ninguna especie inválida (que no cumple el tipo `Shark`) aparece en la lista.
- [ ] Todo el texto de las tarjetas se renderiza dentro de componentes `Text`.

## Tasks

- [X] Crear el componente `SharkCard` en `components/` con props tipadas (recibe un `Shark`).
- [X] Hacer que `SharkCard` muestre el resumen de la especie dentro de `Text`
      (nombre y nombre científico; la imagen llega en F03).
- [ ] Crear la pantalla `CatalogoScreen` en `screens/`.
- [ ] En `CatalogoScreen`, cargar las especies con `loadSharks()`.
- [ ] Renderizar la lista con `FlatList`, una `SharkCard` por especie.
- [ ] Agregar `ListEmptyComponent` con el mensaje de "sin especies".
- [ ] Conectar `CatalogoScreen` como pantalla inicial en `App.tsx`.
- [ ] Verificar los criterios de aceptación de F01.
