export interface Morfologia {
    longitudMetros?: number | undefined;
    pesoKg?: number | undefined;
    formaCuerpo: string;
    rasgoDistintivo?: string | undefined;
}

export interface Shark {
    id: string;
    nombre: string;
    nombreCientifico: string;
    estadoConservacion: string;
    morfologia: Morfologia;
    habitat: string;
    alimentacion?: string | undefined;
    // Identificadores de las fotos (ver data/imagenes.ts). Opcional: puede no tener ninguna.
    imagenes?: string[] | undefined;
}