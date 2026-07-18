import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import App from './App.jsx'
import { initSentry } from './lib/sentry.js'
import './index.css'

initSentry()

function ErrorFallback() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <p className="text-4xl">😕</p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-charcoal">
        Algo salió mal
      </h1>
      <p className="mt-2 text-sm text-charcoal/60">
        Recargá la página o volvé a intentar en un momento.
      </p>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Sentry.ErrorBoundary>
  </React.StrictMode>
)
