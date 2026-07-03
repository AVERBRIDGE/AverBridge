<div align="center">
  <img src="logo.svg" width="96" height="96" alt="AVERBRIDGE logo" />
  <h1>AVERBRIDGE</h1>
  <p><strong>Multi-chain bridge + native Stellar AMM</strong></p>
  <p>
    Bridge assets from Ethereum, Solana &amp; BNB Chain through Stellar as the settlement hub,<br/>
    then swap tokens and earn yield in on-chain liquidity pools.
  </p>
  <p>
    <img src="https://img.shields.io/badge/network-testnet-38D9C9?style=flat-square&logo=stellar&logoColor=white" alt="testnet"/>
    <img src="https://img.shields.io/badge/status-practice%20mode-7C5CFF?style=flat-square" alt="practice"/>
    <img src="https://img.shields.io/badge/built%20with-React%20%2B%20TypeScript-61DAFB?style=flat-square&logo=react&logoColor=black" alt="react"/>
    <img src="https://img.shields.io/badge/styled%20with-Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="tailwind"/>
  </p>
</div>

---

> AVERBRIDGE is a non-custodial DeFi hub built on Stellar. Bridge assets from Ethereum, Solana, and BNB Chain in seconds, swap tokens on a native AMM, and earn yield by providing liquidity — all with full transparency, automatic refunds on failure, and plain-language guidance at every step.

**Live dev server:** http://localhost:5173 · **Practice mode (testnet) — no real money**

---

## What it does

| Feature | Description |
|---------|-------------|
| **Bridge** | Move ETH, SOL, BNB, USDC, USDT to/from Stellar via HTLC smart-contract locks. Every transfer either completes or auto-refunds — no admin key, no validator set. |
| **Swap** | Trade tokens on Stellar's constant-product AMM (XLM/USDC, XLM/USDT, stablecoin pairs). Live price-impact warning before every confirmation. |
| **Earn** | Add liquidity to pools and earn a share of trading fees. IL explainer shown before first deposit. Real-time P&L tracking in Portfolio. |
| **Simple / Pro mode** | One toggle switches the entire UI from guided plain-language to full data-dense dashboard. Same data, same transactions — just different density. |
| **Practice mode** | Full testnet environment with in-app faucet. Badge in header, zero real-money risk. |

---

## Architecture

```
Ethereum ──┐
Solana   ──┼──► STELLAR (hub) ◄── all AMM pools, LP positions, swap execution
BNB Chain ─┘
```

Hub-and-spoke: every spoke chain bridges to Stellar only. ETH → SOL goes ETH → Stellar → SOL, keeping the security surface to N bridges instead of N². Stellar hosts all liquidity.

---

## Quick start

```bash
# 1. Install
npm install --legacy-peer-deps

# 2. Configure (optional for testnet defaults)
cp .env.example .env.local

# 3. Run
npm run dev
# → http://localhost:5173
```

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Type-check (no emit)
npm run type-check
```

---

## Project structure

```
AVERBRIDGE/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── charts/
│   │   │   └── AreaChart.tsx          # Recharts area chart with "view as table" fallback
│   │   ├── layout/
│   │   │   ├── Header.tsx             # Sticky nav, mode toggle, language toggle, wallet chip
│   │   │   └── Layout.tsx             # Root shell with outlet + status bar
│   │   ├── ui/                        # Design system primitives
│   │   │   ├── AmountField.tsx        # Crypto amount input with USD conversion
│   │   │   ├── Badge.tsx
│   │   │   ├── Banner.tsx             # Info/warning/error/success inline banners
│   │   │   ├── Button.tsx             # Primary · secondary · ghost · danger · gold variants
│   │   │   ├── Card.tsx               # Glassmorphism card surface
│   │   │   ├── CopyableId.tsx         # Address/hash with one-click copy
│   │   │   ├── EmptyState.tsx
│   │   │   ├── Modal.tsx              # Accessible focus-trapped dialog
│   │   │   ├── Skeleton.tsx           # Loading skeletons (no blank spinners)
│   │   │   ├── Toast.tsx              # Context-based toast notifications
│   │   │   └── Tooltip.tsx            # Hover/focus tooltip (all abbreviations)
│   │   ├── ChainRouteVisualizer.tsx   # Hub-and-spoke route diagram
│   │   ├── ErrorBoundary.tsx          # Catches runtime crashes, shows safe fallback
│   │   ├── ImpermanentLossExplainer.tsx # Mandatory IL disclosure before first LP deposit
│   │   ├── ModeToggle.tsx             # Simple ↔ Pro switch
│   │   ├── PoolCard.tsx               # Pool row with APR, TVL, fee tier
│   │   ├── PracticeBadge.tsx          # Testnet indicator badge
│   │   ├── ReceiptCard.tsx            # Post-action receipt with explorer links + export
│   │   ├── StatusBar.tsx              # Persistent "where are my funds" bar during active bridge
│   │   └── WalletChip.tsx             # Per-chain wallet connect/disconnect button
│   ├── i18n/
│   │   ├── index.ts                   # i18next init (synchronous, no Suspense flicker)
│   │   └── locales/
│   │       ├── en.json                # English (primary)
│   │       └── es.json                # Spanish
│   ├── lib/
│   │   ├── chains.ts                  # Chain configs, asset maps, mock USD prices
│   │   └── utils.ts                   # formatUsd · formatCrypto · ilScenario · generateId
│   ├── pages/
│   │   ├── Bridge.tsx                 # Cross-chain transfer: quote → lock → claim → done
│   │   ├── Help.tsx                   # Trust & safety FAQ, contract address disclosure
│   │   ├── History.tsx                # All past actions, CSV export
│   │   ├── Home.tsx                   # Action chooser (Simple) / dashboard (Pro)
│   │   ├── PoolDetail.tsx             # Charts, add/remove liquidity, IL explainer
│   │   ├── Pools.tsx                  # Featured (Simple) / sortable table (Pro)
│   │   ├── Portfolio.tsx              # Active bridges + LP positions with P&L
│   │   ├── Practice.tsx               # Testnet faucet for all supported chains
│   │   └── Swap.tsx                   # Stellar AMM swap with price-impact guard
│   ├── store/
│   │   ├── appStore.ts                # mode · language · network (persisted)
│   │   ├── bridgeStore.ts             # Bridge state machine + transfer history
│   │   ├── poolStore.ts               # Pool data, LP positions, IL explainer flags
│   │   └── walletStore.ts             # Multi-chain wallet connections
│   ├── types/
│   │   └── index.ts                   # Shared TypeScript types and re-exports
│   ├── App.tsx                        # Router, providers, language sync
│   ├── index.css                      # Tailwind + glass-card utilities + constellation bg
│   └── main.tsx                       # Entry: ErrorBoundary → QueryClient → Suspense → App
├── .env.example                       # Environment variable template (copy → .env.local)
├── .eslintrc.cjs
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js                 # AVERBRIDGE design system tokens
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts                     # Path alias (@/) + manual code-splitting chunks
```

---

## Design system

Dark-first. Stellar-native "constellation" identity.

| Token | Value |
|-------|-------|
| Background | `#0A0E17` – `#0D1220` near-black navy |
| Primary accent | `#F5C542` lumen gold — CTAs, APR figures |
| Secondary accent | `#7C5CFF → #38D9C9` violet→cyan gradient — charts, active states |
| Radius | 12–20px on cards |
| Type — UI | Inter (geometric sans) |
| Type — numbers | JetBrains Mono (all prices, addresses, balances) |
| Motion | 150–250ms; fully disabled via `prefers-reduced-motion` |
| Constellation bg | Subtle radial gradients + dot field; decorative only, never behind text |

