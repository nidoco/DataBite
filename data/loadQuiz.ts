import quiz from './quiz.json';
import { Pregunta } from '../types/Pregunta';

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
