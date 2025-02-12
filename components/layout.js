// components/Layout.js
import Image from 'next/image'
import Link from 'next/link'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
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
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}