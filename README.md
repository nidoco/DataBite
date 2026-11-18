# Notas sobre el proyecto

### Semana 1 
#### **Fecha:** 14/09/2026
Configuración inicial del proyecto en Expo con plantilla TypeScript

### Semana 2

#### Commit: estructura inicial y limpieza de App.tsx
- Carpetas creadas: screens, components, data y types.
- App.tsx limpiado, solo dejando un título.

#### Commit: modelo de datos de especies
- Interfaces Shark y Morfologia en types/shark.ts.
- data/sharks.json con 4 especies.
- Decisión: id string por ser app sin backned, morfología como objeto anidado.

#### Commit: carga y validación en la frontera
- data/loadSharks.ts con type guards esShark y esMorfologia.
- loadSharks() devuelve Shark[] validado.
- **Verificación:** hice un conteo temporal en App.tsx y probé en Expo Go:
  - JSON válido: "4 especies cargadas".
  - Rompí un dato (pesoKg: "mucho"): "3 especies cargadas" el tiburón inválido fue descartado.
  - Restauré el JSON: 4 de nuevo. Se confirma la validación en tiempo de ejecución.


### Semana 3
#### **Fecha:** 04/10/2026

#### Commit: base de especificaciones del proyecto
- Antes de seguir programando, escribí en la carpeta `specs` qué es DataBite, para quién es y qué funciones va a tener.
- También escribí la primera función completa (el catálogo): qué debe hacer y cómo sé que quedó bien.
- Aprendí que conviene decidir qué voy a hacer antes de escribir el código.

#### Commit: tarjeta de cada tiburón (SharkCard)
- Hice la tarjeta que muestra el nombre y el nombre científico de un tiburón.
- La tarjeta recibe un tiburón y solo lo muestra. Todo el texto va dentro de `Text`.

#### Commit: pantalla del catálogo
- La pantalla muestra una tarjeta por cada tiburón usando `FlatList`.
- Si no hay tiburones sale el mensaje "Sin especies" en vez de una pantalla vacía.
- Lo probé dejando el archivo de datos vacío y salió el mensaje.

#### Commit: colores del catálogo
- Puse fondo azul oscuro, tarjetas azules y letras turquesa, como el mar.
- Les puse esquinas redondeadas a las tarjetas.

### Semana 7
#### **Fecha:** 01/11/2026

#### Commit: specs del MVP
- Terminé de escribir qué hace cada parte de la app: detalle, galería, quiz, resultados y el reto escondido (Easter egg). También cómo se pasa de una pantalla a otra.
- Cambié el detalle para usar navegación de verdad, como vimos en clase, y no un truco con estado.
- Revisé que las specs no se contradijeran entre sí.
- Ayuda de IA: me ayudó a redactar las specs y a revisar que fueran coherentes. Yo decidí qué entraba y qué no.

#### Commit: actualización a Expo SDK 58
- Mi Expo Go del teléfono era versión 58 y mi proyecto era 57, y no abría. Actualicé el proyecto a la 58.
- Después de actualizar volví a abrir la app y funcionó.

#### Commit: navegación con stack
- Instalé React Navigation y definí qué pantallas existen y qué dato recibe cada una.
- Armé el encabezado azul con el título "DataBite".
- Me salió un error que decía que el texto debía ir dentro de `Text`. Era un comentario que dejé dentro del navegador. Lo quité y se arregló.
- También había espacio de más debajo del encabezado. Lo arreglé cambiando el contenedor de la pantalla.

### Semana 8
#### **Fecha:** 02/11/2026

#### Commit: ir del catálogo al detalle
- Hice que la tarjeta se pueda tocar. Al tocarla abre la pantalla de detalle y le manda el id del tiburón.
- Lo probé en mi teléfono: al tocar una tarjeta aparece la pantalla "Ficha" y la flecha del encabezado me regresa al catálogo.

### Semana 9
#### **Fecha:** 14/11/2026

#### Commit: buscar un tiburón por su id
- Hice una función que busca un tiburón con su id. Si no existe, avisa que no lo encontró.

#### Commit: especie no encontrada
- Si el id no existe, el detalle muestra "Especie no encontrada" y un botón para volver.
- Lo probé mandando un id inventado y salió el mensaje. Después quité la prueba.
- Al botón le cambié el estilo porque se veía feo y pegado al texto.

#### Commit: ficha completa de la especie
- El detalle ahora muestra todo: nombre, nombre científico, estado de conservación, medidas, hábitat y alimentación.
- Los números salen con su unidad, por ejemplo "6 m" y "1200 kg". En los datos siguen siendo solo números.
- Hice un componente chico (`DatoFicha`) para no repetir el mismo código en cada dato.
- Agrupé los datos en dos tarjetas para que se vea más ordenado.

#### Commit: pantalla horizontal
- La app solo se veía en vertical. Cambié la configuración para que gire.
- Al girar, la parte de arriba del iPhone tapaba un poquito las tarjetas. Lo arreglé protegiendo los lados de la pantalla.

#### Commits: dependencias y tareas
- Expo actualizó solo unas versiones pequeñas. No cambié nada a mano.
- Marqué en las specs las tareas que ya estaban hechas.

### Semana 10
#### **Fecha:** 17/11/2026 y 18/11/2026

#### Commit: el peso ya no es obligatorio
- Descubrí que no todos los tiburones tienen un peso conocido. Ahora el peso puede faltar y la ficha dice "No disponible".
- Hice dos pruebas. Sin peso, el tiburón aparece con "No disponible". Con el peso escrito como "mucho", el tiburón ya no aparece, porque el dato está mal.

#### Commit: spec para cargar más especies (F07)
- Quiero que el catálogo tenga todas las especies que se pueda y no solo cuatro. Escribí la spec de cómo lo voy a hacer.
- Revisé las reglas de uso de las fuentes de datos (Wikidata, FishBase y la UICN). La UICN dice que puede limitar su acceso a apps móviles y a cursos. Voy a escribirles para preguntar.
- Ayuda de IA: midió cuántas especies tienen datos. Wikidata tiene 536 tiburones vivos con estado de conservación. FishBase tiene longitud para 490, nombre en español para 342 y peso para solo 81.

#### Commit: alimentación y rasgo distintivo opcionales
- Ninguna fuente trae el rasgo distintivo y la alimentación solo está en la mitad de las especies. Los hice opcionales, igual que el peso.
- Probé 9 casos con datos completos, incompletos y mal escritos, y todos respondieron como esperaba.

#### Commit: nueva definición de "datos completos"
- Con lo que medí, cambié qué datos son obligatorios: nombre científico, estado de conservación y longitud. Con eso salen unas 490 especies.
- Si una especie no tiene nombre en español, se muestra el nombre científico.

