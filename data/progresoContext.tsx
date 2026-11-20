import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { leerLista, guardarLista } from './persistencia';
interface ProgresoContextType {
  desbloqueadas: string[];
  favoritas: string[];
  cargando: boolean;
  desbloquearEspecie: (id: string) => void;
  alternarFavorita: (id: string) => void;
}

const ProgresoContext = createContext<ProgresoContextType | undefined>(undefined);

interface ProgresoProviderProps {
  children: ReactNode;
}

export const ProgresoProvider: React.FC<ProgresoProviderProps> = ({ children }) => {
  const [desbloqueadas, setDesbloqueadas] = useState<string[]>([]);
  const [favoritas, setFavoritas] = useState<string[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    const cargarProgreso = async () => {
      try {
        const [guardadasDesbloqueadas, guardadasFavoritas] = await Promise.all([
          leerLista("desbloqueadas"),
          leerLista("favoritas"),
        ]);

        setDesbloqueadas(guardadasDesbloqueadas);
        setFavoritas(guardadasFavoritas);
      } catch (error) {
        console.error('Error al cargar el progreso:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarProgreso();
  }, []);

  // Guardar en disco cuando cambia la lista, solo después de cargar el progreso
  useEffect(() => {
    if (cargando) return;
    guardarLista("desbloqueadas", desbloqueadas);
  }, [desbloqueadas, cargando]);

  useEffect(() => {
    if (cargando) return;
    guardarLista("favoritas", favoritas);
  }, [favoritas, cargando]);

  const desbloquearEspecie = (id: string) => {
    setDesbloqueadas((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const alternarFavorita = (id: string) => {
    setFavoritas((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <ProgresoContext.Provider
      value={{
        desbloqueadas,
        favoritas,
        cargando,
        desbloquearEspecie,
        alternarFavorita,
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
    throw new Error('useProgreso debe usarse dentro de un ProgresoProvider');
  }
  return context;
};
