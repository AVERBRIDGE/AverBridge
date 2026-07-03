import { create } from 'zustand'
import type { ChainId } from './walletStore'

export type BridgeState =
  | 'quote'
  | 'locking'
  | 'locked'
  | 'claimable'
  | 'settling'
  | 'completed'
  | 'refunding'
  | 'refunded'

export interface BridgeTransfer {
  id: string
  fromChain: ChainId
  toChain: ChainId
  fromAsset: string
  toAsset: string
  fromAmount: string
  toAmount: string
  fee: string
  feeUsd: string
  etaMinutes: number
  state: BridgeState
  txHashSource?: string
  txHashDest?: string
  claimDeadline?: number // unix ms
  createdAt: number
  updatedAt: number
  usdValue: string
}

interface BridgeStoreState {
  activeBridges: BridgeTransfer[]
  historyBridges: BridgeTransfer[]
  addBridge: (b: BridgeTransfer) => void
  updateBridgeState: (id: string, state: BridgeState, extra?: Partial<BridgeTransfer>) => void
  claimBridge: (id: string) => Promise<void>
  refundBridge: (id: string) => Promise<void>
}

export const useBridgeStore = create<BridgeStoreState>((set, get) => ({
  activeBridges: [],
  historyBridges: [],

  addBridge: (b) =>
    set((s) => ({ activeBridges: [b, ...s.activeBridges] })),

  updateBridgeState: (id, state, extra) =>
    set((s) => {
      const active = s.activeBridges.map((b) =>
        b.id === id ? { ...b, ...extra, state, updatedAt: Date.now() } : b
      )
      const done = state === 'completed' || state === 'refunded'
      if (done) {
        const finished = active.find((b) => b.id === id)
        return {
          activeBridges: active.filter((b) => b.id !== id),
          historyBridges: finished
            ? [finished, ...s.historyBridges]
            : s.historyBridges,
        }
      }
      return { activeBridges: active }
    }),

  claimBridge: async (id) => {
    get().updateBridgeState(id, 'settling')
    await new Promise((r) => setTimeout(r, 1500))
    get().updateBridgeState(id, 'completed', {
      txHashDest: '0xABCDEF1234567890',
    })
  },

  refundBridge: async (id) => {
    get().updateBridgeState(id, 'refunding')
    await new Promise((r) => setTimeout(r, 2000))
    get().updateBridgeState(id, 'refunded')
  },
}))
