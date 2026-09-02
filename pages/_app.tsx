import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import type { AppProps } from 'next/app'
import { AuthProvider } from '../contexts/AuthContext'
import ErrorBoundary from '../components/ErrorBoundary'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  // Create a client for each request in SSR mode
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Don't retry on error
        retry: false,
        // Don't refetch on window focus
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <SessionProvider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ErrorBoundary>
            <Component {...pageProps} />
          </ErrorBoundary>
        </AuthProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
} 