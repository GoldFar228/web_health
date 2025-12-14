import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import HomePage from './pages/HomePage/HomePage.tsx'
import ExcusePage from './pages/ExcusePage/ExcusePage.tsx'
import AuthorizePage from './pages/AuthorizePage/AuthorizePage.tsx'
import ProfilePage from './pages/ProfilePage/ProfilePage.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter> {/* 2. Оборачиваем App в BrowserRouter */}
      
      <Routes>
        <Route path='/' element={<App />}/>
        <Route path='/Home' element={<HomePage />} />
        <Route path='/Trainings' element={<HomePage />} />
        <Route path='/Diets' element={<HomePage />} />
        <Route path='/Auth/*' element={<AuthorizePage />} />
        <Route path='/Profile' element={<ProfilePage />} />
        <Route path='/Excuse' element={<ExcusePage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
