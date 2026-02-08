import { useState, createContext, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useNavigate } from 'react-router-dom'
import ContextComponent from './components/ContextComponent/ContextComponent.tsx'
import { useAuthSignalR } from './hooks/useAuthSignalR.ts'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from './store/index.ts'
import axios from 'axios'
import { logout, updateProfile } from './store/authSlice.ts'

export const AppContext = createContext(null);

function App() {
  const dispatch = useDispatch();
  const { profile } = useSelector((state: RootState) => state.auth);
  const [key, setKey] = useState(0);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setKey(prev => prev + 1); // Меняем key → перерендер
    navigate('/Auth/Login');
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        // Если нет токена - гарантируем чистый state
        if (profile) {
          dispatch(logout());
        }
        return;
      }

      // Если есть токен, но нет профиля - загружаем профиль
      if (token && !profile) {
        try {
          const response = await axios.get('https://localhost:7073/api/Client/GetClientById', {
            headers: { Authorization: `Bearer ${token}` }
          });
          dispatch(updateProfile(response.data));
        } catch (error) {
          // Если запрос не удался - токен невалидный
          localStorage.removeItem('token');
          dispatch(logout());
        }
      }
    };

    initializeAuth();
  }, [dispatch, profile]);
  useAuthSignalR(handleLogout);

  const handleClick = (str: string) => {
    navigate(`${str}`)
  }

  return (
    <>
      <div key={key}>
        <AppContext.Provider value={{ username, setUsername }}>

          <div>
            <a href="https://vite.dev" target="_blank">
              <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>
          <h1>Vite + React</h1>
          <div className="card">
            <p>
              <button onClick={() => handleClick("Home")}>Go to Home page</button>

            </p>
            <p>
              <button onClick={() => handleClick("Excuse")}>Go to excuses</button>
            </p>
            <input onChange={(event) => setUsername(event.target.value)} />
            <ContextComponent />
          </div>
          <p className="read-the-docs">
            Click on the Vite and React logos to learn more
          </p>
        </AppContext.Provider>
      </div>


    </>
  )
}

export default App
