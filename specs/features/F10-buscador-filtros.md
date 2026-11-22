# Feature: F10 - Buscador, filtros y paginación del catálogo

## Objetivo

Hacer que el catálogo sea fácil de recorrer cuando tiene 500 o más especies. La
usuaria puede buscar por nombre, filtrar por las especies que tienen foto o por las
extintas que ya desbloqueó, y cargar la lista por partes.

## Actor

La usuaria de la app (proyecto personal).

## Precondiciones

- F09 (pestañas) está terminada: el buscador vive en la pestaña Catálogo.
- El progreso (`progresoContext`) ya lee `desbloqueadas`.
- Las especies vienen de `loadSharks()` y las fotos de `imagenes`.

## Datos de entrada

- Texto que escribe la usuaria en el buscador.
- Dos filtros que se prenden y apagan: "Con foto" y "Solo extintas desbloqueadas".
- La lista de especies visibles, ya filtrada por F06 (las extintas bloqueadas no
  aparecen).

## Flujo principal

1. La usuaria escribe en el buscador. La lista se filtra mientras escribe.
2. La búsqueda compara el texto con el nombre común y el nombre científico. No importan
   mayúsculas ni acentos.
3. Al tocar "Con foto", solo quedan las especies que tienen al menos una foto.
4. Al tocar "Solo extintas desbloqueadas", solo quedan las especies extintas que la
   usuaria ya desbloqueó. Las especies vivas se ocultan con este filtro.
5. Los filtros se combinan: si los dos están prendidos, se cumplen ambos.
6. La lista muestra 20 especies al principio. Al llegar al final, carga 20 más, hasta
   terminar.

## Validaciones

- El texto se recorta de espacios al inicio y al final antes de buscar.
- Máximo 40 caracteres en el buscador.
- Un texto solo con espacios se trata como vacío (no filtra nada).

## Casos de error / degradación

- Si no hay especies que coincidan, se muestra "Sin resultados para "<texto>"" y un
  botón para limpiar la búsqueda.
- Si el progreso todavía está cargando, el filtro "Solo extintas desbloqueadas" queda
  deshabilitado.
- Si todas las especies ya se cargaron, no aparece el indicador de "cargando más".

## Resultado esperado

La usuaria encuentra una especie escribiendo parte de su nombre, filtra por las que
tienen foto o por las extintas que desbloqueó, y puede recorrer todo el catálogo sin
que la pantalla se vuelva lenta.

## Estados de la pantalla

- Vacío (sin búsqueda ni filtros): se muestran las primeras 20 especies.
- Con búsqueda sin resultados: mensaje y botón para limpiar.
- Cargando más: indicador al final de la lista.

## Criterios de aceptación

- [ ] El buscador filtra por nombre común y por nombre científico.
- [ ] La búsqueda no distingue mayúsculas ni acentos.
- [ ] El texto de búsqueda acepta máximo 40 caracteres.
- [ ] "Con foto" muestra solo especies con al menos una foto.
- [ ] "Solo extintas desbloqueadas" muestra solo extintas que ya se desbloquearon.
- [ ] Los dos filtros se pueden combinar.
- [ ] La lista carga 20 especies al inicio y 20 más cada vez que llega al final.
- [ ] Sin resultados, se muestra un mensaje con botón para limpiar.

## Tasks

- [ ] Crear la función de búsqueda normalizada, con su prueba manual en el código.
- [ ] Agregar el campo de búsqueda con su validación (recorte y máximo de 40).
- [ ] Agregar los dos filtros como botones que se prenden y apagan.
- [ ] Combinar búsqueda y filtros en una sola lista filtrada.
- [ ] Cambiar el `FlatList` del catálogo a carga por páginas de 20.
- [ ] Agregar el mensaje de "Sin resultados" y el botón para limpiar.
- [ ] Verificar los criterios de aceptación de F10.
