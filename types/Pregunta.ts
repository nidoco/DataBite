// Lo que la usuaria puede contestar, y la respuesta correcta de cada pregunta.
export type Respuesta = 'mito' | 'realidad';

export interface Pregunta {
    id: string;
    enunciado: string;
    respuesta: Respuesta;
    explicacion: string;
}
