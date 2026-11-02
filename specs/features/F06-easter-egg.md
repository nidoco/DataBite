# Feature: F06 - Easter Egg (acertijo y especies extintas)

## Objetivo

Sorprender a la usuaria con un acertijo oculto de aparición poco probable durante
el quiz. Al resolverlo correctamente, se desbloquea de forma permanente una
especie extinta en el catálogo. Si falla, el intento se cierra con un mensaje
amable y el quiz continúa con normalidad.

## Actor

La usuaria de la app (proyecto personal).

## Precondiciones

- La usuaria está realizando el quiz (F04).
- Existe el banco de acertijos (`data/acertijos.json`), validado en la frontera.
- Existe almacenamiento local para recordar qué especies se han desbloqueado.
- En los datos de especies existen tiburones marcados como extintos/bloqueados.

## Datos de entrada

- Cada acertijo (`Acertijo`) tiene:
  - `id`: identificador (slug);
  - `enunciado`: el texto del acertijo;
  - `respuestasAceptadas`: lista de respuestas válidas (strings), para contemplar
    variantes legítimas;
  - `sharkId`: el `id` de la especie extinta que desbloquea (queda atado a ella).
- La respuesta que escribe la usuaria (texto libre, vía `TextInput`).

## Flujo principal

1. Durante el quiz, al avanzar de pregunta, se evalúa una probabilidad baja de
   que aparezca un acertijo.
2. Si no se dispara, el quiz sigue normal.
3. Si se dispara, se elige un acertijo cuya especie asociada aún esté bloqueada
   y la app cambia a la pantalla/evento del acertijo.
4. Se muestra el enunciado y un campo de texto para responder.
5. La usuaria escribe su respuesta y la envía.
6. La respuesta se normaliza (minúsculas, sin espacios sobrantes, sin acentos) y
   se compara con las `respuestasAceptadas` (también normalizadas).
7. Si acierta:
   - se desbloquea la especie asociada (`sharkId`) de forma permanente (se guarda);
   - se muestra un mensaje de éxito indicando la especie desbloqueada;
   - se vuelve al quiz y continúa.
8. Si falla, se le permite reintentar hasta un máximo de 3 intentos en esa
   aparición.
9. Si agota los 3 intentos, se cierra el acertijo con un mensaje amable
   (ej. "¡Suerte para la próxima!") y el quiz continúa. No hay bloqueo permanente:
   el acertijo podrá reaparecer más adelante.

## Interacción y validación de formulario

- El campo de respuesta usa `TextInput` con validación: el botón de enviar está
  deshabilitado mientras el campo esté vacío.
- La comparación de la respuesta es tolerante al formato (normalización), para no
  rechazar una respuesta correcta por mayúsculas, acentos o espacios.
- Los controles dan feedback táctil inmediato (`Pressable`).
- El contador de intentos se muestra de forma clara (ej. "Intento 2 de 3").

## Persistencia

- El conjunto de especies desbloqueadas se guarda en almacenamiento local.
- Al arrancar la app, ese conjunto se lee y se valida en la frontera antes de
  usarse (no se confía en el dato almacenado sin verificar su forma).
- El catálogo (F01/F03) usa ese conjunto para decidir qué especies extintas
  mostrar.

## Validaciones

- `data/acertijos.json` se valida con un type guard propio; un acertijo con datos
  inválidos (sin `sharkId`, sin respuestas, etc.) se descarta.
- El `sharkId` de un acertijo debe corresponder a una especie extinta existente.
- El número de intentos nunca supera 3 (una sola fuente de verdad para el contador).
- Todo el texto se renderiza dentro de componentes `Text`.

## Casos de error / degradación

- Si no queda ningún acertijo con especie aún bloqueada (todas desbloqueadas), el
  Easter Egg simplemente no se dispara.
- Si falla la lectura del almacenamiento (dato corrupto o ausente), se asume que
  no hay especies desbloqueadas todavía, sin romper la app.
- Si el `sharkId` de un acertijo no corresponde a ninguna especie, ese acertijo se
  descarta en la validación.
- (Carga y error de red no aplican: todos los datos son locales.)

## Resultado esperado

La usuaria que resuelve un acertijo desbloquea una especie extinta concreta, que
queda disponible en el catálogo de forma permanente entre sesiones. Si falla, no
pierde nada ni queda bloqueada: el reto puede volver a aparecer.

## Estados de la pantalla

- Acertijo activo: enunciado, campo de respuesta y contador de intentos.
- Acierto: mensaje de éxito con la especie desbloqueada.
- Fallo final (3 intentos): mensaje amable de cierre.

## Criterios de aceptación

- [ ] Existe la interface `Acertijo` con `sharkId` y `respuestasAceptadas`.
- [ ] Existe `data/acertijos.json` validado en la frontera (type guard propio).
- [ ] La interface `Shark` tiene un campo que marca a las especies extintas/bloqueadas.
- [ ] El acertijo aparece con probabilidad baja durante el quiz, solo si su especie
      sigue bloqueada.
- [ ] La respuesta se compara de forma normalizada (mayúsculas, acentos, espacios).
- [ ] Al acertar, la especie asociada se desbloquea y se guarda de forma persistente.
- [ ] La especie desbloqueada aparece en el catálogo tras desbloquearse, incluso
      al reabrir la app.
- [ ] El máximo de intentos es 3; al agotarlos se cierra con mensaje amable.
- [ ] Tras fallar, no hay bloqueo permanente: el acertijo puede reaparecer.
- [ ] La lectura del almacenamiento se valida en la frontera.
- [ ] Todo el texto se renderiza dentro de componentes `Text`.

## Tasks

- [ ] Agregar a la interface `Shark` el campo de especie extinta/bloqueada.
- [ ] Marcar en `data/sharks.json` las especies extintas correspondientes.
- [ ] Crear la interface `Acertijo` en `types/` (con `sharkId` y `respuestasAceptadas`).
- [ ] Crear `data/acertijos.json` con los acertijos y su especie asociada.
- [ ] Crear el cargador validado `loadAcertijos` con su type guard.
- [ ] Crear el módulo de persistencia de especies desbloqueadas (guardar/leer con
      validación en la frontera).
- [ ] Implementar la probabilidad de aparición del acertijo durante el quiz.
- [ ] Crear la pantalla/evento del acertijo con `TextInput`, validación y contador
      de intentos (máximo 3).
- [ ] Implementar la normalización y comparación de la respuesta.
- [ ] Al acertar, desbloquear y persistir la especie; mostrar éxito y volver al quiz.
- [ ] Al agotar intentos, cerrar con mensaje amable y volver al quiz.
- [ ] Hacer que el catálogo muestre las especies extintas solo si están desbloqueadas.
- [ ] Verificar los criterios de aceptación de F06.
