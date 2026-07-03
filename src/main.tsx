import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import './i18n'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 2,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<div style={{background:'#0A0E17',minHeight:'100vh'}} />}>
          <App />
        </Suspense>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
)
