import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n'; // Import i18n configuration
import './index.css' // Import Tailwind CSS
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
