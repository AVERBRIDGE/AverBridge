import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Layout } from '@/components/layout/Layout'
import { ToastProvider } from '@/components/ui/Toast'
import { useAppStore } from '@/store/appStore'
import { Home } from '@/pages/Home'
import { Bridge } from '@/pages/Bridge'
import { Swap } from '@/pages/Swap'
import { Pools } from '@/pages/Pools'
import { PoolDetail } from '@/pages/PoolDetail'
import { Portfolio } from '@/pages/Portfolio'
import { History } from '@/pages/History'
import { Practice } from '@/pages/Practice'
import { Help } from '@/pages/Help'

export default function App() {
  const { language } = useAppStore()
  const { i18n } = useTranslation()

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language, i18n])

  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="bridge" element={<Bridge />} />
            <Route path="swap" element={<Swap />} />
            <Route path="pools" element={<Pools />} />
            <Route path="pools/:id" element={<PoolDetail />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="history" element={<History />} />
            <Route path="practice" element={<Practice />} />
            <Route path="help" element={<Help />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}