---

## Accessibility

- WCAG 2.1 AA contrast on all dark/glass surfaces
- Full keyboard navigation with visible focus rings
- `aria-label`, `role`, `aria-live`, `aria-current` on all interactive and dynamic elements
- Every chart has a **"View as table"** toggle — no chart-only data
- `prefers-reduced-motion` disables all CSS and Framer Motion animations

---

## Internationalisation

Zero hard-coded user-facing strings. All copy lives in `src/i18n/locales/`.  
English and Spanish at launch. Language toggle in the header persists to localStorage.  
To add a language: copy `en.json`, translate, add the resource in `src/i18n/index.ts`.

---

## Simple Mode — jargon rules

Simple Mode strictly replaces all DeFi jargon with plain language:

| Never show | Show instead |
|------------|-------------|
| HTLC / hashlock / preimage | "Protected by a smart-contract lock" |
| AMM / constant-product | "Automated pool pricing" |
| Impermanent loss | "Price-change risk" (with scenario explainer) |
| Slippage tolerance | "Max price change you'll accept" |
| LP token | "Your pool share" |
| APR | "Estimated yearly earnings" |
| Testnet | "Practice mode (no real money)" |
| Approve / Sign tx | "Confirm in your wallet" |

Pro Mode shows technical terms with a tooltip explainer on hover.

---

## Bridge security model

Every bridge leg uses an HTLC (hash-time-lock) pattern:

1. Funds locked on source chain with a cryptographic secret + deadline
2. Same value made available on Stellar
3. **Only outcome A:** you reveal the secret and claim on Stellar
4. **Only outcome B:** deadline passes, source-chain funds auto-refund

No admin key, no multisig, no validator quorum can intercept funds. Every locked position either settles or refunds permissionlessly.

---

## Roadmap

| Phase | Status | Description |
|-------|--------|-------------|
| MVP | ✅ Practice | Stellar AMM + Ethereum bridge, full lifecycle UX, Simple/Pro, i18n |
| Phase 2 | Planned | Solana + BNB bridges, stablecoin stable-swap pools, push/email notifications |
| Phase 3 | Planned | Independent smart-contract audits → gated mainnet launch, concentrated liquidity |

> Mainnet will not launch until all bridge and AMM contracts pass an independent security audit with all critical findings resolved. Audit reports will be published in-app on the Help & Trust screen.

---

## Environment variables

See `.env.example` for the full list. Key variables:

```bash
VITE_NETWORK=testnet          # "testnet" | "mainnet"
VITE_STELLAR_RPC_URL=...      # Horizon endpoint
VITE_ETHEREUM_RPC_URL=...     # Infura/Alchemy endpoint
```

All `VITE_*` variables are public (bundled into client JS). Never put private keys or secrets in `.env`.

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | React 18 + TypeScript (strict) |
| Build | Vite 5 with manual chunk splitting |
| Styles | Tailwind CSS 3 — dark-first design tokens |
| Animation | Framer Motion — `prefers-reduced-motion` gated |
| State | Zustand (app/wallet/bridge/pool stores) |
| Server state | TanStack Query v5 |
| Charts | Recharts v3 — with accessible data-table fallback |
| i18n | i18next + react-i18next |
| Icons | lucide-react |
| Routing | React Router v6 |

---

*AVERBRIDGE is a tool, not financial advice. Do your own research before committing real value.*
