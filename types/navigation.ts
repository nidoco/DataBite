export type RootStackParamList = {
    Catalogo: undefined; // Al no requerir recibir parametros, de define asi
    Detalle: { id: string };
    Quiz: undefined;
    Resultados: { respuestas: { id: string; acierto: boolean }[] };
}
// Este archivo define el RootStackParamList que es un tipo que describe los parámetros 
// que se pueden pasar a cada pantalla en la navegación de la aplicación. 
// Cada pantalla tiene un nombre y un tipo de parámetro asociado. 
// Si una pantalla no requiere parámetros, se define como undefined.