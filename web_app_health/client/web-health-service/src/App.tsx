import { useState, createContext } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useNavigate } from 'react-router-dom'
import ContextComponent from './components/ContextComponent/ContextComponent.tsx'

export const AppContext = createContext(null);

function App() {
  const [count, setCount] = useState(0);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const handleClick = (str: string) => {
    navigate(`${str}`)
  }

  return (
    <>
      <AppContext.Provider value={{username, setUsername}}>
        
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
          <input onChange={(event) => setUsername(event.target.value)}/>
          <ContextComponent />
        </div>
        <p className="read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </AppContext.Provider>

    </>
  )
}

export default App
