import { QueueForm } from '@/components/QueueForm'
import { useState } from 'react'

export default function BookingPage() {
  const [bookingType, setBookingType] = useState<'appointment' | 'queue'>('appointment')
  
  return (
    <div>
      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setBookingType('appointment')}
            className={`px-4 py-2 rounded ${
              bookingType === 'appointment' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200'
            }`}
          >
            Schedule Appointment
          </button>
          <button
            onClick={() => setBookingType('queue')}
            className={`px-4 py-2 rounded ${
              bookingType === 'queue' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200'
            }`}
          >
            Join Queue
          </button>
        </div>
      </div>

      {bookingType === 'appointment' ? (
        <BookingForm /> // Your existing booking form
      ) : (
        <QueueForm locationId={shopId} />
      )}
    </div>
  )
} 