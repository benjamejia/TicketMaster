import { Link } from 'react-router-dom';
import caratulaReyLeon from '../assets/avatarBanner.jpg';

export function TicketConfirmationPage() {
    return (
        <div className="py-12 px-6 max-w-5xl mx-auto w-full">
            {/* Success Message */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-container text-primary mb-6 animate-bounce">
                    <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
                <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-3">¡Compra Confirmada!</h1>
                <p className="text-on-surface-variant text-lg max-w-md mx-auto font-body">
                    Tu acceso para la experiencia cultural ha sido reservado con éxito. Prepárate para algo inolvidable.
                </p>
            </div>

            {/* Digital Ticket Layout */}
            <div className="relative max-w-4xl mx-auto">
                <div className="ticket-shadow flex flex-col md:flex-row rounded-3xl overflow-hidden bg-surface-container-lowest">
                    
                    {/* Ticket Left: Visual & Event Info */}
                    <div className="relative w-full md:w-2/3 min-h-100">
                        <img alt="El Rey León" className="absolute inset-0 w-full h-full object-cover" src={caratulaReyLeon} />
                        <div className="absolute inset-0 bg-linear-to-t from-inverse-surface via-inverse-surface/40 to-transparent"></div>
                        
                        <div className="absolute bottom-0 left-0 p-10 w-full">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 rounded-full bg-tertiary text-on-tertiary text-xs font-bold tracking-widest uppercase font-body">Teatro</span>
                                <span className="text-primary-container font-semibold text-sm font-body">#EC-2024-8842</span>
                            </div>
                            <h2 className="font-headline text-4xl md:text-5xl font-black text-white mb-2 leading-tight">
                                Avatar: The Way of Water
                            </h2>
                            <div className="flex flex-wrap items-center gap-6 text-on-primary/90 mt-4 font-body">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary-container">calendar_today</span>
                                    <span className="text-sm font-medium">3 de Febrero, 2026</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary-container">schedule</span>
                                    <span className="text-sm font-medium">20:00 hrs</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ticket Right: QR & Details */}
                    <div className="w-full md:w-1/3 p-8 border-l-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-between bg-white relative">
                        {/* Perforation Circles (Visuals) */}
                        <div className="hidden md:block absolute -top-4 -left-4 w-8 h-8 rounded-full bg-background"></div>
                        <div className="hidden md:block absolute -bottom-4 -left-4 w-8 h-8 rounded-full bg-background"></div>
                        
                        <div className="w-full text-center">
                            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant mb-6 font-body">Acceso Digital</p>
                            
                            <div className="p-4 bg-surface-container-low rounded-2xl mb-6 inline-block">
                                {/* Placeholder QR */}
                                <div className="w-32 h-32 bg-on-background rounded-lg flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#faf4ff 2px, transparent 2px)', backgroundSize: '8px 8px' }}></div>
                                    <span className="material-symbols-outlined text-6xl text-white">qr_code_2</span>
                                </div>
                            </div>

                            <div className="space-y-4 text-left border-t border-surface-variant pt-6 font-body">
                                <div className="flex justify-between">
                                    <span className="text-xs text-on-surface-variant font-medium">Asientos</span>
                                    <span className="text-xs text-on-surface font-bold">VIP: 12, 13</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-on-surface-variant font-medium">Cantidad</span>
                                    <span className="text-xs text-on-surface font-bold">2 Entradas</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-xs text-on-surface-variant font-medium">Total Pago</span>
                                    <span className="text-xs text-primary font-bold">$90.00 USD</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full mt-8">
                            <div className="text-center bg-primary/5 py-3 rounded-xl font-body">
                                <p className="text-[10px] text-primary font-bold uppercase tracking-wider">Entrada Permitida</p>
                                <p className="text-sm font-bold text-on-surface">19:15 hrs</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Information Grid */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-1 md:col-span-2 p-8 rounded-3xl bg-surface-container-low">
                        <h3 className="font-headline text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">location_on</span>
                            Información del Recinto
                        </h3>
                        <div className="flex flex-col md:flex-row gap-8 font-body">
                            <div className="flex-1">
                                <p className="text-sm font-bold text-on-surface">Auditorio Telmex</p>
                                <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
                                    Obreros de Cananea 747, Complejo Belenes. Estacionamiento disponible.
                                </p>
                            </div>
                            <div className="w-full md:w-32 h-24 rounded-2xl overflow-hidden bg-surface-container-high flex items-center justify-center">
                                <span className="material-symbols-outlined text-outline text-4xl">map</span>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1 p-8 rounded-3xl bg-surface-container-highest">
                        <h3 className="font-headline text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-tertiary">info</span>
                            Información Útil
                        </h3>
                        <ul className="space-y-3 font-body">
                            <li className="flex items-start gap-2">
                                <span className="material-symbols-outlined text-xs mt-1 text-on-surface-variant">check_small</span>
                                <span className="text-xs text-on-surface-variant font-medium">Apto para todas las edades</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="material-symbols-outlined text-xs mt-1 text-on-surface-variant">block</span>
                                <span className="text-xs text-on-surface-variant font-medium">Prohibido fotos con flash</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-12 font-body">
                <button className="w-full md:w-auto px-8 py-4 bg-primary text-on-primary rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-primary-dim transition-all shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined">download</span>
                    Descargar Ticket PDF
                </button>
                <Link to="/" className="w-full md:w-auto px-8 py-4 bg-surface-container-highest text-on-surface rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-outline-variant hover:text-white transition-all">
                    <span className="material-symbols-outlined">home</span>
                    Volver al Inicio
                </Link>
            </div>
        </div>
    );
}