import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronDown, Shield, BookOpen, FileText, HelpCircle, ExternalLink } from 'lucide-react'
import { LogoMark } from '../Logo'

/* ─── Modal shell ────────────────────────────────────────────── */
function FooterModal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  React.useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="footer-modal-title">
          <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-xs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.22 }}
            className="relative glass-card w-full max-w-2xl max-h-[80vh] flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-bg-border">
              <h2 id="footer-modal-title" className="font-semibold text-white text-lg">{title}</h2>
              <button onClick={onClose} aria-label="Close" className="text-gray-500 hover:text-white transition-colors p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-5 space-y-4 text-sm text-gray-300 leading-relaxed">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

/* ─── FAQ content ────────────────────────────────────────────── */
const FAQ_ITEMS = [
  {
    q: 'Is AVERBRIDGE safe to use?',
    a: 'In practice mode (testnet), your funds have zero real-world value — it\'s completely safe to try everything. On mainnet (coming after independent audit), bridge contracts use hash-time-lock (HTLC) smart contracts: your funds are either claimed by you on Stellar, or automatically returned. No admin can take them.',
  },
  {
    q: 'What chains are supported?',
    a: 'Currently: Ethereum, Solana, and BNB Chain, all bridging to and from Stellar. Stellar is the settlement hub — assets are never bridged chain-to-chain directly, which keeps the security surface small.',
  },
  {
    q: 'How does the AMM work?',
    a: 'The AMM uses a constant-product formula (x × y = k) — the same model as Uniswap v2. Traders pay a fee (e.g. 0.3%) which is distributed to liquidity providers in proportion to their pool share.',
  },
  {
    q: 'What is price-change risk (impermanent loss)?',
    a: 'When the prices of two assets in a pool shift, your position may be worth slightly less than if you\'d just held them separately. This is temporary and often offset by fees — but it\'s real. AVERBRIDGE always shows you a plain-language scenario before your first deposit into any pool.',
  },
  {
    q: 'Where are my funds during a bridge transfer?',
    a: 'Locked in a smart contract on the source chain, waiting for you to claim on Stellar. The status bar shows exactly what\'s happening. If the transfer doesn\'t complete within the timelock window, your funds are automatically returned — no manual action required.',
  },
  {
    q: 'How is the APR calculated?',
    a: 'APR is estimated from the last 7 days of actual trading fees, annualised. It changes as trading volume changes. It does not include impermanent loss — you see that separately.',
  },
  {
    q: 'When will mainnet launch?',
    a: 'After all bridge and AMM contracts pass an independent security audit with no critical findings. Audit reports will be published here. Practice mode is fully functional in the meantime.',
  },
  {
    q: 'How do I get practice funds?',
    a: 'Go to the Practice page. Click "Request practice [ASSET]" for any chain — funds appear in your wallet in seconds. They\'re on testnet and have no real value.',
  },
  {
    q: 'Can I use AVERBRIDGE on mobile?',
    a: 'Yes — the app is fully responsive and works on any modern mobile browser. Wallet connections use the same extensions and apps you already have.',
  },
  {
    q: 'What wallets are supported?',
    a: 'Stellar: Freighter. Ethereum / BNB Chain: MetaMask or any WalletConnect-compatible wallet. Solana: Phantom or Solflare. You only need to connect wallets for chains you\'re actually using.',
  },
]

