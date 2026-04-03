import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import DetailsProvider from './Context/DetailsContext'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <DetailsProvider>
      <App />
    </DetailsProvider>
  </BrowserRouter>
)