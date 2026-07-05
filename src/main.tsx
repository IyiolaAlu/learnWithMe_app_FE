import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import CoursesContext from './context/CoursesContext.tsx'

createRoot(document.getElementById('root')!).render(
  <CoursesContext>
    <BrowserRouter>
      <StrictMode>
        <App />
      </StrictMode>
    </BrowserRouter>
  </CoursesContext>
)
