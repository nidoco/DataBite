import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { leerLista, guardarLista } from "./persistencia";
import { Notas, leerNotas, guardarNotas } from "./notas";

interface ProgresoContextType {
  desbloqueadas: string[];
  favoritas: string[];
  notas: Notas;
  cargando: boolean;
  desbloquearEspecie: (id: string) => void;
  alternarFavorita: (id: string) => void;
  guardarNota: (id: string, texto: string) => void;
  borrarNota: (id: string) => void;
}

const ProgresoContext = createContext<ProgresoContextType | undefined>(undefined);

interface ProgresoProviderProps {
  children: ReactNode;
}

export const ProgresoProvider: React.FC<ProgresoProviderProps> = ({ children }) => {
  const [desbloqueadas, setDesbloqueadas] = useState<string[]>([]);
  const [favoritas, setFavoritas] = useState<string[]>([]);
  const [notas, setNotas] = useState<Notas>({});
  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    // Al abrir la app se leen las listas guardadas. Mientras tanto, cargando es true
    // y el resto de la app no escribe nada, para no sobrescribir datos que aún no se leyeron.
    const cargarProgreso = async () => {
      try {
        const [guardadasDesbloqueadas, guardadasFavoritas, guardadasNotas] = await Promise.all([
          leerLista("desbloqueadas"),
          leerLista("favoritas"),
          leerNotas(),
        ]);

        setDesbloqueadas(guardadasDesbloqueadas);
        setFavoritas(guardadasFavoritas);
        setNotas(guardadasNotas);
      } catch (error) {
        console.error("Error al cargar el progreso:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarProgreso();
  }, []);

  // Guardar en disco cuando cambia el estado, solo después de cargar el progreso
  useEffect(() => {
    if (cargando) return;
    guardarLista("desbloqueadas", desbloqueadas);
  }, [desbloqueadas, cargando]);

  useEffect(() => {
    if (cargando) return;
    guardarLista("favoritas", favoritas);
  }, [favoritas, cargando]);

  useEffect(() => {
    if (cargando) return;
    guardarNotas(notas);
  }, [notas, cargando]);

  const desbloquearEspecie = (id: string) => {
    setDesbloqueadas((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const alternarFavorita = (id: string) => {
    setFavoritas((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Guardar una nota vacía equivale a borrarla, así no quedan notas en blanco.
  const guardarNota = (id: string, texto: string) => {
    const textoLimpio = texto.trim();
    if (!textoLimpio) {
      borrarNota(id);
      return;
    }

    setNotas((prev) => ({
      ...prev,
      [id]: textoLimpio,
    }));
  };

  const borrarNota = (id: string) => {
    setNotas((prev) => {
      const { [id]: _, ...resto } = prev;
      return resto;
    });
  };

  return (
    <ProgresoContext.Provider
      value={{
        desbloqueadas,
        favoritas,
        notas,
        cargando,
        desbloquearEspecie,
        alternarFavorita,
        guardarNota,
        borrarNota,
      }}
    >
      {children}
    </ProgresoContext.Provider>
  );
};

// Hook de uso
export const useProgreso = (): ProgresoContextType => {
  const context = useContext(ProgresoContext);
  if (!context) {
    throw new Error("useProgreso debe usarse dentro de un ProgresoProvider");
  }
  return context;
};