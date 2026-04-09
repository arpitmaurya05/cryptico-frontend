import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import DetailsProvider from './Context/DetailsContext'
import { BrowserRouter } from 'react-router-dom'
import ErrorBoundary from './Components/ErrorBoundary' // ✅ add this


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
   <ErrorBoundary>
    <DetailsProvider>
      <App />
    </DetailsProvider>
    </ErrorBoundary>
  </BrowserRouter>
)