# Feature: F11 - Notas personales por especie (CRUD)

## Objetivo

Permitir que la usuaria escriba una nota personal sobre cada especie: por ejemplo,
dónde la vio o qué le llamó la atención. La nota se puede crear, leer, editar y
borrar. Es el CRUD completo que pide el curso, aplicado a una entidad propia de la
app: las notas.

## Actor

La usuaria de la app (proyecto personal).

## Precondiciones

- F08 (persistencia) está terminada: el módulo de almacenamiento ya funciona con
  AsyncStorage.
- La ficha (`DetalleScreen`) ya muestra cada especie por su `id`.

## Datos de entrada

- Una nota por especie: texto libre, escrito por la usuaria.
- Se guardan como un objeto: la clave es el `id` de la especie y el valor es el texto
  de la nota. Clave de almacenamiento: `notas`.

## Flujo principal

1. Al abrir la ficha de una especie, la sección "Mis notas" muestra la nota guardada,
   o el botón "Agregar nota" si no hay ninguna (lectura).
2. "Agregar nota" abre un campo de texto. Al guardar, la nota aparece en la ficha
   (creación).
3. "Editar" abre el mismo campo con el texto actual. Al guardar, la nota se reemplaza
   (actualización).
4. "Borrar" pide confirmación con un aviso. Si la usuaria confirma, la nota desaparece
   (borrado).
5. Las notas se guardan en el dispositivo y siguen ahí al cerrar y volver a abrir la
   app.

## Validaciones

- El texto se recorta de espacios al inicio y al final. Si queda vacío, no se guarda
  y se muestra "La nota no puede estar vacía".
- Máximo 280 caracteres.
- Al leer del almacenamiento, el dato se valida en la frontera: debe ser un objeto
  cuyos valores sean textos. Lo que no cumpla se descarta.
- Una nota de una especie que ya no existe en el catálogo se ignora, sin borrarla.

## Casos de error / degradación

- Si la lectura falla o el dato está corrupto, se asume que no hay notas y la app sigue.
- Si la escritura falla, se muestra "No se pudo guardar la nota" y el texto escrito
  no se pierde, para que la usuaria pueda intentar de nuevo.
- Si la usuaria cancela el borrado, no pasa nada.

## Resultado esperado

La usuaria escribe, cambia y borra sus notas en la ficha de cada especie, y las notas
siguen guardadas al reabrir la app.

## Estados de la pantalla

- Sin nota: botón "Agregar nota".
- Con nota: texto de la nota, y botones "Editar" y "Borrar".
- Editando: campo de texto con botones "Guardar" y "Cancelar".

## Criterios de aceptación

- [ ] Se puede crear una nota desde la ficha de una especie.
- [ ] La nota guardada se muestra al abrir la ficha de esa especie.
- [ ] Se puede editar una nota existente y el cambio se guarda.
- [ ] Se puede borrar una nota, después de confirmar.
- [ ] Una nota vacía o solo con espacios no se guarda.
- [ ] El texto no pasa de 280 caracteres.
- [ ] Las notas siguen guardadas al cerrar y volver a abrir la app.
- [ ] Un dato guardado corrupto no rompe la app.

## Tasks

- [ ] Crear las funciones de leer y guardar el objeto de notas, con validación en la
      frontera.
- [ ] Crear un estado global o un hook para las notas, para que la ficha lea y escriba
      lo mismo.
- [ ] Agregar la sección "Mis notas" en la ficha, con su estado sin nota y con nota.
- [ ] Agregar el formulario de nota con validación (vacía y máximo 280).
- [ ] Agregar el botón de editar y guardar los cambios.
- [ ] Agregar el botón de borrar con confirmación.
- [ ] Verificar los criterios de aceptación de F11.
