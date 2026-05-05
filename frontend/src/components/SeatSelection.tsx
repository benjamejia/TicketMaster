import { useState, useEffect } from 'react';
import { getAsientosForFunction, getAsientosOcupados, type Asiento } from '../services/api-service';

interface SeatSelectionProps {
  funcionId: number;
  tipoEstablecimiento: string;
  cantidadBoletos: number;
  asientosSeleccionados: string[];
  onAsientosChange: (asientos: string[]) => void;
}

export function SeatSelection({ 
  funcionId, 
  tipoEstablecimiento, 
  cantidadBoletos, 
  asientosSeleccionados, 
  onAsientosChange 
}: SeatSelectionProps) {
  const [asientos, setAsientos] = useState<Asiento[]>([]);
  const [asientosOcupados, setAsientosOcupados] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tipo = tipoEstablecimiento.toUpperCase();
  const esCineOteatro = tipo.includes('CINE') || tipo.includes('TEATRO');

  useEffect(() => {
    if (!esCineOteatro) {
      setLoading(false);
      return;
    }

    const cargarAsientos = async () => {
      try {
        setLoading(true);
        const [todosAsientos, ocupados] = await Promise.all([
          getAsientosForFunction(funcionId),
          getAsientosOcupados(funcionId)
        ]);
        
        setAsientos(todosAsientos);
        setAsientosOcupados(ocupados);
        setError(null);
      } catch (err) {
        setError('Error al cargar los asientos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarAsientos();
  }, [funcionId, esCineOteatro]);

  const handleSeatClick = (asiento: Asiento) => {
    const asientoId = `${asiento.fila}${asiento.numeroAsiento}`;
    const estaOcupado = asientosOcupados.includes(asientoId);
    
    if (estaOcupado) return;

    const estaSeleccionado = asientosSeleccionados.includes(asientoId);
    
    if (estaSeleccionado) {
      onAsientosChange(asientosSeleccionados.filter(a => a !== asientoId));
    } else {
      if (asientosSeleccionados.length >= cantidadBoletos) {
        setError(`Solo puedes seleccionar ${cantidadBoletos} asiento(s)`);
        setTimeout(() => setError(null), 3000);
        return;
      }
      onAsientosChange([...asientosSeleccionados, asientoId]);
    }
  };

  if (!esCineOteatro) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-surface p-6 rounded-lg border border-outline-variant/20">
        <p className="text-on-surface text-center">Cargando asientos...</p>
      </div>
    );
  }

  if (error && !asientos.length) {
    return (
      <div className="bg-error/10 border border-error rounded-lg p-4">
        <p className="text-error">{error}</p>
      </div>
    );
  }

  const asientosPorFila = asientos.reduce((acc, asiento) => {
    if (!acc[asiento.fila]) {
      acc[asiento.fila] = [];
    }
    acc[asiento.fila].push(asiento);
    return acc;
  }, {} as Record<string, Asiento[]>);

  const filas = Object.keys(asientosPorFila).sort();

  return (
    <div className="bg-surface p-6 rounded-lg border border-outline-variant/20">
      <h2 className="text-lg font-semibold text-on-background mb-4">
        Selección de Asientos
      </h2>
      
      <div className="mb-4 text-sm text-on-surface/70">
        <p>Selecciona {cantidadBoletos} asiento(s): {asientosSeleccionados.length}/{cantidadBoletos}</p>
      </div>

      {error && (
        <div className="bg-error/10 border border-error rounded p-2 mb-4">
          <p className="text-error text-sm">{error}</p>
        </div>
      )}

      <div className="mb-6">
        <div className="w-full h-8 bg-primary/20 rounded-t-lg flex items-center justify-center mb-4">
          <span className="text-primary text-sm font-semibold">ESCENARIO / PANTALLA</span>
        </div>

        <div className="space-y-2">
          {filas.map(fila => (
            <div key={fila} className="flex items-center justify-center gap-1">
              <span className="w-6 text-center text-sm font-bold text-on-surface">{fila}</span>
              <div className="flex gap-1">
                {asientosPorFila[fila]
                  .sort((a, b) => a.numeroAsiento - b.numeroAsiento)
                  .map(asiento => {
                    const asientoId = `${asiento.fila}${asiento.numeroAsiento}`;
                    const estaOcupado = asientosOcupados.includes(asientoId);
                    const estaSeleccionado = asientosSeleccionados.includes(asientoId);
                    
                    let bgColor = 'bg-success/20 border-success';
                    if (estaOcupado) {
                      bgColor = 'bg-error/20 border-error cursor-not-allowed';
                    } else if (estaSeleccionado) {
                      bgColor = 'bg-primary border-primary';
                    }

                    return (
                      <button
                        key={asiento.id}
                        type="button"
                        disabled={estaOcupado}
                        onClick={() => handleSeatClick(asiento)}
                        className={`w-8 h-8 rounded-t-lg border-2 transition-colors ${bgColor} 
                          ${!estaOcupado ? 'hover:bg-primary/30' : ''}`}
                        title={`${asiento.fila}${asiento.numeroAsiento}`}
                      >
                        <span className="text-xs">{asiento.numeroAsiento}</span>
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-success/20 border-2 border-success rounded"></div>
          <span className="text-on-surface">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-primary border-2 border-primary rounded"></div>
          <span className="text-on-surface">Seleccionado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-error/20 border-2 border-error rounded"></div>
          <span className="text-on-surface">Ocupado</span>
        </div>
      </div>

      {asientosSeleccionados.length > 0 && (
        <div className="mt-4 p-3 bg-primary/10 rounded">
          <p className="text-sm text-on-surface">
            Asientos seleccionados: {asientosSeleccionados.join(', ')}
          </p>
        </div>
      )}
    </div>
  );
}
