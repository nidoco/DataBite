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

La definición se ajustó tras medir la cobertura real de las fuentes (Wikidata y
FishBase v26.06, sobre 536 especies vivas con estado de la UICN e ID de FishBase).
La definición inicial, con siete campos obligatorios en texto en español, la
cumplían unas 239 especies, y ninguna fuente trae el rasgo distintivo.

**Obligatorios.** Una especie se incluye solo si tiene:

- nombre científico;
- estado de conservación (categoría UICN);
- longitud máxima en metros (FishBase la entrega en centímetros: se convierte).

**Con regla de respaldo:**

- nombre común: el nombre en español de FishBase cuando existe; si no, el nombre
  científico. Cuando hay varios nombres en español para una especie, el script
  aplica una regla fija y documentada para elegir uno.
- hábitat y forma del cuerpo: se traducen al español desde los códigos de
  FishBase con una tabla de equivalencias escrita a mano.

**Opcionales** (la ficha muestra "No disponible" cuando faltan, nunca un valor
inventado):

- `pesoKg`: solo ~15 % de las especies tiene un peso documentado.
- `alimentacion`: FishBase la entrega como datos estructurados (tipo de
  alimentación y presas) y solo cubre ~46 % de las especies.
- `rasgoDistintivo`: ninguna fuente lo trae. Queda para las especies escritas a
  mano.

Cobertura medida sobre las 536 especies: longitud 490, nombre en español 342,
peso 81, alimentación ~250. Se espera un catálogo de unas 490 especies, cifra que
se confirma con el informe de cobertura.

## Fuentes y condiciones de uso

Se revisaron los términos de cada fuente (consulta de términos de uso hecha antes
de escribir el script):

| Fuente | Uso previsto | Condiciones |
|---|---|---|
| Wikidata | Lista base de especies y nombres | Licencia CC0, sin restricciones. Se menciona como origen. |
| FishBase | Longitud máxima y otras medidas | Uso no comercial con atribución (CC BY-NC). |
| UICN Lista Roja | Estado de conservación | Uso no comercial. Sus términos prohíben republicar o redistribuir los datos, incluidos los productos derivados. La API requiere cuenta y token personales. |

Decisión de la desarrolladora: usar los datos de las tres fuentes, incluidos los de
la UICN, bajo estas condiciones:

- El proyecto es personal y no comercial: sin anuncios, sin venta y sin cuentas
  de pago.
- El repositorio es privado y los datos de la UICN no se publican en ningún lugar
  público.
- La app se usa en dispositivos propios. No se comparte un instalable ni un enlace
  de la app con los datos incrustados sin revisar antes si eso cuenta como
  redistribución.
- Se cita a la UICN y se da atribución a FishBase y a Wikidata dentro de la app y
  en el README.
- El token de la API de la UICN es personal, vive en un archivo fuera del
  repositorio y nunca se sube a Git.

Riesgo asumido: distribuir la app con los datos de la UICN incluidos puede
incumplir sus términos. Si el proyecto deja de ser personal, hay que volver a
revisar esta sección antes de publicar.

## Precondiciones

- Existe una fuente de lista base de especies (Wikidata, a confirmar con la
  prueba de cobertura).
- Existe una fuente para medidas (FishBase) y otra para estado de conservación
  (UICN).
- Se revisaron los términos de uso y la atribución de cada fuente antes de
  incluir sus datos.
- La desarrolladora tiene una cuenta y un token de la API de la UICN.

## Datos de entrada

- Listas de especies y sus atributos, obtenidas de las fuentes elegidas.
- Tablas de FishBase v26.06 en formato Parquet (`species`, `comnames`, `ecology`,
  `fooditems`), publicadas en Source Cooperative con licencia CC BY-NC.
- Tabla de equivalencias a español de los códigos de hábitat y forma del cuerpo de
  FishBase, escrita a mano.

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
- [ ] Toda especie del JSON tiene nombre científico, estado de conservación y
      longitud.
- [ ] Toda especie sin nombre en español muestra su nombre científico como nombre.
- [X] `pesoKg`, `alimentacion` y `rasgoDistintivo` son opcionales en el modelo y
      en su validación.
- [ ] Una especie con uno de esos campos con tipo incorrecto se descarta; una sin
      el campo se acepta.
- [ ] La ficha de detalle muestra "No disponible" cuando falta peso, alimentación
      o rasgo distintivo.
- [ ] Los `id` son únicos y con formato de slug.
- [ ] El JSON generado pasa la validación de `loadSharks` sin descartes inesperados.
- [ ] El catálogo muestra las especies cargadas con scroll fluido.
- [ ] Las fuentes y su atribución quedan registradas en el proyecto.
- [ ] La app muestra una sección de créditos con Wikidata, FishBase y la UICN.
- [ ] El token de la UICN no aparece en ningún archivo del repositorio.
- [ ] La app no hace ninguna petición de red.

## Decisiones abiertas

- Estado de conservación: la UICN puede negar o revocar el token por tratarse de
  una app móvil y un curso. La consulta a Wikidata ya trae el estado de casi todas
  las especies vivas, pero no se verificó si esos valores heredan las restricciones
  de la UICN. Se consulta a `redlist@iucn.org` antes de generar el JSON final.
- Alimentación: cómo convertir los datos estructurados de FishBase en un texto
  corto en español.
- Nueve especies cuyo nombre científico difiere entre Wikidata y FishBase (por
  sinónimos taxonómicos) requieren revisión a mano.
- Búsqueda y filtrado: con cientos de especies pasan a ser casi necesarios; se
  decide si entran en una feature propia.

## Decisiones tomadas

- Los tres campos obligatorios son nombre científico, estado de conservación y
  longitud.
- Si una especie no tiene nombre común en español, el catálogo muestra el nombre
  científico. Unas 148 especies mostrarán un nombre latino.
- `alimentacion` y `rasgoDistintivo` pasan a ser opcionales en el modelo.

## Tasks

- [X] Revisar términos de uso y atribución de las fuentes candidatas.
- [ ] Crear la cuenta de la UICN, solicitar el token y guardarlo fuera del
      repositorio (agregar su archivo al `.gitignore`).
- [X] Hacer `pesoKg` opcional en `Morfologia` y en `esMorfologia`.
- [X] Mostrar "No disponible" en `DetalleScreen` cuando falte el peso.
- [X] Medir la cobertura de datos de Wikidata y FishBase (prueba previa).
- [ ] Hacer `alimentacion` y `rasgoDistintivo` opcionales en `Morfologia`/`Shark`,
      en sus type guards y en `DetalleScreen`.
- [ ] Consultar a `redlist@iucn.org` por el uso de sus datos en una app educativa.
- [ ] Escribir la tabla de equivalencias a español de los códigos de hábitat y
      forma del cuerpo de FishBase.
- [ ] Crear el script de obtención de la lista base de especies.
- [ ] Crear la combinación de atributos por especie y la regla de "datos completos".
- [ ] Definir y documentar la regla para elegir un nombre en español cuando hay
      varios.
- [ ] Revisar a mano las especies con nombre científico distinto entre fuentes.
- [ ] Generar el informe de cobertura y revisarlo.
- [ ] Generar `data/sharks.json` y validarlo con `loadSharks`.
- [ ] Agregar la sección de créditos y atribución en la app y en el README.
- [ ] Verificar los criterios de aceptación de F07.
