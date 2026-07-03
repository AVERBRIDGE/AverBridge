import { create } from 'zustand'

export type ChainId = 'stellar' | 'ethereum' | 'solana' | 'bnb'

export interface ChainWallet {
  chainId: ChainId
  address: string
  balances: Record<string, string> // asset → human-readable amount
  connected: boolean
  wrongNetwork: boolean
}

interface WalletState {
  wallets: Record<ChainId, ChainWallet | null>
  connecting: ChainId | null
  connectWallet: (chainId: ChainId) => Promise<void>
  disconnectWallet: (chainId: ChainId) => void
  setBalance: (chainId: ChainId, asset: string, amount: string) => void
  getWallet: (chainId: ChainId) => ChainWallet | null
  isConnected: (chainId: ChainId) => boolean
}

// Simulated connect — in production this calls the actual wallet SDK
async function simulateConnect(chainId: ChainId): Promise<ChainWallet> {
  await new Promise((r) => setTimeout(r, 800))
  const mockAddresses: Record<ChainId, string> = {
    stellar: 'GDQP2KPQGKIHYJGXNUIYOMHARUARCA7DJT5FO2FFOOKY3B2WSQHG4W37',
    ethereum: '0x742d35Cc6634C0532925a3b8D4C9C3A1234ABCD',
    solana: '7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV1',
    bnb: '0x742d35Cc6634C0532925a3b8D4C9C3A1234ABCD',
  }
  const mockBalances: Record<ChainId, Record<string, string>> = {
    stellar: { XLM: '1250.00', USDC: '500.00', USDT: '200.00' },
    ethereum: { ETH: '0.45', USDC: '1000.00', USDT: '500.00' },
    solana: { SOL: '12.5', USDC: '300.00' },
    bnb: { BNB: '2.1', USDC: '150.00', USDT: '100.00' },
  }
  return {
    chainId,
    address: mockAddresses[chainId],
    balances: mockBalances[chainId],
    connected: true,
    wrongNetwork: false,
  }
}

export const useWalletStore = create<WalletState>((set, get) => ({
  wallets: { stellar: null, ethereum: null, solana: null, bnb: null },
  connecting: null,

  connectWallet: async (chainId) => {
    set({ connecting: chainId })
    try {
      const wallet = await simulateConnect(chainId)
      set((s) => ({
        wallets: { ...s.wallets, [chainId]: wallet },
        connecting: null,
      }))
    } catch {
      set({ connecting: null })
    }
  },

  disconnectWallet: (chainId) => {
    set((s) => ({
      wallets: { ...s.wallets, [chainId]: null },
    }))
  },

  setBalance: (chainId, asset, amount) => {
    set((s) => {
      const w = s.wallets[chainId]
      if (!w) return s
      return {
        wallets: {
          ...s.wallets,
          [chainId]: { ...w, balances: { ...w.balances, [asset]: amount } },
        },
      }
    })
  },

  getWallet: (chainId) => get().wallets[chainId],
  isConnected: (chainId) => !!get().wallets[chainId]?.connected,
}))
