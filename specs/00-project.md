# Proyecto final

## Nombre

DataBite.

## Problema

El conocimiento común sobre tiburones está lleno de mitos y miedos (que todos
atacan, que todos son enormes, que todos son peligrosos). Para alguien con
curiosidad por estos animales, falta una forma sencilla y a la mano de consultar
información real sobre las distintas especies y de contrastar esas creencias con
datos científicos, en un formato accesible desde el teléfono.

## Usuario objetivo

Proyecto personal. La usuaria principal es la propia desarrolladora: una persona
con interés en los tiburones que quiere consultar información sobre las especies
y poner a prueba lo que cree saber, desde su teléfono y sin necesidad de internet.
No está pensada por ahora para un público específico.

## Propuesta de solución

Una aplicación móvil autónoma (offline, sin backend) que funciona como una
enciclopedia personal de tiburones: permite explorar un catálogo de especies con
su información, ver sus fotos, buscarlas, guardar favoritas y notas, y poner a
prueba lo aprendido mediante un quiz de "mito o realidad" con retroalimentación de
base científica.

## MVP

| Feature | Qué es | Estado |
|---|---|---|
| F01 - Catálogo | Lista de especies con su información básica | Hecho |
| F02 - Detalle | Ficha completa de cada especie | Hecho |
| F03 - Galería | Fotos con licencia abierta y créditos de cada una | Hecho y probado en el teléfono |
| F04 - Quiz | Preguntas de mito o realidad en rondas de 10 | Hecho |
| F05 - Resultados | Conteo, repaso de falladas y reintentar | Hecho |
| F06 - Easter egg | Acertijo que desbloquea una especie extinta, con 3 intentos | Hecho |

## Funcionalidades agregadas

| Feature | Qué es | Estado |
|---|---|---|
| F07 - Carga del catálogo | 542 especies generadas desde Wikidata, FishBase y la UICN | Hecho; falta la sección de créditos de las fuentes en la app |
| F08 - Persistencia | Favoritas y especies desbloqueadas guardadas en el teléfono | Hecho |
| F09 - Navegación | Pestañas Catálogo y Favoritas, y modal de créditos | Hecho |
| F10 - Buscador | Búsqueda por nombre, filtros y carga por partes | Hecho y probado en el teléfono |
| F11 - Notas personales | Crear, leer, editar y borrar una nota por especie | Pendiente |

## Requisitos del curso

El curso pide tres features nativas, de las que se implementarán dos:

- **Compartir:** pendiente (F-futura, la ficha se podrá compartir).
- **Sensores:** pendiente (sacudir el teléfono para mostrar un acertijo).

También pide tests (12 unitarios y 4 de integración), que quedan para el final.

## Funcionalidades futuras

- Persistencia de puntajes del quiz en el dispositivo.
- Posible apertura a público general más adelante (cuentas de usuario / login),
  si el proyecto deja de ser solo personal.
