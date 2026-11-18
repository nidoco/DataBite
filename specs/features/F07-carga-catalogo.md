# Feature: F07 - Carga del catálogo completo de especies

## Objetivo

Ampliar el catálogo de las 4 especies de ejemplo a todas las especies de
tiburones vivos que tengan datos verificables, generando `data/sharks.json` una
sola vez a partir de fuentes estructuradas y produciendo un informe de cobertura
que diga cuántas especies se incluyeron y cuántas se descartaron, con el motivo.

La app sigue siendo offline: la consulta a fuentes externas ocurre solo en
desarrollo, nunca en la app instalada.

## Actor

La desarrolladora (proyecto personal), al preparar los datos. La usuaria de la
app solo ve el resultado en el catálogo (F01).

## Definición de "datos completos"

Una especie se incluye solo si tiene:

- nombre común en español;
- nombre científico;
- estado de conservación (categoría UICN);
- longitud máxima en metros;
- hábitat;
- alimentación;
- forma del cuerpo y rasgo distintivo.

`pesoKg` es opcional: para muchas especies no existe un peso documentado, y
exigirlo descartaría especies válidas. Si falta, la ficha muestra
"No disponible" en lugar de inventar un valor.

## Precondiciones

- Existe una fuente de lista base de especies (por definir tras la prueba de
  cobertura).
- Existe al menos una fuente para medidas y otra para estado de conservación.
- Se revisaron los términos de uso y la atribución de cada fuente antes de
  incluir sus datos.

## Datos de entrada

- Listas de especies y sus atributos, obtenidas de las fuentes elegidas.
- Traducción al español de hábitat y alimentación, cuando la fuente venga en otro
  idioma (decisión pendiente: ver "Decisiones abiertas").

## Flujo principal

1. La desarrolladora ejecuta el script de carga (en su computadora, no en la app).
2. El script obtiene la lista base de especies.
3. Para cada especie, obtiene y combina los atributos de las fuentes.
4. El script aplica la definición de "datos completos" y separa las especies en
   incluidas y descartadas, anotando el campo que faltó en cada descarte.
5. El script escribe un informe de cobertura (totales, incluidas, descartadas y
   campos faltantes más frecuentes).
6. Tras revisar el informe, la desarrolladora decide si genera `data/sharks.json`.
7. El archivo generado pasa por la validación de `loadSharks` al abrir la app.

## Validaciones

- Los `id` son slugs únicos; si dos especies producen el mismo slug, el script lo
  detecta y lo reporta en lugar de sobrescribir.
- Los valores numéricos se guardan como número, sin unidad ni texto.
- Cada especie incluida cumple la definición de "datos completos".
- El archivo final se valida con el mismo type guard que usa la app.
- Los datos de cada especie conservan la referencia de su fuente (en el informe).

## Casos de error / degradación

- Si una fuente no responde o limita las peticiones, el script se detiene con un
  mensaje claro, sin escribir un JSON parcial como si estuviera completo.
- Si el script se interrumpe, puede reanudarse sin repetir todo desde cero.
- Si una especie tiene datos contradictorios entre fuentes, se descarta y se
  reporta, no se elige una al azar.
- Si el catálogo resultante queda vacío, no se reemplaza el JSON existente.
- (En la app: carga y error de red no aplican; los datos son locales.)

## Resultado esperado

Un `data/sharks.json` con todas las especies que cumplen "datos completos", más un
informe que permite defender el número exacto de especies incluidas y por qué el
resto quedó fuera.

## Criterios de aceptación

- [ ] El informe de cobertura existe y muestra incluidas, descartadas y motivos.
- [ ] Toda especie del JSON cumple la definición de "datos completos".
- [ ] `pesoKg` es opcional en `Morfologia` y en su validación.
- [ ] La ficha de detalle muestra "No disponible" cuando falta el peso.
- [ ] Los `id` son únicos y con formato de slug.
- [ ] El JSON generado pasa la validación de `loadSharks` sin descartes inesperados.
- [ ] El catálogo muestra las especies cargadas con scroll fluido.
- [ ] Las fuentes y su atribución quedan registradas en el proyecto.
- [ ] La app no hace ninguna petición de red.

## Decisiones abiertas

- Fuentes concretas y su cobertura real (se confirma con el informe, no antes).
- Idioma: ¿traducir hábitat y alimentación o dejar el catálogo bilingüe?
- Búsqueda y filtrado: con cientos de especies pasan a ser casi necesarios; se
  decide si entran en una feature propia.

## Tasks

- [ ] Revisar términos de uso y atribución de las fuentes candidatas.
- [ ] Hacer `pesoKg` opcional en `Morfologia` y en `esMorfologia`.
- [ ] Mostrar "No disponible" en `DetalleScreen` cuando falte el peso.
- [ ] Crear el script de obtención de la lista base de especies.
- [ ] Crear la combinación de atributos por especie y la regla de "datos completos".
- [ ] Generar el informe de cobertura y revisarlo.
- [ ] Decidir el criterio de idioma y resolver la traducción.
- [ ] Generar `data/sharks.json` y validarlo con `loadSharks`.
- [ ] Verificar los criterios de aceptación de F07.
