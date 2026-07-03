import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type AppMode = 'simple' | 'pro'
export type Language = 'en' | 'es'
export type Network = 'mainnet' | 'testnet'

interface AppState {
  mode: AppMode
  language: Language
  network: Network
  setMode: (mode: AppMode) => void
  setLanguage: (lang: Language) => void
  setNetwork: (net: Network) => void
  toggleMode: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      mode: 'simple',
      language: 'en',
      network: 'testnet',
      setMode: (mode) => set({ mode }),
      setLanguage: (language) => set({ language }),
      setNetwork: (network) => set({ network }),
      toggleMode: () =>
        set({ mode: get().mode === 'simple' ? 'pro' : 'simple' }),
    }),
    { name: 'averbridge-app' }
  )
)
