// scripts/equivalencias.ts

export const formaCuerpo: Record<string, string> = {
  "elongated": "Forma alargada",
  "fusiform / normal": "Forma de torpedo",
  "other": "Forma variada",
};

export const zonaHabitat: Record<string, string> = {
  "bathydemersal": "Junto al fondo, en aguas profundas",
  "demersal": "Junto al fondo del mar",
  "pelagic-oceanic": "En aguas abiertas lejos de la costa",
  "reef-associated": "En arrecifes o cerca de ellos",
  "benthopelagic": "Junto al fondo y también a media agua",
  "bathypelagic": "En aguas abiertas muy profundas",
  "pelagic-neritic": "En aguas abiertas cercanas a la costa",
};

// Grupos de presa de FishBase (columna FoodII) en español.
// Se unen en una frase ("Peces, crustáceos del fondo y cefalópodos"), así que ninguna
// traducción lleva una "y" dentro. Las claves van en minúsculas.
// Verificadas contra los registros reales de FishBase, no solo contra sus definiciones.
export const presas: Record<string, string> = {
  "finfish": "peces",
  "benth. crust.": "crustáceos del fondo",
  "cephalopods": "cefalópodos",
  "mollusks": "moluscos",
  "plank. crust.": "crustáceos del plancton",
  "mammals": "mamíferos marinos",
  "worms": "gusanos",
  "jellyfish/hydroids": "medusas",
  "other plank. invertebrates": "otros invertebrados del plancton",
  "other benth. invertebrates": "otros invertebrados del fondo",
  "echinoderms": "equinodermos",
  "detritus": "carroña",
  "other plants": "vegetación marina",
  "birds": "aves",
  "fish (early stages)": "huevos o larvas de peces",
  "herps": "reptiles",
  "sponges/tunicates": "esponjas o ascidias",
  "cnidarians": "anémonas o corales",
  "other terrest. invertebrates": "otros invertebrados terrestres",
};
