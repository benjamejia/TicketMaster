import { EventCard } from "../components/cards/EventCard";
import { MainPopularEventCard } from "../components/cards/MainPopularEventCard";
import caratulaReyLeon from '../assets/Caratula.png';

export function MainPage() {
    return (
        <div className="flex flex-col w-full">
            {/* Hero Section */}
            <MainPopularEventCard />

            {/* Category Bento Section */}
            <section className="px-8 py-20 bg-surface-container-low w-full">
                <div className="max-w-screen-2xl mx-auto">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-4xl font-extrabold text-on-background tracking-tight mb-2">Categorías Curadas</h2>
                            <p className="text-on-surface-variant">Seleccionamos lo mejor de la cultura para ti</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-125">
                        {/* Teatro Card */}
                        <div className="relative group rounded-3xl overflow-hidden bg-surface-container-highest flex flex-col justify-end p-8">
                            <div className="absolute inset-0 bg-linear-to-t from-primary/90 to-transparent z-10"></div>
                            <div className="relative z-20">
                                <span className="material-symbols-outlined text-white mb-4 text-4xl">theater_comedy</span>
                                <h3 className="text-3xl font-bold text-white mb-2">Teatro</h3>
                                <p className="text-on-primary/80 mb-6">Dramas, comedias y experimentación.</p>
                                <button className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-6 py-2 rounded-full font-bold hover:bg-white hover:text-primary transition-all">Explorar</button>
                            </div>
                        </div>
                        {/* Cine Card */}
                        <div className="relative group rounded-3xl overflow-hidden bg-surface-container-highest flex flex-col justify-end p-8">
                            <div className="absolute inset-0 bg-linear-to-t from-tertiary/90 to-transparent z-10"></div>
                            <div className="relative z-20">
                                <span className="material-symbols-outlined text-white mb-4 text-4xl">movie</span>
                                <h3 className="text-3xl font-bold text-white mb-2">Cine</h3>
                                <p className="text-on-tertiary/80 mb-6">Estrenos, cine de autor y clásicos.</p>
                                <button className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-6 py-2 rounded-full font-bold hover:bg-white hover:text-tertiary transition-all">Explorar</button>
                            </div>
                        </div>
                        {/* Museo Card */}
                        <div className="relative group rounded-3xl overflow-hidden bg-surface-container-highest flex flex-col justify-end p-8">
                            <div className="absolute inset-0 bg-linear-to-t from-on-surface-variant/90 to-transparent z-10"></div>
                            <div className="relative z-20">
                                <span className="material-symbols-outlined text-white mb-4 text-4xl">museum</span>
                                <h3 className="text-3xl font-bold text-white mb-2">Museo</h3>
                                <p className="text-on-secondary/80 mb-6">Arte, historia y experiencias inmersivas.</p>
                                <button className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-6 py-2 rounded-full font-bold hover:bg-white hover:text-on-background transition-all">Explorar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trending Section */}
            <section className="px-8 py-24 max-w-screen-2xl mx-auto w-full">
                <div className="flex items-center gap-4 mb-16">
                    <div className="h-0.5 flex-1 bg-outline-variant/15"></div>
                    <h2 className="text-3xl font-black text-on-background tracking-tighter uppercase px-4">Tendencias del Mes</h2>
                    <div className="h-0.5 flex-1 bg-outline-variant/15"></div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Renderizamos tu tarjeta del Rey León usando el nuevo diseño de EventCard */}
                    <EventCard 
                        titulo="El Rey León: Soundtrack" 
                        srcImg={caratulaReyLeon} 
                        precio="$45.00" 
                        lugar="Auditorio Nacional" 
                        categoria="Teatro"
                    />
                    
                    {/* Tarjetas de ejemplo para llenar la cuadrícula */}
                    <EventCard titulo="Sombras en Neón" srcImg="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop&q=60" precio="$12.00" categoria="Cine" />
                    <EventCard titulo="Mármol y Tiempo" srcImg="https://images.unsplash.com/photo-1544473244-f6895e69ce8d?w=500&auto=format&fit=crop&q=60" precio="Gratis" lugar="Museo Nacional" categoria="Museo" />
                    <EventCard titulo="Sinfonía de Luces" srcImg="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&auto=format&fit=crop&q=60" precio="$25.00" lugar="Arena Cultural" categoria="Especial" />
                </div>
            </section>
        </div>
    );
}