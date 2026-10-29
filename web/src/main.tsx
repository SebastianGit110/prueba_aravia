import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import ProyectoAravia from './ProyectoAravia.tsx'

import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <App /> */}
    <ProyectoAravia />
  </StrictMode>,
)
