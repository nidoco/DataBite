# Feature: F09 - Navegación con pestañas y modal de créditos

## Objetivo

Agregar una navegación de pestañas (Tabs) y un modal, para que la app tenga más de
una forma de moverse y cumpla el requisito de navegación del curso (Stack, Tabs y
Modal). La pestaña Favoritas le da a la usuaria una vista propia de lo que marcó. El
modal muestra los créditos de las fotos, para dar atribución a los autores.

## Actor

La usuaria de la app (proyecto personal).

## Precondiciones

- F08 (persistencia) está terminada: las favoritas y las especies desbloqueadas ya se
  leen desde `progresoContext`.
- Se instala `@react-navigation/bottom-tabs` con `npx expo install`, y se revisa la
  documentación de Expo SDK 58 antes de programar (requisito de `AGENTS.md`).
- Los créditos están en `data/creditos.json`.

## Decisión de estructura

- Las pestañas son **Catálogo** y **Favoritas**.
- **Quiz** se queda en el stack, como hasta ahora. Ponerlo en una pestaña obligaría a
  que sus botones de "Reintentar" y "Volver" funcionen dentro de un navegador anidado.
  Ese cambio no aporta nada a la usuaria y sí agrega riesgo.
- **Ficha** y **Resultados** se quedan en el stack, encima de las pestañas.
- **Créditos** es un modal que se abre encima de todo.

## Estructura de navegación

| Pantalla | Tipo | Desde dónde se abre |
|---|---|---|
| Principal (pestañas) | Tabs | Al abrir la app |
| Catálogo | Pestaña | Pestaña principal |
| Favoritas | Pestaña | Segunda pestaña |
| Ficha | Stack | Tocar una tarjeta de Catálogo o de Favoritas |
| Quiz | Stack | Botón "Quiz" en el encabezado de Catálogo |
| Resultados | Stack | Al terminar el quiz |
| Créditos | Modal | Botón "Créditos" en el encabezado de Catálogo |

## Flujo principal

1. Al abrir la app se muestra la pestaña Catálogo.
2. La usuaria cambia a Favoritas y ve solo las especies que marcó como favoritas.
3. Tocar una especie en Favoritas abre la ficha, igual que desde el catálogo.
4. Tocar "Créditos" en el encabezado de Catálogo abre un modal con la lista de fotos,
   su autor y su licencia. Se cierra con un botón o deslizando.

## Datos de entrada

- `favoritas` y `desbloqueadas` desde `progresoContext`.
- Las especies desde `loadSharks()`.
- Los créditos desde `data/creditos.json`.

## Validaciones

- La pestaña Favoritas solo muestra ids que existan en el catálogo. Un id de favorita
  que ya no exista se ignora.
- Una especie extinta bloqueada no aparece en Favoritas, aunque su id esté guardado.

## Casos de error / degradación

- Si no hay favoritas, Favoritas muestra "Todavía no tienes especies favoritas".
- Si el progreso todavía está cargando, Favoritas muestra un indicador de carga en vez
  de una lista vacía.
- Si `creditos.json` no tiene entradas, el modal muestra "No hay créditos disponibles".

## Resultado esperado

La app tiene dos pestañas, una pantalla de ficha que se abre desde ambas, y un modal
de créditos. Al volver a abrir la app se sigue en la misma estructura.

## Estados de la pantalla

- Catálogo y Favoritas usan el mismo estilo de tarjeta (`SharkCard`).
- El modal de créditos muestra, por cada foto: autor, licencia y enlace a la fuente.
- En el encabezado de Catálogo hay dos botones: "Quiz" y "Créditos".

## Criterios de aceptación

- [X] La app muestra dos pestañas: Catálogo y Favoritas.
- [X] Favoritas muestra solo las especies marcadas como favoritas.
- [X] Desde Favoritas se abre la ficha de la especie.
- [X] El modal de Créditos se abre desde el catálogo y lista las fotos con su autor y
      licencia.
- [X] El modal se cierra y regresa a la pestaña donde estaba la usuaria.
- [X] El quiz sigue funcionando igual que antes (sin cambios en "Reintentar" y "Volver").
- [X] Sin favoritas, Favoritas muestra un mensaje y no una pantalla vacía.

## Tasks

- [X] Instalar `@react-navigation/bottom-tabs` con `npx expo install`.
- [X] Crear la pantalla Favoritas con la lista filtrada y su estado vacío.
- [X] Crear el navegador de pestañas (Catálogo y Favoritas) y ponerlo como pantalla
      principal del stack.
- [X] Agregar el botón "Créditos" al encabezado de Catálogo.
- [X] Crear la pantalla de Créditos y abrirla como modal.
- [X] Verificar que el quiz y la ficha siguen funcionando desde las dos pestañas.
- [X] Verificar los criterios de aceptación de F09.
