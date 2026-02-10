import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";

export function PublicLayout(){
    return(
        <div className="min-h-screen flex flex-col bg-slate-50 overflow-hidden">
            <div className="w-screen top-0">
                <Header/>
            </div>
            <Outlet/>
            <footer className="p-6 bg-gray-800 text-white text-center">
                © 2026 TicketMaster Project
            </footer>
        </div>
    )
}