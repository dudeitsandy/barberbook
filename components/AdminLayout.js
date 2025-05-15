import Link from 'next/link'
import { useRouter } from 'next/router'

export default function AdminLayout({ children }) {
  const router = useRouter()

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard' },
    { name: 'Services', href: '/admin/services' },
    { name: 'Employees', href: '/admin/employees' },
    { name: 'Bookings', href: '/admin/bookings' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Navigation */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    router.pathname.startsWith(item.href)
                      ? 'border-[#0000FF] text-[#0000FF]'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  )
} 