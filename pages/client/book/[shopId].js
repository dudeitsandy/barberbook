import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function BookingPage() {
  const router = useRouter()
  const { shopId } = router.query
  const [bookingData, setBookingData] = useState({
    service: '',
    date: '',
    time: '',
    name: '',
    email: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...bookingData,
          shopId
        }),
      })

      if (response.ok) {
        router.push('/client/book/confirmation')
      } else {
        alert('Error creating booking. Please try again.')
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error creating booking. Please try again.')
      setIsSubmitting(false)
    }
  }

  const shopName = shopId?.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Rest of your form JSX stays the same */}
      <div className="mt-4 text-center">
        <Link
          href="/landing"
          className="text-sm text-indigo-600 hover:text-indigo-500"
        >
          ← Back to shops
        </Link>
      </div>
    </div>
  )
}