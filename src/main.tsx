import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from '@emotion/react'
import { createTheme } from '@mui/material'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={() => createTheme({
    palette: {
      mode: 'dark',
    },
  })}>
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  </ThemeProvider>
)
