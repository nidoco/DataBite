# Navegación del proyecto

## Enfoque

La app usa React Navigation con un Native Stack Navigator
(`@react-navigation/native` + `@react-navigation/native-stack`), envuelto en un
`NavigationContainer`. La navegación entre pantallas se hace con los métodos
`navigate` y `goBack`.

## Dependencias

- `@react-navigation/native`
- `@react-navigation/native-stack`
- Dependencias nativas asociadas: `react-native-screens`,
  `react-native-safe-area-context` (esta última ya está en el proyecto).

## Mapa de rutas (MVP)

```text
RootStack
├── Catalogo     (pantalla inicial)
├── Detalle      (ficha de una especie)
├── Quiz         (quiz mito/realidad)
└── Resultados   (resumen final del quiz)
```

## Tipado de rutas

Se define un `RootStackParamList` en TypeScript que declara cada ruta y los
parámetros que recibe. Cada pantalla se tipa con `NativeStackScreenProps` para
validar de forma segura el acceso a `route.params` y a `navigation`.

| Ruta        | Parámetros                             |
|-------------|----------------------------------------|
| Catalogo    | ninguno (`undefined`)                  |
| Detalle     | `{ id: string }`                       |
| Quiz        | ninguno (`undefined`)                  |
| Resultados  | `{ respuestas: { id: string; acerto: boolean }[] }` |


## Qué información viaja entre pantallas

- **Catalogo -> Detalle:** viaja el `id` (slug) de la especie seleccionada, no el
  objeto completo. La pantalla Detalle recupera la especie buscándola por `id`
  entre los datos validados de `loadSharks`. Los parámetros de ruta se mantienen
  ligeros y serializables.
- **Quiz -> Resultados:** viaja la lista de respuestas dadas (para cada pregunta,
  su `id` y si se acertó). Los aciertos y el total se calculan a partir de esa
  lista en la pantalla de resultados (no se pasan por separado para evitar datos
  duplicados que puedan desincronizarse).


## Pantalla inicial

`Catalogo` es la ruta inicial del stack.

## Cabecera (header)

- Se configura un estilo global de header con `screenOptions` del navigator
  (color de fondo, color y peso del texto), coherente con la paleta de la app.
- Cuando una pantalla necesite un elemento dinámico en el header (por ejemplo un
  botón), se usa `navigation.setOptions` dentro de `useLayoutEffect`.

## Casos de error / degradación

- Si la pantalla Detalle recibe un `id` que no existe entre los datos validados
  (por ejemplo, datos que cambiaron), muestra un estado de "especie no encontrada"
  y permite volver con `goBack`, en lugar de romper o quedar en blanco.

## Criterios de aceptación

- [ ] Existe un `RootStackParamList` que tipa todas las rutas y sus parámetros.
- [ ] Cada pantalla usa `NativeStackScreenProps` para tipar `route` y `navigation`.
- [ ] `Catalogo` es la pantalla inicial.
- [ ] Desde `Catalogo` se navega a `Detalle` pasando el `id` de la especie.
- [ ] `Detalle` recupera la especie por `id` desde los datos validados.
- [ ] Si el `id` no existe, `Detalle` muestra "especie no encontrada" y permite volver.
- [ ] El header tiene un estilo global definido con `screenOptions`.

## Tasks

- [ ] Instalar React Navigation y sus dependencias nativas.
- [ ] Definir `RootStackParamList` en un archivo de tipos propio.
- [ ] Configurar `NavigationContainer` y el Native Stack en `App.tsx`.
- [ ] Registrar las rutas: Catalogo, Detalle, Quiz, Resultados.
- [ ] Aplicar el estilo global del header con `screenOptions`.
- [ ] Verificar los criterios de aceptación de navegación.