function FaqContent() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="space-y-1">
      {FAQ_ITEMS.map((item, i) => (
        <div key={i} className="border border-bg-border rounded-xl overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-bg-elevated/50 transition-colors"
          >
            <span className="font-medium text-white text-sm">{item.q}</span>
            <ChevronDown className={`w-4 h-4 text-gray-500 shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} aria-hidden />
          </button>
          {open === i && (
            <div className="px-4 pb-4 pt-0 text-gray-400 text-sm leading-relaxed border-t border-bg-border">
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/* ─── Terms content ──────────────────────────────────────────── */
function TermsContent() {
  return (
    <div className="space-y-5 text-gray-300 text-sm leading-relaxed">
      <p className="text-2xs text-gray-500">Last updated: July 2026 · Practice mode only</p>

      {[
        { title: '1. Acceptance', body: 'By accessing AVERBRIDGE you agree to these terms. If you do not agree, do not use the app. These terms apply to the practice (testnet) version only; separate terms will govern mainnet at launch.' },
        { title: '2. Practice mode disclaimer', body: 'All assets in practice mode exist on test networks and have no real-world monetary value. Transactions cannot be reversed once broadcast to the chain, but no real funds are at risk.' },
        { title: '3. Not financial advice', body: 'AVERBRIDGE is a software tool. Nothing on this platform constitutes investment, financial, legal, or tax advice. APR figures are estimates based on recent historical data and are not guarantees of future returns.' },
        { title: '4. Smart-contract risk', body: 'DeFi protocols carry smart-contract risk. AVERBRIDGE\'s contracts will be independently audited before mainnet, but no audit eliminates all risk. Never commit more than you can afford to lose.' },
        { title: '5. Bridge & custody', body: 'Bridge transfers use non-custodial hash-time-lock contracts. AVERBRIDGE does not hold your funds at any point. Bridged assets on Stellar represent claims issued by third-party anchors — see Help & Trust for full issuer disclosure.' },
        { title: '6. Impermanent loss', body: 'Liquidity provision may result in your position being worth less than holding the underlying assets separately. AVERBRIDGE discloses this risk before every deposit and cannot be held liable for price-change losses.' },
        { title: '7. Prohibited use', body: 'You may not use AVERBRIDGE to violate applicable laws, launder proceeds, circumvent sanctions, or engage in market manipulation. Use of AVERBRIDGE from jurisdictions where DeFi is prohibited is at your own risk.' },
        { title: '8. Limitation of liability', body: 'To the maximum extent permitted by law, AVERBRIDGE and its contributors are not liable for any direct, indirect, incidental, or consequential damages arising from your use of the platform.' },
        { title: '9. Changes', body: 'These terms may be updated at any time. Continued use of the app after changes constitutes acceptance of the revised terms.' },
        { title: '10. Contact', body: 'For questions about these terms or the security policy, email: legal@averbridge.example' },
      ].map((s) => (
        <div key={s.title}>
          <h3 className="font-semibold text-white mb-1">{s.title}</h3>
          <p>{s.body}</p>
        </div>
      ))}
    </div>
  )
}

/* ─── Main Footer ────────────────────────────────────────────── */
export function Footer() {
  const navigate = useNavigate()
  const [showFaq, setShowFaq] = useState(false)
  const [showTerms, setShowTerms] = useState(false)

  return (
    <>
      <footer className="border-t border-bg-border bg-bg-surface/40 mt-12 pb-20 sm:pb-4">
        <div className="max-w-7xl mx-auto px-4 pt-8 pb-4">

          {/* Top row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">

            {/* Brand column */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <LogoMark size={28} />
                <span className="font-bold text-white tracking-tight">AVERBRIDGE</span>
              </div>
              <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                Multi-chain bridge and native Stellar AMM. Bridge, swap, and earn yield — all on Stellar.
              </p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-slow" aria-hidden />
                <span className="text-xs text-cyan font-medium">Practice mode — no real money</span>
              </div>
            </div>

            {/* Navigation column */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Navigate</p>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: 'Bridge', path: '/bridge' },
                  { label: 'Swap', path: '/swap' },
                  { label: 'Pools', path: '/pools' },
                  { label: 'Portfolio', path: '/portfolio' },
                  { label: 'History', path: '/history' },
                  { label: 'Practice', path: '/practice' },
                  { label: 'Help & Trust', path: '/help' },
                ].map((link) => (
                  <button
                    key={link.path}
                    onClick={() => navigate(link.path)}
                    className="text-xs text-gray-500 hover:text-white text-left transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Resources column */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Resources</p>
              <div className="space-y-1.5">
                <button onClick={() => setShowFaq(true)} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors">
                  <HelpCircle className="w-3 h-3" aria-hidden />
                  FAQ
                </button>
                <button onClick={() => setShowTerms(true)} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors">
                  <FileText className="w-3 h-3" aria-hidden />
                  Terms of Service
                </button>
                <button onClick={() => navigate('/help')} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors">
                  <Shield className="w-3 h-3" aria-hidden />
                  Security & Trust
                </button>
                <button onClick={() => navigate('/help')} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors">
                  <BookOpen className="w-3 h-3" aria-hidden />
                  How it works
                </button>
                <a
                  href="mailto:security@averbridge.example"
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-3 h-3" aria-hidden />
                  Report a vulnerability
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-bg-border pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <p className="text-2xs text-gray-600 font-mono">
              © 2026 AVERBRIDGE · Testnet · Audit pending
            </p>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowFaq(true)} className="text-2xs text-gray-600 hover:text-gray-400 transition-colors">FAQ</button>
              <span className="text-gray-700 text-2xs">·</span>
              <button onClick={() => setShowTerms(true)} className="text-2xs text-gray-600 hover:text-gray-400 transition-colors">Terms</button>
              <span className="text-gray-700 text-2xs">·</span>
              <button onClick={() => navigate('/help')} className="text-2xs text-gray-600 hover:text-gray-400 transition-colors">Trust</button>
            </div>
          </div>

        </div>
      </footer>

      {/* Modals */}
      <FooterModal open={showFaq} onClose={() => setShowFaq(false)} title="Frequently Asked Questions">
        <FaqContent />
      </FooterModal>

      <FooterModal open={showTerms} onClose={() => setShowTerms(false)} title="Terms of Service">
        <TermsContent />
      </FooterModal>
    </>
  )
}
