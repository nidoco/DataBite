import quiz from "./quiz.json";
import { Pregunta } from "../types/Pregunta";

const PREGUNTAS_POR_RONDA = 10;

export function elegirRonda(preguntas: Pregunta[]): Pregunta[] {
    const mezcladas = [...preguntas]; // Crea una copia, si se mezcla preguntas directamente, cambiar[ia el banco completo]
    // El for va de atrás hacia adelante. 
    // En cada vuelta elige una posición j al azar 
    // entre 0 e i, y la línea de los corchetes intercambia 
    // las dos preguntas
    for (let i = mezcladas.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() *  (i + 1));
        [mezcladas[i], mezcladas[j]] = [mezcladas[j], mezcladas[i]];
    }

    return mezcladas.slice(0, PREGUNTAS_POR_RONDA);
}

function esPregunta(valor: unknown): valor is Pregunta {
    if (typeof valor !== "object" || valor === null) return false;
    const obj = valor as Record<string, unknown>;

    return (
        typeof obj.id === "string" &&
        typeof obj.enunciado === "string" &&
        (obj.respuesta === "mito" || obj.respuesta === "realidad") &&
        typeof obj.explicacion === "string"
    );
}

// Busca una pregunta por su id. Devuelve undefined si no existe (por ejemplo, si el banco cambió).
export function getPreguntaPorId(id: string): Pregunta | undefined {
    return loadQuiz().find((pregunta) => pregunta.id === id);
}

export default function loadQuiz(): Pregunta[] {
    const datos: unknown = quiz;
    if (!Array.isArray(datos)) return [];

    // El id identifica cada respuesta en la pantalla de resultados, así que no puede
    // repetirse: si dos preguntas comparten id, se queda solo la primera.
    const vistos = new Set<string>();
    return datos.filter(esPregunta).filter((pregunta) => {
        if (vistos.has(pregunta.id)) return false;
        vistos.add(pregunta.id);
        return true;
    });
}
