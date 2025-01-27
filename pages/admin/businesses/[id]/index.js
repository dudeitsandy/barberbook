// pages/admin/businesses/[id]/index.js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function BusinessDashboard() {
  const router = useRouter()
  const { id } = router.query
  const [business, setBusiness] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchBusiness()
    }
  }, [id])

  const fetchBusiness = async () => {
    try {
      const response = await fetch(`/api/business/${id}`)
      if (response.ok) {
        const data = await response.json()
        setBusiness(data)
      }
    } catch (error) {
      console.error('Error fetching business:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (!business) return <div>Business not found</div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
        <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
          <nav className="space-y-1">
            <Link
              href={`/admin/businesses/${id}/locations`}
              className="group rounded-md px-3 py-2 flex items-center text-sm font-medium text-gray-900 hover:text-gray-900 hover:bg-gray-50"
            >
              Locations
            </Link>
            <Link
              href={`/admin/businesses/${id}/employees`}
              className="group rounded-md px-3 py-2 flex items-center text-sm font-medium text-gray-900 hover:text-gray-900 hover:bg-gray-50"
            >
              Employees
            </Link>
            <Link
              href={`/admin/businesses/${id}/services`}
              className="group rounded-md px-3 py-2 flex items-center text-sm font-medium text-gray-900 hover:text-gray-900 hover:bg-gray-50"
            >
              Services
            </Link>
          </nav>
        </aside>

        <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
          <div className="shadow sm:rounded-md sm:overflow-hidden">
            <div className="bg-white py-6 px-4 sm:p-6">
              <div>
                <h2 className="text-lg leading-6 font-medium text-gray-900">Business Overview</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Quick statistics and information about {business.name}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500">Locations</h3>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {business.locations?.length || 0}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500">Employees</h3>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {business.employees?.length || 0}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500">Services</h3>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {business.services?.length || 0}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500">Total Bookings</h3>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {business.bookings?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}