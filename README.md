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

#### Commit: proteger la llave de la UICN
- La UICN aprobó mi solicitud y me dio una llave para pedir sus datos. La primera que copié no funcionaba, generé otra y esa sí.
- Guardé la llave en un archivo que no se sube a GitHub, y revisé que no apareciera en ningún otro archivo del proyecto.

#### Commits: el programa que arma el catálogo
- Hice un programa que junta los datos de tres lugares: la lista de tiburones de Wikidata, el estado de conservación de la UICN y las medidas y nombres de FishBase.
- Le pide los datos a la UICN despacio, con una pausa entre cada tiburón, y los guarda para no volver a pedirlos.
- 11 tiburones no los encontraba la UICN porque los escribe con otro nombre. Los busqué por su número de la UICN y así salieron todos.
- Ayuda de IA: me ayudó a escribir el programa y a revisar los datos. La tabla para pasar al español el hábitat, la forma del cuerpo y lo que comen la pedí a otra IA, y corregí algunas palabras que no cuadraban con los datos.

#### Commit: la longitud ya no es obligatoria
- 45 tiburones no tenían longitud conocida y se quedaban fuera. Decidí incluirlos y que la ficha diga "No disponible", igual que con el peso.

#### Commit: catálogo de 535 especies
- El catálogo pasó de 4 tiburones a 535. Solo quedó fuera uno que no tiene ficha en FishBase.
- Mis 4 tiburones que escribí a mano se conservaron igual.
- Lo probé en el teléfono y la lista se mueve bien aunque sea tan larga.

#### Commits: banco de preguntas del quiz
- Pedí preguntas de mito o realidad a dos IAs. Al juntarlas se repetían temas y dos preguntas tenían el mismo nombre, así que quité las repetidas.
- Hice que el quiz revise cada pregunta antes de usarla y descarte las que estén mal escritas.

#### Commits: pantallas del quiz y de resultados
- Agregué un botón "Quiz" arriba a la derecha del catálogo.
- El quiz muestra una pregunta, dos botones (Mito y Realidad) y, al contestar, si acerté y la explicación. Después paso a la siguiente.
- Al final aparece "Acertaste X de 10".
- Me equivoqué varias veces con cuándo mostrar los botones y cuándo la explicación. Una vez la app se iba a romper porque intentaba leer una respuesta que todavía no existía.

#### Commit: rondas de 10 preguntas al azar
- Ahora cada vez que entro al quiz me tocan 10 preguntas distintas y en otro orden.
- Lo probé varias veces y la primera pregunta casi siempre cambia.

#### Commit: confirmar antes de salir
- Si salgo a la mitad de una ronda, la app me pregunta si estoy segura, porque se pierde lo que llevo.
- Funciona con la flecha de arriba, con el botón "Volver" y al deslizar. Si no he contestado nada o si terminé la ronda, no pregunta.

#### Commit: contestar deslizando la tarjeta
- Ahora también puedo contestar deslizando la tarjeta: a la izquierda es mito y a la derecha es realidad. Los botones siguen funcionando.
- Si en el teléfono está activado "reducir movimiento", la tarjeta no se mueve pero igual se puede contestar.
- Al probar, deslizar hacia un lado me sacaba del quiz. Era porque el teléfono tiene su propio gesto para regresar y chocaba con el de la tarjeta. Lo desactivé solo en la pantalla del quiz.

#### Ampliar el banco de preguntas
- Pedí más preguntas y el banco pasó de 30 a 100: 47 mitos y 53 realidades.
- Revisé que ninguna se repitiera ni tuviera el mismo nombre que otra.

### Semana 11

#### Commit: guardar las listas en el teléfono
- Instalé AsyncStorage, que es la memoria que guarda datos en el teléfono aunque cierre la app.
- Hice dos funciones: una lee una lista guardada y otra la guarda. Si el dato está dañado o no existe, la app empieza con una lista vacía en vez de romperse.
- Ayuda de IA: me ayudó a revisar que la lectura validara el dato antes de usarlo. Las funciones las escribí yo.

