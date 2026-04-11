// ✅ Import config BEFORE anything else
import './config/web3modal'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'
import { QueryClientProvider } from '@tanstack/react-query'
import { config, queryClient } from './config/web3modal'
import DetailsProvider from './Context/DetailsContext'
import ErrorBoundary from './Components/ErrorBoundary'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ErrorBoundary>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DetailsProvider>
            <App />
          </DetailsProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ErrorBoundary>
  </BrowserRouter>
)