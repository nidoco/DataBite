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
- Longitud (`morfologia.longitudMetros`), si existe.
- Hábitat (`habitat`).
- Alimentación (`alimentacion`), si existe.
- Estado de conservación (`estadoConservacion`).

## Flujo principal

1. En la ficha de una especie, la usuaria toca el botón "Compartir".
2. Se abre la hoja de compartir del teléfono, con un texto ya armado.
3. Si la usuaria elige una app y envía, el texto sale de DataBite. Si cancela, no
   pasa nada.

## Formato del texto

El texto se arma en `data/textoCompartir.ts`, con este orden:

1. Frase inicial: "Mira esta especie:".
2. Nombre y nombre científico, por ejemplo "Tiburón blanco (Carcharodon carcharias)".
   Si los dos son iguales, se muestra solo uno.
3. Datos disponibles, cada uno en su propia frase, solo si la especie los tiene:
   - "Mide hasta X m." (longitud).
   - "Hábitat: ..." (hábitat).
   - "Alimentación: ..." (alimentación).
4. Estado de conservación, solo si no es "Datos insuficientes".
5. Cierre: "Vista en DataBite."

Ejemplo:
"Mira esta especie: Tiburón blanco (Carcharodon carcharias). Mide hasta 6 m.
Hábitat: Aguas cálidas y templadas. Alimentación: Mamíferos marinos, peces y otros
tiburones. Estado de conservación: Vulnerable. Vista en DataBite."

## Validaciones

- Cada dato se agrega solo si la especie lo tiene. Un dato vacío no deja huecos en el
  texto.
- Si el nombre común y el científico son iguales, no se repiten.

## Casos de error / degradación

- Si el teléfono no puede abrir la hoja de compartir, se muestra "No se pudo compartir
  en este momento".
- Si la usuaria cancela, no se muestra ningún mensaje.

## Resultado esperado

La usuaria comparte una especie con un texto claro, desde la ficha, sin salir de la
app para copiar datos a mano.

## Estados de la pantalla

- Botón "Compartir" en la misma fila de los chips de la ficha, separado del botón de
  favorita.

## Criterios de aceptación

- [X] La ficha tiene un botón "Compartir".
- [X] Al tocarlo, se abre la hoja de compartir del teléfono.
- [X] El texto incluye nombre, nombre científico, datos disponibles y "Vista en DataBite".
- [X] Si nombre y nombre científico son iguales, el texto muestra uno solo.
- [X] Cancelar la hoja de compartir no muestra ningún error.
- [X] Si la hoja no se puede abrir, se muestra el mensaje de error.

## Tasks

- [X] Crear la función que arma el texto para compartir (en `data/`).
- [X] Agregar el botón "Compartir" en la ficha, con el estilo de la app.
- [X] Conectar el botón con `Share.share` y manejar el error.
- [X] Verificar los criterios de aceptación de F12.
