import { useEffect, useState } from "react";
import { EventCard } from "../../components/cards/EventCard";
import { getAllFunciones, type Funcion } from "../../services/api-service";
import { CATEGORY_IMAGES, HERO_IMAGES } from "../../types/constants";

const PLACEHOLDER_IMAGES = CATEGORY_IMAGES;

function mapFuncionToEvento(funcion: Funcion, categoria: string) {
    return {
        id: String(funcion.id),
        titulo: funcion.nombreFuncion,
        srcImg: PLACEHOLDER_IMAGES[categoria] || PLACEHOLDER_IMAGES["Museo"],
        precio: `$${(funcion.precio || 0).toFixed(2)}`,
        lugar: funcion.nombreEstablecimiento || "Por definir",
        categoria,
    };
}

export function MuseumPage() {
    const [eventos, setEventos] = useState<{ id: string; titulo: string; srcImg: string; precio: string; lugar: string; categoria: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const cargarEventos = async () => {
            try {
                const funciones = await getAllFunciones();
                const museoFunciones = funciones.filter(
                    (f) => f.nombreEstablecimiento?.toLowerCase().includes("museo") ||
                           f.tipoEstablecimiento?.toLowerCase().includes("museo") ||
                           f.nombreFuncion?.toLowerCase().includes("museo")
                );
                const mapped = museoFunciones.map((f) => mapFuncionToEvento(f, "Museo"));
                if (mapped.length > 0) {
                    setEventos(mapped);
                } else {
                    setEventos(funciones.slice(0, 6).map((f) => mapFuncionToEvento(f, "Museo")));
                }
            } catch {
                setError("No se pudieron cargar los eventos");
            } finally {
                setLoading(false);
            }
        };
        cargarEventos();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col w-full min-h-[50vh] items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
                <p className="text-on-surface-variant mt-4">Cargando exposiciones...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col w-full min-h-[50vh] items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-error">error</span>
                <p className="text-on-surface-variant mt-4">{error}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full">
            <section className="relative h-80 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-t from-amber-900/95 via-amber-800/60 to-transparent z-10"></div>
                <img
                    src={HERO_IMAGES["Museo"]}
                    alt="Museo"
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 z-20 px-8 py-12 max-w-screen-2xl mx-auto">
                    <span className="material-symbols-outlined text-white mb-4 text-5xl">museum</span>
                    <h1 className="text-5xl font-black text-white tracking-tighter mb-2">Museos</h1>
                    <p className="text-white/80 text-lg max-w-xl">Explora exposiciones de arte, historia y ciencia. Viaja a través del tiempo y la cultura.</p>
                </div>
            </section>

            <section className="px-8 py-16 max-w-screen-2xl mx-auto w-full">
                <div className="flex items-center gap-4 mb-12">
                    <div className="h-0.5 flex-1 bg-outline-variant/15"></div>
                    <h2 className="text-2xl font-bold text-on-background tracking-tight uppercase px-4">Exposiciones</h2>
                    <div className="h-0.5 flex-1 bg-outline-variant/15"></div>
                </div>

                {eventos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {eventos.map((exp) => (
                            <EventCard
                                key={exp.id}
                                id={exp.id}
                                titulo={exp.titulo}
                                srcImg={exp.srcImg}
                                precio={exp.precio}
                                lugar={exp.lugar}
                                categoria={exp.categoria}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 bg-surface-container-low rounded-3xl border border-outline-variant/20">
                        <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">event_busy</span>
                        <p className="text-on-surface-variant font-medium">No hay exposiciones disponibles por ahora.</p>
                    </div>
                )}
            </section>
        </div>
    );
}
