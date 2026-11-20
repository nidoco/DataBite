# Feature: F08 - Persistencia local del progreso

## Objetivo

Guardar en el dispositivo lo que la usuaria desbloquea o marca como suyo (especies
extintas desbloqueadas y especies favoritas), de modo que siga disponible al cerrar
y volver a abrir la app. Es la base de F06 (el acertijo desbloquea especies y el
desbloqueo tiene que sobrevivir a cerrar la app).

## Actor

La usuaria de la app (proyecto personal).

## Precondiciones

- La app funciona sin conexión: no hay backend ni cuentas.
- Se usa AsyncStorage (`@react-native-async-storage/async-storage`), instalado con
  `npx expo install`.

## Datos de entrada

Dos datos guardados, cada uno con su clave:

- `desbloqueadas`: lista de ids de especies extintas desbloqueadas (`string[]`).
- `favoritas`: lista de ids de especies marcadas como favoritas (`string[]`).

Los datos guardados NO se confían al leerlos: se validan en la frontera igual que
`data/sharks.json`.

## Flujo principal

1. Al abrir la app se leen las dos claves.
2. Cada valor se valida: debe ser una lista y cada elemento un texto. Lo que no
   cumpla se descarta.
3. Las especies desbloqueadas se usan para decidir qué extintas mostrar en el
   catálogo (F01/F06).
4. Cuando la usuaria desbloquea una especie (F06) o marca/desmarca una favorita,
   la lista nueva se guarda en el almacenamiento.
5. Al cerrar y volver a abrir, el estado guardado se restaura.

## Validaciones

- Cada lista se valida en la frontera al leerla: que sea un array y que cada elemento
  sea un texto.
- Un id guardado que ya no existe en `data/sharks.json` se ignora (no se borra
  automáticamente, por si vuelve a existir).
- No se duplican ids en las listas.
- Guardar siempre reemplaza la lista completa, nunca se modifica a medias.

## Casos de error / degradación

- Si la lectura falla o el dato guardado está corrupto, se asume que no hay nada
  desbloqueado ni favorito, y la app sigue funcionando.
- Si la escritura falla, la app avisa de forma discreta y el estado en pantalla sigue
  siendo el correcto para la sesión actual.
- (Carga y error de red no aplican: todo es local.)

## Resultado esperado

La usuaria desbloquea una especie extinta o marca una favorita, cierra la app, la
vuelve a abrir, y sigue viéndolo igual.

## Estados de la pantalla

- Al arrancar: se muestra el catálogo mientras se leen los datos. Si la lectura tarda
  más de un instante, no se bloquea la pantalla.
- Sin datos guardados: el catálogo muestra solo las especies no extintas.

## Criterios de aceptación

- [ ] Existe un módulo de persistencia que lee y guarda las dos listas.
- [ ] Desbloquear una especie persiste después de cerrar y volver a abrir la app.
- [ ] Marcar y desmarcar una favorita persiste de la misma forma.
- [ ] Un dato guardado corrupto no rompe la app: se trata como vacío.
- [ ] Un id guardado que ya no existe se ignora sin error.
- [ ] Sin datos guardados, el catálogo no muestra especies extintas.

## Tasks

- [ ] Instalar AsyncStorage con `npx expo install`.
- [ ] Crear el módulo de persistencia con las funciones de leer y guardar.
- [ ] Validar en la frontera los datos leídos.
- [ ] Crear un estado global con Context para las dos listas, para que catálogo, ficha
      y quiz lean lo mismo.
- [ ] Filtrar las especies extintas del catálogo según las desbloqueadas.
- [ ] Agregar el botón de favorita en la ficha.
- [ ] Verificar los criterios de aceptación de F08.