#### Commit: contexto de progreso
- Creé un contexto que guarda las especies desbloqueadas y las favoritas. Cualquier pantalla puede leerlo sin pasar los datos de una en una.
- Al abrir la app, primero carga las listas guardadas y mientras tanto no cambia nada.
- Ayuda de IA: me señaló que estaba guardando dentro de la función que actualiza la lista, y que eso podía escribir dos veces. Lo cambié para que se guarde cuando la lista cambia y ya cargó.

#### Commit: botón de favorita en la ficha
- En la ficha de cada tiburón hay un botón "Agregar a favoritas". Al tocarlo cambia a "Favorita".
- Lo probé en mi teléfono: la favorita se queda marcada aunque cierre la app, y al tocarla otra vez se quita.

#### Commit: spec de persistencia (F08)
- Escribí la spec para guardar datos en el teléfono antes de programarla, igual que las demás funciones.

#### Commit: quitar preguntas repetidas
- Un lote nuevo de preguntas traía 11 repetidas. Las quité y el banco quedó en 119 preguntas.

#### Commits: fotos de las especies
- Las fotos vienen de Wikimedia Commons. Solo uso fotos con licencia abierta (dominio público, CC0 o CC BY) y guardo el nombre del autor y la licencia de cada una.
- Commons me bloqueó varias veces con el error 429 porque pedía demasiadas fotos seguidas. Por eso bajé las fotos en varias tandas.
- Una vez se cortó la conexión y el programa se detuvo. Lo cambié para que, si falla una foto, siga con la siguiente.
- Encontré que el índice de fotos tenía 112 especies con lista vacía, así que el conteo estaba mal. Lo corregí: ahora son 212 especies con fotos y 258 fotos con crédito.
- Ayuda de IA: me ayudó a encontrar el error del índice y a revisar qué datos cambiaban antes de guardarlos. Revisé los cambios antes de hacer commit.

#### Spec del acertijo (F06)
- Escribí la spec del acertijo que desbloquea una especie extinta. Todavía no lo programo.

#### Pendiente
- Probar la galería de fotos en el teléfono.
- Quitar una foto duplicada que no tenía crédito.
- Corregir cómo se numeran las fotos en el programa de descarga, para que no repita un número.
- Programar el acertijo (F06).

### Semana 12

#### Commit: siete especies extintas
- Agregué siete especies extintas al catálogo: megalodón, Otodus obliquus, Cretoxyrhina, Ptychodus, Xenacanthus, Hybodus y Cladoselache.
- Busqué los datos en museos, revistas científicas y el Museo de Historia Natural de Londres. Donde no encontré un dato confiable, dejé "No disponible" en vez de inventarlo.
- Ayuda de IA: me ayudó a buscar fuentes y a descartar datos que no estaban respaldados. Yo elegí las especies y revisé las fichas.

#### Commit: campo de especie extinta
- Agregué un campo que marca si una especie está extinta. Las especies vivas no lo tienen y siguen funcionando igual.
- Cambié el programa del catálogo para que también lea las especies escritas a mano, incluidas las extintas.

#### Commits: acertijos
- Escribí siete acertijos, uno por cada especie extinta. Cada uno tiene una o varias respuestas aceptadas.
- Hice un cargador que revisa que cada acertijo tenga datos completos y que apunte a una especie extinta real.
- Ayuda de IA: me ayudó a revisar los acertijos. Quité frases que no estaban respaldadas por las fuentes, como un dato sobre escamas y otro sobre extinciones masivas.

#### Commit: tarjeta del acertijo
- Hice una tarjeta con el enunciado, un campo para escribir la respuesta y un botón para enviarla.
- Las respuestas se comparan sin importar acentos ni mayúsculas, para no rechazar una respuesta correcta por un detalle de escritura.
- Tienes 3 intentos. Después de cada fallo, la tarjeta dice "No es esa".
- Ayuda de IA: me ayudó a revisar que la comparación funcionara bien y a ajustar los colores para que se vieran sobre el fondo de la app.

