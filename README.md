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


