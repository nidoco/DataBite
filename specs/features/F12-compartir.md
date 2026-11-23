# Feature: F12 - Compartir una especie (feature nativa)

## Objetivo

Permitir que la usuaria comparta la ficha de una especie con otras personas, usando
la hoja de compartir del teléfono (WhatsApp, correo, mensajes, etc.). Es una de las
dos features nativas que pide el curso.

## Actor

La usuaria de la app (proyecto personal).

## Precondiciones

- La ficha (`DetalleScreen`) ya muestra la especie por su `id`.
- Se usa la API `Share` de React Native, que ya viene incluida. No hace falta instalar
  nada.

## Datos de entrada

- Nombre de la especie (`nombre`).
- Nombre científico (`nombreCientifico`).
- Estado de conservación (`estadoConservacion`).

## Flujo principal

1. En la ficha de una especie, la usuaria toca el botón "Compartir".
2. Se abre la hoja de compartir del teléfono, con un texto ya armado.
3. El texto dice el nombre, el nombre científico, el estado de conservación y que
   viene de DataBite.
4. Si la usuaria elige una app y envía, el texto sale de DataBite. Si cancela, no
   pasa nada.

## Formato del texto

Una sola frase corta, por ejemplo:
"Mira esta especie: {nombre} ({nombreCientifico}), estado de conservación:
{estadoConservacion}. Vista en DataBite."

El texto se arma en una función aparte, para poder revisarlo sin abrir la app.

## Validaciones

- El botón solo se activa si la ficha tiene una especie válida.
- Si el texto de la especie viene vacío en algún campo, se omite esa parte del texto.

## Casos de error / degradación

- Si el teléfono no puede abrir la hoja de compartir, se muestra "No se pudo compartir
  en este momento".
- Si la usuaria cancela, no se muestra ningún mensaje.

## Resultado esperado

La usuaria comparte una especie con un texto claro, desde la ficha, sin salir de la
app para copiar datos a mano.

## Estados de la pantalla

- Botón "Compartir" visible debajo del encabezado de la ficha, con el mismo estilo
  que el botón de favorita.

## Criterios de aceptación

- [ ] La ficha tiene un botón "Compartir".
- [ ] Al tocarlo, se abre la hoja de compartir del teléfono.
- [ ] El texto incluye nombre, nombre científico, estado de conservación y "DataBite".
- [ ] Cancelar la hoja de compartir no muestra ningún error.
- [ ] Si la hoja no se puede abrir, se muestra el mensaje de error.

## Tasks

- [ ] Crear la función que arma el texto para compartir (en `data/`).
- [ ] Agregar el botón "Compartir" en la ficha, con el estilo de la app.
- [ ] Conectar el botón con `Share.share` y manejar el error.
- [ ] Verificar los criterios de aceptación de F12.
