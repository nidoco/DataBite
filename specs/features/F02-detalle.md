# Feature: F02 - Detalle de especie

## Objetivo

Permitir que la usuaria vea la ficha completa de una especie de tiburón al
seleccionarla en el catálogo, con toda su información (morfología, hábitat y
alimentación), y pueda regresar al catálogo cuando termine.

## Actor

La usuaria de la app (proyecto personal).

## Precondiciones

- El catálogo (F01) debe estar mostrando al menos una especie.
- La navegación por stack (ver `01-navigation.md`) debe estar configurada.
- La especie se identifica por su `id` (slug) dentro de los datos validados por
  `loadSharks`.

## Datos de entrada

La pantalla de detalle recibe un parámetro de ruta: el `id` (string) de la
especie seleccionada. Con ese `id`, recupera la especie completa (`Shark`) desde
los datos validados, con todos sus campos:

- nombre y nombre científico;
- estado de conservación;
- morfología (longitud en metros, peso en kg, forma del cuerpo, rasgo distintivo);
- hábitat;
- alimentación.

## Flujo principal

1. La usuaria está en el catálogo viendo las tarjetas (F01).
2. La usuaria toca una tarjeta de especie.
3. La app navega a la ruta `Detalle` pasando el `id` de esa especie.
4. La pantalla de detalle recupera la especie correspondiente a ese `id`.
5. La ficha muestra todos los datos de la especie.
6. La usuaria usa el control de volver del header (o `goBack`) para regresar.
7. La app vuelve al catálogo.

## Validaciones

- El `id` recibido debe corresponder a una especie existente en los datos validados.
- Todo el texto de la ficha debe renderizarse dentro de componentes `Text`.
- Las medidas numéricas (longitud, peso) se muestran con su unidad legible
  (ej. "6 m", "1200 kg"), sin alterar el dato numérico original.

## Casos de error

- Si el `id` recibido no corresponde a ninguna especie (datos que cambiaron o
  parámetro inesperado), la pantalla muestra un estado de "especie no encontrada"
  y permite volver con `goBack`, en lugar de romper o quedar en blanco.
- Un dato faltante o inválido no llega a esta pantalla porque `loadSharks` ya
  descartó las especies inválidas antes de mostrarlas en el catálogo.

## Resultado esperado

La usuaria ve la ficha completa de la especie que eligió, con todos sus datos
legibles, y puede volver al catálogo para elegir otra.

## Estados de la pantalla

- Especie encontrada: se muestra la ficha completa.
- Especie no encontrada: se muestra el mensaje de error con opción de volver.
- (Carga y error de red no aplican: los datos son locales y síncronos.)

## Criterios de aceptación

- [ ] Al tocar una tarjeta del catálogo, se navega a la ruta `Detalle` con el `id`.
- [ ] La pantalla recupera la especie correspondiente a ese `id`.
- [ ] La ficha muestra nombre, nombre científico y estado de conservación.
- [ ] La ficha muestra la morfología completa (longitud, peso, forma, rasgo).
- [ ] La ficha muestra el hábitat y la alimentación.
- [ ] Las medidas numéricas se muestran con su unidad (ej. "6 m", "1200 kg").
- [ ] Si el `id` no corresponde a ninguna especie, se muestra "especie no encontrada".
- [ ] Existe un control de volver (header / `goBack`) que regresa al catálogo.
- [ ] Todo el texto de la ficha se renderiza dentro de componentes `Text`.

## Tasks

- [ ] Registrar la ruta `Detalle` en el stack con parámetro `{ id: string }`
      (ver `01-navigation.md`).
- [ ] Crear la pantalla `DetalleScreen` en `screens/`, tipada con
      `NativeStackScreenProps`.
- [ ] Recuperar la especie por `id` desde los datos validados (helper de búsqueda).
- [ ] Mostrar todos los campos de la especie, con las medidas formateadas con su
      unidad.
- [ ] Manejar el caso "especie no encontrada" con opción de volver.
- [ ] Hacer que tocar una `SharkCard` navegue a `Detalle` con el `id` (prop
      `onPress`).
- [ ] Verificar los criterios de aceptación de F02.
