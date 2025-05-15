// pages/admin/services/index.js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AdminLayout from '../../../components/AdminLayout'
import { useAuth } from '../../../contexts/AuthContext'

export default function ServiceManagement() {
  const [services, setServices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()
  const { business, isLoading: authLoading } = useAuth()

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/business/services')
      if (response.ok) {
        const data = await response.json()
        setServices(data)
      } else {
        throw new Error('Failed to fetch services')
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDuration = (minutes) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60)
      const mins = minutes % 60
      return `${hours}h${mins ? ` ${mins}m` : ''}`
    }
    return `${minutes}m`
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  if (authLoading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  if (error) return <div className="text-red-500">Error: {error}</div>

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Services for {business?.name}</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all your services including their duration, price, and availability.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              href="/admin/services/new"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-[#0000FF] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              Add Service
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <div className="shadow-sm ring-1 ring-black ring-opacity-5">
                <table className="min-w-full border-separate" style={{ borderSpacing: 0 }}>
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8">
                        Service Name
                      </th>
                      <th scope="col" className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell">
                        Duration
                      </th>
                      <th scope="col" className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell">
                        Price
                      </th>
                      <th scope="col" className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {services.map((service, serviceIdx) => (
                      <tr key={service.id}>
                        <td className="whitespace-nowrap border-b border-gray-200 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                          {service.name}
                        </td>
                        <td className="whitespace-nowrap border-b border-gray-200 px-3 py-4 text-sm text-gray-500 hidden sm:table-cell">
                          {formatDuration(service.duration)}
                        </td>
                        <td className="whitespace-nowrap border-b border-gray-200 px-3 py-4 text-sm text-gray-500 hidden lg:table-cell">
                          {formatPrice(service.price)}
                        </td>
                        <td className="whitespace-nowrap border-b border-gray-200 px-3 py-4 text-sm text-gray-500">
                          <Link
                            href={`/admin/services/${service.id}/edit`}
                            className="text-[#0000FF] hover:text-blue-700"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}