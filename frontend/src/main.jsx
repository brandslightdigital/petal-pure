import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'
import AppAdmin from '../admin/AppAdmin'
const isAdmin = window.location.pathname.startsWith("/admin");
createRoot(document.getElementById('root')).render(
  <StrictMode>
 {isAdmin ? <AppAdmin /> : <App router={null} />}
  </StrictMode>,
)
