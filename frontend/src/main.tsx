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
import { CategoryPage } from './pages/CategoryPage.tsx'

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />

        <Route element={<PublicLayout />} >
          <Route index element={<MainPage/>} />
          
          <Route 
            path="/teatro" 
            element={<CategoryPage title="Cartelera de Teatro" description="Descubre los mejores dramas, musicales y comedias en escena." categoryName="Teatro" />} 
          />
          <Route 
              path="/cine" 
              element={<CategoryPage title="Cine y Estrenos" description="Los lanzamientos más esperados y cine de arte en pantalla grande." categoryName="Cine" />} 
          />
          <Route 
              path="/museos" 
              element={<CategoryPage title="Museos y Exposiciones" description="Sumérgete en la historia, el arte y experiencias inmersivas únicas." categoryName="Museo" />} 
          />

          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/ticket" element={<TicketConfirmationPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  </AuthProvider>,
)