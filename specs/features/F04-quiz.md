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

El banco puede crecer libremente: cada ronda usa solo 10 preguntas elegidas al azar
(ver "Flujo principal"), así que cuantas más haya, menos se repiten entre rondas.

## Flujo principal

1. La usuaria entra a la ruta `Quiz`.
2. El quiz carga y valida el banco de preguntas.
3. El quiz elige al azar una ronda de 10 preguntas distintas del banco. La ronda se
   elige una sola vez al entrar y no cambia mientras dura.
4. Se muestra la primera pregunta de la ronda (su enunciado) en una tarjeta.
5. La usuaria responde de una de dos formas equivalentes:
   - deslizando la tarjeta (swipe): una dirección = "mito", la otra = "realidad";
   - o pulsando uno de los dos botones "Mito" / "Realidad".
6. El quiz compara la respuesta con la correcta y registra si acertó.
7. Se muestra retroalimentación inmediata: si acertó o no, y la explicación
   científica de esa pregunta.
8. La usuaria avanza a la siguiente pregunta.
9. Se repite hasta terminar las 10 preguntas de la ronda.
10. Al terminar, la app navega a la ruta `Resultados` pasando la lista de
    respuestas dadas (para cada pregunta, su `id` y si se acertó).

### Salir a mitad de ronda

- Si la usuaria intenta salir del quiz (flecha del encabezado, botón "Volver" o gesto
  de retroceso) después de haber respondido al menos una pregunta, la app pide
  confirmación: avisa de que el progreso de la ronda se perderá y ofrece
  "Seguir jugando" o "Salir".
- Si confirma, sale y el progreso se descarta. La próxima vez que entre empieza una
  ronda nueva.
- Si todavía no ha respondido nada, sale sin preguntar.
- Terminar la ronda y pasar a `Resultados` no pide confirmación.

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
- Si el banco tiene menos de 10 preguntas válidas, la ronda usa todas las que haya.
- Si el usuario tiene activada la reducción de movimiento, el quiz funciona igual
  sin animación de swipe (la respuesta sigue disponible por botones y por un
  gesto sin animación).
- (Carga y error de red no aplican: el banco de preguntas es local.)

## Resultado esperado

La usuaria responde las 10 preguntas de su ronda, recibe retroalimentación
científica tras cada una, y al final llega a la pantalla de resultados con su
conteo de aciertos. Cada vez que vuelve a entrar al quiz le toca una ronda nueva.

## Estados de la pantalla

- Pregunta sin responder: se muestra el enunciado y los controles de respuesta.
- Pregunta respondida: se muestra la retroalimentación (acierto/fallo +
  explicación) y el control para avanzar.
- Intento de salir con la ronda empezada: aviso de confirmación (ver "Salir a mitad
  de ronda").
- Sin preguntas disponibles: mensaje de error con opción de volver.

## Criterios de aceptación

- [X] Existe la interface `Pregunta` con `respuesta: "mito" | "realidad"`.
- [X] Existe `data/quiz.json` validado en la frontera (type guard propio).
- [X] Una pregunta con `respuesta` distinta de "mito"/"realidad" se descarta.
- [X] El quiz muestra las preguntas una por una.
- [X] Cada ronda tiene 10 preguntas distintas elegidas al azar del banco (o todas
      las que haya, si el banco tiene menos de 10).
- [X] La ronda no cambia mientras se juega, aunque la pantalla se redibuje.
- [X] Dos entradas al quiz no repiten necesariamente las mismas preguntas ni el
      mismo orden.
- [X] Salir con al menos una pregunta respondida pide confirmación y avisa de que
      el progreso se pierde.
- [X] Salir sin haber respondido nada no pide confirmación.
- [X] Terminar la ronda y pasar a `Resultados` no pide confirmación.
- [X] La usuaria puede responder por swipe Y por botones (ambas equivalentes).
- [X] Tras responder, se muestra si acertó y la explicación científica.
- [X] La usuaria puede avanzar a la siguiente pregunta.
- [X] Al terminar, se navega a `Resultados` con la lista de respuestas dadas
      (id de cada pregunta y si se acertó).
- [X] Con reducción de movimiento activada, el quiz funciona sin animación de swipe.
- [X] El puntaje se calcula de las respuestas, sin contador paralelo.
- [X] Todo el texto se renderiza dentro de componentes `Text`.

## Tasks

- [X] Crear la interface `Pregunta` en `types/` (con `respuesta: "mito" | "realidad"`).
- [X] Crear `data/quiz.json` con un banco inicial de preguntas (10-15).
- [X] Crear el cargador validado `loadQuiz` con su type guard (patrón de `loadSharks`).
- [X] Elegir una ronda de 10 preguntas al azar (constante `PREGUNTAS_POR_RONDA`) y
      fijarla al entrar a la pantalla con el estado inicial perezoso de `useState`.
- [X] Registrar la ruta `Quiz` en el stack.
- [X] Crear la pantalla `QuizScreen` en `screens/`, tipada con `NativeStackScreenProps`.
- [X] Manejar el estado del quiz: pregunta actual y respuestas registradas.
- [X] Mostrar la pregunta actual en una tarjeta.
- [X] Implementar los botones "Mito" / "Realidad" (vía base de respuesta).
- [X] Implementar el swipe con gesture-handler + Reanimated, respetando reduce-motion.
- [X] Mostrar retroalimentación por pregunta (acierto/fallo + explicación).
- [X] Registrar cada respuesta (id + si acertó) y navegar a `Resultados` con esa
      lista al terminar.

- [X] Manejar el caso de banco de preguntas vacío.
- [X] Pedir confirmación al salir a mitad de ronda (evento `beforeRemove`), sin avisar
      al terminar la ronda ni si no se ha respondido nada.
- [X] Ampliar el banco de preguntas (el quiz usa 10 por ronda).
- [X] Verificar los criterios de aceptación de F04.
