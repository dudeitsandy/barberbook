// pages/client/book/index.js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function BookList() {
  const router = useRouter()
  const [shops, setShops] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchShops()
  }, [])

  const fetchShops = async () => {
    try {
      const response = await fetch('/api/shops')
      if (response.ok) {
        const data = await response.json()
        setShops(data)
      }
    } catch (error) {
      console.error('Error fetching shops:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Available Barbershops
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Choose from our selection of professional barbershops
          </p>
        </div>

        {/* Shop List */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shops.map((shop) => (
            <div 
              key={shop.id} 
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">{shop.name}</h3>
                <p className="mt-2 text-gray-500">{shop.location}</p>
                
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Open Now
                </div>

                <div className="mt-6">
                  <Link
                    href={`/client/book/${shop.id}`}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Book Appointment
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {shops.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No barbershops available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}