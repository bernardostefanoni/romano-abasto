import * as Sentry from '@sentry/react'

const dsn = import.meta.env.VITE_SENTRY_DSN

// Sin VITE_SENTRY_DSN configurado, Sentry queda completamente inactivo:
// el sitio funciona igual que sin esta dependencia.
export const sentryEnabled = Boolean(dsn)

export function initSentry() {
  if (!sentryEnabled) return
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0,
  })
}
