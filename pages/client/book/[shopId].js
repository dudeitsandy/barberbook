// pages/client/book/[shopId].js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function BookingPage() {
  const router = useRouter()
  const { shopId } = router.query
  const [shop, setShop] = useState(null)
  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: ''
  })

  useEffect(() => {
    if (shopId) {
      fetchShopDetails()
    }
  }, [shopId])

  const fetchShopDetails = async () => {
    try {
      const response = await fetch(`/api/shops/${shopId}`)
      if (response.ok) {
        const data = await response.json()
        setShop(data)
        setServices(data.services || [])
      }
    } catch (error) {
      console.error('Error fetching shop details:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDuration = (minutes) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60)
      const remainingMinutes = minutes % 60
      return `${hours}h${remainingMinutes ? ` ${remainingMinutes}min` : ''}`
    }
    return `${minutes}min`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shopId,
          serviceId: selectedService,
          date: selectedDate,
          time: selectedTime,
          ...bookingData
        }),
      })

      if (response.ok) {
        router.push('/client/book/confirmation')
      } else {
        throw new Error('Booking failed')
      }
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('Failed to create booking. Please try again.')
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!shop) {
    return <div className="text-center py-12">Shop not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{shop.name}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Service
                </label>
                <div className="space-y-3">
                  {[
                    { id: 'kids-seniors', name: 'Kids & Seniors Cut', duration: 30, price: 30 },
                    { id: 'smp-hairline', name: 'SMP Hair Line or Crown', duration: 180, price: 1500 },
                    { id: 'adult-teen', name: 'Adult and Teen Cuts', duration: 30, price: 40 },
                    { id: 'adult-full', name: 'Adult Cut Full Service', duration: 40, price: 50 },
                    { id: 'smp-consult', name: 'SMP Consultation', duration: 30, price: 100 }
                  ].map((service) => (
                    <div key={service.id} className="relative flex items-center">
                      <input
                        type="radio"
                        id={service.id}
                        name="service"
                        value={service.id}
                        checked={selectedService === service.id}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="h-4 w-4 text-[#0000FF] border-gray-300 focus:ring-[#0000FF]"
                      />
                      <label htmlFor={service.id} className="ml-3 flex flex-1 justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{service.name}</p>
                          <p className="text-sm text-gray-500">{formatDuration(service.duration)}</p>
                        </div>
                        <span className="text-sm font-medium text-gray-900">${service.price}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0000FF] focus:border-[#0000FF]"
                  required
                />
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Time
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#0000FF] focus:border-[#0000FF] rounded-md"
                  required
                >
                  <option value="">Choose a time</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                </select>
              </div>

              {/* Customer Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={bookingData.name}
                    onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0000FF] focus:border-[#0000FF]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={bookingData.email}
                    onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0000FF] focus:border-[#0000FF]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={bookingData.phone}
                    onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#0000FF] focus:border-[#0000FF]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0000FF] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0000FF]"
                >
                  Book Appointment
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/client/book"
            className="text-sm text-[#0000FF] hover:text-blue-700"
          >
            ← Back to shops
          </Link>
        </div>
      </div>
    </div>
  )
}