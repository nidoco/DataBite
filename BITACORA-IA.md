# Bitácora de IA

Este documento registra cuándo usé una herramienta de IA durante el proyecto, qué me
propuso, qué acepté, qué rechacé y por qué. Lo escribí para tener claro dónde ayudó y
dónde se equivocó.

## Cómo la usé

- Para revisar código que yo escribía, detectar errores y explicar mensajes de error.
- Para buscar fuentes y datos, que después verifiqué en las páginas originales.
- Para redactar borradores de specs, que después ajusté.
- Yo decidí el alcance, los datos que entran al catálogo y el diseño final.

## Propuestas que acepté

- **Pasar solo el `id` de la especie entre pantallas, no el objeto completo.** La
  ficha recupera la especie con su `id`. Así los parámetros de navegación son ligeros y
  se pueden serializar, y no hay dos copias de los datos que puedan desincronizarse.
- **`id` como texto (slug), no número.** La app no tiene backend, y los ids legibles
  son más fáciles de revisar.
- **Dos rondas de 10 preguntas al azar, con Fisher-Yates.** Se mezcla una copia del
  banco una sola vez al entrar al quiz.
- **`replace` en "Reintentar" en lugar de `navigate`.** Con `navigate` la pila de
  pantallas crecía, y había que tocar "atrás" varias veces.
- **Solo fotos con licencias CC0, dominio público, CC BY y CC BY-SA.** Descarté las
  licencias de uso libre con condiciones que no eran claras.
- **Usar la probabilidad del acertijo en `avanzar`, no en el render.** Así no cambia
  cada vez que la pantalla se redibuja.

## Propuestas que rechacé

- **Mezclar preguntas con `sort(() => Math.random() - 0.5)`.** Ese truco no mezcla bien:
  algunas preguntas tienen más probabilidad de quedar al principio. Usé un método que
  reparte las posiciones de forma pareja.
- **Mezclar las preguntas cada vez que la pantalla se redibuja.** Si la pantalla
  cambiaba de estado, las preguntas se reordenaban en medio de la ronda. Ahora se mezclan
  una sola vez al entrar.
- **Que la IA inventara la alimentación de las especies.** No se puede comprobar. La
  alimentación sale de los registros de FishBase, y si no hay datos se muestra
  "No disponible".
- **Sacudir el teléfono para mostrar un acertijo.** Eso hacía que el acertijo se
  pudiera abrir cuando quisiera la usuaria, y dejaba de ser una sorpresa. Cambié esa
  función nativa por la geolocalización en las notas.
- **Un componente que mueve la pantalla al abrir el teclado (`KeyboardAvoidingView`) en
  la ficha.** Con él, la app se cerraba en iPhone al reiniciar con el teclado abierto.
  Lo quité y usé un espacio extra al final de la ficha.

## Errores de la IA que detecté

- **Nombres y datos inventados en los acertijos.** Algunas respuestas tenían nombres
  comunes que no encontré en ninguna fuente, y algunos enunciados afirmaban cosas sin
  respaldo, como escamas o extinciones masivas. Los quité.
- **Desplazamiento al enfocar el campo de texto.** La primera solución no funcionó
  porque el teclado todavía no se había abierto. Probé otra y tampoco fue suficiente.
  Lo resolví al escuchar el evento de teclado abierto y ajustar el espacio al final.
- **Recuento de fotos inflado.** El índice tenía entradas vacías que contaban como
  especies con foto. Lo encontré al comparar los números con el catálogo.

## Decisiones sobre los datos

- **Nombre en español:** si una especie tiene varios nombres en FishBase, gana el que
  aparece más veces. Si hay empate, gana el de la FAO, luego el de la AFS y luego los
  nombres populares. Si no hay ninguno, la app muestra el nombre científico.
- **Estado de conservación:** sale de la Lista Roja de la UICN. Si la UICN no encuentra
  la especie por su nombre, la busco por su número de identificación. Si solo hay una
  evaluación antigua, la marco como desactualizada.
