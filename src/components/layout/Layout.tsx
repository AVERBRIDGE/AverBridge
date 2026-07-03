import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { StatusBar } from '../StatusBar'
import { StatsBar } from '../StatsBar'
import { XlmTicker } from '../XlmTicker'

export function Layout() {
  return (
    <div className="min-h-screen bg-bg-base constellation-bg flex flex-col">
      <Header />
      <StatsBar />
      <StatusBar />
      <main id="main-content" className="flex-1 relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>
      <Footer />
      {/* Fixed bottom-left live XLM price ticker */}
      <XlmTicker />
    </div>
  )
}
