import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TicketSelection, type TicketOrder } from "../components/TicketSelection.tsx";
import { getFuncionById, type Funcion } from "../services/api-service";

const PLACEHOLDER_IMAGES: Record<string, string> = {
    "Cine": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop",
    "Teatro": "https://images.unsplash.com/photo-1503095396549-807759285036?w=800&auto=format&fit=crop",
    "Museo": "https://images.unsplash.com/photo-1543857778-c4a1a5206609?w=800&auto=format&fit=crop",
};

function mapFuncionToEvento(funcion: Funcion) {
    const tipoSala = funcion.idSala?.tipoSala?.toLowerCase() || "";
    let categoria = "General";
    if (tipoSala.includes("cine") || funcion.nombreFuncion?.toLowerCase().includes("cine")) {
        categoria = "Cine";
    } else if (tipoSala.includes("teatro") || funcion.nombreFuncion?.toLowerCase().includes("teatro")) {
        categoria = "Teatro";
    } else if (tipoSala.includes("museo") || funcion.nombreFuncion?.toLowerCase().includes("museo")) {
        categoria = "Museo";
    }

    return {
        id: String(funcion.id),
        titulo: funcion.nombreFuncion,
        srcImg: PLACEHOLDER_IMAGES[categoria] || PLACEHOLDER_IMAGES["General"],
        lugar: funcion.idSala?.idEstablecimiento?.nombreSucursal || "Por definir",
        categoria,
        descripcion: `Función de ${funcion.nombreFuncion} en ${funcion.idSala?.nombreSala || "la sala"}. Una experiencia cultural imperdible.`,
        duracion: "2h aproximadamente",
        clasificacion: funcion.clasificacion || "Apta para todo público",
    };
}

function mapFuncionToTiposTicket(funcion: Funcion) {
    const precioBase = funcion.idSala?.precio || 0;
    return [
        { id: "t1", nombre: "General", precio: precioBase, descripcion: "Acceso a zona general, asiento numerado", disponible: true, maxPorPersona: 6 },
        { id: "t2", nombre: "Preferente", precio: Math.round(precioBase * 1.5), descripcion: "Zona frontal con mejor visibilidad", disponible: true, maxPorPersona: 4 },
        { id: "t3", nombre: "VIP", precio: Math.round(precioBase * 2), descripcion: "Butacas premium con beneficios exclusivos", disponible: true, maxPorPersona: 2 },
    ];
}

function mapFuncionToFechas(funcion: Funcion) {
    const fecha = funcion.fecha || "";
    const horario = funcion.horario || "";
    
    const fechaObj = fecha ? new Date(`${fecha}T${horario}`) : null;
    const fechaStr = fechaObj ? fechaObj.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' }) : "Fecha por confirmar";
    const horaStr = horario ? `${horario} hrs` : "Hora por confirmar";

    return [
        { id: `f1-${funcion.id}`, fecha: fechaStr, hora: horaStr, disponible: true },
    ];
}

export function EventoDetallePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [evento, setEvento] = useState<any>(null);
    const [tiposTicket, setTiposTicket] = useState<any[]>([]);
    const [fechasDisponibles, setFechasDisponibles] = useState<any[]>([]);

    useEffect(() => {
        const cargarEvento = async () => {
            if (!id) {
                setError("No se especificó un evento");
                setLoading(false);
                return;
            }

            try {
                const funcion = await getFuncionById(parseInt(id));
                if (!funcion) {
                    setError("Evento no encontrado");
                } else {
                    setEvento(mapFuncionToEvento(funcion));
                    setTiposTicket(mapFuncionToTiposTicket(funcion));
                    setFechasDisponibles(mapFuncionToFechas(funcion));
                }
            } catch {
                setError("Error al cargar el evento");
            } finally {
                setLoading(false);
            }
        };
        cargarEvento();
    }, [id]);

    const handleConfirmarCompra = (order: TicketOrder) => {
        navigate(`/checkout?eventId=${order.eventoId}`, { state: { order } });
    };

    if (loading) {
        return (
            <main className="min-h-screen py-8 flex items-center justify-center">
                <div className="text-center">
                    <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
                    <p className="text-on-surface-variant mt-4">Cargando evento...</p>
                </div>
            </main>
        );
    }

    if (error || !evento) {
        return (
            <main className="min-h-screen py-8 flex items-center justify-center">
                <div className="text-center">
                    <span className="material-symbols-outlined text-4xl text-error">error</span>
                    <p className="text-on-surface-variant mt-4">{error || "Evento no encontrado"}</p>
                    <button onClick={() => navigate("/")} className="mt-4 px-6 py-2 bg-primary text-on-primary rounded-lg">
                        Volver al inicio
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen py-8">
            <TicketSelection
                evento={evento}
                tiposTicket={tiposTicket}
                fechasDisponibles={fechasDisponibles}
                onConfirmarCompra={handleConfirmarCompra}
            />
        </main>
    );
}
