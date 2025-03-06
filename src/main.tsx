import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App';



const root = createRoot(document.getElementById('root') as HTMLElement) 

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
