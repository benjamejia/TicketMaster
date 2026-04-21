import { createRoot } from 'react-dom/client'
import './index.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { PublicLayout } from './layout/publicLayout.tsx'
import { MainPage } from './pages/MainPage.tsx'
import { LoginPage } from './pages/LoginPage.tsx'
import { RegisterPage } from './pages/RegisterPage.tsx'
import { CheckoutPage } from './pages/CheckoutPage.tsx'
import { TicketConfirmationPage } from './pages/TicketConfirmationPage.tsx'
import { CinePage } from './pages/establecimientos/CinePage.tsx'
import { TeatroPage } from './pages/establecimientos/TeatroPage.tsx'
import { MuseumPage } from './pages/establecimientos/MuseumPage.tsx'
import { EventoDetallePage } from './pages/EventoDetallePage.tsx'
import { ProtectedRoute } from './components/ProtectedRoute.tsx'

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />

        <Route element={<PublicLayout />} >
        <Route index element={<MainPage/>} />
        <Route path="/cineCategory" element={<CinePage />} />
        <Route path="/theaterCategory" element={<TeatroPage />} />
        <Route path="/museumCategory" element={<MuseumPage />} />
        <Route
          path="/checkout"
          element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>}
        />
        
        <Route
          path="/confirmation/:ticketId"
          element={<ProtectedRoute><TicketConfirmationPage /></ProtectedRoute>}
        />
          <Route path="/evento/:id" element={<EventoDetallePage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  </AuthProvider>,
)