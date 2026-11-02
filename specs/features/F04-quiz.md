# Feature: F04 - Quiz "Mito o Realidad"

## Objetivo

Permitir que la usuaria ponga a prueba lo que cree saber sobre tiburones
respondiendo una serie de afirmaciones, indicando si cada una es un mito o una
realidad, con retroalimentación científica inmediata tras cada respuesta.

## Actor

La usuaria de la app (proyecto personal).

## Precondiciones

- Debe existir el banco de preguntas (`data/quiz.json`).
- Los datos deben pasar la validación de carga antes de usarse.
- La navegación por stack (ver `01-navigation.md`) debe estar configurada; el
  quiz es la ruta `Quiz`.

## Datos de entrada

Ninguno capturado por la usuaria por escrito. El quiz consume un banco de
preguntas (`Pregunta[]`) ya validado. Cada pregunta tiene:

- `id`: identificador (slug);
- `enunciado`: la afirmación que se evalúa;
- `respuesta`: la respuesta correcta, de tipo `"mito" | "realidad"`;
- `explicacion`: la explicación científica que se muestra como retroalimentación.

Las preguntas son generales sobre tiburones; NO dependen de las especies del
catálogo (el banco es independiente del número de especies).

## Flujo principal

1. La usuaria entra a la ruta `Quiz`.
2. El quiz carga y valida el banco de preguntas.
3. Se muestra la primera pregunta (su enunciado) en una tarjeta.
4. La usuaria responde de una de dos formas equivalentes:
   - deslizando la tarjeta (swipe): una dirección = "mito", la otra = "realidad";
   - o pulsando uno de los dos botones "Mito" / "Realidad".
5. El quiz compara la respuesta con la correcta y registra si acertó.
6. Se muestra retroalimentación inmediata: si acertó o no, y la explicación
   científica de esa pregunta.
7. La usuaria avanza a la siguiente pregunta.
8. Se repite hasta agotar las preguntas.
9. Al terminar, la app navega a la ruta `Resultados` pasando la lista de
   respuestas dadas (para cada pregunta, su `id` y si se acertó).

## Interacción y animación (accesibilidad)

- La respuesta por swipe se implementa con gestos nativos
  (react-native-gesture-handler + Reanimated) para que sea fluida.
- El swipe NO es la única vía: siempre hay botones "Mito" / "Realidad"
  equivalentes, para quien no pueda o no quiera usar el gesto.
- Se respeta la preferencia de reducir movimiento del sistema
  (`AccessibilityInfo.isReduceMotionEnabled()`): si está activa, la animación de
  deslizamiento se acorta o se elimina, mostrando el cambio sin movimiento que
  pueda causar mareo.
- Los controles dan feedback táctil inmediato al tocarse (`Pressable`).

## Validaciones

- `respuesta` solo puede ser `"mito"` o `"realidad"`; se valida en la frontera.
- Una pregunta con datos inválidos se descarta en la carga y no aparece.
- El enunciado y la explicación se renderizan dentro de componentes `Text`.
- El puntaje se calcula a partir de las respuestas registradas; no se guarda un
  contador paralelo que pueda desincronizarse (una sola fuente de verdad).

## Casos de error / degradación

- Si el banco de preguntas está vacío (ninguna pregunta válida), el quiz muestra
  un mensaje de "no hay preguntas disponibles" y permite volver, en lugar de una
  pantalla rota.
- Si el usuario tiene activada la reducción de movimiento, el quiz funciona igual
  sin animación de swipe (la respuesta sigue disponible por botones y por un
  gesto sin animación).
- (Carga y error de red no aplican: el banco de preguntas es local.)

## Resultado esperado

La usuaria responde todas las preguntas, recibe retroalimentación científica tras
cada una, y al final llega a la pantalla de resultados con su conteo de aciertos.

## Estados de la pantalla

- Pregunta sin responder: se muestra el enunciado y los controles de respuesta.
- Pregunta respondida: se muestra la retroalimentación (acierto/fallo +
  explicación) y el control para avanzar.
- Sin preguntas disponibles: mensaje de error con opción de volver.

## Criterios de aceptación

- [ ] Existe la interface `Pregunta` con `respuesta: "mito" | "realidad"`.
- [ ] Existe `data/quiz.json` validado en la frontera (type guard propio).
- [ ] Una pregunta con `respuesta` distinta de "mito"/"realidad" se descarta.
- [ ] El quiz muestra las preguntas una por una.
- [ ] La usuaria puede responder por swipe Y por botones (ambas equivalentes).
- [ ] Tras responder, se muestra si acertó y la explicación científica.
- [ ] La usuaria puede avanzar a la siguiente pregunta.
- [ ] Al terminar, se navega a `Resultados` con la lista de respuestas dadas
      (id de cada pregunta y si se acertó).

- [ ] Con reducción de movimiento activada, el quiz funciona sin animación de swipe.
- [ ] El puntaje se calcula de las respuestas, sin contador paralelo.
- [ ] Todo el texto se renderiza dentro de componentes `Text`.

## Tasks

- [ ] Crear la interface `Pregunta` en `types/` (con `respuesta: "mito" | "realidad"`).
- [ ] Crear `data/quiz.json` con un banco inicial de preguntas (10-15).
- [ ] Crear el cargador validado `loadQuiz` con su type guard (patrón de `loadSharks`).
- [ ] Registrar la ruta `Quiz` en el stack.
- [ ] Crear la pantalla `QuizScreen` en `screens/`, tipada con `NativeStackScreenProps`.
- [ ] Manejar el estado del quiz: pregunta actual y respuestas registradas.
- [ ] Mostrar la pregunta actual en una tarjeta.
- [ ] Implementar los botones "Mito" / "Realidad" (vía base de respuesta).
- [ ] Implementar el swipe con gesture-handler + Reanimated, respetando reduce-motion.
- [ ] Mostrar retroalimentación por pregunta (acierto/fallo + explicación).
- [ ] Registrar cada respuesta (id + si acertó) y navegar a `Resultados` con esa
      lista al terminar.

- [ ] Manejar el caso de banco de preguntas vacío.
- [ ] Verificar los criterios de aceptación de F04.
