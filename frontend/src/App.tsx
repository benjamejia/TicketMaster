import { Outlet } from "react-router-dom"
import { Header } from "./components/Header"

function App() {

  return (
    <div className="bg-gray-300 h-screen w-full justify-center items-center">
      <div className="w-screen top-0">
        <Header/>
      </div>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

export default App
