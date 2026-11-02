# Feature: F05 - Resultados y retroalimentación

## Objetivo

Mostrar a la usuaria un resumen de su desempeño al terminar el quiz (cuántas
acertó) y un repaso de las preguntas que falló, con la respuesta correcta y la
explicación científica de cada una, para reforzar lo que conviene aprender.

## Actor

La usuaria de la app (proyecto personal).

## Precondiciones

- La usuaria completó el quiz (F04).
- La navegación por stack (ver `01-navigation.md`) está configurada; resultados
  es la ruta `Resultados`.
- El banco de preguntas (`loadQuiz`) está disponible para recuperar las preguntas
  falladas por su `id`.

## Datos de entrada

La pantalla recibe por parámetro de ruta la lista de respuestas dadas en el quiz:
para cada pregunta, su `id` y si se acertó (`{ id: string; acerto: boolean }[]`).

A partir de esa lista:
- se calculan los aciertos y el total (no se reciben por separado);
- se obtienen los `id` de las preguntas falladas, y con ellos se recuperan las
  preguntas completas desde el banco validado para mostrar su explicación.

## Flujo principal

1. La usuaria termina la última pregunta del quiz.
2. El quiz navega a `Resultados` pasando la lista de respuestas dadas.
3. La pantalla calcula aciertos y total a partir de esa lista.
4. Muestra el resumen (ej. "Acertaste 8 de 12") y un mensaje acorde al desempeño.
5. Si hubo preguntas falladas, muestra un repaso solo de esas: enunciado,
   respuesta correcta y explicación científica de cada una.
6. Si no falló ninguna, muestra un mensaje de felicitación sin lista de repaso.
7. La usuaria puede volver al inicio (catálogo) o reintentar el quiz.

## Validaciones

- Los aciertos y el total se derivan de la lista de respuestas; no hay un contador
  paralelo (una sola fuente de verdad).
- Las preguntas falladas se recuperan por `id` desde el banco validado por
  `loadQuiz`.
- Todo el texto se renderiza dentro de componentes `Text`.

## Casos de error / degradación

- Si la lista de respuestas llega vacía (situación inesperada), la pantalla
  muestra un mensaje neutro ("no hay resultados que mostrar") y permite volver,
  en lugar de romper.
- Si un `id` fallado no se encuentra en el banco (datos que cambiaron), esa
  entrada del repaso se omite en lugar de romper la pantalla.
- (Carga y error de red no aplican: los datos son locales.)

## Resultado esperado

La usuaria ve cuántas preguntas acertó y, si falló algunas, puede repasar esas
preguntas con su respuesta correcta y explicación, pudiendo luego reintentar o
volver al catálogo.

## Estados de la pantalla

- Con fallos: resumen + lista de repaso de las preguntas falladas.
- Sin fallos: resumen + mensaje de felicitación, sin lista.
- Sin resultados (caso inesperado): mensaje neutro con opción de volver.

## Criterios de aceptación

- [ ] La pantalla recibe la lista de respuestas dadas por parámetro de ruta.
- [ ] Los aciertos y el total se calculan de esa lista (no se pasan por separado).
- [ ] Se muestra el resumen del desempeño (aciertos sobre total).
- [ ] Se muestra un repaso solo de las preguntas falladas, con su respuesta
      correcta y explicación científica.
- [ ] Si no se falló ninguna, no se muestra lista de repaso, sino felicitación.
- [ ] Existe una acción para reintentar el quiz y otra para volver al catálogo.
- [ ] Un `id` fallado que no exista en el banco se omite sin romper la pantalla.
- [ ] Todo el texto se renderiza dentro de componentes `Text`.

## Tasks

- [ ] Ajustar el parámetro de la ruta `Resultados` en `RootStackParamList`
      (lista de respuestas dadas) — ver `01-navigation.md`.
- [ ] Crear la pantalla `ResultadosScreen` en `screens/`, tipada con
      `NativeStackScreenProps`.
- [ ] Calcular aciertos y total a partir de la lista de respuestas.
- [ ] Recuperar las preguntas falladas por `id` desde `loadQuiz`.
- [ ] Mostrar el resumen y el mensaje según desempeño.
- [ ] Renderizar el repaso de las falladas (respuesta correcta + explicación).
- [ ] Agregar las acciones de reintentar y volver al catálogo.
- [ ] Manejar los casos de lista vacía e `id` no encontrado.
- [ ] Verificar los criterios de aceptación de F05.
