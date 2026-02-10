import { createRoot } from 'react-dom/client'
import './index.css'

//import { Home } from './layout/publicLayout.tsx'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PublicLayout } from './layout/publicLayout.tsx'
import { MainPage } from './pages/MainPage.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route element={<PublicLayout />} >
        <Route index element={<MainPage/>} />
      </Route>
    </Routes>
  </BrowserRouter>,
)
