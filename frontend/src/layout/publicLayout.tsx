import { Outlet, Link } from "react-router-dom";
import { Header } from "../components/Header";

export function PublicLayout(){
    return(
        <div className="min-h-screen flex flex-col bg-background overflow-hidden text-on-background selection:bg-primary-container selection:text-on-primary-container">
            <Header/>
            
            {/* Contenido Principal */}
            <main className="flex-1 pt-20">
                <Outlet/>
            </main>

            {/* Footer */}
            <footer className="w-full relative bg-background dark:bg-inverse-surface py-12 border-t border-outline-variant/15 mb-16 md:mb-0">
                <div className="w-full px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-10 max-w-screen-2xl mx-auto">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <span className="text-2xl font-bold text-[#32294f] dark:text-background tracking-tighter">TicketMaster</span>
                        <p className="font-body text-sm text-on-surface-variant dark:text-outline-variant max-w-xs text-center md:text-left">
                            Tu portal exclusivo para la curaduría de los mejores eventos culturales del país.
                        </p>
                        <div className="flex gap-4 mt-2">
                            <a className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all" href="#">
                                <span className="material-symbols-outlined">share</span>
                            </a>
                            <a className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all" href="#">
                                <span className="material-symbols-outlined">mail</span>
                            </a>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
                        <div className="flex flex-col gap-4">
                            <h5 className="font-bold text-on-background uppercase tracking-widest text-xs">Explorar</h5>
                            <Link className="font-body text-sm text-on-surface-variant hover:text-[#32294f] transition-opacity" to="#">Teatro</Link>
                            <Link className="font-body text-sm text-on-surface-variant hover:text-[#32294f] transition-opacity" to="#">Cine</Link>
                            <Link className="font-body text-sm text-on-surface-variant hover:text-[#32294f] transition-opacity" to="#">Museo</Link>
                        </div>
                    </div>
                </div>
                <div className="w-full text-center py-8 border-t border-outline-variant/10">
                    <span className="font-body text-sm text-on-surface-variant dark:text-outline-variant">© 2026 TicketMaster Platform. Reservados todos los derechos.</span>
                </div>
            </footer>

            {/* BottomNavBar (Mobile Only) */}
            <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-6 py-4 bg-background/90 dark:bg-inverse-surface/90 backdrop-blur-md border-t border-outline-variant/15 shadow-[0_-10px_30px_rgba(16,6,45,0.04)] rounded-t-3xl md:hidden z-50">
                <Link className="flex flex-col items-center justify-center bg-primary-container/20 text-primary dark:text-primary-container rounded-2xl px-4 py-1" to="/">
                    <span className="material-symbols-outlined">explore</span>
                    <span className="font-body text-[10px] uppercase tracking-widest font-bold">Explorar</span>
                </Link>
                <Link className="flex flex-col items-center justify-center text-on-surface-variant dark:text-outline-variant hover:bg-primary-container/10" to="/teatro">
                    <span className="material-symbols-outlined">theater_comedy</span>
                    <span className="font-body text-[10px] uppercase tracking-widest font-bold">Teatro</span>
                </Link>
                <Link className="flex flex-col items-center justify-center text-on-surface-variant dark:text-outline-variant hover:bg-primary-container/10" to="/cine">
                    <span className="material-symbols-outlined">movie</span>
                    <span className="font-body text-[10px] uppercase tracking-widest font-bold">Cine</span>
                </Link>
                <Link className="flex flex-col items-center justify-center text-on-surface-variant dark:text-outline-variant hover:bg-primary-container/10" to="/museos">
                    <span className="material-symbols-outlined">museum</span>
                    <span className="font-body text-[10px] uppercase tracking-widest font-bold">Museo</span>
                </Link>
            </nav>
        </div>
    )
}