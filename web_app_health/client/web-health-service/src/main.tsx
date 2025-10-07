import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import HomePage from './pages/HomePage/HomePage.tsx'
import ExcusePage from './pages/ExcusePage/ExcusePage.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter> {/* 2. Оборачиваем App в BrowserRouter */}
      
      <Routes>
        <Route path='/' element={<App />}/>
        <Route path='/Home' element={<HomePage />} />
        <Route path='/Excuse' element={<ExcusePage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
