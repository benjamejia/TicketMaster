import { EventCard } from "../components/cards/EventCard";
import { MainPopularEventCard } from "../components/cards/MainPopularEventCard";
import caratulaReyLeon from '../assets/Caratula.png';

export function MainPage(){
    return (
        <div className="flex flex-col h-full justify-center items-center w-full min-h-screen min-w-screen">
            <main className="w-screen bg-amber-100">
                <MainPopularEventCard/>
                <EventCard titulo="El rey Leon" srcImg={caratulaReyLeon} fecha="3 Febrero" categoria="+10"/>
            </main>
        </div>
    )
}