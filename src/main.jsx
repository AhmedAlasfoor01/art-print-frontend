import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router'
import { createRoot } from 'react-dom/client'
import { UserProvider } from './compnents/contexts/Contexts.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <UserProvider>
    <App />
    </UserProvider>
    </BrowserRouter>
  </StrictMode>
)
