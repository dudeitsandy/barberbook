// components/Layout.js
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useAuth } from '../contexts/AuthContext'

export default function Layout({ children }) {
  const { data: session } = useSession()
  const router = useRouter()
  const { user, business, isLoading, isBusiness } = useAuth()

  // Determine if we're in admin section
  const isAdminPage = router.pathname.startsWith('/admin')
  // Determine if we're in client section
  const isClientPage = router.pathname.startsWith('/client')

  const getBackLink = () => {
    if (isAdminPage) {
      return '/admin/dashboard'
    }
    if (isClientPage) {
      return '/client/appointments'
    }
    return '/'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              {(isAdminPage || isClientPage) && (
                <Link
                  href={getBackLink()}
                  className="inline-flex items-center text-gray-600 hover:text-[#0000FF]"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  {isAdminPage ? 'Back to Dashboard' : 'Back to Home'}
                </Link>
              )}
              <Link href="/" className="flex-shrink-0 flex items-center space-x-2">
                <Image
                  src="/images/logo-white.jpg"
                  alt="TAG Logo"
                  width={40}
                  height={40}
                  priority
                />
                <span className="text-xl font-bold text-[#0000FF]">TAG</span>
              </Link>
            </div>

            {/* Add user info if logged in */}
            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">
                  {isBusiness ? business?.name : `Welcome, ${user.name}`}
                </span>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}