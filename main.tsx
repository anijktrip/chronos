import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/* Hash routing keeps the prototype working on any static host or sub-path with no server rewrites. */}
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)
