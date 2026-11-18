export interface Morfologia {
    longitudMetros: number;
    pesoKg?: number | undefined;
    formaCuerpo: string;
    rasgoDistintivo: string;
}

export interface Shark {
    id: string;
    nombre: string;
    nombreCientifico: string;
    estadoConservacion: string;
    morfologia: Morfologia;
    habitat: string;
    alimentacion: string;
}