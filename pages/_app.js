import { SessionProvider } from 'next-auth/react'
import { AuthProvider } from '../contexts/AuthContext'
import '../styles/globals.css'
import Layout from '../components/layout'

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </SessionProvider>
  )
}

export default MyApp