- **Fotos dentro del repositorio:** las imágenes se guardan en `assets/`, no se cargan
  desde internet, porque la app debe funcionar sin conexión.
- **Fotos de 800 píxeles:** las originales pesan demasiado para un teléfono.
- **Peso, alimentación y rasgo distintivo opcionales:** cuando faltan, la ficha dice
  "No disponible". Exigirlos dejaba fuera demasiadas especies.
- **Longitud opcional:** así entraron 46 especies más al catálogo.
- **Guardar ids, no objetos completos:** las favoritas y las especies desbloqueadas se
  guardan como lista de ids. Al leerlas se validan, y si algo está mal se usa una lista
  vacía.
- **Confirmación al salir del quiz a la mitad:** la hice con un hook de React Navigation,
  no con un evento manual, porque es la forma que recomienda la documentación.

## Errores que encontré y corregí


- **`navigate` en lugar de `replace` al reintentar.** La pila de pantallas crecía y
  había que tocar "atrás" varias veces.
- **`useState([])` sin tipo.** TypeScript lo tomaba como `never[]`. Le puse el tipo.
- **FishBase no respondía por SSL.** Cambié la fuente de descarga a Source Cooperative.
- **Token de la UICN.** El primero devolvía error 401. Generé otro y ese sí funcionó.
- **11 especies no encontradas por nombre en la UICN.** Las busqué por su número de
  identificación y así las encontré.
- **Límite de descargas de Wikimedia Commons (error 429).** Bajé las fotos en tandas y
  las reintenté después.
- **Preguntas repetidas en el banco.** Un lote nuevo traía 11 preguntas repetidas. Las
  quité y el banco quedó en 119.
- **El gesto de regreso del sistema chocaba con deslizar la tarjeta.** Desactivé el
  gesto solo en la pantalla del quiz.

## Decisiones de diseño y de entrega

- **El acertijo sale durante el quiz, con una probabilidad de 10 %.** Así es una
  sorpresa. Solo aparece para especies que todavía están bloqueadas.
- **Tres intentos y sin bloqueo permanente.** Si falla, la especie queda bloqueada
  igual, y el acertijo puede volver a salir después.
- **Quiz dentro del stack, no en una pestaña.** Ponerlo en una pestaña complicaba los
  botones de "Reintentar" y "Volver".
- **Botón de Quiz dentro de la pantalla, no en el encabezado.** En el encabezado se veía
  pequeño y pegado a la esquina.
- **Scroll infinito para cargar especies, no un botón "Cargar más".** Ambas opciones
  cumplen el requisito del curso. Elegí el scroll infinito.
- **Un recuadro con el texto "Sin foto", no una silueta de tiburón.** Una silueta
  tomaba demasiado tiempo para la entrega.
- **Un icono generado con un script.** Es un círculo turquesa sobre el azul de la app.
  Fue la forma más rápida de quitar el error de `icon.png`.
- **Publicar con Expo Go y EAS Update, no con Snack.** Snack solo soporta hasta la
  versión 56 de Expo, y el proyecto usa la 58.
- **Las ubicaciones se guardan en una clave aparte.** Así las notas no cambian de
  formato.

## Errores que todavía no se resuelven

- **La app se cierra en Expo Go al recargar con un campo de texto abierto.** Pasa también
  en el buscador del catálogo, así que parece un problema de Expo Go y no de la nota.
  Se evita cerrando el teclado antes de recargar.
- **Al pedir la foto de algunas especies, Commons sigue devolviendo error 429.** Ya
  tenemos las siete extintas con foto, pero el script de descarga todavía no numera
  bien las fotos nuevas en algunos casos.

## Cómo verifiqué lo que me devolvía la IA

- Probé cada función en mi teléfono antes de seguir.
- Comparé los datos de especies contra las fuentes originales: Wikidata, FishBase,
  la UICN, el Museo de Historia Natural de Londres y las páginas de Wikimedia Commons.