#### Commit: acertijos durante el quiz
- Al pasar a la siguiente pregunta, hay una probabilidad de que salga un acertijo. Solo sale de especies que todavía no están desbloqueadas.
- Si acierto, la especie se desbloquea y aparece en el catálogo. Si fallo tres veces, la app muestra "Se acabaron los intentos" y dice cuál era la especie.
- Lo probé en mi teléfono: al acertar, la especie apareció en el catálogo, y después de cerrar y abrir la app seguía ahí.
- Tuve que cambiar la forma en que se mostraba el acertijo. Al principio pasaba muy rápido a la siguiente pregunta y el teclado tapaba el botón de responder.

#### Commit: catálogo sin especies bloqueadas
- Las especies extintas solo se ven en el catálogo cuando las desbloqueé. Mientras la app carga el progreso, tampoco se muestran.

#### Pendiente
- Mejorar el diseño de la pantalla del acertijo.

## Créditos y fuentes

Los datos de las especies salen de estas fuentes:

- **Wikidata** (licencia CC0): lista de especies y datos básicos. https://www.wikidata.org
- **FishBase** (licencia CC BY-NC): medidas, nombres en español y alimentación. https://www.fishbase.se
- **Lista Roja de la UICN**: estado de conservación de cada especie. La UICN autorizó el uso de su API para este proyecto educativo, sin fines comerciales. https://www.iucnredlist.org

Las fotos vienen de Wikimedia Commons, y solo se usaron fotos con licencias abiertas (CC0, dominio público, CC BY y CC BY-SA). Cada foto tiene su autor, su licencia y el enlace a su página original, y todo eso aparece en la pantalla de Créditos de la app.

### Semana 13

#### Commit: buscador de especies
- Agregué un campo para buscar especies por nombre común o científico. No importan los acentos ni las mayúsculas.
- Puse dos filtros: "Solo con foto" y "Solo desbloqueadas", que muestra solo las extintas que ya desbloqueé.
- Si la búsqueda no encuentra nada, la app dice "Sin resultados" y tiene un botón para limpiar la búsqueda.
- Las especies se cargan de 20 en 20, según bajo por la lista.
- Ayuda de IA: me ayudó a revisar el filtro y a corregir un error de tipos. Yo decidí cómo funcionan los filtros y los probé en mi teléfono.

#### Commit: notas personales
- En la ficha de cada especie puedo crear, leer, editar y borrar una nota.
- Las notas tienen máximo 280 caracteres, y una nota vacía no se guarda. Al borrar, la app me pide confirmación.
- Tuve un problema grande: la app se cerraba si tenía el teclado abierto mientras editaba una nota. Quité el componente que lo causaba y agregué espacio al final de la ficha, para que pueda bajar hasta lo que estoy escribiendo.
- Ayuda de IA: me ayudó a encontrar la causa del cierre. Probé cada cambio en mi iPhone antes de seguir.

#### Commit: compartir una especie
- Un botón "Compartir" en la ficha abre la hoja del teléfono con el nombre, el nombre científico y algunos datos de la especie.
- Si el nombre y el nombre científico son iguales, solo se muestra uno. Si un dato no existe, no aparece en el texto.

#### Spec de geolocalización (F13)
- Escribí la spec para guardar dónde vi cada especie, junto a mi nota. Todavía no la programo.
- Cambié la segunda feature nativa. Pensé en usar el acelerómetro para sacudir el teléfono y abrir un acertijo, pero eso quitaba la sorpresa del easter egg.

#### Pendiente
- Programar la geolocalización (F13).
- Corregir cómo se numeran las fotos en el programa de descarga.
- Restaurar los iconos de la app antes de hacer un build con EAS.
