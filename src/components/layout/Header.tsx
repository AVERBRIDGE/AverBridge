import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X, Globe } from 'lucide-react'
import { ModeToggle } from '../ModeToggle'
import { WalletChip } from '../WalletChip'
import { PracticeBadge } from '../PracticeBadge'
import { LogoFull } from '../Logo'
import { useAppStore } from '@/store/appStore'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { key: 'nav.bridge', path: '/bridge' },
  { key: 'nav.swap', path: '/swap' },
  { key: 'nav.pools', path: '/pools' },
  { key: 'nav.portfolio', path: '/portfolio' },
  { key: 'nav.history', path: '/history' },
]

export function Header() {
  const { t, i18n } = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { language, setLanguage } = useAppStore()

  function toggleLang() {
    const next = language === 'en' ? 'es' : 'en'
    setLanguage(next)
    i18n.changeLanguage(next)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-bg-border bg-bg-base/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4 h-14">
          {/* Logo */}
          <NavLink to="/" className="flex items-center shrink-0" aria-label="AVERBRIDGE home">
            <LogoFull height={30} />
          </NavLink>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 ml-2" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'px-3 py-1.5 rounded-lg text-sm transition-colors',
                    isActive
                      ? 'text-white bg-violet/15 font-medium'
                      : 'text-gray-400 hover:text-white hover:bg-bg-elevated'
                  )
                }
              >
                {t(item.key)}
              </NavLink>
            ))}
          </nav>

          <div className="flex-1" />

          {/* Right side controls */}
          <div className="hidden md:flex items-center gap-2">
            <PracticeBadge />
            <ModeToggle compact />
            <button
              onClick={toggleLang}
              aria-label={`Switch language to ${language === 'en' ? 'Spanish' : 'English'}`}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-bg-elevated transition-colors"
            >
              <Globe className="w-4 h-4" />
            </button>
            <WalletChip chainId="stellar" compact />
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-bg-border bg-bg-base">
          <nav className="flex flex-col p-4 gap-1" aria-label="Mobile navigation">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'px-4 py-2.5 rounded-xl text-sm transition-colors',
                    isActive
                      ? 'text-white bg-violet/15 font-medium'
                      : 'text-gray-400 hover:text-white hover:bg-bg-elevated'
                  )
                }
              >
                {t(item.key)}
              </NavLink>
            ))}
            <div className="pt-3 border-t border-bg-border flex flex-wrap items-center gap-2">
              <PracticeBadge />
              <ModeToggle />
              <WalletChip chainId="stellar" />
              <button
                onClick={toggleLang}
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded-lg"
              >
                <Globe className="w-4 h-4" />
                {language === 'en' ? 'ES' : 'EN'}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
