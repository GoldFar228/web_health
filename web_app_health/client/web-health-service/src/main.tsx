import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/Home/HomePage/HomePage.tsx'
import ExcusePage from './pages/ExcusePage/ExcusePage.tsx'
import AuthorizePage from './pages/AuthorizePage/AuthorizePage.tsx'
import ProfilePage from './pages/ProfilePage/ProfilePage.tsx'
import { PrivateRoute } from './components/PrivateRoute/PrivateRoute.tsx'
import HeaderComponent from './components/HeaderComponent/HeaderComponent.tsx'
import { Provider } from 'react-redux'
import { store } from './store/index.ts'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter> {/* 2. Оборачиваем App в BrowserRouter */}
        <HeaderComponent />
        <Routes>
          <Route path='/' element={<App />} />
          <Route path='/Home' element={<HomePage />} />
          <Route path='/Trainings' element={<HomePage />} />
          <Route path='/Diets' element={<HomePage />} />
          <Route path='/Auth/*' element={<AuthorizePage />} />
          <Route path='/Profile' element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          } />
          <Route path='/Excuse' element={<ExcusePage />} />
          <Route path='*' element={<h1>Page not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </Provider>

  </StrictMode>,
)
