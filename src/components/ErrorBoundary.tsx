import React from 'react'

interface State { error: Error | null }

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#0A0E17',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily: 'Inter, sans-serif',
        }}>
          <h1 style={{ color: '#7C5CFF', fontSize: '1.5rem', marginBottom: '1rem' }}>
            AVERBRIDGE
          </h1>
          <p style={{ color: '#9CA3AF', marginBottom: '0.5rem' }}>
            Something went wrong loading the app.
          </p>
          <pre style={{
            background: '#111827',
            border: '1px solid #1E2D45',
            borderRadius: 8,
            padding: '1rem',
            fontSize: '0.75rem',
            color: '#EF4444',
            maxWidth: '600px',
            overflow: 'auto',
          }}>
            {this.state.error.message}
            {'\n'}
            {this.state.error.stack}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1.5rem',
              padding: '0.5rem 1.5rem',
              background: '#7C5CFF',
              border: 'none',
              borderRadius: 8,
              color: '#fff',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
