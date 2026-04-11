import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { sepolia } from 'wagmi/chains'
import { QueryClient } from '@tanstack/react-query'

export const projectId = '5d58cdbc92d35e62c0ab83bba6fe9ed3'

const metadata = {
  name: 'CryptoX',
  description: 'Send and receive crypto easily',
  url: 'https://cryptox-app.vercel.app',
  icons: ['https://cryptox-app.vercel.app/logo.png']
}

export const chains = [sepolia]

export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
})

export const queryClient = new QueryClient()

// ✅ Call this immediately when file is imported
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  chains,
  defaultChain: sepolia,
})