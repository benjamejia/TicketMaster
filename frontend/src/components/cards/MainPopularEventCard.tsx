import avatarBanner from '../../assets/avatarBanner.jpg'

export function MainPopularEventCard() {
    return (
        <section className="relative px-8 pt-12 pb-24 max-w-screen-2xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-8 z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-tertiary-container text-on-tertiary-container rounded-full text-xs font-bold tracking-widest uppercase">
                        <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                        Destacado de la Semana
                    </div>
                    <h1 className="text-6xl md:text-7xl font-extrabold text-on-background tracking-tighter leading-[0.9]">
                        La Magia del <span className="text-primary italic">Cine</span> Moderno.
                    </h1>
                    <p className="text-on-surface-variant text-lg max-w-md leading-relaxed">
                        Explora las mejores puestas en escena, estrenos cinematográficos y galerías exclusivas en un solo lugar.
                    </p>
                    <div className="p-4 bg-surface-container-low rounded-xl border-l-4 border-primary">
                        <p className="text-sm font-medium text-on-surface flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">info</span>
                            Límite de preventa: Máximo 10 tickets por usuario para garantizar acceso equitativo.
                        </p>
                    </div>
                    
                    {/* Search Module */}
                    <div className="bg-surface-container-highest p-2 rounded-2xl editorial-shadow flex flex-col md:flex-row gap-2">
                        <div className="flex-1 flex items-center px-4 gap-3 bg-surface-container-lowest rounded-xl">
                            <span className="material-symbols-outlined text-outline">search</span>
                            <input className="w-full py-4 bg-transparent border-none focus:ring-0 text-on-surface font-medium placeholder:text-outline-variant outline-none" placeholder="Buscar Teatro, Cine, Museos..." type="text"/>
                        </div>
                        <div className="flex items-center px-4 gap-3 bg-surface-container-lowest rounded-xl min-w-50">
                            <span className="material-symbols-outlined text-outline">location_on</span>
                            <input className="w-full py-4 bg-transparent border-none focus:ring-0 text-on-surface font-medium placeholder:text-outline-variant outline-none" placeholder="Tu ciudad" type="text"/>
                        </div>
                        <button className="bg-primary text-on-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-dim transition-all">Buscar</button>
                    </div>
                </div>
                
                {/* Imagen del evento */}
                <div className="lg:col-span-7 relative h-150 rounded-4xl overflow-hidden group">
                    <img alt="Avatar" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={avatarBanner}/>
                    <div className="absolute inset-0 bg-linear-to-t from-inverse-surface/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-12 left-12 text-white">
                        <span className="text-primary-container font-bold tracking-widest uppercase text-xs mb-2 block">Estreno Cine</span>
                        <h3 className="text-4xl font-bold mb-4">Avatar: The Way of Water</h3>
                        <div className="flex items-center gap-6">
                            <span className="flex items-center gap-2 text-sm"><span className="material-symbols-outlined">calendar_today</span> 15 Oct - 20 Nov</span>
                            <span className="flex items-center gap-2 text-sm"><span className="material-symbols-outlined">location_on</span> IMAX Prime</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}